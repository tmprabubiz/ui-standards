import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import {
    buildIndex,
    buildProfileIndex,
    CODE_RE,
    field,
    INDEX_PATH,
    listMarkdown,
    parseEntries,
    PROFILE_INDEXES,
    read, REF_DIR, relPath,
    ROOT,
    SKILL_DIR,
} from './lib.mjs';

const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);

const REQUIRED_FIELDS = ['**Purpose:**', '**Triggers:**', '**Applies when:**', '**Required**',
  '**Composes:**', '**Conditional**', '**Suggest**', '**Approval**', '**Acceptance**', '**Source:**'];
const WALKTHROUGH_DIMENSIONS = [
  'Visual', 'States', 'Data', 'Interactions', 'Associated elements', 'Responsive',
  'Accessibility', 'Navigation', 'First run', 'Risk & approval',
];

// SKILL.md frontmatter (Agent Skills spec)
const skillPath = join(SKILL_DIR, 'SKILL.md');
const skill = read(skillPath);
const fm = skill.match(/^---\n([\s\S]*?)\n---\n/);
let skillFrontmatter;
if (!fm) err('SKILL.md', 'missing YAML frontmatter on line 1');
else {
  try {
    skillFrontmatter = parse(fm[1]);
  } catch (error) {
    err('SKILL.md', `invalid YAML frontmatter: ${error.message}`);
  }
  if (skillFrontmatter !== undefined) {
    if (!skillFrontmatter || typeof skillFrontmatter !== 'object' || Array.isArray(skillFrontmatter)) {
      err('SKILL.md', 'frontmatter must be a YAML mapping');
    } else {
      if (skillFrontmatter.name !== 'ui-standards') {
        err('SKILL.md', `name must be "ui-standards" (got "${skillFrontmatter.name}")`);
      }
      const desc = skillFrontmatter.description;
      if (typeof desc !== 'string' || !desc.trim()) err('SKILL.md', 'description missing');
      else {
        if (desc.length > 1024) err('SKILL.md', `description is ${desc.length} chars (max 1024)`);
        if (!/\b(?:use when|asks?)\b/i.test(desc)) err('SKILL.md', 'description must include invocation phrasing');
      }
      const allowed = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
      for (const key of Object.keys(skillFrontmatter)) {
        if (!allowed.has(key)) err('SKILL.md', `frontmatter key "${key}" is outside the Agent Skills spec`);
      }
      if (!skillFrontmatter.metadata || typeof skillFrontmatter.metadata !== 'object' || Array.isArray(skillFrontmatter.metadata)) {
        err('SKILL.md', 'metadata must be a YAML mapping');
      } else {
        for (const [key, value] of Object.entries(skillFrontmatter.metadata)) {
          if (typeof value !== 'string') err('SKILL.md', `metadata.${key} must be a string`);
        }
        const latestVersion = read(join(ROOT, 'CHANGELOG.md')).match(/^##\s+(\d+\.\d+\.\d+)\b/m)?.[1];
        if (typeof skillFrontmatter.metadata.version !== 'string') err('SKILL.md', 'metadata.version must be a string');
        else if (latestVersion && skillFrontmatter.metadata.version !== latestVersion) {
          err('SKILL.md', `metadata.version ${skillFrontmatter.metadata.version} does not match latest CHANGELOG version ${latestVersion}`);
        }
      }
      for (const key of ['license', 'compatibility', 'allowed-tools']) {
        if (Object.hasOwn(skillFrontmatter, key) && typeof skillFrontmatter[key] !== 'string') {
          err('SKILL.md', `${key} must be a string`);
        }
      }
    }
  }
}
if (skill.split('\n').length > 150) err('SKILL.md', 'over 150 lines (budget in docs/BLUEPRINT.md)');

const coreCardPath = join(SKILL_DIR, 'references', 'CORE-CARD.md');
if (!existsSync(coreCardPath)) err('CORE-CARD.md', 'missing compact owner-first baseline');
else if (Buffer.byteLength(read(coreCardPath), 'utf8') > 2048) err('CORE-CARD.md', 'over 2 KB');

// Entries
const entries = parseEntries();
const codes = new Map();
for (const e of entries) {
  if (e.missingFile) { err(e.file, 'family file missing'); continue; }
  const where = `${e.file}:${e.line}`;
  if (!e.code) { err(where, `heading not in "## CODE · Title" form: ${e.heading}`); continue; }
  if (!e.code.startsWith(`${e.family}-`)) err(where, `${e.code} does not belong in ${e.file} (${e.family})`);
  if (codes.has(e.code)) err(where, `duplicate code ${e.code} (also ${codes.get(e.code)})`);
  codes.set(e.code, where);

  const text = e.body.join('\n');
  for (const f of REQUIRED_FIELDS) if (!text.includes(f)) err(where, `${e.code} missing ${f}`);
  const composes = field(e.body, 'Composes');
  if (composes === null || !composes.trim()) err(where, `${e.code} has empty Composes (write None. when there are no dependencies)`);
  const contract = e.code.startsWith('FE-') ? '**Backend contract**' : '**Frontend contract**';
  if (!text.includes(contract)) err(where, `${e.code} missing ${contract}`);

  const req = e.body.filter((l) => /^- R\d+\s/.test(l)).length;
  if (req < 1 || req > 7) err(where, `${e.code} has ${req} Required items (allowed 1–7)`);

  for (const l of e.body.filter((x) => /^- C\d+\s/.test(x))) {
    if (!/\bIF\b.*\bTHEN\b/.test(l)) err(where, `${e.code} conditional not in "IF … THEN …" form: ${l}`);
  }

  const acc = e.body.filter((l) => /^- \[[ x]\] /.test(l));
  if (acc.length < 3) err(where, `${e.code} has ${acc.length} acceptance items (need ≥ 3)`);
  for (const l of acc) {
    if (!/Given\b.*\bwhen\b.*\bthen\b/i.test(l)) err(where, `${e.code} acceptance not "Given…, when…, then…": ${l}`);
  }

  if (!field(e.body, 'Triggers')?.length) err(where, `${e.code} has empty Triggers`);
}

// Cross-references across the whole skill
for (const file of listMarkdown(SKILL_DIR)) {
  if (file === INDEX_PATH) continue;
  const lines = read(file).split('\n');
  lines.forEach((l, i) => {
    for (const ref of l.match(CODE_RE) ?? []) {
      if (!codes.has(ref)) err(`${relPath(file)}:${i + 1}`, `reference to unknown code ${ref}`);
    }
  });
}

// Generated index
const expected = buildIndex(entries);
if (!existsSync(INDEX_PATH)) err('INDEX.md', 'missing — run node scripts/build-index.mjs');
else if (read(INDEX_PATH) !== expected) err('INDEX.md', 'out of date — run node scripts/build-index.mjs');

for (const profile of Object.keys(PROFILE_INDEXES)) {
  const path = join(SKILL_DIR, 'references', 'indexes', `${profile}.md`);
  const profileExpected = buildProfileIndex(entries, profile);
  if (!existsSync(path)) err(relPath(path), 'missing — run node scripts/build-index.mjs');
  else if (read(path) !== profileExpected) err(relPath(path), 'out of date — run node scripts/build-index.mjs');
}

for (const required of ['ADVISOR.md', 'PROFILES.md', 'CAPABILITIES.md', 'BUILD-ENVIRONMENTS.md']) {
  if (!existsSync(join(SKILL_DIR, 'references', required))) {
    err(required, 'required context-first discovery reference is missing');
  }
}

const walkthroughPath = join(REF_DIR, 'templates', 'SLICE-WALKTHROUGH.md');
if (!existsSync(walkthroughPath)) err('SLICE-WALKTHROUGH.md', 'missing screen contract template');
else {
  const walkthrough = read(walkthroughPath);
  for (const dimension of WALKTHROUGH_DIMENSIONS) {
    if (!walkthrough.includes(`| ${dimension} |`)) err('SLICE-WALKTHROUGH.md', `missing ${dimension} dimension`);
  }
}
const coverageTemplate = read(join(REF_DIR, 'templates', 'COVERAGE.md'));
const catalogueVersion = skillFrontmatter?.metadata?.version;
if (typeof catalogueVersion === 'string' && !coverageTemplate.includes(`Catalogue version: ${catalogueVersion}`)) {
  err('templates/COVERAGE.md', `catalogue version does not match SKILL.md (${catalogueVersion})`);
}

// Size budgets (docs/BLUEPRINT.md § Loading model)
const BUDGETS = { 'CORE.md': 250, 'INDEX.md': 250, 'PROCESS.md': 250, 'CORE-CARD.md': 80 };
for (const file of listMarkdown(join(SKILL_DIR, 'references'))) {
  const n = read(file).split('\n').length;
  const name = relPath(file).split('/').pop();
  const limit = BUDGETS[name] ?? 400;
  if (n > limit) err(relPath(file), `${n} lines (budget ${limit})`);
}

for (const e of errors) console.error(`error ${e}`);
console.log(`\n${codes.size} entries · ${errors.length} errors`);
process.exitCode = errors.length ? 1 : 0;

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
    buildIndex,
    buildProfileIndex,
    CODE_RE,
    field,
    INDEX_PATH,
    listMarkdown,
    parseEntries,
    PROFILE_INDEXES,
    read, relPath,
    SKILL_DIR,
} from './lib.mjs';

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);

const REQUIRED_FIELDS = ['**Purpose:**', '**Triggers:**', '**Applies when:**', '**Required**',
  '**Conditional**', '**Suggest**', '**Approval**', '**Acceptance**', '**Source:**'];

// SKILL.md frontmatter (Agent Skills spec)
const skillPath = join(SKILL_DIR, 'SKILL.md');
const skill = read(skillPath);
const fm = skill.match(/^---\n([\s\S]*?)\n---\n/);
if (!fm) err('SKILL.md', 'missing YAML frontmatter on line 1');
else {
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  const desc = fm[1].match(/^description:\s*(.+)$/m)?.[1].trim();
  if (name !== 'ui-standards') err('SKILL.md', `name must be "ui-standards" (got "${name}")`);
  if (!desc) err('SKILL.md', 'description missing');
  else if (desc.length > 1024) err('SKILL.md', `description is ${desc.length} chars (max 1024)`);
  const allowed = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
  for (const key of fm[1].matchAll(/^([a-z][\w-]*):/gm)) {
    if (!allowed.has(key[1])) err('SKILL.md', `frontmatter key "${key[1]}" is outside the Agent Skills spec`);
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

// Size budgets (docs/BLUEPRINT.md § Loading model)
const BUDGETS = { 'CORE.md': 250, 'INDEX.md': 250, 'PROCESS.md': 250, 'CORE-CARD.md': 80 };
for (const file of listMarkdown(join(SKILL_DIR, 'references'))) {
  const n = read(file).split('\n').length;
  const name = relPath(file).split('/').pop();
  const limit = BUDGETS[name] ?? 400;
  if (n > limit) err(relPath(file), `${n} lines (budget ${limit})`);
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(`\n${codes.size} entries · ${errors.length} errors · ${warnings.length} warnings`);
process.exitCode = errors.length ? 1 : 0;

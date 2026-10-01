import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildIndex, buildProfileIndex, INDEX_PATH, parseEntries, PROFILE_INDEXES, relPath, ROOT } from './lib.mjs';

const entries = parseEntries();
writeFileSync(INDEX_PATH, buildIndex(entries));
console.log(`Wrote ${relPath(INDEX_PATH)}`);
const profileDir = join(ROOT, 'skill', 'ui-standards', 'references', 'indexes');
mkdirSync(profileDir, { recursive: true });
for (const profile of Object.keys(PROFILE_INDEXES)) {
	const path = join(profileDir, `${profile}.md`);
	writeFileSync(path, buildProfileIndex(entries, profile));
	console.log(`Wrote ${relPath(path)}`);
}

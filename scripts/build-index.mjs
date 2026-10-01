import { writeFileSync } from 'node:fs';
import { buildIndex, INDEX_PATH, parseEntries, relPath } from './lib.mjs';

writeFileSync(INDEX_PATH, buildIndex(parseEntries()));
console.log(`Wrote ${relPath(INDEX_PATH)}`);

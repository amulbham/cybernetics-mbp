// Authoring helper only: regenerate SHA256SUMS for the runtime files (hashed after CRLF -> LF).
// The seal and the owner never run this; they verify the COMMITTED SHA256SUMS (`node test-kit.mjs` does).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { HERE, sha256, sha256Lf } from './kit-common.mjs';

const files = ['kit-common.mjs', 'verify-upload-dir.mjs', 'anonymous-denial-check.mjs', 'verify-hosted-preview.mjs', 'pins.json'];
const text = files.map((f) => `${sha256Lf(readFileSync(join(HERE, f)))}  ${f}\n`).join('');
writeFileSync(join(HERE, 'SHA256SUMS'), text);
console.log(`SHA256SUMS written; digest ${sha256(Buffer.from(text))}`);

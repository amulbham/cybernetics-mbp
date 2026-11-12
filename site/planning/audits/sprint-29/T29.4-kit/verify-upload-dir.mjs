// T29.4 — verify a local upload directory against the pinned inventory before any `wrangler` command.
// Usage: node verify-upload-dir.mjs <dir> [--inventory <tsv>] [--pins <json>] [--expect-digest <hex>] [--pdfs <n>]
// Exit 0 = the directory is exactly the pinned tree; 1 = any difference. Reads files only.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { arg, byPath, inventoryDigest, loadPins, readInventory, sha256, walkFiles, HERE } from './kit-common.mjs';
import { join } from 'node:path';

const argv = process.argv.slice(2);
const dir = argv.find((a, i) => !a.startsWith('--') && (i === 0 || !argv[i - 1].startsWith('--')));
if (!dir) {
	console.error('usage: node verify-upload-dir.mjs <dir> [--inventory <tsv>] [--pins <json>] [--expect-digest <hex>] [--pdfs <n>]');
	process.exit(2);
}
const pins = loadPins(arg(argv, '--pins', join(HERE, 'pins.json')));
const inventory = readInventory(resolve(arg(argv, '--inventory') ?? join(HERE, pins.inventory.file)));
const expectDigest = arg(argv, '--expect-digest', pins.inventory.digest);
const expectPdfs = Number(arg(argv, '--pdfs', String((pins.historical?.length ?? 0) + (pins.candidate ? 1 : 0))));
const problems = [];

const root = resolve(dir);
let files;
try {
	files = walkFiles(root);
} catch (err) {
	console.error(`verify-upload-dir: ${err.message}`);
	process.exit(1);
}
const have = new Map(files.map((f) => [f.path, f]));
const want = new Map(inventory.map((r) => [r.path, r]));
for (const r of inventory) if (!have.has(r.path)) problems.push(`missing: ${r.path}`);
for (const f of files) if (!want.has(f.path)) problems.push(`unexpected file: ${f.path}`);
const observed = [];
for (const r of inventory) {
	const f = have.get(r.path);
	if (!f) continue;
	const bytes = readFileSync(f.abs);
	const hash = sha256(bytes);
	if (bytes.length !== r.bytes) problems.push(`size differs: ${r.path} ${bytes.length} != ${r.bytes}`);
	if (hash !== r.sha256) problems.push(`sha256 differs: ${r.path}`);
	observed.push({ path: r.path, bytes: bytes.length, sha256: hash });
}
const pdfs = files.filter((f) => /\.pdf$/i.test(f.path));
if (pdfs.length !== expectPdfs) problems.push(`expected exactly ${expectPdfs} PDF files, found ${pdfs.length}`);
// The pinned PDFs by role, independent of the TSV: six historical pairs plus the candidate.
for (const row of [...(pins.historical ?? []), ...(pins.candidate ? [{ path: pins.candidate.pdfPath, sha256: pins.candidate.sha256 }] : [])]) {
	const f = have.get(row.path);
	if (!f) problems.push(`pinned PDF missing: ${row.path}`);
	else if (sha256(readFileSync(f.abs)) !== row.sha256) problems.push(`pinned PDF differs: ${row.path}`);
}
const digest = inventoryDigest(observed.length === inventory.length ? observed : inventory);
if (digest !== expectDigest) problems.push(`directory digest ${digest} != ${expectDigest}`);

console.log(`verify-upload-dir: ${files.length} files, ${pdfs.length} PDFs, digest ${digest}`);
if (problems.length) {
	for (const p of problems.slice(0, 20)) console.log(`  FAIL ${p}`);
	console.log(`verify-upload-dir: FAILED (${problems.length}) — do not upload`);
	process.exit(1);
}
console.log('verify-upload-dir: PASS — the directory is exactly the pinned tree');

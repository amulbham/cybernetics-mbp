// T29.4 (staging) — verify a local upload directory against its inventory before the owner runs `wrangler`.
// Usage: node verify-upload-dir.mjs <dir> [--inventory <tsv>] [--pins <json>]
// Exit 0 = the directory is exactly the pinned tree; 1 = any difference; 2 = modified kit or bad usage.
// The owner compares the printed directory digest with the digest in the GO by eye. Reads files only.
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { HERE, arg, inventoryDigest, loadPins, readInventory, requireKitIntegrity, sha256, walkFiles } from './kit-common.mjs';

requireKitIntegrity('verify-upload-dir');
const argv = process.argv.slice(2);
const dir = argv.find((a, i) => !a.startsWith('--') && (i === 0 || !['--inventory', '--pins'].includes(argv[i - 1])));
if (!dir) {
	console.error('usage: node verify-upload-dir.mjs <dir> [--inventory <tsv>] [--pins <json>]');
	process.exit(2);
}
const pins = loadPins(resolve(arg(argv, '--pins') ?? join(HERE, 'pins.json')));
const inventory = readInventory(resolve(arg(argv, '--inventory') ?? join(HERE, pins.inventory.file)));
const problems = [];
let files;
try {
	files = walkFiles(resolve(dir));
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
	if (bytes.length !== r.bytes) problems.push(`size differs: ${r.path}`);
	if (hash !== r.sha256) problems.push(`sha256 differs: ${r.path}`);
	observed.push({ path: r.path, bytes: bytes.length, sha256: hash });
}
const pdfs = files.filter((f) => /\.pdf$/i.test(f.path));
const expectPdfs = pins.historical.length + 1;
if (pdfs.length !== expectPdfs) problems.push(`expected exactly ${expectPdfs} PDF files, found ${pdfs.length}`);
for (const row of [...pins.historical, { path: pins.candidate.pdfPath, sha256: pins.candidate.sha256 }]) {
	const f = have.get(row.path);
	if (!f) problems.push(`pinned PDF missing: ${row.path}`);
	else if (sha256(readFileSync(f.abs)) !== row.sha256) problems.push(`pinned PDF differs: ${row.path}`);
}
const route = have.get(`${pins.route.slice(1)}index.html`);
if (!route || sha256(readFileSync(route.abs)) !== pins.candidate.routeHtmlSha256) problems.push('article page differs from the pinned route HTML hash');
const redirects = have.get('_redirects');
if (!redirects || sha256(readFileSync(redirects.abs)) !== pins.redirectsSha256) problems.push('_redirects differs from the pinned redirects hash');
if (!have.has('pagefind/pagefind-entry.json')) problems.push('the Pagefind search index is missing');
const digest = inventoryDigest(observed.length === inventory.length ? observed : inventory);
if (digest !== pins.inventory.digest) problems.push(`directory digest ${digest} != ${pins.inventory.digest}`);
console.log(`verify-upload-dir: ${files.length} files, ${pdfs.length} PDFs, directory digest ${digest}`);
console.log(`verify-upload-dir: expected digest ${pins.inventory.digest} — compare it with the digest in the GO`);
if (problems.length) {
	for (const p of problems.slice(0, 20)) console.log(`  FAIL ${p}`);
	console.log(`verify-upload-dir: FAILED (${problems.length}) — do not upload`);
	process.exit(1);
}
console.log('verify-upload-dir: PASS — the directory is exactly the pinned staging tree');

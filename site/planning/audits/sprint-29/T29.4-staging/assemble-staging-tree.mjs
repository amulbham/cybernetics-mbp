// T29.4 (staging) — assemble the exact 187-file upload tree from private inputs, with NO renderer and no network.
// Inputs (private, never in Git): the corrected candidate Astro `html/` tree and candidate PDF from the T29.3a review set,
// the six historical PDFs at their baseline paths, and the lockfile-pinned Pagefind binary.
// Steps: copy `html/`; place the candidate PDF at the path its page links to and the six historical PDFs; copy the pinned
// `_redirects` reference; run Pagefind over the tree (deterministic: two runs were byte-identical); then require the result to
// equal the pinned inventory (count, every hash, directory digest). A mismatch deletes nothing and exits 1.
// Usage: node assemble-staging-tree.mjs --html <candidate/html> --candidate-pdf <pdf> --legacy <dir with the six PDFs at research/...>
//          --pagefind <node_modules/.bin/pagefind> --out <NEW directory>
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { HERE, arg, inventoryDigest, loadPins, readInventory, requireKitIntegrity, sha256, walkFiles } from './kit-common.mjs';

requireKitIntegrity('assemble-staging-tree');
const argv = process.argv.slice(2);
const pins = loadPins();
const need = ['--html', '--candidate-pdf', '--legacy', '--pagefind', '--out'].filter((o) => !arg(argv, o));
if (need.length) { console.error(`missing ${need.join(', ')}`); process.exit(2); }
const out = resolve(arg(argv, '--out'));
if (existsSync(out)) { console.error(`${out} already exists; supply a new directory`); process.exit(2); }
const pdfOk = (path, hash) => existsSync(path) && sha256(readFileSync(path)) === hash;
const candidatePdf = resolve(arg(argv, '--candidate-pdf'));
if (!pdfOk(candidatePdf, pins.candidate.sha256)) { console.error('the candidate PDF differs from the pin'); process.exit(1); }
for (const h of pins.historical) if (!pdfOk(join(resolve(arg(argv, '--legacy')), h.path), h.sha256)) { console.error(`historical PDF differs or is missing: ${h.path}`); process.exit(1); }
mkdirSync(out, { recursive: true });
cpSync(resolve(arg(argv, '--html')), out, { recursive: true });
mkdirSync(dirname(join(out, pins.candidate.pdfPath)), { recursive: true });
cpSync(candidatePdf, join(out, pins.candidate.pdfPath));
for (const h of pins.historical) { mkdirSync(dirname(join(out, h.path)), { recursive: true }); cpSync(join(resolve(arg(argv, '--legacy')), h.path), join(out, h.path)); }
cpSync(join(HERE, pins.redirectsFile), join(out, '_redirects'));
const run = spawnSync(resolve(arg(argv, '--pagefind')), ['--site', out], { encoding: 'utf8' });
if (run.status !== 0) { console.error(`pagefind failed: ${run.stderr}`); process.exit(1); }
const inventory = readInventory(join(HERE, pins.inventory.file));
const files = walkFiles(out);
const observed = files.map((f) => ({ path: f.path, bytes: f.bytes, sha256: sha256(readFileSync(f.abs)) }));
const digest = inventoryDigest(observed);
const want = new Map(inventory.map((r) => [r.path, r.sha256]));
const diffs = observed.filter((o) => want.get(o.path) !== o.sha256).map((o) => o.path).concat(inventory.filter((r) => !observed.some((o) => o.path === r.path)).map((r) => `missing ${r.path}`));
console.log(`assemble-staging-tree: ${files.length} files, directory digest ${digest}`);
if (digest !== pins.inventory.digest || files.length !== pins.inventory.files || diffs.length) {
	for (const d of diffs.slice(0, 15)) console.log(`  DIFF ${d}`);
	console.log(`assemble-staging-tree: the assembled tree does not equal the pinned inventory (expected ${pins.inventory.digest}); ${out} was left for inspection — do not upload`);
	process.exit(1);
}
console.log('assemble-staging-tree: PASS — the tree equals the pinned inventory');

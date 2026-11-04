#!/usr/bin/env node
// T28.8a — independent six-PDF production upload guard.
//
// Runs in the SAME GitHub Actions job that uploads production, after
// `carry-over-pdfs.sh carry` and immediately before `npm run deploy:pages`
// (see .github/workflows/deploy-pages.yml). Production must never upload any PDF set
// other than the six owner-approved files.
//
// Why this exists: `carry-over-pdfs.sh carry` verifies the final PDFs against whatever
// `PDF_MANIFEST` value the workflow hands it, and its own shape rule accepts five or six
// lines. Nothing pinned the owner-approved six-row baseline independently of that variable,
// so a wrong, shortened or substituted manifest variable would be carried and uploaded
// consistently. This guard compares BOTH the effective runtime manifest AND the actual
// deployable files with scripts/fixtures/approved-six-production-pdfs.sha256, a reviewed
// file that is never derived from PDF_MANIFEST, dist/, release-pdfs/expected.txt or a
// network read.
//
// It fails closed (exit 1, with a GitHub `::error::` annotation) unless ALL hold:
//   1. the pinned baseline file is exactly six well-formed, distinct path/hash pairs;
//   2. PDF_CARRY_OVER is exactly "true";
//   3. PDF_RELEASE is unset or empty (any value, including "new-version", is refused — a
//      regeneration release cannot reach the production upload through this guard);
//   4. the effective PDF_MANIFEST is exactly the baseline's six pairs (order-insensitive;
//      blank lines and CR are ignored exactly as carry-over-pdfs.sh ignores them; missing,
//      extra, duplicated, malformed or substituted lines all fail);
//   5. dist/ contains exactly the six baseline PDF paths and no other *.pdf (any case) file
//      and no symlink anywhere; each is a regular file that starts with "%PDF-" and whose
//      SHA-256 equals the baseline.
//
// There is no bypass flag, environment switch or skip mode. `--baseline` and `--dist` exist
// only so scripts/test-guard-production-six-pdfs.mjs can aim it at disposable artifacts;
// the workflow passes neither. Imports node: built-ins only.

import { createHash } from 'node:crypto';
import { closeSync, lstatSync, openSync, readFileSync, readSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const arg = (name, fallback) => {
	const i = argv.indexOf(name);
	return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const BASELINE = resolve(arg('--baseline', join(HERE, 'fixtures', 'approved-six-production-pdfs.sha256')));
const DIST = resolve(arg('--dist', join(HERE, '..', 'dist')));

const LINE = /^([0-9a-f]{64}) {2}(research\/[a-z0-9_./-]+\.pdf)$/;
const REQUIRED = 6;

const problems = [];
const bad = (message) => problems.push(message);

function parsePairs(label, text) {
	const pairs = new Map(); // path -> hash
	const hashes = new Set();
	const lines = text
		.split('\n')
		.map((l) => l.replace(/\r$/, ''))
		.filter((l) => l.trim() !== '');
	let ok = true;
	for (const line of lines) {
		const m = LINE.exec(line);
		if (!m) {
			bad(`${label}: malformed line ${JSON.stringify(line.slice(0, 120))}`);
			ok = false;
			continue;
		}
		if (pairs.has(m[2])) {
			bad(`${label}: path listed twice: ${m[2]}`);
			ok = false;
		}
		if (hashes.has(m[1])) {
			bad(`${label}: hash listed twice: ${m[1]}`);
			ok = false;
		}
		pairs.set(m[2], m[1]);
		hashes.add(m[1]);
	}
	if (lines.length !== REQUIRED) {
		bad(`${label}: ${lines.length} non-blank line(s), exactly ${REQUIRED} required`);
		ok = false;
	}
	return { pairs, ok };
}

// ---- 1. the pinned baseline --------------------------------------------------
let baselineText = '';
try {
	baselineText = readFileSync(BASELINE, 'utf8');
} catch (err) {
	bad(`pinned baseline unreadable at ${BASELINE}: ${err.message}`);
}
const baseline = parsePairs('pinned baseline', baselineText);

// ---- 2 + 3. release controls ------------------------------------------------------
const carry = process.env.PDF_CARRY_OVER;
if (carry !== 'true') bad(`PDF_CARRY_OVER is ${JSON.stringify(carry ?? '')}, must be exactly "true"`);
const release = process.env.PDF_RELEASE;
if (release !== undefined && release !== '') bad(`PDF_RELEASE is ${JSON.stringify(release)}; production upload requires it to be unset/empty (no regeneration release passes this guard)`);

// ---- 4. the effective manifest equals the pinned baseline -----------------------------
const manifestText = process.env.PDF_MANIFEST ?? '';
if (manifestText.trim() === '') bad('PDF_MANIFEST is empty or unset');
const manifest = parsePairs('PDF_MANIFEST', manifestText);
if (baseline.ok && manifest.ok) {
	for (const [path, hash] of baseline.pairs) {
		if (!manifest.pairs.has(path)) bad(`PDF_MANIFEST is missing approved path ${path}`);
		else if (manifest.pairs.get(path) !== hash) bad(`PDF_MANIFEST hash for ${path} is ${manifest.pairs.get(path)}, approved ${hash}`);
	}
	for (const path of manifest.pairs.keys()) if (!baseline.pairs.has(path)) bad(`PDF_MANIFEST names unapproved path ${path}`);
}

// ---- 5. the actual deployable files -----------------------------------------------
const found = []; // [relative path, absolute path]
function walk(dir) {
	let entries;
	try {
		entries = readdirSync(dir, { withFileTypes: true });
	} catch (err) {
		bad(`dist unreadable at ${dir}: ${err.message}`);
		return;
	}
	for (const entry of entries) {
		const abs = join(dir, entry.name);
		const rel = relative(DIST, abs).split(sep).join('/');
		if (entry.isSymbolicLink()) {
			bad(`symlink in dist: ${rel}`);
			continue;
		}
		if (entry.isDirectory()) walk(abs);
		else if (/\.pdf$/i.test(entry.name)) found.push([rel, abs]);
	}
}
try {
	if (!lstatSync(DIST).isDirectory()) bad(`dist is not a directory: ${DIST}`);
	else walk(DIST);
} catch (err) {
	bad(`dist not found at ${DIST}: ${err.message}`);
}

if (baseline.ok) {
	const foundPaths = new Set(found.map(([rel]) => rel));
	for (const path of baseline.pairs.keys()) if (!foundPaths.has(path)) bad(`approved PDF missing from dist: ${path}`);
	for (const [rel, abs] of found) {
		const want = baseline.pairs.get(rel);
		if (want === undefined) {
			bad(`unapproved extra PDF in dist: ${rel}`);
			continue;
		}
		let st;
		try {
			st = lstatSync(abs);
		} catch (err) {
			bad(`cannot stat ${rel}: ${err.message}`);
			continue;
		}
		if (!st.isFile()) {
			bad(`${rel} is not a regular file`);
			continue;
		}
		const head = Buffer.alloc(5);
		const fd = openSync(abs, 'r');
		try {
			readSync(fd, head, 0, 5, 0);
		} finally {
			closeSync(fd);
		}
		if (head.toString('latin1') !== '%PDF-') bad(`${rel} does not start with %PDF-`);
		const got = createHash('sha256').update(readFileSync(abs)).digest('hex');
		if (got !== want) bad(`${rel} sha256 ${got} != approved ${want}`);
	}
	if (found.length !== REQUIRED) bad(`dist holds ${found.length} PDF file(s), exactly ${REQUIRED} required`);
}

// ---- verdict -------------------------------------------------------------------------
if (problems.length > 0) {
	const summary = `production six-PDF guard FAILED (${problems.length}): ${problems[0]}`;
	console.error(`guard-production-six-pdfs: ${problems.length} problem(s) — nothing may be uploaded:`);
	for (const p of problems) console.error(`  - ${p}`);
	console.error(`::error title=guard-production-six-pdfs::${summary.replace(/[\r\n]+/g, ' ')}`);
	process.exit(1);
}
console.log(`guard-production-six-pdfs: PDF_MANIFEST equals the pinned six approved pairs; dist holds exactly those ${REQUIRED} PDFs with matching SHA-256; PDF_CARRY_OVER=true; no release override. Upload may proceed.`);

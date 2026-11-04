#!/usr/bin/env node
// T28.8a — synthetic adversarial and workflow-wiring tests for the production six-PDF guard.
//
//   node scripts/test-guard-production-six-pdfs.mjs
//   REAL_PDF_DIR=<dir of the six production PDFs at their research/... paths> node scripts/test-guard-production-six-pdfs.mjs
//
// Everything runs on disposable temporary artifacts: synthetic PDFs, a throw-away baseline file
// and in-memory copies of the workflow. It never touches the real six PDFs (REAL_PDF_DIR, when
// given, is only read and copied), repository variables or the network, and it never runs the
// workflow. Two groups:
//   * guard behaviour — the guard is executed as a child process exactly as the workflow runs it;
//   * workflow wiring — .github/workflows/deploy-pages.yml is parsed (js-yaml, a production
//     dependency of astro) and checked structurally, then mutated in memory to prove the same
//     checks fail when the guard is removed, conditioned away, reordered or made non-fatal.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, '..');
const REPO = resolve(SITE, '..');
const GUARD = join(HERE, 'guard-production-six-pdfs.mjs');
const FIXTURE = join(HERE, 'fixtures', 'approved-six-production-pdfs.sha256');
const WORKFLOW = join(REPO, '.github', 'workflows', 'deploy-pages.yml');
const require = createRequire(join(SITE, 'package.json'));
const yaml = require('js-yaml');

// A SECOND, human-reviewed copy of the approved six pairs (T28.0 baseline audit, cross-checked with
// the sealed T27.3 ticket and with the six live production PDFs hashed on 2026-11-03T23:21Z). Its
// only job is to catch a typo or tampering in the pinned fixture file; the guard never reads it.
const SIX = [
	['4b4e3b618e32a479a140d9cac4c180c18c3f57c9861a2df4999229772a6e0ab4', 'research/cybernetics/the-invariants-of-self-organizing-systems/the-invariants-of-self-organizing-systems.pdf'],
	['e86bd3005402badc647046096f71968bdfbb248efa017d467e2d769e2df1c21e', 'research/cybernetics/three-self-organizing-systems/three-self-organizing-systems.pdf'],
	['d8ec32df31da35dd2e8efa6eda2aeb1d75cde70bd7e3a2a35a90cb93bf4df54f', 'research/essays/an-engineers-guide-to-structural-financial-aid-exploits/an-engineers-guide-to-structural-financial-aid-exploits.pdf'],
	['1f68d9eec9a0d8412a7fefc4d2c42b17f340801fbbef438b671edbffaf4582f3', 'research/knowledge-work/the-chisel-fallacy-what-pangram-actually-measures/the-chisel-fallacy-what-pangram-actually-measures.pdf'],
	['268d16c0f29d6ba4c0e8299ff30a816fe44d62591206e434ae277d080b40cfd9', 'research/knowledge-work/the-desk-is-where-you-write-it-down/the-desk-is-where-you-write-it-down.pdf'],
	['fe64b3026988a72056fea22ec081d24880cb9ca88e8f6c77a1a8941df69f7ac7', 'research/cybernetics/cognition-as-self-organizing-system/cognition-as-self-organizing-system.pdf'],
];
const sixText = SIX.map(([h, p]) => `${h}  ${p}`).join('\n') + '\n';

const work = mkdtempSync(join(tmpdir(), 'guard6-'));
process.on('exit', () => rmSync(work, { recursive: true, force: true }));
let seq = 0;
const results = [];
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
function record(id, name, expected, actual, extra = '') {
	results.push({ id, name, expected, actual, ok: expected === actual, extra });
}

// ---- guard harness ----------------------------------------------------------
// Synthetic artifacts: six small "PDFs" with their own hashes, a matching synthetic baseline.
function makeSynthetic() {
	const root = join(work, `s${++seq}`);
	const dist = join(root, 'dist');
	const files = SIX.map(([, p], i) => ({ path: p, bytes: Buffer.from(`%PDF-1.7\nsynthetic ${seq} document ${i}\n%%EOF\n`) }));
	for (const f of files) {
		mkdirSync(dirname(join(dist, f.path)), { recursive: true });
		writeFileSync(join(dist, f.path), f.bytes);
	}
	const lines = files.map((f) => `${sha(f.bytes)}  ${f.path}`);
	const baseline = join(root, 'baseline.sha256');
	writeFileSync(baseline, lines.join('\n') + '\n');
	return { root, dist, baseline, files, lines };
}
const GOOD = { PDF_CARRY_OVER: 'true' };
function runGuard({ baseline, dist, manifest, env = {} }) {
	const e = { PATH: process.env.PATH, ...GOOD, ...(manifest === undefined ? {} : { PDF_MANIFEST: manifest }), ...env };
	for (const k of Object.keys(e)) if (e[k] === undefined) delete e[k];
	const a = [GUARD, '--dist', dist];
	if (baseline) a.push('--baseline', baseline);
	const r = spawnSync(process.execPath, a, { encoding: 'utf8', env: e });
	return { rc: r.status, out: (r.stdout ?? '') + (r.stderr ?? '') };
}
// expect 'PASS' (rc 0) or 'FAIL' (rc 1 with the ::error annotation and a nothing-uploaded message)
function check(id, name, expected, run, symptom) {
	const failed = run.rc !== 0;
	let actual = failed ? 'FAIL' : 'PASS';
	let extra = '';
	if (expected === 'FAIL' && failed) {
		if (run.rc !== 1 || !/::error title=guard-production-six-pdfs::/.test(run.out) || !/nothing may be uploaded/.test(run.out)) actual = 'FAIL(unannotated)';
		else if (symptom && !new RegExp(symptom).test(run.out)) {
			actual = 'FAIL(wrong reason)';
			extra = `expected /${symptom}/`;
		}
	}
	if (expected === 'PASS' && !failed && !/Upload may proceed/.test(run.out)) actual = 'PASS(no verdict line)';
	record(id, name, expected, actual, extra);
}
const withS = (fn) => {
	const s = makeSynthetic();
	return fn(s) ?? s;
};

// ---- A. valid configurations must PASS ----------------------------------------------
{
	const s = makeSynthetic();
	check('A01', 'valid: manifest = the six pinned pairs, carry on, no release, exactly six PDFs', 'PASS', runGuard({ ...s, manifest: s.lines.join('\n') }));
	check('A02', 'valid: manifest with a trailing newline', 'PASS', runGuard({ ...s, manifest: s.lines.join('\n') + '\n' }));
	check('A03', 'valid: reordered manifest lines', 'PASS', runGuard({ ...s, manifest: [...s.lines].reverse().join('\n') }));
	check('A04', 'valid: CRLF line endings and blank lines (as carry-over-pdfs.sh tolerates)', 'PASS', runGuard({ ...s, manifest: '\r\n\r\n' + s.lines.join('\r\n') + '\r\n\r\n' }));
	check('A05', 'valid: PDF_RELEASE explicitly empty', 'PASS', runGuard({ ...s, manifest: s.lines.join('\n'), env: { PDF_RELEASE: '' } }));
	check('A06', 'valid: unrelated files (html, css) in dist are ignored', 'PASS', (() => { writeFileSync(join(s.dist, 'index.html'), '<html></html>'); mkdirSync(join(s.dist, '_astro'), { recursive: true }); writeFileSync(join(s.dist, '_astro', 'a.css'), 'x'); return runGuard({ ...s, manifest: s.lines.join('\n') }); })());
}

// ---- B. wrong manifests must FAIL ------------------------------------------------------
{
	const m = (mut, sym, id, name) => {
		const s = makeSynthetic();
		check(id, name, 'FAIL', runGuard({ ...s, manifest: mut(s.lines, s) }), sym);
	};
	m((l) => l.slice(1).join('\n'), 'PDF_MANIFEST', 'B01', 'manifest missing one approved line');
	m((l) => [...l, `${'a'.repeat(64)}  research/essays/seventh/seventh.pdf`].join('\n'), 'PDF_MANIFEST', 'B02', 'manifest with a seventh (unapproved) path');
	m((l) => [...l, l[0]].join('\n'), 'twice|7 non-blank', 'B03', 'manifest repeats an identical line (7 lines)');
	m((l) => [l[0], l[0], ...l.slice(2)].join('\n'), 'twice|missing', 'B04', 'six lines but one path twice and one approved path missing');
	m((l) => [`${'0'.repeat(64)}  ${l[0].split('  ')[1]}`, ...l.slice(1)].join('\n'), 'hash for', 'B05', 'one path carries a different (alternate) hash');
	m((l) => [`${l[0].split('  ')[0]}  research/essays/other/other.pdf`, ...l.slice(1)].join('\n'), 'unapproved path|missing approved', 'B06', 'one approved path substituted by another path');
	m((l) => [l[0].replace('  ', ' '), ...l.slice(1)].join('\n'), 'malformed', 'B07', 'malformed line (single space separator)');
	m((l) => [l[0].toUpperCase().replace(/RESEARCH/, 'research'), ...l.slice(1)].join('\n'), 'malformed', 'B08', 'uppercase hash digits');
	m((l) => l.slice(0, 5).join('\n'), 'PDF_MANIFEST', 'B09', 'the five-line launch manifest (the existing carry script would accept it)');
	m(() => '', 'PDF_MANIFEST', 'B10', 'empty manifest');
	m((l) => [l[0], l[1], l[2], l[3], l[4], `${l[5].split('  ')[0]}  ${l[5].split('  ')[1]}  `].join('\n'), 'malformed', 'B11', 'trailing whitespace on a line');
	m((l) => [...l.slice(0, 5), '# comment', l[5]].join('\n'), 'malformed', 'B12', 'comment line inside the manifest');
	m((l) => [l[1], l[0], ...l.slice(2, 5), `${l[1].split('  ')[0]}  ${l[5].split('  ')[1]}`].join('\n'), 'twice|hash', 'B13', 'two paths swapped / one hash reused');
	{
		const s = makeSynthetic();
		check('B14', 'PDF_MANIFEST variable not set at all', 'FAIL', runGuard({ ...s, manifest: undefined }), 'PDF_MANIFEST');
	}
}

// ---- C. release controls --------------------------------------------------------------
{
	const base = () => makeSynthetic();
	for (const [id, label, env] of [
		['C01', 'PDF_CARRY_OVER disabled ("false")', { PDF_CARRY_OVER: 'false' }],
		['C02', 'PDF_CARRY_OVER unset', { PDF_CARRY_OVER: undefined }],
		['C03', 'PDF_CARRY_OVER "TRUE" (not exactly "true")', { PDF_CARRY_OVER: 'TRUE' }],
		['C04', 'PDF_CARRY_OVER " true" (padded)', { PDF_CARRY_OVER: ' true' }],
		['C05', 'PDF_CARRY_OVER empty', { PDF_CARRY_OVER: '' }],
	]) {
		const s = base();
		check(id, label, 'FAIL', runGuard({ ...s, manifest: s.lines.join('\n'), env }), 'PDF_CARRY_OVER');
	}
	for (const [id, value] of [['C06', 'new-version'], ['C07', 'true'], ['C08', 'skip'], ['C09', ' ']]) {
		const s = base();
		check(id, `PDF_RELEASE=${JSON.stringify(value)} is refused (no release mode reaches upload)`, 'FAIL', runGuard({ ...s, manifest: s.lines.join('\n'), env: { PDF_RELEASE: value } }), 'PDF_RELEASE');
	}
	{
		const s = base();
		check('C10', 'PDF_RELEASE=new-version with the carry flag also off', 'FAIL', runGuard({ ...s, manifest: s.lines.join('\n'), env: { PDF_RELEASE: 'new-version', PDF_CARRY_OVER: 'false' } }), 'PDF_CARRY_OVER|PDF_RELEASE');
	}
}

// ---- D. actual deployable files ----------------------------------------------------------
{
	const d = (id, name, sym, mut) => {
		const s = makeSynthetic();
		mut(s);
		check(id, name, 'FAIL', runGuard({ ...s, manifest: s.lines.join('\n') }), sym);
	};
	d('D01', 'dist missing one approved PDF', 'missing from dist', (s) => rmSync(join(s.dist, s.files[2].path)));
	d('D02', 'dist has an extra PDF at an unapproved path', 'unapproved extra PDF', (s) => { mkdirSync(join(s.dist, 'research/x'), { recursive: true }); writeFileSync(join(s.dist, 'research/x/x.pdf'), '%PDF-1.7\nextra'); });
	d('D03', 'dist has an extra PDF with an upper-case extension', 'unapproved extra PDF', (s) => writeFileSync(join(s.dist, 'EXTRA.PDF'), '%PDF-1.7\nextra'));
	d('D04', 'dist has a legacy paper.pdf next to an approved PDF', 'unapproved extra PDF', (s) => writeFileSync(join(dirname(join(s.dist, s.files[0].path)), 'paper.pdf'), '%PDF-1.7\nlegacy'));
	d('D05', 'an approved PDF has one byte altered', 'sha256', (s) => { const p = join(s.dist, s.files[1].path); const b = readFileSync(p); b[b.length - 2] ^= 1; writeFileSync(p, b); });
	d('D06', 'an approved PDF is truncated', 'sha256', (s) => { const p = join(s.dist, s.files[3].path); writeFileSync(p, readFileSync(p).subarray(0, 12)); });
	d('D07', 'an approved PDF is empty', 'sha256|%PDF-', (s) => writeFileSync(join(s.dist, s.files[4].path), ''));
	d('D08', 'two approved PDFs swapped between their paths', 'sha256', (s) => { const a = join(s.dist, s.files[0].path); const b = join(s.dist, s.files[5].path); const ta = readFileSync(a); writeFileSync(a, readFileSync(b)); writeFileSync(b, ta); });
	d('D09', 'an approved path is a symlink to a valid copy', 'symlink', (s) => { const p = join(s.dist, s.files[2].path); const copy = join(s.root, 'copy.pdf'); cpSync(p, copy); rmSync(p); symlinkSync(copy, p); });
	d('D10', 'a directory on the path is a symlink', 'symlink', (s) => { const dir = join(s.dist, 'research/cybernetics'); const moved = join(s.root, 'moved'); cpSync(dir, moved, { recursive: true }); rmSync(dir, { recursive: true }); symlinkSync(moved, dir); });
	d('D11', 'an unrelated symlink anywhere in dist', 'symlink', (s) => symlinkSync(join(s.root, 'baseline.sha256'), join(s.dist, 'link.txt')));
	d('D12', 'an approved path is a directory, not a file', 'missing from dist|not a regular|sha256', (s) => { const p = join(s.dist, s.files[0].path); rmSync(p); mkdirSync(p); });
	{
		// hash matches the baseline but the content is not a PDF
		const root = join(work, `s${++seq}`);
		const dist = join(root, 'dist');
		const lines = [];
		SIX.forEach(([, p], i) => {
			mkdirSync(dirname(join(dist, p)), { recursive: true });
			const bytes = Buffer.from(i === 0 ? `NOT-A-PDF ${seq}` : `%PDF-1.7\n${i} ${seq}`);
			writeFileSync(join(dist, p), bytes);
			lines.push(`${sha(bytes)}  ${p}`);
		});
		writeFileSync(join(root, 'baseline.sha256'), lines.join('\n') + '\n');
		check('D13', 'file whose hash matches but does not start with %PDF-', 'FAIL', runGuard({ dist, baseline: join(root, 'baseline.sha256'), manifest: lines.join('\n') }), '%PDF-');
	}
	check('D14', 'dist directory does not exist', 'FAIL', (() => { const s = makeSynthetic(); return runGuard({ ...s, dist: join(s.root, 'nope'), manifest: s.lines.join('\n') }); })(), 'dist');
	check('D15', 'dist has no PDFs at all', 'FAIL', (() => { const s = makeSynthetic(); rmSync(join(s.dist, 'research'), { recursive: true }); return runGuard({ ...s, manifest: s.lines.join('\n') }); })(), 'missing from dist');
}

// ---- E. a broken pinned baseline must also stop the release -----------------------------
{
	const e = (id, name, mut, sym) => {
		const s = makeSynthetic();
		writeFileSync(s.baseline, mut(s.lines));
		check(id, name, 'FAIL', runGuard({ ...s, manifest: s.lines.join('\n') }), sym);
	};
	e('E01', 'pinned baseline with only five lines', (l) => l.slice(0, 5).join('\n') + '\n', 'pinned baseline');
	e('E02', 'pinned baseline with seven lines', (l) => [...l, `${'b'.repeat(64)}  research/x/x.pdf`].join('\n') + '\n', 'pinned baseline');
	e('E03', 'pinned baseline repeating a hash', (l) => [l[0], `${l[0].split('  ')[0]}  ${l[1].split('  ')[1]}`, ...l.slice(2)].join('\n') + '\n', 'hash listed twice');
	e('E04', 'pinned baseline with a malformed line', (l) => [l[0].replace('  ', '\t'), ...l.slice(1)].join('\n') + '\n', 'malformed');
	{
		const s = makeSynthetic();
		check('E05', 'pinned baseline file missing', 'FAIL', runGuard({ ...s, baseline: join(s.root, 'absent.sha256'), manifest: s.lines.join('\n') }), 'pinned baseline');
	}
}

// ---- F. the REAL pinned fixture ----------------------------------------------------------
{
	const text = readFileSync(FIXTURE, 'utf8');
	record('F01', 'pinned fixture is byte-identical to the second reviewed copy of the six approved pairs', 'PASS', text === sixText ? 'PASS' : 'FAIL');
	record('F02', 'pinned fixture: six lines, LF only, trailing newline, six distinct paths and hashes', 'PASS', (() => {
		const ls = text.split('\n');
		return ls.length === 7 && ls[6] === '' && !text.includes('\r') && new Set(ls.slice(0, 6).map((l) => l.split('  ')[0])).size === 6 && new Set(ls.slice(0, 6).map((l) => l.split('  ')[1])).size === 6 ? 'PASS' : 'FAIL';
	})());
	// no argument = the real fixture; the five-line launch manifest must not be accepted against it
	const s = makeSynthetic();
	check('F03', 'default (real) baseline rejects the five-line launch manifest', 'FAIL', runGuard({ dist: s.dist, manifest: sixText.split('\n').slice(0, 5).join('\n') }), 'PDF_MANIFEST');
	check('F04', 'default (real) baseline rejects synthetic dist bytes even with the correct six-line manifest', 'FAIL', runGuard({ dist: s.dist, manifest: sixText }), 'sha256');
	const real = process.env.REAL_PDF_DIR;
	if (real && SIX.every(([, p]) => existsSync(join(real, p)))) {
		const dist = join(work, `real${++seq}`);
		for (const [, p] of SIX) {
			mkdirSync(dirname(join(dist, p)), { recursive: true });
			cpSync(join(real, p), join(dist, p));
		}
		check('F05', 'REAL six production PDFs + the real six-line manifest: PASS', 'PASS', runGuard({ dist, manifest: sixText }));
		const p0 = join(dist, SIX[0][1]);
		const keep = readFileSync(p0);
		const b = Buffer.from(keep);
		b[100] ^= 1;
		writeFileSync(p0, b);
		check('F06', 'REAL PDFs with one flipped byte (on a disposable copy): FAIL', 'FAIL', runGuard({ dist, manifest: sixText }), 'sha256');
		writeFileSync(p0, keep);
		check('F07', 'REAL PDFs, five-line manifest: FAIL', 'FAIL', runGuard({ dist, manifest: sixText.split('\n').slice(0, 5).join('\n') }), 'PDF_MANIFEST');
	} else {
		record('F05', 'REAL six production PDFs: set REAL_PDF_DIR to run (UNTESTED here)', 'PASS', 'UNTESTED');
		results[results.length - 1].ok = true;
		results[results.length - 1].extra = 'skipped: REAL_PDF_DIR not set';
	}
}

// ---- G. workflow wiring -------------------------------------------------------------------
const GUARD_RUN = 'node scripts/guard-production-six-pdfs.mjs';
const evalCond = (cond, ctx) => {
	const m = /^github\.ref_name == '([^']+)'$/.exec((cond ?? '').trim());
	if (!m) throw new Error(`unrecognized condition: ${JSON.stringify(cond)}`);
	return ctx.ref_name === m[1];
};
function checkWorkflow(text) {
	const problems = [];
	let doc;
	try {
		doc = yaml.load(text);
	} catch (err) {
		return [`workflow does not parse: ${err.message}`];
	}
	const on = doc.on ?? doc[true];
	if (!on?.workflow_dispatch && !('workflow_dispatch' in (on ?? {}))) problems.push('workflow_dispatch trigger missing (wiring test expects to cover it)');
	if (JSON.stringify(on?.push?.branches) !== JSON.stringify(['staging', 'main'])) problems.push(`push branches ${JSON.stringify(on?.push?.branches)} !== ["staging","main"]`);
	const jobs = Object.keys(doc.jobs ?? {});
	if (jobs.length !== 1) problems.push(`expected exactly one job, found ${jobs.length}`);
	const job = doc.jobs?.[jobs[0]] ?? {};
	if ('continue-on-error' in job) problems.push('job-level continue-on-error is present');
	const steps = job.steps ?? [];
	const idx = (pred) => steps.map((s, i) => (pred(s) ? i : -1)).filter((i) => i >= 0);
	const guardIdx = idx((s) => /guard-production-six-pdfs/.test(s.run ?? ''));
	const carryIdx = idx((s) => /carry-over-pdfs\.sh carry/.test(s.run ?? ''));
	const buildPdfIdx = idx((s) => /npm run build:pdfs/.test(s.run ?? ''));
	const deployIdx = idx((s) => /npm run deploy:pages/.test(s.run ?? ''));
	if (guardIdx.length !== 1) problems.push(`guard step count is ${guardIdx.length}, exactly 1 required`);
	if (carryIdx.length !== 1 || deployIdx.length !== 1 || buildPdfIdx.length !== 1) problems.push('carry/deploy/build:pdfs step not found exactly once');
	if (problems.length) return problems;
	const g = steps[guardIdx[0]];
	const [gi, ci, di, bi] = [guardIdx[0], carryIdx[0], deployIdx[0], buildPdfIdx[0]];
	if (!(bi < ci && ci < gi && gi < di)) problems.push(`order must be build:pdfs < carry < guard < deploy (got ${bi},${ci},${gi},${di})`);
	if (di !== gi + 1) problems.push('guard must be the step immediately before the Wrangler deploy step');
	if ((g.run ?? '').trim() !== GUARD_RUN) problems.push(`guard run is ${JSON.stringify(g.run)}, must be exactly ${JSON.stringify(GUARD_RUN)}`);
	if ('continue-on-error' in g) problems.push('guard has continue-on-error');
	if (g['working-directory'] !== undefined) problems.push('guard overrides working-directory');
	if (g.shell !== undefined) problems.push('guard overrides the shell');
	for (const k of ['PDF_MANIFEST', 'PDF_CARRY_OVER', 'PDF_RELEASE']) if (g.env?.[k] !== `\${{ vars.${k} }}`) problems.push(`guard env ${k} is ${JSON.stringify(g.env?.[k])}, must be the live repository variable`);
	if (Object.keys(g.env ?? {}).length !== 3) problems.push(`guard env has ${Object.keys(g.env ?? {}).length} keys, exactly the three release variables expected`);
	try {
		// the guard runs for every production trigger: push to main and workflow_dispatch on main
		for (const [ev, ref, expectRuns] of [['push', 'main', true], ['workflow_dispatch', 'main', true], ['push', 'staging', false], ['workflow_dispatch', 'staging', false], ['workflow_dispatch', 'work/x', false]]) {
			const runs = evalCond(g.if, { event_name: ev, ref_name: ref });
			if (runs !== expectRuns) problems.push(`guard ${runs ? 'runs' : 'is skipped'} for ${ev} on ${ref}; expected ${expectRuns ? 'run' : 'skip'}`);
		}
	} catch (err) {
		problems.push(err.message);
	}
	// the deploy step must target the pushed ref name, so only a `main` run can be production
	const d = steps[di];
	if ('if' in d || 'continue-on-error' in d) problems.push('deploy step has an if/continue-on-error that changes when it runs');
	if (!/BRANCH="\$\{\{ github\.ref_name \}\}"/.test(d.run ?? '') || !/--branch="\$BRANCH"/.test(d.run ?? '')) problems.push('deploy step does not deploy to --branch=<github.ref_name>');
	// no step may force-run after a failure, and none may be non-fatal
	steps.forEach((s, i) => {
		if ('continue-on-error' in s) problems.push(`step ${i} (${s.name ?? s.uses}) has continue-on-error`);
		if (i > bi && /always\(\)|failure\(\)|cancelled\(\)/.test(String(s.if ?? ''))) problems.push(`step ${i} (${s.name}) uses a status function that can override the guard failure`);
	});
	return problems;
}
const wfText = readFileSync(WORKFLOW, 'utf8');
{
	const p = checkWorkflow(wfText);
	record('G01', 'real workflow wiring: guard after build:pdfs and carry, immediately before Wrangler, main-only condition, live variables, no continue-on-error', 'PASS', p.length ? 'FAIL' : 'PASS', p.join(' | '));
	const dispatch = (() => { try { return evalCond(yaml.load(wfText).jobs.deploy.steps.find((s) => /guard-production/.test(s.run ?? '')).if, { event_name: 'workflow_dispatch', ref_name: 'main' }); } catch { return false; } })();
	const push = (() => { try { return evalCond(yaml.load(wfText).jobs.deploy.steps.find((s) => /guard-production/.test(s.run ?? '')).if, { event_name: 'push', ref_name: 'main' }); } catch { return false; } })();
	record('G02', 'real workflow: guard step executes for a push to main', 'PASS', push ? 'PASS' : 'FAIL');
	record('G03', 'real workflow: guard step executes for workflow_dispatch on main', 'PASS', dispatch ? 'PASS' : 'FAIL');
	const stagingRuns = (() => { try { return evalCond(yaml.load(wfText).jobs.deploy.steps.find((s) => /guard-production/.test(s.run ?? '')).if, { event_name: 'push', ref_name: 'staging' }); } catch { return true; } })();
	record('G04', 'real workflow: guard step does not change staging behavior (skipped on staging)', 'PASS', stagingRuns ? 'FAIL' : 'PASS');
	// staging isolation: existing main-only guard/carry/verify steps unchanged in condition
	const doc = yaml.load(wfText);
	const conds = doc.jobs.deploy.steps.filter((s) => /carry-over-pdfs/.test(s.run ?? '')).map((s) => `${s.run.trim().split(' ').pop()}:${s.if}`);
	record('G05', 'real workflow: existing carry-over guard/carry/verify step conditions are unchanged', 'PASS', JSON.stringify(conds) === JSON.stringify(["guard:github.ref_name == 'main'", "carry:github.ref_name == 'main' && vars.PDF_CARRY_OVER == 'true'", "verify:github.ref_name == 'main' && vars.PDF_CARRY_OVER == 'true'"]) ? 'PASS' : 'FAIL', JSON.stringify(conds));
	// other upload entrypoints
	const wfs = readdirSync(join(REPO, '.github', 'workflows'));
	const offenders = [];
	const scan = (dir, depth = 0) => {
		if (depth > 6) return;
		for (const e of readdirSync(dir, { withFileTypes: true })) {
			if (['node_modules', '.git', 'dist', '.astro'].includes(e.name)) continue;
			const p = join(dir, e.name);
			if (e.isDirectory()) scan(p, depth + 1);
			else if (/\.(ya?ml|json|sh|toml|jsonc)$/.test(e.name) && /wrangler\s+pages\s+deploy|deploy:pages/.test(readFileSync(p, 'utf8'))) offenders.push(p.replace(REPO + '/', ''));
		}
	};
	scan(REPO);
	record('G06', 'only one workflow file exists and the only deploy entrypoints (yaml/json/sh/toml) are package.json deploy:pages and that workflow; no wrangler config file', 'PASS', wfs.length === 1 && wfs[0] === 'deploy-pages.yml' && JSON.stringify(offenders.sort()) === JSON.stringify(['.github/workflows/deploy-pages.yml', 'site/package.json']) ? 'PASS' : 'FAIL', `${wfs.join(',')} ${offenders.join(',')}`);
}
// mutations of the workflow, in memory only: each must be reported as a problem
const stepStart = '      - name: Independent six-PDF production guard (main only, mandatory)\n';
const guardBlock = (() => {
	const i = wfText.indexOf(stepStart);
	const j = wfText.indexOf('      - name: Deploy to Cloudflare Pages\n');
	return [i, j];
})();
const withoutGuard = wfText.slice(0, guardBlock[0]) + wfText.slice(guardBlock[1]);
const guardText = wfText.slice(guardBlock[0], guardBlock[1]);
const deployText = wfText.slice(guardBlock[1]);
const mut = (id, name, text) => {
	const problems = checkWorkflow(text);
	record(id, `workflow mutation caught: ${name}`, 'FAIL', problems.length ? 'FAIL' : 'PASS', problems[0] ?? 'ESCAPED');
};
mut('W01', 'guard step deleted', withoutGuard);
mut('W02', 'guard given continue-on-error: true', wfText.replace("        if: github.ref_name == 'main'\n        env:\n          PDF_MANIFEST: ${{ vars.PDF_MANIFEST }}\n          PDF_CARRY_OVER: ${{ vars.PDF_CARRY_OVER }}\n          PDF_RELEASE:", "        continue-on-error: true\n        if: github.ref_name == 'main'\n        env:\n          PDF_MANIFEST: ${{ vars.PDF_MANIFEST }}\n          PDF_CARRY_OVER: ${{ vars.PDF_CARRY_OVER }}\n          PDF_RELEASE:"));
mut('W03', "guard condition skips when PDF_RELEASE is set", wfText.replace(guardText, guardText.replace("if: github.ref_name == 'main'", "if: github.ref_name == 'main' && vars.PDF_RELEASE != 'new-version'")));
mut('W04', 'guard condition limited to push events (dispatch on main would skip it)', wfText.replace(guardText, guardText.replace("if: github.ref_name == 'main'", "if: github.ref_name == 'main' && github.event_name == 'push'")));
mut('W05', 'guard condition limited to workflow_dispatch', wfText.replace(guardText, guardText.replace("if: github.ref_name == 'main'", "if: github.ref_name == 'main' && github.event_name == 'workflow_dispatch'")));
mut('W06', 'guard condition removed (would also run on staging)', wfText.replace(guardText, guardText.replace("        if: github.ref_name == 'main'\n", '')));
mut('W07', 'guard condition forced false', wfText.replace(guardText, guardText.replace("if: github.ref_name == 'main'", "if: false")));
mut('W08', 'guard run made non-fatal (|| true)', wfText.replace(guardText, guardText.replace(GUARD_RUN, `${GUARD_RUN} || true`)));
mut('W09', 'guard run points at a different script', wfText.replace(guardText, guardText.replace('guard-production-six-pdfs.mjs', 'guard-production-six-pdfs.mjs --dist /tmp/x')));
mut('W10', 'guard moved after the Wrangler deploy step', withoutGuard.replace('      - name: Verify the live PDFs after deploy', guardText + '      - name: Verify the live PDFs after deploy'));
{
	const carryName = '      - name: Carry over the live scholarly PDFs (opt-in, main only)\n';
	mut('W11', 'guard moved before the carry step', withoutGuard.replace(carryName, guardText + carryName));
}
mut('W12', 'guard env PDF_RELEASE dropped', wfText.replace(guardText, guardText.replace("          PDF_RELEASE: ${{ vars.PDF_RELEASE }}\n", '')));
mut('W13', 'guard env PDF_MANIFEST replaced by a literal', wfText.replace(guardText, guardText.replace('PDF_MANIFEST: ${{ vars.PDF_MANIFEST }}', 'PDF_MANIFEST: "x"')));
mut('W14', 'guard env PDF_CARRY_OVER hard-coded true', wfText.replace(guardText, guardText.replace('PDF_CARRY_OVER: ${{ vars.PDF_CARRY_OVER }}', 'PDF_CARRY_OVER: true')));
mut('W15', 'deploy step gains a condition that can bypass the guard', wfText.replace(deployText.slice(0, 200), deployText.slice(0, 200).replace('      - name: Deploy to Cloudflare Pages\n', "      - name: Deploy to Cloudflare Pages\n        if: always()\n")));
mut('W16', 'a status-function step after the guard could mask the failure', wfText.replace('      - name: Verify the live PDFs after deploy', "      - name: Extra\n        if: always()\n        run: echo x\n\n      - name: Verify the live PDFs after deploy"));
mut('W17', 'job-level continue-on-error', wfText.replace('    runs-on: ubuntu-latest\n', '    runs-on: ubuntu-latest\n    continue-on-error: true\n'));
mut('W18', 'workflow_dispatch trigger removed', wfText.replace('  workflow_dispatch:\n', ''));
mut('W19', 'a second guard-less deploy step added', wfText + '\n      - name: Second deploy\n        run: npm run deploy:pages -- --branch=main\n');

// ---- report ---------------------------------------------------------------------------
const pad = (s, n) => String(s).padEnd(n);
console.log('\ntest-guard-production-six-pdfs\n');
for (const r of results) console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${pad(r.id, 4)} ${pad(r.expected, 5)} -> ${pad(r.actual, 18)} ${r.name}${r.extra && (!r.ok || r.actual === 'UNTESTED') ? `  [${r.extra}]` : ''}`);
const bad = results.filter((r) => !r.ok);
const neg = results.filter((r) => r.expected === 'FAIL');
const negCaught = neg.filter((r) => r.ok).length;
const pos = results.filter((r) => r.expected === 'PASS');
console.log(`\n${results.length} cases: ${pos.length} must-pass (${pos.filter((r) => r.ok).length} ok), ${neg.length} must-fail (${negCaught} caught, ${neg.length - negCaught} escaped); unexpected ${bad.length}; untested ${results.filter((r) => r.actual === 'UNTESTED').length}`);
process.exit(bad.length ? 1 : 0);

#!/usr/bin/env node
// T30.2 — local production preflight. Replays, on this machine, the steps that only a push to `main`
// runs in .github/workflows/deploy-pages.yml, against the REAL repository variables, so a release
// candidate fails here instead of in the production run. It adds no rule of its own: every
// pass/fail verdict below comes from the existing scripts, run exactly as the workflow runs them.
//
//   npm run preflight:production        (from site/, on the release candidate's HEAD)
//
// Order mirrors the main job:
//   candidate checks -> read repo variables (gh) -> carry-over-pdfs.sh guard -> npm run build
//   -> build:pdfs -> carry-over-pdfs.sh carry -> validate:pdfs -> guard-production-seven-pdfs.mjs
//
// Read-only with respect to the repository, Cloudflare and the repo variables: it never commits,
// pushes, deploys or sets a variable. The only writes are the gitignored dist/ directory (rebuilt,
// then PDFs replaced by the production copies, as in the workflow) and the remote-tracking ref
// origin/main (git fetch). `carry` reads the seven PDFs from https://amulbham.com (plain GETs).
//
// Not covered, by design: the post-deploy `carry-over-pdfs.sh verify`, Cloudflare/Actions behaviour,
// and any change to a repo variable between this run and the push. A pass is evidence, not authority:
// the owner's explicit release authorization is still required.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VARS = ['PDF_MANIFEST', 'PDF_CARRY_OVER', 'PDF_RELEASE', 'SITE_INDEXING'];
const LIST_CAP = 60;

const step = (title) => console.log(`\n== ${title}`);
function die(message) {
	console.error(`\npreflight-production: FAILED — ${message}`);
	process.exit(1);
}

function git(args) {
	const r = spawnSync('git', args, { cwd: SITE, encoding: 'utf8' });
	return { ok: r.status === 0, out: (r.stdout ?? '').trim(), err: (r.stderr ?? '').trim() };
}

// Git Bash on Windows: `bash` on PATH can be the WSL launcher, which cannot run the repo's scripts.
function bashPath() {
	if (process.platform !== 'win32') return 'bash';
	const exec = git(['--exec-path']);
	if (exec.ok) {
		const candidate = resolve(exec.out, '..', '..', '..', 'bin', 'bash.exe');
		if (existsSync(candidate)) return candidate;
	}
	return 'bash';
}

function run(label, command, args, env) {
	console.log(`\n$ ${label}`);
	const r = args
		? spawnSync(command, args, { cwd: SITE, env, stdio: 'inherit' })
		: spawnSync(command, { cwd: SITE, env, stdio: 'inherit', shell: true }); // npm is npm.cmd on Windows
	if (r.error) die(`${label}: ${r.error.message}`);
	if (r.status !== 0) die(`${label} exited ${r.status}`);
}

// ---- 1. the candidate ----------------------------------------------------------------------
step('1. Release candidate');
if (!git(['rev-parse', '--git-dir']).ok) die('not inside a git checkout');
const dirty = git(['status', '--porcelain', '--untracked-files=no']).out;
if (dirty) die(`tracked files have uncommitted changes — the preflight validates a commit, not an edit:\n${dirty}`);
const fetched = git(['fetch', 'origin', 'main', '--quiet']);
if (!fetched.ok) die(`cannot fetch origin/main to compare against production: ${fetched.err}`);
if (!git(['merge-base', '--is-ancestor', 'origin/main', 'HEAD']).ok) {
	die('HEAD does not contain current origin/main — a push would not fast-forward production. Rebuild the promotion branch on top of origin/main.');
}
const head = git(['log', '-1', '--format=%h %s']).out;
const changed = git(['diff', '--name-status', 'origin/main', 'HEAD']).out.split('\n').filter(Boolean);
console.log(`candidate: ${head}`);
console.log(`origin/main..HEAD touches ${changed.length} file(s). Every one must be owner-approved for production:`);
for (const line of changed.slice(0, LIST_CAP)) console.log(`  ${line}`);
if (changed.length > LIST_CAP) console.log(`  … ${changed.length - LIST_CAP} more (git diff --name-status origin/main HEAD)`);
const untracked = git(['status', '--porcelain', '--untracked-files=all', '--', '.']).out.split('\n').filter((l) => l.startsWith('??'));
if (untracked.length > 0) {
	console.log(`WARNING: ${untracked.length} untracked file(s) under site/ are present locally but absent from a fresh checkout:`);
	for (const l of untracked.slice(0, 10)) console.log(`  ${l}`);
}

// ---- 2. the repository variables -------------------------------------------------------------
step('2. Repository variables (read with gh; never taken from this shell)');
const listed = spawnSync('gh', ['variable', 'list', '--json', 'name,value'], { cwd: SITE, encoding: 'utf8' });
if (listed.error || listed.status !== 0) {
	die(`cannot read repository variables with gh (${(listed.error?.message ?? listed.stderr ?? '').trim()}). Needs \`gh auth login\` with access to this repository.`);
}
let rows;
try {
	rows = JSON.parse(listed.stdout);
} catch {
	die('gh returned unreadable variable data');
}
const env = { ...process.env };
for (const name of VARS) delete env[name]; // only the repository's values may reach the guards
for (const { name, value } of rows) if (VARS.includes(name)) env[name] = value;
const manifestLines = (env.PDF_MANIFEST ?? '').split('\n').filter((l) => l.trim() !== '').length;
console.log(`PDF_CARRY_OVER=${JSON.stringify(env.PDF_CARRY_OVER ?? '(unset)')}  PDF_RELEASE=${JSON.stringify(env.PDF_RELEASE ?? '(unset)')}  SITE_INDEXING=${JSON.stringify(env.SITE_INDEXING ?? '(unset)')}  PDF_MANIFEST=${manifestLines} line(s)`);
// Same expression the workflow uses for a `main` build.
env.SITE_INDEXING = env.SITE_INDEXING === 'open' ? 'open' : 'closed';

// ---- 3-8. the main-only workflow steps, in workflow order -------------------------------------
const bash = bashPath();
step('3. PDF release guard (workflow: "PDF release guard (main only)")');
run('bash scripts/carry-over-pdfs.sh guard', bash, ['scripts/carry-over-pdfs.sh', 'guard'], env);

step('4. Build site (workflow: "Build site (Astro + Pagefind)")');
run('npm run build', 'npm run build', null, env);

step('5. Build scholarly PDFs');
run('npm run build:pdfs', 'npm run build:pdfs', null, env);

step('6. Carry over the live scholarly PDFs (reads https://amulbham.com)');
if (env.PDF_CARRY_OVER === 'true') run('bash scripts/carry-over-pdfs.sh carry', bash, ['scripts/carry-over-pdfs.sh', 'carry'], env);
else console.log('skipped, as in the workflow: PDF_CARRY_OVER is not "true" (the seven-PDF guard below will refuse it).');

step('7. Validate Scholar/PDF identity');
run('npm run validate:pdfs', 'npm run validate:pdfs', null, env);

step('8. Independent seven-PDF production guard');
run('node scripts/guard-production-seven-pdfs.mjs', process.execPath, ['scripts/guard-production-seven-pdfs.mjs'], env);

console.log(`\npreflight-production: PASSED for ${head}`);
console.log('This does not cover the post-deploy live-PDF verify, Cloudflare/Actions behaviour, or later variable changes, and it is not release authorization.');

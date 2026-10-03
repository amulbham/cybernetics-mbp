import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GUARD = path.join(path.dirname(fileURLToPath(import.meta.url)), 'guard.mjs');
let root; // fixture repo on branch staging
let mainRoot; // fixture repo on branch main

function mkRepo(branch) {
	const dir = mkdtempSync(path.join(tmpdir(), 'guard-'));
	execFileSync('git', ['init', '-q', '-b', branch], { cwd: dir });
	mkdirSync(path.join(dir, 'site/planning/tickets'), { recursive: true });
	return dir;
}

function ticket(dir, name, status, paths = '`site/allowed/**`, `site/one.md`, `AI-Orchestrator\\x.ps1`') {
	writeFileSync(
		path.join(dir, 'site/planning/tickets', name),
		`# T\n\nStatus: ${status}\nAuthorized paths: ${paths}\n`,
	);
}

function run(payload, { dir = root, env = {}, raw } = {}) {
	const r = spawnSync('node', [GUARD], {
		input: raw ?? JSON.stringify({ cwd: dir, ...payload }),
		encoding: 'utf8',
		env: { ...process.env, MBP_GUARD_OFF: '', CLAUDE_PROJECT_DIR: dir, ...env },
	});
	return { code: r.status, out: r.stdout, err: r.stderr };
}
const bash = (command, o) => run({ tool_name: 'Bash', tool_input: { command } }, o);
const file = (tool, tool_input, o) => run({ tool_name: tool, tool_input }, o);
const denied = (r) => {
	assert.equal(r.code, 2, JSON.stringify(r));
	assert.equal(r.err.trim().split('\n').length, 1);
};
const allowed = (r) => {
	assert.equal(r.code, 0, JSON.stringify(r));
	assert.equal(r.out, '');
	assert.equal(r.err, '');
};

const G = (args, cwd) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd, encoding: 'utf8' }).trim();

before(() => {
	root = mkRepo('staging');
	mainRoot = mkRepo('main');
	ticket(root, 'TX-1.md', 'READY');
	// origin/staging is the base commit; local staging starts equal to it (a fast-forward)
	G(['commit', '--allow-empty', '-q', '-m', 'base'], root);
	G(['update-ref', 'refs/remotes/origin/staging', 'HEAD'], root);
});
after(() => {
	rmSync(root, { recursive: true, force: true });
	rmSync(mainRoot, { recursive: true, force: true });
});

test('main push variants are denied', () => {
	for (const c of [
		'git push origin main',
		'git push origin HEAD:main',
		'git push origin HEAD:refs/heads/main',
		'git push origin +x:main',
		'git push --force origin main',
		'git push --all',
		'git push --mirror origin',
		'git -C site push origin main',
		'git push --dry-run origin HEAD:main',
		'cd x && git push origin main',
	]) denied(bash(c));
});

test('non-main pushes are allowed', () => {
	for (const c of ['git push origin staging', 'git push origin claude/x', 'git push -u origin HEAD', 'git status', 'npm run build']) allowed(bash(c));
});

test('bare push is denied only on main', () => {
	denied(bash('git push', { dir: mainRoot }));
	denied(bash('git push origin HEAD', { dir: mainRoot }));
	allowed(bash('git push', { dir: root }));
});

test('indexing denials', () => {
	denied(file('Edit', { file_path: path.join(root, 'site/public/robots.txt'), old_string: 'a', new_string: 'b' }));
	denied(file('Write', { file_path: 'site/public/robots.txt', content: 'x' }));
	denied(file('Edit', { file_path: 'site/src/components/BaseHead.astro', old_string: 'x', new_string: 'const SITE_WIDE_NOINDEX = false;' }));
	denied(file('Edit', { file_path: 'site/src/components/BaseHead.astro', old_string: 'SITE_WIDE_NOINDEX', new_string: 'x' }));
	denied(file('MultiEdit', { file_path: 'site/src/components/BaseHead.astro', edits: [{ old_string: 'a', new_string: 'SITE_WIDE_NOINDEX' }] }));
	denied(file('Write', { file_path: 'site/src/components/BaseHead.astro', content: 'const SITE_WIDE_NOINDEX = false;' }));
	denied(bash('sed -i s/true/false/ site/src/components/BaseHead.astro'));
	denied(bash('echo Allow: / > site/public/robots.txt'));
	denied(bash('echo x | tee site/public/robots.txt'));
	denied(bash('git checkout -- site/public/robots.txt'));
});

test('indexing reads and unrelated edits are allowed', () => {
	ticket(root, 'TX-1.md', 'CLOSED');
	allowed(bash('cat site/public/robots.txt'));
	allowed(bash('grep SITE_WIDE_NOINDEX site/src/components/BaseHead.astro'));
	allowed(bash('git diff site/src/components/BaseHead.astro'));
	allowed(bash('git log -p -- site/public/robots.txt 2>&1'));
	allowed(file('Write', { file_path: 'site/src/components/BaseHead.astro', content: 'const SITE_WIDE_NOINDEX = true;' }));
	allowed(file('Edit', { file_path: 'site/src/components/BaseHead.astro', old_string: 'a', new_string: 'b' }));
	allowed(file('Edit', { file_path: 'site/one.md', old_string: 'a', new_string: 'b' }));
	ticket(root, 'TX-1.md', 'READY');
});

test('self-protection denials', () => {
	denied(file('Edit', { file_path: '.claude/hooks/guard.mjs', old_string: 'a', new_string: 'b' }));
	denied(file('Edit', { file_path: '.claude/settings.json', old_string: 'a', new_string: 'b' }));
	denied(file('Write', { file_path: '.claude/settings.local.json', content: '{}' }));
	denied(file('NotebookEdit', { notebook_path: '.claude/hooks/n.ipynb', new_source: 'x' }));
	denied(bash('rm .claude/hooks/guard.mjs'));
	denied(bash('mv .claude/settings.json x'));
	denied(bash('echo > .claude/settings.json'));
	denied(bash('del .claude\\hooks\\guard.mjs'));
	allowed(bash('node --test .claude/hooks/guard.test.mjs'));
	allowed(bash('cat .claude/settings.json'));
});

test('path forms give the same result', () => {
	const forms = [
		[path.join(root, 'site/public/robots.txt'), root],
		['site/public/robots.txt', root],
		['public/robots.txt', path.join(root, 'site')],
		['site\\public\\robots.txt', root],
		['site/src/../public/robots.txt', root],
		[path.join(root, 'site', 'public', 'robots.txt').replace(/\//g, '\\'), root],
	];
	for (const [p, cwd] of forms) denied(run({ cwd, tool_name: 'Edit', tool_input: { file_path: p, old_string: 'a', new_string: 'b' } }));
	// outside the repo: ignored by every rule
	allowed(file('Edit', { file_path: path.join(tmpdir(), 'elsewhere', 'robots.txt'), old_string: 'a', new_string: 'b' }));
	allowed(file('Edit', { file_path: '../outside/robots.txt', old_string: 'a', new_string: 'b' }));
});

test('authorized-path warning follows ticket lifecycle', () => {
	const warnCase = () => file('Edit', { file_path: 'site/other.md', old_string: 'a', new_string: 'b' });
	for (const status of ['READY', 'IN PROGRESS']) {
		ticket(root, 'TX-1.md', status);
		const r = warnCase();
		assert.equal(r.code, 0);
		assert.match(JSON.parse(r.out).hookSpecificOutput.additionalContext, /site\/other\.md.*TX-1\.md/);
		allowed(file('Edit', { file_path: 'site/allowed/deep/a.md', old_string: 'a', new_string: 'b' }));
		allowed(file('Write', { file_path: 'site/one.md', content: 'x' }));
	}
	for (const status of ['VERIFIED LOCAL', 'CLOSED']) {
		ticket(root, 'TX-1.md', status);
		allowed(warnCase());
	}
	// several active tickets: skipped silently
	ticket(root, 'TX-1.md', 'READY');
	ticket(root, 'TX-2.md', 'IN PROGRESS');
	allowed(warnCase());
	rmSync(path.join(root, 'site/planning/tickets/TX-2.md'));
	ticket(root, 'TX-1.md', 'READY');
});

test('fails open on malformed input', () => {
	const r = run({}, { raw: '{not json' });
	assert.equal(r.code, 0);
	assert.equal(r.err.trim().split('\n').length, 1);
});

test('MBP_GUARD_OFF=1 disables denies and unset restores them', () => {
	const off = { env: { MBP_GUARD_OFF: '1' } };
	for (const cmd of ['git push origin main', 'git push --force origin claude/x', 'echo x > site/public/robots.txt', 'rm .claude/hooks/guard.mjs']) {
		assert.equal(bash(cmd, off).code, 0);
		denied(bash(cmd));
	}
	for (const f of ['site/public/robots.txt', '.claude/hooks/guard.mjs']) {
		const p = { file_path: f, old_string: 'a', new_string: 'b' };
		assert.equal(file('Edit', p, off).code, 0);
		denied(file('Edit', p));
	}
});

test('force variants are denied', () => {
	for (const c of [
		'git push -f origin claude/x',
		'git push --force origin claude/x',
		'git push --force-with-lease origin claude/x',
		'git push --force-with-lease=claude/x:abc origin claude/x',
		'git push -uf origin claude/x',
		'git push origin +claude/x',
		'git push origin +HEAD:refs/heads/claude/x',
		'git push --force origin HEAD:refs/heads/claude/x',
	]) denied(bash(c));
});

test('staging push: fast-forward allowed, divergence denied', () => {
	const d = mkRepo('staging');
	try {
		G(['commit', '--allow-empty', '-q', '-m', 'base'], d);
		G(['update-ref', 'refs/remotes/origin/staging', 'HEAD'], d);
		const base = G(['rev-parse', 'HEAD'], d);
		G(['commit', '--allow-empty', '-q', '-m', 'ahead'], d); // fast-forward of origin/staging
		const o = { dir: d };
		allowed(bash('git push origin staging', o));
		allowed(bash('git push', o)); // implicit, current branch staging
		allowed(bash('git push origin HEAD', o));
		allowed(bash('git push origin HEAD:staging', o));
		allowed(bash('git push origin HEAD:refs/heads/staging', o));
		allowed(bash(`git push origin ${base}:staging`, o)); // equal to origin/staging
		G(['checkout', '-q', '--orphan', 'side'], d);
		G(['commit', '--allow-empty', '-q', '-m', 'side'], d); // unrelated history
		denied(bash('git push origin side:staging', o));
		denied(bash('git push origin HEAD:staging', o));
		denied(bash('git push origin HEAD:refs/heads/staging', o));
		denied(bash('git push origin claude/x staging side:staging', o)); // one bad refspec among several
		denied(bash('git push origin side:claude/x side:staging', o));
		denied(bash('git push origin :staging', o)); // delete
		denied(bash('git push --delete origin staging', o));
		denied(bash('git push origin nope:staging', o)); // unresolvable source
		denied(bash('git push origin "refs/heads/*:refs/heads/*"', o)); // unparseable
		allowed(bash('git push origin side:claude/x', o)); // other branches unaffected
		G(['checkout', '-q', 'staging'], d);
		G(['branch', '-q', '-D', 'side'], d);
	} finally {
		rmSync(d, { recursive: true, force: true });
	}
});

test('staging push with no origin/staging ref is denied, other branches unaffected', () => {
	const d = mkRepo('staging');
	try {
		G(['commit', '--allow-empty', '-q', '-m', 'base'], d);
		const o = { dir: d };
		denied(bash('git push origin staging', o));
		denied(bash('git push', o)); // implicit on staging
		allowed(bash('git push origin claude/x', o));
		assert.match(bash('git push origin staging', o).err, /origin\/staging/);
		// with the override the denial lifts
		assert.equal(bash('git push origin staging', { dir: d, env: { MBP_GUARD_OFF: '1' } }).code, 0);
	} finally {
		rmSync(d, { recursive: true, force: true });
	}
});

test('push scope warns, never denies', () => {
	const d = mkRepo('claude/execute-T');
	const scoped = (line) =>
		writeFileSync(path.join(d, 'site/planning/tickets/T.md'), `# T\n\nStatus: READY\n${line}\nAuthorized paths: \`site/a.md\`\n`);
	try {
		G(['commit', '--allow-empty', '-q', '-m', 'base'], d);
		const o = { dir: d };
		scoped('Push scope: `claude/execute-T`, `claude/execute-T-*` (never `staging` or `main`); external `tp2.7`');
		allowed(bash('git push origin claude/execute-T', o));
		allowed(bash('git push -u origin HEAD', o));
		allowed(bash('git push origin claude/execute-T-extra', o));
		for (const c of ['git push origin other', 'git push origin HEAD:refs/heads/other']) {
			const r = bash(c, o);
			assert.equal(r.code, 0);
			assert.match(JSON.parse(r.out).hookSpecificOutput.additionalContext, /other.*Push scope/);
		}
		// missing, malformed or conflicting scope: no warning
		scoped('Branch: staging');
		allowed(bash('git push origin other', o));
		scoped('Push scope: not a list');
		allowed(bash('git push origin other', o));
		scoped('Push scope: `main`');
		allowed(bash('git push origin other', o));
		scoped('Push scope: `claude/execute-T`');
		writeFileSync(path.join(d, 'site/planning/tickets/T2.md'), '# T\n\nStatus: READY\nPush scope: `x`\nAuthorized paths: `a`\n');
		allowed(bash('git push origin other', o));
		rmSync(path.join(d, 'site/planning/tickets/T2.md'));
		// no active ticket: no warning
		writeFileSync(path.join(d, 'site/planning/tickets/T.md'), '# T\n\nStatus: CLOSED\nPush scope: `claude/execute-T`\n');
		allowed(bash('git push origin other', o));
		// main stays denied whatever the scope
		scoped('Push scope: `main`');
		denied(bash('git push origin main', o));
	} finally {
		rmSync(d, { recursive: true, force: true });
	}
});

// PreToolUse guard (TP2.6). Denies main pushes, indexing-control edits and
// edits to the guard itself; warns on edits outside the active ticket's
// Authorized paths. Dependency-free, never writes files, fails open.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const MAIN_ERR = 'guard: main push denied. Claude sessions never push main; Amul pushes outside the session.';
const IDX_ERR = 'guard: indexing control denied. robots.txt and SITE_WIDE_NOINDEX are changed by Amul outside the session.';
const SELF_ERR = 'guard: protected hook/settings file denied. Report to Amul, who changes it outside the session.';

const WIN = process.platform === 'win32';
const norm = (p) => p.replace(/\\/g, '/');

function git(args, cwd) {
	return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function repoRoot(cwd) {
	return norm(process.env.CLAUDE_PROJECT_DIR || git(['rev-parse', '--show-toplevel'], cwd));
}

const isAbs = (p) => p.startsWith('/') || /^[A-Za-z]:\//.test(p);
const fold = (p) => (WIN ? p.toLowerCase() : p);

// Returns the repo-relative path, or null when the target is outside the repo.
function relToRoot(target, root, cwd) {
	let t = norm(target);
	if (WIN) t = t.replace(/^\/([A-Za-z])\//, '$1:/');
	const base = cwd && fold(norm(cwd)).startsWith(fold(root)) ? norm(cwd) : root;
	const abs = path.posix.normalize(isAbs(t) ? t : `${base}/${t}`);
	const r = fold(root).replace(/\/+$/, '');
	const a = fold(abs);
	if (a === r) return '';
	if (!a.startsWith(`${r}/`)) return null;
	return abs.slice(r.length + 1);
}

function globToRe(g) {
	const s = g
		.replace(/[.+^${}()|[\]\\]/g, '\\$&')
		.replace(/\*\*/g, '\u0000')
		.replace(/\*/g, '[^/]*')
		.replace(/\?/g, '[^/]')
		.replace(/\u0000/g, '.*');
	return new RegExp(`^${s}$`);
}

const BASEHEAD = 'site/src/components/BaseHead.astro';
const isProtectedSelf = (rel) =>
	rel === '.claude/settings.json' || rel === '.claude/settings.local.json' || rel === '.claude/hooks' || rel.startsWith('.claude/hooks/');

function checkFileTool(tool, input, root, cwd, off) {
	const target = input.file_path ?? input.notebook_path ?? null;
	if (typeof target !== 'string') return {};
	const rel = relToRoot(target, root, cwd);
	if (rel === null) return {};
	if (!off) {
		if (isProtectedSelf(rel)) return { deny: SELF_ERR };
		if (rel === 'site/public/robots.txt') return { deny: IDX_ERR };
		if (rel === BASEHEAD) {
			const texts = [];
			if (tool === 'Write') {
				if (!/const\s+SITE_WIDE_NOINDEX\s*=\s*true\b/.test(String(input.content ?? ''))) return { deny: IDX_ERR };
			} else if (tool === 'MultiEdit') {
				for (const e of input.edits ?? []) texts.push(e.old_string, e.new_string);
			} else {
				texts.push(input.old_string, input.new_string, input.new_source);
			}
			if (texts.some((t) => typeof t === 'string' && t.includes('SITE_WIDE_NOINDEX'))) return { deny: IDX_ERR };
		}
	}
	return { rel };
}

function activeTicketPaths(root) {
	const dir = `${root}/site/planning/tickets`;
	let files;
	try {
		files = readdirSync(dir).filter((f) => f.endsWith('.md'));
	} catch {
		return null;
	}
	const active = [];
	for (const f of files) {
		const head = readFileSync(`${dir}/${f}`, 'utf8').split('\n').slice(0, 25);
		const st = head.map((l) => /^\*{0,2}Status:\*{0,2}\s*(.+?)\s*$/.exec(l)).find(Boolean);
		if (st && /^(READY|IN PROGRESS)\b/.test(st[1].replace(/\*/g, ''))) active.push({ f, head });
	}
	if (active.length !== 1) return null;
	const line = active[0].head.find((l) => /^\*{0,2}Authorized paths:/.test(l));
	if (!line) return null;
	const entries = [...line.matchAll(/`([^`]+)`/g)].map((m) => m[1]).filter((e) => !e.includes('\\'));
	return { name: active[0].f, entries, pushScope: parsePushScope(active[0].head) };
}

// Backticked branch globs before the first "(" or ";". Missing or malformed gives null (no warning).
function parsePushScope(head) {
	const line = head.find((l) => /^\*{0,2}Push scope:/.test(l));
	if (!line) return null;
	const entries = [...line.split(/[(;]/)[0].matchAll(/`([^`]+)`/g)].map((m) => m[1]);
	if (entries.length === 0 || entries.some((e) => !/^[A-Za-z0-9._\/*?-]+$/.test(e) || e === 'main' || e === 'staging')) return null;
	return entries;
}

function warnFor(rel, root) {
	const t = activeTicketPaths(root);
	if (!t || t.entries.length === 0) return null;
	if (t.entries.some((e) => globToRe(e).test(rel))) return null;
	return `Authorized-path warning: ${rel} is outside the Authorized paths of the active ticket ${t.name}. Stay within them unless Amul has re-scoped the ticket.`;
}

// ---- Bash ----
const WRITE_IND = /(>|\btee\b|\bsed\s+(-\S*\s+)*-i|\bperl\s+(-\S*\s+)*-i|\bmv\b|\bcp\b|\brm\b|\bgit\s+(checkout|restore|apply)\b)/;
const SELF_IND = new RegExp(`${WRITE_IND.source}|\\b(del|rmdir|Remove-Item|Set-Content|Add-Content|Out-File)\\b`, 'i');

const unquote = (s) => s.replace(/^['"]|['"]$/g, '');

function pushesMain(cmd, cwd) {
	const re = /\bgit\b((?:\s+(?:-C\s+\S+|-c\s+\S+|--[\w-]+(?:=\S+)?))*)\s+push\b([^;&|\n]*)/g;
	for (const m of cmd.matchAll(re)) {
		const toks = m[2].trim().split(/\s+/).filter(Boolean);
		const pos = [];
		for (let i = 0; i < toks.length; i++) {
			const t = toks[i];
			if (t === '--all' || t === '--mirror') return true;
			if (/^(-o|--push-option|--repo|--receive-pack|--exec)$/.test(t)) i++;
			else if (!t.startsWith('-')) pos.push(unquote(t));
		}
		const refspecs = pos.slice(1);
		let needBranch = refspecs.length === 0;
		for (const r of refspecs) {
			const dest = r.replace(/^\+/, '').split(':').pop();
			if (dest === 'main' || dest === 'refs/heads/main') return true;
			if (!r.includes(':') && dest === 'HEAD') needBranch = true;
		}
		if (needBranch) {
			const c = /-C\s+(\S+)/.exec(m[1]);
			let branch = '';
			try {
				branch = git(['branch', '--show-current'], c ? unquote(c[1]) : cwd);
			} catch (e) {
				process.stderr.write(`guard: branch lookup failed (${String(e.message).split('\n')[0]}); allowing\n`);
			}
			if (branch === 'main') return true;
		}
	}
	return false;
}

// ---- TP2.7: force, staging ancestry, push scope (main is handled by pushesMain) ----
const FORCE_ERR = 'guard: force push denied. Claude sessions never force push; Amul does that outside the session.';
const SAFE_REF = /^[A-Za-z0-9._\/@{}^~-]+$/;
const stripHeads = (r) => r.replace(/^refs\/heads\//, '');
const stagingErr = (cause) =>
	`guard: staging push denied (${cause}). Executors never push staging; the Planner pushes only a fast-forward of origin/staging on Amul's typed instruction.`;

// Every `git ... push ...` in the command as {cwd, force, del, pos}.
function parsePushes(cmd, cwd) {
	const re = /\bgit\b((?:\s+(?:-C\s+\S+|-c\s+\S+|--[\w-]+(?:=\S+)?))*)\s+push\b([^;&|\n]*)/g;
	const out = [];
	for (const m of cmd.matchAll(re)) {
		const toks = m[2].trim().split(/\s+/).filter(Boolean);
		const p = { cwd, force: false, del: false, pos: [] };
		const c = /-C\s+(\S+)/.exec(m[1]);
		if (c) p.cwd = path.resolve(cwd, unquote(c[1]));
		for (let i = 0; i < toks.length; i++) {
			const t = toks[i];
			if (/^(-o|--push-option|--repo|--receive-pack|--exec)$/.test(t)) i++;
			else if (t === '--delete') p.del = true;
			else if (/^--force(-with-lease|-if-includes)?(=.*)?$/.test(t)) p.force = true;
			else if (/^-[A-Za-z]+$/.test(t)) {
				if (t.includes('f')) p.force = true;
				if (t.includes('d')) p.del = true;
			} else if (!t.startsWith('-')) p.pos.push(unquote(t));
		}
		out.push(p);
	}
	return out;
}

function currentBranch(cwd) {
	try {
		return git(['branch', '--show-current'], cwd);
	} catch (e) {
		process.stderr.write(`guard: branch lookup failed (${String(e.message).split('\n')[0]}); allowing\n`);
		return null;
	}
}

// Refspecs of one push as {raw, src, dest, plus}; dest null when the current branch is unknown.
function destinations(p) {
	const refspecs = p.pos.slice(1);
	const list = [];
	let branch;
	const cur = () => (branch === undefined ? (branch = currentBranch(p.cwd)) : branch);
	if (refspecs.length === 0) list.push({ raw: '', src: 'HEAD', dest: cur(), plus: false });
	for (const r0 of refspecs) {
		const plus = r0.startsWith('+');
		const r = r0.replace(/^\+/, '');
		if (p.del) list.push({ raw: r0, src: null, dest: stripHeads(r), plus });
		else if (r.includes(':')) {
			const i = r.indexOf(':');
			list.push({ raw: r0, src: r.slice(0, i) || null, dest: stripHeads(r.slice(i + 1)), plus });
		} else if (r === 'HEAD') list.push({ raw: r0, src: 'HEAD', dest: cur(), plus });
		else list.push({ raw: r0, src: r, dest: stripHeads(r), plus });
	}
	return list;
}

// Deny message for a staging destination unless the source descends from the local origin/staging ref.
function stagingCheck(d, cwd) {
	if (d.src === null) return stagingErr('delete or empty source');
	if (!SAFE_REF.test(d.src)) return stagingErr('unparseable refspec');
	let base;
	try {
		base = git(['rev-parse', '--verify', '--quiet', 'refs/remotes/origin/staging^{commit}'], cwd);
	} catch {
		return stagingErr('local origin/staging ref missing; run git fetch');
	}
	let src;
	try {
		src = git(['rev-parse', '--verify', '--quiet', '--end-of-options', `${d.src}^{commit}`], cwd);
	} catch {
		return stagingErr('source does not resolve to a commit');
	}
	try {
		execFileSync('git', ['merge-base', '--is-ancestor', base, src], { cwd, stdio: 'ignore' });
		return null;
	} catch (e) {
		return e.status === 1 ? stagingErr('source does not descend from origin/staging') : stagingErr('ancestry lookup failed');
	}
}

// Returns {deny}, {warn} or {}. Main pushes are denied earlier by pushesMain.
function checkPushes(cmd, cwd, root) {
	const dests = [];
	for (const p of parsePushes(cmd, cwd)) for (const d of destinations(p)) dests.push({ ...d, p });
	if (dests.some((d) => d.p.force || d.plus)) return { deny: FORCE_ERR };
	for (const d of dests) {
		const unparsed = d.dest !== null && !SAFE_REF.test(d.dest);
		if (d.dest === 'staging' || (unparsed && /staging|\*/.test(d.dest))) {
			const e = stagingCheck(d, d.p.cwd);
			if (e) return { deny: e };
		}
	}
	const scope = activeTicketPaths(root)?.pushScope;
	if (scope) {
		for (const d of dests) {
			if (d.dest && d.dest !== 'staging' && !scope.some((e) => globToRe(e).test(d.dest))) {
				return { warn: `Push-scope warning: ${d.dest} is outside the Push scope of the active ticket. Push only to the branches the ticket names unless Amul has re-scoped it.` };
			}
		}
	}
	return {};
}

function emitWarn(w) {
	process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: w } }));
}

function checkBash(cmd, cwd, root) {
	if (pushesMain(cmd, cwd)) return { deny: MAIN_ERR };
	const r = checkPushes(cmd, cwd, root);
	if (r.deny) return r;
	const c = norm(cmd).replace(/\d*>&\d+|\d*>\s*\/dev\/null/g, '');
	if (/robots\.txt|BaseHead\.astro|SITE_WIDE_NOINDEX/.test(c) && WRITE_IND.test(c)) return { deny: IDX_ERR };
	if (/\.claude\/(settings(\.local)?\.json|hooks)/.test(c) && SELF_IND.test(c)) return { deny: SELF_ERR };
	return r;
}

function main() {
	const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
	const tool = input.tool_name;
	const ti = input.tool_input ?? {};
	const cwd = input.cwd || process.cwd();
	const off = process.env.MBP_GUARD_OFF === '1';
	if (tool === 'Bash') {
		if (off) return 0;
		const r = checkBash(String(ti.command ?? ''), cwd, repoRoot(cwd));
		if (r.deny) {
			process.stderr.write(`${r.deny}\n`);
			return 2;
		}
		if (r.warn) emitWarn(r.warn);
		return 0;
	}
	if (!['Edit', 'Write', 'MultiEdit', 'NotebookEdit'].includes(tool)) return 0;
	const root = repoRoot(cwd);
	const r = checkFileTool(tool, ti, root, cwd, off);
	if (r.deny) {
		process.stderr.write(`${r.deny}\n`);
		return 2;
	}
	if (r.rel) {
		const w = warnFor(r.rel, root);
		if (w) {
			process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: w } }));
		}
	}
	return 0;
}

try {
	process.exitCode = main();
} catch (e) {
	process.stderr.write(`guard: internal error, failing open: ${String(e.message).split('\n')[0]}\n`);
	process.exitCode = 0;
}

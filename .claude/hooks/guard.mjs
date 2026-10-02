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
	return { name: active[0].f, entries };
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

function checkBash(cmd, cwd) {
	if (pushesMain(cmd, cwd)) return MAIN_ERR;
	const c = norm(cmd).replace(/\d*>&\d+|\d*>\s*\/dev\/null/g, '');
	if (/robots\.txt|BaseHead\.astro|SITE_WIDE_NOINDEX/.test(c) && WRITE_IND.test(c)) return IDX_ERR;
	if (/\.claude\/(settings(\.local)?\.json|hooks)/.test(c) && SELF_IND.test(c)) return SELF_ERR;
	return null;
}

function main() {
	const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
	const tool = input.tool_name;
	const ti = input.tool_input ?? {};
	const cwd = input.cwd || process.cwd();
	const off = process.env.MBP_GUARD_OFF === '1';
	if (tool === 'Bash') {
		if (off) return 0;
		const d = checkBash(String(ti.command ?? ''), cwd);
		if (d) {
			process.stderr.write(`${d}\n`);
			return 2;
		}
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

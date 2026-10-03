// Read-only repository status and Planner handoff claim-check (TP2.5).
// No writes, no fetch, no network. Node and git only.
//   node scripts/project-status.mjs                    status report
//   node scripts/project-status.mjs --check <handoff>  claim-check a handoff's ```claims block
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REF_RE = /^[A-Za-z0-9._][A-Za-z0-9._/-]*$/;
const SHA_RE = /^[0-9a-f]{7,40}$/;
const ID_RE = /^[A-Za-z0-9][A-Za-z0-9.]*$/;
const STATUS_RE = /^[A-Za-z0-9][A-Za-z0-9 _-]*$/;
const STALE_MS = 10 * 60 * 1000;
const WRAP = 96;

class GitFailure extends Error {}

// Argument arrays only, never a shell string. Returns trimmed stdout and stderr.
function git(args) {
  try {
    const stdout = execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: SITE_ROOT,
    });
    return { out: stdout.trim() };
  } catch (e) {
    if (e.status === undefined || e.status === null) {
      throw new GitFailure(`cannot run git: ${e.message.split('\n')[0]}`);
    }
    const err = new GitFailure(`git ${args[0]} failed (exit ${e.status})`);
    err.status = e.status;
    err.stderr = String(e.stderr ?? '');
    throw err;
  }
}

const clean = (s, n = 80) => String(s).replace(/[^\x20-\x7E]/g, '?').slice(0, n);

// Resolves a validated ref to exactly one commit. Throws a short reason on failure.
function resolveCommit(name) {
  if (!REF_RE.test(name)) throw new Error('unsafe ref name');
  let res;
  try {
    // execFileSync discards stderr on success, so ambiguity is probed separately.
    res = git(['rev-parse', '--verify', '--end-of-options', `${name}^{commit}`]);
  } catch (e) {
    if (e instanceof GitFailure && e.status) throw new Error('ref does not resolve to exactly one commit');
    throw e;
  }
  if (!/^[0-9a-f]{40}$/.test(res.out)) throw new Error('ref did not yield one commit');
  if (refIsAmbiguous(name)) throw new Error('ref matches more than one object');
  return res.out;
}

// A name that exists as more than one ref kind (e.g. branch and tag) is ambiguous.
function refIsAmbiguous(name) {
  const hits = git(['for-each-ref', '--format=%(refname)', `refs/${name}`, `refs/tags/${name}`, `refs/heads/${name}`, `refs/remotes/${name}`])
    .out.split('\n').filter(Boolean);
  return new Set(hits).size > 1;
}

function short(sha) {
  return sha ? sha.slice(0, 7) : '(none)';
}

function tryResolve(name) {
  try {
    return git(['rev-parse', '--verify', '--end-of-options', `${name}^{commit}`]).out;
  } catch {
    return null;
  }
}

function aheadBehind(a, b) {
  if (!a || !b) return 'n/a';
  const [ahead, behind] = git(['rev-list', '--left-right', '--count', `${a}...${b}`]).out.split(/\s+/);
  return `${ahead} ahead / ${behind} behind`;
}

// Status: only from the header block (lines before the first "## "), plain or bold form.
function headerStatus(text) {
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith('## ')) return null;
    const m = line.match(/^(?:\*\*)?Status:(?:\*\*)?[ \t]*(.+?)[ \t]*$/);
    if (m) return m[1].replace(/\*+$/, '').trim() || null;
  }
  return null;
}

function itemId(file, isSprint) {
  const m = isSprint ? file.match(/^(sprint-\d+)-/) : file.match(/^([A-Za-z0-9.]+)-/);
  return m ? m[1] : file.replace(/\.md$/, '');
}

function wrapList(items, indent = '  ') {
  const lines = [];
  let cur = indent;
  for (const it of items) {
    const piece = (cur.trim() ? '; ' : '') + it;
    if (cur.length + piece.length > WRAP && cur.trim()) {
      lines.push(cur + ';');
      cur = indent + it;
    } else {
      cur += piece;
    }
  }
  if (cur.trim()) lines.push(cur);
  return lines;
}

function status() {
  const lines = [];
  const branch = git(['branch', '--show-current']).out || '(detached)';
  const head = tryResolve('HEAD');
  const staging = tryResolve('origin/staging');
  const main = tryResolve('origin/main');
  lines.push(`branch        ${branch}`);
  lines.push(`HEAD          ${short(head)}`);
  lines.push(`origin/staging ${short(staging)}`);
  lines.push(`origin/main    ${short(main)}`);
  lines.push(`HEAD vs staging     ${aheadBehind(head, staging)}`);
  lines.push(`staging vs main     ${aheadBehind(staging, main)}`);
  const porcelain = git(['status', '--porcelain']).out.split('\n').filter(Boolean);
  if (porcelain.length === 0) {
    lines.push('working tree  clean');
  } else {
    const untracked = porcelain.filter((l) => l.startsWith('??')).length;
    lines.push(`working tree  DIRTY: ${porcelain.length - untracked} changed, ${untracked} untracked`);
  }

  const fetchHead = resolve(SITE_ROOT, git(['rev-parse', '--git-path', 'FETCH_HEAD']).out);
  if (!existsSync(fetchHead)) {
    lines.push('last fetch    WARNING: no FETCH_HEAD, run git fetch before trusting refs');
  } else {
    const ageMs = Date.now() - statSync(fetchHead).mtimeMs;
    const mins = Math.floor(ageMs / 60000);
    lines.push(`last fetch    ${mins} min ago${ageMs > STALE_MS ? ' WARNING: stale (over 10 min), run git fetch' : ''}`);
  }

  const open = [];
  for (const [dir, isSprint] of [['sprints', true], ['tickets', false]]) {
    const base = join(SITE_ROOT, 'planning', dir);
    if (!existsSync(base)) continue;
    for (const f of readdirSync(base).filter((n) => n.endsWith('.md')).sort()) {
      const st = headerStatus(readFileSync(join(base, f), 'utf8'));
      if (st === 'CLOSED') continue;
      open.push(`${itemId(f, isSprint)} · ${st ?? 'UNPARSED'}`);
    }
  }
  lines.push(`not CLOSED (${open.length}):`);
  lines.push(...(open.length ? wrapList(open) : ['  none']));
  lines.push(...staleRows());
  console.log(lines.join('\n'));
}

// A sprint-contract ticket row that says "not yet on `staging`" while that ticket's file on
// origin/staging is CLOSED or VERIFIED LOCAL. One row pattern only; lookup failures are skipped.
function staleRows() {
  const base = join(SITE_ROOT, 'planning', 'sprints');
  if (!existsSync(base)) return [];
  const hits = [];
  for (const f of readdirSync(base).filter((n) => n.endsWith('.md')).sort()) {
    for (const row of readFileSync(join(base, f), 'utf8').split(/\r?\n/)) {
      const m = row.match(/^\|\s*`([A-Za-z0-9.]+)`\s*\|/);
      if (!m || !/not yet on `staging`/.test(row)) continue;
      let st = null;
      try {
        st = stagingTicketStatus(m[1]);
      } catch {
        continue;
      }
      if (st === 'CLOSED' || st === 'VERIFIED LOCAL') hits.push(`STALE? ${itemId(f, true)} row ${m[1]} says not yet on staging; ticket is ${st} on origin/staging`);
    }
  }
  return hits;
}

// Parse the first ```claims block. Returns array of {n, text}.
function readClaims(file) {
  if (!existsSync(file)) throw new Error('handoff file not found');
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  const open = lines.findIndex((l) => /^```claims[ \t]*$/.test(l));
  if (open < 0) throw new Error('no ```claims block in handoff');
  const claims = [];
  for (let i = open + 1; i < lines.length; i++) {
    if (/^```/.test(lines[i])) return claims;
    const t = lines[i].trim();
    if (t === '' || t.startsWith('#')) continue;
    claims.push({ n: i + 1, text: t });
  }
  throw new Error('unterminated ```claims block');
}

function stagingTicketStatus(id) {
  if (!ID_RE.test(id)) throw new Error('unsafe ticket id');
  const tree = git(['ls-tree', '-r', '--full-tree', '--name-only', 'origin/staging', '--', 'site/planning/tickets/']).out.split('\n');
  const hits = tree.filter((p) => {
    const b = p.split('/').pop();
    return b === `${id}.md` || b.startsWith(`${id}-`);
  });
  if (hits.length !== 1) throw new Error(`ticket ${hits.length ? 'ambiguous' : 'not found'} on origin/staging`);
  return headerStatus(git(['show', `origin/staging:${hits[0]}`]).out);
}

// Returns {ok, detail}; never throws for a bad claim, so a bad claim is a MISMATCH.
function evalClaim(text) {
  let m;
  try {
    if ((m = text.match(/^ref\s+(\S+)\s*=\s*(\S+)$/))) {
      const [, name, sha] = m;
      if (!REF_RE.test(name)) return { ok: false, detail: 'unsafe ref name / not evaluated' };
      if (!SHA_RE.test(sha)) return { ok: false, detail: 'invalid sha / not evaluated' };
      const actual = resolveCommit(name);
      return actual.startsWith(sha) ? { ok: true } : { ok: false, detail: `${sha} / ${short(actual)}` };
    }
    if ((m = text.match(/^ancestor\s+(\S+)\s+(\S+)$/))) {
      const [, sha, name] = m;
      if (!SHA_RE.test(sha)) return { ok: false, detail: 'invalid sha / not evaluated' };
      if (!REF_RE.test(name)) return { ok: false, detail: 'unsafe ref name / not evaluated' };
      const a = resolveCommit(sha);
      const b = resolveCommit(name);
      try {
        git(['merge-base', '--is-ancestor', a, b]);
        return { ok: true };
      } catch (e) {
        if (e instanceof GitFailure && e.status === 1) return { ok: false, detail: 'is ancestor / not an ancestor' };
        throw e;
      }
    }
    if ((m = text.match(/^status\s+(\S+)\s*=\s*(.+)$/))) {
      const [, id, want] = m;
      const expected = want.trim();
      if (!ID_RE.test(id)) return { ok: false, detail: 'unsafe ticket id / not evaluated' };
      if (!STATUS_RE.test(expected)) return { ok: false, detail: 'invalid status value / not evaluated' };
      const actual = stagingTicketStatus(id) ?? 'UNPARSED';
      return actual === expected ? { ok: true } : { ok: false, detail: `${expected} / ${actual}` };
    }
  } catch (e) {
    return { ok: false, detail: `${clean(e.message, 60)} / not evaluated` };
  }
  return { ok: false, detail: 'unparseable claim line / not evaluated' };
}

function check(file) {
  const claims = readClaims(file);
  if (claims.length === 0) throw new Error('claims block has no claims');
  let bad = 0;
  for (const c of claims) {
    const r = evalClaim(c.text);
    if (r.ok) {
      console.log(`OK        ${clean(c.text)}`);
    } else {
      bad++;
      console.log(`MISMATCH  ${clean(c.text)}  [${r.detail}]`);
    }
  }
  console.log(`${claims.length - bad}/${claims.length} claims OK${bad ? `, ${bad} MISMATCH` : ''}`);
  console.log('Reminder: prose outside the claims block is not checked; verify it manually against the repository.');
  return bad === 0;
}

try {
  const args = process.argv.slice(2);
  if (args[0] === '--check') {
    if (args.length !== 2) throw new Error('usage: --check <handoff-file>');
    process.exit(check(resolve(args[1])) ? 0 : 1);
  }
  if (args.length) throw new Error('usage: project-status.mjs [--check <handoff-file>]');
  status();
} catch (e) {
  console.error(`project-status: ${clean(e.message, 160)}`);
  process.exit(1);
}

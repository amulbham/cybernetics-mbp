# TP2.6 — Bounded Claude hooks: main-push, indexing and authorized-path guards

Status: DRAFT
Mode: IMPLEMENTATION
Risk: R2
Branch: staging
Depends on: TP2.5 CLOSED (`staging @ 1bea89d`, Actions run #91 green; closure recorded in this ticket's draft commit)
Unlocks: nothing drafted (versioning decision and Ticket D follow separately)
Inherits: `PLANNING.md` §2, §9, §13 @ `1bea89d`; `site/AGENTS.md` "Indexing state" @ `1bea89d`; `planning/templates/ticket-contract.md` @ `1bea89d`
Authorized paths: `.claude/settings.json`, `.claude/hooks/guard.mjs`, `.claude/hooks/guard.test.mjs`, `site/CHANGELOG.md`, `site/planning/tickets/TP2.6-*.md`

## Goal
Claude Code sessions in this repo are mechanically stopped from the three highest-cost mistakes (pushing `main`, touching indexing controls, editing outside the sealed ticket's authorized paths) without becoming the only line of defence.

## Why now
The prose rules exist (`AGENTS.md` "Indexing state", ticket `Authorized paths:`, "production needs Amul's typed go") and rest on every session remembering them. Executors now run unattended on Amul's machine from sealed tickets, so a slip costs a production or discovery change. Amul sequenced hooks after TP2.5 (2026-10-01 22:19Z).

## Starting state
- `.claude/` holds `rules/` and `skills/` only. There is no `.claude/settings.json` and no hook.
- `PLANNING.md` says layered enforcement is prose → Claude hook → tool-neutral guard → deployed verification; no invariant may rely on a hook alone (infra plan, "Layered enforcement").
- Indexing state lives in `site/public/robots.txt` and the `SITE_WIDE_NOINDEX` constant in `site/src/components/BaseHead.astro`.
- Tickets carry `Authorized paths:` in the header; `project-status.mjs` (TP2.5) already parses ticket header `Status:` lines.

## Decisions already frozen
- Amul, 2026-10-01: hooks are their own ticket after TP2.5; no CI guard or branch protection (Ticket D) here.
- Hooks stay Claude-only routing. Canonical rules stay vendor-neutral prose in `PLANNING.md`/`AGENTS.md`.
- **§13 one-intent: Product Authority re-scope for TP2.6** is asked at approval.

## Questions this ticket may answer
- Which channel makes a warn-only message visible to the model on the installed Claude Code (stderr, JSON `additionalContext`, or a log). Record the working one.
- Whether the hook command runs unchanged on Amul's Windows machine and in the cloud container.

## Scope
1. **`.claude/hooks/guard.mjs`**: one Node script (no dependency) reading the PreToolUse JSON from stdin. It exits 2 with a one-line reason on a deny, 0 otherwise. An internal error (bad JSON, git failure) logs one line to stderr and exits 0: the hook fails open, because layers beyond it exist.
   - **Main push (deny):** a `Bash` command containing `git push` whose refspec destination is `main` or `refs/heads/main` (`origin main`, `HEAD:main`, `HEAD:refs/heads/main`, `+x:main`), any `--all`/`--mirror`, or a bare `git push` while the current branch is `main`. Pushes to `staging` and other branches stay allowed.
   - **Indexing (deny):** `Edit`/`Write`/`MultiEdit` to `site/public/robots.txt`; any edit to `site/src/components/BaseHead.astro` whose old or new text contains `SITE_WIDE_NOINDEX`, or a `Write` leaving that constant not `true`; a `Bash` command that names `robots.txt` or `SITE_WIDE_NOINDEX` together with a write indicator (`>`, `>>`, `tee`, `sed -i`, `perl -i`, `mv`, `cp`, `rm`, `git checkout`, `git restore`, `git apply`). Read-only commands (`cat`, `grep`, `rg`, `git diff/log/show`) pass.
   - **Self-protection (deny):** agent edits to `.claude/settings.json`, `.claude/settings.local.json` and `.claude/hooks/`.
   - **Authorized-path (warn only):** the active ticket is the single ticket under `site/planning/tickets/` whose header `Status:` is `READY`. When exactly one exists, parse its `Authorized paths:` backticked entries (globs allowed, repo-relative only; backslash `AI-Orchestrator\` entries are ignored). An `Edit`/`Write`/`MultiEdit`/`NotebookEdit` target inside the repo that matches none produces a warning and exit 0. With zero or several READY tickets, the check is skipped silently.
   - **Override:** `MBP_GUARD_OFF=1` in the environment disables the deny rules. Only Amul sets it, from outside the session. There is no in-band override.
2. **`.claude/settings.json`**: one `PreToolUse` entry, matcher `Bash|Edit|Write|MultiEdit|NotebookEdit`, command `node "$CLAUDE_PROJECT_DIR/.claude/hooks/guard.mjs"`. Nothing else in the file.
3. **`.claude/hooks/guard.test.mjs`**: `node --test` cases for every rule above, run in the repo with a temporary fixture ticket directory. No new dependency.
4. **`CHANGELOG.md`:** one dated governance entry.

## Explicit exclusions
`PLANNING.md`, `AGENTS.md`, `CLAUDE.md` files, `.claude/rules/`, `.claude/skills/`, `site/package.json`, workflows, `robots.txt`, `BaseHead.astro` (read-only here), branch protection, CI guards (Ticket D), `AI-Orchestrator\` and `~/.codex/config.toml`, closed tickets, Sprint 18 files, any hook beyond PreToolUse, and any deny rule beyond the three listed.

## Implementation contract
- The guard never writes a file, runs a shell, or shells out beyond `git branch --show-current`.
- Tool input is untrusted: command text is only pattern-matched, never executed or interpolated.
- Deny messages name the rule and the human route (Amul acts outside the session); they never describe how to bypass it from inside.

## Acceptance criteria
- `git diff --name-only <seal>` is a subset of the Authorized paths; `.claude/settings.json` holds only the one hook.
- `node --test .claude/hooks/guard.test.mjs` passes, and each deny case exits 2.
- Allowed cases (staging push, `cat robots.txt`, `git diff` on `BaseHead.astro`, edits inside the ticket's paths) exit 0 with no output.
- A live Claude Code session in the repo is denied `git push --dry-run origin HEAD:main` and is not denied `git status`.
- The authorized-path warning is visible to the model on the channel recorded under Questions.

## Validation matrix
| Layer | Check | Expected |
|---|---|---|
| Unit | `node --test .claude/hooks/guard.test.mjs` | All pass |
| Settings | `node -e` parses `.claude/settings.json` | Valid JSON, one `PreToolUse` hook |
| Live (Amul's machine) | Fresh Claude session in the executor worktree after commit: run `git push --dry-run origin HEAD:main`, then `git status` | First denied, second runs |
| Live (cloud) | Same two commands in a cloud session on the branch | Same result |
| Build | `npm run build` | Passes, or the known sandbox failure. Staging Actions decides |

## Adversarial tests
- Push variants: `git push origin main`, `HEAD:main`, `HEAD:refs/heads/main`, `+x:main`, `--force origin main`, `--all`, `-C site push origin main`: each exits 2. `git push origin staging` and `git push origin claude/x` exit 0.
- Indexing: an `Edit` to `robots.txt`, an `Edit` introducing `SITE_WIDE_NOINDEX = false`, `sed -i s/true/false/ ... BaseHead.astro` naming the constant, `echo Allow: / > site/public/robots.txt`: each exits 2. `grep SITE_WIDE_NOINDEX` exits 0.
- Self-protection: an `Edit` of `.claude/hooks/guard.mjs` and of `settings.json` exit 2.
- Fail open: malformed JSON on stdin exits 0 with one stderr line.
- `MBP_GUARD_OFF=1` turns every deny into exit 0; unset restores it (restoration proof).

## Regression boundaries
Site build, output, content and all existing `.claude/rules/` and skills stay byte-for-byte unchanged. Routine commands (`git status`, `npm run build`, edits within a sealed ticket) must not be denied.

## Documentation updates
`CHANGELOG.md` only. Stale language to search: any statement that no `.claude/settings.json` or hook exists.

## Git and deployment boundary
R2 choreography per §13: seal commit, then one completion commit by a fresh Executor on its own branch, local live checks evidenced. The Executor never pushes `staging` or `main`. The Planner fast-forwards `staging` only on Amul's typed instruction. Closure needs a green staging build and is recorded in the next planning commit. No `main`.

## Stop conditions
The hook command cannot run on Amul's machine without a different path or shell form; a deny rule blocks a routine allowed command; the warn channel is unusable; or the rules need a CI guard, branch protection or a `PLANNING.md` change.

## Pre-seal review
Not yet run. R2 requires one outside reviewer (Codex) with `file:line` evidence, started by Amul's typed message.

## Required completion report
Standard template (`planning/templates/completion-report.md`).

## Done when
The guard denies the three rule classes, warns on out-of-ticket edits, fails open on its own errors, is proven live in two environments, staging Actions is green, and nothing outside the Authorized paths changed.

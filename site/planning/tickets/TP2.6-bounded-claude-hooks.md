# TP2.6 — Bounded Claude hooks: main-push, indexing and authorized-path guards

Status: READY
Mode: IMPLEMENTATION
Risk: R2
Branch: staging
Depends on: TP2.5 CLOSED (`staging @ 1bea89d`, Actions run #91 green; closure recorded in this ticket's draft commit)
Unlocks: nothing drafted (versioning decision and Ticket D follow separately)
Inherits: `PLANNING.md` §2, §9, §13 @ `1bea89d`; `site/AGENTS.md` "Indexing state" @ `1bea89d`; `planning/templates/ticket-contract.md` @ `1bea89d`
Authorized paths: `.claude/settings.json`, `.claude/hooks/guard.mjs`, `.claude/hooks/guard.test.mjs`, `site/CHANGELOG.md`, `site/planning/tickets/TP2.6-*.md`

## Goal
Claude Code sessions in this repo are mechanically stopped from two high-cost mistakes (pushing `main`, touching indexing controls) and advised when they edit outside the sealed ticket's authorized paths. The advice is a warning with stated skip conditions, not enforcement. The hook is never the only line of defence.

## Why now
The prose rules exist (`AGENTS.md` "Indexing state", ticket `Authorized paths:`, "production needs Amul's typed go") and rest on every session remembering them. Executors now run unattended on Amul's machine from sealed tickets, so a slip costs a production or discovery change. Amul sequenced hooks after TP2.5 (2026-10-01 22:19Z).

## Starting state
- `.claude/` holds `rules/` and `skills/` only. There is no `.claude/settings.json` and no hook.
- Existing protections are prose only: `AGENTS.md` "Indexing state", ticket `Authorized paths:`, and the typed-go rule for production. The layered-enforcement principle (prose → Claude hook → tool-neutral guard → deployed verification; no invariant relies on a hook alone) is in the infra plan, `/mnt/project-files/notes/md-infrastructure-plan.md`, not `PLANNING.md`. The tool-neutral and deployed layers are excluded here (Ticket D), so fail-open means this hook plus prose until then.
- Indexing state lives in `site/public/robots.txt` and the `SITE_WIDE_NOINDEX` constant in `site/src/components/BaseHead.astro`.
- Tickets carry `Authorized paths:` in the header; `project-status.mjs` (TP2.5) already parses ticket header `Status:` lines.

## Decisions already frozen
- Amul, 2026-10-01: hooks are their own ticket after TP2.5; no CI guard or branch protection (Ticket D) here.
- Hooks stay Claude-only routing. Canonical rules stay vendor-neutral prose in `PLANNING.md`/`AGENTS.md`.
- **§13 one-intent: Product Authority re-scope for TP2.6** approved by Amul, 2026-10-02 00:07Z (decision card), the same footing as TP2.4 and TP2.5. `PLANNING.md` §13 requires this while Sprint 18 is EXECUTING.
- Amul chose no in-band override (decision card, 2026-10-02 00:07Z).

## Questions this ticket may answer
- Which channel makes a warn-only message visible to the model on the installed Claude Code (stderr, JSON `additionalContext`, or a log). Record the working one.
- Whether the hook command runs unchanged on Amul's Windows machine and in the cloud container.

## Scope
1. **`.claude/hooks/guard.mjs`**: one Node script (no dependency) reading the PreToolUse JSON from stdin. It exits 2 with a one-line reason on a deny, 0 otherwise. An internal error (bad JSON, git failure) logs one line to stderr and exits 0: the hook fails open, because layers beyond it exist.
   - **Main push (deny):** a `Bash` command containing `git push` whose refspec destination is `main` or `refs/heads/main` (`origin main`, `HEAD:main`, `HEAD:refs/heads/main`, `+x:main`), any `--all`/`--mirror`, or a bare `git push` while the current branch is `main`. Pushes to `staging` and other branches stay allowed.
   - **Indexing (deny):** `Edit`/`Write`/`MultiEdit` to `site/public/robots.txt`; any edit to `site/src/components/BaseHead.astro` whose old or new text contains `SITE_WIDE_NOINDEX`, or a `Write` leaving that constant not `true`; a `Bash` command that names `robots.txt`, `BaseHead.astro` or `SITE_WIDE_NOINDEX` together with a write indicator (`>`, `>>`, `tee`, `sed -i`, `perl -i`, `mv`, `cp`, `rm`, `git checkout`, `git restore`, `git apply`). Read-only commands (`cat`, `grep`, `rg`, `git diff/log/show`) pass.
   - **Self-protection (deny):** agent edits through `Edit`/`Write`/`MultiEdit`/`NotebookEdit` to `.claude/settings.json`, `.claude/settings.local.json` and `.claude/hooks/`, and `Bash` commands naming those paths with a write indicator (the same list as the indexing rule, plus `rm`/`del`). Bootstrap: the Executor creates the guard and test files first and adds `.claude/settings.json` last, after the unit tests pass; once it is wired, any further change to a protected file stops the Executor, who reports and waits for Amul (who sets `MBP_GUARD_OFF=1` or edits outside the session).
   - **Authorized-path (warn only):** the active ticket is the single ticket under `site/planning/tickets/` whose header `Status:` is `READY` or `IN PROGRESS` (both phases of execution, `PLANNING.md:176`). When exactly one exists, parse its `Authorized paths:` backticked entries (globs allowed, repo-relative only; backslash `AI-Orchestrator\` entries are ignored). An `Edit`/`Write`/`MultiEdit`/`NotebookEdit` target inside the repo that matches none produces a warning and exit 0. With zero or several active tickets, the check is skipped silently, and that is the documented limit of the warning.
   - **Override:** `MBP_GUARD_OFF=1` in the environment disables the deny rules. Only Amul sets it, from outside the session. There is no in-band override.
2. **`.claude/settings.json`**: one `PreToolUse` entry, matcher `Bash|Edit|Write|MultiEdit|NotebookEdit`, command `node "$CLAUDE_PROJECT_DIR/.claude/hooks/guard.mjs"`. Nothing else in the file.
3. **`.claude/hooks/guard.test.mjs`**: `node --test` cases for every rule above, run in the repo with a temporary fixture ticket directory. No new dependency.
4. **`CHANGELOG.md`:** one dated governance entry.

## Explicit exclusions
`PLANNING.md`, `AGENTS.md`, `CLAUDE.md` files, `.claude/rules/`, `.claude/skills/`, `site/package.json`, workflows, `robots.txt`, `BaseHead.astro` (read-only here), branch protection, CI guards (Ticket D), `AI-Orchestrator\` and `~/.codex/config.toml`, closed tickets, Sprint 18 files, any hook beyond PreToolUse, and any deny rule beyond the three listed.

## Implementation contract
- The guard never writes a file, runs a shell, or shells out beyond `git branch --show-current`.
- Path rule: resolve every path against the repository root (`CLAUDE_PROJECT_DIR`, else `git rev-parse --show-toplevel`), convert backslashes, resolve `.` and `..`, and compare repo-relative. Absolute paths inside the root are made relative; paths outside it are ignored by every rule.
- Tool input is untrusted: command text is only pattern-matched, never executed or interpolated.
- Deny messages name the rule and the human route (Amul acts outside the session); they never describe how to bypass it from inside.

## Acceptance criteria
- `git diff --name-only <seal>` is a subset of the Authorized paths; `.claude/settings.json` holds only the one hook.
- `node --test .claude/hooks/guard.test.mjs` passes, and each deny case exits 2.
- Allowed cases (staging push, `cat robots.txt`, `git diff` on `BaseHead.astro`, edits inside the ticket's paths other than the protected `.claude/` files) exit 0 with no output.
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
- Indexing: an `Edit` to `robots.txt`, an `Edit` introducing `SITE_WIDE_NOINDEX = false`, `sed -i s/true/false/ site/src/components/BaseHead.astro` (names the file, not the constant), `echo Allow: / > site/public/robots.txt`: each exits 2. `grep SITE_WIDE_NOINDEX` exits 0.
- Self-protection: an `Edit` of `.claude/hooks/guard.mjs` and of `settings.json`, and Bash `rm .claude/hooks/guard.mjs`, `mv .claude/settings.json x`, `echo > .claude/settings.json`: each exits 2.
- Paths: absolute, repo-relative, site-relative, Windows-separator (`site\public\robots.txt`) and `..` forms of the same target give the same result.
- Lifecycle: the authorized-path warning fires for a ticket in `READY` and in `IN PROGRESS`, and is skipped for `VERIFIED LOCAL` and `CLOSED`.
- Fail open: malformed JSON on stdin exits 0 with one stderr line.
- `MBP_GUARD_OFF=1` turns every deny into exit 0; unset restores it (restoration proof).

## Regression boundaries
Site build, output, content and all existing `.claude/rules/` and skills stay byte-for-byte unchanged. Routine commands (`git status`, `npm run build`, edits within a sealed ticket) must not be denied.

## Documentation updates
`CHANGELOG.md` only. Stale language to search: any statement that no `.claude/settings.json` or hook exists.

## Git and deployment boundary
R2 choreography per §13: seal commit, then one completion commit by a fresh Executor on its own branch, local live checks evidenced. The Executor never pushes `staging` or `main`. The Planner fast-forwards and pushes `staging` only on Amul's typed instruction, which is the whole authority for that push. Closure needs a green staging build and is recorded in the next planning commit. No `main`.

## Stop conditions
Either mandatory live environment (Amul's machine, the cloud session) is unavailable or cannot run the hook command unchanged, in which case the Executor stops and reports and unit results never substitute for live proof; a deny rule blocks a routine allowed command; a protected-file edit is needed after wiring; the warn channel is unusable; or the rules need a CI guard, branch protection or a `PLANNING.md` change.

## Pre-seal review
Reviewer: Codex gpt-6.1-sol / medium (R2), run 3982184d, on `96db446`. Verdict REVISE: 1 BLOCKER, 9 REQUIRED, 0 NEW. All incorporated, none rejected, each checked against the repo:
- BLOCKER, re-scope: recorded under Decisions already frozen (valid: `PLANNING.md:434`).
- REQUIRED: Goal reworded as advisory; layered-enforcement source corrected to the infra plan (valid: not in `PLANNING.md`); `IN PROGRESS` added to ticket selection (valid: `PLANNING.md:176`); self-protection bootstrap and Bash rules; `BaseHead.astro` path in the Bash indexing rule; path normalization rule and tests; Planner staging push covered by the typed instruction; stop-and-report for unavailable live environments.
Revision 2 was not re-reviewed; Amul approved the seal on the decision card, 2026-10-02 00:13Z.

## Required completion report
Standard template (`planning/templates/completion-report.md`).

## Done when
The guard denies the three rule classes, warns on out-of-ticket edits, fails open on its own errors, is proven live in two environments, staging Actions is green, and nothing outside the Authorized paths changed.

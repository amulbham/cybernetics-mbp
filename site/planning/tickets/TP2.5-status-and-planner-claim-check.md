# TP2.5 — Status and Planner claim-check: cheap, mechanical session recovery

Status: VERIFIED LOCAL
Mode: IMPLEMENTATION
Risk: R1
Branch: staging
Depends on: TP2.4 CLOSED (`staging @ 3c5d7b0`, Actions run #90 green; closure recorded in this ticket's draft commit)
Unlocks: nothing drafted (TP2.6 hooks are a separate earned ticket)
Inherits: `PLANNING.md` §2 and §13 @ `3c5d7b0`; `planning/templates/ticket-contract.md` @ `3c5d7b0`
Authorized paths: `site/scripts/project-status.mjs`, `site/package.json` (one `scripts` entry only), `site/CHANGELOG.md`, `site/planning/tickets/TP2.5-*.md`
Authorized local paths (Amul's machine, outside the repo): `AI-Orchestrator\README.md`, `AI-Orchestrator\planner-handoff.md`, `AI-Orchestrator\scratch\`

## Goal
A fresh Planner recovers state reliably and cheaply: one read-only command reports repository state, and a mechanical claim-check compares a handoff's checkable claims against the repository.

## Why now
The TP2.4 Planner drill passed a handoff whose state line was stale, because recovery step 4a.3 verifies refs and nothing checks each claim (TP2.4 completion report, Planner drill; adjudicated in the infra plan, "TP2.4 accepted" (2)). The first real rotation also needed a manual claim sweep that a script can do. Amul sequenced this next (2026-10-01 22:19Z).

## Starting state
- No `project:status` script exists (`site/scripts/` has only the research build and validation scripts; `site/package.json` has no status entry).
- `site/ROADMAP.md` has no `Active:` line. Active sprint and ticket state is recorded in the sprint contract's `Status:` and each ticket's `Status:`.
- Planner handoffs are free prose (`AI-Orchestrator\planner-handoff.md` template, TP2.4). The cloud Planner's live handoff is `handoffs/planner-handoff.md` in the shared project folder, a deviation from the README location because a cloud Planner can't write Amul's local folder.

## Decisions already frozen
- Amul, 2026-10-01: one ticket, no hooks. TP2.6 hooks, the AI-Orchestrator versioning decision and Ticket D stay out.
- **§13 one-intent: Product Authority re-scope for TP2.5** approved by Amul, 2026-10-01 22:36Z, on the same footing as TP2.4.
- Handoffs stay ephemeral and are overridden by repository truth. The script verifies claims; it never makes a handoff authoritative.

## Questions this ticket may answer
- Whether the `Active:` ROADMAP line is needed. Proposed answer: no, derive active state mechanically from `Status:` lines and add nothing to `ROADMAP.md`.

## Scope
1. **`site/scripts/project-status.mjs` and a `project:status` entry in `site/package.json`** (`node scripts/project-status.mjs`; Node and git only, no new dependency). Read-only: no write, no fetch, no network. Default output, under 40 lines:
   - current branch, HEAD, `origin/staging`, `origin/main` (short SHAs), ahead/behind counts between them and between HEAD and `origin/staging`, and working-tree state;
   - age of the last fetch (mtime of the path from `git rev-parse --git-path FETCH_HEAD`, so linked worktrees work), with a warning when absent or older than 10 minutes;
   - every sprint contract under `planning/sprints/` and every ticket under `planning/tickets/` whose `Status:` is not CLOSED, each as `id · Status`. `Status:` is read only from the header block (lines before the first `## `), as `Status: X` or `**Status:** X` (both forms exist: T12.3, T12.4 and T13.2 use the bold form). A file with no parseable header `Status:` is listed as `UNPARSED`, never skipped.
   Fixed part under 40 lines; the non-closed list wraps rather than dropping entries.
2. **`--check <handoff-file>`: the claim-check.** The script reads only a fenced block opened with ```` ```claims ```` in the handoff, one claim per line:
   - `ref <name> = <sha>`: `git rev-parse <name>` must start with `<sha>`;
   - `ancestor <sha> <name>`: `git merge-base --is-ancestor`;
   - `status <ticket-id> = <STATUS>`: the ticket's `Status:` line on `origin/staging` must equal it.
   `#` lines and blank lines are comments and are not claims. Output is one line per claim, `OK` or `MISMATCH expected / actual`, then a summary. Exit 0 only if the block exists, parses, has at least one claim and every claim is OK; otherwise exit 1. An unparseable line is a MISMATCH, never skipped. The script reads ticket files from `origin/staging` via `git show`, so it works from any checkout. Prose outside the block is untouched and still the Planner's manual check; the script prints a reminder to that effect.
3. **`AI-Orchestrator\planner-handoff.md`:** add an empty `claims` block to the template under "verified refs", with the three claim forms shown as comments. Add one sentence to the template's recovery list calling `npm run project:status -- --check <handoff>`.
4. **`AI-Orchestrator\README.md`, Session rotation 4a:** add the command as a step between "verify the refs" and "boot reads", a statement that exit 1 is a stop-and-report, and a note that prose claims remain a manual check. Record the shared-folder handoff location (`handoffs/planner-handoff.md` in the project folder) as a deliberate deviation for cloud Planners.
5. **`CHANGELOG.md`:** one dated governance entry. Local files are named only.

## Explicit exclusions
`PLANNING.md`, `ROADMAP.md`, Sprint 18 files (including the stale T18.4 gate text in the sprint contract), `AGENTS.md`, `CLAUDE.md` files, `.claude/`, hooks, workflows, indexing controls, code and content, closed tickets (the TP2.4 closure line is recorded in the draft commit, not here), `review.ps1`, `summarize.ps1`, executor handoff, version control for `AI-Orchestrator`, and any automatic fetch or rotation trigger.

## Implementation contract
- Back up `README.md` and `planner-handoff.md` to `scratch\pre-TP2.5\` before editing.
- The script uses `execFileSync` with argument arrays, never a shell string, and treats handoff text as untrusted data: it never executes or interpolates claim content beyond the three validated forms. Refs are matched against `^[A-Za-z0-9._][A-Za-z0-9._/-]*$` (no leading hyphen) and resolved with `git rev-parse --verify --end-of-options <name>^{commit}`, which must yield exactly one commit. SHAs match `^[0-9a-f]{7,40}$`.
- Absence behavior: missing file, missing block or git failure is a non-zero exit with a one-line reason.

## Acceptance criteria
- `git diff --name-only <seal>` is a subset of the repo Authorized paths, and `package.json` changes only by one added script line.
- Rejection cases (missing file or block, mismatch, unparseable line, unsafe ref) exit 1. The stale-fetch case is warning-only and its exit code is unchanged.
- `npm run project:status` on a clean staging checkout shows staging and main SHAs equal to `git rev-parse`, and lists TP2.5 (and no CLOSED ticket) as non-closed.
- `--check` against the fixture `AI-Orchestrator\scratch\fixtures\planner-handoff-live.md` (a copy of the live shared handoff with a `claims` block added, placed by Amul or the Planner before the Executor starts) exits 0. If the fixture is missing, the Executor stops and reports.
- Every adversarial case below fails closed.

## Validation matrix
| Layer | Check | Expected |
|---|---|---|
| Diff | Commands above | Within bounds |
| Status | Run in a clean checkout and in one with an uncommitted edit | Correct SHAs and counts; dirty state reported |
| Claim-check | Valid copy of the handoff with a `claims` block | Exit 0, every claim OK |
| Build | `npm run build` | Passes, or the known sandbox failure. Staging Actions is the authority |
| Drill | A fresh Planner session recovers from a handoff with one stale `status` claim, following README 4a | It runs the check, reports the MISMATCH and stops |

## Adversarial tests
Each on a copy of the handoff, restoring the copy afterward:
- a ref of `--all`, a ref with a leading hyphen, and a ref matching more than one object: each exits 1;
- a wrong SHA in a `ref` line, a wrong `status` value, an `ancestor` claim that is false: each exits 1 with a MISMATCH naming the claim;
- no `claims` block, an empty block, an unparseable line, a ref containing `;` or a space: each exits 1 with no command run on the injected text;
- run with a stale fetch (touch the `--git-path FETCH_HEAD` file back 30 minutes), in a main checkout and in a linked worktree: the warning appears and the exit code is unchanged.

## Regression boundaries
`npm run build`, `build:pdfs`, `validate:*` scripts and every site output stay byte-for-byte unchanged. No new dependency, no lockfile change.

## Documentation updates
Exactly Scope 3 to 5. Stale language to search: any README line describing 4a as "verify the refs" with no claim-check step.

## Git and deployment boundary
Commit choreography per §13, R1: seal commit, then one completion commit by a fresh Executor on its own branch with local files evidenced by hash. The Executor runs on Amul's machine because `AI-Orchestrator\` is local. The Executor never pushes `staging` or `main`. The Planner fast-forwards and pushes `staging` after review, only on Amul's explicit authorization at that time. Closure needs a green staging Actions build and is recorded in the next legitimate planning commit. No `main`.

## Stop conditions
The script would need to write, fetch or call the network; it would need to parse prose to be useful; or it needs a change to `PLANNING.md`, `ROADMAP.md` or `.claude/`.

## Pre-seal review
Reviewer: Codex gpt-6.1-sol / medium (R1), run ad83c71e, on `9dd99ab`. Verdict REVISE: 1 BLOCKER, 7 REQUIRED, 1 OPTIONAL, 0 NEW. All incorporated, none rejected:
- BLOCKER, missing §13 re-scope: recorded under Decisions already frozen.
- REQUIRED: header-only `Status:` parsing for plain and bold forms; `FETCH_HEAD` via `git rev-parse --git-path`; comment lines in the claims block; ref hardening (`--end-of-options`, no leading hyphen, one commit); acceptance wording separating rejection from warning-only cases; mandatory live-handoff fixture; staging push ban scoped to the Executor.
- OPTIONAL: 40-line cap applies to the fixed part and the list wraps.
Revision 2 was not re-reviewed; Amul approved the seal on the decision card, 2026-10-01 22:57Z.

## Required completion report
Standard template (`planning/templates/completion-report.md`).

## Done when
`npm run project:status` and `--check` behave as specified, every adversarial case fails closed, the local template and README carry the claim-check step, staging Actions is green, and nothing outside the Authorized paths changed.

## Completion report (Executor, branch claude/execute-TP2.5 from seal a44fcd4)
- Result: COMPLETE. Diff vs seal: site/scripts/project-status.mjs (new), site/package.json (+1 `project:status` script line), site/CHANGELOG.md (+3), this ticket. All within Authorized paths; no dependency or lockfile change.
- Status run (dirty worktree): staging 3c5d7b0 and main 4d0a0f4 match `git rev-parse`; counts and DIRTY state reported; non-closed list is sprint-18 and TP2.5 only, no CLOSED ticket. Clean-tree re-run after the commit: see Validation line in the push report.
- Fixture `AI-Orchestrator\scratch\fixtures\planner-handoff-live.md` (SHA-256 A4236BB1E0DEE5D5, 4801 B, copied from the shared-folder fixture as instructed): `--check` exits 0, 6/6 OK.
- Adversarial, all exit 1 with MISMATCH or a one-line reason, no command run on injected text: `--all`, leading hyphen, ambiguous ref (branch+tag `dupe`, removed after), wrong SHA, wrong status, false ancestor, `;` and space in a ref (no file `X` created), unparseable line, empty block, no block, missing file.
- Stale fetch (FETCH_HEAD mtime set back 30 min): warning shown, exit 0. Exercised in two linked worktrees (exec-TP2.5, plan-TP2.5). A true main checkout was not exercised; `git rev-parse --git-path FETCH_HEAD` is what resolves it, and I did not touch the user's main checkout.
- Fix during testing: `ls-tree` needed `--full-tree` because the script runs from `site/`; status claims then passed.
- Local files, SHA-256 prefix: README.md B624A1672758E0D5 (was CBACE0EE18A6197E), planner-handoff.md B9BB165E3A40471B (was 67EC448008DDACF7, 1249 B). Backups and hashes: scratch\pre-TP2.5\. README 4a gained the check step (exit 1 = stop, prose stays manual) and the shared-folder deviation; template gained an empty `claims` block and one recovery sentence.
- Stale-language search: no README line still describes 4a without the claim-check step.
- Not run: `npm run build` (no node_modules; no site output touched, staging Actions is the authority). Validation-matrix Drill (fresh Planner session) was not run; the stale-status MISMATCH it expects is covered by the wrong-status adversarial case.
- Untouched: review.ps1, summarize.ps1, ~/.codex/config.toml, credentials, PLANNING.md, ROADMAP.md, .claude/. Pushed branch only; staging and main not pushed.
- Remaining gate: Planner review, staging fast-forward on Amul's authorization, green Actions, closure.

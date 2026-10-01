# TP2.5 — Status and Planner claim-check: cheap, mechanical session recovery

Status: DRAFT
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
- **§13 one-intent: Product Authority re-scope for TP2.5** is asked at approval, as for TP2.3 and TP2.4.
- Handoffs stay ephemeral and are overridden by repository truth. The script verifies claims; it never makes a handoff authoritative.

## Questions this ticket may answer
- Whether the `Active:` ROADMAP line is needed. Proposed answer: no, derive active state mechanically from `Status:` lines and add nothing to `ROADMAP.md`.

## Scope
1. **`site/scripts/project-status.mjs` and a `project:status` entry in `site/package.json`** (`node scripts/project-status.mjs`; Node and git only, no new dependency). Read-only: no write, no fetch, no network. Default output, under 40 lines:
   - current branch, HEAD, `origin/staging`, `origin/main` (short SHAs), ahead/behind counts between them and between HEAD and `origin/staging`, and working-tree state;
   - age of the last fetch (mtime of `.git/FETCH_HEAD`), with a warning when absent or older than 10 minutes;
   - every sprint contract under `planning/sprints/` whose `Status:` is not CLOSED, and every ticket under `planning/tickets/` whose `Status:` is not CLOSED, each as `id · Status`.
2. **`--check <handoff-file>`: the claim-check.** The script reads only a fenced block opened with ```` ```claims ```` in the handoff, one claim per line:
   - `ref <name> = <sha>`: `git rev-parse <name>` must start with `<sha>`;
   - `ancestor <sha> <name>`: `git merge-base --is-ancestor`;
   - `status <ticket-id> = <STATUS>`: the ticket's `Status:` line on `origin/staging` must equal it.
   Output is one line per claim, `OK` or `MISMATCH expected / actual`, then a summary. Exit 0 only if the block exists, parses, has at least one claim and every claim is OK; otherwise exit 1. An unparseable line is a MISMATCH, never skipped. The script reads ticket files from `origin/staging` via `git show`, so it works from any checkout. Prose outside the block is untouched and still the Planner's manual check; the script prints a reminder to that effect.
3. **`AI-Orchestrator\planner-handoff.md`:** add an empty `claims` block to the template under "verified refs", with the three claim forms shown as comments. Add one sentence to the template's recovery list calling `npm run project:status -- --check <handoff>`.
4. **`AI-Orchestrator\README.md`, Session rotation 4a:** add the command as a step between "verify the refs" and "boot reads", a statement that exit 1 is a stop-and-report, and a note that prose claims remain a manual check. Record the shared-folder handoff location (`handoffs/planner-handoff.md` in the project folder) as a deliberate deviation for cloud Planners.
5. **`CHANGELOG.md`:** one dated governance entry. Local files are named only.

## Explicit exclusions
`PLANNING.md`, `ROADMAP.md`, Sprint 18 files (including the stale T18.4 gate text in the sprint contract), `AGENTS.md`, `CLAUDE.md` files, `.claude/`, hooks, workflows, indexing controls, code and content, closed tickets (the TP2.4 closure line is recorded in the draft commit, not here), `review.ps1`, `summarize.ps1`, executor handoff, version control for `AI-Orchestrator`, and any automatic fetch or rotation trigger.

## Implementation contract
- Back up `README.md` and `planner-handoff.md` to `scratch\pre-TP2.5\` before editing.
- The script uses `execFileSync` with argument arrays, never a shell string, and treats handoff text as untrusted data: it never executes or interpolates claim content beyond the three validated forms. Refs are matched against `^[A-Za-z0-9._/-]+$`, SHAs against `^[0-9a-f]{7,40}$`.
- Absence behavior: missing file, missing block or git failure is a non-zero exit with a one-line reason.

## Acceptance criteria
- `git diff --name-only <seal>` is a subset of the repo Authorized paths, and `package.json` changes only by one added script line.
- `npm run project:status` on a clean staging checkout shows staging and main SHAs equal to `git rev-parse`, and lists TP2.5 (and no CLOSED ticket) as non-closed.
- `--check` against the live `handoffs/planner-handoff.md` (after a `claims` block is added to a copy) exits 0.
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
- a wrong SHA in a `ref` line, a wrong `status` value, an `ancestor` claim that is false: each exits 1 with a MISMATCH naming the claim;
- no `claims` block, an empty block, an unparseable line, a ref containing `;` or a space: each exits 1 with no command run on the injected text;
- run with a stale fetch (touch `.git/FETCH_HEAD` back 30 minutes): the warning appears and the exit code is unchanged.

## Regression boundaries
`npm run build`, `build:pdfs`, `validate:*` scripts and every site output stay byte-for-byte unchanged. No new dependency, no lockfile change.

## Documentation updates
Exactly Scope 3 to 5. Stale language to search: any README line describing 4a as "verify the refs" with no claim-check step.

## Git and deployment boundary
Commit choreography per §13, R1: seal commit, then one completion commit by a fresh Executor on its own branch with local files evidenced by hash. The Executor runs on Amul's machine because `AI-Orchestrator\` is local. No push to `staging` or `main`; the Planner fast-forwards `staging` after review. Closure needs a green staging Actions build and is recorded in the next legitimate planning commit. No `main`.

## Stop conditions
The script would need to write, fetch or call the network; it would need to parse prose to be useful; or it needs a change to `PLANNING.md`, `ROADMAP.md` or `.claude/`.

## Pre-seal review
Not yet run. R1 requires one outside reviewer (Codex) per §13, started by Amul's typed message on Amul's machine.

## Required completion report
Standard template (`planning/templates/completion-report.md`).

## Done when
`npm run project:status` and `--check` behave as specified, every adversarial case fails closed, the local template and README carry the claim-check step, staging Actions is green, and nothing outside the Authorized paths changed.

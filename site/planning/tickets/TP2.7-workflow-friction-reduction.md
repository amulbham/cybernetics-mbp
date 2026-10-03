# TP2.7 — Workflow calibration and friction reduction from TP2.0–TP2.6 evidence

Status: DRAFT
Mode: IMPLEMENTATION
Risk: R2
Branch: staging
Depends on: TP2.6 CLOSED (`staging @ 6c6fed7`, Actions run #92 green; closure recorded in this ticket's draft commit); `amulbham/ai-orchestrator` `main @ e3dd5f8`
Unlocks: one end-to-end run on a real product ticket, then the infrastructure freeze
Inherits: `PLANNING.md` §2, §9, §13 @ `6c6fed7`; `planning/templates/ticket-contract.md` and `completion-report.md` @ `6c6fed7`; `.claude/hooks/guard.mjs` @ `6c6fed7`
Authorized paths: `.claude/hooks/guard.mjs`, `.claude/hooks/guard.test.mjs`, `.claude/settings.json`, `site/scripts/project-status.mjs`, `site/planning/templates/ticket-contract.md`, `site/planning/templates/completion-report.md`, `site/planning/sprints/sprint-18-scholarly-publication-pipeline.md` (the T18.4 row only), `site/CHANGELOG.md`, `site/planning/tickets/TP2.7-*.md`
Authorized external (repo `amulbham/ai-orchestrator`, branch `tp2.7`, never `main`): `README.md`, `briefs/executor-brief.md`, `calibration.md`

## Goal
Remove the friction TP2.0–TP2.6 actually produced, without lowering any boundary. This is the last infrastructure ticket before the freeze.

## Why now
Named failures from the evidence: (1) an Executor was started with an improvised brief and no declared way to prove a hook live; the first local proof used a stale session and looked like a failure; (2) every routine branch push stalled on a typed instruction; (3) a stale Sprint 18 row (T18.4) went unflagged until a human noticed; (4) only Amul's typed messages reach a machine session, so relays were manual; (5) no record exists of whether reviews and interventions pay for themselves. Amul's retrospective, 2026-10-03, set this scope and the freeze.

## Starting state
- `guard.mjs` denies `main` pushes, indexing-control edits and edits to itself; it warns on out-of-ticket edits. It does not check force pushes, staging ancestry or branch scope. `settings.json` has the one hook and no permission rules.
- The Sprint 18 contract row for `T18.4` still says "not yet on `staging` or `main`", though the ticket is CLOSED on staging.
- The orchestrator README header calls the folder "NOT part of the repo".

## Decisions already frozen
- **§13 one-intent: Product Authority re-scope for TP2.7** is asked at approval.
- Amul, 2026-10-03: the scope is exactly the seven items below; no speculative feature; no passive veto-window authorization; stopping rule afterwards: no new TP ticket without a named real failure.
- Push permission reduces interruption, not the boundary: `main` is always denied; production promotion keeps Amul's typed go.

## Questions this ticket may answer
- Whether a `permissions.allow` rule removes the push prompt in both a local and a cloud session, or the auto-mode classifier still intervenes. Record the answer; do not widen the rule to find out.

## Scope
1. **Executor brief** (`briefs/executor-brief.md`, external): one short template: ticket path, seal SHA, branch name, "never push `staging` or `main`", where the completion report goes, the fresh-session proof rule (item 3), and the note that a protected-file edit needs Amul's `MBP_GUARD_OFF=1`.
2. **Coordinator relay rule** (external `README.md`): after Amul approves a seal on a decision card, the Planner sends the Coordinator a self-sufficient request (the brief filled in); the Coordinator starts the fresh Executor without a second approval. Briefs must stand alone because only Amul's typed messages reach a machine session. Also fix the README's first line to say the folder is versioned in this repo.
3. **Fresh-session-proof field**: `ticket-contract.md` gains one line in its Validation matrix guidance: any live or hook proof states its session setup (a fresh session started in a checkout that contains the changed files). `completion-report.md` gains a matching one-line field.
4. **Ticket push-scope field**: `ticket-contract.md` header gains `Push scope:` (the branch globs the Executor may push, normally `claude/execute-<ticket>`, and never `staging` or `main`).
5. **Narrow push permission plus independent guard**: `settings.json` adds one `permissions.allow` entry for `git push origin claude/execute-*`. `guard.mjs` independently denies: any force (`-f`, `--force`, `--force-with-lease`, a `+` refspec); a push to `staging` whose source commit does not descend from the local `origin/staging` ref; every `main` push (unchanged). A push to a branch outside the active ticket's `Push scope:` produces a warning, not a deny.
6. **Stale-status lint**: `project-status.mjs` prints `STALE?` for a sprint-contract ticket row that says "not yet on `staging`" when that ticket's file on `origin/staging` has `Status:` of CLOSED or VERIFIED LOCAL. Output stays within the existing size rule.
7. **Calibration row** (`calibration.md`, external): one table, columns `Ticket | Risk | Reviewers | B/R accepted | B/R rejected | Retries or deviations | Amul interventions`. The Planner appends one row at ticket closure. Seed TP2.5 and TP2.6 from their tickets; older rows say "not recorded".
8. **Reconciliation**: correct the Sprint 18 `T18.4` row to the ticket's real state.
9. **`CHANGELOG.md`:** one dated governance entry.

## Explicit exclusions
`PLANNING.md`, `AGENTS.md`, `ROADMAP.md`, other sprint rows, review-depth policy, `review.ps1`, `summarize.ps1`, `~/.codex/config.toml`, telemetry or usage tooling, any automatic seal or veto-window authorization, new hooks beyond `PreToolUse`, CI guards, branch protection, and any change to the `main` deny.

## Implementation contract
- Editing `guard.mjs`, `guard.test.mjs` and `settings.json` hits the TP2.6 self-protection. Amul starts the Executor session with `MBP_GUARD_OFF=1` set outside the session; the Executor then adds the permission entry last, and removes no deny rule. Without that, the Executor stops and reports.
- The guard never writes a file, runs a shell or fetches; it reads the local `origin/staging` ref only.
- External files are pushed to branch `tp2.7` of `ai-orchestrator`; merging to its `main` waits for Amul's typed instruction.

## Acceptance criteria
- `git diff --name-only <seal>` is a subset of the Authorized repo paths; the external diff is a subset of the Authorized external files.
- `node --test .claude/hooks/guard.test.mjs` passes, including the cases under Adversarial tests.
- `npm run project:status` reports the stale T18.4 row on the pre-fix tree and not after item 8.
- A fresh session proves live: `git push --force origin HEAD:refs/heads/claude/x` denied; `git push --dry-run origin HEAD:main` still denied; an ordinary `claude/execute-*` push is not blocked by the guard.

## Validation matrix
| Layer | Check | Expected |
|---|---|---|
| Unit | `node --test .claude/hooks/guard.test.mjs` | All pass |
| Lint | `npm run project:status` before and after item 8 | `STALE?` then none |
| Live (Amul's machine) | Fresh session in a checkout containing the commit, per item 3 | Acceptance live checks pass |
| Live (cloud) | Same in a fresh cloud session on the branch | Same |
| Build | `npm run build` | Passes, or the known sandbox failure; staging Actions decides |

## Adversarial tests
- Force variants (`-f`, `--force`, `--force-with-lease`, `+refspec`) to any branch: each exits 2.
- A `staging` push from a commit that does not descend from `origin/staging`: exits 2. A fast-forward: exits 0.
- `main` variants from TP2.6: still exit 2. `MBP_GUARD_OFF=1` lifts the denies and unset restores them (restoration proof).
- A push to a branch outside `Push scope:`: warns, exits 0. With no active ticket, no scope warning.
- Lint: a row with "not yet on `staging`" for a CLOSED ticket is flagged; a row saying "production promotion pending" is not.

## Regression boundaries
Site build and output, TP2.6 deny rules and tests, and `project-status.mjs --check` stay unchanged and passing. Routine commands (`git status`, builds, edits inside ticket paths) are never denied.

## Documentation updates
`CHANGELOG.md`, templates and external files as listed. Stale language to search: any statement that pushes require typed approval for Executor branches.

## Git and deployment boundary
R2 choreography per §13: seal commit, then one completion commit by a fresh Executor on its own branch, local proofs evidenced. The Executor never pushes `staging` or `main`. The Planner fast-forwards and pushes `staging` only on Amul's typed instruction. Closure needs a green staging build and is recorded in the next planning commit. No `main`.

## Stop conditions
A deny rule blocks a routine allowed command; the allow rule cannot be made narrower than `claude/execute-*`; a live environment is unavailable (unit results never substitute); the lint needs ticket-specific parsing beyond the one row pattern; or any item needs `PLANNING.md` or a policy change.

## Pre-seal review
Not yet run. R2 requires one outside reviewer (Codex) with `file:line` evidence, started by Amul's typed message.

## Required completion report
Standard template, including the new fresh-session-proof field.

## Done when
All nine items are done and bounded, every adversarial case fails closed, live proofs pass in two fresh sessions, the stale row is gone, staging Actions is green, and nothing outside the Authorized paths changed.

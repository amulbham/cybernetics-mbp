# TP2.0 — Role-based planning and pre-seal review protocol

Status: DRAFT
Mode: DECISION
Risk: R0
Branch: staging
Depends on: `staging @ 63828fb` (T18.4 closed); T18.1 reviewer dry run (2026-10-01, outside the repo)
Unlocks: TP2.1 (Claude context loading), only once TP2.0 closes
Inherits: `PLANNING.md` §§2–13 @ `63828fb`; `planning/templates/ticket-contract.md` @ `63828fb`; TP1.1's note that `TP` is a governance identifier, not a permanent namespace

> Pre-seal review depth: this ticket gets an intentionally elevated dual outside review (Codex + Grok) because it changes the review protocol itself. That does not redefine normal R0 review depth.

## Goal
Make the planning protocol vendor-neutral and add a canonical pre-seal review step, so the planner, reviewer and executor roles can be filled by any tool without revising `PLANNING.md`.

## Why now
`PLANNING.md` §2 binds roles to vendors ("ChatGPT — planner and reviewer", "Claude Code — implementation agent"). Amul is moving planning to Claude Projects and review to Codex + Grok. The T18.1 dry run showed outside review has signal: both reviewers flagged the `AGENTS.md` omission that later required T18.1.1. Today review evidence exists only in conversation, which is the gap `PLANNING.md` §1 says the planning layer exists to close.

## Starting state
- `site/PLANNING.md` names vendors at lines 4, 31, 35, 39, 113, 207, 215, 272 and 304. `planning/templates/ticket-contract.md:5` also names Claude Code.
- §13 "One-review rule" defines BLOCKER/REQUIRED/OPTIONAL but has no canonical reviewer prompt or recorded outcome.
- The ticket template has no machine-readable scope field and no review record.
- The repo root has no `CLAUDE.md`. `site/CLAUDE.md` is a symlink to `site/AGENTS.md` (57,747 bytes).
- The `ROADMAP.md` header restates closure detail for Sprints 12–18 across several paragraphs.
- Sprint 18 is `EXECUTING`. Staging is 6 commits ahead of `main` (T18.2–T18.4), with promotion pending.

## Decisions already frozen
Amul approved the role model, risk-proportional review depth, compact review reconciliation, no `planning/STATUS.md`, and vendor bindings kept outside the protocol (thread, 2026-10-01; plan v2.1, `/mnt/project-files/notes/md-infrastructure-plan.md`). Not reopened: risk classes, lifecycle states, change control, length caps, and the source-of-truth map.

## Questions this ticket may answer
- Does this governance ticket conflict with §13 "One primary development intent at a time" while Sprint 18 is open? Proposed answer: no. TP2.0 changes no product behavior and no Sprint 18 surface, the same footing TP1.1 had during Sprint 12. The executor stops if review disagrees.

## Scope
1. **Root `CLAUDE.md` (new, ≤ 40 lines).** Product authority = Amul. Repo truth outranks agent narration. `main` = production. No indexing change without Amul's explicit instruction (`site/AGENTS.md` "Indexing state"). The sealed ticket at its seal commit bounds the executor. No invented downstream work. The site lives in `site/`. Boot: fetch, `site/ROADMAP.md`, the active sprint contract, the active ticket. It points to `site/PLANNING.md` and does not restate it.
2. **`PLANNING.md` header and §2.** Replace vendor roles with **Product Authority · Planner · Reviewer · Executor · Repository and deployed artifacts (verification authority)**, keeping each role's existing duties and limits. Add one sentence: current tool bindings live in the orchestrator's configuration, not in this protocol.
3. **Vendor references elsewhere in `PLANNING.md`** (lines 35, 113, 207, 215, 272, 304) and `ticket-contract.md:5`: rename to the matching role (Executor or Planner). Wording changes only, no change in meaning.
4. **`planning/templates/pre-seal-review.md` (new).** The canonical reviewer prompt: read the draft at its commit plus every `Inherits:` source; the ten pressure-test criteria from the one-review rule; each finding tagged BLOCKER/REQUIRED/OPTIONAL with section, problem, `file:line` evidence and minimal fix; out-of-scope issues listed under NEW FINDINGS, which never authorize work; end with `VERDICT: SEAL | REVISE`. The reviewer must not rewrite product direction.
5. **`ticket-contract.md`.** Add a header line `Authorized paths: <glob list>`, and a `## Pre-seal review` section filled before seal: reviewers, commit reviewed, consensus findings (with each reviewer's severity), single-reviewer findings, disposition per BLOCKER/REQUIRED (incorporated or deferred, with a reason), material changes, and the planner's reason wherever reviewer severity differs. It counts toward the length cap. A substantive review goes to `planning/audits/` and is referenced.
6. **§13 one-review rule.** Add one paragraph pointing to items 4 and 5, plus a review-depth table: R0 planner self-check; R1 one reviewer (may be a same-vendor read-only agent); R2 one outside reviewer; R3 two outside reviewers plus staging verification. The planner may raise a tier. Lowering one needs a one-line reason in the ticket.
7. **`ROADMAP.md` header.** Collapse the sprint-status paragraphs into one `**Active:**` line (active sprint, current ticket, staging vs main state). The closure records already in `planning/sprints/` and `CHANGELOG.md` stay the detail.

## Explicit exclusions
`site/AGENTS.md`, `site/CLAUDE.md` (the symlink stays, TP2.1 owns it), `.claude/`, all code, scripts, workflows, validators, content, indexing controls, closed tickets, `CHANGELOG.md` history, the Sprint 18 contract, `completion-report.md`, `sprint-contract.md`, and anything under `AI-Orchestrator`.

## Implementation contract
- Planning documents authorize but never become runtime truth (§3). The new template and section follow that rule.
- Vendor names may remain only in historical or calibration text (e.g. the "Calibrated against" line).
- Role duties move intact. A duty dropped or added in §2 is scope drift.

## Acceptance criteria
- The root `CLAUDE.md` exists, is ≤ 40 lines and contains every item in Scope 1.
- `grep -n "ChatGPT\|Claude Code" site/PLANNING.md site/planning/templates/*.md` returns only historical or calibration lines, each justified in the completion report.
- §2 lists the five roles, and every duty from the old §2 maps to a role (mapping table in the completion report).
- `pre-seal-review.md` exists. `ticket-contract.md` has `Authorized paths:` and `## Pre-seal review`.
- §13 contains the review-depth table.
- The `ROADMAP.md` header has exactly one status line. Nothing removed is absent from `planning/sprints/` or `CHANGELOG.md`.
- The diff touches only: `CLAUDE.md`, `site/PLANNING.md`, `site/ROADMAP.md`, `site/planning/templates/ticket-contract.md`, `site/planning/templates/pre-seal-review.md`, and this ticket.

## Validation matrix
| Layer | Command/check | Expected result |
|---|---|---|
| Diff boundary | `git diff --stat 63828fb` | Only the six files above |
| Hygiene | `git diff --check` | Clean |
| Build | `npm run build` (in `site/`) | Passes, same as at `63828fb` (docs only) |
| Stale reference | grep for the vendor names, as in the acceptance criteria | Only justified historical lines |

## Adversarial tests
- Re-read §7 and §11 with the role names substituted. If any sentence changes meaning, stop and report it.
- Confirm no closed ticket file changed (`git diff --stat -- site/planning/tickets/` shows this ticket only).

## Regression boundaries
Every `PLANNING.md` rule other than the wording in Scope 2, 3 and 6 is unchanged. The templates' existing fields and caps are unchanged.

## Documentation updates
The files in Scope only. `CHANGELOG.md` gets one dated entry at closure.

## Git and deployment boundary
R0: one completion commit after the seal commit (§13). Push the normal fast-forward to `origin/staging` after the planner accepts. No `main`, no merge, no deploy action beyond the automatic staging build.

## Stop conditions
- Any role duty that does not map cleanly to one of the five roles.
- Any reviewer argument that this ticket breaks §13's one-intent rule.
- Any need to touch an excluded file.

## Pre-seal review
_To be filled by the planner after the Codex + Grok review._

## Required completion report
Standard template (`planning/templates/completion-report.md`), plus the §2 duty-mapping table.

## Done when
The protocol names roles rather than vendors, the pre-seal review template and ticket fields exist, the ROADMAP has one status line, the diff is limited to the six named files, and staging carries the completion commit.

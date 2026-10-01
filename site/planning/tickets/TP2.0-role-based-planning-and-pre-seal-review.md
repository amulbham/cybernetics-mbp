# TP2.0 — Role-based planning and pre-seal review protocol

Status: DRAFT (rev 2, after pre-seal review)
Mode: DECISION
Risk: R0
Branch: staging
Depends on: `staging @ 63828fb` (T18.4 `Status: CLOSED`, `planning/tickets/T18.4-pdf-table-information-loss-correction.md:3`)
Unlocks: nothing drafted. Context-loading work is provisional until TP2.0 closes.
Inherits: `PLANNING.md` §§2, 7, 11, 13 @ `63828fb`; `planning/templates/ticket-contract.md` @ `63828fb`
Authorized paths: `CLAUDE.md`, `site/PLANNING.md`, `site/CHANGELOG.md`, `site/planning/templates/ticket-contract.md`, `site/planning/templates/pre-seal-review.md`, `site/planning/tickets/TP2.0-*.md`

> Pre-seal review depth: intentionally elevated to dual outside review because this ticket changes the review protocol itself. That does not redefine normal R0 review depth. `TP` remains a governance identifier, as in TP1.1, not a permanent namespace.

## Goal
Make the planning protocol vendor-neutral and give pre-seal review a canonical prompt and a recorded outcome, so any tool can fill the Planner, Reviewer or Executor role without revising `PLANNING.md`.

## Why now
`PLANNING.md` §2 binds roles to vendors (ChatGPT and Claude Code), and Amul is rebinding them. §13's one-review rule defines finding classes but no reviewer prompt, and review outcomes are recorded nowhere in the repo.

## Starting state
- Vendor names in `PLANNING.md`: the header Scope line, the §2 headings and duties, the §7 "may proceed"/"must stop" headings, the §4 diagram line "what Claude Code actually changed", the §9 lead sentence, the §11 lead sentence. `ticket-contract.md` lead sentence: "A sealed ticket must let Claude Code answer…".
- `ticket-contract.md` has no scope field and no review record. Caps: R0/R1 150, R2 250, R3 400.
- There is no root `CLAUDE.md`.
- Sprint 18 is `EXECUTING` (`planning/sprints/sprint-18-scholarly-publication-pipeline.md:3`).

## Decisions already frozen
- **Product authority decision (Amul, 2026-10-01): TP2.0 is an explicit governance re-scope under §13 "One primary development intent".** It runs while Sprint 18 is open because it changes no product behavior and no Sprint 18 file, and every later Sprint 18 ticket benefits from it. This record is the authorization. _[Pending Amul's confirmation before seal.]_
- Amul approved (2026-10-01): roles not vendors; tool bindings kept outside the protocol; risk-proportional pre-seal review; compact review records; no `planning/STATUS.md`.
- Not reopened: risk classes, lifecycle states, change control, length caps, source-of-truth map.

## Role mapping (frozen here, applied in §2)
| Old §2 duty | New role |
|---|---|
| Sets direction…; approves sprints and scope changes; decides production acceptance; sole authority over indexing, public/private and publication semantics | Product Authority (unchanged) |
| Converts direction into contracts; separates facts, decisions, hypotheses, questions | Planner |
| Reviews the completion report; identifies drift and newly earned work; doesn't treat a confident report as proof; runs §11 classification and decision | Planner |
| (new, from §13) Pressure-tests a draft before seal; classifies findings BLOCKER/REQUIRED/OPTIONAL; does not rewrite product direction or authorize work | Reviewer |
| Reads current instructions first; one sealed ticket at a time; may correct a disproved assumption and report it; stops for product decisions; returns a completion report | Executor |
| Source, diffs, validators, deployments determine truth | Repository and deployed artifacts (unchanged) |

## Scope
1. **Root `CLAUDE.md` (new, ≤ 30 lines), bootstrap only.** It points to owners and restates no rules: the site lives in `site/`; process is `site/PLANNING.md`; product truth is in the owners listed in `PLANNING.md` §3; indexing state is in `site/AGENTS.md` "Indexing state"; start each session by fetching and reading `site/ROADMAP.md`, the active sprint contract and the active ticket; the sealed ticket at its seal commit is the executor's only authority.
2. **`PLANNING.md` header and §2:** apply the role-mapping table above. Add the constraint "Tool bindings for each role live in the orchestrator's configuration, not in this protocol."
3. **Other vendor references** (located by the sentences in Starting state, not by line number): rename each to its role per the mapping (§7 and §9 → Executor, §4 and §11 → Executor/Planner). The §11 heading stays "Planner review". Wording only.
4. **`planning/templates/pre-seal-review.md` (new).** The canonical reviewer prompt. The reviewer reads the draft at its commit plus every `Inherits:` source, and pressure-tests for these ten criteria: hidden assumptions; ambiguous authority; missing acceptance criteria; insufficient evidence; excessive scope; accidental scope expansion; unverifiable claims; missing stop conditions; unnecessary process; contradictions with repository truth. Each finding gets a class (BLOCKER/REQUIRED/OPTIONAL), section, problem, `file:line` evidence and minimal fix. Out-of-scope issues go under NEW FINDINGS, which never authorize work. It ends with `VERDICT: SEAL | REVISE`.
5. **`ticket-contract.md`:**
   - Add the header line `Authorized paths:`: repo-relative paths or gitignore-style globs. The final diff must be a subset.
   - Add a `## Pre-seal review` section (≤ 15 lines, inside the cap): reviewers, commit reviewed, consensus and single-reviewer findings, and per BLOCKER/REQUIRED either *incorporated* or *rejected with repository evidence*. Neither may be deferred (§13). Also: material changes, and the planner's reason wherever severities differ. A longer review goes to `planning/audits/` and is referenced.
6. **§13 one-review rule:** one paragraph citing `planning/templates/pre-seal-review.md` and the ticket's `## Pre-seal review` section, plus this pre-seal review-depth table: R0 planner self-check; R1 one reviewer; R2 one reviewer from a different model family than the planner; R3 two reviewers from different model families. The planner may raise a tier. Only Product Authority may lower one, recorded in the ticket. §5 evidence requirements are unchanged and separate.
7. **`CHANGELOG.md`:** one new dated entry at closure. Existing entries are untouched.

## Explicit exclusions
`site/AGENTS.md`, `site/CLAUDE.md` symlink, `site/ROADMAP.md`, `.claude/`, all code, scripts, workflows, validators, content, indexing controls, closed tickets, existing `CHANGELOG.md` entries, Sprint 18 contract, `completion-report.md`, `sprint-contract.md`.

## Acceptance criteria
- The root `CLAUDE.md` is ≤ 30 lines and contains every pointer in Scope 1 and no rule text.
- §2 matches the role-mapping table row for row.
- `grep -n "ChatGPT\|Claude Code" site/PLANNING.md site/planning/templates/ticket-contract.md` returns only the "Calibrated against" header or historical lines, each justified in the report.
- `pre-seal-review.md` lists all ten criteria, the three classes, the `file:line` requirement, NEW FINDINGS as non-authorizing, and the VERDICT line.
- `ticket-contract.md` defines `Authorized paths:` syntax and the subset rule. Its `## Pre-seal review` section forbids deferring BLOCKER/REQUIRED.
- §13 contains the four-row table and the rule for lowering a tier.
- The diff is a subset of `Authorized paths`.

## Validation matrix
| Layer | Command/check | Expected result |
|---|---|---|
| Diff boundary | `git diff --name-only <seal>` | Subset of Authorized paths |
| Hygiene | `git diff --check` | Clean |
| Build | `npm run build` in `site/` | Passes (docs only) |

## Adversarial tests
- Substitute the role names into §7, §9 and §11 and re-read each. If any meaning changes, stop and report.
- `git diff --name-only -- site/planning/tickets/` shows only this ticket.

## Regression boundaries
Every `PLANNING.md` rule outside Scope 2, 3 and 6 is unchanged. `ticket-contract.md`'s existing fields and caps are unchanged. Only the two additions in Scope 5 are new.

## Git and deployment boundary
R0: seal commit, then one completion commit (§13). Fast-forward `origin/staging` after the planner accepts. No `main`, no deploy beyond the automatic staging build.

## Stop conditions
A duty that doesn't fit the mapping, any need to touch an excluded file, or the §13 re-scope not confirmed by Amul.

## Pre-seal review
Reviewers: Codex, Grok · Reviewed: rev 1 @ `7e9716c` · Both REVISE.
Consensus (Codex/Grok severity), all incorporated:
- §13 one-intent conflict (B/B): the explicit Product Authority re-scope above, and the ROADMAP change dropped.
- "Ten criteria" not in repo (B/B): now listed in Scope 4.
- CHANGELOG outside the boundary (B/B): added to Authorized paths.
- Root CLAUDE.md restating owners (R/B, B taken): now bootstrap-only.
- Role mapping deferred (R/B, B taken): mapping table frozen here.
- T18.4 status cite (R/R): now cites the ticket file.
- Off-repo evidence (R/R): `/mnt` plan and dry-run references removed; decisions recorded here.
- ROADMAP rewrite (R/R): removed.
- Review-depth table (R/R): separated from §5 evidence; lowering authority named.
Codex-only, incorporated: no deferral of BLOCKER/REQUIRED; content-level acceptance criteria; `Authorized paths` syntax and subset rule. Grok-only, incorporated: grep narrowed; regression boundary corrected; sentence anchors; cap stated.
NEW FINDINGS (not authorized): Sprint 18 production promotion pending (Grok). Codex's shell sandbox failed, so it reviewed a stdin bundle rather than the live repo.

## Required completion report
Standard template, plus a §2 before/after showing each mapping row applied.

## Done when
The protocol names roles rather than vendors, the pre-seal review template and ticket fields exist, the diff is a subset of Authorized paths, and staging carries the completion commit.

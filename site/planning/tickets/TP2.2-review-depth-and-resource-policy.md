# TP2.2 — Review depth and resource policy

Status: DRAFT (rev 1, for pre-seal review)
Mode: IMPLEMENTATION
Risk: R0
Branch: staging
Depends on: TP2.0 CLOSED (`staging @ cc37023`)
Unlocks: TP2.1 (context loading) and the local-tooling ticket inherit this table
Inherits: `PLANNING.md` §7 and §13 @ `cc37023`; `planning/templates/pre-seal-review.md` @ `cc37023`
Authorized paths: `site/PLANNING.md`, `site/CHANGELOG.md`, `site/planning/tickets/TP2.2-*.md`

## Goal
Make the stable resource policy part of the protocol: effort and reviewer count are proportional to risk and uncertainty, the minimum sufficient review depth is the start point, and tool bindings stay outside the protocol.

## Why now
Product Authority settled the policy on 2026-10-01. TP2.0's §13 table (`PLANNING.md:378-383`) is now wrong in two places. R1 says "One reviewer", which allows an in-family reviewer, and R2 is defined by "a different model family than the planner", which describes the tool rather than the evidence. R3 has no staging-verification term. TP2.0 is CLOSED and is not edited. This ticket amends its result.

## Starting state
- `PLANNING.md` §13 table rows (`:380-383`): R0 "Planner self-check", R1 "One reviewer", R2 "One reviewer from a different model family than the planner", R3 "Two reviewers from different model families".
- `PLANNING.md` §13 already says (`:385`): "The planner may raise a tier. Only Product Authority may lower one…". It has no resource principle.
- §2 already says tool bindings live in the orchestrator's configuration.

## Decisions already frozen
- **§13 one-intent: Product Authority re-scope for TP2.2**, on the same footing as TP2.0 (governance only, no product behavior, no Sprint 18 file). _[Pending Amul's confirmation before seal.]_
- Amul, 2026-10-01: no model, vendor or CLI names in `PLANNING.md`. Bindings live in `AI-Orchestrator\README.md` and `review.ps1` only. That is the local-tooling ticket's job, not this one.
- An "outside reviewer" is one that runs outside the Planner's own session and allowance.

## Scope
1. **`PLANNING.md` §13: replace the four table rows** with:
   ```
   | R0 | Planner self-check |
   | R1 | One outside reviewer |
   | R2 | One outside reviewer, with deeper evidence: every finding cites `file:line`, and the reviewer runs the ticket's named verification commands |
   | R3 | Two outside reviewers, plus staging verification before closure |
   ```
2. **`PLANNING.md` §13: add a short subsection `### Resource proportionality`** (≤ 12 lines) right after the table's "The planner may raise a tier…" paragraph. It says:
   - Model effort and reviewer count are proportional to ticket risk and uncertainty. Start at the lowest sufficient tier.
   - When evidence warrants escalation, escalate reviewer breadth, not model size or context size.
   - The current optimization objective is to minimize Planner and Executor consumption while maintaining quality. Recalibrate after the first 5–10 reviewed tickets using measured usage and accepted reviewer value.
   - Planner and Executor effort is normally the default tier. Use the lowest tier for mechanical work. Use the highest tier only for R3 planning, unresolved architectural ambiguity, or diagnosis after failed verification.
   - Routing: the Planner reads the bootstrap, current sprint, current ticket, the assembled review summary and the completion report. It opens raw reviews only for disputed or material findings, and always for any `BLOCKER`. Completion reports cite evidence by reference (for example `npm run validate:pdfs — PASS`), not as pasted logs. Executors run in fresh sessions from sealed tickets.
   - One outside pass by default. A second pass only after a materially changed ticket.
   - Concrete tool and model bindings are operational configuration, kept outside this protocol (§2).
3. **`CHANGELOG.md`:** one dated entry (≤ 5 lines).

## Explicit exclusions
§§1–12, all other §13 text, templates (including `pre-seal-review.md`), root `CLAUDE.md`, `AGENTS.md`, `site/CLAUDE.md`, closed tickets (TP2.0), TP2.1, `.claude/`, code, content, workflows, indexing controls, Sprint 18 files, and anything outside the repo (`AI-Orchestrator\`, `~/.codex/config.toml`).

## Implementation contract
- The subsection's wording may tighten the bullets above but must not add a rule, tier or role.
- Effort tiers are named generically ("lowest / default / highest"), never by vendor setting names.

## Acceptance criteria
- `git diff --name-only cc37023` ⊆ Authorized paths.
- In `PLANNING.md`, `grep -niE "codex|grok|claude|gpt|openai|anthropic|xai|model famil"` returns no new matches compared with `cc37023`.
- The §13 table has exactly four rows matching Scope 1. The subsection is ≤ 12 lines.
- `git diff cc37023 -- site/PLANNING.md` touches only §13.

## Validation matrix
| Layer | Check | Expected |
|---|---|---|
| Diff boundary | `git diff --stat cc37023` | Only the three authorized paths |
| Vendor-neutrality | The grep above, before and after | Equal match sets |
| Section boundary | Hunk headers of the `PLANNING.md` diff | All inside §13 |
| Build | `npm run build` | Passes, or the known sandbox font-fetch failure. Staging Actions is the authority |

## Adversarial tests
- Temporarily add "Codex" to the subsection, confirm the vendor grep catches it, and revert.

## Regression boundaries
§5 evidence requirements, §9 seal rules and the one-review rule are unchanged.

## Git and deployment boundary
R0: seal commit, then one completion commit on the executor's branch setting `Status: VERIFIED LOCAL`. The Planner reviews it and fast-forwards `origin/staging`. Closure needs a green staging Actions build and is recorded in the next legitimate planning commit (§13: no status-only commits). No `main`.

## Stop conditions
Any change outside §13 is needed; the subsection can't fit in 12 lines without dropping a bullet; a vendor or model name is needed to make a rule intelligible.

## Pre-seal review
_[To be filled after review.]_ Calibration note: TP2.2 is R0, whose tier is a Planner self-check. It gets an intentionally elevated dual outside review because it changes the review protocol itself, and that review is the first end-to-end run of the Full-tier review wrapper. This is recorded as calibration and does not redefine R0 review depth.

## Required completion report
Standard template, appended here (≤ 25 lines), with evidence cited by reference.

## Done when
§13 carries the new table and the resource subsection, `PLANNING.md` has no vendor names, and staging is green.

# TP2.2 — Review depth and resource policy

Status: CLOSED
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
- **§13 one-intent: Product Authority re-scope for TP2.2** (Amul, 2026-10-01, decision card). It runs alongside Sprint 18 on the same footing as TP2.0: governance only, no product behavior, no Sprint 18 file.
- Amul, 2026-10-01: no model, vendor or CLI names in `PLANNING.md`. Bindings live in `AI-Orchestrator\README.md` and `review.ps1` only. That is the local-tooling ticket's job, not this one.

## Questions this ticket may answer
None.

## Scope
1. **`PLANNING.md` §13: replace the four table rows** with:
   ```
   | R0 | Planner self-check |
   | R1 | One outside reviewer |
   | R2 | One outside reviewer, with deeper evidence: every finding cites `file:line` and the repository evidence behind it |
   | R3 | Two outside reviewers |
   ```
   Add one sentence after the table: "R3 closure additionally requires staging verification, per §5." (§5 already requires it at `PLANNING.md:159`; this links the two and does not add a check.)
2. **`PLANNING.md` §13: add a short subsection `### Resource proportionality`** (≤ 12 lines including the heading) right after the table's "The planner may raise a tier…" paragraph. It extends §7's proportionality rule (`PLANNING.md:239`) to review and execution resources, and says:
   - An outside reviewer runs in a separate session with its own usage allowance, not the Planner's.
   - Model effort and reviewer count are proportional to ticket risk and uncertainty. Start at the lowest sufficient tier.
   - When evidence warrants escalation, escalate reviewer breadth, not model size or context size.
   - The current optimization objective is to minimize Planner and Executor consumption while maintaining quality. After the first 5–10 reviewed tickets, the Planner recalibrates using measured usage, escalation rate and accepted `BLOCKER`/`REQUIRED` findings, and proposes any change as a ticket.
   - Planner and Executor effort is normally the default tier. Use the lowest tier for mechanical work. Use the highest tier only for R3 planning, unresolved architectural ambiguity, or diagnosis after failed verification.
   - Routing: the Planner works from the assembled review summary and opens a raw review only for a disputed or material finding, and always for any `BLOCKER`. Executors run in fresh sessions from sealed tickets. Evidence economy (above) already governs completion-report evidence.
   - The number of passes follows the table and the one-review rule. Another pass happens only to clear a `BLOCKER` or `REQUIRED` finding.
   - Concrete tool and model bindings are operational configuration, kept outside this protocol (§2).
3. **`CHANGELOG.md`:** one dated entry (≤ 5 lines).

## Explicit exclusions
§§1–12, all other §13 text, templates (including `pre-seal-review.md`), root `CLAUDE.md`, `AGENTS.md`, `site/CLAUDE.md`, closed tickets (TP2.0), TP2.1, `.claude/`, code, content, workflows, indexing controls, Sprint 18 files, and anything outside the repo (`AI-Orchestrator\`, `~/.codex/config.toml`).

## Implementation contract
- The subsection's wording may tighten the bullets above but must not add a rule, tier or role.
- Effort tiers are named generically ("lowest / default / highest"), never by vendor setting names.

Diffs below are taken against the seal commit (`<seal>`), not `cc37023`, so held drafts on the branch don't count.
- `git diff --name-only <seal>` ⊆ Authorized paths.
- `PLANNING.md` vendor grep (`grep -niE "codex|grok|claude|gpt|openai|anthropic|xai|model famil"`) has no added matches. The two §13 "model famil" matches are gone, and the pre-existing `.claude/skills` path at §3 stays.
- The §13 table has exactly four rows matching Scope 1, plus the §5 link sentence. The subsection is ≤ 12 lines including its heading, and each Scope 2 bullet maps to one sentence in it.
- `git diff <seal> -- site/PLANNING.md` touches only §13.

## Validation matrix
| Layer | Check | Expected |
|---|---|---|
| Diff boundary | `git diff --stat <seal>` | Only authorized paths |
| Vendor-neutrality | The grep above, at `<seal>` and after | No added matches; the two §13 matches removed |
| Bullet coverage | Scope 2 bullets against the subsection | One-to-one |
| Section boundary | Hunk headers of the `PLANNING.md` diff | All inside §13 |
| Build | `npm run build` | Passes, or the known sandbox font-fetch failure. Staging Actions is the authority |

## Adversarial tests
- Temporarily add "Codex" to the subsection, confirm the vendor grep catches it, and revert.

## Regression boundaries
§5 evidence requirements, §9 seal rules and the one-review rule are unchanged.

## Git and deployment boundary
R0: seal commit, then one completion commit on the executor's branch setting `Status: VERIFIED LOCAL`. The Planner reviews it and fast-forwards `origin/staging`. Closure needs a green staging Actions build and is recorded in the next legitimate planning commit (§13: no status-only commits). No `main`.

## Stop conditions
A `PLANNING.md` change outside §13 is needed; the subsection can't fit in 12 lines without dropping a bullet; a vendor or model name is needed to make a rule intelligible.

## Pre-seal review
Reviewers: Codex and Grok (elevated dual review; R0's tier is a Planner self-check) · Reviewed: rev 1 @ `39496a4` · both REVISE. Calibration: the elevation is because this ticket changes the review protocol itself. It does not redefine R0 depth. It was also the first end-to-end run of the local dual-review tooling, and the tooling's failures are logged for the tooling ticket.
- Consensus, re-scope pending under frozen decisions (both BLOCKER): Amul granted it at approval, and it is recorded under Decisions already frozen.
- Consensus, R2/R3 mixed pre-seal review with verification (Codex REQUIRED, Grok BLOCKER; Planner: REQUIRED, fixable in one row): R2 is now `file:line` evidence, and R3's staging check is linked to §5 rather than made a review step.
- Consensus, second-pass trigger conflicted with the one-review rule (Codex REQUIRED, Grok BLOCKER): replaced by the one-review rule.
- Consensus, vendor grep failed a correct edit (Codex REQUIRED, Grok BLOCKER): changed to "no added matches".
- Consensus, "outside reviewer" and "allowance" undefined (REQUIRED): defined in the subsection.
- Consensus, stop condition caught the CHANGELOG edit (REQUIRED): narrowed to `PLANNING.md`.
- Recalibration had no owner or measure (Codex OPTIONAL, Grok REQUIRED): Planner owns it, with named measures.
- Codex REQUIRED, `cc37023` baseline includes held drafts: baseline is now the seal commit. Codex REQUIRED, no bullet-coverage check: added.
- Grok BLOCKER, routing is TP2.1 work: rejected. TP2.1 governs which files auto-load, not what the Planner reads from reviews (TP2.1 Scope). The evidence-by-reference clause was dropped as a duplicate of Evidence economy (`PLANNING.md:402`).
- Grok REQUIRED, no commit authorized to record CLOSED: rejected. §13 already routes closure to the next legitimate planning commit (`PLANNING.md:398`), as TP2.0 did. Grok REQUIRED, Done-when overclaim: fixed.
- Optional: heading counts toward the cap, and the tooling clause reworded. Taken.
- NEW FINDINGS, not authorized: §7 proportionality overlap, which the subsection now references instead of restating.

## Required completion report
Standard template, appended here (≤ 25 lines), with evidence cited by reference.

## Done when
§13 carries the new table and the resource subsection, `PLANNING.md` has no added vendor names, and staging is green.

## Completion report
- Branch `claude/execute-TP2.2`, based on seal `b0144e8` (ancestor check passed).
- Scope 1: §13 table rows replaced (R1 "One outside reviewer", R2 `file:line` evidence, R3 "Two outside reviewers"); sentence "R3 closure additionally requires staging verification, per §5." added after the table. No other §13 text changed.
- Scope 2: `### Resource proportionality` added after the "The planner may raise a tier…" paragraph: heading, one lead-in line, 8 bullets (one per Scope 2 bullet, routing and executor-session folded into one). 10 non-blank lines (cap 12).
- Scope 3: one CHANGELOG entry (3 lines of text), dated 2026-10-01, at top.
- Diff boundary: `git diff --stat b0144e8` shows only `site/PLANNING.md`, `site/CHANGELOG.md`, and this ticket.
- Section boundary: PLANNING.md hunks at `@@ -381` and `@@ -386`, both inside §13.
- Vendor grep on PLANNING.md: only the pre-existing `.claude/skills` path (line 78); both "model famil" matches gone; no added matches.
- Adversarial test: temporarily inserted "Codex" in the subsection; grep caught it (line 391); reverted.
- Build: `npm run build` fails in this sandbox with `tsx: not found` (no node_modules installed); not a content failure. Staging Actions is the authority.
- No stop condition triggered. Nothing pushed to staging or main.

## Closure
Planner review passed against seal `b0144e8` (diff ⊆ Authorized paths, §13 only, no added vendor matches). Fast-forwarded to `staging @ 4d3561e`; Actions run #87 green. Recorded in the TP2.1 seal commit.

# Planner state — research website

Snapshot: **2026-11-17** (America/Los_Angeles).
Primary intent: **Sprint 30 — staging CI green; release readiness review pending. Prepare fresh Planner handoff after verified production and closure.**

## Resume — active gate

- VERIFIED GitHub heads: main `1d7320b5d4bbabba20d98f8ade0654767a7e8190`; staging `15c37e9a17b2c1fe65317a3a62d0aea4f4d14128`; planner/context before this update `e61a51584523655fef43ab40066aed99d32628b8`. [Staging run #153](https://github.com/amulbham/cybernetics-mbp/actions/runs/44158502957) success. Recheck heads on resume.
- Owner accepted T30.8 local candidate and authorized staging. Hosted verification, consolidated production preflight and exact release candidate report pending. **No production GO yet**; do not infer from staging acceptance.
- Next: review Executor release report, reconcile seven-PDF guard/live baseline and validate:pdfs finding, inspect scoped main-to-staging diff and exact SHA; obtain explicit production approval. Verify live deployment independently where possible, then record formal sprint closure and final STATE handoff. Do not draft Sprint 31 before owner direction.

## Sprint 30 ticket ledger

| Ticket | Evidence / disposition |
|---|---|
| T30.1 | Executor-reported local checkout recovery complete; historical handoff collision waived, unique T23 commits preserved |
| T30.2 | staging af8e7a0, #147 success previously checked; local-first workflow and production preflight |
| T30.3 | staging f97dfa9, #148 success previously checked; responsive title |
| T30.4 | staging 78f2c93, #149 success; sticky TOC citation offsets |
| T30.5 | staging fbd67d1, #150 success; search control/warning disposition to reconcile |
| T30.6 | VERIFIED commit b06da567cbfbb72d0546afdda0c9b7e0baa882e5, #151 success. Forward print CSS 9 4 4 / -0.04em, docs and screen-rule leakage backlog; measured results Executor-reported |
| T30.7 | VERIFIED commit a3058f95de2759d5037a69f9e2cc30592c5e5e98, #152 success; approved HTML essay /research/ai-systems/the-latency-trap/ |
| T30.8 | VERIFIED staging HEAD above and #153 success; hosted/production checks pending |

T30.7 source: research repo `papers/latency-trap-spm-init @ 821b08bae7fad44bec021e4d0d41210c3023f599`, `papers/latency-trap/assets/manuscript.md`, blob `0927175545d08f7ed8d5f5c41055d83c26d7be9f`. Owner approved v6 as-is, essay/ai-systems, no PDF/DOI. Six verbatim primitives, four findings (qualified interruption), 14 inline source links, three bold passages, 12 references. Editorial audit on staging.

T30.8 [R3 contract](../site/planning/tickets/T30.8-forward-publication-license.md) revised at c9a53b1. Commit inspected: centralized license resolver, eight explicit legacy NC overrides, CC BY 4.0 forward default, Latency Trap alignment and Paper C footer correction, stricter facts oracle and license tests. Executor reports 65/65 mutations caught, 23 resolution checks, seven adversarial builds restored. Full report remains local/untracked per Executor; request durable reconciliation. Seven-PDF guard not run locally; unchanged protected files/hashes reported, production preflight mandatory. validate:pdfs no-dist-PDF failure reported as preexisting but not independently established.

## Operating model and handoff

- [Workflow findings](checkpoints/2026-11-17-sprint-30-workflow-findings.md); [local-first reconciliation](checkpoints/2026-11-16-sprint-30-local-first-reconciliation.md); [typography/intake](checkpoints/2026-11-17-sprint-30-typography-and-intake.md).
- Planner commits delta-only canonical tickets on planner/context; optional independent exact-commit reviewer (BLOCKER/REQUIRED/OPTIONAL), risk-required proof retained. Owner approves/seals; Executor reads planning branch without merging, works in persistent local Windows checkout, handles routine Git/build/CI/deployment within authority. Staging and production remain separate gates.
- Canonical ticket and completion-report templates under site/planning/templates; PLANNING.md R0–R3, caps and proportional proof. Read current deployed/code docs from actual branch, not stale planner copies.
- Two intake paths: author-directed primitive map or assisted editorial selection with owner review; no mandatory scholarly claim audit of approved text. New essay HTML-only unless owner chooses paper/PDF. CC BY 4.0 forward; preserve historical work licenses and frozen PDFs.
- Fresh Planner boot: read this file, planner/README.md, root HANDOFF.md and latest relevant checkpoints; verify branch heads/runs and read current ROADMAP/AGENTS/PLANNING/PUBLISHING. Return concise state, approvals, uncertainties and next recommendation. Fresh-chat recovery is a planned test, not yet demonstrated.

## Protected baseline and backlog

Sprint 29 closed; Paper C published on main 1d7320b, #146 success; route /research/cybernetics/cybernetics-structural-science/. Frozen PDF SHA-256 `875124010f8d5c1f3a525dfcce8cb8bd0ff1f1d730ee73ca342c2e4c3a6ad3b8`; all seven protected. Zenodo publication owner-reported. Staging builds may regenerate PDFs; production carry-over and live hashes mandatory.
Backlog: sitewide/IWL license decision, screen-rule leak into print, historical PDF citation retrofit, Chisel/IWL reconciliation, corpus table/anchor improvements. Consult current ROADMAP; none authorized as Sprint 31 yet.

## Historical continuity

Previous full STATE retained in Git at [e61a515](https://github.com/amulbham/cybernetics-mbp/blob/e61a51584523655fef43ab40066aed99d32628b8/planner/STATE.md). It contains detailed predecessor gates and older sprint history; those entries are archival, not current instructions. Dated checkpoints and sealed tickets remain unchanged.

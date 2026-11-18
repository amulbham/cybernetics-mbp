# 2026-11-18 — Sprint 31 local workflow pilot

## Observed so far

- The Product Authority accepted the continuity test. The transition, operating instructions, and resume state were published together at `b0bb93a` on `origin/planner/context` and verified against the remote ref.
- The Planner fetched the three refs before planning, checked staging's risk tiers and current templates, and compared the supplied reading-surface preview with committed staging source. The preview could inform the [local sprint draft](../../site/planning/sprints/sprint-31-reading-surface.md) directly from the separate Executor checkout. The intake's six-PDF snapshot and CSS-only proposal required reconciliation with the current seven-PDF guard and the new heading request.
- Grok Build CLI `1.0.70` returned `GROK_SMOKE_OK` and exited successfully in a single-turn headless test from a temporary directory. The prompt contained only the connection check.
- Grok Build reviewed the plan at `12a51ad` and returned four required corrections. The Product Authority accepted the refinements and the sprint contract incorporates them. See the [review](../../site/planning/audits/sprint-31/S31-grok-whole-sprint-review.md) and [exact CLI process, inputs, timings, and optimization proposals](../../site/planning/audits/sprint-31/S31-grok-review-process.md). Exact-seal retrieval, implementation handoff, evidence review, and closeout are pending.

## Process being tested

Discuss the product outcome and refine the sprint draft locally. At the review checkpoint, commit locally and push that draft to `origin/planner/context`. Give the independent reviewer the exact commit and the sprint contract path. Reconcile the findings and record the Product Authority's scope approval before preparing the first ticket.

For each ticket, use the risk-based review and seal procedure in `site/PLANNING.md` on `origin/staging`. Push the approved seal to `origin/planner/context` and give the Product Authority a copy-ready prompt containing the ticket path and seal SHA. The Product Authority sends it to the Executor. The Planner independently verifies the returned evidence before shaping the next ticket.

## Lightweight Grok review for the rest of Sprint 31

- The Product Authority confirms each Grok invocation. Start with the review and verification requirements for the ticket's risk class. R0 uses the Planner self-check. Any required independent reviewer count, verification, seal, or deployment approval still applies.
- For an approved Grok review, supply the exact candidate and only the evidence needed to review it. Explore beyond those sources when a specific uncertainty warrants it. Request concise, actionable `BLOCKER` / `REQUIRED` / `OPTIONAL` findings and default to one invocation.
- Reconcile each material finding against targeted repository evidence. Request another review only when a material revision or unresolved finding warrants it. Obtain Product Authority confirmation before another Grok call.
- Log the reviewed candidate and context supplied, model, invocation count, duration, input and output tokens when available, and any retries or unnecessary steps. Use the [whole-sprint run](../../site/planning/audits/sprint-31/S31-grok-review-process.md) as the initial comparison and mark unavailable measurements explicitly.

## Closeout

The Product Authority confirmed that closure includes the final production push, post-deploy verification, and documentation and state updates. Record the reviewed plan SHA, seal and implementation SHAs, how the Executor retrieved the ticket, decisions or rework caused by review, and friction in Git synchronization, local preview, or evidence transfer. Describe the actual end-to-end review process, identify avoidable cost and delays, and propose a simpler reusable protocol. Review the pilot findings with the Product Authority before adopting any change to the standing [Planner instructions](../README.md#local-first-planner-operation).

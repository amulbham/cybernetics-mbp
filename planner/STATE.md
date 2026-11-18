# Planner state — research website

Snapshot: **2026-11-18** (America/Los_Angeles).
Primary intent: **Sprint 31 research reading surface — contract frozen, T31.0 baseline audit next. Sprint 30 CLOSED.**

## Resume — active gate

- VERIFIED: main `ee3ebc6ccf658a7005e219830db247f2c8c75c89`, staging `15c37e9a17b2c1fe65317a3a62d0aea4f4d14128`. [Production run #154](https://github.com/amulbham/cybernetics-mbp/actions/runs/44222302915) and [staging #153](https://github.com/amulbham/cybernetics-mbp/actions/runs/44158502957) succeeded. Recheck remote refs including planner/context and current runs on resume.
- Product Authority confirms final production push/post-check and requests handoff to next sprint. [Sprint 30 closure record](../site/planning/audits/S30-sprint-closure.md) holds ticket dispositions, independently inspected scope/CI evidence and unresolved findings. No active execution/release authorization.
- APPROVED: the Product Authority accepted the continuity test and designated local Codex as primary Planner. See the [transition checkpoint](checkpoints/2026-11-18-local-codex-planner-transition.md).
- APPROVED: the Product Authority accepted Grok's refinements and the [Sprint 31 contract](../site/planning/sprints/sprint-31-reading-surface.md) incorporates all four required findings. The [review](../site/planning/audits/sprint-31/S31-grok-whole-sprint-review.md) and [CLI process record](../site/planning/audits/sprint-31/S31-grok-review-process.md) preserve the evidence. Next gate: prepare T31.0 for the Product Authority's ticket seal, then provide the handoff prompt. Sprint closure requires verified production release and post-sprint documentation and state updates.
- APPROVED for Sprint 31: follow the [lightweight Grok pilot](checkpoints/2026-11-18-sprint-31-local-workflow-pilot.md#lightweight-grok-review-for-the-rest-of-sprint-31). The Product Authority confirms each Grok call. T31.0 follows the standard R0 Planner self-check.

## Delivered baseline

- Production #154 logs independently inspected: 67 pages, open indexing 0 issues; 7 papers/7 PDFs, 25 redirects, 9 route-history rows; independent seven-PDF guard passed, zero swaps, Wrangler deployed exact SHA, post-deploy live PDF verification passed on attempt 1. No separate Planner live downloads. Scoped 12 commits / 34 paths, no workflow or frozen-artifact changes.
- T30.1 local checkout recovery; T30.2 local-first and production preflight; T30.3 responsive title; T30.4 citation offsets/DOI; T30.5 search control; T30.6 forward PDF typography; T30.7 Latency Trap essay; T30.8 licensing. All accepted for scoped delivery; development-only governance remains staging/planner-only. Full ticket evidence in closure.
- Latency Trap: [published essay](https://amulbham.com/research/ai-systems/the-latency-trap/), pinned research v6 at `821b08bae7fad44bec021e4d0d41210c3023f599`, blob `0927175545d08f7ed8d5f5c41055d83c26d7be9f`; six primitives, four findings, 14 inline links, 12 references; HTML-only, no PDF or DOI. Source path papers/latency-trap/assets/manuscript.md, branch papers/latency-trap-spm-init in amulbham-research.
- New-work license CC BY 4.0, explicit historical NC overrides; Paper C already CC BY, footer corrected. Single resolver, stricter facts oracle; forward typography uses hyphenate-limit-chars 9 4 4 / word-spacing -0.04em. Existing PDFs unchanged.
- Seven frozen PDFs protected (Paper C SHA-256 `875124010f8d5c1f3a525dfcce8cb8bd0ff1f1d730ee73ca342c2e4c3a6ad3b8`). Staging regenerates PDFs; main requires approved carry-over, pinned independent guard and post-deploy live matches. No mandate to alter existing PDFs.

## Operating model

- The [Planner README](README.md#local-first-planner-operation) owns local drafting, Git synchronization and external review instructions. Read `site/PLANNING.md` from `origin/staging` for governing roles, risk-based review and ticket seals. See the [Sprint 30 workflow checkpoint](checkpoints/2026-11-17-sprint-30-workflow-findings.md) for rationale.
- Executor works on persistent local Windows checkout, reads planner/context without merging, runs checks and routine Git/CLI within ticket authority; staging push authorization per seal, closed-indexing hosted preview. Prepare scoped release on main baseline, run exact-candidate preflight; owner final main push, CI/Wrangler upload and post-deploy verification. No wholesale staging merge.
- Two intake paths: author-directed primitive map or assisted editorial selection with owner review. Preserve approved source and metadata; separate scholarly artifact custody.
- For current behavior read actual code and canonical docs on correct branch: staging operational instructions, main production. Some older ROADMAP/AGENTS status text is stale; closure records discrepancy. Do not treat stale five/six-PDF snapshots as current. Current workflow/guard and verified release evidence win.

## Deferred findings from Sprint 30

Read current main ROADMAP plus closure's findings ledger. Legacy PDF test harness debt; screen header rules leaking into rebuilt PDFs; unverified first-table header difference; sitewide/IWL license decision; DOI at 320px and mobile nav shift; scholarlyReview warning unresolved; Paper C missing route-history row reported, new redirect requires authorization; older Chisel/IWL, corpus table/anchor and historical PDF citation work. Documentary lag and local-only standalone reports remain noted. None requires reopening Sprint 30 based on current evidence. Prioritize with owner; no automatic remediation.

Previous full STATE history at e61a515 and pre-release compact state at a4144b0; dated checkpoints and sealed tickets preserved. This is a record-only handoff on planner/context, not a deploy.

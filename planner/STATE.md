# Planner state — research website

Snapshot: **2026-11-19** (America/Los_Angeles).
Primary intent: **Sprint 31 production verified; documentation and formal closeout pending. Sprint 32 intake approved, not started.**

## Resume — active gate

- VERIFIED: main `016396f00bd160d39a16644660ef4cc2d67f140e`, staging `318b75408f5f5e96ae2d329f58cb16cd3971b234`. [Production run](https://github.com/amulbham/cybernetics-mbp/actions/runs/44631124056) deploy and all steps successful, including carry-over, independent seven-PDF guard and live PDF verification. Planner compared production against S30 main: eight authorized implementation paths plus ROADMAP and CHANGELOG only. No frozen artifacts, guard or workflow changes. Executor reports exact deployed SHA and seven independent fresh live hash matches; Planner did not independently download PDFs.
- T31.0 accepted with follow-up ([audit](../site/planning/audits/sprint-31/S31-T31.0-baseline-review.md)); T31.1 accepted at staging ae87e435 (Key idea final 1.07em); T31.2 accepted at 45423578 (forward titles standard 19pt/Paper C 20pt, DOI 10pt); T31.3 accepted at 318b7540 (native research subtitle h2, TOC/IWL unchanged). Cumulative staging four commits/eight paths, CI 44628175376 success. T31.4 [release seal](../site/planning/tickets/T31.4-production-release.md) at 74601e0; owner-approved release-specific second-review waiver, not general policy.
- Executor reports production open indexing as intended; desktop/mobile three-theme checks pass, five primitive types distinguishable, light contrast 4.75–8.76 and dark 7.06–8.48; Key Findings native lists; eight subtitle-bearing articles h2 immediately after h1, all TOCs/anchors and IWL control unchanged. Production is live; no rollback indicated.
- OPEN: Executor preparing scoped ROADMAP/CHANGELOG status correction (currently release candidate/production pending). Any main push redeploys: require exact-candidate preflight, owner authorization/push, CI and seven fresh live hash checks. Recheck refs and final doc diff before formal closeout. Planner closure audit, sprint status and workflow checkpoint still pending. Do not start Sprint 32 until closeout.
- Owner Cursor experiments (consts.ts, index.astro, global.css, Paper C index.md and untracked files) reported untouched. Do not clean or stash; release worktree/preview server cleanup separately scoped.
- Current primary Planner is cloud ChatGPT (owner superseded local Codex pilot); Claude Code local Executor; owner coordinates independent reviewers. Earlier [transition checkpoint](checkpoints/2026-11-18-local-codex-planner-transition.md) historical. [Sprint 31 contract](../site/planning/sprints/sprint-31-reading-surface.md) and [pilot](checkpoints/2026-11-18-sprint-31-local-workflow-pilot.md) retained; reconcile at closeout.

## Delivered baseline

- Sprint 31: approved reading surface and native subtitle shipped; print fixes forward only. Permanent owner policy: preserve exact approved published PDF bytes even for typography-only changes; separately authorized publication revision required for replacement. Zenodo parity not independently established.

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

## Approved next-sprint intake — Sprint 32

- APPROVED 2026-11-19: isolated design sandbox. Cursor product discovery and Claude Code governed engineering should run in separate Git worktrees on sandbox/design and staging. Safely inventory, back up and migrate existing uncommitted owner experiments (including untracked files) before any cleanup; verify preservation, independent dev servers and scoped staging delivery. Document prototype-to-ticket handoff. No implementation or branch creation until Sprint 31 closes and Sprint 32 scope is sealed. Task number deferred to sprint planning.

## Deferred findings from Sprint 30

Read current main ROADMAP plus closure's findings ledger. Legacy PDF test harness debt; screen header rules leaking into rebuilt PDFs; unverified first-table header difference; sitewide/IWL license decision; DOI at 320px and mobile nav shift; scholarlyReview warning unresolved; Paper C missing route-history row reported, new redirect requires authorization; older Chisel/IWL, corpus table/anchor and historical PDF citation work. Documentary lag and local-only standalone reports remain noted. None requires reopening Sprint 30 based on current evidence. Prioritize with owner; no automatic remediation.

Previous full STATE history at e61a515 and pre-release compact state at a4144b0; dated checkpoints and sealed tickets preserved. This is a record-only handoff on planner/context, not a deploy.

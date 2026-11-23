# Sprint 31 — closure record
Status: CLOSED — Product Authority approved 2026-11-23
Scope: research reading surface, forward PDF typography and semantic article subtitle
Production: main 83fa4bfd11bce10c01dded02d83a99a23595c11c (docs-only follow-up to released implementation 016396f00bd160d39a16644660ef4cc2d67f140e)
Staging: 318b75408f5f5e96ae2d329f58cb16cd3971b234

## Delivered and accepted
- T31.0 baseline and triage: accepted with follow-up; audited print title/DOI leaks, list/TOC semantics, carry-forward findings.
- T31.1 reading surface: five kind-specific primitive treatments, Key Findings panel and native list, scoped research rhythm, Key idea final 1.07em. Staging implementation ae87e435.
- T31.2 forward print: screen-only responsive title/DOI rules; future standard PDF title 19pt (scholarly-forward 20pt), DOI 10pt; existing seven published PDFs untouched. Staging 4542357809cde30192fd8c68a2110faa00679e98.
- T31.3 research subtitle: native h2 immediately after article h1, excluded from TOC; IWL unaffected; appearance and paired forward PDF parity tested. Staging 318b75408f5f5e96ae2d329f58cb16cd3971b234.
- T31.4 separately sealed R3 release 74601e023ce99eade9b97c7fa7c5701156137399, owner-approved second-review waiver for this release only. Product-only release from main ee3ebc6; no wholesale staging merge or owner experiments. Released 016396f00bd160d39a16644660ef4cc2d67f140e; Actions run 44631124056 all steps success, including independent seven-PDF guard and post-deploy verification. Planner independently inspected workflow step conclusions and ten-file release diff. Executor separately downloaded and hashed all seven live PDFs against approved fixture, and checked indexing, desktop/mobile reading surface, themes, heading outline, anchors and IWL. Planner did not repeat fresh live downloads.
- Docs-only status correction after release: main 83fa4bfd11bce10c01dded02d83a99a23595c11c, exactly site/CHANGELOG.md and site/ROADMAP.md versus 016396f. Owner/Executor reported completed follow-up and cleanup. The Planner could not independently establish the docs-only follow-up's workflow run via commit lookup; no fresh post-follow-up PDF hash evidence independently available. No code, PDF, guard, fixture or workflow path changed in that commit. This evidence limit does not invalidate the previously verified implementation release, but should not be misrepresented as an independently verified second deploy.

## Frozen publication and scope
Seven published PDF bytes are preserved; forward print specimens are not published revisions. An approved PDF is not silently regenerated even for typography-only changes. Zenodo parity not independently rechecked. Production indexing intended open, staging closed. No change to routes, content, licensing, publication identity or guard policy.

## Deferred, not blockers
Legacy PDF harness debt; site-header brand h2 above article h1; standard forward PDF titles about 11pt left of center; sitewide/IWL licensing decision; 320px nav nuance; historical route-history/Chisel/DOI issues. See T31.0 audit and ROADMAP. No automatic ticket created.

## Process retrospective
- Exact sealed tickets on planner/context read by local Executor via git show without merging. Early local previews before exhaustive checks reduced unnecessary work. Owner authorized staging and production separately. Independent review targeted risk; release-specific waiver explicitly logged.
- Local Codex/Grok CLI primary-Planner pilot was superseded: owner restored cloud ChatGPT as primary Planner, Claude Code as local Executor, independent reviews owner-coordinated. Preserve original pilot observations, do not claim its full proposed operating model was adopted.
- Shared local Cursor experiments did not enter release; owner approved Sprint 32 intake to isolate design sandbox with a separate Git worktree/branch, preserve uncommitted and untracked files, run separate dev servers and hand off approved prototypes to sealed tickets.
- Executor reported cleanup of five preview servers and release worktree/branches, leaving owner's server 4321 and experimental staging checkout untouched. Planner did not independently inspect local filesystem.
- Process improvement: risk-proportional evidence, exact SHA handoffs, scoped candidate preflight, independent artifact guard and owner release authorization remain. Review pilot changes with owner before changing standing Planner policy.

## Closure authority
Product Authority explicitly approved closing Sprint 31 on 2026-11-23 and starting Sprint 32 planning. This record closes the sprint's governed work; no production push is authorized by this planner-only record.

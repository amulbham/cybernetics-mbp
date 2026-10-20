# Planner state — research website

**Snapshot:** 2026-10-20 (America/Los_Angeles). Read current production and staging independently; this branch is working context, not a release.
**Primary intent:** T24.1 homepage / About editorial refinement. **Content and T24.1 ticket APPROVED; Product Authority reports outside review with no findings. Executor is authorized to seal, implement and verify staging only; no T24.1 runtime execution has occurred in this Planner step.** Production T24.0 copy is not authorized.

## Authority / workflow
- Product Authority: site owner; ChatGPT: Planner/reviewer; Claude Code: Executor. Executor does not independently orchestrate reviewers. Current work follows `site/PLANNING.md` seal-before-execution, staging review and separate exact-candidate production approval.
- `planner/context` = non-deploying working memory. Promote reviewed results selectively into canonical docs/code. Never merge `planner/context` or divergent `staging` wholesale into `main`.
- **APPROVED 2026-10-20:** H1, metadata, About layout hierarchy and Methodology copy for T24.1, exactly as stored in `planner/assets/T24.1-approved-content.md`. The rationale and decision supersession are in `planner/checkpoints/2026-10-20-t24-1-editorial-lock.md`. Approval of copy **does not** authorize implementation or production deploy.
- **SUBSEQUENT AUTHORIZATION, 2026-10-20:** owner approved the reviewed delta-only T24.1 ticket and requested coder handoff after reporting no reviewer findings. Executor may prospectively seal, implement, validate and deploy staging. Main-based candidate preparation, main push and variable changes remain unauthorized.

## Freshly checked GitHub facts
- **VERIFIED:** `main = 1878c269ef837ce5abe203d742cdc85e3e14ebc0` (production); `staging = e292703b746c86fe57aa0df1f7f2b577829e89e4` (T24.0 implementation), heads checked 2026-10-20.
- **VERIFIED:** staging GitHub Actions **run #123 succeeded** at `e292703`. This resolves the Executor's run-status uncertainty; do not claim a fresh independent browser view of the deployed pages.
- **EXECUTOR-REPORTED:** T24.0 A1–A9 tests were satisfied on staging: exact approved original copy, accessible links and 375/1280px light/dark; no production candidate created. Seal `6cab839`, implementation `e292703`; local-only completion/report commit `279474d` unpushed and not inspected here. T24.0 sealed historical ticket lives on `staging`.
- **VERIFIED earlier:** Chisel v9/IWL v4 production commit `1878c269`; main workflow #122 attempt 2 succeeded with PDF preservation. The Executor reported 26/26 G5 production checks; live host matrix not independently re-run here.
- **Owner-managed:** Chisel Zenodo deposit/DOI finalization remains separate. The owner previously declined redundant assistant checks; don't manufacture deposit parity. Historic PDF preservation remains a hard requirement.
- **OPEN follow-ups outside T24.1:** removed tag edge-cache stale responses, `FormattedDate` timezone behavior, some accessibility follow-up, separate publishing-workflow mini-sprint and Chisel final evidence promotion. Do not expand this copy task to these issues.
- **User aim:** new chat per development session; use this state plus newest relevant checkpoint and content asset; prior chat is consulting.

## Approved T24.1 content and design (pointers; do not duplicate copy)
- Homepage: short H1 **“The structure behind how systems behave.”**; visible Copy B unchanged; homepage-only title **“Amul Bham | Research on AI Systems, Cybernetics & Knowledge”**; approved meta description preserves cybernetics.
- About: one opening lead, compact `Profiles & Contact` links immediately underneath; two previously approved paragraphs become normal `Background` prose; `Research Focus` remains; new two-paragraph `Methodology`; approved About meta description.
- **VERBATIM wording:** `planner/assets/T24.1-approved-content.md`. Do not re-summarize it into the formal ticket; reference this asset at a named SHA, or copy the exact required strings once into the ticket when sealing.
- `SITE_TITLE`, Person/author identity, shared author bio/printed PDFs remain unchanged. Homepage meta and `WebSite.description` currently share `SITE_DESCRIPTION`: intentionally reconcile page-only metadata without modifying unrelated consumers; preserve About ProfilePage identity. Responsive adjustments should be page-local only.

## Next gates
1. **Executor:** retrieve site/planning/tickets/T24.1-homepage-about-refinement.md and the updated Sprint 24 contract from this approved Planner packet; read the pinned content asset. Recheck current refs, preserve existing local work, seal prospectively and implement on staging. Do not merge planner/context or use its executable code as the baseline.
2. **Staging verification:** existing build/CI plus the ticket's focused metadata, copy, hierarchy, responsive and keyboard/link checks. Return one <=25-line R1 report, exact commits/run/page URLs and screenshots. No new synthetic suite or publication audit.
3. **Planner/Product Authority:** accept staging; only then separately authorize a main-based product candidate containing the final cumulative T24.0/T24.1 two-page result.
4. **Production:** exact-candidate approval before push. Preserve indexing settings and five approved PDFs; no redundant Zenodo check.
5. **Records:** append actual verified outcomes without rewriting T24.0. No status-only deployment; publication-workflow improvements remain separate.

## Essential sources
- `site/planning/tickets/T24.1-homepage-about-refinement.md` on planner/context — approved, awaiting Executor seal; staging-only authorization
- `planner/checkpoints/2026-10-20-t24-1-coder-handoff.md` — review disposition and handoff authority
- `planner/assets/T24.1-approved-content.md` — **approved literal copy and UX contract**
- `planner/checkpoints/2026-10-20-t24-1-editorial-lock.md` — decision rationale and status
- `planner/checkpoints/2026-10-20-homepage-about-copy-review.md` — prior T24.0 reviewed packet (historical)
- `site/planning/tickets/T24.0-homepage-about-copy.md` on `staging` — sealed T24.0 authorization and original copy
- `site/PLANNING.md`, `site/AGENTS.md`, live `index.astro` / `about.astro` — governing execution and source
- Staging run #123: https://github.com/amulbham/cybernetics-mbp/actions/runs/39484360220

# Planner state — research website

**Snapshot:** 2026-10-20 (America/Los_Angeles). Read current production and staging independently; this branch is working context, not a release.
**Primary intent:** T24.1 homepage / About editorial refinement. **Final content APPROVED and saved; new implementation ticket not yet drafted or sealed.** Production T24.0 copy is not authorized.

## Authority / workflow
- Product Authority: site owner; ChatGPT: Planner/reviewer; Claude Code: Executor. Executor does not independently orchestrate reviewers. Current work follows `site/PLANNING.md` seal-before-execution, staging review and separate exact-candidate production approval.
- `planner/context` = non-deploying working memory. Promote reviewed results selectively into canonical docs/code. Never merge `planner/context` or divergent `staging` wholesale into `main`.
- **APPROVED 2026-10-20:** H1, metadata, About layout hierarchy and Methodology copy for T24.1, exactly as stored in `planner/assets/T24.1-approved-content.md`. The rationale and decision supersession are in `planner/checkpoints/2026-10-20-t24-1-editorial-lock.md`. Approval of copy **does not** authorize implementation or production deploy.

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
1. **Planner:** draft a delta-only, probably R1 **T24.1** ticket, scoped to `index.astro`, `about.astro`, authorized page-local CSS, specific homepage/About metadata changes and focused mobile/desktop/theme testing. Audit current heads and `SITE_DESCRIPTION` consumers. Record that T24.0 H1 is superseded *prospectively*, not that the original seal changed.
2. **Product Authority:** review and separately approve ticket seal/execution/staging push. The content is already approved; avoid reopening the wording without new evidence.
3. **Executor:** implement on verified staging after seal, run local checks and confirm successful staging workflow. Return staging screenshots/checks and a <=25-line R1 completion report. Stop on unexpected shared metadata, source, or component impact.
4. **Product Authority:** accept staging, then authorize a main-based, product-only candidate and production deploy separately. Keep indexing open and existing five-PDF artifact preservation; recheck relevant production identity hashes.
5. **Later:** after verified publication, promote durable result to `site/ROADMAP.md` / `site/CHANGELOG.md`; preserve dated Planner checkpoints and no status-only redeploys.

## Essential sources
- `planner/assets/T24.1-approved-content.md` — **approved literal copy and UX contract**
- `planner/checkpoints/2026-10-20-t24-1-editorial-lock.md` — decision rationale and status
- `planner/checkpoints/2026-10-20-homepage-about-copy-review.md` — prior T24.0 reviewed packet (historical)
- `site/planning/tickets/T24.0-homepage-about-copy.md` on `staging` — sealed T24.0 authorization and original copy
- `site/PLANNING.md`, `site/AGENTS.md`, live `index.astro` / `about.astro` — governing execution and source
- Staging run #123: https://github.com/amulbham/cybernetics-mbp/actions/runs/39484360220

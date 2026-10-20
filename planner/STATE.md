# Planner state — research website

**Snapshot:** 2026-10-20 (America/Los_Angeles). Source of working continuity: `planner/context`; **check current `main` and workflow evidence on boot**.
**Primary intent:** T24.0 + T24.1 production **ACCEPTED**. Next: **PROPOSED** lean workflow-consolidation sprint (not yet authorized or sealed).

## Authority / immutable boundaries
- Product Authority: site owner. Planner/reviewer: ChatGPT. Executor: Claude Code. New chat per development session; this repository state and the latest relevant checkpoint are the handoff.
- Use `site/PLANNING.md` prospective seals, risk proportionality, separate staging acceptance and product-only production approval. No implicit authorization from Planner notes. No wholesale merge of divergent `staging` or `planner/context` to `main`.
- Maintain existing production indexing and PDF-preservation controls. Owner manages Chisel's Zenodo deposit and DOI checks; don't duplicate that task or claim parity without evidence.

## Latest verified release — T24.0 + T24.1
- **VERIFIED GitHub refs 2026-10-20:** `main = 9697dbc7310c480d4b6349104e9504107e4341a2`; `staging = 043e351f00f6834a053847209caca4749941e91d`. Recheck if another session has moved them.
- **VERIFIED GitHub Actions #126:** `https://github.com/amulbham/cybernetics-mbp/actions/runs/39512846191`, completed success on `9697dbc`. Guard/build/PDF generation/carry/PDF validation/deploy/post-deploy verify all green. Log explicitly states **5 PDFs verified, 0 frozen-artifact swaps**; live hashes matched the manifest on attempt 1.
- **EXECUTOR-REPORTED production live checks:** approved homepage H1, SEO title/description, WebSite metadata; About lead/profile links/Background/Research Focus/Methodology and meta; 29 focused tests, 13 intended sitemap URLs, 23 redirects, live five-PDF parity and working Email chip. Planner independently confirmed the workflow, not every direct browser check.
- **ACCEPTED:** T24.0/T24.1 cumulative version at `9697dbc` is the final release; staging layout and source checks were accepted earlier. **No additional deployment required to close this work.**
- **DOCUMENTARY LAG:** `site/ROADMAP.md`, `site/CHANGELOG.md`, Sprint 24 and T24 ticket records on `main` were committed while production was pending, so their latest *current-status* references need a later, truthful append/correction. Do not mutate sealed historical meaning or push a status-only redeploy.
- Historical Chisel v9/IWL v4 product release `main @ 1878c26` preceded T24. Chisel final external Zenodo completion is **owner-managed / unverified** here. Other follow-ups: two stale edge-cached removed tag URLs, timezone/date, screen reader, final local G5 evidence reconciliation.

## Next primary goal — PROPOSED Sprint 25 (workflow consolidation)
- **User direction:** lean but sound planning/release/docs system; explicit release-workflow optimization, finalize Planner continuity, ensure current ROADMAP/CHANGELOG/HANDOFF correctness, and eventually formalize separate workflows for **updating an existing research work** and **adding a new one**.
- Reuse `planner/audits/2026-10-18-publishing-flow-doc-sweep.md`. Its verified problems include source-of-truth/document drift, hardcoded five-paper PDF inventory and new-path release limitations, Desk-only bootstrap, table-fixture coupling, human variable/preflight handoffs, and stale skill instructions. Recheck against current code.
- **Recommended sequence (NOT pre-sealed tickets):** (1) small current-state/process audit and disposition; (2) minimize and reconcile Planner/canonical docs, with a single source owner for each fact; (3) improve authenticated workflow evidence/preflight & production authorization without weakening PDF release guard; (4) specify two separate content runbooks; (5) implement any earned generalized PDF/new-entry mechanisms as appropriately risked future work.
- Preserve `planner/README.md` v1 and use `planner/STATE.md` for mutable working state, dated checkpoints for reasoning and `planner/assets/` only for approved verbatim content. No new memory machinery unless a measured failure warrants it. Keep releases from deploying solely to update status prose.
- **No Sprint 25 ticket or code change is authorized by this state.** User requested planning; confirm the proposed scope before prospective seal/implementation.

## Next actions for the fresh Planner chat
1. Re-check `main`, `staging`, `planner/context` and latest workflow run. Read `planner/checkpoints/2026-10-20-t24-release-workflow-next.md` and the Oct 18 publishing-flow audit; reconcile with current `site/PLANNING.md`, `site/PUBLISHING.md`, `site/AGENTS.md` and `site/ROADMAP.md`.
2. Briefly propose Sprint 25's **smallest necessary scope**, evidence requirements and stop conditions to Product Authority. Do not pre-create downstream tickets; use prospective authorization.
3. At the next approved canonical docs/promoted release, append factual T24 verification, fix stale roadmap and handoff, and preserve historical entries.
4. Distinguish plain content revisions, scholarly paper updates/Zenodo versions, new `paper` vs essay/memo entry creation, and optional IWL; don't promise that all technical cases already work.
5. No automatic rerun of Search Console setup, Zenodo deposits, extra reviewer agents or unrelated design changes.

## Key sources
- `planner/checkpoints/2026-10-20-t24-release-workflow-next.md`: T24 verified facts and workflow scope rationale.
- `planner/audits/2026-10-18-publishing-flow-doc-sweep.md`: existing technical/doc audit and two-flow proposal.
- `planner/assets/T24.1-approved-content.md`: approved literal copy (historical artifact, now production released).
- `site/PLANNING.md`, `site/PUBLISHING.md`, `site/AGENTS.md`, `site/ROADMAP.md`, `site/CHANGELOG.md`: canonical protocol, publication contract and current/history surfaces (some current-state sections lag).

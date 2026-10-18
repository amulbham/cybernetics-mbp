# Planner state — research website

**Snapshot updated:** 2026-10-18  
**State:** ACTIVE · Planner Workspace v1 approved and initialized.  
**Primary intent:** transition to new-chat website development and finish T22.0 S6 docs/evidence closure safely.

## Decision and authority state
- **APPROVED:** Product Authority chose a repo-backed shared Planner workspace. Root `HANDOFF.md` is the durable entry point; `planner/context` is the checkpoint branch; `planner/STATE.md` is mutable; dated checkpoints preserve context; selected verified decisions are promoted to the appropriate canonical docs.
- **APPROVED:** next website development should run in a fresh Planner chat. The prior long chat is consulting/reference only.
- **APPROVED (previous):** Product Authority waived two outside R3 pre-seal reviews for **T22.0 only**; technical test/release gates were not waived. Do not generalize this exception.
- **NOT AUTHORIZED:** an unannounced push to production, modification of GitHub Actions indexing/PDF variables, re-publication of DOI files, or automatic completion of T22.0 S6.

## Confirmed repository state at snapshot
- `main = 384f0349fb313733c4feb27e17a8e5caf3580696`; `staging = b26267cfa619dd0ccbd63e4b39a7512b0d13521e`. These GitHub branch heads were verified on 2026-10-18; recheck when resuming.
- Production indexing activation: GitHub Actions S4 run **#118** succeeded on `main` at that SHA. T22.0 launch matrix, 13 sitemap URLs, five PDF SHA-256 parity and 23 redirects were **reported verified by Executor**. See `HANDOFF.md` for caveats and approved hashes.
- **S5:** Google Search Console setup/sitemap handoff **owner-confirmed complete** on 2026-10-16. Dashboard results / actual crawling and Google Scholar inclusion are not independently observed here.
- **S6:** docs/evidence closure **PENDING**. The authoritative sealed T22.0 ticket and historical evidence are on `staging`; do not rewrite the historical seal. Full closure evidence must be brought over within approved scope.
- Draft **PR #1**: `docs/launch-handoff-2026-10-16` → `main`, initial launch handoff/README/roadmap/AGENTS corrections. This Planner Workspace v1 setup is prepared on that documentation branch but is **not** a production deployment or T22.0 S6 closure.
- `planner/context` is the independent note/checkpoint branch and does not trigger the website deployment workflow.

## Near-term sequence
1. **New Planner chat BOOT:** read `HANDOFF.md` from the documentation PR if it is not merged, and current `planner/STATE.md` on `planner/context`; then examine current remote `main`/`staging` heads, open PRs, workflow runs, canonical docs and relevant ticket.
2. **T22.0 S6:** obtain Product Authority's release go for a single combined docs/evidence closure. Ask Claude Code to prepare final S4/S5 evidence, close/reconcile T22.0, related T20/T21 records, `site/CHANGELOG.md`, and the content of PR #1. Selectively take files from `staging`; **never merge `staging` wholesale**.
3. Review one **combined documentation diff**, keeping code, workflows and PDFs unchanged. No production push without approval. On authorized `main` push, preserve `SITE_INDEXING=open`, `PDF_CARRY_OVER=true` and the exact five-entry `PDF_MANIFEST` (normally `PDF_RELEASE` unset). Post-deploy compare all five live SHA-256 hashes and robots/sitemap/canonical redirects. Only then mark S6 CLOSED.
4. Start **About simplification** after closure using the established planning process and a fresh, bounded ticket. Further manuscripts, Invariants DOI historical mismatch and format/reader polish remain separate backlog items.
5. Keep Google Search Console and Google Scholar discovery as asynchronous monitoring; do not equate submission with inclusion.

## Relevant pointers
- Root `HANDOFF.md`: launch timeline, exact five approved PDF hashes, evidence status, source map.
- `planner/README.md`: operating protocol; `planner/checkpoints/2026-10-18-public-launch-continuity.md`: why this workspace exists and launch-context decisions.
- `site/PLANNING.md` §3: canonical/source-of-truth hierarchy; `site/ROADMAP.md`: active backlog; `site/AGENTS.md`: deployment/indexing constraints.
- GitHub: `https://github.com/amulbham/cybernetics-mbp/pull/1`; `https://github.com/amulbham/cybernetics-mbp/actions/runs/38982151022`.

# Project handoff — research website (refreshed 2026-10-18)

**Purpose:** durable, repo-backed context for a fresh Planner or Executor session. Read this first, then inspect the *current* remote heads, `site/ROADMAP.md`, `site/AGENTS.md`, `site/PLANNING.md`, and the relevant source/ticket. This is a point-in-time snapshot, not authority over later commits or deployed evidence.

## Fresh-session boot (Planner Workspace v1, approved 2026-10-18)
- **Latest working context:** read [`planner/STATE.md` on the non-deploying `planner/context` branch](https://github.com/amulbham/cybernetics-mbp/blob/planner/context/planner/STATE.md), then [`planner/README.md`](planner/README.md) and the most recent relevant checkpoint. The `planner/context` branch may be newer than this snapshot.
- **Authority split:** this HANDOFF supplies orientation, `planner/` holds provisional working notes, and `site/PLANNING.md` plus code/canonical docs own approved rules and release procedures. Never treat a checkpoint as a sealed ticket or a successful deployment.
- **Transition:** fresh chats handle active website planning; the previous long chat is for consulting. Boot by checking current GitHub branches, actions and open PRs. The initial workspace lives in [draft PR #1](https://github.com/amulbham/cybernetics-mbp/pull/1) until approved T22.0 S6 promotion to `main`; do not interpret the PR as merged or production verified.
- **No automatic deploy:** `planner/context` receives routine checkpoints. A `main` or `staging` push deploys the website and requires explicit authorization and verification.

## Roles and operating model
- **Product Authority:** the site owner; decides editorial content, publication, indexing, scope, production gates and review exceptions.
- **Planner/reviewer:** ChatGPT; audits contracts and code/evidence, flags drift, proposes bounded instructions. Does not equate Executor reports with independent verification.
- **Executor:** Claude Code; reads repo instructions, works inside approved paths, seals required tickets, checks local/staging/production evidence, and stops at approval gates. Do not orchestrate external reviewers without explicit authorization.
- **Repository:** `amulbham/cybernetics-mbp`; Astro site under `site/`, hosted on Cloudflare Pages; production `https://amulbham.com`; staging `https://staging.cybernetics-mbp-site.pages.dev`. The GitHub Actions workflow `.github/workflows/deploy-pages.yml` is deploy authority. **Do not wholesale merge `staging` to `main`**: divergent staging includes TP2 planning/agent-governance history; promotions are product-only and verified.

## Current release state (last verified on 2026-10-16)
- **Production `origin/main`:** `384f0349fb313733c4feb27e17a8e5caf3580696`. Successful S4 indexing-open workflow **#118**, run ID `38982151022` (GitHub Actions). This branch head and run were independently read via the GitHub connector.
- **Staging at last report:** `b26267cfa619dd0ccbd63e4b39a7512b0d13521e`. Check again at next session.
- **T22.0 S0–S4:** production content deployment, Zenodo Desk PDF byte-parity correction, and production-only indexing activation reported verified. Six research entries (five `paper`, one `essay`), five scholarly PDFs, one published Chisel IWL companion, 23 redirects (22 frozen T19.0 + Desk legacy `paper.pdf`).
- **Indexing as reported after S4:** production `robots.txt` = `Allow: /` with `Sitemap: https://amulbham.com/sitemap-index.xml`; sitemap index references `sitemap-0.xml` (13 canonical URLs: home, About, research hub, three populated categories, six research entries, Chisel IWL). Public article pages `index, follow`. Search, 404, empty `ai-systems`/memos and 41 tag pages remain `noindex, nofollow` and outside sitemap. `pages.dev` preview/staging receives `X-Robots-Tag: noindex, nofollow`; production host does not. This host-level matrix is from Executor deployed checks; reverify after subsequent deployments.
- **S5 Google Search Console:** **Product Authority confirmed on 2026-10-16 that Search Console setup was finished** after the S4 indexing-open deployment. Treat S5 as owner-reported complete; this chat does not have access to the private Search Console dashboard, the submitted-sitemap status, or any URL Inspection details. Google crawling/indexing and Google Scholar inclusion remain pending external processes, not evidence of a site problem.
- **S6 documentation closure:** still pending as of the 2026-10-18 GitHub check. The handoff/README/roadmap/Planner Workspace additions are **a proposed documentation branch, not T22.0 closure or authorization to push production**.

## Scholar publication integrity
- Desk DOI: `10.5281/zenodo.23328158`; public Zenodo deposit has PDF SHA-256 `268d16c0f29d6ba4c0e8299ff30a816fe44d62591206e434ae277d080b40cfd9`, 425,531 bytes, 37 pages. The production PDF at `/research/knowledge-work/the-desk-is-where-you-write-it-down/the-desk-is-where-you-write-it-down.pdf` was reported downloaded and **byte-identical** after correction.
- The other four approved production PDF SHA-256 values:
  - Invariants: `4b4e3b618e32a479a140d9cac4c180c18c3f57c9861a2df4999229772a6e0ab4`
  - Three SOS: `e86bd3005402badc647046096f71968bdfbb248efa017d467e2d769e2df1c21e`
  - FAFSA: `d8ec32df31da35dd2e8efa6eda2aeb1d75cde70bd7e3a2a35a90cb93bf4df54f`
  - Chisel: `6d169f28465fe1b388d8b9985e6a36a2218ab1bdf8e9d1b8e02134216497b6fd`
- Manifest format: one `sha256sum` line per paper at the repository variable `PDF_MANIFEST`. Workflow `scripts/carry-over-pdfs.sh` replaces non-reproducible generated PDFs with approved bytes, verifies before deploy and again after. Blank manifest lines are ignored; missing/extra/incorrect file paths or mismatched hashes fail closed. One pinned Zenodo-bootstrap exception exists for Desk only.
- **Keep production GitHub Actions repository variables:** `SITE_INDEXING=open`, `PDF_CARRY_OVER=true`, `PDF_MANIFEST` containing all five approved hashes; `PDF_RELEASE` normally unset. Do not change without Product Authority consent. Variable changes only affect the next successful build/deploy.
- Guard: when the manifest exists, ordinary production deploy with carry-over off fails before building, unless an explicitly authorized `PDF_RELEASE=new-version` procedure. A later source/metadata change to a PDF needs deliberate publication/version coordination. An older Invariants Zenodo deposit reportedly has different historical bytes: unresolved version/history question, **not** a confirmed current release defect.

## Session decisions and sequence
1. T19.0 taxonomy migration was product-only promoted and production verified; required `category` controls routes, `format: paper` controls PDF/Highwire/`ScholarlyArticle`.
2. T20.0 Desk manuscript staged; T20.1 reading/appendix presentation and accessibility checks accepted on staging. Screen-reader behavior was not directly verified.
3. T21.0 homepage simplified and accepted: short hero, manually pinned Desk, five-item chronological feed (spotlight excluded), full archive link. 404 uses original three-card presentation.
4. T22.0 launch prepared as local product-only candidate; Product Authority explicitly waived **two independent R3 pre-seal reviews for T22.0 only**. Exception must not be described as reviews completed. Ticket sealed `de25ed9` on staging.
5. S1 preview indexing mechanism verified; S2 six publications promoted to production indexing-closed at `cde8012`; Zenodo Desk PDF had same reported content but different binary SHA.
6. Authorized Amendment A: exact Zenodo Desk PDF bootstrapped onto production while preserving four existing PDF hashes. Failed runs #114/#115 stopped before upload; #115 diagnosed blank manifest line; #116 succeeded on `384f034` after accepting blank lines.
7. S4 was explicitly approved and manually deployed via Actions workflow #118 at the same `384f034` commit; production indexing-opening matrix reported passed. **S5 Search Console setup was subsequently confirmed complete by the Product Authority on 2026-10-16. S6 closure is still separate and unperformed.**

## Next actions for a new chat
1. Read `planner/STATE.md` from `planner/context` and this HANDOFF, then fetch current `origin/main`/`origin/staging`, most recent GitHub Actions deployments and open PRs before issuing new instructions.
2. Treat S5 as **owner-reported complete**, not independently inspected. If needed, request a Search Console screenshot/export for submitted-sitemap status and any URL Inspection errors; do not redo ownership verification or sitemap submission by default. Monitor future crawl/indexing and Google Scholar discovery separately.
3. Finish **T22.0 S6** docs/evidence closure *after* Product Authority acceptance; any `main` push triggers full deploy, so maintain `PDF_CARRY_OVER=true` and `PDF_MANIFEST`, then re-verify all five PDF hashes, robots/sitemap, and production. Do not treat this handoff branch as S6 itself.
4. Then return to the editorial **About simplification**, remaining corpus work, and low-priority polish. No need to relaunch or change indexing to redesign About.
5. Save approved context checkpoints on `planner/context`; promote verified decisions to `site/CHANGELOG.md` (history), `site/ROADMAP.md` (active work), and other canonical locations as appropriate. Refresh this handoff at significant release boundaries, not every turn. Do not rewrite sealed history.

## Source of truth / useful commands
- `site/AGENTS.md`: repo implementation, deployment and indexing rules; `site/PUBLISHING.md`: research publication semantics; `site/PLANNING.md`: roles, risk gates, seal rules; `site/ROADMAP.md`: pending work; `site/CHANGELOG.md`: historical shipped record.
- `site/planning/tickets/T22.0-public-mvp-launch.md` and related audits/evidence should be checked on whichever branch actually contains them; historical T20/T21 ticket files may still live only on `staging` pending S6.
- Run local `cd site && npm ci && npm run build && npm run build:pdfs && npm run validate:pdfs`; then validate deployment host and PDF SHA values separately. Do not claim local success until run.
- URLs: `https://amulbham.com/robots.txt`, `https://amulbham.com/sitemap-index.xml`, `https://github.com/amulbham/cybernetics-mbp/actions/workflows/deploy-pages.yml`.

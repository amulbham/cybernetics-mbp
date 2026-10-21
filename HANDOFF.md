# Project handoff — research website

**Purpose:** stable orientation for a fresh Planner, Reviewer or Executor. It holds no release inventory. It says where current facts live and how to check them, so it should rarely need editing.
Structural revision: 2026-10-21 (T25.1), on `planner/context`. `main` still carries the older 2026-10-18 snapshot of this file until a selective promotion is separately approved. That earlier text is in Git history (`git show 2a50965:HANDOFF.md`).

## Start here
1. [`planner/STATE.md`](https://github.com/amulbham/cybernetics-mbp/blob/planner/context/planner/STATE.md) on `planner/context`: current objective, approvals, limits and the next gate.
2. The assigned ticket, plus the [review and task entry](site/planning/audits/sprint-25/README.md) for role prompts and review submission.
3. Procedure: [`planner/README.md`](planner/README.md) (branches, boot, checkpoints). Authority: [`site/PLANNING.md`](site/PLANNING.md) §2–§3. Plain-language Git and cloud guide for the owner: [`site/OPERATOR-GUIDE.md`](site/OPERATOR-GUIDE.md).
4. Read current `main` and `staging` separately for product and release facts. Product code on `planner/context` can be older than `main`, and a branch name is not proof of freshness.

## Who decides
Product Authority (Amul) decides scope, editorial content, publication, indexing and production release. Planner plans and reviews. Executor works inside one sealed ticket. Reviewer pressure-tests an exact revision. Roles are responsibilities, not products; the rules are in [`site/PLANNING.md`](site/PLANNING.md).

## Where facts live
| Fact | Owner |
|---|---|
| Current objective and next gate | `planner/STATE.md` (`planner/context`) |
| Why a decision was made | `planner/checkpoints/` (dated, not rewritten) |
| Work order and authorization | sprint plan and sealed ticket under `site/planning/` |
| Review and audit evidence | `site/planning/audits/` |
| Deploy, indexing, operations | [`site/AGENTS.md`](site/AGENTS.md) |
| Publishing and content flow | [`site/PUBLISHING.md`](site/PUBLISHING.md) |
| Active and deferred work, history | `site/ROADMAP.md`, `site/CHANGELOG.md` (check against Actions before trusting) |

## Checking release state
- `main` is the production **source**, not proof of what is live. Open the [Deploy Pages runs](https://github.com/amulbham/cybernetics-mbp/actions/workflows/deploy-pages.yml) and find the run for `main`'s latest commit. That commit is live once the run's Cloudflare deploy step succeeded. If the run failed earlier, production may still be on an earlier deployment; if it failed afterward, the upload may already have happened, so a red run alone does not show nothing deployed.
- Deployment actions: a push to `main` or `staging` (including a merge into either), a manual **Run workflow**, and a re-run of a past run. Pushing any other branch does not deploy.
- Repository variables (`PDF_MANIFEST`, `PDF_CARRY_OVER`, `PDF_RELEASE`, `SITE_INDEXING`) are owner settings that not every session can read. A past run's log shows the values that run used, not today's. See the indexing and PDF sections of `site/AGENTS.md`.
- Do not wholesale merge `staging` into `main`; promote scoped, verified changes.

## Evidence and provenance
- Launch and PDF-preservation record: [T22.0 evidence](https://github.com/amulbham/cybernetics-mbp/blob/main/site/planning/audits/T22.0-public-mvp-launch-evidence.md) and [T23.0 evidence](https://github.com/amulbham/cybernetics-mbp/blob/main/site/planning/audits/T23.0-chisel-revision-evidence.md) on `main`.
- Release acceptance and documentary lag: [T24 checkpoint](planner/checkpoints/2026-10-20-t24-release-workflow-next.md). Chisel decisions: [2026-10-18 checkpoints](planner/checkpoints/).
- Workflow audit: [publishing-flow sweep](planner/audits/2026-10-18-publishing-flow-doc-sweep.md), [T25.0 audit](site/planning/audits/sprint-25/T25.0-current-state-audit.md), [Planner review](site/planning/audits/sprint-25/T25.0-planner-review.md).

## Owner-managed and unverified here
Zenodo deposits and DOI completion, Google Search Console and search-engine inclusion are the owner's to confirm. The linked launch and Chisel evidence records which results were verified and which were owner-confirmed; do not recheck deposits unless asked. Current Chisel Zenodo/DOI completion is not established here.

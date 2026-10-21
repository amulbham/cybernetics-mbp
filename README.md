# cybernetics-mbp

Independent research publishing site for [Amul Bham](https://amulbham.com), built in Astro and deployed via GitHub Actions to Cloudflare Pages.

**New session? Start with [HANDOFF.md](HANDOFF.md)**, then [`planner/STATE.md` on the `planner/context` branch](https://github.com/amulbham/cybernetics-mbp/blob/planner/context/planner/STATE.md). The handoff is a stable map and does not carry release inventories; STATE holds the current objective and next gate. Planner working-memory updates do not need production deployments. Learning Git or the cloud workflow? Read the short [owner guide](site/OPERATOR-GUIDE.md).

## Planner shared workspace
- [`planner/README.md`](planner/README.md) — working-memory protocol, branch rules, checkpointing and promotion.
- [`planner/checkpoints/`](planner/checkpoints/) — selected reasoning/decision snapshots, not implementation authority.
- `planner/context` — non-deploying branch for the latest mutable Planner state and new checkpoints; always verify current `main` separately.

## Repository guide
- [`site/AGENTS.md`](site/AGENTS.md) — implementation/deploy/indexing rules and canonical technical boundaries.
- [`site/PUBLISHING.md`](site/PUBLISHING.md) — scholarly research collection, metadata, PDF and content presentation contract.
- [`site/PLANNING.md`](site/PLANNING.md) — authority, ticket sealing, review and release gates.
- [`site/OPERATOR-GUIDE.md`](site/OPERATOR-GUIDE.md) — plain-language branches, Git actions, deployments and approvals for the owner.
- [`site/ROADMAP.md`](site/ROADMAP.md) — active and deferred work; verify release claims against GitHub Actions.
- [`site/CHANGELOG.md`](site/CHANGELOG.md) — historical changes.
- [`site/design-system/`](site/design-system/) — visual rules.

## Branches and release safety
`main` is the source of [production](https://amulbham.com), and a successful workflow run is what puts it live; `staging` deploys a blocked-from-indexing Pages preview. A push to either branch, a manual **Run workflow**, or a re-run deploys. **Do not wholesale merge staging into main**; histories include unrelated TP2 governance work. Use approved, scoped promotions and verify live deploys. Check `PDF_MANIFEST`, `PDF_CARRY_OVER`, and `SITE_INDEXING` before authorizing any production deployment action.

## Local verification
```sh
cd site
npm ci
npm run build
npm run build:pdfs
npm run validate:pdfs
```

See [`site/README.md`](site/README.md) for site-specific entry points and workflow notes. No GitHub Actions success alone proves that a public page has been indexed by Google.

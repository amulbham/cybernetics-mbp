# cybernetics-mbp

Independent research publishing site for [Amul Bham](https://amulbham.com), built in Astro and deployed via GitHub Actions to Cloudflare Pages.

**New session? Start with [HANDOFF.md](HANDOFF.md).** It captures the latest verified production state, launch decisions, outstanding gates, PDF hashes and the shortest context-recovery path.

## Repository guide
- [`site/AGENTS.md`](site/AGENTS.md) — implementation/deploy/indexing rules and canonical technical boundaries.
- [`site/PUBLISHING.md`](site/PUBLISHING.md) — scholarly research collection, metadata, PDF and content presentation contract.
- [`site/PLANNING.md`](site/PLANNING.md) — authority, ticket sealing, review and release gates.
- [`site/ROADMAP.md`](site/ROADMAP.md) — current shipped state and next work.
- [`site/CHANGELOG.md`](site/CHANGELOG.md) — historical changes.
- [`site/design-system/`](site/design-system/) — visual rules.

## Branches and release safety
`main` deploys [production](https://amulbham.com); `staging` deploys a blocked-from-indexing Pages preview. **Do not wholesale merge staging into main**; histories include unrelated TP2 governance work. Use approved, scoped promotions and verify live deploys. Every `main` push triggers a workflow build/deployment: check `PDF_MANIFEST`, `PDF_CARRY_OVER`, and `SITE_INDEXING` before authorizing a production push.

## Local verification
```sh
cd site
npm ci
npm run build
npm run build:pdfs
npm run validate:pdfs
```

See [`site/README.md`](site/README.md) for site-specific entry points and workflow notes. No GitHub Actions success alone proves that a public page has been indexed by Google.

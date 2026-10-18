# Research site (Astro)

This is the Astro application for [amulbham.com](https://amulbham.com), not the Astro starter blog.

For the current release state and context handoff, start at [`../HANDOFF.md`](../HANDOFF.md). Read [`AGENTS.md`](AGENTS.md) before changing implementation or deployment, [`PUBLISHING.md`](PUBLISHING.md) for content/metadata/PDF contract, [`PLANNING.md`](PLANNING.md) before executing sealed tickets, and [`ROADMAP.md`](ROADMAP.md) for priorities.

## Structure
- `src/content/research/`: authored research entries; `category` controls routing, `format` controls scholarly PDF eligibility.
- `src/content/iwl/`: published or unpublished companion Intellectual Work Ledgers.
- `src/pages/`, `src/layouts/`, `src/components/`: HTML routes, publication shell and UI.
- `src/lib/indexing.mjs`, `src/pages/robots.txt.js`, `public/_headers`: crawl-control contract.
- `scripts/`: research validators, PDF builder and PDF carry-over guard.
- `.github/workflows/deploy-pages.yml` (repo root): authoritative deployment workflow.

## Commands
```sh
npm ci
npm run build            # source/link/semantic/indexing checks, Astro, Pagefind
npm run build:pdfs       # creates scholarly PDFs in dist/
npm run validate:pdfs    # checks PDF/HTML identity and redirects
npm run preview          # local built-site preview
```

Cloudflare Pages native Git builds are not the intended publication pipeline; GitHub Actions generates and deploys the complete HTML + PDFs. Do not deploy directly without confirming which indexing and PDF-preservation settings apply. Changes to `main` automatically trigger production deployments.

**Publication safety:** the production repository variables `SITE_INDEXING`, `PDF_MANIFEST`, `PDF_CARRY_OVER`, and `PDF_RELEASE` govern crawling and artifact preservation. Never mutate them without authorization. See `AGENTS.md` and the live T22.0 ticket for exact gates.

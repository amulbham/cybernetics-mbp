# amulbham.com — research website

This repository contains the source for [amulbham.com](https://amulbham.com), my independent research and writing site. It's built with Astro and published through GitHub Actions to Cloudflare Pages.

The site has also become a development project of its own. I use AI tools throughout the process, from planning changes and implementing features to reviewing the result and deciding what is ready to publish. Over time, that work has grown into a set of project tickets, automated checks, and release procedures that help me keep the source, the published articles, and the live website consistent.

## What the project includes

- An Astro site for research papers, essays, and related reading material.
- Structured publication metadata and a PDF workflow for scholarly papers.
- Search and navigation across the research collection.
- Automated checks for links, publication semantics, indexing, PDFs, and release integrity.
- A planning and review process that records why a change was made, what was allowed to change, and what was actually verified.

## A few useful starting points

If you're interested in how the site is developed, these files show the process better than a feature list would:

- [A real implementation ticket: publication taxonomy migration](site/planning/tickets/T19.0-publication-taxonomy-migration.md) — the intended change, constraints, test cases, and release boundaries.
- [Evidence from that migration](site/planning/audits/T19.0-taxonomy-migration-evidence.md) — the recorded verification work. The ticket documents a one-time reduced-review exception; it should not be read as two independent reviews having been completed.
- [PDF and publication validator](site/scripts/validate-research-pdfs.mjs) — code that checks whether published artifacts agree with the site's declared metadata and routing.
- [Planning and review protocol](site/PLANNING.md) — how decisions, implementation, review, and release authority are separated.

## Technology

Astro · JavaScript/TypeScript · GitHub Actions · Cloudflare Pages · Pagefind · automated content and publication checks.

The live site is at [amulbham.com](https://amulbham.com). The Astro application and its local development instructions are in [`site/`](site/README.md).

## For maintainers and returning AI sessions

**Start with [HANDOFF.md](HANDOFF.md)** for a point-in-time project orientation, then the [current Planner state on `planner/context`](https://github.com/amulbham/cybernetics-mbp/blob/planner/context/planner/STATE.md). Always inspect the latest branches, source, and deployment results before treating handoff notes as current truth.

Key documents:

- [Planner workspace guide](planner/README.md) and [checkpoints](planner/checkpoints/) — working context and decisions, not release authority.
- [Implementation rules](site/AGENTS.md) — source boundaries, validation, indexing, and deployment.
- [Publishing contract](site/PUBLISHING.md) — research entries, metadata, PDF identity, and public-facing content requirements.
- [Planning protocol](site/PLANNING.md) — ticket contracts, reviews, and release gates.
- [Roadmap](site/ROADMAP.md) and [changelog](site/CHANGELOG.md) — current priorities and historical outcomes.
- [Design system](site/design-system/) — presentation conventions.

### Branches and release safety

`main` deploys production at [amulbham.com](https://amulbham.com). `staging` is a preview environment that should remain blocked from indexing. The `planner/context` branch is a non-deploying working-memory surface.

**Do not wholesale merge `staging` into `main`.** The branches may contain unrelated planning or governance work; release only approved, scoped changes. Any push to `main` can trigger a production deployment, including a documentation-only push. Preserve the repository's existing indexing and PDF safety requirements; see [site/AGENTS.md](site/AGENTS.md) and [HANDOFF.md](HANDOFF.md) before promotion.

### Local verification

```sh
cd site
npm ci
npm run build
npm run build:pdfs
npm run validate:pdfs
```

Those commands check local artifacts; they do not by themselves prove that a production deployment succeeded or that a page was indexed by a search engine. Production release acceptance requires the applicable deployed checks and repository gates.

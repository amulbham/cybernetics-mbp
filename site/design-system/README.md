# Design system

This folder is the visual contract. Tokens live in `src/styles/global.css` — this folder explains them, so a future session (or agent) restyles nothing that isn't written down here.

**Voice**: paper, ink, one signal. A systems researcher's desk, not a product launch.

**Philosophy**: do not optimize research for shorter attention spans; optimize the interface for deeper attention. Prose is the default. Semantic primitives (see `CONTENT-MODULES.md`) appear only at cognitive load, not for decoration.

**Two font families only**: Atkinson Hyperlegible (body and headings — no separate display face) and IBM Plex Mono (`.meta` utility class and code only — dates, tags, breadcrumbs, pillar labels).

**Light and dark are equal reading modes**, not a default plus an afterthought. Every color token ships both values, plus the `prefers-color-scheme` fallback for a reader who hasn't made an explicit choice.

**Responsive**: the header is one row at every width, always — narrower viewports remove or shrink chrome (Home link, brand wordmark) rather than collapsing into a hamburger or a second row. Below 768px: `Home` drops from the nav (Research/About/Search/theme stay) and the brand wordmark hides, leaving just the mark; the search and theme controls stay full-size, since they're the two things a reader reaches for on every visit regardless of screen width. No breakpoint below 768px changes anything else in the header — the same one-row shape holds down to 375px.

## Index

- [`tokens.md`](./tokens.md) — every color/spacing/radius/type/motion token as shipped, with roles and the one contrast fix that changed a value from its original spec.
- [`components.md`](./components.md) — the existing component set's visual rules as shipped. Not a catalog of what's possible — a record of what's real.
- [`do-not.md`](./do-not.md) — the load-bearing constraints. Short, no essays.

Pipeline, content, and routing rules (frontmatter schema, citation conventions, the masthead system, deploy discipline) live in `site/AGENTS.md`, not here — this folder is visual only. For what a research page *is* end-to-end — frontmatter, transforms, layout, grammar, presentation, all in one map — see `site/PUBLISHING.md`, the publishing specification.

**Last locked**: Signal visual pass, 2026-08-26, `staging` commit `756aa39`.

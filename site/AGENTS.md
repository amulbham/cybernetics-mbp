# cybernetics-mbp

Personal research hub for Amul Bham (amulbham.com) — Astro 7, static output, deployed on Cloudflare Pages. This file auto-loads every session. **At the start of new work, read `ROADMAP.md` for pending items and `CHANGELOG.md` for recent history** — both are real files in this repo, not auto-loaded, so they have to be opened deliberately.

## Development

```sh
astro dev --background
```

Manage with `astro dev stop`, `astro dev status`, `astro dev logs`. Search (`/search`, Pagefind) and OG images only work against a built site — `astro dev` can't serve either. To test them: `npm run build && astro preview`.

## Deploy workflow — staging → production

- **`main`** is production. Cloudflare Pages watches it and auto-deploys to `amulbham.com` on every push.
- **`staging`** is the working branch. Every push gets its own live Cloudflare Pages preview build, fully isolated from production. Stable branch alias: `https://staging.cybernetics-mbp-site.pages.dev/` (always reflects the latest push to `staging`; per-commit preview URLs like `https://<hash>.cybernetics-mbp-site.pages.dev/` also exist but change on every push).
- **Day-to-day**: do work on `staging`, push, check the preview, iterate as many times as needed — nothing reaches `amulbham.com` until `staging` is merged into `main`. Merge via GitHub PR (`github.com/amulbham/cybernetics-mbp/pull/new/staging`) or a direct `git merge staging` into `main` — either way, verify the live preview *before* merging and re-verify production *after*, since a merge triggering a build isn't the same as confirming the build actually shipped what you expect.
- Cloudflare Pages project settings: root directory `site` (the repo root isn't the Astro project), build command `npm run build` (this already includes the Pagefind indexing step — see below), output directory `dist`, Node 22+.

## Indexing state — READ BEFORE TOUCHING

The site is **deliberately deindexed** while content/design work continues:

- `public/robots.txt` → `Disallow: /`
- `src/components/BaseHead.astro` → `const SITE_WIDE_NOINDEX = true;` forces `noindex, nofollow` on every page via the `<SEO/>` call, regardless of environment (staging and production both stay deindexed).
- Individual pages can still force `noindex` themselves via `<BaseHead noindex />` regardless of the site-wide flag (used by `404.astro`, since a 404 should never be indexed even after launch).

**Do not flip `SITE_WIDE_NOINDEX` to `false` or restore `robots.txt` to `Allow: /` without the user explicitly asking for it.** When they do: flip both together (they were designed as one change), and restore the `Sitemap: https://amulbham.com/sitemap-index.xml` line in `robots.txt` at the same time.

## Design system

- **Tokens**: `src/styles/global.css`. Semantic color tokens (`--bg`, `--text-primary`, `--text-secondary`, `--accent`, `--border`, etc.) with a `:root[data-theme='dark']` override block plus a `@media (prefers-color-scheme: dark)` fallback for users who haven't made an explicit choice. Also: spacing (`--space-1`…`--space-8`), radius (`--radius-sm/md/lg/full`), a modular type scale (`--text-xs`…`--text-4xl`), two content-width tokens (`--content-width-prose` 720px for reading columns, `--content-width-wide` 960px for grids/listings), and per-pillar accent colors (`--pillar-*`, muted tints via `color-mix()`, not full-saturation fills).
- **Dark mode**: `ThemeToggle.astro` (vanilla JS, no framework) toggles `data-theme` on `<html>` and persists to `localStorage`. `BaseHead.astro` has a render-blocking inline script that applies the stored preference before first paint (no flash). The toggle's click handler is bound via event delegation on `document`, not the button directly — View Transitions swaps/recreates the header on every client-side navigation, so a handler bound to the button itself would silently stop working after the first navigation.
- **Fonts**: two families only (deliberately not three — keeps it "restrained"). Atkinson Hyperlegible for body *and* headings (bold weight for headings, no separate display face). IBM Plex Mono reserved strictly for metadata: dates, tags, breadcrumbs, pillar labels, code blocks — anywhere the `.meta` utility class is used. Both are declared in `astro.config.mjs`'s `fonts` array *and* must be rendered via `<Font cssVariable="..." />` in `BaseHead.astro` — declaring a font in config without rendering it via `<Font>` silently does nothing (`var(--font-mono)` just falls back to generic `monospace`).
- **Shared components** (`src/components/`): `Button` (primary/secondary/ghost, renders `<a>` or `<button>`), `Card` (bordered list-item wrapper; exposes `--card-hover-color` custom property so slotted headings can react to card hover without needing `:global()` — Astro's CSS scoping means a parent's `<style>` can't target a child component's elements by tag name), `Badge` (neutral or pillar-tinted), `Breadcrumbs`, `RecentResearch` (self-contained: fetches + renders the 3 most recent papers, used on the homepage and the 404 page), `SocialLinks` (LinkedIn/Substack/GitHub, footer only — deliberately not in the header, which stays limited to primary nav + search + theme toggle), `ThemeToggle`, `TableOfContents` (sticky rail, gated behind a heading-count threshold — see below).
- **Layouts** (`src/layouts/`): `ArticleShell.astro` is the shared title/date/prose shell for both `PaperLayout.astro` and `BlogPost.astro`, with named slots (`hero`, `before-title`, `after-title`, `toc`, default) for what differs between the two. `PaperLayout.astro` additionally emits `ScholarlyArticle` + `BreadcrumbList` JSON-LD and generates each paper's Open Graph image route.
- **Table of contents**: only renders when a paper has **6 or more `##` headings** — this was measured, not guessed. All 3 short papers have exactly 4 `##` headings each; the one long paper (the financial-aid piece) has 15. A naive `>3` threshold would show a TOC on every paper. Only `##`-level headings are surfaced (not `###`), and there's deliberately no scroll-spy/`IntersectionObserver` — a static outline was judged sufficient for the orientation problem it's solving.

## Content

- **Collections**: `src/content.config.ts`. `papers` (the real content — 4 published pieces) and `blog` (schema exists, routes/layout exist, **zero posts currently** — nav link was removed but nothing else was touched, so it can be repopulated any time without extra work).
- **Papers frontmatter** — required: `title`, `pillar`, `pubDate`, `description`, `tags` (array). Optional: `dateModified`, `pdfUrl`. **No `canonicalURL` field** — it's derived in `PaperLayout.astro` from `pillar` + the file's slug, specifically so it can never drift from the actual route (this happened once: a paper's `canonicalURL` frontmatter still said its old pillar after the `pillar` field itself was updated, silently breaking that page's JSON-LD `url` for a while).
- **Pillars** (4): `ai-systems`, `seo-architecture`, `systems-architecture`, `policy-systems`. Each needs an entry in `PILLAR_DESCRIPTIONS` (`src/lib/pillars.ts`) for its landing page intro copy, and a `--pillar-*` color token in `global.css` if a 5th is ever added.
- **Tags**: free-text in frontmatter (e.g. `"Dependency Paradox"`), slugified for routing via `slugifyTag()` (`src/lib/tags.ts`) so casing/spacing variants land on the same `/tags/` page. No enforced vocabulary — see `ROADMAP.md` for why that's deliberate for now.
- **Adding a new paper**: create a `.md` file in `src/content/papers/`, frontmatter per the schema above, commit to `staging`, push, check the preview. Reading time, the table of contents, the OG image, the RSS feed, the tag pages, the pillar page, and related-papers cross-links are all generated automatically at build time from that one file — nothing else to touch.

## Documentation

Full documentation: <https://docs.astro.build>

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

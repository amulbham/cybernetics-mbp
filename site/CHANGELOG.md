# Changelog

Human-readable history of what shipped, in order, and why. Append new entries at the top. This is project history — never edit or delete a past entry to reflect a later change; add a new entry instead.

## 2026-08-18 (later) — Article JSON-LD cleanup, reusable References component, dependency security fixes

**Dependency security**: `npm audit` went from 6 vulnerabilities (1 moderate, 5 high) to 0. The moderate one was in Astro itself — a reflected XSS in View Transition animation properties — directly relevant since `<ClientRouter />` runs on every page. Bumped `astro` 7.0.7 → 7.2.3, which required also bumping `@astrojs/mdx` (7.0.2 → 7.0.6) and `@astrojs/markdown-remark` (7.2.1 → 7.2.3) together to resolve a peer-dependency conflict — astro 7.2.3 wants `@astrojs/markdown-remark@7.2.3` exactly, but the older mdx version pinned 7.2.1. The remaining 5 (transitive — `fast-xml-parser`, `js-yaml`, `nanoid`, `postcss`, `svgo`) resolved via a plain `npm audit fix`, no forcing needed. Verified nothing broke: full build, OG images, RSS, Pagefind assets, dark-mode tokens, live routes.

**Article JSON-LD cleanup**: added `author.sameAs` (LinkedIn/Substack/GitHub — real entity-association signal for Google's Knowledge Graph, not cosmetic), `image` (the OG image URL, already generated but never referenced in structured data), `wordCount`/`timeRequired` (already computed by the reading-time remark plugin, just never wired into JSON-LD), `inLanguage`, and `isPartOf` (links each paper to its pillar as a `CollectionPage`). Deliberately no `publisher` (no separate publishing entity for a personal site) or `license` (no decision made yet). Extracted `SOCIAL_LINKS` into `src/consts.ts` as the single source of truth, used by both `SocialLinks.astro` and the new `sameAs` field — avoids duplicating the same three URLs a second time.

**Reusable References component** — and a new standing policy, not just a one-off: recurring content-section patterns (References today, others as they recur) get a build-time remark/rehype transform, not MDX or hand-written components, so authoring stays plain Markdown with zero format changes. `rehype-references.mjs` detects a "References" heading followed by a numbered list and wraps both in a styled `<section class="references">`. **Bug found and fixed while building it**: the plugin silently did nothing on the very first attempt — traced it through three layers before finding the real cause. It wasn't the plugin logic (confirmed correct in isolation via a standalone test script) and wasn't `remarkPlugins`-vs-`rehypePlugins` registration (syntactically identical, and remark plugins on the same `unified()` config were already working). It was a stale cache: `node_modules/.astro/data-store.json`, a content-layer cache separate from `dist`/`.astro`/Vite's cache, was still serving HTML rendered before the plugin existed, even across multiple "clean" rebuilds that cleared the other three cache locations. Also found, while writing the detection logic itself: the heading and list aren't strictly adjacent hast nodes — there's a whitespace-only text node between them — so naive `children[i + 1]` adjacency checks silently fail.

## 2026-08-18 — Useful 404 page, footer social links, first staging→production cycle

- **404 redesign**: was a dead end (just a heading and two buttons); now shows Go home / Search actions plus a live "Recent Research" section (3 most recent papers) so a lost visitor has somewhere productive to go. Extracted that section into `RecentResearch.astro` since it was about to be duplicated between the homepage and the 404 page.
- **Footer social links**: added LinkedIn, Substack, GitHub via a new `SocialLinks.astro` component. Deliberately footer-only, not header — considered and explicitly rejected putting them in both, to keep the header limited to primary nav. Accessible (`aria-label` per icon-only link), `rel="noopener noreferrer"` on the external links (the original starter template was missing this). Footer itself redesigned as a row (copyright left, icons right) mirroring the header's own layout.
- **Bug found while touching this layout**: `<main>` on both `index.astro` and `404.astro` was never actually widened to `--content-width-wide`, so the "wide" research-feed grid had been silently rendering in the narrower 720px prose column since it was first built. Fixed on both pages.
- **First full staging → preview → merge → production cycle**, run end to end and verified at every stage: pushed to `staging`, checked the Cloudflare Pages preview (both the per-commit URL and the stable branch-alias URL, `staging.cybernetics-mbp-site.pages.dev`), fast-forward merged into `main`, confirmed the production deploy actually picked up the change (polled `amulbham.com` until the new build was live, then re-ran the same verification checks against production).
- Wrote this changelog, `ROADMAP.md`, and expanded `AGENTS.md`/`CLAUDE.md` into a real project reference — this entry included.

## 2026-08-14 — Cloudflare Pages deployment, analytics, launch prep

- Custom 404 page (v1 — see 2026-08-18 for the redesign), built on the shared design system.
- `BaseHead.astro` refactored: the hardcoded `noindex={true}` became `const SITE_WIDE_NOINDEX = true` plus a per-page `noindex` override prop, so the eventual "go live" flip is a one-line change instead of touching the `<SEO/>` call directly, and pages like 404 can force `noindex` regardless of the site-wide flag.
- Cloudflare Web Analytics beacon wired into `BaseHead.astro` with a real per-site token.
- Ran a genuinely clean build (`rm -rf node_modules && npm install && npm run build`) to confirm what Cloudflare's build pipeline would actually do, not just what the warm local cache produced.
- Created and pushed the `staging` branch.
- **Bug found and fixed**: the financial-aid paper's `canonicalURL` frontmatter still said `systems-architecture` after its `pillar` field had been changed to `policy-systems` in an earlier phase — its JSON-LD `url`/`mainEntityOfPage` had been silently wrong since then. Fixed properly, not patched: removed `canonicalURL` from the content schema entirely and derive it in `PaperLayout.astro` from `pillar` + the file's slug, so this class of drift is now structurally impossible.
- User connected Cloudflare Pages (dashboard, not something Claude could do directly) and attached `amulbham.com` + `www.amulbham.com`. Verified live: DNS/SSL, real page content (not a parking page), all routes, CSS/font assets, both font families, RSS, generated OG images, real 404 handling, `noindex`/`robots.txt` still correctly holding.

## 2026-08-13 to 2026-08-14 — Content-hub features (Phase 4, split into 4A/4B)

Split into two phases based on a real distinction: 4A is the static/machine-readable layer (build-time only, zero client JS); 4B is runtime UX (things that touch the DOM, scroll, or ship client-side JS). Reading time and the related-papers module were originally planned for 4B but moved to 4A once it was clear they're pure build-time computation, same technical shape as the tag/pillar pages.

**4A:**
- Fixed `rss.xml.js` — it only ever pulled the (empty) `blog` collection, so the feed had been omitting all 4 real papers.
- Reading time: a small dependency-free remark plugin (`src/lib/remark-reading-time.mjs`).
- Tag pages (`/tags/[tag]/`) — added `slugifyTag()` since raw tags are inconsistently cased; paper tags became clickable instead of inert pills.
- Pillar landing pages (`/research-hub/[pillar]/`) with real intro copy per pillar. Fixed the paper-page breadcrumb (was still pointing at a same-page anchor on the hub index) and the hub index's pillar headings to link to the new pages.
- Related-papers module, scored by shared pillar + overlapping tags.
- OG images via `astro-og-canvas`, generated per paper at build time. **Bug found and fixed**: paper `description` frontmatter is a full abstract, not a short blurb — the first version overflowed off the bottom of the generated image canvas. Fixed with word-boundary truncation.
- `BreadcrumbList` JSON-LD added to paper pages. `BlogPosting` JSON-LD deliberately deferred — `blog` has zero posts, so it can't be verified against real content.
- Fixed an unrelated deprecation warning surfaced during this work: `markdown.remarkPlugins` is being phased out in favor of `markdown.processor: unified({...})` — migrated, added `@astrojs/markdown-remark` as an explicit dependency rather than relying on it being hoisted transitively.
- **Bug found and fixed**: `BlogPost.astro` received a `minutesRead` prop from its route but never destructured or forwarded it to `ArticleShell` — silently dropped.

**4B:**
- Table of contents: sticky rail, gated behind a heading-count threshold. Measured the real corpus before picking a number — the plan's original guess of `>3` would have shown a TOC on every paper (see `AGENTS.md` for the actual counts). Landed on `>5`.
- Pagefind search at `/search`. Added `data-pagefind-ignore` to `Header`/`Footer` so the identical nav/copyright text on every page doesn't pollute every search result (verified by decompressing the index and confirming the footer text appears zero times).
- View Transitions (`<ClientRouter />`). Two real correctness bugs caught here, not shipped blind: the theme-toggle's click handler was bound directly to the button, which would've silently broken after the first client-side navigation once the header got swapped — rewired to event delegation on `document`. Same root issue on `/search`'s Pagefind init (`DOMContentLoaded` never fires again for a soft navigation) — switched to `astro:page-load`. Also hit a real build failure along the way: Astro tried to bundle `<script src="/pagefind/pagefind-ui.js">` since that file doesn't exist until Pagefind's *post*-build step — needed `is:inline`.

## Early August 2026 — Design system rewrite (Phases 1–3)

A separately-drafted plan was reviewed, critiqued, and revised before execution: cut a proposed three-font stack down to two (Atkinson + IBM Plex Mono — "restrained" per the agreed visual direction), muted the proposed full-saturation per-pillar accent colors into tints, and added a 4th pillar (`policy-systems`) for the financial-aid paper, which had been mis-filed under `systems-architecture`.

- **Phase 1**: Full design-token rewrite in `global.css` (color/spacing/radius/type-scale/pillar-accent tokens), dark mode foundation (`[data-theme]` + `prefers-color-scheme` fallback), IBM Plex Mono + dual light/dark Shiki theme. **Bug found and fixed**: a font declared in `astro.config.mjs` but never rendered via `<Font>` silently falls back to its generic fallback — `--font-mono` wasn't actually loading IBM Plex Mono until this was caught.
- **Phase 2**: `ThemeToggle.astro` + anti-flash script in `BaseHead.astro`. Shared components extracted from duplicated inline styles: `Button`, `Badge`, `Card`, `Breadcrumbs`. `ArticleShell.astro` extracted from near-verbatim duplication between `PaperLayout.astro` and `BlogPost.astro`. **Bugs found and fixed**: a CSS specificity collision between `.meta` and `.badge-pillar` that depended on arbitrary bundle ordering (fixed with a compound selector); `:focus-visible` states were absent sitewide before this phase.
- **Phase 3**: Removed "Blog" from primary nav (collection/routes left untouched). Removed the original Astro-starter-template social links (Mastodon/Twitter/GitHub pointing at Astro's own accounts, not the site owner's) since no real handles existed yet — see 2026-08-18 for their real replacement. Added `--content-width-prose`/`--content-width-wide` tokens. Removed the unused `@astrojs/node` dependency (18 packages dropped).

## Prior to design system work — initial buildout

- Found the project mid-setup: an Astro blog starter template with a half-installed TinaCMS integration (no `tina/` config, no generated client, missing CLI package). Stripped it back to a plain Astro + markdown site rather than finishing the CMS install, since a personal research hub doesn't need a visual editor.
- Defined the `papers` content collection and its schema, set the real `site` URL in `astro.config.mjs`.
- Built `PaperLayout.astro` with `ScholarlyArticle` JSON-LD, restructured routing to `/research-hub/[pillar]/[slug]`, added the research-hub index, rewrote the homepage as an authority landing page.
- Published the first real paper (the financial-aid piece — long enough that pasting it in required two passes to avoid message truncation).
- Technical SEO infrastructure: sitemap, `robots.txt`, `astro-seo` integration in `BaseHead.astro`.
- Site deliberately deindexed (`robots.txt: Disallow: /`, hardcoded `noindex`/`nofollow`) pending launch — this is still the state as of the most recent entry above.

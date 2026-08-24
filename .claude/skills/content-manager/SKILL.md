---
name: content-manager
description: Use this skill when adding a new research entry (paper/essay/memo) to amulbham.com, or auditing/updating an existing one for consistency. Encodes the frontmatter schema, the automatic masthead/subtitle system, citation conventions by format, the tag-casing rule, the routing system, and the deploy/verification workflow — everything needed to add or fix a content piece correctly without re-deriving it from the codebase each time.
user-invocable: true
---

Read `site/AGENTS.md` first — it's the canonical, authoritative reference for all of this (Design system, Content, and Documentation sections especially). This skill is a condensed checklist derived from it, not a replacement; if anything here and `AGENTS.md` disagree, `AGENTS.md` is correct and this file is stale.

## Adding a new piece

1. Create `site/src/content/research/<slug>/index.md`. Any images the entry references go in the same folder.
2. Frontmatter — required: `title`, `format` (`'paper' | 'essay' | 'memo'`), `pubDate`, `description` (full abstract, used for JSON-LD only), `excerpt` (`max 200` chars, used for the `<meta description>` tag and every card blurb — always write both, there's no fallback). `pillar` is required *only* when `format: 'paper'` (one of `ai-systems`, `seo-architecture`, `systems-architecture`, `policy-systems`).
3. Optional `subtitle` frontmatter field if the piece has one. **Never** hand-type a subtitle as a `##` heading in the body — it'll get picked up by the table-of-contents transform as a real section.
4. **Do not hand-type a byline/masthead** (name, affiliation, correspondence, license) into the body. `ArticleMasthead.astro` renders all of that automatically from `AUTHOR`/`LICENSE`/`SOCIAL_LINKS` in `site/src/consts.ts` — zero frontmatter needed for it. If you find yourself typing "Amul Bham" and an email address into a piece's Markdown body, stop — that's the bug this system exists to prevent.
5. Optional `tags` — see the casing rule below.
6. Optional hero image: `heroImage` + `heroImageAlt` (required together), 1020×510 (2:1).
7. Write the body in plain Markdown. `## Key Findings` (any case) becomes an auto-styled callout if present. `## References` followed by a numbered list gets auto-styled and each item gets a stable `#ref-N` anchor.

## Citation / external-linking convention — pick based on the piece's actual voice

- **Academic, `(Author, Year)`-style citations** (papers, typically): write them narratively in the body — `(Bennett, 1987)` or `Macartney et al. (2024)` — and `rehype-citation-links.mjs` auto-links them to `#ref-N` at build time. Nothing else to do.
- **Journalistic/narrative citations** (essays, typically — "Jeff Dean described...", "a 2026 survey found..."): the auto-linker can't safely pattern-match freeform prose. Instead, manually hyperlink the actual phrase at first mention of each source directly to that source's own URL (the same URL already in the References list). This is a one-time editorial pass per piece, not automated.
- **Either way**: every entry in the `## References` list must be a real hyperlink to the actual source, never plain text. This is the thing both citation styles depend on, and it's worth a final check before publishing — grep the built page for each reference's URL and confirm it appears at least twice (once in the list, at least once inline).

## Tags — casing rule (decided 2026-08-24)

Sentence case by default (`financial aid`, `frontier models`), except a piece's own coined/named terms, which stay Title Case since they function as proper nouns (`Dependency Paradox`, `Bennett Hypothesis`). No enforced vocabulary otherwise — tags are free text, slugified for routing by `slugifyTag()`.

## Routing — never hand-write a URL

A paper's category is its `pillar`; an essay/memo's category is its pluralized `format` (`essays`/`memos`). The full path is always derived via `canonicalPath()`/`categorySegment()` in `site/src/lib/research-routing.ts` — this is the single source of truth for how an entry maps to a URL. Never hand-write a `/research/...` path or add a `canonicalURL` frontmatter field; that's exactly how a real drift bug happened once (documented in `AGENTS.md`).

## Verifying a change

- Clear the build cache before a verification build if the change touches routing, the content schema, or the markdown pipeline: `rm -rf node_modules/.astro dist .astro` (documented gotcha — this cache has silently served stale output before).
- `npm run build` from `site/`, then spot-check the built HTML: the entry's page exists at the expected URL, citation/reference links resolve, JSON-LD `@type` is correct for the format (`['ScholarlyArticle','Article']` for papers, `'Article'` otherwise).
- This site deploys `staging` → Cloudflare Pages preview → merge to `main` → production. Always verify the live preview before merging, and re-verify production after — a merge triggering a build isn't the same as confirming it shipped. When polling a URL to confirm a deploy landed, check for a marker that's only true on the *new* build (not one that was already true on the old build too), and add a cache-busting query param (`?cb=<random>`) since Cloudflare's edge cache can lag behind a finished build.
- The site is currently deindexed sitewide (`SITE_WIDE_NOINDEX = true` in `BaseHead.astro`, `robots.txt: Disallow: /`) — never flip this without the user's explicit direct go-ahead.
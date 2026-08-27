---
name: content-manager
description: Use this skill when adding a new research entry (paper/essay/memo) to amulbham.com, or auditing/updating an existing one for consistency. Encodes the frontmatter schema, the automatic masthead/subtitle system, citation conventions by format, the tag-casing rule, the routing system, and the deploy/verification workflow — everything needed to add or fix a content piece correctly without re-deriving it from the codebase each time.
user-invocable: true
---

Read `site/AGENTS.md` first — it's the canonical, authoritative reference for all of this (Design system, Content, and Documentation sections especially). This skill is a condensed checklist derived from it, not a replacement; if anything here and `AGENTS.md` disagree, `AGENTS.md` is correct and this file is stale.

## Adding a new piece

1. Create `site/src/content/research/<slug>/index.md`. Any images the entry references go in the same folder.
2. Frontmatter — required: `title`, `format` (`'paper' | 'essay' | 'memo'`), `pubDate`, `description` (full abstract, used for JSON-LD only), `excerpt` (`max 200` chars, used for the `<meta description>` tag and every card blurb — always write both, there's no fallback). `pillar` is required *only* when `format: 'paper'` — see "Pillars" below for the current list and what to do when a piece doesn't fit one.
3. Optional `subtitle` frontmatter field if the piece has one. **Never** hand-type a subtitle as a `##` heading in the body — it'll get picked up by the table-of-contents transform as a real section.
4. Optional `doi` frontmatter field (a full URL, e.g. `https://doi.org/10.5281/zenodo.20531589`) if the piece has one — `ArticleMasthead.astro` renders it alongside the correspondence details automatically. Not every piece has a DOI; omit it otherwise.
5. **Do not hand-type a byline/masthead** (name, affiliation, correspondence, license) into the body. `ArticleMasthead.astro` renders all of that automatically from `AUTHOR`/`LICENSE`/`SOCIAL_LINKS` (+ `doi` above) in `site/src/consts.ts` — zero frontmatter needed for the universal parts. If you find yourself typing "Amul Bham" and an email address into a piece's Markdown body, stop — that's the bug this system exists to prevent. A piece-specific **"About the Author" bio** (narrative context specific to that piece, not the universal contact block) is different — that's real body content, write it as a normal `## About the Author` section near the end. Likewise, a series/companion note ("Paper A — X Series · Companion: Paper B, Y") isn't universal masthead data either — write it as a plain italicized line at the top of the body, under the (automatic) masthead.
6. Optional `tags` — see the casing rule below.
7. Optional hero image: `heroImage` + `heroImageAlt` (required together), 1020×510 (2:1).
8. Write the body in plain Markdown. `## Key Findings` (any case) becomes an auto-styled callout if present. `## References` followed by a numbered list gets auto-styled and each item gets a stable `#ref-N` anchor. GFM admonitions (`> [!NOTE]`, `[!TIP]`, `[!WARNING]`, etc.) and pull-quotes (a blockquote whose entire content is one bolded line, `> **Not a score. A dependency.**`) are both available and render themed to the site — use them for real asides/callouts in long-form academic content, not just blog posts. Five labeled-blockquote primitives (Definition / Key idea / Evidence / Counterpoint / Implication, e.g. `> **Definition.** ...`) are also available as of Sprint 2 (2026-08-26); the full contract for every content module, including these, lives in `CONTENT-MODULES.md`, not here.

## Pillars

Current pillars: `ai-systems`, `seo-architecture`, `systems-architecture`, `policy-systems`, `cybernetics`. If a new paper doesn't fit any of these, don't force it into the closest approximation — that misrepresents the piece and undermines the pillar as a real category. Add a new pillar instead (real precedent: `cybernetics` was added exactly this way 2026-08-24, for a paper the 4 original pillars didn't cover): a `--pillar-<slug>` color token in `global.css` (all three locations — `:root`, `:root[data-theme='dark']`, and the `@media (prefers-color-scheme: dark)` block — pick light/dark shades distinct from every existing pillar), and an entry in `PILLAR_DESCRIPTIONS` (`src/lib/pillars.ts`). Nothing else needs code changes — the homepage pillar grid, the category page, and `getStaticPaths` all read from these two sources and pick up a new pillar automatically the moment a paper references it.

## Citation / external-linking convention — pick based on the piece's actual voice

- **Academic, `(Author, Year)`-style citations** (papers, typically): write them narratively in the body — `(Bennett, 1987)` or `Macartney et al. (2024)` — and `rehype-citation-links.mjs` auto-links them to `#ref-N` at build time. Nothing else to do.
- **Journalistic/narrative citations** (essays, typically — "Jeff Dean described...", "a 2026 survey found..."): the auto-linker can't safely pattern-match freeform prose. Instead, manually hyperlink the actual phrase at first mention of each source directly to that source's own URL (the same URL already in the References list). This is a one-time editorial pass per piece, not automated.
- **Either way**: every entry in the `## References` list must be a real hyperlink to the actual source, never plain text. This is the thing both citation styles depend on, and it's worth a final check before publishing — grep the built page for each reference's URL and confirm it appears at least twice (once in the list, at least once inline).

**What the auto-linker actually handles** (stress-tested and fixed against a real 32-reference paper 2026-08-24 — `Ashby, W.R. (1956)`, `Nicolis, G. & Prigogine, I. (1977)`, `Conway Morris, S. (2003)`, `Clausius, R. (1850)`, etc.):
- Single-author, "et al.", two-word surnames ("Conway Morris", "Maynard Smith"), and accented surnames ("Poincaré", "Szathmáry") all resolve correctly.
- Two-author references resolve both the parenthetical `&` form (`(Nicolis & Prigogine, 1977)`) and the narrative `and` form (`Nicolis and Prigogine (1977) showed...`) — real APA style uses `&` in parentheses but `and` in running prose, and both need to hit the same reference.
- Years from 1600 onward resolve, not just 19xx/20xx — a real bug found via this paper (it cites 1850, 1865, 1890): the original regex only matched years starting `19` or `20`, silently excluding every pre-1900 citation.
- **What still fails closed, by design**: citing the same author's multiple works together in one group — `Kauffman (1969; 1993)`, `(Odum, 1953; MacArthur & Wilson, 1967)`'s second half if it were same-author, or a comma-grouped `Clausius (1850, 1865)` — only the *first* year in the group links, since the trailing year has no name directly attached to it and the system correctly declines to guess. Not a bug to fix; if full coverage matters for a specific source, give it one additional clean standalone `Name (Year)` mention elsewhere in the piece rather than trying to make the grouped form itself smarter.

## Tags — casing rule (decided 2026-08-24)

Sentence case by default (`financial aid`, `frontier models`), except a piece's own coined/named terms, which stay Title Case since they function as proper nouns (`Dependency Paradox`, `Bennett Hypothesis`). No enforced vocabulary otherwise — tags are free text, slugified for routing by `slugifyTag()`.

## Routing — never hand-write a URL

A paper's category is its `pillar`; an essay/memo's category is its pluralized `format` (`essays`/`memos`). The full path is always derived via `canonicalPath()`/`categorySegment()` in `site/src/lib/research-routing.ts` — this is the single source of truth for how an entry maps to a URL. Never hand-write a `/research/...` path or add a `canonicalURL` frontmatter field; that's exactly how a real drift bug happened once (documented in `AGENTS.md`).

## Verifying a change

- Clear the build cache before a verification build if the change touches routing, the content schema, or the markdown pipeline: `rm -rf node_modules/.astro dist .astro` (documented gotcha — this cache has silently served stale output before).
- `npm run build` from `site/`, then spot-check the built HTML: the entry's page exists at the expected URL, citation/reference links resolve, JSON-LD `@type` is correct for the format (`['ScholarlyArticle','Article']` for papers, `'Article'` otherwise).
- This site deploys `staging` → Cloudflare Pages preview → merge to `main` → production. Always verify the live preview before merging, and re-verify production after — a merge triggering a build isn't the same as confirming it shipped. When polling a URL to confirm a deploy landed, check for a marker that's only true on the *new* build (not one that was already true on the old build too), and add a cache-busting query param (`?cb=<random>`) since Cloudflare's edge cache can lag behind a finished build.
- The site is currently deindexed sitewide (`SITE_WIDE_NOINDEX = true` in `BaseHead.astro`, `robots.txt: Disallow: /`) — never flip this without the user's explicit direct go-ahead.
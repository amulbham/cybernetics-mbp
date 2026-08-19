# Roadmap

Things flagged during past work but deliberately not done yet, plus open questions. Not date-ordered — roughly grouped by how soon they matter. Move an item to `CHANGELOG.md` (with a real date) once it ships; delete it from here.

## Blocking the actual public launch

- **Flip `SITE_WIDE_NOINDEX` to `false`** (`src/components/BaseHead.astro`) **and restore `robots.txt` to `Allow: /`** (plus the `Sitemap: https://amulbham.com/sitemap-index.xml` line). Explicitly gated on the user asking for it — do not do this proactively. See `AGENTS.md` → "Indexing state."
- Hero images are still stock placeholders (`blog-placeholder-*.jpg`). `alt=""` is *correct* for them right now (purely decorative placeholders) but will need real alt text once real images go in — don't just leave `alt=""` when the images become real.

## Worth a visual check

- The LinkedIn and Substack icons in `SocialLinks.astro` are hand-written inline SVG paths. They were verified structurally (correct viewBox, valid markup, render without errors) but **not visually confirmed** — there's no way to screenshot-check SVG rendering without a browser. Worth a quick look at the live footer to confirm both actually look like their respective logos and aren't subtly off.

## Content-shaped (grow the corpus, these activate on their own)

- **Related-papers module** is fully built and correct, but won't visibly show anything until at least two papers share a pillar or a tag — right now there are 4 papers across 4 distinct pillars with zero tag overlap, so it's empty everywhere. Nothing to build; it activates naturally as more papers get published.
- **Tag governance** (raised by the user, discussed and deliberately deferred — see `CHANGELOG.md` 2026-08-14 entry for the reasoning): a hard `z.enum()` on tags was considered and rejected as disproportionate for a solo-author site; a thin-content generation threshold for `/tags/[tag]/` pages was agreed on in principle but would currently delete all 17 existing tag pages (every tag has a count of exactly 1 right now). Revisit once there's actual tag overlap to threshold against — check current counts before picking a number, the way the TOC threshold was picked from real data rather than guessed.
- **`policy-systems` pillar** currently has one paper. Not a problem, just worth knowing the pillar landing page and hub grouping are effectively single-item sections right now.

## Blog collection

- `blog` collection, layout, and routes are fully intact (schema, `BlogPost.astro`, `/blog` index and `[...slug]` route) but have **zero posts** and no nav link (removed in Phase 3 for having nothing to link to). Two live options, no decision made yet: repopulate it, or formally retire the collection/routes/layout if it's not going to be used. Either is a small, contained change whenever there's an answer.
- `BlogPosting` JSON-LD for blog posts was deferred for the same reason — nothing to verify it against yet.

## Polish, not urgent

- OG images (`src/pages/open-graph/[...route].ts`) use `astro-og-canvas`'s default font (Noto Sans, fetched from Fontsource at build time), not the site's actual brand fonts. Could load Atkinson/IBM Plex Mono into the OG image generator instead for a more on-brand social-card look.
- Pagefind is on the "Default UI" (`pagefind-ui.js`) — functional, and Pagefind's own build output explicitly says it's still supported, but their docs now recommend the newer "Component UI" (a proper search modal, better accessibility/customization) for new integrations. Worth revisiting if search becomes a bigger part of the site.
- The sticky table-of-contents' first entry on the financial-aid paper is the paper's own subtitle heading ("Don't Get Caught in the Middle-Class Squeeze"), since it's technically a `##` in the source. Not wrong, just a little odd next to "Abstract" — low priority, cosmetic.
- Recurring `npm warn allow-scripts` about `esbuild`'s postinstall script not being covered by an `allowScripts` entry. Never investigated whether this matters for this project; builds have succeeded regardless every time.
- `license` in the Article JSON-LD — schema.org supports formalizing content licensing explicitly (a URL or plain statement). Footer says "All rights reserved" but that's not currently expressed in structured data. Explicitly skipped in the JSON-LD cleanup sprint (2026-08-18) pending an actual decision, not forgotten.
- `citation` markup on `ScholarlyArticle` — the financial-aid paper has 35 real references now rendered via the `rehype-references` transform (see `AGENTS.md`), but schema.org's `citation` property could structure each one individually in JSON-LD too. Real parsing/markup work per reference, not a quick addition — flagged as existing, not proposed for the near term.
- **Footnotes/sidenotes** — a proposed remark/rehype transform for Markdown `[^1]` footnote syntax, with progressive-enhancement UI (right-margin sidenotes on wide screens ≥1400px, hover/focus tooltips on medium screens, native tap-jump fallback on mobile). Deliberately deferred out of the 2026-08-18 admonitions/scroll-spy/table-wrap sprint: **no paper currently uses `[^1]` syntax anywhere**, so there's nothing real to build or verify against yet (the same discipline that set the TOC threshold and the References transform's scope from measured content, not guesses). It's also meaningfully riskier than the other transforms in that batch — real position math for the sidenote layout, resize handling, and (given this project's history with `ClientRouter`) a genuine risk of a scroll-spy-caliber View Transitions gotcha. Scope it properly once a paper actually needs a footnote.

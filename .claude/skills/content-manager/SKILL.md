---
name: content-manager
description: Use this skill when preparing intake for a new research entry (paper/essay/memo) on amulbham.com, or auditing/updating an existing one for consistency. Starts from site/MANUSCRIPT-CONTRACT.md: the website Executor preserves the author's approved manuscript and makes no editorial choices on upload. Encodes the frontmatter schema, the automatic masthead/subtitle system, citation conventions by format, the tag-casing rule, the routing system, and the verification workflow, as a checklist derived from the owner documents.
user-invocable: true
---

Read `site/AGENTS.md` first — it's the canonical, authoritative reference for all of this (Design system, Content, and Documentation sections especially). This skill is a condensed checklist derived from it, not a replacement; if anything here and `AGENTS.md` disagree, `AGENTS.md` is correct and this file is stale.

## Intake and editorial authority

Read `site/MANUSCRIPT-CONTRACT.md` before any intake. It owns the author-to-website interface; `CONTENT-MODULES.md` owns the Markdown grammar; this skill only condenses them.

- **Preserve, never choose.** Do not add, move, remove, reword or invent a primitive, bold/italic emphasis, claim, abstract, publication date, category, DOI, tag or citation. This holds when the manuscript has zero primitives. Zero primitives and no emphasis are valid. If the site cannot preserve something exactly, stop that intake and report it.
- **Mechanical changes only when named** in the author-approved handoff (assembling frontmatter, removing the specified offline preface, a listed normalization).
- **Two input shapes**: clean manuscript plus optional handoff, or one combined file. Never copy a combined file into `site/src/content/research/`: HTML comments do not hide text and no extractor or validator exists yet. Use only a verified clean public source with a recorded byte-level proof.
- **Pending stays pending.** An unresolved `pubDate`, excerpt approval, DOI or category is recorded as `PENDING` in the handoff, not guessed into frontmatter. A release is a separate sealed ticket.
- **Report, do not fix**: unknown or empty primitive labels, duplicate or malformed anchors, unmatched author-year citations, reference labels that break the `PUBLISHING.md` rule. The renderer and the build do not catch these.

## Adding a new piece

1. Create `site/src/content/research/<slug>/index.md`. Any images the entry references go in the same folder.
2. Frontmatter — required: `title`, `format` (`'paper' | 'essay' | 'memo'`), `pubDate`, `description` (used for JSON-LD only; the author-approved abstract when there is one, otherwise equal to `excerpt`. Never invent an abstract, and a visible `## Abstract` is optional), `excerpt` (`max 200` chars, used for the `<meta description>` tag and every card blurb — always write both, there's no fallback). `category` is required on every entry (`cybernetics`, `knowledge-work`, `ai-systems`, `essays`) — see "Categories" below. A `doi` requires `format: 'paper'`.
3. Optional `subtitle` frontmatter field if the piece has one. **Never** hand-type a subtitle as a `##` heading in the body — it'll get picked up by the table-of-contents transform as a real section.
4. Optional `doi` frontmatter field (a full URL, e.g. `https://doi.org/10.5281/zenodo.20531589`) if the piece has one — `ArticleMasthead.astro` renders it alongside the correspondence details automatically. Not every piece has a DOI; omit it otherwise.
5. **Do not hand-type a byline/masthead** (name, affiliation, correspondence, license) into the body. `ArticleMasthead.astro` renders all of that automatically from `AUTHOR`/`LICENSE`/`SOCIAL_LINKS` (+ `doi` above) in `site/src/consts.ts` — zero frontmatter needed for the universal parts. If you find yourself typing "Amul Bham" and an email address into a piece's Markdown body, stop — that's the bug this system exists to prevent. **Do not write a `## About the Author` heading either, on any format** (Sprint 10) — `AUTHOR.bio` (same `consts.ts`) is now the one universal identity, rendered automatically by `AuthorNote.astro` after the whole body, before Related Research, on every piece. Three papers used to hand-type this heading and drifted between them before Sprint 10 deleted all three; do not reintroduce it. A series/companion note ("Paper A — X Series · Companion: Paper B, Y") is different — that's genuinely piece-specific, not universal identity — write it as a plain italicized line at the top of the body, under the (automatic) masthead.
6. Optional `tags` — see the casing rule below.
7. Optional hero image: `heroImage` + `heroImageAlt` (required together), 1020×510 (2:1).
8. Write the body in plain Markdown. `## Key Findings` (any case) becomes an auto-styled callout if present. `## References` followed by a numbered list gets auto-styled and each item gets a stable `#ref-N` anchor. GFM admonitions (`> [!NOTE]`, `[!TIP]`, `[!WARNING]`, etc.) and pull-quotes (a blockquote whose entire content is one bolded line, `> **Not a score. A dependency.**`) are both available and render themed to the site when the author's manuscript uses them; you do not add them. Five labeled-blockquote primitives (Definition / Key idea / Evidence / Counterpoint / Implication, e.g. `> **Definition.** ...`) are also available as of Sprint 2 (2026-08-26); the full contract for every content module, including these, lives in `CONTENT-MODULES.md`, not here. If the piece has real disclosures (Funding, IRB, Conflicts of Interest, etc. — a formal paper sometimes does, most pieces don't), those *are* real authored content: write them under `## Declarations` near the end. Don't add that heading on a piece that has nothing to disclose — no `## Declarations` is correct, common output, not a gap.
9. Nothing else to do for the shell: a TOC (rail ≥1100px, a sticky `<details>` below that) appears automatically once the piece has ≥6 `##` headings, and `AuthorNote` always appears regardless of heading count. Neither needs frontmatter or a body section — see `site/PUBLISHING.md`'s "reading shell" for the full contract.

## Categories

A category is **editorial placement only** (T19.0). The four are `cybernetics`, `knowledge-work`, `ai-systems` and `essays`, defined once in `site/src/lib/categories.ts` (slug, label, description, `relatedBonus`) and required on every entry through the `category` frontmatter field; the schema, footer, About cards and landing pages all read that one list. The retired `pillar` key fails the build. `category` routes the page (`/research/{category}/{slug}/`) and colors its badge; it never decides whether an entry gets a PDF.

**Scholarly PDF eligibility is `format: paper`, in any category** — a paper may be placed in `essays` and still gets its PDF, Highwire tags and `ScholarlyArticle` JSON-LD. A `doi` (a Zenodo publication) requires `format: paper`, so every Zenodo-published work has a matching scholarly PDF; a paper may exist before it has a DOI. Don't force a piece into the closest category: a new category needs an entry in `CATEGORIES`, a `--pillar-<slug>` color token (the prefix is historical) in all four places (`global.css` ×3 and `print-research.css`), an OG color in `open-graph/[...route].ts`, and a Product Authority decision. `/research/memos/` is a route-only empty page, not a category; a memo's placement needs its own decision.

**A published entry never moves silently.** When an entry first ships to production, append a row to `site/src/lib/route-history.ts` (`id`, every `categories` segment it has been served under, whether it promised a scholarly `pdf` and a companion `iwl`); when it later moves, append the new category. `validate:pdfs` fails otherwise, and the generator turns every retired route into a direct 301.

## Citation / external-linking convention — pick based on the piece's actual voice

- **Academic, `(Author, Year)`-style citations** (papers, typically): write them narratively in the body — `(Bennett, 1987)` or `Macartney et al. (2024)` — and `rehype-citation-links.mjs` auto-links them to `#ref-N` at build time when each matches exactly one reference. Unmatched or ambiguous citations stay plain text and the build does not fail, so report them to the author instead of guessing a target.
- **Journalistic/narrative citations** (essays, typically — "Jeff Dean described...", "a 2026 survey found..."): the auto-linker can't safely pattern-match freeform prose. Instead, manually hyperlink the actual phrase at first mention of each source directly to that source's own URL (the same URL already in the References list). This is a one-time editorial pass per piece, not automated.
- **Either way**, the `## References` list stays one contiguous ordered list (no blank line between entries — a blank line makes it "loose" and stops most author-year citations from linking). Every entry carries a verified real URL (a DOI where one exists) shown as its own path — a DOI as `doi.org/10.…`, never a generic `[DOI]`/`[Source]` label. A legitimate print/archival/reported source with no verified landing page stays unlinked **only** under a documented Product Authority exception recorded in the entry's evidence file; never guess or fabricate a URL. Inline citations need not appear twice — check coverage in the built page (`#ref-N` links), not by grepping each URL.
- **Reader components (Definition / Key idea / Evidence / Counterpoint / Implication, pull quote)**: the author owns kind, wording, placement, anchors and emphasis. Leave supplied blocks exactly as written and never promote, add or move sentences to create them, including when a paper has none. Labels must be the exact bold form with a period; the parser's leniency is not a license. Review adjacent or long blocks only to flag them to the author.
- Responsive appendix tables are an explicit author opt-in (`<!-- table-layout: responsive-records -->`) — marker, supported shapes and behavior are in `CONTENT-MODULES.md`; do not add it to a table on your own.

**What the auto-linker actually handles** (stress-tested and fixed against a real 32-reference paper 2026-08-24 — `Ashby, W.R. (1956)`, `Nicolis, G. & Prigogine, I. (1977)`, `Conway Morris, S. (2003)`, `Clausius, R. (1850)`, etc.):
- Single-author, "et al.", two-word surnames ("Conway Morris", "Maynard Smith"), and accented surnames ("Poincaré", "Szathmáry") all resolve correctly.
- Two-author references resolve both the parenthetical `&` form (`(Nicolis & Prigogine, 1977)`) and the narrative `and` form (`Nicolis and Prigogine (1977) showed...`) — real APA style uses `&` in parentheses but `and` in running prose, and both need to hit the same reference.
- Years from 1600 onward resolve, not just 19xx/20xx — a real bug found via this paper (it cites 1850, 1865, 1890): the original regex only matched years starting `19` or `20`, silently excluding every pre-1900 citation.
- **What still fails closed, by design**: citing the same author's multiple works together in one group — `Kauffman (1969; 1993)`, `(Odum, 1953; MacArthur & Wilson, 1967)`'s second half if it were same-author, or a comma-grouped `Clausius (1850, 1865)` — only the *first* year in the group links, since the trailing year has no name directly attached to it and the system correctly declines to guess. Not a bug to fix; if full coverage matters for a specific source, give it one additional clean standalone `Name (Year)` mention elsewhere in the piece rather than trying to make the grouped form itself smarter.

## Tags — casing rule (decided 2026-08-24)

Sentence case by default (`financial aid`, `frontier models`), except a piece's own coined/named terms, which stay Title Case since they function as proper nouns (`Dependency Paradox`, `Bennett Hypothesis`). No enforced vocabulary otherwise — tags are free text, slugified for routing by `slugifyTag()`.

## Routing — never hand-write a URL

An entry's category is its authored `category` field (see "Categories"). The full path is always derived via `canonicalPath()`/`categorySegment()` in `site/src/lib/research-routing.ts` — this is the single source of truth for how an entry maps to a URL. Never hand-write a `/research/...` path or add a `canonicalURL` frontmatter field; that's exactly how a real drift bug happened once (documented in `AGENTS.md`).

## Scholarly PDF (papers only, Sprint 8 build contract — frozen 8.7; Sprint 9 live deploy — frozen 9.5)

**Do not add a `pdfUrl` frontmatter field, and do not attach or upload a PDF file yourself.** A paper's PDF has exactly one identity, derived, never authored: `{canonicalURL}{entry.id}.pdf` (`paperPdfFilename(id)`); the legacy `{canonicalURL}paper.pdf` is a 301 to it, never a second file (T18.1). A paper needs zero PDF-specific frontmatter, but a **new** paper cannot ship through the release pipeline today: `carry-over-pdfs.sh` is fixed at the five approved PDFs and fetches every manifest path from production, so a sixth PDF needs its own sealed technical ticket. A Desk revision is likewise unsupported; revising another existing paper follows the frozen-artifact flow in `PUBLISHING.md`. Essays and memos get no PDF.

For every `format: paper` entry, three build steps run in order:

1. `npm run build` → the HTML, including Highwire `citation_*` tags and the JSON-LD `MediaObject`.
2. `npm run build:pdfs` → typesets that HTML into `{entry.id}.pdf`, same directory as `index.html`.
3. `npm run validate:pdfs` → a fail-closed check that the HTML and the PDF actually agree (identity, `#ref-*` reachability, research-relation link URIs) — a mismatch fails the build rather than shipping quietly wrong.

**Path B CI (`.github/workflows/deploy-pages.yml`) runs all three before deploying, and — as of Sprint 9 — is what actually ships `amulbham.com`.** Deploy authority is GitHub Actions end to end for both `staging` and `main`; Cloudflare's own native Git-integrated build is off for both branches and no longer ships either. Authoring is the same either way (no PDF frontmatter, no uploaded file), but that is not a guarantee a new paper can be released automatically; see above. See `site/PUBLISHING.md` §5 for the full research-object/two-projections model, and `site/AGENTS.md`'s "Deploy workflow" section for the pipeline/rollback detail.

## Homepage spotlight

The homepage's one pinned/editorial slot (above Recent Research) is controlled by `HOMEPAGE_SPOTLIGHT` in `site/src/consts.ts` — a plain string, the pinned entry's collection id. To pin a different piece, change that one line. **Do not** add a `featured:` field to a piece's frontmatter — that would scatter the "which piece is pinned" fact across content files instead of leaving it in the one place meant to hold it. A typo'd slug fails `astro build` (`Spotlight.astro` throws via `getEntry`) rather than silently showing an empty section.

## Verifying a change

- Clear the build cache before a verification build if the change touches routing, the content schema, or the markdown pipeline: `rm -rf node_modules/.astro dist .astro` (documented gotcha — this cache has silently served stale output before).
- `npm run build` from `site/`, then spot-check the built HTML: the entry's page exists at the expected URL, citation/reference links resolve, JSON-LD `@type` is correct for the format (`['ScholarlyArticle','Article']` for papers, `'Article'` otherwise).
- Verify on `staging` first. Production comes from a scoped, approved promotion to `main` (never a wholesale merge of `staging`). A push, a manual run or a re-run of the deploy workflow is a deployment action that needs authorization (`AGENTS.md` "Deploy workflow", `OPERATOR-GUIDE.md`). A successful run for `main`'s latest commit, not the merge, is what shows it shipped. When polling a URL to confirm a deploy landed, check for a marker that's only true on the *new* build (not one that was already true on the old build too), and add a cache-busting query param (`?cb=<random>`) since Cloudflare's edge cache can lag behind a finished build.
- Indexing is controlled by one switch (`SITE_INDEXING`, `src/lib/indexing.mjs`): production is indexable only when its repository variable is `open`, and staging and previews are always closed. Do not change `SITE_INDEXING`, `SITE_WIDE_NOINDEX` or `robots.txt` without the owner's explicit direction; read `AGENTS.md` "Indexing state" instead of assuming a state.

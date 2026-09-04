# Publishing specification

What a research page *is* — so an agent can publish the next piece without reconstructing the system from chat logs.

## 1. What this system is

> A lightweight research publishing system. Source of truth is structured Markdown in one `research` collection. Astro generates the reading experience. Keystatic is not in the stack. Graph / Quick Read / reading modes are not products.

Philosophy:

- Do not optimize research for shorter attention spans. Optimize the interface for deeper attention.
- Build the grammar from observed research, not imagined requirements.
- Prose is the default. A primitive appears only when cognitive load changes.
- Voice: paper, ink, one signal. A systems researcher's desk, not a product launch.
- The corpus defines the relationship model; the model does not manufacture a corpus.
- A link is a presentation of a relationship, not the relationship itself.
- Declared lineage outranks inferred similarity.
- Fail closed. An empty accepted set (and an empty registry file) is valid production, not an unfinished state.

## 2. What a research page is

A research page is:

1. Frontmatter in `src/content/research/<slug>/index.md` (`format`, `title`, `pubDate`, `description`, `excerpt`, paper-only `pillar`, optional `subtitle` / `doi` / `tags` / hero pair). Authors never specify a PDF field — a paper's PDF is always `{canonicalURL}/paper.pdf`, derived (Sprint 8.4).
2. Body Markdown.
3. Build-time transforms (reading time, alerts, references, tables, figures, key findings, pull quotes, primitives, citation links).
4. `ResearchLayout` → `ArticleShell`: masthead, TOC if ≥6 `##`, scroll progress, related research, JSON-LD, OG route.

Formats: `paper` | `essay` | `memo`. One collection, one layout. URL via `categorySegment()`: papers at `/research/{pillar}/{slug}/`, others at `/research/essays|memos/{slug}/`.

Do not invent a second collection.

## 3. Authoring

Full procedure: `.claude/skills/content-manager/`. Full rationale: `AGENTS.md`'s Content section. Restated here only because these specific rules fail silently if forgotten:

- `description` = full abstract (JSON-LD). `excerpt` ≤200 chars (meta + cards). Both required — no fallback if `excerpt` is missing.
- Subtitle is frontmatter, never a `##` heading — a heading gets picked up by the TOC as a real section.
- Papers: `(Author, Year)` / `Name (Year)` so the citation linker works. Essays/memos: manual first-mention external links instead.
- Every `## References` entry is a real URL. Ordered list only (the numbering is load-bearing — it's what `id="ref-N"` keys off).
- Tags: sentence case, except a piece's own coined proper nouns.
- Do not hand-type a byline. The masthead is automatic from `consts.ts`.
- Images live in the entry's own slug folder.
- Citation routing is a three-layer decision (inline → `#ref-N` on-page, reference entry → real external URL, essay narrative cite → manual outbound link) — see `CONTENT-MODULES.md`'s Citation links → Routing subsection, not restated here.

## 4. Grammar

Full contract: `CONTENT-MODULES.md`. The map only:

```
PROSE
  Definition     what is this term?
PROSE
  Key idea       the argument turns
PROSE
  Evidence       isolate support
PROSE
  Counterpoint   strongest real objection
PROSE
  Implication    so what
```

Closed set of five. No Synthesis, no Research Note, no Data Point, no Takeaway — if a piece seems to need a sixth kind, that's a signal to revisit the set itself, not to add one quietly.

Density guidance from the live corpus (a record of what's actually shipped, not a new cap to design toward):

- Long policy paper (FAFSA): 11
- Theoretical paper (Invariants): 5
- Essay (frontier): 5

Trigger shape: a blockquote starting `> **Definition.**` / `**Key idea.**` / `**Evidence.**` / `**Counterpoint.**` / `**Implication.**` (case-insensitive, trailing period stripped). Optional `{#slug}` immediately after the label → `id="primitive-{slug}"` on the rendered `<aside>`.

Collision handling: GFM alerts are consumed in the remark phase, before any of this runs — never a collision. Pull-quote wins only on a blockquote that is a single bold line and nothing else; a primitive needs a label *plus* body content, so a well-formed one never satisfies pull-quote's shape check.

## 5. Presentation

Full contract: `design-system/` (`tokens.md`, `components.md`, `do-not.md`). Not reproduced here.

State: Signal locked 2026-08-26. Two fonts (Atkinson Hyperlegible body/headings, IBM Plex Mono `.meta`/code). Dual theme, complete pairs, plus the `prefers-color-scheme` fallback for no-explicit-choice readers. Research primitives: `--bg-subtle` field, 6px `--accent` left rule, label `font-weight: 700`. Alerts stay 4px + an 8% severity wash — a deliberately different, quieter system voice than a primitive's argument-topology signal, not an oversight.

The homepage's one editorial pin (above Recent Research) is `HOMEPAGE_SPOTLIGHT` in `consts.ts` — change that one line to pin a different piece; there is no `featured:` frontmatter field, and a wrong slug fails the build rather than silently rendering nothing (Sprint 6.3).

### The research object → two projections (Sprint 8, frozen 8.7)

```
RESEARCH OBJECT
  ├── HTML identity     canonical article URL, JSON-LD url / mainEntityOfPage
  └── PDF projection    {canonical}paper.pdf
                        citation_pdf_url, MediaObject.contentUrl, Download href
```

One Markdown source. One canonical HTML identity. One *derived* PDF URL — never a field to author, never a second identity that can drift from the first. `ResearchLayout.astro` computes `paperPdfUrl` once (`new URL('paper.pdf', canonicalURL)`, Sprint 8.4) and every consumer — `citation_pdf_url`, the JSON-LD `MediaObject.contentUrl`, the reader-facing Download PDF link, and the JSON-LD article `url`/`mainEntityOfPage.@id` — reads that same value. There is no `pdfUrl` frontmatter field (removed outright, `content.config.ts`) and no authored override. Authors never set a PDF field, full stop.

The PDF itself is the same built HTML plus a dedicated print stylesheet (`site/src/styles/print-research.css`) and a PDF-only anchor canonicalization step (`site/scripts/absolutize-pdf-links.mjs`) — screen CSS is untouched either way (Sprint 8.1). It's generated automatically, same directory as `index.html`, by `site/scripts/build-research-pdfs.mjs` for every `format: paper` entry (Sprint 8.2) — an author never attaches or uploads a file. A paper's `<head>` also emits Highwire Press `citation_*` tags (`citation_title`, `citation_author`, `citation_publication_date`, `citation_pdf_url`, `citation_doi` when a DOI exists) alongside its JSON-LD, which stays the primary structured-data source and is unchanged by this (Sprint 8.3). Essays/memos emit none of this — Highwire is a papers-only vocabulary here, and essays never get a `paper.pdf` at all; that stays deferred, not built.

**That identity is CI-enforced, not just author discipline (Sprint 8.6).** `npm run validate:pdfs` (`site/scripts/validate-research-pdfs.mjs`) runs in `.github/workflows/deploy-pages.yml` after `build:pdfs` and before deploy — a paper whose `citation_pdf_url`/`MediaObject.contentUrl`/Download href/JSON-LD article URL disagree, whose PDF fails to parse, or whose `#ref-*`/research-relation links don't survive typesetting, fails CI rather than shipping quietly wrong. `#ref-*` reachability is checked as a *set* (which ref numbers are reachable at all), not a raw annotation count — a single HTML citation link that wraps across a printed line legitimately becomes more than one PDF link annotation pointing at the same destination, so counts alone would false-fail on real content. Full check list: `AGENTS.md`'s "Two validators" note and `CHANGELOG.md`'s Sprint 8.6 entry — not repeated here.

**This is a build contract, not a deployment or discovery status:**

```
SCHOLAR-READY BUILD CONTRACT  done   HTML + PDF projections agree, CI-enforced
LIVE PDF DEPLOYMENT           not yet   Path B go-live is ops, outside this repo — see ROADMAP.md
SCHOLAR DISCOVERY             blocked   SITE_WIDE_NOINDEX / robots.txt, intentional
```

**Sprint 9 is the Path B cutover — 9.0 (2026-09-04) is pin-only.** It made `wrangler` (the CLI the deploy step calls) an exact `package-lock.json` fact, same as `@vivliostyle/cli`/`pdfjs-dist`; it did not touch secrets, the Cloudflare dashboard, or push triggers. LIVE PDF DEPLOYMENT is still ❌ after 9.0 — see `ROADMAP.md` for the remaining 9.1–9.4 ops steps and `CHANGELOG.md` for the pinned version.

Every paper that goes through `build` → `build:pdfs` → `validate:pdfs` is a correct, self-consistent HTML+PDF pair — but that pipeline only actually runs on a real push once Path B (`.github/workflows/deploy-pages.yml`) is live, which it is not (two ops steps outside this environment — GitHub repo secrets, a Cloudflare dashboard toggle — see `ROADMAP.md`). Until then, Cloudflare's own native Git-integrated build keeps serving `amulbham.com` — HTML only, **no `paper.pdf`**, even though that HTML still advertises a `citation_pdf_url` (expected and harmless while the site stays noindexed, not a bug to chase — do not assume native Pages ever actually has the file). And independent of which build is live, `SITE_WIDE_NOINDEX`/`robots.txt` keep every page out of every crawler, Scholar included. "Scholar-ready" and "Scholar-discoverable" are two different, separately-gated states; only the first is done.

## 6. Agent file map

| File | Owns |
|---|---|
| `AGENTS.md` | Pipeline, routing, deploy, noindex, gotchas |
| `design-system/` | Visual contract |
| `CONTENT-MODULES.md` | Module trigger/output contracts |
| `PUBLISHING.md` | This spec — what a page *is* |
| `ROADMAP.md` / `CHANGELOG.md` | Debt / history |
| `.claude/skills/content-manager/` | Procedure to add a piece |

Do not dump token tables into `AGENTS.md`, and do not dump module contracts into this file — each fact lives in exactly one of the files above.

## 7. After this spec — deferred, not built here

- **Content-detail pass** (next editorial sprint): the Invariants §4 pull-quote + Counterpoint currently sit stacked; the frontier essay's "Frontier is the floor" Counterpoint + Key idea read as a cluster; check across all three pieces for any restated sentence that now exists twice at full length rather than as a genuine restatement.
- Vectorize the AB mark; load Atkinson/Plex into the OG image generator instead of its default font; an optional radius tighten to 4/8/12; `.table-container` still sits on `--bg`, not `--bg-raised`, despite being conceptually elevated chrome like a card.
- Footnotes/sidenotes only once a paper actually uses `[^1]` syntax — nothing to build against yet.
- Keystatic, if it ever happens, as an authoring layer on top of the *same* collection, schema, grammar, and renderer — not a parallel system.
- A research graph / concept-link UI. The `{#slug}` ids primitives can carry are reserved for this and unread by anything today. Sprint 7 (2026-08-31–09-01) shipped a typed relation registry (`src/data/research-relations.json`) and a transform that renders exactly one accepted placement per row — see `CONTENT-MODULES.md`'s "New: research relations." A relation with no `inline` block, or with `inline.status` other than `accepted`, stays silent by design: no link appears, and that's correct production output, not a gap waiting to be filled. Still deferred, all of it: machine discovery/proposal of relations, a relation-driven `RelatedResearch`, series navigation, a visible graph, `placements[]`/multiple inline sites per edge, and search-engine indexing of any of this (`SITE_WIDE_NOINDEX` stays on, see below — unrelated to whether the relation contract itself is finished). 7.7's fitness check (2026-09-01) confirmed the five locked types cover every planned future edge without a sixth; series UI remains deferred to a future nav layer, not encoded as in-body relation links.
- **Scholarly PDF (Sprint 8, frozen 8.7) — the build contract is done; three things stay explicitly deferred, not built here:** Path B go-live (`ROADMAP.md` → "Blocking the actual public launch" — two ops steps outside this repo, not a coding task); essay/memo PDFs (Highwire and `paper.pdf` generation both stay a papers-only vocabulary — no plan to extend either); and any further automation of the visual-pagination rows (page-1 hierarchy, table/primitive rendering, References start, last page) `validate:pdfs` deliberately does not check — those stay a human raster check per Sprint 8.5's own finding that `pdftotext` alone isn't trustworthy for tables, and nothing in 8.6 or 8.7 changed that.
- Do not flip `SITE_WIDE_NOINDEX` / restore `robots.txt` to `Allow: /` unless the user explicitly asks — this is also what blocks Scholar discovery specifically, independent of how PDF-ready the build contract is (see §5 above).

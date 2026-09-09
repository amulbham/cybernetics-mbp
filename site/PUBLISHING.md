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
4. `ResearchLayout` → `ArticleShell`: masthead, TOC if ≥6 `##`, scroll progress, the whole authored body, `AuthorNote`, related research, JSON-LD, OG route — in that order.

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

**This is a build contract, and — as of Sprint 9 — a live deployment fact. Discovery is still separately gated:**

```
SCHOLAR-READY BUILD CONTRACT  ✅
LIVE PDF DEPLOYMENT           ✅
SCHOLAR DISCOVERY             ❌  indexing intentionally blocked
```

**Sprint 9 (9.0–9.5, 2026-09-04) was the Path B cutover, and it's done.** 9.0 pinned `wrangler` exact as a `package-lock.json` fact, same as `@vivliostyle/cli`/`pdfjs-dist`. 9.1–9.4 (GitHub repo secrets, a `workflow_dispatch` proof run, Cloudflare's preview auto-build set to `None` plus a real staging push, then production auto-build set off plus a real `main` push) are the ops half — done by the site owner, verified from this environment via the public GitHub Actions API and direct HTTP checks against both the staging alias and `amulbham.com`, not assumed. Deploy authority is now GitHub Actions end to end (`build` → `build:pdfs` → `validate:pdfs` → the pinned `wrangler pages deploy`) for both `staging` and `main`; Cloudflare's own native Git-integrated build no longer ships either branch. Full arc and the one real bug found along the way (a commit-message quoting break, fixed in an `env:` var): `CHANGELOG.md`. Pipeline truth and the two-level rollback: `AGENTS.md`.

Every paper that goes through `build` → `build:pdfs` → `validate:pdfs` → deploy is now what actually serves `amulbham.com` — confirmed directly (not assumed) on all three live papers: each `paper.pdf` returns `200`/`application/pdf` from production, and each page's `citation_pdf_url`/Download href/JSON-LD `MediaObject` all resolve to that exact file. `SITE_WIDE_NOINDEX`/`robots.txt` are unrelated to any of this and remain exactly as they were — every page stays out of every crawler, Scholar included. "Scholar-ready" and "Scholar-discoverable" are still two different, separately-gated states; the build/deploy one is now done, the discovery one is not.

### The research object's semantic graph (Sprint 11, frozen 11.7)

```
CANONICAL PRODUCT STATE (research objects, routes, Person, DOI, publisher model, typed internal relations)
        ↓ explicit editorial projection
PUBLIC SCHEMA.ORG GRAPH (richer internally, thinner and lossy in public JSON-LD)
        ↓ independent validation
CI — fails closed on drift
```

Frozen v1 decisions:

- One canonical Person identity (`personIdentity()`, `src/lib/structured-data.ts`) — `@id = https://amulbham.com/about/#person` everywhere it's projected: every research Article's `author`/`publisher`, the homepage's standalone `Person` and `WebSite.author`, and About's `ProfilePage.mainEntity` (which alone also carries `jobTitle`/`knowsAbout` — legitimate contextual enrichment, not identity drift).
- Direct self-publication: `publisher` is the same canonical Person as `author`, not a fictional `Organization` — applies to every format.
- DOI, when authored, is JSON-LD `identifier: { @type: PropertyValue, propertyID: 'DOI', value: <bare DOI> }`, the same normalized value Highwire's `citation_doi` reads. Absence is part of the contract: no authored DOI → no `identifier` at all, never `null`/`{}`/`""`.
- `Article`/`WebPage` identity stays simple: `Article.url` plus a nested `mainEntityOfPage: { @type: WebPage, @id: <canonical URL> }` — no top-level `Article @id`, no `#article`, no standalone top-level `WebPage` graph node. A paper's pillar `CollectionPage` (`isPartOf`) stays a plain `name`/`url` reference, no `@id`.
- Paper `@type` contract: `['ScholarlyArticle', 'Article']`; essay/memo: plain `'Article'`.
- `research-relations.json` stays the canonical, richer internal intellectual graph. `research-relation-projections.json` (Sprint 11.3) is the separate, explicit, human-authored public projection policy — a foreign-key row naming one specific edge and one specific Schema.org property, never a type-level or `reason`-prose inference. `relation.type` never maps automatically to a Schema.org property; `relation.reason` is never parsed for meaning. `inline.status` governs only the in-body reader-facing HTML link — it is never consulted for semantic eligibility. These stay three independent axes: canonical existence, inline manifestation, semantic manifestation.
- Relation serialization is array-first, even for a single member. Zero approved outgoing projections → the property is absent from the emitted object, never `[]`/`null`/`""`. Projection is source-only and directional — a target never gets a reciprocal/inverse property. Target identity is always the canonical research HTML URL, never a PDF, DOI resolver, or in-page anchor.
- The citation graph (`## References` / `#ref-N`) and the research-relation graph are two separate, non-overlapping systems — no corpus citation JSON-LD (`citation`, `mentions`, `hasPart`) exists yet.
- `RelatedResearch.astro` is heuristic navigation only (pillar/tag overlap). It emits zero structured data and is never consulted to determine or infer a semantic relation — a permanent "semantic firewall."
- The public standard graph is intentionally thinner than the internal graph. Silence — an absent property — is valid, correct production output, not a gap waiting to be filled.

**Validated continuously, not just asserted once.** `npm run validate:semantics` (`scripts/validate-research-semantics.mjs`, Sprint 11.7) runs after `astro build`, before Pagefind, against the actual built `dist/` HTML — not source. It independently re-derives expected canonical-URL/Person/publisher/DOI/Highwire state and expected relation-projection state (sharing schemas, `canonicalPath()`, and the canonical corpus manifest with the production serializer, but never its selection/grouping logic — an oracle that re-ran the thing under test wouldn't be a check), and fails the build closed on any drift. Three other validators protect three other boundaries and are deliberately not merged with this one: `validate-research-relation-projections.mjs` (source registry/policy integrity), `validate-research-links.mjs` (safe inline HTML placement), `validate-research-pdfs.mjs` (PDF artifact identity). Full contract/history: `CHANGELOG.md`'s Sprint 11.0–11.7 entries; standing implementation invariants: `AGENTS.md`.

No Reader Context, no IWL (Important Web Links / proof-chain semantics), and no additional Schema.org relation properties beyond `isBasedOn` exist yet — none of the above implies or authorizes any of that; it's future architectural-sprint work.

### The reading shell (Sprint 10, frozen 10.6)

```
authored research body
        ↓
generated AuthorNote
        ↓
RelatedResearch
```

**Author identity is generated, never authored as a heading.** `AUTHOR.bio` (`consts.ts`) is the one universal identity — `AuthorNote.astro` renders it after the *entire* authored body (References, an Appendix, whatever a piece actually ends with) and before `RelatedResearch`, on every format (`paper`/`essay`/`memo` alike). **Do not write `## About the Author` in a piece's Markdown** — that heading used to exist by hand on three papers and drifted between them before Sprint 10 deleted all three and replaced them with this one generated slot. `AuthorNote`'s own label is a non-heading (a `<p>`, never `h2`/`h3`) specifically so it can never enter the TOC.

**Paper-specific declarations stay authored Markdown — `AuthorNote` never generates them.** If a piece has real disclosures (Author Contributions, Funding, IRB, Informed Consent, Data Availability, Conflicts of Interest — Invariants and Three SOS both do), they live under an authored `## Declarations` heading, a real TOC-visible section. **Do not invent a `## Declarations` heading on a piece that has none** (FAFSA and the Frontier essay both correctly have no such heading — nothing to preserve, nothing to fabricate).

**`AuthorNote` prints; its purely-navigational "About" link doesn't.** A locked Sprint 10 decision, not an oversight: the PDF is the same research object as the HTML, so the generated identity ships in it too — `print-research.css`'s whole-element hide list (header, nav, tags, the Download link, both TOCs) must never gain `.author-note`. Only the "About" link (meaningless once printed) is dropped, via its own narrow rule. The visible ORCID text is derived from `SOCIAL_LINKS.orcid` (protocol stripped) — never a second hand-typed constant.

**TOC**: authored `##` headings only, `MIN_SECTIONS = 6` (unchanged since before Sprint 10), the desktop rail at `≥1100px` (unchanged breakpoint). Below that, the same native `<details>` — not a second widget — is persistently sticky, with one shared `currentSection` state feeding both the rail's active link and the mobile summary's current-title display. Both TOC surfaces are print-hidden, same as always. A tapped mobile link defers closing the `<details>` by one tick so the URL hash still updates (Sprint 10.5 — closing it synchronously raced the anchor's own navigation). Full mechanics: `AGENTS.md`'s reading-shell invariants — not repeated here.

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
- **Scholarly PDF (Sprints 8 and 9, frozen 8.7 and 9.5) — the build contract is done and, as of Sprint 9, actually live on `amulbham.com`. Two things stay explicitly deferred, not built here:** essay/memo PDFs (Highwire and `paper.pdf` generation both stay a papers-only vocabulary — no plan to extend either); and any further automation of the visual-pagination rows (page-1 hierarchy, table/primitive rendering, References start, last page) `validate:pdfs` deliberately does not check — those stay a human raster check per Sprint 8.5's own finding that `pdftotext` alone isn't trustworthy for tables, and nothing since has changed that. Search-engine discovery of any of this stays deferred too — `SITE_WIDE_NOINDEX`/`robots.txt` are unrelated to the deploy pipeline and remain intentionally on.
- Do not flip `SITE_WIDE_NOINDEX` / restore `robots.txt` to `Allow: /` unless the user explicitly asks — this is also what blocks Scholar discovery specifically, independent of how PDF-ready the build contract is (see §5 above).

# Content modules

The single source of truth for every content-section module on this site — what triggers it, what it produces, and how to author it. Shape-based: a module exists because a recurring *shape* showed up in real research, not because a paper needed something specific. Nothing here is paper-specific.

Standing policy (see `AGENTS.md`): a recurring content-section pattern gets a build-time remark/rehype transform, registered in `astro.config.mjs`. Not MDX, not a hand-written component in a content file. Authoring stays plain Markdown — paste it exactly as described below, the transform recognizes the shape and styles it automatically.

Visual chrome (tokens, component styling) lives in `site/design-system/`, not here. This file is about content *shapes* — what Markdown triggers what structure. If you're trying to figure out what color something is, that's the other folder. For what a research page *is* end-to-end (this file is one piece of that map), see `site/PUBLISHING.md`.

## Contract template

Every module below follows this shape:

- **Trigger**: the exact Markdown pattern that activates it.
- **Produces**: the resulting HTML structure/classes.
- **Authoring example**: a real, pasteable example.
- **Constraints**: what it deliberately does and doesn't handle.
- **Files**: the plugin file(s) and where it's registered.

## Live modules

### Alerts

- **Trigger**: GFM alert syntax — `> [!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION]`, `[!IMPORTANT]`.
- **Produces**: `<div class="markdown-alert markdown-alert-{severity}">`.
- **Authoring example**: `> [!WARNING]\n> Moral variables detected as NULL.`
- **Constraints**: parsed in the **remark** phase (mdast), before any rehype plugin runs — by the time any rehype module below sees the tree, an alert is already a `<div>`, never a `<blockquote>`. This is what makes it impossible for an alert to collide with pull-quote or a research primitive.
- **Files**: `remark-github-blockquote-alert` (npm package, the one deliberate exception to "hand-roll it" in this project — see `AGENTS.md`), registered as a `remarkPlugins` entry.

### Pull quote

- **Trigger**: a `<blockquote>` whose entire content is a single paragraph containing only one `<strong>` — i.e. the whole quoted block is one bolded line, nothing else.
- **Produces**: `class="pull-quote"` added to the existing `<blockquote>` (no structural change).
- **Authoring example**: `> **Not a score. A dependency.**`
- **Constraints**: the shape check is strict — exactly one child block (a `<p>`), and that paragraph's only child is a `<strong>`. Anything with additional text (even one trailing word) fails the check and stays an ordinary blockquote. This strictness is also the collision-prevention mechanism against research primitives — see "Collision rules" below.
- **Files**: `src/lib/rehype-pull-quote.mjs`, registered in `astro.config.mjs`'s `rehypePlugins` before `rehypeResearchPrimitive`.

### Key findings

- **Trigger**: a `## Key Findings` heading (any case) immediately followed by a list (ordered or unordered).
- **Produces**: both wrapped in `<section class="key-findings">`, with `key-findings-heading`/`key-findings-list` classes added.
- **Authoring example**: `## Key Findings\n\n- Point one.\n- Point two.`
- **Constraints**: entirely opt-in — a piece without this heading renders nothing extra. Heading and list don't have to be literally adjacent in the tree (a blank-line whitespace text node sits between them); the shared factory behind this module already accounts for that.
- **Files**: `src/lib/rehype-key-findings.mjs`, built on the shared `createHeadingSectionWrapper()` factory in `src/lib/rehype-section-utils.mjs`.

### References

- **Trigger**: a `## References` heading immediately followed by an **ordered** list only (not a bullet list — the numbering is load-bearing).
- **Produces**: both wrapped in `<section class="references">`; each `<li>` gets a stable `id="ref-N"` (1-based document order).
- **Authoring example**: `## References\n\n1. Author, A. (2026). *Title*. [url](https://...)`
- **Constraints**: the `id="ref-N"` values are what `rehype-citation-links.mjs` links against — this module must run before that one.
- **Files**: `src/lib/rehype-references.mjs`, built on the same `createHeadingSectionWrapper()` factory as Key Findings.

### Citation links

- **Trigger**: inline `(Author, Year)` or `Name (Year)` narrative citations anywhere in the body, matched against the names/years actually present in the `## References` list.
- **Produces**: the matched citation text wrapped in `<a href="#ref-N">`.
- **Authoring example**: `The Bennett Hypothesis (Bennett, 1987) predicted this.`
- **Constraints**: fails closed — anything that doesn't resolve to exactly one reference stays plain text, never linked on a guess. Handles semicolon-separated multi-source groups, two-author `&`/`and` forms, two-word and accented surnames, and years back to the 1600s (all fixed 2026-08-24 against a real 32-reference paper — see `AGENTS.md` for the full bug history). Does **not** safely handle freeform journalistic/narrative citation styles with no structural marker — those get a manual editorial pass instead (see `.claude/skills/content-manager/`).
- **Files**: `src/lib/rehype-citation-links.mjs` — must run after References (needs `id="ref-N"` to exist) and after the five research primitives (Evidence/Implication bodies routinely contain real citations that still need linking). Runs last in the `rehypePlugins` array.

#### Routing

Three layers, not one:

| Layer | Points at |
|---|---|
| Paper inline `(Author, Year)` / `Name (Year)` | `#ref-N` on this page |
| Each `## References` list item | the source's real external URL (DOI preferred) |
| Essay/memo narrative cite | manual outbound link on the first mention |

Inline cites stay on-page so the reader can see which note backs the sentence. The bibliography is where the reader leaves. Do not invert this. Hash targets are not separate URLs for search/canonicalization; outbound equity lives on the reference entries (and essay first-mentions). Fail-closed linker behavior is unchanged — see Constraints above.

Visually, `#ref-*` links are ink + dotted underline (Sprint 6.4) — a page with fifty citations shouldn't read as fifty primary buttons. Outbound links (reference URLs, essay first-mentions) stay solid `--accent`, since those are the links that actually leave the page.

### Table wrap

- **Trigger**: any `<table>`, anywhere in the tree (including inside list items).
- **Produces**: wrapped in `<div class="table-container" tabindex="0">`, `overflow-x: auto` so wide tables scroll instead of breaking the prose column.
- **Authoring example**: a plain Markdown table.
- **Constraints**: none — applies unconditionally to every table.
- **Files**: `src/lib/rehype-table-wrap.mjs`.

### Figures

- **Trigger**: a `<p>` whose only meaningful child is an `<img>` — the shape standard `![alt](src)` Markdown always produces.
- **Produces**: `<figure><img/><figcaption>{alt}</figcaption></figure>`. Skipped entirely (no empty caption box) when alt text is empty.
- **Authoring example**: `![A caption here](./figure-1.png)` for a captioned figure, `![](./figure-1.png)` for an uncaptioned one.
- **Constraints**: purely alt-text-driven — there's no separate "has a caption" flag.
- **Files**: `src/lib/rehype-figures.mjs`.

### Table of contents

- **Trigger**: 6 or more `##`-level headings in the piece (measured against real content, not guessed).
- **Produces**: a sticky desktop rail + a mobile `<details>` disclosure, both scroll-spy-aware.
- **Authoring example**: N/A — automatic once the heading count threshold is met.
- **Constraints**: only `##` headings count toward the threshold and appear in the list — `###` and deeper never show. A research primitive's `<aside>` never counts, by design (see "Collision rules").
- **Files**: `src/components/TableOfContents.astro`; scroll-spy init script lives in `src/layouts/ArticleShell.astro` (not the component itself, since the component renders twice per page — rail + mobile variant).

### Scroll progress

- **Trigger**: none — renders unconditionally on every research page.
- **Produces**: a fixed 2px bar at the top of the viewport, filling with scroll position.
- **Constraints**: hidden entirely under `prefers-reduced-motion: reduce`.
- **Files**: `src/components/ScrollProgress.astro`, rendered once inside `ArticleShell.astro`.

### Masthead

- **Trigger**: none — renders unconditionally on every research page.
- **Produces**: name/affiliation/correspondence/format/license, sourced from `AUTHOR`/`LICENSE`/`SOCIAL_LINKS` in `src/consts.ts` plus the entry's `format` and optional `doi` frontmatter field.
- **Constraints**: zero per-entry frontmatter needed for the universal parts — if you're hand-typing a byline into a piece's body, that's a bug, not a style choice.
- **Files**: `src/components/ArticleMasthead.astro`, rendered by `src/layouts/ResearchLayout.astro`.

## New: the five research primitives

One contract, five kinds — they share a trigger shape, differing only in the label word.

- **Trigger**: a `<blockquote>` whose first paragraph starts with a bolded label — `**Definition.**`, `**Key idea.**`, `**Evidence.**`, `**Counterpoint.**`, or `**Implication.**` (case-insensitive, trailing period stripped before matching) — followed by body content in the same or subsequent paragraphs.
- **Produces**: `<aside class="research-primitive research-primitive--{kind}">` containing a `<p class="research-primitive-label">` (the canonical-cased label) and a `<div class="research-primitive-body">` (everything after the label). `{kind}` is `definition` / `key-idea` / `evidence` / `counterpoint` / `implication`.
- **Authoring example**:
  ```
  > **Definition.** ASA Assumption — the compiler treats reported household structure as ground truth.
  ```
  An optional stable id, for future concept cross-links (unused by any UI yet):
  ```
  > **Definition.** {#asa-assumption}
  > ASA Assumption — the compiler treats reported household structure as ground truth.
  ```
  becomes `id="primitive-asa-assumption"` on the `<aside>` (prefixed, not the bare slug — avoids ever colliding with a heading's auto-generated id landing on the same string).
- **Constraints**: exactly these five kinds. **Do not add a sixth** (no Synthesis, Research Note, Data Point, or Takeaway) — the set is deliberately closed; if a research entry seems to need a sixth shape, that's a signal to revisit the set itself, not to bolt one on quietly. Uses `<aside>`, not a heading or a `<section>`, specifically so it never appears in the table-of-contents or changes the heading outline. One visual treatment for all five kinds — the label text is the only thing that distinguishes them, never a per-kind fill color (see `design-system/do-not.md`).
- **Files**: `src/lib/rehype-research-primitive.mjs`, registered after `rehypePullQuote` and before `rehypeCitationLinks`.
- **Live on all three research entries** (FAFSA, Sprint 3; the Invariants paper and the essay, Sprint 4, 2026-08-26). Grammar is confirmed paper-agnostic: applying it to a rigorous policy paper, a theoretical assembly paper, and a journalistic essay required zero changes to the five-kind set or the plugin itself. Counts: FAFSA 11 (5 definitions, 2 key ideas, 2 evidence, 1 counterpoint, 1 implication), Invariants 5 (2 definitions, 1 evidence, 1 counterpoint, 1 implication — a planned Key idea placement was dropped because its exact suggested wording duplicated an existing pull-quote verbatim; kept the pull-quote instead), essay 5 (one of each kind). Each placement restates a line already present in the surrounding prose — none introduce new claims.

## New: research relations

A typed, directional registry of how published pieces actually relate — not an autolinker, not a graph UI. Sprint 7 (2026-08-31); 7.1 ships the contract and an empty live file only.

- **Trigger**: none in Markdown. Source of truth is `src/data/research-relations.json`, not a content shape — this module doesn't read the body of any entry.
- **Produces (7.1)**: nothing. The file is `[]`. No rehype plugin exists for this yet, and nothing wires `getCollection` against it — a malformed file cannot currently fail `astro build`. That wiring is deferred to 7.2+, gated on a live entry actually earning a row (see below).
- **Row shape** (`src/lib/research-relations.ts`, a Zod schema — present, not yet imported by anything):
  ```
  {
    id: string,
    source: string,   // research collection id
    target: string,   // research collection id
    type: 'depends_on' | 'applies' | 'extends' | 'contrasts' | 'converges_with',
    reason: string,
    inline?: {
      status: 'proposed' | 'accepted' | 'rejected',
      near?: string,
      anchor?: string,
      reason?: string
    }
  }
  ```
- **The five types** (closed set, same discipline as the five research primitives — no sixth added quietly):
  - `depends_on` — target's argument requires source's.
  - `applies` — source uses a mechanism/framework target established.
  - `extends` — source builds directly on target's specific claim.
  - `contrasts` — source and target take different positions on the same question.
  - `converges_with` — independently arrived-at, structurally similar conclusions.
- **Relation ≠ link.** A row records that two published pieces are intellectually related; that fact exists whether or not a reader ever sees a link. The optional `inline` block is a *separate*, later decision about whether one specific sentence should carry an `<a>`. A relation with no `inline` block is not incomplete — most relations will never get one, and that's the expected outcome, not a gap to fill in later.
- **`inline.status` lifecycle**: `proposed` (a placement worth considering, not yet placed), `accepted` (placed — only status where `near`/`anchor` are required, since those are what a future rehype pass would need to find and wrap the real sentence), `rejected` (considered and declined — the relation itself stays valid; only the inline placement was rejected, so this status keeps its row rather than deleting it).
- **Constraints**: `source !== target` (enforced by the schema's refine). Only live `research` collection ids are valid `source`/`target` values — never a planned-paper slug, never an id for a piece that hasn't been published. A row for a piece not yet in the collection is premature by construction, not merely incomplete.
- **Layered, not merged** — three separate systems that must never collapse into one:
  - This registry (intellectual edges between pieces).
  - The inline-link graph (`inline.status === 'accepted'` rows only, once any exist) — a hand-authored `<a>` always wins over anything this system would ever propose.
  - The existing nav graph — `/research`, pillar pages, `RelatedResearch.astro` (pillar/tag proximity) — unchanged by this sprint, a different signal entirely from a declared relation.
  - `#ref-*` citation links (`rehype-citation-links.mjs`) are a fourth, wholly separate system — untouched, not layered with this one at all.
- **Silence is a valid, permanent-until-earned state.** Sprint 7 paused after 7.1 with the file at `[]`; Sprint 7.2 (2026-08-31) added the first live row, `three-sos--invariants`, once Three SOS actually landed in the collection. Pangram→FAFSA (`converges_with`) stays unadded until its own source entry exists — an empty *or* partially-populated file is correct at any point, never a placeholder waiting to be filled out to some target size.
- The live file may contain relation-only rows (no `inline` block) — that's the expected common case, not an incomplete one. First (and currently only) row: `three-sos--invariants`.
- **Files**: `src/data/research-relations.json` (the live data, `[]`), `src/lib/research-relations.ts` (the Zod schema, unwired).

## Collision rules

- **Alerts never collide with anything** — `remarkAlert` consumes GFM alert syntax in the remark (mdast) phase, before any rehype plugin below runs. By the time pull-quote or the research-primitive matcher walks the tree, an alert is already a `<div class="markdown-alert...">`, not a `<blockquote>`.
- **Pull-quote runs before the research primitives, and that ordering is what prevents the collision.** Pull-quote's shape check is strict: the entire blockquote must be one paragraph whose only child is a `<strong>` — nothing else, not even trailing punctuation outside the bold. A well-formed research primitive always has body content after its label, so that check already fails for it, and pull-quote leaves it as a real `<blockquote>` for `rehypeResearchPrimitive` to process next. The only way the two could actually compete is a malformed, label-only blockquote with no body at all (`> **Definition.**` and nothing else) — in that degenerate case pull-quote wins (registered first), which is a reasonable default: an unlabeled pull-quote is still coherent output, a labeled aside with an empty body is not.
- **An unrecognized bold label stays an ordinary blockquote.** `> **Not a real label.** ...` matches neither pull-quote's strict shape (there's trailing text) nor any of the five known labels, so it's left untouched — same fails-closed principle as citation-linking.

## How to add a module

1. Confirm the pattern actually recurs in real content — this project's standing discipline is to build from observed shapes, not anticipated ones (the TOC threshold, the References scope, and this sprint's five primitives were all set this way, not guessed).
2. Prefer a rehype plugin over a remark plugin unless the pattern needs to restructure the Markdown AST itself before HTML conversion (reading time is the one real remark-phase exception, since word counts don't exist as a concept in hast).
3. Document the contract here (this file) *before* merging the plugin — trigger, produces, authoring example, constraints, files.
4. Register it in `astro.config.mjs`'s `rehypePlugins` array in the correct position — most modules only need to run after References (if they touch `id="ref-N"`) and before Citation Links (which must always run last, since later modules can introduce new citable text).
5. Any new CSS goes in `global.css`, unscoped (component-scoped `<style>` can't reach markup injected via `<slot />` from rendered Markdown) — and follow the existing visual language in `design-system/components.md` rather than inventing a new surface treatment.

## Planned / not yet — deferred, no implementation

- **System Map** — no shape defined yet.
- **Protocol Registry** — no shape defined yet.
- **Quick Read** — explicitly rejected as a product direction (see `design-system/do-not.md`), not merely deferred.
- **Research graph / concept-link UI** — no visible graph, no UI. The underlying registry (typed relations, not a UI) is now real as of Sprint 7.1 — see "New: research relations" above — but a rehype transform, a rendered graph, and any use of the `{#slug}` ids the five primitives can optionally carry are all still deferred, gated on a live entry earning the first `inline.status === 'accepted'` row.

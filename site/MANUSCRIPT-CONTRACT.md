# Manuscript Intake Contract — Editorial Package to Website Source

**Version:** v0.1 · **Status:** DRAFT FOR PRE-SEAL REVIEW — not yet an accepted production standard  
**Scope:** New and revised research entries in `site/src/content/research/`, all `format` values  
**Website grammar inspected:** `amulbham/cybernetics-mbp @ 9697dbc7310c480d4b6349104e9504107e4341a2`  
**Research authoring guide inspected:** `amulbham/amulbham-research @ bec57c4d05aa41e1fcf9d261251b9ae72322c94a`, root `MANUSCRIPT-AUTHORING.md` v0.2 (still a draft globally; usable for the accepted Lab Bubble pilot)  
**Evidence:** T25.0 audit; approved 2026-10-23 authoring-design checkpoint; T25.1 owner guide; 2026-10-26 [Lab Bubble intake planning packet](../planner/checkpoints/2026-10-26-lab-bubble-accepted-intake-packet.md).  
**Grammar authority:** [CONTENT-MODULES.md](CONTENT-MODULES.md), `src/lib/rehype-research-primitive.mjs`, `src/content.config.ts`. This contract **does not** redefine those parsers or promise enforcement they do not provide.

## 1. Outcome and editorial authority

One prose agent (which may also be the agent that finished the paper) delivers an author-reviewed manuscript **and** a small publication handoff. A separate website Executor turns that **approved input** into the website's canonical Markdown/frontmatter without conducting another editorial pass. The article is authoritative for words, heading order, callout types, body/anchor placement, citations and inline emphasis.

The human author approves the integrated editorial package and publication decisions. **Unconditionally, including when zero primitives are supplied:** the website Executor must **not** independently add, move, remove, rewrite, or invent a research primitive, inline emphasis, substantive claim, abstract, publication date, category, DOI or citation. If a site constraint prevents exact implementation, stop the **affected** intake and report the reason and proposed resolution. Continue unrelated authorized work where safe.

Authoring states are distinct:

| State | Meaning | May an Executor publish? |
| --- | --- | --- |
| `WORKING DRAFT` | Editorial choices still open | No; review/preflight only |
| `EDITORIALLY APPROVED` | Human approved exact wording, callouts, placement, emphasis, citation approach | Not until publishing metadata, evidence and intake checks are complete |
| `PUBLICATION-READY` | Required metadata/source integrity/clean site intake validated and author authorized publication preparation | Eligible for a **separately authorized** staging/release ticket; still not permission to push `main` |

Do not fill a field with plausible guesses to move a package into a later state.

## 2. Accepted authoring envelopes and provenance

**A — Clean files.** An exact Markdown manuscript (`assets/manuscript.md`, for example) and an optional short `assets/publishing-handoff.md` file. Full IWL/history stays in the research workspace. An offline manuscript may contain a title/byline preceding the website body; remove **only** the explicitly specified offline preface when deriving site content.

**B — Single combined file.** One MD with an exact public region and separately bounded internal instructions, such as:

```md
<!-- PUBLICATION-CONTENT-START -->
[complete approved public manuscript]
<!-- PUBLICATION-CONTENT-END -->

<!-- INTERNAL-PUBLISHING-HANDOFF-START: DO NOT RENDER -->
[metadata status, source identity, approved/pending decisions, QA]
<!-- INTERNAL-PUBLISHING-HANDOFF-END -->
```

These authoring envelopes are **equally first class**. A second document is never mandatory merely because the author chose a combined file. The manuscript public region owns its actual wording and placement; a handoff/inventory is **derived or checked**, not a second manual copy of the callout decisions.

**Combined-file extraction is NOT implemented/validated in the current website.** HTML comments are not visibility fences; copying such a file directly into Astro can publish internal notes. This contract sets the **required fail-closed behavior** for a future intake path, without claiming a present code validator:

1. Identify input type and exact immutable source version (file path/ref/commit and, when available, SHA-256); reject unknown source identity or competing authoritative manuscripts.
2. For combined files, demand **exactly one** ordered start/end pair for public content, no nested, duplicate, reversed or missing markers, and no unapproved material outside the declared public/handoff envelope. An internal handoff must be unambiguously bounded; orphan markers fail.
3. Extract public bytes *only* between markers; when an offline preface is present, remove it **only if a precise, author-approved boundary is supplied**. No generalized stripping of leading paragraphs, headers or separators by inference.
4. Check exact extracted body hash/text, unchanged ordered headings, references, callouts/IDs, citations and emphasis, and confirm internal notes are absent from both generated HTML and any derived PDF/search/metadata.
5. **Until an extractor/validator is separately implemented and tested**, the Executor may prepare a manually derived *proposed* clean source with a documented exact-byte proof and author-approved boundaries, but must not claim automated safety or run an unvalidated combined file through normal production intake.

Do not put historical IWL records, developer comments, internal review/candidate inventories, workflow approvals or provisional metadata into the public source.

## 3. Metadata mapping — current schema, no fabricated abstract

Existing required research frontmatter: `title`, `format` (`paper|essay|memo`), `category` (one of `cybernetics|knowledge-work|ai-systems|essays`), `pubDate`, `description`, `excerpt` (≤200 characters). Actual allowed values are owned by `src/content.config.ts` and `src/lib/categories.ts`, which must be rechecked at implementation.

- **Abstract optional.** Never invent a `## Abstract`. `description` is required for JSON-LD; when there is no abstract, an accurate author-approved `description` may equal `excerpt`, which is used for the HTML meta description/cards and must stay ≤200 characters.
- `subtitle` is optional frontmatter, not a body `##`. The shell builds title, byline, correspondence, author note, format/licensing; do not duplicate a source's offline masthead.
- `doi` is optional; if supplied it must be a real approved `https://doi.org/10.…` resolver and `format: paper`. **No `pdfUrl` field.** `dateModified` is optional and must follow substantial-edits policy; the original `pubDate` survives an existing-entry update.
- `tags` optional; sentence case except genuine proper/coined concepts. `readerNote` is optional but `why` and `for` must be authored together. Hero and alt must be supplied/approved together. IWL is an optional **separate collection**, not part of the research body.
- `pubDate` requires an exact approved date before publication intake. Do not use today's date, date in an offline masthead or a fake YAML placeholder. Pending decisions live in the handoff and **block dependent publication**, not authorized editorial work.
- Classification and routing are independent: `category` decides `/research/{category}/{slug}/`; `format: paper` decides scholarly PDF/Highwire/ScholarlyArticle. No DOI or PDF simply because prose is long.

**Lab Bubble fixture (not a deployed entry):** author accepted `title: The Lab Bubble`, `format: essay` and `category: ai-systems`; `subtitle`/abstract absent; excerpt/description **still awaiting exact author approval**; `pubDate` **unresolved**; no DOI/PDF. This is **not yet complete publishable YAML**. The proposed excerpt and source IDs are in the pinned [intake packet](../planner/checkpoints/2026-10-26-lab-bubble-accepted-intake-packet.md).

## 4. Supported body grammar and noninterference

All primitive types are a **closed five-kind** grammar; the site owns the parser and one shared visual treatment:

```md
> **Definition.** {#lab-bubble}
> The Lab Bubble names the central conceptual distinction.
```

The snippet is illustrative, **not** authorized replacement copy. Labels: `Definition.`, `Key idea.`, `Evidence.`, `Counterpoint.`, `Implication.`. An authored `{#lab-bubble}` maps to rendered `#primitive-lab-bubble`. IDs are **optional**, but if supplied they must be syntactically valid and unique. Every intended primitive requires a **substantive body**. Empty labels, malformed anchors and unsupported primitive labels are errors to report; the current transformer does **not** reliably reject them. Ordinary blockquotes/pull-quotes/GFM alerts remain their own valid shapes.

Inline `**bold**` and `*italic*` are author-owned text formatting, not sixth/seventh callout kinds. A missing primitive inventory never delegates editorial selection to the Executor. No color differentiation/per-kind renderer changes.

Headings, References, tables, figures, pull-quotes and GFM alerts follow `CONTENT-MODULES.md`. Six or more `##` headings trigger the site's TOC. Inspect mobile and desktop rhythm; avoid automatically moving a callout merely because two are close or one is long.

## 5. Citations and references: preserve the chosen voice

- Paper author-year form `(Author, Year)` / `Name (Year)` routes to on-page `#ref-N` when uniquely matched; unknown names fail closed, not filled by inference.
- Essays/memos commonly use manual first-mention source links. **Lab Bubble explicitly authors `[[N]](URL)` outbound citation links.** These already make the cited claims clickable; the site's author-year linker does **not** convert them. **Preserve exactly for the pilot unless the author separately approves a new citation presentation**. This is a scoped author choice, not a new universal essay syntax.
- `## References` must be followed by a **single contiguous ordered list with no blank lines between individual entries**, so the site can generate stable `#ref-N` targets. The bibliography must cite real, verified sources; never invent a landing page.
- Use meaningful outward link labels (DOI host/path, real host/path or descriptive linked source title). Avoid opaque generic `[DOI]`/`[Source]` labels; where a legacy manuscript uses `doi:10.…` a label-only normalization is a separate visible author-reviewed projection, never a silent citation rewrite.
- Fidelity checks compare reference numbering, URL destinations, citation count/coverage, Evidence block links and rendered clickable targets. Report broken or unverified links.

## 6. Outputs, verification layers and failure ownership

A complete accepted intake handoff records **source identity**, canonical public-body extraction rule and hash, author approval state, metadata decisions/pending blockers, primitive/anchor summary **derived from the manuscript**, evidence/citation status, optional IWL status, next owner gate and allowed publication branch. It does **not** create a second manually maintained prose/primitive copy.

Validation must distinguish:

1. **Static provenance:** source/candidate equality; explicit public-content boundary; headings/order; five labels, nonempty bodies, valid/unique optional anchors; emphasis/links; bibliography integrity; no private notes.
2. **Build reality:** Astro content schema, actual generated primitive `<aside>` and prefixed IDs, TOC/reference links, citation destinations, JSON-LD, canonical URL, sitemap/Pagefind, zero internal leaks. A source regex pass is **not** evidence of a successful Astro build.
3. **Visual reality:** screen desktop/mobile readability and callout spacing; print projection/pagination for `paper` only.
4. **Release reality:** fresh Actions CI, review on nonindexable staging, unchanged existing frozen PDFs, owner signoff against the exact candidate SHA, actual production deploy verification.

A **new entry** must be added to the append-only route-history registry on first production publication (under the separately sealed content ticket). A substantive **existing entry update** retains identity and original pubDate, and any new PDF version requires its own explicit frozen-artifact approval. Publishing procedures and release proof are owned by `PUBLISHING.md`, `AGENTS.md` and the future **distinct new-entry/existing-update runbooks**, not this intake contract.

**Fail-closed gate:** unsupported renderer grammar; malformed/ambiguous combined file; missing agreed public boundary; conflicting approved source; unapproved editorial shift; false citation; missing required metadata; released/frozen PDF identity change; failing build or leaked internal notes → stop the **dependent intake or publication** and report evidence. Unresolved DOI/date/release instructions **do not** stop unrelated editorial preparation.

## 7. Executor instruction reconciliation required at T25.2 acceptance

The existing `.claude/skills/content-manager/SKILL.md` **contradicts** the approved upstream-author boundary. The subsequent **prospectively sealed docs-only Executor task** must at minimum:

- Replace its instruction to **add a small set of primitives when none are supplied** with an unconditional preserve-and-report rule, including zero primitives.
- Correct “`description` = full abstract” to allow the supported no-abstract `description=excerpt` case.
- Replace stale site-deindexed/default indexing statements with current production facts from `AGENTS.md` and the T22 publication evidence.
- Remove hard-coded paper/PDF counts and categorical “new paper needs zero work” claims where they confuse the frozen manifest/new-paper artifact policy.
- Point the skill to this accepted manuscript contract, `CONTENT-MODULES.md`, the pinned authoring guide, and existing publishing/release/runbook authorities; do not copy all rules into the skill.

**T25.2 only documents and reconciles existing authoring/intake behavior.** It does **not** implement a combined-file extractor, a primitive validator, new PDF bootstrap, a citation renderer redesign, a new paper, or a Lab Bubble release. Those require their own bounded and approved scope.

## 8. Nonpublishing acceptance fixtures (planned, not yet run)

| Fixture | Expected observation |
| --- | --- |
| Clean source with zero primitives | Accepted for editorial intake; Executor adds zero |
| Correct five-kind prose/source sample | Existing renderer recognized without per-type changes |
| Empty/unknown label, duplicate/malformed anchors | Must be reported, never silently interpreted as valid; **current automated rejection not proven** |
| Combined file with valid markers | Defined exact public source only; no direct Astro upload without validated extraction |
| Missing/duplicate/reversed/nested markers | Rejection contract; implementation gap identified, not assumed fixed |
| No-abstract draft with pending date | Editorial package may be complete; cannot claim publication-ready |
| FAFSA v2.4 | Eighteen **candidate** primitives may be justified; no automatic quota or publication |
| Chisel live source | Adjacent placement pairs flagged for author review, not auto-reordered |
| Lab Bubble V2.6.3 | Verify seven approved anchors, 9 sections, 20 references, 23 `[[N]]` citations covering 1–20 and exact body hash at research commit `7be299fa7d57bcd9a0799c43e42e80de017c79b7`; author-approved site content only |

**Status after draft:** This file documents the intended contract, not a passed fresh-agent test, a working extractor, or authority to publish.

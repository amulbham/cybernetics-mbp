# Manuscript Intake Contract — Editorial Package to Website Source

**Version:** v1.0 · **Status:** FINALIZED UNDER SEALED T25.2 — **proposed**, not an accepted canonical standard until the Planner independently accepts it  
**Scope:** new and revised entries in `site/src/content/research/`, all `format` values. Authoring and intake only; no release.  
**Implemented truth checked against:** `amulbham/cybernetics-mbp @ 9697dbc7310c480d4b6349104e9504107e4341a2` (`origin/main`). The copies of `CONTENT-MODULES.md`, `PUBLISHING.md` and `AGENTS.md` on `planner/context` are older; recheck `main` at intake.  
**Upstream design:** `amulbham/amulbham-research @ bec57c4d05aa41e1fcf9d261251b9ae72322c94a`, `MANUSCRIPT-AUTHORING.md` v0.2 and `meta/examples/primitive-worked-example.md` v0.1 (both still drafts globally).  
**Pilot fixture:** Lab Bubble V2.6.3, research `@ 7be299fa7d57bcd9a0799c43e42e80de017c79b7`. [Intake planning packet](../planner/checkpoints/2026-10-26-lab-bubble-accepted-intake-packet.md).  
**Grammar authority:** [CONTENT-MODULES.md](CONTENT-MODULES.md), `src/lib/rehype-research-primitive.mjs`, `src/content.config.ts`. This contract does not redefine them and does not promise enforcement they lack. Publishing flow, PDFs and release: [PUBLISHING.md](PUBLISHING.md), [AGENTS.md](AGENTS.md).

## 1. Editorial authority and the noninterference rule

The prose agent (the same one that finished the paper, or a fresh one) and the human author own the manuscript: wording, heading order, callout kinds and placement, anchors, bold and italic emphasis, and citations. The website Executor turns the **approved** input into site source and does not run another editorial pass.

**Unconditionally, including when the manuscript has zero primitives:** the Executor must not add, move, remove, reword or invent a primitive, emphasis, claim, abstract, publication date, category, DOI, tag or citation. The Executor's only permitted changes are mechanical and must be named in the approved handoff: assembling frontmatter from approved metadata, removing the specified offline preface, and any listed normalization. If a site constraint blocks exact preservation, stop the **affected** intake, report the reason and a proposed resolution, and continue unrelated authorized work.

| State | Meaning | May an Executor publish? |
| --- | --- | --- |
| `WORKING DRAFT` | Editorial choices still open | No; review or preflight only |
| `EDITORIALLY APPROVED` | Author approved the exact revision: wording, callouts, placement, emphasis, citation approach | Not until metadata, evidence and intake checks are complete |
| `PUBLICATION-READY` | Required metadata, source integrity and clean intake validated; author authorized release preparation | Eligible for a **separately sealed** staging or release ticket. Not permission to push `main` |

Never upgrade a state because formatting finished or a file compiled. Pending items (date, DOI, category, excerpt approval) block only the dependent publication step, not the editorial work.

## 2. Authoring envelopes and fail-closed boundaries

Both envelopes are first-class authoring packages. Neither is more authoritative, and a second document is never required merely because the author chose one file.

**A. Clean files.** An exact Markdown manuscript (for example `assets/manuscript.md`) plus an optional short `assets/publishing-handoff.md`. History, IWL and review notes stay in the research workspace.

**B. One combined file.** One Markdown file with a public region and a separately bounded internal handoff:

```md
<!-- PUBLICATION-CONTENT-START -->
[complete approved public manuscript]
<!-- PUBLICATION-CONTENT-END -->

<!-- INTERNAL-PUBLISHING-HANDOFF-START: DO NOT RENDER -->
[metadata status, source identity, approved and pending decisions, QA]
<!-- INTERNAL-PUBLISHING-HANDOFF-END -->
```

**HTML comments alone hide nothing.** Each marker above is its own comment, so the text between two markers is ordinary Markdown and would render. Even text inside a single comment can remain in page source or derived data; whether Astro's pipeline strips it was not verified here. A combined file must never be copied into `site/src/content/research/`.

**Combined-file extraction and validation are NOT implemented.** No script, validator or CI step reads these markers. The rules below are the *specified* fail-closed behavior for a future, separately authorized extractor. Until one exists and is tested, an Executor may only prepare a manually derived, proposed clean source with a recorded byte-level proof and must not claim automated safety.

1. Identify the input and its immutable version (path, ref or commit, SHA-256 when available). Reject an unknown source or competing authoritative manuscripts.
2. Require exactly one ordered public START/END pair and exactly one internal START/END pair. Reject on any of these (paper-walkthrough cases, not run against code):

| Malformed input | Specified result |
| --- | --- |
| Missing START or END | Fail; no extraction |
| END before START | Fail |
| Second public pair, or nested pair | Fail |
| Internal marker without its partner | Fail |
| Marker text inside a fenced code block or inline code | Fail as ambiguous |
| Marker inside the public body, or content outside both envelopes | Fail unless the author approved that content as non-public |
| Internal region overlapping the public region | Fail |

3. Extract only the bytes between the public markers. Remove an offline preface (title, byline, date, rule) only at a **precise, author-approved boundary**; never strip leading paragraphs by inference.
4. Compare the extracted body hash and text, ordered headings, references, callouts and anchors, citations and emphasis with the manuscript, and confirm no internal text appears in generated HTML, any derived PDF, search index or metadata.

Keep historical IWL records, developer comments, candidate inventories, workflow approvals and provisional metadata out of the public source.

## 3. Metadata and publication format

Required frontmatter (`src/content.config.ts` on `main`): `title`, `format` (`paper|essay|memo`), `category` (`cybernetics|knowledge-work|ai-systems|essays`, from `src/lib/categories.ts`), `pubDate`, `description`, `excerpt` (at most 200 characters). Optional: `subtitle`, `dateModified`, `doi`, `tags`, `readerNote` (`why` and `for` together, or neither), `heroImage` with `heroImageAlt` together. A `doi` must be an `https://doi.org/10.…` URL and requires `format: paper`. There is no `pdfUrl` field. The schema does not require non-empty `description` or `excerpt`, so a placeholder passes the build; intake review must check them.

- **Abstract is optional.** Never invent a `## Abstract`. Without one, an author-approved `description` may equal `excerpt` (that is the supported no-abstract case). `description` feeds JSON-LD; `excerpt` feeds the meta description and cards.
- `subtitle` is frontmatter, never a body `##`. The shell renders title, byline, correspondence, license and author note; the body must not repeat them.
- `pubDate` needs an exact, author-approved date. Never use today's date, an offline masthead month or a placeholder. A revision keeps the original `pubDate`; `dateModified` is set only for an authorized substantive revision. Unresolved fields live in the handoff as `PENDING`, not as fabricated frontmatter.
- `category` routes (`/research/{category}/{slug}/`); `format` decides the artifact.

| Format | Scholarly PDF / Highwire | JSON-LD type | DOI | Route-history row |
| --- | --- | --- | --- | --- |
| `paper` | Yes, built from the HTML | `['ScholarlyArticle','Article']` | Optional | Required at first production publication |
| `essay` | No | `Article` | Not allowed | Required (`pdf: false`) |
| `memo` | No | `Article` | Not allowed | Required; no memo category exists, so placement needs an owner decision |

PDF rules are not changed here. Existing papers keep their frozen PDFs (`PDF_MANIFEST`, carry-over). A revision of an existing non-Desk paper has a documented flow (`PUBLISHING.md`, "Revising a published paper"). A **new paper** and a **Desk revision** are not supported by `carry-over-pdfs.sh` as read in the T25.0 audit (count of five, production-200 requirement, Desk branch); that needs its own ticket.

**Lab Bubble fixture (not a deployed entry):** `title: The Lab Bubble`, `format: essay`, `category: ai-systems` accepted. No subtitle or abstract. Excerpt and description (proposed equal) still await exact author approval. `pubDate` is unresolved. No DOI or PDF. This is **not** publishable YAML yet.

## 4. Body grammar and review errors

Grammar belongs to `CONTENT-MODULES.md` (the "five research primitives" section). Summary of what intake relies on, verified against `rehype-research-primitive.mjs` on `main`:

- Five kinds only: `Definition`, `Key idea`, `Evidence`, `Counterpoint`, `Implication`. No sixth, one shared visual treatment, no per-kind styling.
- **Authoring rule (stricter than the parser):** write the label exactly, bold, with its period (`> **Evidence.** …`). The parser also accepts any case and a missing period; do not rely on that.
- Optional anchor `{#lowercase-hyphen-slug}` immediately after the label renders as `id="primitive-<slug>"`. Anchors are optional, must be valid and unique.
- Every primitive needs a substantive body.
- Bold and italics are inline text choices, not primitives. A pull-quote (`> **One bold line.**`), a GFM alert and an ordinary blockquote are different valid shapes. Zero primitives and zero emphasis are valid; there is no quota.

The current renderer is permissive. The table lists what the source does (static reading, not executed) and what intake must do.

| Condition | Current behavior | Intake action |
| --- | --- | --- |
| Unknown label (`**Synthesis.**`) | Left as an ordinary blockquote | Report as error; do not reinterpret |
| Label only, no body (`> **Definition.**`) | Matches the pull-quote shape and renders as a pull quote | Report as error |
| Label and `{#id}` but no body text | Renders a callout with an empty body | Report as error |
| Malformed anchor (characters outside `a–z`, `0–9`, `-`) | Anchor not recognized; raw `{#…}` text stays in the body | Report as error |
| Duplicate anchors | Duplicate `id` values; no site-wide check | Report as error |
| Wrong-case label or missing period | Accepted | Report as a style deviation |

None of these fail the build today. No validator is proposed or implemented here.

Headings, References, tables, figures, pull-quotes and alerts follow `CONTENT-MODULES.md`. Six or more `##` headings enable the table of contents. Adjacent or long callouts are review prompts for the author, never reasons for the Executor to move them.

## 5. Citations and references

- **Author-year citations** (`(Author, Year)`, `Name (Year)`) link to `#ref-N` only when they match exactly one reference. Unmatched or ambiguous ones stay **plain text** and the build does not fail. The intake report lists every such citation separately, with a correction or an explicit author decision. Never guess a target or describe this as automatic rejection.
- **Essays and memos** commonly use manual outbound links. Lab Bubble authors `[[N]](URL)` links; the author-year linker does not touch them. Preserve them exactly unless the author approves a change. This is a scoped choice for that work, not a new universal syntax.
- `## References` is followed by one contiguous ordered list with no blank line between entries; numbering drives `#ref-N`. References must be real; never invent a landing page.
- **Display labels follow `PUBLISHING.md`:** a DOI shows as `doi.org/10.…`, a web source as its host and path, never a generic `[DOI]` or `[Source]`. A descriptive linked title is not a permitted replacement, and this contract does not change that policy.
- **Lab Bubble needs a scoped decision before release.** By static count, all 20 references show italic linked titles rather than host or path labels, and references 12, 15 and 18 also carry `doi:10.…` labels. Before any release the author must approve, in writing and bounded to this work, either (a) a display-label-only normalization in the website projection, which changes the projection bytes and so the recorded body hash, or (b) a documented exception. Neither is approved today.
- Fidelity checks compare reference numbering, URL destinations, citation count, links inside Evidence blocks and the rendered targets. Report broken or unverified links.

## 6. Handoff contents and verification layers

A handoff records: source identity and the rule and hash for the public body; approval state; metadata decisions and `PENDING` blockers; a primitive and anchor summary **derived from the manuscript** (never a second hand-kept copy); evidence and citation status; optional IWL status; the next owner gate and allowed branch.

| Layer | What it proves | Status of tooling today |
| --- | --- | --- |
| 1. Static provenance | Source equals candidate; public boundary; headings; labels, bodies and anchors; emphasis and links; bibliography integrity; no private notes | Manual reading only; no validator |
| 2. Build | Astro schema, generated `aside` elements and ids, TOC, reference links, JSON-LD, sitemap, search, no leaks | Existing `npm run build` covers schema and some graph checks; **not** primitives, anchors or reference contiguity. A source scan is not evidence of a build |
| 3. Visual | Desktop and mobile readability; print pagination for papers | Human review |
| 4. Release | Fresh CI, nonindexable staging review, unchanged frozen PDFs, owner signoff on the exact SHA, production verification | Separate sealed tickets |

A new entry is added to the append-only route-history registry on first production publication. A substantive update keeps its identity and original `pubDate`; a new PDF version needs explicit frozen-artifact approval. Runbooks live in `PUBLISHING.md`.

**Stop and report** when: grammar is unsupported; a combined file is malformed or its boundary is missing; sources conflict; an editorial change is unapproved; a citation is false; required metadata is missing; a frozen PDF identity would change; the build fails; or internal text leaks. Unresolved DOI, date or release items do not stop unrelated editorial preparation.

## 7. Content-manager skill reconciliation (done under T25.2)

`.claude/skills/content-manager/SKILL.md` was reconciled to this contract within its intake, editorial-authority and documentation sections only: the permission to add primitives on upload is replaced by unconditional preservation and reporting (including zero primitives); the abstract assumption now allows the no-abstract case; stale indexing, hard-coded paper counts and the "new paper needs zero work" claim are corrected; and the skill points here and to the owner documents instead of copying their rules. Other skill operations were not redesigned.

T25.2 documents existing behavior. It does **not** implement a combined-file extractor, a primitive validator, new-paper PDF support, a citation redesign, a new paper or a Lab Bubble release; each needs its own bounded, approved scope.

## 8. Nonpublishing fixtures

"Static" means files were read and counted by script or by eye in this task. No Astro build, rendered page, extractor or fresh-agent trial was run for any row.

| # | Fixture | Static result recorded | Not run |
| --- | --- | --- | --- |
| F1 | Zero-primitive source | Rule written (§1); no live example exists, so paper walkthrough only | Fresh-agent intake trial |
| F2 | Malformed labels, bodies, anchors | Source behavior read from the transformer (§4); Lab Bubble has none of these defects | Parser run on bad input; validator |
| F3 | Combined file, valid markers | Specified (§2); the pinned worked example is illustrative only | Extractor, leak check |
| F4 | Combined file, bad markers | Specified rejection table (§2) | Any implementation |
| F5 | No-abstract draft, pending date | Lab Bubble handoff leaves `pubDate` pending; the worked example's date is an invented fixture | Frontmatter assembly and build |
| F6 | FAFSA v2.4 | Guide reports 18 candidate callouts; no FAFSA-named path exists in the pinned research trees (path-name search only), so this is unverified | Counts, rendering |
| F7 | Chisel (live, `main`) | 9 callouts, 4 adjacent pairs, found by script; flagged for author review, not reordered | Rendered review |
| F8 | Lab Bubble V2.6.3 | At research `7be299f`: blob `a17d9124…`; body from `## I Had Tokens to Burn` to end hashes to `857c1933…` (matches); 9 narrative sections plus References; 7 callouts, 7 valid unique anchors, all with bodies; 20 contiguous references; 23 `[[N]](URL)` links covering 1–20; no author-year citations; no HTML comments in the body | Astro build, rendered ids, link liveness, mobile and SEO review |
| F9 | Existing frozen PDFs | Unchanged: no PDF, manifest or release file touched | Carry-over or CI |

**Status:** this file is a proposed contract. It is not a passed fresh-agent test, a working extractor, an accepted standard or authority to publish.

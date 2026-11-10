# Sprint 29 — Paper C source and publication-input audit

Date: 2026-11-10 (America/Los_Angeles)
Mode: AUDIT — Planner source inspection and one isolated citation-transform probe
Disposition: **SOURCE PIN VERIFIED / SOURCE AUDIT COMPLETE / NOT READY for specimen ticket**
Blocking input: author-approved Key findings are absent from the supplied manuscript.
Inherits: Sprint 29 roadmap and decision register @ e49e868d17e9aa0db6156d19f2b87718c1335d9b.
No executor ticket is created or sealed by this record.

## 1. Source authority and lineage

Repository: `amulbham/amulbham-research`
Branch: `papers/cybernetics-bridge-v4-3-p1-editorial`
Verified branch HEAD: `11a8dfab31f9a78f25089113091d93edffacc4e2`
Immutable manuscript commit: `15ac4976e7076dbb88b2c4e6ef5798571051ec3e`
Canonical manuscript: `papers/cybernetics-bridge/assets/v4.5_Cybernetics_Bridge_Publication_Manuscript.md`
Git blob SHA: `ac81e330834d2586b3c122e99c3fd3f31d0e76b3`

The remote branch equals the supplied HEAD. Its sole parent is the immutable manuscript commit. The manuscript fetched at both commits has identical text and the supplied blob SHA. The intervening commit changes STATE, IWL-v2 and adds the v4.5 implementation receipt/source register; it does not revise the manuscript.

The research STATE explicitly designates v4.5 as the single author-approved publication source. Earlier manuscripts are historical. The v4.5 receipt records approved editorial transformations; its 55-source register establishes citation footprints, not a complete primary-text source-to-claim certification.

Website application baseline: `main @ fc3cb775aeb104b362426a589d64cbacf9fe9411`.
Planning parent: `planner/context @ e49e868d17e9aa0db6156d19f2b87718c1335d9b`.
Staging: `3f2b0369169278f6606804dee17749944aee0e32`; excluded as an implementation baseline.
These refs were freshly checked for this audit. Planner branch product files are older than main; application findings below use main, not copied Planner-branch source.

## 2. Article starting-state matrix

Line anchors below refer to the immutable manuscript, including blank lines.

| Surface | Status | Evidence and minimum action |
| --- | --- | --- |
| Editorial source/SPM | READY | STATE + receipt designate v4.5. Preserve inherited research history; no new SPM/IWL needed. |
| Title/subtitle | READY | L1 title; L2 italic subtitle “A Cognitive Physics Framework”. Move into shell fields under an explicitly approved projection map. |
| Identity | READY direction / projection needed | L4 name/Systems Researcher; L6 ORCID matches website shared identifier. Contact/topic lines and source metadata are offline front matter, not duplicated body text. |
| Abstract | READY | L14–24, including Keywords. Preserve exact words/emphasis; abstract is long and needs opening/pagination review. |
| Key findings | **MISSING / BLOCKS specimen ticket** | No controlled findings heading/list exists anywhere in the 917-line source. Research authoring package f17779e and active S29 require upstream approved wording. |
| Primitives | READY source / render needed | 25 unique IDs: 8 Definitions, 8 Key ideas (one capitalized Key Idea), 3 Evidence, 4 Counterpoints, 2 Implications. Parser supports case variation. Preserve all IDs/order/bodies. |
| Tables | WORK NEEDED render | 16 tables; shapes listed below. L36 blank first-header comparison matrix and L828 eight-column appendix are priority cases. No responsive-records opt-in marker is supplied. |
| Figures/assets | NOT APPLICABLE to this source | No Markdown image or HTML figure/image reference found. No required separate figure asset is discovered. Do not invent a figure to satisfy a generic test row. Hero image is absent/optional. |
| References | READY inventory / linking work needed | L712–822: 55 sequential numbered entries, with 46 literal external URLs (43 DOI URLs). No full live-link/claim verification performed here. |
| Appendices | READY source / render needed | Appendices A, B, C at L824, L844, L887. Preserve all content and ordering. |
| Authored biography | OWNER PROJECTION DECISION | L908–912 explicitly retains About the Author; receipt confirms retention. “No generated closing bio” alone does not authorize deleting this authored block. Proposed handling in §4. |
| Closing edition line | PROJECTION DECISION | L914–916 rule/footer repeats title/name/series/version/month; map to compact edition metadata rather than duplicate author blocks. |
| Rights | DIRECTION SUPPORTED | L8 explicitly states CC BY 4.0; owner direction agrees. No separately embedded image/reproduction discovered. This source scan is not third-party copyright clearance. |
| Dates/DOI | OWNER DECISION before publication | Source supplies November 2026, v4.5 and Paper C, but no exact publication day or Paper C DOI. Candidate output may omit unassigned DOI and use the truthful edition month; no fabricated pubDate. |
| Website metadata | PROPOSALS pending | format paper; recommend category cybernetics and slug cybernetics-and-the-structural-science-of-self-organizing-systems. Required description/excerpt and exact date need approval before persistent intake. |
| Scholarly verification | OPEN upstream | STATE/receipt explicitly leave full primary-text source-to-claim audit open. Rendering can proceed after source completion; publication must retain an explicit research-side disposition of this open gate. |
| Candidate/release custody | WORK NEEDED | Current all-paper builder writes canonical dist PDFs. It must not be used for this experiment. Reusable selector/output isolation and later seventh-artifact guard extension remain earned implementation work. |

## 3. Paper C table cases

Header line; columns × data rows (header/separator excluded):

| Case | Header line | Shape | Purpose / risk |
| --- | --- | --- | --- |
| PC-T1 | 36 | 4 × 7 | Cross-substrate matrix; blank corner header; retain cross-column comparisons |
| PC-T2 | 192 | 3 × 7 | Preserve full cells, citations, relationships and page breaks |
| PC-T3 | 213 | 2 × 7 | Preserve full cells, citations, relationships and page breaks |
| PC-T4 | 251 | 3 × 4 | Preserve full cells, citations, relationships and page breaks |
| PC-T5 | 308 | 3 × 3 | Preserve full cells, citations, relationships and page breaks |
| PC-T6 | 332 | 3 × 4 | Preserve full cells, citations, relationships and page breaks |
| PC-T7 | 399 | 3 × 3 | Preserve full cells, citations, relationships and page breaks |
| PC-T8 | 549 | 3 × 4 | Preserve full cells, citations, relationships and page breaks |
| PC-T9 | 578 | 3 × 7 | Preserve full cells, citations, relationships and page breaks |
| PC-T10 | 590 | 3 × 7 | Preserve full cells, citations, relationships and page breaks |
| PC-T11 | 660 | 3 × 3 | Preserve full cells, citations, relationships and page breaks |
| PC-T12 | 674 | 3 × 5 | Preserve full cells, citations, relationships and page breaks |
| PC-T13 | 828 | 8 × 7 | Appendix A; eight columns, long definitions; highest width/pagination risk |
| PC-T14 | 854 | 4 × 4 | Appendix B definitions; four text-heavy columns |
| PC-T15 | 877 | 3 × 3 | Preserve full cells, citations, relationships and page breaks |
| PC-T16 | 891 | 2 × 8 | Preserve full cells, citations, relationships and page breaks |

Test every actual table in the complete PDF and narrow-screen HTML. The eight-column appendix may need a reusable wide-table/page treatment selected from evidence. Do not preselect cards for comparison matrices or introduce slug-specific CSS. No corpus-wide table migration is earned.

## 4. Proposed clean projection for grouped owner acceptance

The source is an offline publication manuscript rather than ready Astro frontmatter. All operations below remain proposals until accepted.

1. Extract L1 title and L2 subtitle to shell fields; convert Markdown presentation into text without changing words.
2. Treat L4–8 name/contact/topic/month/version/license as front matter; render accepted minimal PDF identity from shared canonical data. Preserve November 2026 / v4.5 as edition facts, not a fabricated publication day.
3. Retain L10 series/companion statement with its exact wording, once; preserve citations. Retain L14 Abstract through the end of Appendix C (L904), except authorized shell separators.
4. Exclude authored L908–912 biography/contact from the PDF projection and avoid a second authored biography in HTML; keep website's shared AuthorNote/About. This needs express acceptance because the research edition deliberately retained it. Preserve v4.5 research bytes.
5. Map L916 closing edition facts into one compact edition line, without repeating the full closing name/biography. Record exact boundaries/body hash in the eventual ticket.
6. Add Key findings only from a new author-approved, pinned research manuscript revision. Preserve the current v4.5 as history. Re-pin and inspect only the new source delta; do not repeat this full audit.
7. Keep cited Paper A/B version DOIs in references #8/#9 as authored unless the owner/research editor changes them explicitly. They identify exact versions (20531589 and 23068821); concept DOIs are not automatic replacements in citations.
8. Omit unassigned Paper C DOI in local candidates. Label the source edition and candidate status visibly. No published scholarly metadata or canonical PDF claim.

Proposed excerpt (pending author approval):
“Seven candidate conditions connect cybernetics and self-organization, with a proposed M/S/V model and tests across biology, cognition, and AI.”
Proposed description: reuse the manuscript abstract verbatim, excluding Keywords; preserve meaningful formatting as appropriate to the metadata field.
Proposed optional tags derive from the supplied Keywords; no new readerNote or hero image is required.

## 5. Website compatibility findings

### Citation year suffixes — demonstrated implementation gap

Main `src/lib/rehype-citation-links.mjs` extracts only a four-digit year from reference entries, although inline matching accepts a trailing letter. Bham 2026a and 2026b therefore register as the same ambiguous Bham|2026 key and neither suffix resolves.

A small in-memory HAST probe ran the unchanged main plugin with exact Bham 2026a/2026b reference prefixes plus a Wiener 1948 control. Observed: both Bham citations stayed text; Wiener linked to #ref-54. This is a transform-unit demonstration, not an Astro build or complete manuscript link inventory.

Minimum later implementation: preserve reference-year suffixes and test a/b distinct targets, missing/ambiguous keys and ordinary-year regression. Do not rewrite source citations to make the renderer pass. Inventory remaining unlinked citations from the actual rendered manuscript; source footprints alone do not prove links or support.

### License/identity/candidate output

Main global LICENSE remains BY-NC, ArticleMasthead/layout consume it, paper format emits a canonical PDF download/Highwire/MediaObject, and AuthorNote prints under current policy. A direct source import would therefore misstate Paper C's BY license and candidate publication state and duplicate offline identity.

Local specimens need an isolated adapter/projection; persistent implementation needs a reusable explicit edition/artifact/license selection with independently reviewed facts. Do not change the global license to solve one paper's intake.

### Existing PDF builder

Main `scripts/build-research-pdfs.mjs` discovers all papers, loops over them and writes into dist canonical routes. It has no selected-paper candidate output contract. Invoking build:pdfs would regenerate six protected papers and violate S29 even if carry later restored them. Use no all-paper render for this work.

### Trusted commands

Main package scripts include npm run build (facts/semantics/indexing bundle), npm run test:facts and npm run validate:pdfs. Vivliostyle CLI is pinned 11.2.0; PDF.js 6.3.289. Inspect lockfile/runtime at execution. This audit did not install dependencies or run these bundles.

The local specimen adapter must be validated on its own output. Baseline build success cannot prove candidate metadata, findings fidelity or PDF correctness.

## 6. Gate disposition and bounded next action

- **G29-A SOURCE PIN: COMPLETE.** Immutable source, branch HEAD, blob and ancestry verified.
- **Paper C starting-state audit: COMPLETE with unresolved inputs.**
- **First executor ticket: NOT READY.** Required manuscript-owned Key findings are missing; source projection must be explicitly bounded before conversion.
- **Release readiness: NOT assessed/NOT READY.** Date, DOI/deposit plan, exact artifact, hosted evidence and upstream research gate disposition remain open.

Next: one grouped owner/editorial response. Supply author-approved findings in a new pinned research revision and accept/correct the projection in §4. Category/slug/excerpt can be approved in that response; exact publication date and DOI may remain gated to persistent intake/release. The website Planner does not edit research or draft missing findings under this audit.

After that response, perform a focused source-delta check and draft the bounded local HTML/PDF specimen contract. Design choices remain open until rendered evidence; full source-to-claim certification is not silently absorbed into website execution.

## 7. Evidence limits

Read-only repository/source inspection and the isolated in-memory citation probe only. No Astro build, PDF render, browser/viewport inspection, external-link liveness check, source-claim scientific certification, fresh live PDF hashes, candidate artifact, deployment, release or research mutation occurred.

No runtime implementation, validator/fixture change, new executor contract, staging/main push or Zenodo action is authorized by this report. Six historical path/hash pairs remain inherited protected truth; fresh byte verification is deferred to the actual artifact/release gates.

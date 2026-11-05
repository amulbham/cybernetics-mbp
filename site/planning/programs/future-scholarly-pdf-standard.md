# Sprint 29 — Prospective publication and reading standard

Status: DRAFT v0.2 / OWNER DISCUSSION / NOT IMPLEMENTED OR SEALED
Updated: 2026-11-05
Owner: [Sprint 29 contract](../sprints/sprint-29-future-scholarly-pdf-foundation.md)
Baseline: website main fc3cb775aeb104b362426a589d64cbacf9fe9411; Planner 8bb432aa9489b8e96a1917fe6d05894d8d18e9ad before this update.
This file replaces the earlier future-PDF mini-sprint proposal prospectively. Git history preserves that proposal. It owns design choices; the sprint owns sequence and acceptance.

## 1. Decisions and authority

APPROVED DIRECTION means the owner selected the product direction in planning; it is not an executor seal or release authorization.

| ID | Status | Decision |
| --- | --- | --- |
| D1 | APPROVED DIRECTION | Preserve all six legacy published PDFs byte-identically; legacy optimization is a separate later project. |
| D2 | APPROVED DIRECTION | Future PDFs: minimal opening identity with Amul Bham, Systems Researcher and readable linked ORCID; omit generated closing About the Author. Retain website biography and paper-specific declarations. |
| D3 | DIRECTION RECEIVED | Current site and future PDFs move to CC BY 4.0; frozen PDFs and existing Zenodo records retain their recorded licensing. Exact notices/metadata migration await review. |
| D4 | APPROVED DIRECTION | Polish the existing PDF foundation; approve a rendered specimen before applying it forward. Avoid a speculative renderer overhaul. |
| D5 | APPROVED DIRECTION | Improve visual salience of the five primitives and mobile tables; preserve their meanings and authorial content. |
| D6 | APPROVED DIRECTION | Standard findings component should orient readers and provide a concrete reason to continue; it is not a sixth primitive or AI Overview. |
| D7 | APPROVED PROCESS | Separate chat reviews pinned complete sprint package before executor tickets. Develop only evidence-earned tickets afterward. |
| D8 | PARTLY APPROVED | Key findings, required for papers and essays, manuscript-owned, legacy HTML rollout in scope. Placement/look and future-PDF inclusion await examples. |
| D9 | OPEN | Candidate versus published artifact selection, preview URL/link semantics and explicitly permitted revision rendering. |
| D10 | OPEN | Exact minimal masthead optional fields and visual hierarchy; no new biography text needed for PDF. |
| D11 | APPROVED DIRECTION / DRAFTED | Core research-repo authoring reference with primitive one-pagers, findings guidance and examples; align with website grammar. No automatic manuscript migration. |

Decision chronology: the initial list omitted the PDF biography; later discussion proposed keeping it; the latest owner acceptance explicitly returns to the minimal masthead/no closing biography direction. D2 supersedes the interim proposal. Existing runtime still prints the biography until reviewed implementation changes it.

## 2. PDF identity and typography

### Approved identity text
- Author: Amul Bham, normal mixed case, independently extractable as a full name.
- Professional role: Systems Researcher. Not an affiliation or part of citation_author.
- ORCID: https://orcid.org/0009-0009-7660-4031, inherited from main SOCIAL_LINKS.orcid; one source of identity data, no second hardcoded identifier.
- No generated closing biography or repeated closing name/role block. Paper-specific funding, data, conflicts and other authored declarations remain.

### Proposed specimen layout, not final typography
Opening order: title; author name on its own line; role; readable linked ORCID; compact publication metadata. Preserve any legitimate authored subtitle, but compare its placement against title/author recognition.
Optional correspondence: existing email or author website; recommend omitting LinkedIn and geographic location from the minimal PDF masthead. This is a proposed print-only simplification, not deletion of website contact information.
Keep paper DOI/date/license distinguishable from personal identity. Choose exact placement and size using the rendered specimen.
Use the existing Latin Modern print foundation initially. Remove synthetic small caps from the primary byline. Compare title/author hierarchy using official Scholar guidance; numbers from fallback recommendations are design inputs, not universal certification thresholds.
Do not force all body headings smaller merely to satisfy an assumed universal rule. Record which Scholar guidance applies to actual HTML metadata versus PDF parsing.
Keep clean line lengths, complete table content, readable math/figures/references, dependable page breaks and a restrained running head.

### HTML versus PDF
HTML retains shared AUTHOR.bio/AuthorNote and About navigation. A later biography edit must not require changing released PDFs.
The same canonical author identity supplies both projections; projection rules may omit website-only biography/contact fields.
Implementation must reconcile the current AuthorNote.astro and print CSS comments plus PUBLISHING/AGENTS instructions that presently require the biography to print. Preserve historical Sprint 10 records.
No version, affiliation, abstract or declaration may be fabricated for a template.

## 3. Artifact custody and staging

| Artifact class | Intended handling | Open boundary |
| --- | --- | --- |
| Six published historical PDFs | Immutable production path/hash pairs carried into release packages | No replacement authority in S29 |
| Synthetic standard specimen | Disposable, clearly labeled, nonpublication example | Render through actual site PDF path after a sealed specimen ticket |
| Revision candidate | Separate proposed bytes tied to an explicit manuscript revision | Owner/reviewer must settle allowed rendering, labeling and preview links before generation/upload |
| Future new publication | Inherits approved standard | Separate manuscript/date/DOI/byte approval and content release |

A noindex preview is not proof of byte preservation. Verify the actual upload directory and selected artifacts.
Do not expose draft HTML with a historical download while implying they are the same version. Decide whether to show a historical-artifact notice, distinct candidate link, or another reviewed treatment.
The current six-file production guard rejects extra PDFs. Specimen files must not leak into production packaging. Generalizing future publication tooling cannot silently remove the current protection.
Preserve staging-only Chisel article/IWL and history when integrating released changes; no whole staging merge to main.
Prior staging proposal is audit material. Review its changed source, fixture differences and workflow assumptions before accepting any portion.

## 4. DOI and licensing policy
Use concept DOIs for approved work-level identities: Paper A 10.5281/zenodo.20531588; Paper B 10.5281/zenodo.23068820.
Preserve exact-version references when they identify specific artifacts, including Paper A's deliberate archived-v1 Data Availability reference. No blanket DOI substitution.
Desired current HTML/future PDF license: Creative Commons Attribution 4.0 International / CC BY 4.0 / https://creativecommons.org/licenses/by/4.0/.
Inventory footer, mastheads, article/IWL prose, structured data, fixtures, source license documents and intake instructions. Classify current assertions versus quoted/historical provenance before edits.
Historical PDFs and Zenodo records remain unchanged. Specify reader-facing license distinction wherever a current page links a differently licensed archived PDF; do not falsely imply archive relicensing.
Current Article JSON-LD has LICENSE.url and a PDF MediaObject without a separate license field. Decide the truthful representation and validate it; do not add unsupported graph properties merely for completeness.
Acceptance is no incorrect active CC BY-NC assertion, not deletion of factual historical mentions or original publication evidence.

## 5. Findings summary: authoring contract proposal
Owner direction: **Key findings is a standard component for papers AND essays**, authored in the manuscript in amulbham-research. Legacy website HTML adoption is in scope; six historical PDFs stay byte-identical.
Research editorial proposal and trial: [reading components workspace](https://github.com/amulbham/amulbham-research/tree/438ce073fa705f4c58fc0cae283c07e3ce096783/meta/manuscript-authoring). That draft owns editorial detail and five primitive one-pagers; this section owns website adoption/projection decisions. Reconcile the earlier draft authoring guide before promoting one canonical reference.
Proposed source: one controlled `## Key findings` section and 3–5 bullets, usually 60–110 words total. Length is editorial guidance, not a hard failure. Use existing heading/list support as the compatibility starting point; fixed slot/extraction and required validation are not implemented.
Useful overview and honest hook: actual contribution, mechanism/distinction, consequence and material limit as appropriate. Essays summarize arguments; theory does not become experimental proof. Preserve author-approved text and citations; no build-time generation.
Proposed web placement: after masthead/compact metadata and before long body; compare before/after abstract on papers. Essays need no invented abstract. Keep the summary visible by default, readable bullets with restrained border/background, and avoid a repetitive summary/readerNote/abstract stack.
Proposed future PDF: same text after abstract/before introduction (after front matter for essays); light heading/list. Decide inclusion from the actual specimen's usefulness, pagination and title/author/abstract extraction. Web-only remains fallback; this is not a default yet.
Existing findings migrate as one source, never duplicate. Preserve section anchors or deliberate compatibility. Intake must detect missing/empty/duplicate required content without manufacturing prose.
Legacy rollout: pin inventory of all papers/essays, draft and approve summaries, record per-entry holds, apply HTML only through the protected-artifact path. Temporary migration exceptions must be explicit, not indefinite date-based grandfathering.
Three-article documentation trial: Lab Bubble, Frontier Training and Cognition as a Self-Organizing System. Candidate text remains unapproved; Frontier has a claim-strength editorial hold. No live manuscript changes or completed user/visual tests.
NN/G supports concise distinct opening summaries for orientation: https://www.nngroup.com/articles/formatting-long-form-content/. Elsevier supplies a 3–5-bullet precedent but currently describes highlights as online-only: https://www.elsevier.support/publishing/answer/how-do-i-include-highlights-with-my-manuscript. PDF inclusion is our design hypothesis, not a publisher requirement.

## 6. Primitive design brief and one-pager contract
Improve prominence through hierarchy, spacing, label legibility, borders and restrained contrast within the existing design system. Start with Definition, then inspect all five inside real long-form passages.
Do not invent a sixth kind, change meaning, require more primitives per article, or change syntax merely to refresh appearance.
Existing labels already identify kinds; do not assume five unrelated colors/icons improve comprehension. Visual differences should earn their place in review.
Screen and print are distinct treatments of the same semantic content. Screen cards need not become heavy PDF boxes.
Research draft one-pagers now exist at the linked workspace; final versions will contain: purpose, use/avoid conditions, exact existing Markdown syntax, a clearly labeled illustrative example, approved visual treatment, accessibility/anchor requirements and print behavior.

| Kind | Starting editorial purpose | Avoid | Illustrative payload (not approved manuscript text) |
| --- | --- | --- | --- |
| Definition | Fix the meaning of a term needed for the argument | Decorating familiar words or adding new theory | “A candidate artifact is a preview file that has not been approved for publication.” |
| Key idea | Mark a central conceptual turn | Repeating every section heading | “The published artifact and the current page have different update lifecycles.” |
| Evidence | Isolate identifiable support and its limits | Presenting a claim as support for itself | “The release check found all six file hashes unchanged.” Use only in a passage with actual evidence. |
| Counterpoint | Make a material objection or limitation visible | A weak objection included only to dismiss it | “Stacking rows can obscure comparisons across columns.” |
| Implication | State a supported consequence | Introducing an unsupported conclusion | “The preview therefore needs an explicit artifact label.” |

These are one-pager briefs, not finished visual specifications. Reconcile with CONTENT-MODULES.md before finalizing wording.
Review light/dark/system fallback, long/short bodies, citations, lists and adjacent prose; color alone must not convey the kind. Preserve primitive IDs and link targets.

## 7. Table and anchor design brief
Table inventory must include descriptive records, cross-column comparisons, long-cell tables and IWL cases. Choose a treatment per observed shape, with author review when presentation changes interpretation.
Reuse existing responsive-records where suitable: generated from the table AST, one visible screen projection, print table, no duplicate search indexing. Test links and hidden target IDs; current generated records strip IDs, so table-anchor behavior needs explicit inspection.
Comparison matrices must retain useful relationships; do not mandate cards for every table. Tap-to-expand is an option to evaluate, not selected architecture.
Every treatment must preserve cells, labels, keyboard access, focus, reading order and print completeness. Decide acceptable horizontal-scroll exceptions from real evidence.
Anchor scope includes references, section headings beyond h2, primitive IDs and table/cell targets where present. Existing offset only covers h2 under 1100px.
Reproduce the obstruction before fixing it. Test collapsed and expanded sticky TOC, direct fragments, same-page taps, client-side navigation and back/forward. Desktop must not acquire an arbitrary mobile gap.

## 8. Example and approval packet
After separate-chat plan review and prospective implementation seal, produce:
1. One clearly nonpublication specimen PDF through the actual Astro/Vivliostyle path, with source revision and rendering settings recorded.
2. First/last-page previews and a full contact sheet; representative primitive, descriptive-table, comparison-table, figure, references and declarations pages.
3. Extracted title, author, ORCID and sample body/reference text using two independent extractors.
4. Screen examples in real article context: five primitives, table treatments, findings summary and anchor targets at phone/desktop widths in both themes.
5. A short decision sheet showing selected copy, unresolved alternatives and exact acceptance evidence.
Use synthetic source or explicitly approved excerpts; no silent revision of a published manuscript. Do not attach a real DOI to a synthetic paper as though it were registered.
A visual mockup alone cannot establish pipeline behavior. Owner acceptance of the rendered example precedes standard/default adoption.

## 9. Reviewer packet readiness
Not yet ready for final review: D8–D10, corpus/table audit and exact specimen scope remain open.
Before handoff: pin revision; summarize owner decisions and evidence limits; list all affected canonical surfaces; state migration/custody and rollback boundaries; include measurable acceptance and phase dependencies.
Reviewer should identify BLOCKER/REQUIRED/OPTIONAL findings, especially cross-version license/DOI claims, candidate leakage, duplicated authoring sources, grandfathering, mobile semantics and excessive scope.
Reconcile substantive findings once; draft executable tickets only afterward.

## 10. External guidance and evidence limits
- Google Scholar inclusion: https://scholar.google.com/intl/en/scholar/inclusion.html — consulted 2026-11-05 for title/author placement and searchable PDFs; biography not an inclusion requirement. Actual indexing is external and not guaranteed.
- ORCID publication display: https://info.orcid.org/guidelines-on-the-display-of-orcid-ids-in-publications/ and https://info.orcid.org/documentation/integration-guide/orcid-id-display-guidelines/ — consulted 2026-11-05; readable linked identifier alongside the author is the design direction.
- Zenodo versioning: https://zenodo.org/help/versioning — concept DOI resolves latest landing page; version DOI supports exact-artifact citations.
- Zenodo licenses: https://help.zenodo.org/docs/deposit/describe-records/licenses/ — CC BY 4.0 is its default, not its only allowed license.
- S28 Scholar audit and disposition remain qualified observations. Do not relabel Type 3 fonts or historical small caps as demonstrated indexing failures.
No new render, visual inspection, publication or six-live-download proof occurred in this planning update.

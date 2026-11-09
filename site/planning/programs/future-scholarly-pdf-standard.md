# Sprint 29 — Prospective publication and reading standard

Status: DRAFT v0.6 / PLAN REVIEW ACCEPTED / T29.0 DRAFT / NOT IMPLEMENTED OR SEALED
Updated: 2026-11-09
Owner: [Sprint 29 contract](../sprints/sprint-29-future-scholarly-pdf-foundation.md)
Audit baseline: website main fc3cb775aeb104b362426a589d64cbacf9fe9411; staging 3f2b0369169278f6606804dee17749944aee0e32; Planner parent e924a4b89f137afb258a8d32824a3b5e9807f887. The commit containing this file and the review entry point is the package revision.
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
| D7 | APPROVED PROCESS | Separate chat reviews pinned complete sprint package before executor tickets. Bounded specimens may be authorized with placement/PDF decisions open; select defaults after specimen acceptance. Develop only evidence-earned tickets afterward. |
| D8 | PARTLY APPROVED | Key findings, required for papers and essays, manuscript-owned, legacy HTML rollout in scope. Placement/look and future-PDF inclusion await examples. |
| D9 | PROPOSED / OWNER DECISION O2 | Published/candidate selection matrix in §3; local candidates outside deploy output; hosted S29 previews carry only six published PDFs and label Chisel's unpublished HTML. Accept before persistent artifact/hosted work; not a prerequisite for local specimens. |
| D10 | SPECIMEN DECISION | First local specimen uses accepted name/role/ORCID and no closing bio. Optional email/site, hierarchy, fonts and opening order are settled from specimens before adopting defaults. |
| D11 | APPROVED DIRECTION / DRAFTED | Consolidated research MANUSCRIPT-AUTHORING.md entry point, five primitive one-pagers and eight findings examples exist; validate website alignment and reviewed adoption. No automatic manuscript migration. |
| D12 | APPROVED DIRECTION | One-time S29 findings backfill targets all eight current articles, with no planned exclusions. Every future paper/essay supplies findings or is flagged for editorial completion; never silently omit the component. |
| D13 | OWNER DIRECTED / COPY FIXED | Eight summaries at research f17779eff0d47f88bac8d7031df552c9ff000b46 are fixed specimen input. No wording edits or renewed corpus audit in the experiments. |
| D14 | PROPOSED / OWNER DECISION O1 | Exact current-content/archived-release license notices and metadata in §4; retain MIT/assets and acknowledge CC grants are medium-neutral. Accept before live license migration. |
| D15 | REVIEW SCOPE | Bounded local SPIKE/R2 proposed in the specimen brief. Independent plan review precedes its executor ticket; no staging/deployment or production-selector prerequisite. |
| D16 | SPECIMEN DECISION | Table treatment by observed shape; measured anchor behavior; findings before/after abstract and future-PDF inclusion are questions the experiments may answer. |

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

Proposed policy O2; not current renderer behavior. The [bounded source audit](../audits/sprint-29/S29-phase-1-source-audit.md#5-artifact-and-staging-findings) establishes the missing selector and workflow limitations.

### Selection and link matrix

Selection is explicit build/publication intent plus per-work artifact facts, not inferred from branch name, file existence, noindex or format:paper alone.

| HTML state / PDF selection | Reader-facing link | Scholar / structured-data behavior | Allowed location |
| --- | --- | --- | --- |
| Published web article / published artifact | “Download published PDF” at existing canonical PDF path, with archive-edition notice | Published work Highwire stays tied to its approved canonical PDF; Article.license describes current content; encoding describes the selected released artifact and its recorded license | Later S29 production candidate, six legacy files only |
| Candidate HTML / published archive selected | “Download published PDF”; notice explicitly says candidate HTML differs | No candidate citation_pdf_url or encoding implying the archive encodes the candidate. Proposed candidate mode omits scholarly Highwire/Article JSON-LD together rather than mixing published/candidate facts; ordinary generic head/indexing still applies | Local first; separately authorized closed hosted preview later |
| Candidate HTML / candidate artifact selected | “View candidate PDF — not published” | No published citation_pdf_url or PDF encoding; no invented DOI, date or publication status | Explicit local specimen root only in initial S29 scope |
| Specimen fixture / no scholarly artifact | No download, or clearly local design-PDF link | No scholarly publication claim, indexing closed | Local-only test surface |
| Essay or IWL | No scholarly PDF automatically | Preserve current non-paper/IWL boundaries; IWL remains free of JSON-LD | Local or normal HTML as appropriate |

Published HTML can have later website-only findings/design/license updates while linking an archived PDF; the notice must not promise identical text.
If title, author, citeable date or manuscript edition diverges materially, classify it explicitly as candidate/another edition; do not route it through published metadata by accident.

### Exact proposed reader notices

All six linked historical PDFs, on the current article:
> Archived published PDF. This file is unchanged and may omit later website updates. Original release notice: CC BY-NC 4.0.

Add a link to the original-release license deed. Section 4 defines the current-content grant and why “original release” is deliberately used.

Chisel candidate HTML on a future closed preview:
> Unpublished website revision. This preview includes Chisel changes dated 2026-10-28. The published PDF is the archived edition and does not include these changes.

Use the date only while the pinned staging source actually supports it. Do not infer a new version number or publication date.
The archived link may use the same relative canonical path in the preview only after its bytes are verified against the six-file baseline; its href must never resolve to freshly rendered Chisel bytes.

Local candidate PDF:
> Candidate PDF — design experiment, not published. Source revision and rendering settings are recorded with this specimen.

### Artifact facts and validation

Propose one central artifact manifest/resolver, with a published record keyed by entry, explicit release license/edition provenance and a candidate record tied to its exact source revision. It must not add per-IWL/frontmatter licensing fields.
For the six legacy files, existing canonical routing and the independent approved-six-production-pdfs.sha256 fixture own path/hash truth. The resolver references that authority; it must not synthesize a second mutable “approved” baseline from current output or environment variables.
Unverified release-source/edition facts remain marked unknown; use “archived published PDF” rather than inventing a revision/date. Unknown candidate provenance blocks selecting that candidate, not unrelated local design work.
All metadata/download consumers use the same resolved selection; absence is intentional on candidate mode, not a malformed published page.
Proposed published mode installs and verifies approved released bytes; it must never fall back to typesetting because a file is missing or source changed. Candidate mode renders only explicitly selected local entries to the separate specimen root. The current carry script requires preexisting PDF paths, so adoption needs a reviewed real artifact-install/validation path, not a naive skip-typesetting flag or placeholder PDFs. Existing guard/carry code is not silently repurposed in the first local SPIKE.
Published release checks continue to enforce the full six-file fixture, exact manifest, empty PDF_RELEASE, and no extra specimen PDFs.
Archive PDF identity/reference checks must use reviewed release-time facts plus hash proof. Current HTML is validated against its own source. Do not compare candidate reference numbers against old bytes as if they were one edition.
Preserve real PDF reference/relation/link integrity checks; add explicit negative tests for same-number/different-reference mappings. No blanket skip or weakened oracle.
Current publishing-facts checks require an exact encoding shape and no candidate mode, so resolver/layout changes need a reviewed fixture/checker delta with negative tests.

### Staging is a separate work unit

Staging 3f2b036 has unreleased Chisel/IWL changes and freshly typesets PDFs without a staging carry/independent guard.
Preserved proposal 0ac207f imports main's protection but its conditions are still main-only. It is not safe-to-upload evidence.
Before any staging push/upload: selectively reconcile approved released source while preserving Chisel; implement explicit candidate metadata/link behavior; prove closed indexing, all six selected published bytes and no extra PDFs in the exact upload directory, actual target/revision settings and postupload reads.
Do not release Chisel v2 prose/IWL to production as part of this reconciliation. A Chisel publication decision remains separate.
Keep main's independent guard intact. Any future non-six/new-publication path needs separately approved guard evolution; S29 does not pre-authorize it.
The first local specimen uses a disposable output root and a narrow adapter to the existing renderer; it need not implement this resolver or reconcile staging.

## 4. DOI and licensing policy

Use concept DOIs for approved work-level identities: Paper A 10.5281/zenodo.20531588; Paper B 10.5281/zenodo.23068820.
Preserve exact-version references, including Paper A's archived-v1 Data Availability reference. No blanket DOI substitution.

### Proposed grant scope and notices — O1

Current author-owned site publication content and future approved PDFs: Creative Commons Attribution 4.0 International / CC BY 4.0 / https://creativecommons.org/licenses/by/4.0/.
Historical PDF bytes/embedded notices and existing Zenodo records stay unchanged. Existing grants are not revoked.
Creative Commons grants are medium-neutral and nonexclusive: CC BY on shared author-owned material is not limited to reading it in HTML. The old PDF's NC notice is retained original-release provenance, not a claim that identical material newly offered under BY has an exclusive NC restriction.
Owner decision O1 is acknowledgement of that scope and acceptance of these exact notices before migration, not a request to re-approve the already selected CC BY direction.

| Surface | Exact proposed copy / handling |
| --- | --- |
| Footer | “© {year} Amul Bham. Site content is licensed under CC BY 4.0, except where otherwise noted.” Link CC BY; a concise License details link explains code/assets/archives. |
| Current article masthead | “{Paper or Essay} · This HTML edition: CC BY 4.0.” The grant applies to the licensed content, not an exclusive media restriction. |
| IWL chrome | “This IWL edition is licensed under CC BY 4.0.” |
| IWL current body row/closing assertion | Change the current License row and current closing license assertion to linked CC BY 4.0; retain historical provenance in a separate labeled note below. |
| IWL history note | “Original release notice: CC BY-NC 4.0. This web edition is now also offered under CC BY 4.0.” |
| Future PDF masthead/license line | “© Amul Bham. Licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). https://creativecommons.org/licenses/by/4.0/” No invented copyright year or extra license conditions. |
| Archive link notice | Use §3's archived-file notice and original-release license link; do not claim archive bytes or records were relicensed/rewritten. |
| License details | “Amul Bham's current site content is offered under CC BY 4.0, except for material identified as belonging to others or carrying separate terms. Archived PDFs retain their original files and notices. Website code remains under the repository's MIT license; fonts and other third-party assets retain their own licenses.” |

Scope applies to material the author controls. Preserve quotations/citations and separately credited assets; do not relabel another party's work.
Retain root LICENSE's MIT text. Document code/content scope in existing PUBLISHING/AGENTS and a concise reader-facing license-details surface; do not replace software/font license files.
Current body NC assertions are removed/reconciled. **O1 explicitly proposes a narrow exception to the initial “no NC wording on the live site” goal for truthful original-release/history notices and artifact metadata.** It is not yet an accepted exception. Recommended acceptance is no incorrect active NC assertion, while retaining original-release provenance. If the owner requires zero literal NC text outside PDFs, notice wording and truthful archive metadata need an explicit alternative before migration.

### Exact metadata treatment

Published Article/ScholarlyArticle: license is https://creativecommons.org/licenses/by/4.0/.
Its selected archived PDF MediaObject gets its own recorded release license, not the current global constant:

~~~json
{
  "@type": "MediaObject",
  "contentUrl": "<existing approved canonical PDF URL>",
  "encodingFormat": "application/pdf",
  "license": "https://creativecommons.org/licenses/by-nc/4.0/",
  "description": "Archived published PDF. Original release notice: CC BY-NC 4.0."
}
~~~

This describes an applicable original-release license, not an exclusive-rights assertion. Future newly approved PDF artifacts use their actual approved license (CC BY direction) only after artifact approval.
The main publishing-facts fixture records NC/page-one provenance; confirm per-artifact release facts during the implementation's frozen-file validation rather than treating this source audit as fresh text extraction.
Candidate HTML follows §3: do not emit a published encoding or citation_pdf_url for a local candidate; IWL retains no JSON-LD/Highwire/PDF and does not acquire license schema merely for completeness.
Do not invent a Highwire license tag; its relevant publication/PDF identity tags stay truthful.
The builder has no explicit PDF rights/XMP writer. Visible licensing and HTML structured data do not prove PDF machine rights fields exist; inspect real output and report the limit. No XMP retrofit is required for legacy PDFs.

### Required affected checks

Update consts, masthead/footer/IWL source/layout, published artifact resolver, ResearchLayout encoding, publishing-facts fixture/checker/tests and current operating/intake docs in the reviewed implementation.
The independent oracle must carry separately reviewed article and artifact license expectations; never derive expected values from LICENSE/current output.
Test global license wrong, archive license wrong, stale active IWL body assertion, candidate leaking published metadata, and artifact/license disagreement. Reuse existing build/facts/PDF bundles plus these deltas.
Official primary references consulted 2026-11-06: [CC BY deed](https://creativecommons.org/licenses/by/4.0/), [CC FAQ](https://creativecommons.org/faq/) (nonexclusive grants, medium/format and irrevocability), [Schema license](https://schema.org/license), [MediaObject](https://schema.org/MediaObject).

## 5. Findings summary: authoring contract proposal
Owner direction: **Key findings is a standard component for papers AND essays**, authored in the manuscript in amulbham-research. Legacy website HTML adoption is in scope; six historical PDFs stay byte-identical.
Research editorial proposal and trial: [reading components workspace](https://github.com/amulbham/amulbham-research/tree/f17779eff0d47f88bac8d7031df552c9ff000b46/meta/manuscript-authoring). That draft owns editorial detail and five primitive one-pagers; this section owns website adoption/projection decisions. The consolidated MANUSCRIPT-AUTHORING.md is the single guide entry point on that branch; the old draft is provenance.
Proposed source: one controlled `## Key findings` section and 3–5 bullets, usually 60–110 words total. Length is editorial guidance, not a hard failure. Use existing heading/list support as the compatibility starting point; fixed slot/extraction and required validation are not implemented.
Useful overview and honest hook: actual contribution, mechanism/distinction, consequence and material limit as appropriate. Essays summarize arguments; theory does not become experimental proof. Preserve author-approved text and citations; no build-time generation.
Proposed web placement: after masthead/compact metadata and before long body; compare before/after abstract on papers. Essays need no invented abstract. Keep the summary visible by default, readable bullets with restrained border/background, and avoid a repetitive summary/readerNote/abstract stack.
Proposed future PDF: same text after abstract/before introduction (after front matter for essays); light heading/list. Decide inclusion from the actual specimen's usefulness, pagination and title/author/abstract extraction. Web-only remains fallback; this is not a default yet.
Existing findings migrate as one source, never duplicate. Preserve section anchors or deliberate compatibility. Intake must detect missing/empty/duplicate required content without manufacturing prose.
One-time legacy rollout: pinned main inventory contains eight articles, six papers and two essays; only Frontier has an existing findings section. All eight now have a ready four-bullet payload and source-section map. Target all eight in the HTML rollout; no planned deferrals or automatic grandfathering.
The prior Frontier copy hold is resolved by summarizing the published argument faithfully and attributing its claims, with deployment depth/enterprise trust restored. This selects no article-body correction and does not claim a new factual verification of the essay.
Lab Bubble overlap is tightened; Cognition's architectural consequence is prominent and the existing causal limit retained. Five further examples broaden variety. The [specimen brief](../audits/sprint-29/S29-key-findings-specimen-brief.md) covers actual opening configurations.
Future intake receives findings from the finalized research manuscript. If missing, flag the specific manuscript for completion in the normal editorial workflow; do not silently omit the component or generate it at build time. This corpus calibration does not recur for every publication.
Extraction/relocation must preserve the existing section anchor, produce exactly one visible component, and leave no orphan heading or stale TOC entry.
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

[Completed Phase 1 audit](../audits/sprint-29/S29-phase-1-source-audit.md) and [full table inventory](../audits/sprint-29/S29-table-inventory.tsv) own observed evidence: 40 tables, 18 opted into records, seven table fixture cases and seven anchor cases. Source limitations are not fresh browser measurements.
Table inventory must include descriptive records, cross-column comparisons, long-cell tables and IWL cases. Choose a treatment per observed shape, with author review when presentation changes interpretation.
Reuse existing responsive-records where suitable: generated from the table AST, one visible screen projection, print table, no duplicate search indexing. Test links and hidden target IDs; current generated records strip IDs, so table-anchor behavior needs explicit inspection.
Comparison matrices must retain useful relationships; do not mandate cards for every table. Tap-to-expand is an option to evaluate, not selected architecture.
Every treatment must preserve cells, labels, keyboard access, focus, reading order and print completeness. Decide acceptable horizontal-scroll exceptions from real evidence.
Anchor scope includes references, section headings beyond h2, primitive IDs and table/cell targets where present. Existing offset only covers h2 under 1100px.
Reproduce the obstruction before fixing it. Test collapsed and expanded sticky TOC, direct fragments, same-page taps, client-side navigation and back/forward. Desktop must not acquire an arbitrary mobile gap.

## 8. Example and approval packet

The [bounded first-specimen brief](../audits/sprint-29/S29-key-findings-specimen-brief.md) owns the proposed local experiment scope and limits.
After separate-chat plan review and a prospective SPIKE ticket seal, local essay/paper openings and two future-PDF variants may be produced **without first implementing the artifact selector or deploying staging**.
The eight summaries at research f17779eff0d47f88bac8d7031df552c9ff000b46 stay fixed. Exact rendered layout and PDF inclusion are experiment outputs, not preconditions.
Required evidence: in-context mobile/desktop/light/dark examples; primary essay/paper openings; representative primitives/tables/anchors; full paper PDF contact sheet plus first/last-page detail; two text extractors and actual font/figure/reference/pagination checks.
A local adapter may use a disposable copy of built Astro HTML with the existing pinned Vivliostyle CLI and print path. Specimen PDFs must never be written into a deployable dist or canonical published path.
Do not treat passing baseline production validators as proof of modified experimental HTML; identify the projection/adapter delta and inspect its output.
Final default adoption awaits owner acceptance. Hosted staging and production retain their separate artifact/deployment gates in §3.

## 9. Reviewer packet readiness

**Phase 2 independent plan review is complete: READY, 0 BLOCKER / 0 REQUIRED / 0 OPTIONAL at 59d702f8bcc0f1690dfd20a3cc2c9c743ea14dc9.** [Supplied review and disposition](../audits/sprint-29/S29-independent-plan-review.md). [Review entry point](../audits/sprint-29/README.md) links the package at one website commit and pins research copy.
Source inventories, license/metadata/notices and artifact proposal are complete as planning inputs; O1/O2 remain explicit material owner decisions, not missing audit work.
The local first specimen needs accepted experiment scope and a ticket after review. It does not need final typography, opening placement, table treatment or PDF-inclusion decisions.
Reviewer: classify concrete BLOCKER / REQUIRED / OPTIONAL findings; examine custody, licensing scope, candidate semantics, fixed-copy fidelity, table/anchor tests and proportionality.
No corrections were required by the accepted plan review. [T29.0](../tickets/T29.0-local-publication-specimens.md) is now drafted and Planner-checked; owner review/seal precedes execution. O1/O2 remain pending for their dependent work; no production/default-adoption authorization follows.

## 10. External guidance and evidence limits
- Google Scholar inclusion: https://scholar.google.com/intl/en/scholar/inclusion.html — consulted 2026-11-05 for title/author placement and searchable PDFs; biography not an inclusion requirement. Actual indexing is external and not guaranteed.
- ORCID publication display: https://info.orcid.org/guidelines-on-the-display-of-orcid-ids-in-publications/ and https://info.orcid.org/documentation/integration-guide/orcid-id-display-guidelines/ — consulted 2026-11-05; readable linked identifier alongside the author is the design direction.
- Zenodo versioning: https://zenodo.org/help/versioning — concept DOI resolves latest landing page; version DOI supports exact-artifact citations.
- Zenodo licenses: https://help.zenodo.org/docs/deposit/describe-records/licenses/ — CC BY 4.0 is its default, not its only allowed license.
- S28 Scholar audit and disposition remain qualified observations. Do not relabel Type 3 fonts or historical small caps as demonstrated indexing failures.
Phase 1 performed targeted source inspection only. No new render, visual measurement, PDF byte/extraction/live check, publication or external indexing verification occurred. Audit baselines and primary-source consultation are recorded in the source audit and inventory.

# Sprint 29 Phase 1 — bounded source audit

Date: 2026-11-06 (America/Los_Angeles)
Mode: AUDIT · planning only · no implementation or deployment
Result: PHASE 1 SOURCE INPUTS COMPLETE; proposals await independent review/owner decisions.
Main: fc3cb775aeb104b362426a589d64cbacf9fe9411; staging: 3f2b0369169278f6606804dee17749944aee0e32; prior proposal: 0ac207fed57943db17a28dad9f258dc41f7478ce.
Research copy is fixed at f17779eff0d47f88bac8d7031df552c9ff000b46; no research file was changed.
Inherits: site/PLANNING.md and the six-PDF baseline at main above. [Prospective standard](../../programs/future-scholarly-pdf-standard.md) owns proposed decisions/notices; this report owns inspected facts.
[Source inventory](S29-source-inventory.tsv) lists the bounded read set. [Table inventory](S29-table-inventory.tsv) lists every detected authored GFM table with source lines.

## 1. Method and evidence boundary

One targeted source-inspection pass: eight article manuscripts, one published Chisel IWL, relevant transforms/CSS/layouts/schema/build/validator/workflow code, staging Chisel counterparts and prior proposal.
The table scan recognizes pipe-table delimiter lines outside code fences; counts are source inventories, not executed AST/visual/a11y validation. Source lines below refer to header lines.
No browser reproduction, built DOM, local build/test, PDF typesetting/extraction/download, live hash check, Actions-variable read, Cloudflare inspection or Scholar query occurred.
Previously recorded six-PDF/license and Scholar observations retain their provenance. Missing historical report on main was resolved by reading its actual planner/context location; no absent evidence was reconstructed.

## 2. Table inventory and existing mechanisms

| Source | Tables | Responsive-records opt-in | Representative shape |
| --- | ---: | ---: | --- |
| Financial Aid | 12 | 0 | two-column values; 3-column timelines; 5-column protocol registries |
| Cognition | 2 | 0 | 2-column requirements; 3-column failure mapping |
| Frontier | 0 | 0 | negative/no-table control |
| Chisel article (published source) | 4 | 2 | 3-column contrast; 4-column ledger/decision records |
| Desk | 3 | 3 | 4-column, 17-row history; 5-column qualified glossary |
| Invariants | 2 | 0 | 2-column classes; 3-column removal/failure mapping |
| Lab Bubble | 0 | 0 | negative/no-table control |
| Three SOS | 2 | 0 | 4-column cross-system comparison with empty first header |
| Chisel IWL | 15 | 13 | identity rows; ledgers; 5-column claim/dependency records |
| **Total** | **40** | **18** | **25 article + 15 IWL tables** |

Verified implementation:
- rehype-table-wrap.mjs L38–168 wraps unmarked tables in a keyboard-focusable horizontal-scroll container.
- Its opt-in marker generates labeled records from the same AST, checks one header/body, nonempty unique headers, rectangular rows, no spans/nested tables (L70–101).
- global.css L374–426 switches table/records at 1099/1100px; the inactive projection is display:none. Records are search-ignored; print keeps the authored table.
- Cloning strips cell/descendant IDs (plugin L104–108). Current scanned corpus has no raw HTML cell IDs, so this is an adversarial visibility case, not a claimed observed corpus failure.
- astro.config.mjs runs table wrapping before citation linking/heading IDs. Clone/link behavior must be tested in the actual pipeline, including links inside generated records.

Representative experiment cases:

| ID | Pinned main source / line | Purpose and proposed comparison |
| --- | --- | --- |
| T1 | Financial Aid L229, Input / Amount, 2×5 | Test whether a compact value table already fits; compare stronger hierarchy without mandatory cards. |
| T2 | Cognition L157, Condition / AI Failure / What You See, 3×7 | Record-style reading versus keeping the causal mapping legible; retain all explanatory text. |
| T3 | Three SOS L189, 4×7, blank first header | Genuine cross-system matrix. Existing records reject its empty header; do not merely add the opt-in marker. Compare a labeled matrix/controlled expansion; preserve comparisons. |
| T4 | Desk L435, history, 4×17, opted in | Existing long records: inspect page length, repeated labels, citations and scan rhythm. |
| T5 | Desk L481, qualified glossary, 5×4, opted in | Long cells and qualifications; evaluate records against compact table without clipping or deleting limits. |
| T6 | Chisel IWL L209, core claims, 5×10, opted in | Dependency/evidence/epistemic relationships; test readable labels, links and print table. |
| T7 | Synthetic fixture, not an authored table | Duplicate/empty headers, ragged rows, span/nested rejection; linked cell with an ID and active projection visibility. |

The future treatment must be selected by shape. Cards are not automatically suitable for matrices; horizontal scroll is an exception to justify with specimen evidence, not the default success criterion.
No new table grammar is yet earned. An accessible derived “Condition” label for T3 can be proposed explicitly; no silent prose changes.

## 3. Anchor inventory and limitations

All eight articles and the IWL have at least six h2 sections in the source scan, so each meets the current TOC threshold.
- TableOfContents.astro lists h2 only, threshold six; IWL uses the same component.
- ArticleShell.astro L138–166 defers TOC collapse until the clicked TOC link can navigate; L170–268 keeps one h2 current-section observer. It does not offset arbitrary fragments.
- global.css L657–705 makes the mobile details sticky, with a fixed token based on collapsed height. L801–805 applies scroll-margin-top only to .prose h2[id].
- Thus ref-N list items, h3+ headings and primitive-* sections lack this rule. The fixed collapsed-height token does not measure an expanded TOC or enlarged text.
- rehype-references assigns ref-N; citation linking supplies links even when raw Markdown has no manually authored fragment links. Primitive IDs come from optional authored anchors.
- Heading slugs are assigned by the actual pipeline. Resolve actual IDs in the built DOM rather than guessing punctuation/numbered-heading slugs.

| ID | Target / example | Required experiment |
| --- | --- | --- |
| A1 | Generated ref-1 and a late reference on Cognition or Financial Aid | Citation tap and direct fragment load; show complete first line below real sticky obstruction. |
| A2 | Financial Aid h3 “1.11 Protocol Preview”; Cognition h3 “2.1 Conservation” | h3 lacks h2 offset; test native links without adding every subsection to the TOC. |
| A3 | primitive-sycophancy-skips-detection in Cognition | Primitive section target, focus/reading position and direct load. |
| A4 | Existing Key findings anchor on Frontier | Relocation must preserve one target and coherent TOC; no orphan heading or duplicate IDs. |
| A5 | IWL h3 “4A — Core Claims Traced” plus h2 | Shared layout coverage, normal taps and back/forward. |
| A6 | Synthetic ID inside a responsive table cell | Target must be in the visible projection, not merely given scroll margin on a display:none table. |
| A7 | main-content skip target and page without mobile TOC (fixture) | Preserve skip navigation; no blanket gap on every document ID. |

Preferred implementation direction: derive effective offset from the actual visible sticky obstruction, apply it to supported fragment target classes, and preserve native history/navigation. Retain the existing deferred TOC-collapse fix.
A first specimen may compare a shared CSS token with measured-height behavior locally; final implementation must handle expanded/collapsed state and enlarged text without double offsets.
Verify 375/390, 768, 1099/1100 and desktop, light/dark, reduced motion, keyboard, direct hash, same-page taps, Astro navigation and history.
Reported mobile clipping remains USER-OBSERVED; source confirms a coverage gap, not measured pixel clipping in this pass.

## 4. Licensing surfaces

| Surface | Inspected current state | Proposed treatment / authority |
| --- | --- | --- |
| Article HTML and masthead | consts.ts LICENSE is CC BY-NC; ArticleMasthead derives visible link. | Current author-owned publication content to CC BY; exact text in standard §4. |
| Global footer/all page families | Footer imports same constant; affects home, About, indices, search/404 and IWL as well. | Scoped content notice, not a claim relicensing code/fonts/third-party material. |
| Article structured data | ResearchLayout L187 has global license; PDF encoding L214–218 has no own license. | Article CC BY, per-artifact recorded license on PDF MediaObject; independent expected values. |
| IWL chrome | IwlLayout derives LICENSE, emits no JSON-LD/Highwire/PDF. | CC BY chrome; retain semantic silence and no PDF. |
| IWL body | Main L21 License row and L275 closing line hardcode CC BY-NC; staging L21/L279 too. | Reconcile current-document assertions to CC BY; preserve a labeled original-release history note. |
| Future PDF | Built HTML masthead includes license; print stylesheet keeps masthead. No explicit rights/XMP writer in builder. | Visible CC BY standard; machine rights fields remain unverified until real PDF inspection, not assumed from HTML JSON-LD. |
| Six historical PDFs | Frozen path/hash fixture; publishing-facts provenance records CC BY-NC on page one. | Preserve bytes, printed notices and recorded release license; not a fresh per-file extraction claim. |
| Zenodo records | No deposit read or mutation in this pass. | Leave records unchanged; do not infer their state solely from site DOI. |
| Root LICENSE | MIT software/associated-documentation grant. | Retain MIT text; add a clear code/content scope note in an appropriate canonical doc during implementation. |
| Bundled fonts/assets | Existing GUST font notices and other asset-specific rights. | Preserve asset licenses/attributions and third-party exceptions. |

Independent publishing-facts checker L265 and L316 expects both old global license and an exact three-property PDF encoding object. Changing only LICENSE or adding encoding.license fails the independent oracle; update reviewed expectations and mutation tests in the same authorized implementation.
The PDF validator does not itself check a license string. License migration therefore needs focused assertions for visible/body/structured-data surfaces, rather than relying on validate:pdfs alone.
External guidance: Creative Commons BY deed and FAQ state grants are nonexclusive, irrevocable and usable across formats. Preserving an old notice is not a format-only restriction on the same content newly offered under BY. The standard's exact notice distinguishes original artifact record from current grant; owner acknowledgement is required before live migration.

## 5. Artifact and staging findings

- ResearchLayout L84–93 derives one PDF URL for every format:paper and uses it for the download, Highwire and JSON-LD encoding. There is no published/candidate selection.
- build-research-pdfs.mjs L154–189 always discovers/typesets all six papers into normal dist paths; no selection/output mode. Merely skipping typesetting is not compatible with carry-over: carry-over-pdfs.sh L163–164 requires the built PDF path set first.
- Main workflow builds fresh PDFs, carries approved bytes, validates and executes the independent six-PDF guard immediately before Wrangler. Guard requires carry=true, empty PDF_RELEASE and exactly the six approved path/hash pairs; extra specimens are rejected.
- Staging workflow has all-paper typesetting but its carry and independent guard conditions do not protect staging (guard absent there; carry is main-only). A staging push is therefore not a safe specimen action.
- Prior proposal 0ac207f is six commits ahead of staging and its workflow is byte-equal to current main: production guard/carry remain main-only. It is useful reconciliation source, not an accepted safe staging deployment.
- Published Chisel main source dateModified is 2026-10-18; staging is 2026-10-28. The staging IWL adds a reading note and content updates; reference #3 attribution/title differs. Same title/DOI is not proof of the same edition.
- PDF validator L347–359 compares reachable ref-number sets, not the meaning/identity of each referenced source. It also compares current HTML relation links against PDF annotations (L370–382). Equal counts alone cannot establish candidate/PDF correspondence.
- Registry/selector and validators must distinguish release-time artifact facts from a candidate HTML edition. This is a prospective change, not permission to bypass current checks.

[Standard §3](../../programs/future-scholarly-pdf-standard.md#3-artifact-custody-and-staging) owns the proposed selection/link matrix, Chisel behavior, registry and exact notices.
The first local specimen does not depend on solving hosted staging deployment. The later hosted gate must validate its final upload directory, closed indexing, selected bytes, target and revision separately.
Do not promote Chisel's staged prose/IWL to production merely to make the preview coherent.

## 6. Phase 1 outcome and verification limits

Complete: bounded source inventory, representative table/anchor cases, license surface map, exact-notice/metadata proposal, artifact selection proposal, local specimen scope and independent-review entry point.
Pending by design: owner product decisions, independent review, first ticket/seal, actual rendered experiments and all implementation/deployment validation.
No frozen PDF, source manuscript, code, workflow, runtime setting, research copy, deploy branch or closed historical ticket was changed.

# Sprint 29 — Publication Standards and Reading Experience

Status: AUDITING / PLAN REVIEW ACCEPTED / FIRST TICKET DRAFTED — NOT SEALED
Updated: 2026-11-09 (America/Los_Angeles)
Current phase: **3 of 7 — first ticket review and prospective seal**
Next gate: owner review/seal of [T29.0 local specimens](../tickets/T29.0-local-publication-specimens.md); no further Phase 1 audit
Ticket state: **T29.0 DRAFT / Planner pre-seal check complete / owner seal pending**
Risk ceiling: R3
Branch: planner/context for planning; isolated implementation candidates and explicit closed-preview/release gates to be specified after review
Depends on: Sprint 28 CLOSED; released main fc3cb775aeb104b362426a589d64cbacf9fe9411
Unlocks: repeatable future-paper PDF standard and improved website reading experience

## Core question
Can future publications inherit one approved identity, licensing and presentation standard, with useful mobile reading and trustworthy candidate previews, while all six historical production PDFs remain byte-identical?

## Outcome
An author-approved, rendered PDF specimen and website component examples become a tested forward standard. The site receives approved reading/publishing changes; historical PDFs and Zenodo deposits retain their existing bytes and recorded licensing. New research publication is not required for the findings rollout; approved legacy HTML summaries are in scope.

## Inherited truths
- Inherits site/PLANNING.md and site/planning/templates/sprint-contract.md @ 8bb432aa9489b8e96a1917fe6d05894d8d18e9ad; canonical product baseline is main @ fc3cb775aeb104b362426a589d64cbacf9fe9411.
- Sprint 28 CLOSED: ../audits/sprint-28/S28-production-closeout.md at the planning baseline above. Run #136 and its recorded evidence limits remain authoritative historical evidence, not fresh live checks.
- Fresh remote source checks on 2026-11-06: main fc3cb775aeb104b362426a589d64cbacf9fe9411; staging 3f2b0369169278f6606804dee17749944aee0e32; planner/context e924a4b89f137afb258a8d32824a3b5e9807f887 before this package update. Research authoring/copy fixed at f17779eff0d47f88bac8d7031df552c9ff000b46 by owner direction; no research changes in this phase.
- Current six-PDF guard and independently reviewed publishing-facts oracle remain mandatory. No wholesale staging-to-main merge.
- Preserved staging proposal work/t28-staging-reconciliation-candidate @ 0ac207fed57943db17a28dad9f258dc41f7478ce is an input to review, not an accepted implementation.
- Detailed design decisions and open questions have one home: [prospective standard](../programs/future-scholarly-pdf-standard.md). Existing filename retained to preserve inbound links.

## Starting-state audit
This is a publication foundation/reading-experience sprint, not a new-manuscript intake. The pinned inventory now covers all eight current articles (six papers/two essays); eight findings payloads are ready for examples and grouped rollout review.

| Surface | Status | Pinned evidence / minimum action |
| --- | --- | --- |
| Masthead identity | READY baseline / WORK NEEDED print | main ArticleMasthead.astro already uses AUTHOR.role; Systems Researcher is implemented in shared source. Select minimal future-PDF fields and layout. |
| Closing author biography | OWNER DIRECTION APPROVED / WORK NEEDED | Main AuthorNote.astro and print CSS explicitly require printing it. Latest owner direction removes it from future PDFs only; reconcile these active instructions during implementation. |
| PDF typography | WORK NEEDED | print-research.css: 19pt title, 12pt small-caps author, bundled Latin Modern. Polish using a specimen; do not infer broken indexing from typography alone. |
| Primitives | WORK NEEDED | global.css: one shared surface, 6px accent border and small uppercase mono label. Visual audit required; five meanings and syntax preserved. |
| Tables | AUDIT COMPLETE / SPECIMEN NEEDED | Audit complete: 40 authored tables, 18 records opt-ins; T1–T7 cover values, records, matrix, long cells and hidden-ID cases. No new grammar assumed. |
| Findings summary | OWNER DECISIONS / WORK NEEDED | rehype-key-findings.mjs wraps an optional authored heading/list. Owner requires Key findings for papers and essays, manuscript-owned source, and legacy HTML adoption. Placement, migration enforcement and PDF inclusion remain open. |
| Mobile anchors | WORK NEEDED | Audit complete: h2-only fixed collapsed-height offset; A1–A7 define reference/h3/primitive/IWL/hidden-cell/skip experiments. Browser measurements remain specimen evidence. |
| License | DIRECTION RECEIVED / WORK NEEDED | Surface inventory and exact notices/metadata complete in standard §4; active IWL assertions and strict independent oracle identified. O1 before migration. |
| Staging/artifact selection | WORK NEEDED / OWNER DECISION | Selection/link matrix proposed in standard §3 (O2). Staging/proposal 0ac207f still lack staging carry/guard. Local experiments explicitly independent of hosted reconciliation. |
| Scholar | INHERITED AUDIT / TARGETED RECHECK | T28.4/T28.5 disposition: Scholar 0 required, typography/extraction advisory; metadata fixes already shipped in S28. Recheck relevant official guidance, no promised index/ranking changes. |
| Cross-repo authoring | CORE DOCUMENTATION / DRAFTED | Research branch workflow/manuscript-authoring-s29 now has one consolidated MANUSCRIPT-AUTHORING.md entry point, five one-pagers and eight findings examples; website grammar/adoption validation remains. |

Source inspection above is not visual QA, a new build, an accessibility test, or live artifact verification.

## Hypotheses to test
- A minimal first-page identity block and no closing biography produce a cleaner future PDF while retaining discoverable author identity.
- Typography, spacing and label hierarchy can give primitives more prominence within the existing design system.
- Existing responsive-records covers much of the mobile table need; comparison matrices may require another explicitly reviewed treatment.
- A concise author-approved findings slot helps readers orient without duplicating the abstract or readerNote.

## Hard constraints
- Six published PDFs, hashes and established URLs remain unchanged. Legacy optimization and Zenodo edits are separate.
- Candidate rendering never implies publication. The audit must distinguish new synthetic fixtures, explicitly authorized revision previews, and historical published artifacts.
- Latest owner-approved PDF direction: Amul Bham / Systems Researcher / linked readable ORCID in opening identity; omit generated closing biography in future PDF; retain web biography and authored declarations.
- Author controls findings text, manuscript meaning, dates, DOI/version semantics and specimen content. No auto-generated factual summary at build time.
- Separate concept/work DOI from exact-version references; preserve Sprint 28's deliberate archival exceptions.
- No indexing-policy changes, no weakening of independent guards, no accidental Chisel promotion.
- UI changes inherit design-system rules; any material visual-policy amendment must be explicit.
- User requires separate reviewer chat on a pinned sprint package BEFORE executable tickets are developed. This draft and its phase table are not tickets or seals.

## Explicit exclusions
Legacy PDF optimization/replacement; new academic paper/Zenodo release; Keystatic; broad rebranding; renderer replacement without earned separate scope; blanket reference/DOI rewrites; Google indexing guarantees. Paper B Zenodo parity stays a separate Sprint 27 obligation.

## Ticket sequence

### Phase roadmap — single progress index

The phase numbers below describe progression, not pre-created ticket IDs. This table owns sprint progress; design choices stay in the prospective standard.

| Phase | Current status | Work and output | Lead / exit gate |
| --- | --- | --- | --- |
| **1. Complete planning inputs** | **COMPLETE** | Fixed-copy package, consolidated guide, bounded audit/inventories, exact license/artifact proposals and local specimen scope. | Review entry point contains all inputs; O1/O2 and visual questions intentionally explicit. |
| **2. Review the sprint plan** | **COMPLETE** | Owner supplied independent review of 59d702f: READY, 0 BLOCKER / 0 REQUIRED / 0 OPTIONAL. [Review/disposition](../audits/sprint-29/S29-independent-plan-review.md). | Scope accepted for drafting local specimens; O1/O2 remain gated. |
| **3. Draft and seal first earned tickets** | **T29.0 DRAFT — CURRENT** | First local SPIKE/R2 contract drafted from the accepted brief; tracked writes restricted to experiments folder and exact ticket/report. | Planner pre-seal check complete; owner seal precedes Claude Code execution. |
| **4. Build and accept specimens** | NOT STARTED | Use isolated nondeployable output for openings, five primitives, representative T/A cases and two paper PDF variants. No hosted-reconciliation prerequisite. Compare before/after abstract, mobile reading and PDF inclusion using fixed approved wording. | Claude Code executes one sealed ticket at a time; Planner checks evidence; Amul accepts selected examples. Exit: tested design decisions, or explicit rejection/remaining issue. |
| **5. Implement accepted standards and rollout** | NOT STARTED | Draft/seal each next ticket from accepted examples; implement shared rendering/intake, future-PDF defaults, CC BY 4.0, mobile anchors, approved legacy HTML summaries and remaining staging reconciliation. | Claude Code implements; Planner reconciles. Exit: complete candidate and canonical-doc updates ready for integrated validation. Routine within-seal fixes need no new product decision. |
| **6. Validate complete candidate** | NOT STARTED | Verify corpus/mobile/desktop/accessibility behavior, metadata/license/artifact semantics, future-PDF extraction/pagination and six historical PDF hashes in the actual upload package; verify closed preview as authorized. | Planner reviews trusted validator/CI evidence and delta-specific checks. Exit: accepted exact candidate, resolved required findings and owner preview acceptance. |
| **7. Release and close** | NOT STARTED | Separately scoped owner-authorized release, fresh production checks and six live PDF hash matches; reconcile current docs and record actual outcomes/deferrals. | Amul authorizes production; Executor releases; Planner verifies closure. Exit: PRODUCTION VERIFIED then CLOSED when acceptance is satisfied. |

Phase 2 may approve **bounded experiments while leaving final visual placement and PDF inclusion open**. Phase 4 settles those choices. Do not require finished layout decisions to authorize the experiments that determine them.
No implementation, upload or production authority follows from this roadmap. The first local SPIKE uses separate nondeployable output and does not need a production selector/staging integration. Hosted previews retain the separate standard §3 gate.
No full new review is required for routine corrections already covered by the accepted plan. Material scope/risk changes or new BLOCKER/REQUIRED findings return to the applicable gate.

### Workstream map

| Workstream | Already documented / inspected | Remaining work | Phase path |
| --- | --- | --- | --- |
| Future PDF foundation | Minimal identity, no closing biography, concept DOI policy, legacy freeze; current typography and Scholar audit inspected | Pin top/bottom copy and fields; rendered fonts/layout/extraction/Scholar check; decide findings inclusion; adopt future defaults | 1 → 4 → 5 → 6 |
| Five primitives and tables | Guide consolidated; 40-table inventory and T1–T7 complete | Definition-first and shape-specific specimens; all-five/screen/print acceptance | 1 → 4 → 5 → 6 |
| Key findings | All eight article examples and source maps ready; Frontier summary faithful to source; one-time inventory complete | Varied rendered openings, grouped publication-copy review, component/extraction/intake checks and 8/8 HTML migration | 1 → 4 → 5 → 6 |
| CC BY 4.0 | Surface inventory, exact notices and metadata proposal complete | O1; reviewed migration/oracle update; real output checks | 1 → 5 → 6 |
| Mobile anchors | Source inventory and A1–A7 complete | Reproduce measurements; implement and verify actual-obstruction/native-navigation behavior | 1 → 5 → 6 |
| Candidate/published artifacts and staging | Selection/link/Chisel proposal and validator/workflow coupling audited | O2; reviewed resolver/validator work; separately authorized hosted reconciliation | 1 → 3 → 4/5 → 6 |
| Authoring and operating documentation | Research draft guide/trial and website prospective spec committed | Consolidated guide entry point exists; validate website grammar/intake alignment and update current operating docs to accepted behavior | 1 → 5 → 7 |

### One-time migration versus normal future intake

The corpus findings inventory, legacy summary drafting and this eight-article calibration are **one-time Sprint 29 migration work**, not recurring prerequisites for each new article.
After adoption, the research hub supplies author-approved Key findings inside each final manuscript. Website intake checks presence, supported structure and uniqueness and preserves the supplied wording; ordinary editorial approval remains upstream.
Flag any missing summary for editorial completion; no current article has a planned exclusion. A later content revision reopens only its affected entry. Do not recreate a corpus audit for every future publication.

### Phase 1 completion and what remains

- **COMPLETE:** consolidated guide and fixed eight-copy research package at f17779e; no copy edits in this audit.
- **COMPLETE:** table/anchor inventory, representative cases, mechanisms and source-observed limitations.
- **COMPLETE:** license map, exact notices/metadata and explicit O1 proposal.
- **COMPLETE:** published/candidate/Chisel policy, explicit O2 and independent local/hosted boundaries.
- **COMPLETE:** bounded first local specimen scope and [single review entry point](../audits/sprint-29/README.md), source inventories and decision register.
- **REVIEW COMPLETE:** independent plan review of 59d702f is READY, 0/0/0, owner supplied 2026-11-09. No required correction or new Phase 1 audit.
- **CURRENT NEXT GATE:** review/seal T29.0 → local comparisons → owner design acceptance → earned adoption/artifact/rollout tickets → integrated closed preview → separately authorized production and closure.

T29.0 is drafted and Planner-checked; no ticket sealed or executed. Copy readiness is not adoption: all eight pages must receive one component during the later rollout, with no silent exclusion.
Remaining tasks/gates are tracked in the review README and phase roadmap.

### Documentation map and update cadence

| Location | Owns | Updated when |
| --- | --- | --- |
| **This sprint contract** on website planner/context | Full roadmap, current phase, workstream status, dependencies, acceptance | A phase/gate or sprint scope materially changes |
| [Prospective standard](../programs/future-scholarly-pdf-standard.md) | Decision register, design/specimen boundaries and open product choices | A choice is proposed, accepted or rejected |
| [Review entry point and inventories](../audits/sprint-29/README.md) | Complete packet, reviewer instructions, owner decisions and remaining-work tracker | Review handoff/correction milestone |
| [Feedback reconciliation](../audits/sprint-29/S29-planning-feedback-reconciliation.md) | Supplied review findings, dispositions and evidence limits | This feedback receives a substantive correction or disposition |
| [Research authoring workspace](https://github.com/amulbham/amulbham-research/tree/f17779eff0d47f88bac8d7031df552c9ff000b46/meta/manuscript-authoring) on workflow/manuscript-authoring-s29 | Editorial guide, primitive examples, findings trial and upstream wording approvals | Editorial milestone; consolidated entry point now exists |
| [Planner STATE](../../../planner/STATE.md) | Short resume pointer to current gate, approvals and blockers | Meaningful checkpoint; roadmap remains the progress index |
| site/planning/tickets/ and site/planning/audits/sprint-29/ | Future executor contracts, evidence and reconciliations | Only when earned by reviewed plan/predecessor results |
| Existing publishing/design/intake docs and site/ROADMAP.md / CHANGELOG.md | Adopted current behavior and verified history | Accepted implementation/release; prospective drafts do not claim to be shipped |

Amul owns product/editorial decisions, this chat owns planning/reconciliation, the separate chat owns independent review, and Claude Code owns sealed-ticket execution. Planning writes stay off deploy branches.

## Sprint-level acceptance criteria
1. Six protected production PDFs retain exact approved path/hash pairs before upload and in fresh postdeploy checks.
2. Staging preserves unreleased Chisel; published/candidate artifact choice and link/version semantics are explicit, tested and documented.
3. One representative PDF specimen is approved visually and technically; future output inherits it without per-paper styling patches.
4. Future PDF masthead has exact author, role and readable linked ORCID; no generated closing biography; website biography and paper declarations survive.
5. CC BY 4.0 appears on intended current site/future-PDF licensing surfaces; historical artifact license representation remains truthful.
6. All five primitive kinds have approved visual examples and concise one-pagers covering purpose/use/example/screen/print behavior. Existing labels, content and anchors survive.
7. Corpus table inventory maps each supported shape to a readable treatment; mobile and desktop preserve all cells, meaningful comparisons, links and accessible relationships.
8. Key findings is standard for new papers and essays, supplied author-approved in the manuscript. Complete the one-time legacy HTML migration with exactly one component on all eight current article pages; missing future findings are flagged for completion, never silently omitted. Missing/empty/duplicate, extraction/anchor/TOC and migration checks pass. Six frozen PDFs remain unchanged.
9. In-page links across identified target classes land visibly below sticky chrome; desktop and navigation history remain correct.
10. Scholar-related title/author/text/link checks pass for the future specimen; no claim of indexing from a technical PASS.
11. Canonical instructions, tests and authoring documentation agree with shipped behavior. Separate review and owner acceptance complete.

## Validation plan
- Reuse actual package scripts: npm run build, npm run test:facts, npm run validate:pdfs when PDFs are present; inspect artifact/guard harness commands before specifying execution.
- Negative cases: missing/substituted/extra protected artifact; candidate encoded as published; wrong article/archive license or stale IWL assertion; wrong DOI/author; missing/empty/duplicate fixed summary; missing figure; hidden/clipped table; same-number/different-source reference mismatch; duplicate IDs and invisible fragment targets.
- Specimen/rollout visual matrix: 375px and 390px phones, 768px tablet, 1099/1100px breakpoint edges and 1440px desktop; light/dark/system theme, keyboard focus and enlarged text. First local scope is bounded in the specimen brief; integrated rollout covers the full corpus.
- Check direct hash loads, reference taps, TOC taps, primitive links, back/forward and client-side navigation with collapsed/expanded mobile TOC.
- PDF: first/last pages, longest title, all five primitives, descriptive table and comparison matrix, image/caption, references, declarations, page breaks and running head. Two independent text extractors plus raster visual review; no extractability-only claims of visual correctness.
- Production evidence and settings retain provenance labels; source checks are not live checks.

## Stop conditions
Stop on an altered frozen PDF, ambiguous artifact/version/license selection, unapproved manuscript meaning, staging drift, broader renderer work, required guard weakening, or failed acceptance. Resolve actual blockers without silently shrinking acceptance.

## Exit state
Approved forward standard and reading changes are production verified; six old PDFs unchanged; authoring and operating docs reconciled. Historical PDF optimization, Paper B archive parity and optional unearned work remain explicitly separate.

## Canonical documentation targets
PUBLISHING.md; AGENTS.md and existing CLAUDE.md symlink; CONTENT-MODULES.md; design-system docs; manuscript intake contract/content-manager procedure; tests/fixtures; ROADMAP/CHANGELOG. This prospective spec does not overwrite current runtime truth before implementation.

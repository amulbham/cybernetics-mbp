# Sprint 29 — Publication Standards and Reading Experience

Status: AUDITING / DRAFT FOR OWNER DISCUSSION — NOT SEALED
Updated: 2026-11-06 (America/Los_Angeles)
Current phase: **1 of 7 — complete planning inputs and editorial reference**
Next gate: separate-chat review of the complete sprint and bounded specimen plan
Ticket state: **No Sprint 29 executor tickets drafted or sealed**
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
- Fresh remote source checks on 2026-11-06: main fc3cb775aeb104b362426a589d64cbacf9fe9411; staging 3f2b0369169278f6606804dee17749944aee0e32; planner/context d8d903d2a199c6788b987e9c9771f511088cf0ab before this update. Research authoring branch workflow/manuscript-authoring-s29 remains 438ce073fa705f4c58fc0cae283c07e3ce096783.
- Current six-PDF guard and independently reviewed publishing-facts oracle remain mandatory. No wholesale staging-to-main merge.
- Preserved staging proposal work/t28-staging-reconciliation-candidate @ 0ac207fed57943db17a28dad9f258dc41f7478ce is an input to review, not an accepted implementation.
- Detailed design decisions and open questions have one home: [prospective standard](../programs/future-scholarly-pdf-standard.md). Existing filename retained to preserve inbound links.

## Starting-state audit
This is a publication foundation/reading-experience sprint, not a new-manuscript intake. Legacy HTML adoption needs a pinned paper/essay inventory and author-approved summaries before implementation scope freezes.

| Surface | Status | Pinned evidence / minimum action |
| --- | --- | --- |
| Masthead identity | READY baseline / WORK NEEDED print | main ArticleMasthead.astro already uses AUTHOR.role; Systems Researcher is implemented in shared source. Select minimal future-PDF fields and layout. |
| Closing author biography | OWNER DIRECTION APPROVED / WORK NEEDED | Main AuthorNote.astro and print CSS explicitly require printing it. Latest owner direction removes it from future PDFs only; reconcile these active instructions during implementation. |
| PDF typography | WORK NEEDED | print-research.css: 19pt title, 12pt small-caps author, bundled Latin Modern. Polish using a specimen; do not infer broken indexing from typography alone. |
| Primitives | WORK NEEDED | global.css: one shared surface, 6px accent border and small uppercase mono label. Visual audit required; five meanings and syntax preserved. |
| Tables | READY mechanism / WORK NEEDED audit | rehype-table-wrap.mjs already supports opt-in responsive-records from one table AST, screen-only records and printed tables. Inventory actual table shapes before proposing more machinery. |
| Findings summary | OWNER DECISIONS / WORK NEEDED | rehype-key-findings.mjs wraps an optional authored heading/list. Owner requires Key findings for papers and essays, manuscript-owned source, and legacy HTML adoption. Placement, migration enforcement and PDF inclusion remain open. |
| Mobile anchors | WORK NEEDED | global.css offset targets only .prose h2[id] below 1100px. Reference/primitive/other target behavior needs served-page reproduction and a bounded fix. |
| License | DIRECTION RECEIVED / WORK NEEDED | consts.ts currently CC BY-NC 4.0; ResearchLayout emits LICENSE.url for Article and a linked PDF MediaObject. Specify HTML versus historical artifact notices/metadata before migration. |
| Staging/artifact selection | WORK NEEDED / OWNER DECISION | Staging remains divergent with unreleased Chisel v2/IWL. Review preserved proposal and explicit published/candidate mode, URLs and allowed rendering before upload. |
| Scholar | INHERITED AUDIT / TARGETED RECHECK | T28.4/T28.5 disposition: Scholar 0 required, typography/extraction advisory; metadata fixes already shipped in S28. Recheck relevant official guidance, no promised index/ranking changes. |
| Cross-repo authoring | CORE DOCUMENTATION / DRAFTED | Research branch workflow/manuscript-authoring-s29 contains the five primitive one-pagers, Key findings spec and three-article trial. Reconcile predecessor guide before canonical adoption; no bulk manuscript edits. |

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
| **1. Complete planning inputs** | **IN PROGRESS — WE ARE HERE** | Reconcile one editorial guide; refine Lab Bubble/Cognition candidates; bound Frontier hold; finish table/anchor/license/artifact inventory and specimen brief. | Planner prepares; Amul selects material product/editorial choices. Exit: reviewable scope and bounded experiments, with visual choices explicitly open. |
| **2. Review the sprint plan** | PENDING | Separate reviewer chat examines this roadmap, standard, authoring reference, relevant evidence and experiment boundaries. Reconcile BLOCKER/REQUIRED findings once. | Independent reviewer advises; Amul accepts scope. Exit: pinned plan ready for first tickets. Supplied findings feedback is input, not a full-sprint PASS. |
| **3. Draft and seal first earned tickets** | NOT STARTED | Draft only the first bounded artifact-safety or specimen contract justified by Phase 2. Pin surfaces, risk, source/branch lease, permitted experiment choices, validation and deployment boundary. | Planner drafts and pre-seal reviews; Amul seals. Exit: Claude Code has an executable first assignment. Dependent tickets wait for predecessor evidence. |
| **4. Build and accept specimens** | NOT STARTED | Establish needed artifact/preview safety first; render essay and paper openings, five primitives, representative tables and future PDF. Compare before/after abstract, mobile reading and PDF inclusion using fixed approved wording. | Claude Code executes one sealed ticket at a time; Planner checks evidence; Amul accepts selected examples. Exit: tested design decisions, or explicit rejection/remaining issue. |
| **5. Implement accepted standards and rollout** | NOT STARTED | Draft/seal each next ticket from accepted examples; implement shared rendering/intake, future-PDF defaults, CC BY 4.0, mobile anchors, approved legacy HTML summaries and remaining staging reconciliation. | Claude Code implements; Planner reconciles. Exit: complete candidate and canonical-doc updates ready for integrated validation. Routine within-seal fixes need no new product decision. |
| **6. Validate complete candidate** | NOT STARTED | Verify corpus/mobile/desktop/accessibility behavior, metadata/license/artifact semantics, future-PDF extraction/pagination and six historical PDF hashes in the actual upload package; verify closed preview as authorized. | Planner reviews trusted validator/CI evidence and delta-specific checks. Exit: accepted exact candidate, resolved required findings and owner preview acceptance. |
| **7. Release and close** | NOT STARTED | Separately scoped owner-authorized release, fresh production checks and six live PDF hash matches; reconcile current docs and record actual outcomes/deferrals. | Amul authorizes production; Executor releases; Planner verifies closure. Exit: PRODUCTION VERIFIED then CLOSED when acceptance is satisfied. |

Phase 2 may approve **bounded experiments while leaving final visual placement and PDF inclusion open**. Phase 4 settles those choices. Do not require finished layout decisions to authorize the experiments that determine them.
No implementation, preview upload or production authorization follows from this roadmap. Isolated local experiments may precede hosted staging reconciliation when their ticket makes the artifact boundary safe; hosted previews require their own explicitly permitted safe path.
No full new review is required for routine corrections already covered by the accepted plan. Material scope/risk changes or new BLOCKER/REQUIRED findings return to the applicable gate.

### Workstream map

| Workstream | Already documented / inspected | Remaining work | Phase path |
| --- | --- | --- | --- |
| Future PDF foundation | Minimal identity, no closing biography, concept DOI policy, legacy freeze; current typography and Scholar audit inspected | Pin top/bottom copy and fields; rendered fonts/layout/extraction/Scholar check; decide findings inclusion; adopt future defaults | 1 → 4 → 5 → 6 |
| Five primitives and tables | Five draft one-pagers; current shared primitive style and responsive-records mechanism inspected | Reconcile guide; table-shape inventory; Definition-first visual examples; all-five and screen/print acceptance | 1 → 4 → 5 → 6 |
| Key findings | Manuscript-owned section, papers AND essays, three-article editorial trial | Approve two specimen summaries; one-time legacy inventory/wording migration; component/extraction/intake checks; Frontier disposition | 1 → 4 → 5 → 6 |
| CC BY 4.0 | Direction and historical-license distinction documented | Inventory active assertions; truthful HTML/PDF metadata and reader notices; migrate current site/future standard | 1 → 5 → 6 |
| Mobile anchors | Source audit found h2-only offset | Reproduce real reference/other target obstruction; fix and verify sticky TOC, direct fragments, history and desktop | 1 → 5 → 6 |
| Candidate/published artifacts and staging | Divergence, Chisel preservation and previous proposal identified | Choose artifact/link semantics; protect six frozen files; validate safe preview workflow; reconcile selectively | 1 → 3 → 4/5 → 6 |
| Authoring and operating documentation | Research draft guide/trial and website prospective spec committed | One canonical editorial reference; align website grammar/intake and update current operating docs to accepted behavior | 1 → 5 → 7 |

### One-time migration versus normal future intake

The corpus findings inventory, legacy summary drafting and this three-article calibration are **one-time Sprint 29 migration work**, not recurring prerequisites for each new article.
After adoption, the research hub supplies author-approved Key findings inside each final manuscript. Website intake checks presence, supported structure and uniqueness and preserves the supplied wording; ordinary editorial approval remains upstream.
Reopen a legacy entry only if it remains on explicit hold or a later separately requested revision needs it. Do not recreate a corpus audit for every future publication.

### Phase 1 completion checklist and immediate order

1. Reconcile the older authoring draft and new reading-components guide into one proposed canonical reference; retain the trial as examples/review evidence.
2. Refine Lab Bubble's overlapping opening bullets; keep Cognition's architectural consequence prominent and causal limit intact; obtain author-approved fixed wording for design.
3. Record Frontier as a **whole-summary claim-strength hold**. Amul chooses faithful summary of the existing argument, bounded body correction, or explicit rollout deferral. Include deployment depth/enterprise trust when revising. This hold need not delay the two other specimens.
4. Complete the bounded corpus/table/anchor/license inventory and candidate/published artifact proposal; list concrete affected source, metadata and instruction surfaces.
5. Freeze a specimen brief: essay + paper, all five primitives, table shapes, future-only PDF and pass/reject criteria. Propose alternatives; do not preselect the experiment result.
6. Pin the complete package for separate-chat review. Then, and only then, draft the first executor ticket.

A held legacy article is not silently counted as migrated. It must be resolved or prospectively deferred by the owner before closing acceptance for that rollout.

### Documentation map and update cadence

| Location | Owns | Updated when |
| --- | --- | --- |
| **This sprint contract** on website planner/context | Full roadmap, current phase, workstream status, dependencies, acceptance | A phase/gate or sprint scope materially changes |
| [Prospective standard](../programs/future-scholarly-pdf-standard.md) | Decision register, design/specimen boundaries and open product choices | A choice is proposed, accepted or rejected |
| [Feedback reconciliation](../audits/sprint-29/S29-planning-feedback-reconciliation.md) | Supplied review findings, dispositions and evidence limits | This feedback receives a substantive correction or disposition |
| [Research authoring workspace](https://github.com/amulbham/amulbham-research/tree/438ce073fa705f4c58fc0cae283c07e3ce096783/meta/manuscript-authoring) on workflow/manuscript-authoring-s29 | Editorial guide, primitive examples, findings trial and upstream wording approvals | Editorial milestone; reconcile predecessor before standard adoption |
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
8. Key findings is standard for new papers and essays, supplied author-approved in the manuscript. Complete the one-time legacy HTML migration; every inventory entry is adopted or explicitly owner-deferred prospectively, with no unresolved hold counted as done. Missing/empty/duplicate, extraction/anchor/TOC and migration checks pass. Six frozen PDFs remain unchanged.
9. In-page links across identified target classes land visibly below sticky chrome; desktop and navigation history remain correct.
10. Scholar-related title/author/text/link checks pass for the future specimen; no claim of indexing from a technical PASS.
11. Canonical instructions, tests and authoring documentation agree with shipped behavior. Separate review and owner acceptance complete.

## Validation plan
- Reuse actual package scripts: npm run build, npm run test:facts, npm run validate:pdfs when PDFs are present; inspect artifact/guard harness commands before specifying execution.
- Negative cases: missing/substituted/extra protected artifact; candidate served as published; wrong license/DOI/author; missing or duplicate required summary; missing figure; hidden/clipped table content; duplicate IDs and lost reference targets.
- Proposed visual matrix: 375px and 390px phones, 768px tablet, 1099/1100px breakpoint edges and 1440px desktop; light/dark/system theme, keyboard focus and enlarged text. Final matrix follows corpus audit.
- Check direct hash loads, reference taps, TOC taps, primitive links, back/forward and client-side navigation with collapsed/expanded mobile TOC.
- PDF: first/last pages, longest title, all five primitives, descriptive table and comparison matrix, image/caption, references, declarations, page breaks and running head. Two independent text extractors plus raster visual review; no extractability-only claims of visual correctness.
- Production evidence and settings retain provenance labels; source checks are not live checks.

## Stop conditions
Stop on an altered frozen PDF, ambiguous artifact/version/license selection, unapproved manuscript meaning, staging drift, broader renderer work, required guard weakening, or failed acceptance. Resolve actual blockers without silently shrinking acceptance.

## Exit state
Approved forward standard and reading changes are production verified; six old PDFs unchanged; authoring and operating docs reconciled. Historical PDF optimization, Paper B archive parity and optional unearned work remain explicitly separate.

## Canonical documentation targets
PUBLISHING.md; AGENTS.md and existing CLAUDE.md symlink; CONTENT-MODULES.md; design-system docs; manuscript intake contract/content-manager procedure; tests/fixtures; ROADMAP/CHANGELOG. This prospective spec does not overwrite current runtime truth before implementation.

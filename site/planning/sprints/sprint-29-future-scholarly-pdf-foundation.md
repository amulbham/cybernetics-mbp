# Sprint 29 — Publication Standards and Reading Experience

Status: AUDITING / DRAFT FOR OWNER DISCUSSION — NOT SEALED
Risk ceiling: R3
Branch: planner/context for planning; isolated implementation candidates and explicit closed-preview/release gates to be specified after review
Depends on: Sprint 28 CLOSED; released main fc3cb775aeb104b362426a589d64cbacf9fe9411
Unlocks: repeatable future-paper PDF standard and improved website reading experience

## Core question
Can future publications inherit one approved identity, licensing and presentation standard, with useful mobile reading and trustworthy candidate previews, while all six historical production PDFs remain byte-identical?

## Outcome
An author-approved, rendered PDF specimen and website component examples become a tested forward standard. The site receives approved reading/publishing changes; historical PDFs and Zenodo deposits retain their existing bytes and recorded licensing. New research publication is not required except an explicitly selected existing-paper HTML findings pilot.

## Inherited truths
- Inherits site/PLANNING.md and site/planning/templates/sprint-contract.md @ 8bb432aa9489b8e96a1917fe6d05894d8d18e9ad; canonical product baseline is main @ fc3cb775aeb104b362426a589d64cbacf9fe9411.
- Sprint 28 CLOSED: ../audits/sprint-28/S28-production-closeout.md at the planning baseline above. Run #136 and its recorded evidence limits remain authoritative historical evidence, not fresh live checks.
- Fresh remote source checks on 2026-11-05: main fc3cb775; staging 3f2b0369169278f6606804dee17749944aee0e32; planner/context 8bb432aa before this planning update.
- Current six-PDF guard and independently reviewed publishing-facts oracle remain mandatory. No wholesale staging-to-main merge.
- Preserved staging proposal work/t28-staging-reconciliation-candidate @ 0ac207fed57943db17a28dad9f258dc41f7478ce is an input to review, not an accepted implementation.
- Detailed design decisions and open questions have one home: [prospective standard](../programs/future-scholarly-pdf-standard.md). Existing filename retained to preserve inbound links.

## Starting-state audit
This is a publication foundation/reading-experience sprint, not a new-manuscript intake. The eventual live findings pilot needs its own compact content audit before its implementation scope freezes.

| Surface | Status | Pinned evidence / minimum action |
| --- | --- | --- |
| Masthead identity | READY baseline / WORK NEEDED print | main ArticleMasthead.astro already uses AUTHOR.role; Systems Researcher is implemented in shared source. Select minimal future-PDF fields and layout. |
| Closing author biography | OWNER DIRECTION APPROVED / WORK NEEDED | Main AuthorNote.astro and print CSS explicitly require printing it. Latest owner direction removes it from future PDFs only; reconcile these active instructions during implementation. |
| PDF typography | WORK NEEDED | print-research.css: 19pt title, 12pt small-caps author, bundled Latin Modern. Polish using a specimen; do not infer broken indexing from typography alone. |
| Primitives | WORK NEEDED | global.css: one shared surface, 6px accent border and small uppercase mono label. Visual audit required; five meanings and syntax preserved. |
| Tables | READY mechanism / WORK NEEDED audit | rehype-table-wrap.mjs already supports opt-in responsive-records from one table AST, screen-only records and printed tables. Inventory actual table shapes before proposing more machinery. |
| Findings summary | OWNER DECISIONS / WORK NEEDED | rehype-key-findings.mjs wraps an optional authored heading/list. Fixed slot, intake requirement, duplicate handling, adoption policy and selected pilot remain to be settled. |
| Mobile anchors | WORK NEEDED | global.css offset targets only .prose h2[id] below 1100px. Reference/primitive/other target behavior needs served-page reproduction and a bounded fix. |
| License | DIRECTION RECEIVED / WORK NEEDED | consts.ts currently CC BY-NC 4.0; ResearchLayout emits LICENSE.url for Article and a linked PDF MediaObject. Specify HTML versus historical artifact notices/metadata before migration. |
| Staging/artifact selection | WORK NEEDED / OWNER DECISION | Staging remains divergent with unreleased Chisel v2/IWL. Review preserved proposal and explicit published/candidate mode, URLs and allowed rendering before upload. |
| Scholar | INHERITED AUDIT / TARGETED RECHECK | T28.4/T28.5 disposition: Scholar 0 required, typography/extraction advisory; metadata fixes already shipped in S28. Recheck relevant official guidance, no promised index/ranking changes. |
| Cross-repo authoring | OPTIONAL / UNVERIFIED | Website contract alignment required; research-repo alignment only after targeted source discovery and bounded scope. No bulk manuscript migration. |

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
- Author controls findings text, manuscript meaning, dates, DOI/version semantics and selected pilot. No auto-generated factual summary at build time.
- Separate concept/work DOI from exact-version references; preserve Sprint 28's deliberate archival exceptions.
- No indexing-policy changes, no weakening of independent guards, no accidental Chisel promotion.
- UI changes inherit design-system rules; any material visual-policy amendment must be explicit.
- User requires separate reviewer chat on a pinned sprint package BEFORE executable tickets are developed. This draft and its phase table are not tickets or seals.

## Explicit exclusions
Legacy PDF optimization/replacement; legacy corpus summary backfill beyond one selected pilot; new academic paper/Zenodo release; Keystatic; broad rebranding; renderer replacement without earned separate scope; blanket reference/DOI rewrites; Google indexing guarantees. Paper B Zenodo parity stays a separate Sprint 27 obligation.

## Ticket sequence
Provisional phases only; ticket IDs/contracts follow accepted review and predecessor evidence.

| Phase | Mode | Purpose | Depends on | Gate |
| --- | --- | --- | --- | --- |
| Baseline and decisions | AUDIT | Complete corpus/table/anchor and artifact-policy audit; settle decision register | S28 closure | Owner resolves consequential open choices |
| Design and contract | DECISION | Pin exact copy, authoring requirements, candidate policy and specimen brief | Audit | Separate-chat review; reconcile BLOCKER/REQUIRED findings |
| Artifact foundation | IMPLEMENTATION | Reconcile staging and implement approved per-work artifact handling | Reviewed plan + prospective ticket seal | Closed-preview custody/identity proof; no production promotion |
| Presentation specimen | IMPLEMENTATION | Render minimal PDF and in-context primitive/table/summary examples | Approved artifact boundary + sealed scope | Owner accepts actual examples before default adoption |
| Reading/intake rollout | IMPLEMENTATION | Apply accepted treatment, findings intake/pilot, license migration and anchors | Design acceptance + pilot content audit | Local and closed-preview checks pass |
| Consolidated proof | VALIDATION | Run existing bundles plus delta-specific negative and visual checks | Candidate ready | Independent review of exact candidate/evidence |
| Controlled release | RELEASE | Scoped production promotion and canonical documentation | Owner preview acceptance | Exact-candidate production authorization; live verification |

No phase authorizes implementation now. Adjacent work may be combined when risk and acceptance permit; no ceremonial status-only tickets.

## Sprint-level acceptance criteria
1. Six protected production PDFs retain exact approved path/hash pairs before upload and in fresh postdeploy checks.
2. Staging preserves unreleased Chisel; published/candidate artifact choice and link/version semantics are explicit, tested and documented.
3. One representative PDF specimen is approved visually and technically; future output inherits it without per-paper styling patches.
4. Future PDF masthead has exact author, role and readable linked ORCID; no generated closing biography; website biography and paper declarations survive.
5. CC BY 4.0 appears on intended current site/future-PDF licensing surfaces; historical artifact license representation remains truthful.
6. All five primitive kinds have approved visual examples and concise one-pagers covering purpose/use/example/screen/print behavior. Existing labels, content and anchors survive.
7. Corpus table inventory maps each supported shape to a readable treatment; mobile and desktop preserve all cells, meaningful comparisons, links and accessible relationships.
8. Findings component and intake rule are implemented under the approved adoption policy; at least one selected live paper uses author-approved content without a frozen-PDF replacement.
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

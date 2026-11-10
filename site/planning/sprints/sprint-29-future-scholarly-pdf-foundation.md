# Sprint 29 — Paper C forward-publication vertical slice

Status: SOURCE PIN VERIFIED / INTAKE AUDIT COMPLETE WITH OPEN INPUTS / NO ACTIVE EXECUTOR TICKET
Updated: 2026-11-10 (America/Los_Angeles)
Current phase: **1 of 7 — source pin and intake audit**
Next gate: **G29-B SOURCE COMPLETION / PROJECTION** — author-approved Key findings in a new pinned research revision, plus acceptance/correction of the clean projection proposed in the [Paper C source audit](../audits/sprint-29/S29-paper-c-source-intake-audit.md). G29-A source pin is complete.
Risk ceiling: R3
Branch: `planner/context` for planning; later implementation candidates require isolated branches and earned sealed contracts
Depends on: Sprint 28 CLOSED; website `main @ fc3cb775aeb104b362426a589d64cbacf9fe9411`; accepted broad S29 planning package `59d702f8bcc0f1690dfd20a3cc2c9c743ea14dc9`
Unlocks: a reusable forward PDF path proved by the first real Paper C publication, followed only by separately authorized release

## Core question

Can the finalized Paper C / Cybernetics Bridge manuscript become the first real publication through a sound forward HTML/PDF system, while all six existing published PDFs remain byte-identical and every candidate/release transition fails closed?

## Outcome

Sprint 29 now owns one vertical slice: audit the exact final Paper C source, render and accept local HTML/PDF candidates, implement the accepted treatment as a reusable selected-paper path, validate a closed hosted candidate, and publish only after a separate owner release authorization.

The target exit is Paper C production-verified as the seventh protected published artifact. If the exact candidate is not accepted or required publication facts cannot be made truthful, the sprint stops at the relevant gate and records the hold; acceptance is never weakened to manufacture release.

## Rescope and inherited truth

- The broad Phase 1 package at `59d702f8bcc0f1690dfd20a3cc2c9c743ea14dc9` passed independent review READY with **0 BLOCKER / 0 REQUIRED / 0 OPTIONAL**. It remains the immutable program map and evidence base for future work.
- The later draft `T29.0-local-publication-specimens.md` was never sealed or executed. It is superseded by this rescope and is retained only as planning history.
- The source/table/anchor/license/artifact audits remain valid within their recorded evidence limits. Their corpus-wide work is not an active Sprint 29 acceptance obligation.
- Canonical product baseline remains website `main @ fc3cb775aeb104b362426a589d64cbacf9fe9411`; `staging @ 3f2b0369169278f6606804dee17749944aee0e32` contains unrelated unreleased work and is not a merge source.
- The existing independent publishing-facts oracle, six-path upload guard and approved six-PDF fixture remain authoritative. They may be extended through reviewed expectations and negative tests; they may not be bypassed, weakened or derived from output under test.
- Detailed active decisions live in the [Paper C decision register](../programs/future-scholarly-pdf-standard.md). The existing filename is retained for link stability.

## Paper C starting-state audit

The supplied v4.5 pin is verified: manuscript commit `15ac4976e7076dbb88b2c4e6ef5798571051ec3e`, blob `ac81e330834d2586b3c122e99c3fd3f31d0e76b3`; research HEAD `11a8dfab31f9a78f25089113091d93edffacc4e2` is its direct child and preserves that manuscript. [Completed starting-state audit](../audits/sprint-29/S29-paper-c-source-intake-audit.md) owns the source matrix and table cases. Missing Key findings and the remaining clean-projection inputs prevent ticket readiness. The owner has now approved excluding the manuscript biography by explicit validated boundaries and replacing it with a separate slim PDF template; exact template wording/placement await local specimens. The audit covers:

| Input | Audit requirement |
| --- | --- |
| Source identity | Exact research branch, commit, canonical manuscript path, blob/hash and any publication handoff/checkpoint declared authoritative |
| Manuscript structure | Exact title/subtitle, abstract, author-supplied Key findings, headings, primitives, tables, figures/captions, references and declarations |
| Author identity | Minimal opening: Amul Bham; Systems Researcher; readable linked ORCID. Slim templated PDF author note, independently editable website biography; no duplicate authored biography |
| Publication metadata | Intended format/category/slug, description/excerpt, dates, DOI and version semantics; missing values remain missing or owner decisions, never invented |
| Rights | Paper C HTML and future PDF CC BY 4.0 direction, third-party figure/table/source credits and any separate terms |
| Assets | Exact source paths/hashes, dimensions, captions/alt text and render availability |
| Projection risks | Table/figure width, math/fonts, long links, references, page breaks, extraction and other manuscript-specific cases |
| Custody inputs | Candidate naming/output roots, render settings, selected-artifact facts and required release evidence |

The audit compares the exact source with current website intake/PDF capabilities and returns READY or a bounded list of missing owner/source decisions. It does not rewrite the manuscript or generate missing Key findings.

## Hard constraints

- Owner refinement, 2026-11-10: future PDFs retain one slim standardized author note, with wording and placement selected during local specimen review. Its template/copy is independent of website AuthorNote/About; website edits never trigger regeneration of released PDFs. Record the template revision/approved text with the render inputs and freeze it in the accepted artifact.
- Intake recognizes and excludes the manuscript's authored About the Author block from both publication projections using source-specific, explicit validated boundaries. Preserve original research manuscripts/history; ambiguous or duplicate blocks stop the affected projection. The PDF receives its approved slim template and HTML keeps its independently editable website biography. This supersedes the earlier no-closing-PDF-biography direction.

- The six existing production PDF path/hash pairs remain byte-identical throughout local, hosted and production work. They are never regenerated, rewritten or replaced.
- Paper C is a candidate until the Product Authority approves one exact artifact hash and its publication metadata.
- Candidate PDFs stay outside canonical and deployable PDF paths until exact-artifact approval. Local specimens use a separate output root.
- Missing, ambiguous or mismatched published artifacts fail closed. No fallback typesetting may populate a published path.
- Record the final research revision, website baseline, rendering tools/settings and each retained candidate hash.
- No Chisel candidate content, IWL revision or unrelated staging-only work is promoted incidentally. No wholesale staging-to-main merge.
- The accepted implementation must be a reusable selected-paper generation/custody path, not a Paper C selector or stylesheet full of paper-specific patches.
- Paper C uses author-supplied Key findings. Website intake may validate/preserve them but may not manufacture or silently alter them.
- Candidate HTML emits only truthful candidate identity. Published scholarly metadata and canonical PDF claims appear only when their exact selected artifact and release facts are approved.
- Production is a separate owner-authorized release after closed-preview acceptance.

## Explicit exclusions and saved future work

Unless Paper C itself proves a narrow dependency, defer:

- eight-article legacy Key findings rollout;
- corpus-wide primitive redesign and five one-pager adoption;
- forty-table mobile presentation rollout;
- general mobile anchor repairs;
- Chisel/IWL staging reconciliation or publication;
- historical PDF optimization or relicensing;
- site-wide CC BY migration and archive-notice cleanup;
- unrelated reading-experience, CMS or indexing work.

These items remain discoverable in the accepted `59d702f…` program package and the [decision register](../programs/future-scholarly-pdf-standard.md). Deferral is not cancellation or completion.

## Phase roadmap

| Phase | Status | Output and exit gate |
| --- | --- | --- |
| **0. Broad planning evidence** | **COMPLETE / HISTORICAL** | Phase 1 package and independent review at `59d702f…`; useful evidence retained, broad execution scope superseded. |
| **1. Pin and audit Paper C** | **SOURCE VERIFIED / INPUTS OPEN — CURRENT** | G29-A complete; source audit recorded. G29-B requires upstream approved findings/new pin and explicit projection acceptance; metadata/release gates remain proportionate to their dependent phase. |
| **2. Render bounded local candidates** | NOT STARTED | Exact-source HTML opening/full-page and PDF treatment experiments in nondeployable output. Settle identity, typography, Key findings placement/inclusion, CC BY notice and Paper C tables/figures/references/links/extraction/pagination from rendered evidence. Exit: owner selects a treatment; no publication claim. |
| **3. Implement reusable selected-paper path** | NOT STARTED | Apply accepted treatment in shared code and add an explicit selected-paper generation/candidate-output path with no paper-specific styling patch. Extend intake/facts checks as earned. Exit: passing local implementation and a newly generated exact Paper C release candidate. |
| **4. Approve artifact and custody semantics** | NOT STARTED | Validate exact candidate bytes, metadata and render manifest; implement minimum candidate/published resolver/install semantics and negative tests. Exit: owner approves one exact hash and release facts; missing/mismatch/fallback cases fail closed. |
| **5. Validate closed hosted candidate** | NOT STARTED | Prepare a selective closed-indexing hosted candidate from the accepted tree without absorbing staging-only work; prove six frozen PDFs plus isolated Paper C candidate behavior. Exit: preview evidence and owner acceptance. |
| **6. Release Paper C** | NOT STARTED | Separate exact-tree Product Authority GO; selective production promotion; approved Paper C bytes installed at canonical seventh path; reviewed guard/facts expectations updated. Exit: deployment succeeds and fresh production checks pass. |
| **7. Close and hand off deferrals** | NOT STARTED | Verify six old path/hash pairs unchanged, seventh path/hash exact, live HTML/PDF/metadata/links correct, canonical docs reconciled and future work carried forward. Exit: PRODUCTION VERIFIED then CLOSED. |

Phase numbers describe gates, not pre-created ticket IDs. Tickets are drafted only after the predecessor evidence determines their exact scope.

## Evidence-earned ticket strategy

- No active executor ticket exists at this checkpoint.
- After the source audit is accepted, draft the smallest local specimen/intake contract justified by the real manuscript. Do not reuse the superseded Cognition contract by substitution.
- Decide after local evidence whether reusable generation and custody fit one R3 implementation ticket or require separate contracts.
- Hosted validation and production release remain separate exact-candidate gates even if prior phases pass.
- No downstream ticket file is created before the preceding evidence closes.

## Sprint-level acceptance criteria

1. The exact final Paper C research revision and all consumed assets are pinned and reproducibly inventoried.
2. Paper C HTML/PDF preserve the author-approved manuscript, Key findings, figures, tables, references and declarations without fabricated content.
3. The approved future PDF treatment contains the minimal opening identity (Amul Bham, Systems Researcher, readable linked ORCID) and one slim templated author note with owner-approved wording/fields/placement. The PDF note is independent of the editable website AuthorNote/About and frozen with the artifact. Intake excludes authored biography only through explicit validated boundaries, preserves research originals and rejects ambiguous boundaries/duplicates. DOI/version/date/license claims are truthful.
4. The accepted treatment is implemented through a reusable selected-paper generation path and shared print rules, with no Paper C-specific visual patch.
5. Candidate bytes never enter canonical/deployable published paths before exact approval; unsafe destinations and ambiguous selection fail before writes.
6. The selected published-artifact mechanism never falls back to fresh typesetting when approved bytes are missing or mismatched.
7. Existing facts/PDF validation is extended through human-reviewed expectations and negative tests; no oracle bypass or self-derived approval baseline is introduced.
8. Closed hosted validation proves indexing closed, source/tree identity, candidate labeling/metadata truth and no incidental Chisel/IWL/staging promotion.
9. Production occurs only after a separate owner exact-tree/artifact authorization.
10. Postrelease evidence shows all six existing production PDF path/hash pairs byte-identical and Paper C's approved PDF at the seventh protected path with its exact hash.
11. Current publishing/planning documentation reflects actual shipped behavior, while deferred broad work remains explicitly open.

## Validation plan

- Reuse current trusted website build, facts, semantics, indexing and PDF validation bundles after inspecting their actual package wiring at the pinned baseline.
- Local render evidence: mobile/desktop HTML, full PDF raster review, font inventory, two independent text extractors, links/annotations, figures/tables, references, declarations, pagination and clipping.
- Fidelity: exact manuscript/source map, normalized extraction comparison where lawful, asset hashes, Key findings uniqueness and no generated prose.
- Custody negatives: missing candidate, wrong hash, wrong source revision, unsafe output path, extra/substituted legacy PDF, candidate labeled published and attempted fallback generation.
- Hosted candidate: closed indexing, exact commit/directory digest, approved candidate hash, six legacy hashes in the actual upload directory and no unrelated staging content.
- Production: existing preupload guard plus reviewed seven-artifact expectation, selective diff, successful CI/deploy, fresh live HTML/metadata checks and fresh downloads of all seven PDFs.
- Scholar-oriented checks cover technical title/author/searchable-text/link requirements only; no indexing or ranking guarantee.

## Stop conditions

Stop the affected phase for an unpinned/moving research source, missing author-supplied Key findings, unresolved DOI/date/version/license ownership, inaccessible required asset, manuscript-changing intake need, paper-specific implementation pressure, candidate output escaping isolation, validator weakening, branch drift, incidental staging content, legacy PDF mismatch or missing owner authority.

Record the exact blocker. Do not solve it by inventing content, broadening the sprint, regenerating a protected PDF or weakening acceptance.

## Exit state

Sprint 29 closes only after Paper C is production-verified as the seventh protected artifact and all six earlier path/hash pairs are freshly confirmed unchanged. If the owner withholds artifact or release approval, record the exact accepted local/hosted state and leave the sprint HOLD/BLOCKED rather than calling it released.

## Canonical documentation targets

| Surface | Update when |
| --- | --- |
| This sprint contract | Scope, phase or gate changes |
| [Decision register](../programs/future-scholarly-pdf-standard.md) | Paper C-specific product/custody decisions and rendered-evidence selections |
| [Review entry point](../audits/sprint-29/README.md) | Audit/review handoffs and current gate |
| [Paper C source audit](../audits/sprint-29/S29-paper-c-source-intake-audit.md) | Completed source matrix; update only for changed inputs or focused dispositions |
| Planner STATE | Every meaningful resume checkpoint |
| PUBLISHING / AGENTS / validators / fixtures | Only after accepted implementation or release makes current behavior true |
| CHANGELOG / ROADMAP | At verified release/closure, not during prospective planning |

# Sprint 29 — independent planning review

Status: PHASE 1 COMPLETE · PHASE 2 READY FOR REVIEW · no executor ticket/seal
Date: 2026-11-06 (America/Los_Angeles)
Intent: independently review the complete publication-standards/reading-experience plan before ticket development.
**Pin the website commit that contains this entry point.** All relative links below belong to that one review snapshot; do not substitute moving main/staging/branch HEADs while reviewing.
Website parent audited: e924a4b89f137afb258a8d32824a3b5e9807f887. Final review commit is supplied in the handoff URL; a file does not embed its own commit hash.
Research authoring/copy input is fixed separately at **f17779eff0d47f88bac8d7031df552c9ff000b46**. No research changes in this phase.

## Read in order

| Document at this website review commit | Owns |
| --- | --- |
| [Sprint roadmap](../../sprints/sprint-29-future-scholarly-pdf-foundation.md) | Whole sprint scope, completed Phase 1, phase/gate sequence, acceptance and remaining work |
| [Prospective standard and decision register](../../programs/future-scholarly-pdf-standard.md) | Approved directions, O1/O2 proposals, exact notices/metadata and artifact-selection matrix |
| [Bounded Phase 1 source audit](S29-phase-1-source-audit.md) | Evidence, observed mechanisms/limitations, representative cases and evidence limits |
| [Source inventory](S29-source-inventory.tsv) | Exact inspected source revisions and bounded read set |
| [Table inventory](S29-table-inventory.tsv) | All 40 detected authored tables, lines, shapes and existing opt-ins |
| [First local specimen brief](S29-key-findings-specimen-brief.md) | Proposed SPIKE/R2 boundaries, fixed content, allowed experiments and output/stop criteria |
| [Earlier feedback reconciliation](S29-planning-feedback-reconciliation.md) | Why summary copy/guide questions are resolved; historical review provenance |

Pinned research package, same commit for each:
- [Consolidated authoring guide](https://github.com/amulbham/amulbham-research/blob/f17779eff0d47f88bac8d7031df552c9ff000b46/MANUSCRIPT-AUTHORING.md).
- [Five primitive one-pagers / findings reference](https://github.com/amulbham/amulbham-research/blob/f17779eff0d47f88bac8d7031df552c9ff000b46/meta/manuscript-authoring/v0.1_Reading_Components_Guide.md).
- [Eight fixed findings payloads and source maps](https://github.com/amulbham/amulbham-research/blob/f17779eff0d47f88bac8d7031df552c9ff000b46/meta/manuscript-authoring/v0.2_Key_Findings_Corpus_Examples.md).
Do not reopen or rewrite that fixed copy as part of a layout review. Flag a demonstrated integrity issue if one exists, without inventing a new editorial pass.

## Review request

Use BLOCKER / REQUIRED / OPTIONAL for concrete defects in this plan. Identify path/section, consequence, smallest necessary correction and the gate it affects.
Return:
1. Overall READY / NOT READY for developing the first bounded local specimen ticket.
2. Findings by class; do not invent a finding to fill a class.
3. Whether local specimens are correctly independent of hosted staging reconciliation.
4. Whether licensing/current-vs-archived metadata and candidate selection are coherent.
5. The material owner decisions still required before the specific implementation they affect.

Inspect especially:
- All six historical PDF paths/hashes remain frozen; no local specimen can leak into deploy output.
- Staging still lacks staging-safe carry/guard; proposal 0ac207f is not a safe-hosted-preview result.
- Candidate HTML must not claim its published archive is the candidate PDF; preserve unreleased Chisel and truthful citations/edition labels.
- Original artifact license record differs from the current BY grant; CC grants are not format-limited; code/fonts/third-party rights retain scope.
- Independent publishing-facts/PDF validators need explicit, reviewed changes for the new encoding/selection semantics; no blanket skip or self-derived oracle.
- Table matrix/empty-header and hidden-ID cases; references/h3/primitive offsets; actual visible sticky height and native history.
- Scope is sufficient but bounded: fixed copy, two primary openings, six fragments, representative components, one paper/two PDF variants; no production adoption or deployment under the experiment.

This is a source/planning review. No new render/build/test/live hash/Scholar proof is claimed. The source audit's facts and the prospective standard's proposals have different authority.
Do not require final fonts, summary placement, table layout or PDF inclusion to authorize the experiments that will decide them.
This package does not request immediate implementation or production GO.

## Material owner decisions

| ID | Proposed decision | Needed before |
| --- | --- | --- |
| O1 | Accept §4's precise license scope/notices: current controlled content CC BY; archive notices remain original release history; medium-neutral grants; code MIT/assets preserved; IWL assertions reconciled. Approve the narrow historical/archive-notice exception to the initial no-NC-wording goal. | Persistent license/metadata migration and its release, not a labeled local experiment |
| O2 | Accept §3's published/candidate model: published canonical bytes default, explicitly labeled archived links on Chisel candidate HTML, no candidate scholarly publication claim, local-only candidate PDFs initially, six published PDFs in later hosted preview. | Persistent artifact/candidate implementation and hosted staging push/upload |

Already fixed: all eight article summaries, required current/future web coverage, Systems Researcher/minimal identity/no closing PDF bio, frozen legacy PDFs and separate review before tickets.
After specimens: owner selects visual hierarchy/contact fields, findings placement/PDF inclusion and table/anchor treatment. These are experiment outputs, not unanswered Phase 1 audit tasks.

## What remains after this review

| Work | Status / next gate |
| --- | --- |
| Independent review | **CURRENT NEXT ACTION** — obtain report on this exact snapshot |
| Reconciliation and O1/O2 | Correct BLOCKER/REQUIRED once; record owner choices before their dependent work |
| First executor ticket | Not drafted; only after accepted review; local SPIKE scope from brief |
| Rendered specimens | Not built; local comparisons then owner selection |
| Production adoption/rollout tickets | Earned from specimen/predecessor outcomes, not pre-created |
| Artifact handling + hosted staging reconciliation | Not implemented; separate gate; protect Chisel and six archived files |
| Website changes | Primitives/tables, findings extractor/intake, CC BY/notices, future PDF defaults and anchors pending |
| Legacy findings rollout | Eight content payloads ready; **0/8 newly adopted through S29 implementation** so far; Frontier's preexisting section is not counted as new rollout proof |
| Integrated validation | Pending actual candidate, closed preview, targeted negative tests and six-file custody proof |
| Production and closure | Separate owner authorization, fresh live checks, canonical docs and six PDF hashes |

Reviewer delivery is through the owner/separate chat. No outbound messages, delegated agents or external review request has been sent.

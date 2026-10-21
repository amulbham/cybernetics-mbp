# Sprint 25 — optimization inventory

Captured: 2026-10-21. Status: planning inventory; not an audit completion or authorized implementation queue.
Sources: [Oct 18 sweep](../../../../planner/audits/2026-10-18-publishing-flow-doc-sweep.md), [T24 checkpoint](../../../../planner/checkpoints/2026-10-20-t24-release-workflow-next.md), and [current planning decisions](../../../../planner/checkpoints/2026-10-21-sprint-25-planning-model.md).
Main inspected in this planning session: 9697dbc7310c480d4b6349104e9504107e4341a2. Prior audit line references retain their original revision.
Evidence labels: VERIFIED = source/evidence inspected; OBSERVED = session/report friction; RECHECK = earlier finding needing current reconciliation; APPROVED DIRECTION = owner choice, not implemented behavior.

## Issues and candidate responses
| ID | Issue / evidence boundary | Candidate response | Proposed disposition |
|---|---|---|---|
| P01 | VERIFIED: old HANDOFF release snapshot and current STATE disagree | Stable orientation, explicit branch precedence, less volatile duplication | Continuity package |
| P02 | OBSERVED: fresh chats reconstruct context; STATE can lag decisions | Short resume path and milestone update rules | Continuity package |
| P03 | OBSERVED: overlapping ticket/evidence/roadmap/changelog/handoff updates | One owner per fact, references elsewhere | Documentation package |
| P04 | VERIFIED: main ROADMAP still calls T23/T24 production pending | Factual current-state correction and appended verified history | Approved future reconciliation |
| P05 | OBSERVED: Executor's anonymous GitHub reads fail; Planner's authenticated connector succeeds | Demonstrate the chosen Executor evidence access, not assume connector transfer | Release handoff |
| P06 | OBSERVED: Chisel run #122 first attempt failed on old manifest; guard protected production | Actual preflight and exact candidate/artifact/manifest release packet | Audit first |
| P07 | OBSERVED: repeated checks and reports mix local/staging/live assertions | Evidence ownership by layer; reuse trusted assertions | Release handoff |
| P08 | OBSERVED: table correction escaped authorized validator paths | Inspect likely dependencies before seal; retain scope boundary | Ticket preparation |
| P09 | OBSERVED: shell quoting failures, report trimming and status commits add friction | File-based edits and concise reports; avoid evidence-only deploys | Operator guidance |
| P10 | OBSERVED: roughly two hours reported for Chisel update, no phase timing | Capture coarse handoff/effort baseline; do not invent savings | Audit first |
| P11 | OBSERVED: frontmatter, reference labels, quote boundaries and companion fields need normalization | Portable final-manuscript contract and mechanical intake | Manuscript package |
| P12 | APPROVED DIRECTION: prose agent + owner choose primitive wording, placement and emphasis | Remove upload-time editorial selection; zero primitives is valid | Manuscript package |
| P13 | VERIFIED: current content-manager skill still permits primitive selection when absent | Explicitly reconcile that instruction after contract approval | Manuscript package |
| P14 | VERIFIED: primitive renderer accepts five kinds; unknown labels fall through; empty label can collide with pull quote | Specify validation against real grammar and authored intent | Validation scope to earn |
| P15 | OBSERVED: existing/new entry and paper/essay/memo/IWL-only cases differ | Two concise runbooks with case distinctions | Publishing package |
| P16 | OBSERVED: staging pushes change PDF bytes; accepted artifact needs custody | Final artifact acceptance/freeze boundary and durable reference | Publishing/release package |
| P17 | APPROVED DIRECTION: Chisel external deposit/DOI checking belongs to owner | Explicit external handoff; no duplicate deposit verification | Publishing package |
| P18 | RECHECK: shared AUTHOR.bio prints in PDFs | Decide current-web versus historical-PDF semantics before author edits | Separate owner decision |
| T01 | VERIFIED main carry-over-pdfs.sh: EXPECTED_COUNT=5 | Exact corpus-derived inventory or other explicit extension | Technical follow-up, not automatic Sprint 25 work |
| T02 | VERIFIED same script: production HTTP 200 required before frozen fallback | Approved new-path bootstrap with unrelated missing files failing | Technical follow-up |
| T03 | VERIFIED same script: Desk pinned Zenodo branch excludes generic frozen replacement | Generalize only under a separate artifact-release contract | Technical follow-up |
| T04 | RECHECK: table validation pins Desk/Chisel fixtures | Preserve generic integrity while reducing per-paper code edits | Audit and risk assessment |
| T05 | RECHECK: CI builds all PDFs before carry-over replaces them | Selective generation/artifact reuse if measured benefit warrants it | Deferred optimization |
| T06 | RECHECK: FormattedDate uses host timezone; generated PDF bytes differ across builds | UTC convention today; separately scoped date/reproducibility work | Follow-up |
| C01 | APPROVED DIRECTION: durable sprint plan plus attributed exact-revision reviews | Use existing sprints/tickets/audits folders with role-specific entry points | Sprint 25 pilot |
| C02 | APPROVED DIRECTION: portable SPM continuity across chats/models | State + relevant checkpoint/assets + current-source checks; coherent writes | Sprint 25 pilot |

## Preserve
Prospective seals, risk-proportional review, staging acceptance, explicit production authorization, PDF preservation, indexing boundaries and immutable historical meaning.
Existing CI guard/carry/live verification worked in run #126; operator friction is not evidence that these protections should be removed.

## Audit output
T25.0 should give each issue a current disposition: confirmed / resolved / unsupported — needs capture / deferred, with available inspected evidence and explicit gaps. OBSERVED items need not become verified baselines or contract requirements.
Group adjacent low-risk corrections; separate deployment/publication mechanisms with independent risk.
Do not recreate the earlier sweep or turn every inventory row into a ticket.

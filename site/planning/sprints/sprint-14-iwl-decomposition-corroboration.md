# Sprint 14 — IWL Decomposition & Corroboration

Status: CLOSED
Risk ceiling: R3 (private development evidence and public-claim correction risk)
Branch: `staging`
Depends on: Sprint 13 CLOSED. Production behavior verified at `ca67561`. Closed repo state `fbe9389`.
Unlocks: observed structure and pressure cases for Sprint 15 to assess. Not an IWL schema.
Inherits: `planning/sprints/sprint-13-iwl-foundation.md` @ `fbe9389`; `planning/programs/research-object-arc-13-17.md` @ `fbe9389` (direction; Sprint 13 gate and Sprint 14 exit reconciled in the activation commit); public Chisel Article/IWL @ `fbe9389`

## Core question

What semantic structure can be observed when the authored Chisel IWL is compared with the development evidence it claims to represent? How faithfully does the public IWL project the inspectable history?

## Outcome

A traceable comparison of the authored IWL with authorized primary development evidence. Identify observed semantic units and overlapping editorial views. Distinguish artifact-observable changes, retrospective rationale, and authorial accountability. Preserve omissions, compression, contradiction, and ambiguous cases. Record candidate grammar pressure for Sprint 15 without freezing a schema. The IWL is the authored account under examination, never its own corroboration.

## Inherited truths

- Sprint 13 published one Article/IWL pair. Inner grammar is still opaque Markdown. The four surfaces are not schema.
- `ca67561` is the production-verified behavior. `fbe9389` is the later docs-only closure and the repo HEAD this sprint starts from.
- The published Markdown and the hash-matched v6 / IWL v2 fixtures are the authored baseline. They show publication and transcription. They do not prove earlier development events.
- Discovery Context is an authorial account. A draft diff shows what changed. It does not show why.
- Raw chats, model transcripts, and hidden reasoning stay out of scope unless a later authorization says otherwise.

## Hypotheses to test

- The four layers behave as overlapping editorial views over shared material, for this fixture, rather than as four object types.
- Where earlier drafts exist, observable changes can be separated from the author's reason for them. Where they do not, the claim stays unresolved.

## Hard constraints

- Amul designated the artifact categories and the private output location before content inspection. Missing files stay gaps. No substitute source.
- Statement kind and evidence result stay separate working labels. They are not product enums. No numeric confidence scores.
- An apparent omission is an omission from the reviewed evidence until coverage is enough to say more.
- A materially false public claim stops the sprint for a separately authorized correction before that claim is used as an architectural example.
- Private sources and reconstructive extracts stay out of the public repository.

## Explicit exclusions

- Raw chats, model transcripts, hidden reasoning, and files outside the designated set (`ChiselFallacy_v7.pdf` is present and not authorized).
- Edits to the public IWL or Article. Schema, validators, graph UI, CMS, routes, indexing, or an IWL PDF.
- Drafting `T14.1` or any later ticket before `T14.0` reports what the next question is.
- Treating publication, or the publication fixtures, as independent proof of pre-publication history.

## Ticket sequence

| Ticket | Mode | Purpose | Depends on | Gate |
|---|---|---|---|---|
| `T14.0` | AUDIT | Inventory authorized evidence, map IWL records, deeply check a varied subset, record view overlap and pressure cases | Sprint 13 CLOSED | CLOSED. Four private outputs plus the completion report. No runtime diff |
| `T14.1` | AUDIT | Map published occurrences separately from provisional shared episodes, using the published IWL and T14.0's outputs only | T14.0 CLOSED | CLOSED. Three private outputs plus this ticket's report. No new sources. No runtime diff |
| `T14.2` | RELEASE | Confirm the five exit conditions, close the records, fast-forward the docs to `main` | T14.0 and T14.1 CLOSED at `b55f69c` | CLOSED. Documentation only. Sprint 15 not drafted |

`T14.0` reported its coverage. Amul then directed that missing paper versions stay gaps. `T14.1` mapped the published fixture. `T14.2` closed the sprint. Numbering does not authorize a Sprint 15 ticket.

## Sprint-level acceptance criteria

- Meaningful IWL records are mapped, with source coverage and unexamined rows explicit. Contradictions are recorded, not harmonized.
- The four layers are assessed as editorial views versus underlying objects for this fixture only, with examples and counterexamples.
- Retrospective rationale, authorial testimony, observable draft changes, and reconstructed relationships stay distinguishable.
- No inner grammar or public machine semantics is frozen.

## Validation plan

- `T14.0` verifies source hashes, the private directory's Git boundary, and the public diff path list. Accepted R3 exception: no `npm run build` and no staging check, because the risk is private-evidence handling and the public diff is planning plus `ROADMAP.md` only.
- A diff that touches `src/`, `public/`, `scripts/`, or a workflow file stops the ticket.

## Stop conditions

Stop and return to Amul if source access would exceed the designated set, raw chats become necessary, a required source or boundary is ambiguous, sensitive material would enter Git, the live IWL needs a public correction, or audit labels are being turned into schema.

## Exit state — achieved

- The Chisel comparison exists, with honest gaps. `T14.0` inventory, matrix, decomposition, and pressure log; `T14.1` occurrence and episode maps.
- Private chronology stays outside the repository. Outputs A–G are outside Git. `fbe9389..b55f69c` is `planning/` and `ROADMAP.md` only.
- Awkward and unclassifiable cases are preserved. Domain-count, Karpathy, artifact-v4 versus paper v4, and the edited VMA note stay unresolved. Paper v1, paper v2, paper v4, and the reviews stay gaps.
- Sprint 15 receives observations and unresolved questions, not an ontology. `G-sprint15-pressure-note.md` asks them. No schema was committed.
- The public IWL remains unchanged. No commit since `fbe9389` touches it or the Article.

## Deferred editorial findings

Recorded, not fixed, and not a public correction:

- The published Layer 1 intro says three Discovery Context notes. Four are on the page. Layer 2's matching count matches its three notes.
- The 4C intro lists relationship names that are not the twelve cells. The cell `COLLAPSES_TO →` was not normalized to the intro's `COLLAPSES`.

## Canonical documentation targets

- This contract and `planning/tickets/` hold authorization and the sanitized summary.
- `planning/programs/research-object-arc-13-17.md` holds the reconciled present-tense gate and Sprint 14 exit.
- `ROADMAP.md` holds the current-work pointer.
- Private analysis lives only in the location verified for `T14.0`.
- `CHANGELOG.md` received the Sprint 14 closure entry at T14.2.
- The closed Sprint 13 contract stays a historical record.

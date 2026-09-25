# Sprint 15 — Minimum IWL Formalization

Status: CLOSED
Risk ceiling: R2; stop and replan if R3 routing, identity, publication, or privacy work is required
Branch: `staging`
Depends on: Sprint 14 CLOSED at `main @ 6784e4d` (closure `1aa0d7a`; green deploy recorded at `6784e4d`)
Unlocks: an evidence-based IWL v1 position for selective use in the Research Object MVP
Inherits: `planning/sprints/sprint-14-iwl-decomposition-corroboration.md` @ `6784e4d`; `PLANNING.md` v1.1 @ `6784e4d`; the IWL outer contract in `PUBLISHING.md` @ `6784e4d`

## Core question

What, if anything, inside an IWL needs formal machine-enforced structure beyond the outer envelope already shipped?

## Outcome

Determine the minimum IWL v1 contract from demonstrated need. Two normal successful exits are possible: **OPAQUE V1**, retaining the typed outer envelope, authored Markdown body, and editorial conventions; or **MINIMAL STRUCTURED V1**, adding only facts whose absence causes a demonstrated failure in an accepted MVP operation. Both preserve a prose-first public IWL. A larger model triggers a product decision, not automatic implementation.

## Inherited truths

- Sprint 13 already enforces the outer IWL publication, parent/route, and Article pairing behavior; the inner body is authored Markdown.
- Sprint 14 separated published occurrences from provisional shared episodes. Those and its other audit labels are observations, not product types.
- Sprint 14 preserved 4A and Tools as resistant material, 4C's authored relationship vocabulary, the gap between observed change and authored rationale, and missing historical evidence.

## Hypotheses to test

- The existing opaque-body model may already satisfy accepted launch operations.
- A publishing convention may solve a problem without adding schema.
- A narrowly bounded machine fact may be justified; conceptual recurrence alone is insufficient.

## Hard constraints

- Formalize only when leaving a distinction authored permits a false or unsafe **product** state, materially loses meaning the product must preserve mechanically, prevents an accepted MVP operation, or prevents necessary fail-closed validation.
- Name the operation, demonstrate the current failure, test existing safeguards and prose conventions, then seek the smallest remedy. Hypothetical graph/CMS use is not a present requirement.
- Structure cannot corroborate missing drafts or make an authorial retrospective true. Keep unresolved claims unresolved and public presentation prose-first.
- Private Sprint 14 outputs A–G remain outside Git. Publish only bounded, non-reconstructive audit conclusions.

## Explicit exclusions

No new historical evidence hunt, raw chats, v7, second IWL, public IWL rewrite, graph UI, public ontology, Schema.org/citation JSON-LD expansion, normalization of 4C verbs, or speculative node/edge/state schema. No Sprint 16–19 tickets.

## Ticket sequence

| Ticket | Mode | Purpose | Depends on | Gate |
|---|---|---|---|---|
| `T15.0` | AUDIT | Test each material Sprint 14 pressure question for machine-enforcement necessity | Sprint 14 CLOSED | CLOSED. Private matrix H. Recommendation: OPAQUE V1. No schema |
| `T15.1` | RELEASE | Accept OPAQUE V1, close the sprint, fast-forward the docs to `main` | T15.0 CLOSED; Amul accepted OPAQUE V1 | CLOSED. Documentation only |

Amul accepted OPAQUE V1. `T15.1` closed the sprint. Numbering does not authorize Sprint 16.

## Sprint-level acceptance criteria

- Every material pressure question has an evidence-linked necessity disposition; any proposed structured fact has a named accepted operation, demonstrated failure, and smallest remedy.
- Existing outer safeguards are not modeled twice. Audit vocabulary and unresolved history are not promoted into machine truth.
- OPAQUE V1 is evaluated as a legitimate success. If structure is earned, its exact delta is separately decided and validated before sprint closure.
- Public IWL prose remains primary; optional IWL use and existing public semantic projection remain unchanged.

## Validation plan

T15.0 checks matrix coverage, counterexamples, provenance limits, private/output boundaries, and the documentation diff. No build or deployment check can validate a read-only necessity judgment. A later implementation ticket, if earned, must specify its validator chain, adversarial mutations, artifact checks, and deployment proof.

## Stop conditions

Stop if a candidate depends on unavailable historical evidence, needs new private access, asserts an authored retrospective as independently verified, requires route/identity/public-semantic changes, or cannot identify an accepted operation beyond future convenience.

## Exit state — achieved: OPAQUE V1

The typed outer envelope remains authoritative. The inner IWL remains prose-first authored Markdown. No inner machine schema was earned for the current MVP. Evidence: T15.0's public completion report and private matrix H, which was not reopened.

Revisit trigger: reopen inner formalization only when a later accepted operation demonstrably cannot be performed, or becomes unsafe or meaning-losing, after the existing outer contract and an appropriate editorial convention have been tried.

Two editorial findings stay deferred for a later content pass, not fixed here: the Layer 1 intro says three Discovery Context notes while four are published, and the 4C introductory vocabulary does not match the authored relation cells.

MINIMAL STRUCTURED V1 was the other legal exit. It was not selected.

## Canonical documentation targets

Activate this contract, reconcile the program arc's obsolete T15.0–T15.7 prescription and Sprint 16's mandatory-generalization assumption, and give `ROADMAP.md` a short current-work pointer. Sprint 17 stays the existing directional Keystatic spike; its IWL row must not assume an inner grammar this sprint has not earned. Do not create Sprint 18 or 19 contracts. Later publication, corpus, and discovery work stays unscheduled. Update `PUBLISHING.md` or `AGENTS.md` only if a later earned decision changes their durable contract; `CHANGELOG.md` waits for sprint closure. Do not alter closed Sprint 14 records.

# Sprint 25 — Workflow consolidation

Status: AUDITING — T25.0 authorized; execution results pending; later packages remain proposed
Risk ceiling: R2 proposed; first audit R0; deployment/publication extensions require separate scope
Branch: planner/context for planning and audit; implementation branch set per approved ticket
Depends on: accepted T24.0 + T24.1 release, main @ 9697dbc7310c480d4b6349104e9504107e4341a2
Unlocks: portable role handoffs and predictable manuscript intake

## Core question
How can a new Planner, reviewer or Executor resume and deliver a bounded website change with fewer editorial, evidence and documentation handoffs?

## Outcome
Proposed sprint direction: a maintained manuscript input contract, an SPM continuity procedure, attributed review exchange, and separate existing-entry/new-entry runbooks grounded in actual capabilities.
T25.0 earns the package boundaries and feasibility; later work requires its own prospective authorization.

## Inherited truths
- Inherits: site/PLANNING.md @ 9697dbc7310c480d4b6349104e9504107e4341a2 — roles, source ownership, gates and proportionality.
- [Planner README](../../../planner/README.md) owns branch separation and continuity practice.
- [T24 checkpoint](../../../planner/checkpoints/2026-10-20-t24-release-workflow-next.md) records release acceptance and evidence provenance.
- [Decision checkpoint](../../../planner/checkpoints/2026-10-21-sprint-25-planning-model.md) records the owner's agreed planning direction.

## Hypotheses to test
- Final authored Markdown removes upload-time editorial decisions.
- State plus relevant checkpoint/assets is sufficient for fresh-session recovery.
- Exact-revision reviews and linked CI evidence reduce reconstruction and repeated checks.
- Supported content runbooks can be clarified without first rewriting the PDF pipeline.
- The [inventory](../audits/sprint-25/optimization-inventory.md) is a candidate list, not a commitment to fix each row.

## Hard constraints
- Proposed packages do not grant execution authority; later detailed tickets follow T25.0 evidence.
- One canonical manuscript contract; CONTENT-MODULES continues to own renderer grammar.
- Larger new-paper/Desk/PDF mechanisms remain separately scoped when current capability is insufficient.

## Explicit exclusions
- Publication or editorial revision of FAFSA, Cognition as an SoS or another manuscript.
- Primitive redesign/new types, CMS, new memory machinery, automated reviewer orchestration.
- Generalized artifact bootstrap, PDF reproducibility or generation optimization implementation.
- Shared biography/publication-time artifact policy changes without a separate owner decision.

## Ticket sequence
Only T25.0 is sealed for execution. Remaining rows are provisional packages, not reserved ticket numbers.

| Ticket / package | Mode | Purpose | Depends on | Gate |
|---|---|---|---|---|
| [T25.0 sealed audit](../tickets/T25.0-workflow-consolidation-audit.md) | AUDIT | Reconcile existing findings and earn the smallest contracts | Revision 2 accepted and T25.0 sealed 2026-10-21 | Planner/owner accept findings |
| Continuity, roles and documentation ownership | DECISION | Finalize resume/checkpoint/promotion practice and current-state correction list | T25.0 | Fresh-session evidence and acceptance |
| Publish-ready manuscript contract | DECISION | Final MD interface, editorial guide, portable handoff and worked example | T25.0 | Owner approves contract |
| Manuscript validation, if earned | VALIDATION | Enforce gaps that existing checks do not cover | Approved contract | Risk-appropriate proof |
| Release evidence and operator handoff | DECISION | Authenticated evidence retrieval and exact-SHA release packet | T25.0 | Capability demonstrated |
| Existing-update and new-entry runbooks | DECISION | Supported cases, prerequisites and limitations | Contract and release handoff | Flow walkthroughs accepted |
| Technical extensions, if needed | — | Scope independently risky pipeline work separately | Tested limitation | New owner decision |

Adjacent low-risk documentation packages may share a ticket where inherited policy supports it.

## Sprint-level acceptance criteria
These are proposed full-sprint targets, subject to T25.0 evidence and owner-approved scope refinement; they are not commitments granted by this packet.
1. A fresh session identifies the current objective, authority, unknowns and next gate from repository links; record evidence and limits.
2. A reviewer submits attributed findings against an exact revision; Planner disposition and Executor handoff are traceable.
3. Sprint plan owns work sequence, STATE points to the current position, and affected canonical instructions agree.
4. A maintained manuscript contract covers supported metadata, primitive/emphasis boundaries, citations, optional IWL and allowed integration; editorial decisions stay upstream.
5. A bounded FAFSA example and representative next-paper sample test the portable prose-agent handoff without requiring publication.
6. Two runbooks distinguish paper/essay/memo/IWL-only cases and explicitly retain unsupported artifact cases.
7. Existing evidence is reused with its revision/layer; any efficiency claim names observed steps removed without inventing time savings.

The immediate handoff pilot is narrower: an exact-revision review plus an actual fresh-session recovery. The review submission is verified; fresh-session recovery remains unverified.

## Validation plan
- T25.0: current-source inspection, existing evidence and document/diff checks, without build or deployment.
- Use the [review entry point](../audits/sprint-25/README.md) for the owner-selected session; record what was actually demonstrated.
- Later validation scope derives from source/body/emphasis/order/anchor/citation fidelity and actual missing checks.
- Existing PDF rendering/preservation checks continue to apply when publication work occurs.

## Stop conditions
Return for a scope decision if a runbook requires unsupported technical behavior, required access is unavailable, or work exceeds the proposed R2 ceiling.
Inherited stop conditions apply by reference.

## Exit state
Accepted operating procedures and content flows are demonstrated, and agreed canonical corrections reach their proper homes through authorized work.
Technical extensions remain explicit limitations until implemented; no extra deploy merely to record closure.

## Canonical documentation targets
- Planner README/STATE/checkpoints: procedure, resume pointer and rationale respectively.
- HANDOFF: orientation; ROADMAP: active/deferred index; CHANGELOG: verified history.
- PUBLISHING: flows; CONTENT-MODULES: grammar; AGENTS: operations; content-manager skill: concise adapter.
- Proposed site/MANUSCRIPT-CONTRACT.md: maintained input interface/editorial guide; exact placement follows audit.
- PLANNING/templates only if an evidence-earned process amendment is separately approved.

## Review disposition
[Grok's original review](https://github.com/amulbham/cybernetics-mbp/blob/ff45b4f23fd057e7fc4ba9c1017aa64a534f3e36/site/planning/audits/sprint-25/sprint-plan-review-grok-2026-10-21.md) assessed revision 1 @ 5807038.
[Planner disposition](../audits/sprint-25/review-disposition-2026-10-21.md) records both REQUIRED corrections and the OPTIONAL decisions.
Revision 2 has not received a separate Grok approval. No independent reviewer is invoked automatically.

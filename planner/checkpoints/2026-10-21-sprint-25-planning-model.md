# Checkpoint — Sprint 25 planning, manuscript contract and portable roles

Date: 2026-10-21 (America/Los_Angeles).
Authority: Product Authority said "okay lets do it and try it out for sprint 25" after approving the planning/review model.
Scope of this authorization: save agreed direction, proposed sprint, inventory, first audit draft and review entry on planner/context.
No Sprint 25 audit execution, contract seal, implementation, production or variable change is authorized by this checkpoint.

## Context and inspected state
- Main: 9697dbc7310c480d4b6349104e9504107e4341a2; staging: 043e351f00f6834a053847209caca4749941e91d; planner/context parent: ba4e9dce6ce3fa221f0fd0a134d10135e44fde13, freshly inspected.
- T24 release acceptance remains in the [prior checkpoint](2026-10-20-t24-release-workflow-next.md); direct live checks and independently retrieved workflow evidence retain their distinct provenance.
- Current templates already provide sprint ticket sequence, dependencies, risk, acceptance and gates.
- main PLANNING §13 allows a provisional sprint sequence but forbids pre-created downstream tickets.
- planner/README already defines state, checkpoints, assets and non-deploying branch separation.
- HANDOFF/main still has pre-S6 state; canonical reconciliation is earned future work, not performed here.

## Approved direction — manuscript contract
- Website repo owns a maintained publish-ready MD contract that can be handed to a prose agent as a standalone versioned document.
- Prose agent and owner select primitive kinds, exact wording, placement and bold emphasis upstream.
- Executor preserves authored content; performs only authorized technical integration; flags unsupported input instead of choosing, moving, dropping or rewriting primitives.
- No quota: a paper may have no primitives or no bold emphasis.
- Existing five kinds remain: Definition, Key idea, Evidence, Counterpoint, Implication; no visual redesign or new type.
- Guide includes purpose/non-use, earned placement, no adjacent cards, sensible density, deliberate repetition policy, sparing emphasis and explicit blockquote boundaries.
- CONTENT-MODULES owns grammar; the new manuscript contract owns the prose-agent input interface/editorial guidance. A standalone handoff is a versioned snapshot, not a second independently maintained authority.
- Include a bounded FAFSA plain/annotated/compiled example without revising or redeploying FAFSA.
- A representative Cognition-as-an-SoS excerpt may test portability; completing that paper is not a sprint dependency.
- Missing emphasis means failure to preserve supplied emphasis, not an invitation to infer desired bolding.
- Unknown/empty primitives and anchor/boundary fidelity need an explicit validation design; renderer behavior alone does not guarantee rejection.
- PDF redesign/identity extensions are separate; existing PDF rendering/preservation duties still apply to actual publication.

## Approved direction — SPM adaptation
- User supplied Shared Project Memory v0.2, dated 2026-10-19, from amulbham-research/meta/SPM.md. Treat this as the supplied version, not a claim to have fetched its latest upstream revision.
- Principle: current conversation supports work; repository preserves aligned state, decisions and reusable artifacts for another session/model.
- STATE is the short resume address; checkpoints hold milestone rationale; assets hold approved standalone content in this website workspace.
- Resume reads planner/context for working memory and current main/staging for implementation facts. The generic "pull main" procedure needs this branch-specific adapter.
- Work retrieves task-relevant context, not every checkpoint. Checkpoint after meaningful alignment, not every turn.
- Update changed artifacts and milestone rationale, then STATE last; commit the coherent bundle after checking branch freshness.
- Commit messages narrate transitions but do not replace decision artifacts.
- Preserve Approved / Proposed / Verified / Unverified / Superseded distinctions; approval and verification are separate properties.
- Do not copy the research project's full architecture or manuscripts into this website repository merely for structural symmetry.

## Approved direction — durable sprint and review handoffs
- Whole-sprint outcomes, work packages, dependencies and gates live in the sprint contract; STATE points there.
- Detailed later tickets are drafted only when predecessor evidence earns scope. No placeholder ticket files for every package.
- Use existing planning/audits/sprint-25 for attributed reviews and audit results.
- A review records exact commit, document paths, reviewer identity as known, verdict and concrete BLOCKER/REQUIRED/OPTIONAL findings.
- Reviewers do not rewrite contracts. Planner dispositions reference original findings; unread revisions are not approved implicitly.
- Product Authority selects reviewers; no automated agent orchestration.
- Reviewer submissions need explicit write authority and may use a small branch/PR targeting planner/context. Read-only reviewers can return Markdown for authorized import.
- Executor entry is one authorized ticket with sprint/instruction/source/asset references and a stopping gate.
- Roles are model-independent operating responsibilities; folder organization is not access enforcement.

## Source ownership and documentation
- planner/README: continuity adapter; STATE: current objective/next gate; checkpoints: rationale; assets: approved content.
- Sprint: full plan; ticket: execution authorization; review/audit: attributed findings/evidence.
- ROADMAP: short active/deferred index; CHANGELOG: append verified history; HANDOFF: stable orientation.
- PUBLISHING: publication semantics; CONTENT-MODULES: grammar; AGENTS: operational rules; skill: concise operator adapter.
- Reconcile stale current claims in an approved batch. Do not rewrite seals/history or redeploy solely to record CLOSED.

## Proposals not yet authorized
- [Sprint 25 plan](../../site/planning/sprints/sprint-25-workflow-consolidation.md) and [T25.0 draft](../../site/planning/tickets/T25.0-workflow-consolidation-audit.md).
- Exact manuscript-contract location, validator implementation, access configuration and generalized publishing mechanisms.
- The sprint may finish with explicit technical limitations; documentation cannot manufacture new-paper or Desk-update support.

## Resume point
1. Read the sprint and [review entry](../../site/planning/audits/sprint-25/README.md) at the resulting commit.
2. Owner assigns an independent sprint-plan/T25.0 review; record the actual review and revision.
3. Planner resolves material findings and returns the first audit contract for prospective authorization.
4. Do not execute the audit, create later tickets, start publishing content or change deployment settings from this note.

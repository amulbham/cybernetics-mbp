# Sprint 25 — Workflow consolidation

Status: PROPOSED — review draft, not sealed
Risk ceiling: R2 proposed; current planning packet and first audit are R0
Branch: planner/context for planning and audit; implementation branch set per approved ticket
Depends on: accepted T24.0 + T24.1 release, main @ 9697dbc7310c480d4b6349104e9504107e4341a2
Unlocks: portable planning/review handoffs and predictable manuscript intake
Planning authority: Product Authority approved saving this plan and trying the GitHub handoff on 2026-10-21; execution remains separately gated.

## Core question
How can a new Planner, reviewer or Executor resume and deliver a bounded website change with fewer repeated editorial, evidence and documentation handoffs?

## Outcome
A maintained manuscript input contract, a usable SPM-based continuity procedure, an attributed review exchange, and distinct existing-entry/new-entry runbooks grounded in the actual release capabilities.

## Inherited truths
- Inherits: site/PLANNING.md @ 9697dbc7310c480d4b6349104e9504107e4341a2, especially §§3, 7 and 13.
- Latest release acceptance and evidence provenance: [T24 checkpoint](../../../planner/checkpoints/2026-10-20-t24-release-workflow-next.md).
- Working-memory substrate: [Planner README](../../../planner/README.md); actual source is read separately from current main/staging.
- Baseline findings: [Oct 18 sweep](../../../planner/audits/2026-10-18-publishing-flow-doc-sweep.md); dated findings require current-source reconciliation.

## Hypotheses to test
- A single publish-ready manuscript contract removes recurring editorial decisions from upload.
- State plus a relevant checkpoint and linked assets is sufficient for fresh-session orientation.
- Exact-revision reviews and linked evidence reduce chat copying and repeated verification.
- Existing CI protections can support simpler operator handoffs without a PDF-pipeline rewrite.
- The [optimization inventory](../audits/sprint-25/optimization-inventory.md) is a candidate list, not a commitment to fix every row.

## Hard constraints
- Product Authority selects reviewers and authorizes scope, staging acceptance and production.
- Planner proposes and reconciles; reviewer assesses the assigned revision; Executor implements only authorized work. No agent launches other reviewers without explicit instruction.
- Plan the complete sprint as work packages; draft later executable tickets only after predecessor evidence earns their shape.
- Approved editorial direction is distinct from verified implementation; review feedback is distinct from authorization.
- Maintain PDF preservation, stable publication identity and current production/preview indexing policy.
- Working notes and reviews use planner/context; never wholesale merge planner/context or divergent staging into main.
- Record post-release evidence without a deploy solely to flip status wording.
- The owner manages Chisel's external Zenodo deposit and DOI checks.

## Explicit exclusions
- Publishing or rewriting FAFSA, Cognition as an SoS, or any other manuscript in this planning unit.
- New primitive types, primitive visual redesign, a CMS, new memory machinery, or reviewer orchestration.
- Generalized new-paper bootstrap, Desk artifact replacement, PDF reproducibility, or generation optimization implementation.
- Shared biography/publication-time PDF policy changes without a separate owner decision.
- Indexing, credentials, repository variables, deployment mechanics or production changes under audit authority.

## Ticket sequence
Only T25.0 has a detailed draft. The remaining rows are provisional work packages, not reserved ticket numbers or implementation permission.

| Ticket / package | Mode | Purpose | Depends on | Gate |
|---|---|---|---|---|
| [T25.0 draft](../tickets/T25.0-workflow-consolidation-audit.md) | AUDIT | Reconcile the existing sweep and inventory; earn the smallest next contracts | Sprint-plan review and owner authorization | Accept findings and proposed scope |
| Continuity, roles and documentation ownership | DECISION | Finalize resume/checkpoint/promotion rules, review exchange and current-state reconciliation | T25.0 findings | Fresh-session recovery and owner acceptance |
| Publish-ready manuscript contract | DECISION | Specify final MD, editorial ownership, guide and worked example | T25.0 grammar/validation evidence | Owner approves portable prose-agent contract |
| Manuscript validation, if earned | VALIDATION | Enforce input integrity that current checks do not cover | Approved contract and identified gaps | Risk-appropriate contract and negative cases |
| Release evidence and operator handoff | DECISION | Establish authenticated evidence retrieval and exact-SHA release packet | T25.0 access/CI findings | Capability demonstrated; no credential disclosure |
| Update-existing and publish-new runbooks | DECISION | Document supported cases and explicit technical limitations | Accepted contract and release handoff | Walkthrough of each flow |
| Technical extensions, if needed | — | Scope independently risky pipeline work for a later sprint or explicit scope amendment | Tested limitations | Separate Product Authority decision |

Adjacent low-risk documentation packages may share a ticket where §7 supports it. They need not become one ticket each.

## Sprint-level acceptance criteria
1. A fresh role-assigned session recovers objective, current authoritative documents, approvals, unresolved evidence and next gate from repository links; record actual recovery evidence and its limits.
2. One sprint plan carries scope, work order and dependencies; STATE links to it rather than reproducing its requirements.
3. A reviewer can identify an exact revision, submit attributed findings in the designated folder, and have their disposition traced to the contract.
4. An Executor can retrieve one bounded ticket and required references without inheriting permission from surrounding proposals.
5. A canonical manuscript contract covers supported metadata, prose/primitive/emphasis boundaries, citations, optional IWL and permitted mechanical integration. No upload-time editorial selection.
6. A portable prose-agent handoff and bounded FAFSA example demonstrate the existing grammar; a representative next-paper sample tests usability without requiring that paper's completion.
7. Existing-update and new-entry runbooks distinguish paper/essay/memo and IWL-only cases; unsupported PDF cases remain explicit limitations.
8. Source-of-truth ownership and affected stale instructions are reconciled through the approved documentation batch, preserving history and review provenance.
9. Retained CI evidence is reused appropriately; any claimed efficiency improvement identifies the observed steps or handoffs removed. No invented time savings.

## Validation plan
- T25.0 uses source inspection, existing evidence and Markdown/diff checks; no build or deployment for the audit.
- Pilot a repository-only resume and exact-revision review using [the review entry point](../audits/sprint-25/README.md); user chooses the independent session.
- For the later manuscript contract, compare source primitive bodies, emphasis, order, boundaries, anchors and citations with compiled output; test missing/unknown/empty cases according to the earned validator scope.
- Preserve existing PDF rendering/identity checks when actual publication work occurs; PDF redesign and new artifact mechanisms remain separate.
- Reuse existing CI results with their SHA, layer and assertion; do not repeat unchanged checks without a reason.

## Stop conditions
- A proposed simplification weakens an existing safety gate or changes canonical authority.
- Supporting a runbook requires unimplemented deployment/publication behavior.
- Access requires owner-managed credentials or permissions; report capability needs without configuring them.
- Risk rises to R3, executable deployment changes are needed, or unrelated runtime/editorial work enters scope.
- A new branch head conflicts with planned writes; re-read and reconcile rather than force.

## Exit state
The accepted operating process and two content flows are documented and demonstrated, with agreed canonical corrections promoted under proper authority.
Unimplemented pipeline extensions remain tracked limitations; do not declare universal publishing support.
No extra production deployment is required merely to record sprint closure.

## Canonical documentation targets
- planner/README.md: website-specific continuity and role entry; planner/STATE.md: resume pointer; checkpoints: milestone rationale.
- HANDOFF.md: stable orientation and current branch pointers, with reduced volatile release detail.
- site/ROADMAP.md: active/deferred index; site/CHANGELOG.md: append verified outcomes.
- site/PUBLISHING.md: flow semantics; site/CONTENT-MODULES.md: grammar; site/AGENTS.md: operational rules.
- Proposed site/MANUSCRIPT-CONTRACT.md: maintained prose-agent input contract and guide; exact placement settled after audit.
- .claude/skills/content-manager/SKILL.md: concise execution adapter, including removal of upload-time primitive selection.
- site/PLANNING.md/templates: only an earned, separately approved process delta; current policy governs until amended.

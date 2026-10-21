# Sprint 25 — review and handoff entry point

Planning pilot, 2026-10-21. This folder holds attributed reviews and audit evidence.
Authority: [PLANNING.md](../../../PLANNING.md) §2; continuity and branch procedure: [Planner README](../../../../planner/README.md).
These references govern role permissions; the instructions below describe this pilot's exchange format.

## Retrieve a task
- [Sprint plan](../../sprints/sprint-25-workflow-consolidation.md): full proposed scope and dependencies.
- [T25.0](../../tickets/T25.0-workflow-consolidation-audit.md): first DRAFT ticket and its write boundary.
- [Inventory](optimization-inventory.md): candidate issues and evidence boundaries.
- [STATE](../../../../planner/STATE.md): current position and next gate.
Use the role and task assigned by the owner; retrieve only its relevant linked sources. Read current main/staging separately where source freshness matters.

## Review an exact revision
The assignment supplies repository, branch, immutable commit SHA, document paths and review type.
Assess those bytes; check current source separately only where needed for a finding.
Write sprint-plan-review-<reviewer>-<date>.md or T25.0-review-<reviewer>-<date>.md here.
Record identity/model as known, date, reviewed commit/paths, verdict and finding IDs.
Each BLOCKER/REQUIRED/OPTIONAL gives a concrete defect, inspected evidence and necessary correction; record unverified areas.
A no-findings review still identifies its revision and limits.

## Submit and reconcile
With explicit write authority, add only the review file on a reviewer branch and open a PR targeting planner/context; do not merge it without authorization.
Without write authority, return the attributed Markdown for owner-authorized import.
Planner records disposition in the sprint/ticket, referencing the original review. Preserve attribution and record later addenda explicitly.
Material changes after review are identified; no approval is attributed to an unread revision.
Apply inherited severity/review policy; a focused correction check does not require another broad polish cycle.
Folder organization is not access enforcement.

## Role entry prompts
Reviewer:
> Review ASSIGNED_PATHS in amulbham/cybernetics-mbp at COMMIT_SHA on SOURCE_BRANCH. Use this review format. Return findings against those bytes. Submit a review file only under explicit write authorization.

Planner:
> Resume Sprint 25 from planner/STATE.md on planner/context. Follow the current task links, inspect relevant reviews/current source, and identify approved decisions, verified facts, unknowns and next gate.

Executor:
> Execute TICKET_PATH at APPROVED_SHA once prospectively authorized/sealed. Read its required references; use its write boundary and stopping gate. Provisional sprint packages are context, not additional tasks.

## Pilot evidence
[Grok's original review](https://github.com/amulbham/cybernetics-mbp/blob/ff45b4f23fd057e7fc4ba9c1017aa64a534f3e36/site/planning/audits/sprint-25/sprint-plan-review-grok-2026-10-21.md) exists on its review branch; [PR #2](https://github.com/amulbham/cybernetics-mbp/pull/2) targets planner/context and remains open/unmerged as checked 2026-10-21.
Its single-file commit ff45b4f descends from reviewed packet 5807038. [Planner disposition](review-disposition-2026-10-21.md) covers revision 2.
This demonstrates exact-revision review submission and Planner retrieval. Full fresh-session recovery and Executor execution are not established by this review.

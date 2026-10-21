# Sprint 25 — review and handoff entry point

Status: approved planning pilot, 2026-10-21; no ticket execution or production authorization.
Branch: planner/context. This folder contains Sprint 25 review and audit evidence under the existing planning/audits convention.

## Start here
- [Sprint plan](../../sprints/sprint-25-workflow-consolidation.md): complete proposed scope, sequence and exit criteria.
- [Optimization inventory](optimization-inventory.md): dated issues and verification boundaries.
- [First audit ticket](../../tickets/T25.0-workflow-consolidation-audit.md): DRAFT, not sealed.
- [Planner state](../../../../planner/STATE.md): current role, objective and next gate.
- [Decision checkpoint](../../../../planner/checkpoints/2026-10-21-sprint-25-planning-model.md): why this packet exists.

## Role boundaries
The repository's PLANNING.md owns role authority. For this pilot:
- Product Authority assigns roles/reviewers and approves scope, acceptance and production.
- Planner maintains the proposed plan/contracts, resolves review findings and records continuity.
- Reviewer assesses the assigned revision and writes attributed findings; does not modify the contract to approve their own revision.
- Executor retrieves the authorized ticket, reads its required references, implements within scope and reports evidence at the stated gate.
Roles can be filled by different chats/models. Folder placement is organization, not an access-control boundary.
No agent invokes reviewer agents on the strength of these instructions.

## Assigning a review
Supply repository, source branch, exact commit SHA, document paths and review type (sprint plan, pre-seal ticket or implementation).
Resolve and record the SHA before review; do not use a moving branch name as the reviewed revision.
The review target is the assigned commit. Check current branches separately only where freshness affects a finding.
For this first trial, review the sprint plan and T25.0 draft together for scope, duplication, authority and evidence proportionality.

## Review file
Use sprint-plan-review-<reviewer>-<date>.md or T25.0-review-<reviewer>-<date>.md in this folder.
A review contains:
- Reviewer identity/model as actually known, date, review type.
- Reviewed commit and exact document paths; source revision for any code evidence.
- Verdict and findings with IDs: BLOCKER / REQUIRED / OPTIONAL.
- Concrete defect, file:line or other inspected evidence, and necessary correction.
- Unverified areas and whether later revisions were examined.
A reviewer with no findings still records reviewed revision, verdict and verification limits. Never fabricate reviewer identity or approval.

## Submission and disposition
- With explicit write authority, submit only the review file on a reviewer branch via a small PR targeting planner/context; opening/submitting does not merge it.
- With read-only access, return the attributed Markdown review to the owner; the owner may authorize its exact import. Read access alone is not write permission.
- Recheck branch freshness before any shared write; preserve other sessions' work and never force.
- Planner records finding dispositions in the ticket's short review record or sprint plan's review disposition, linking the original review.
- Resolve BLOCKER/REQUIRED before seal under the applicable protocol. OPTIONAL does not trigger a polish cycle.
- Record material changes after review and request only the focused recheck they require; do not imply approval of unread revisions.
- Original reviews remain attributable. Later corrections receive an explicit addendum or new review, not silent replacement.

## Minimal handoff prompts
Reviewer:
> Act as an independent reviewer for amulbham/cybernetics-mbp. Review the Sprint 25 plan and T25.0 draft on planner/context at COMMIT_SHA. Start with this folder's README. Return attributed BLOCKER/REQUIRED/OPTIONAL findings against those bytes. No implementation, seal, merge or deployment. Submit a review file only if the owner explicitly authorizes that write.

Fresh Planner:
> Resume Sprint 25 from planner/STATE.md on planner/context. Read the linked plan, checkpoint and relevant reviews, check current refs, and report approved decisions, verified facts, unresolved findings and the next gate. Do not treat draft tickets as execution authority.

Executor, after a ticket is approved and sealed:
> Execute TICKET_PATH at APPROVED_SHA under the ticket's branch, paths and stopping gate. Read the referenced sprint, instructions and approved assets. Report contradictions before changing scope. Do not infer authorization from provisional work packages.

## Current review status
No independent review of this packet has run or been recorded. No review submission, PR or seal is created by this file.

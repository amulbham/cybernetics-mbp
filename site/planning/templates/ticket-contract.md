# Sealed ticket template

Canonical for the exact ticket shape — `PLANNING.md` §9 describes the quality bar; this file owns the one copyable body. Copy the skeleton below into `planning/tickets/TXX.Y-slug.md` and fill it in.

A sealed ticket must let Claude Code answer all of these without guessing:

```text
What problem am I solving?
Why is it earned now?
What may I change?
What must remain unchanged?
What evidence constitutes success?
What failure must be demonstrated?
When must I stop and ask?
May I commit, push, merge, or deploy?
What exactly must I report back?
```

---

```markdown
# TXX.Y — Ticket title

Status: READY
Mode: AUDIT | DECISION | IMPLEMENTATION | VALIDATION | POLISH | RELEASE | SPIKE
Risk: R0 | R1 | R2 | R3
Branch: staging
Depends on: ticket IDs / commits / verified contracts
Unlocks: next ticket or decision

## Goal
One bounded outcome.

## Why now
The evidence or dependency that makes this work earned.

## Starting state
Verified facts only. Name the relevant files, routes, fixtures, and current behavior.

## Decisions already frozen
Product and architecture choices this ticket must not reopen.

## Questions this ticket may answer
Unknowns that implementation evidence is allowed to resolve.

## Scope
- Required inspection and changes.

## Explicit exclusions
- Files, behaviors, concepts, or later-sprint work that must remain untouched.

## Implementation contract
- Required behavior.
- Source-of-truth ownership.
- Absence/failure behavior.
- Compatibility requirements.

## Acceptance criteria
- Binary, observable conditions.

## Validation matrix
| Layer | Command/check | Expected result |

## Adversarial tests
- Mutation or negative case.
- Expected fail-closed result.
- Restoration proof.

## Regression boundaries
- Existing behavior that must remain unchanged.

## Documentation updates
- Exact canonical surfaces to update.
- Stale language to search for.

## Git and deployment boundary
- Commit/push/merge/deploy authority.
- Required staging or production verification.

## Stop conditions
- Conditions requiring product review.

## Required completion report
Use the standard completion-report template (`planning/templates/completion-report.md`).

## Done when
One closure statement combining behavior, evidence, documentation, and branch state.
```

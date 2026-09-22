# Sprint contract template

Canonical for the exact sprint-contract shape — `PLANNING.md` §8 describes what each field must accomplish; this file owns the one copyable body. Copy the skeleton below into `planning/sprints/sprint-XX-name.md` and fill it in.

Not length-capped (only sealed ticket contracts and completion reports are — `PLANNING.md` §13), but still delta-only where a field would otherwise restate `PLANNING.md`/`PUBLISHING.md`/`AGENTS.md` or a prior sprint's own frozen record. Reference (`Inherits: <path> @ <commit>`) instead of recopying.

---

```markdown
# Sprint XX — Name

Status: PROPOSED | AUDITING | CONTRACT FROZEN | EXECUTING | STAGING ACCEPTED | PRODUCTION VERIFIED | CLOSED
Risk ceiling: R0–R3
Branch: staging
Depends on: verified prior contracts
Unlocks: next capability or decision

## Core question
One question this sprint must answer.

## Outcome
The capability or verified decision that should exist at exit.

## Inherited truths
- Only facts already verified in code, artifacts, or prior frozen contracts.

## Hypotheses to test
- Plausible ideas that are not yet requirements.

## Hard constraints
- Boundaries that every ticket inherits.

## Explicit exclusions
- Attractive adjacent work this sprint will not absorb.

## Ticket sequence
| Ticket | Mode | Purpose | Depends on | Gate |

## Sprint-level acceptance criteria
- Observable outcomes, not implementation preferences.

## Validation plan
- Required validators, artifacts, viewports, mutations, or external checks.

## Stop conditions
- Decisions or evidence that require returning to Amul.

## Exit state
- What is true when the sprint closes.
- What remains deliberately open.

## Canonical documentation targets
- Existing docs that must reflect the surviving contract.
```

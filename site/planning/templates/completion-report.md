# Completion-report template

Canonical for the exact completion-report shape — `PLANNING.md` §10 describes what it must cover; this file owns the one copyable body. Append it to the bottom of the sealed ticket file it reports on (`planning/tickets/TXX.Y-slug.md`) once the ticket closes — a ticket's contract and its reconciliation live in the same file (see `PLANNING.md` §3: `planning/tickets/` owns "sealed executor contracts and completion reconciliation").

---

```markdown
# TXX.Y Completion Report

Result: COMPLETE | COMPLETE WITH JUSTIFIED DEVIATION | BLOCKED | FAILED
Branch:
Commit:
Deployment:

## Outcome
What now works or what the audit established.

## Files changed
| File | Change | Why |

## Acceptance criteria
| Criterion | Result | Evidence |

## Validation performed
| Command/check | Result | Key output |

## Adversarial tests
| Mutation | Expected failure | Observed | Restored |

## Deviations from ticket
- Ticket assumption.
- Repository evidence.
- Implemented correction.
- Product impact.

## Newly discovered findings
- Unrelated or later-sprint items; not silently fixed.

## Regression confirmation
- Named unchanged surfaces and evidence.

## Documentation reconciliation
- Canonical docs updated.
- Stale present-tense language removed.
- Historical entries preserved.

## Remaining gate
What still must happen before the ticket or sprint can close.
```

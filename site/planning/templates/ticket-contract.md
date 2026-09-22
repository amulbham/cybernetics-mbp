# Sealed ticket template

Canonical for the exact ticket shape — `PLANNING.md` §9 describes the quality bar, §13 the delta-only/length-cap discipline this template enforces; this file owns the one copyable body. Copy the skeleton below into `planning/tickets/TXX.Y-slug.md` and fill it in.

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

## Delta-only discipline

Every field below records only the authorized delta. Reference inherited truth once — `Inherits: <path> @ <commit>` (a prior ticket, `PLANNING.md`, `PUBLISHING.md`, `AGENTS.md`, or the sprint contract) — instead of recopying it. Copy an inherited invariant into the body only when this ticket changes, constrains, or directly tests it.

## Length cap

Applies to the sealed contract body only — frontmatter/header block and the later-appended completion report are excluded, and decorative formatting cannot be used to move substantive text outside the count.

| Risk | Maximum |
|---|---:|
| `R0` / `R1` | 150 lines |
| `R2` | 250 lines |
| `R3` | 400 lines |

Exceeding the cap requires one explicit exception sentence naming the concrete risk that can't be bounded within it — not a reconciliation exercise. Cut duplication (recopied inherited truth) first.

---

```markdown
# TXX.Y — Ticket title

Status: READY
Mode: AUDIT | DECISION | IMPLEMENTATION | VALIDATION | POLISH | RELEASE | SPIKE
Risk: R0 | R1 | R2 | R3
Branch: staging
Depends on: ticket IDs / commits / verified contracts
Unlocks: next ticket or decision
Inherits: <path> @ <commit> — only what this ticket doesn't itself change/constrain/test

## Goal
One bounded outcome.

## Why now
The evidence or dependency that makes this work earned.

## Starting state
Verified facts only, and only the ones this ticket's scope actually touches. Name the relevant files, routes, fixtures, and current behavior — don't restate what `Inherits:` already covers.

## Decisions already frozen
Product and architecture choices this ticket must not reopen — referenced by source, not restated in full.

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

Cite an established verification bundle/command where one already exists and is trusted, plus only the ticket-specific delta — don't recopy a bundle's component commands.

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
- Commit choreography by risk/mode — `PLANNING.md` §13; state only the ticket-specific deviation, if any.
- Required staging or production verification.

## Stop conditions
- Conditions requiring product review.

## Required completion report
Use the standard completion-report template (`planning/templates/completion-report.md`), including its own length cap.

## Done when
One closure statement combining behavior, evidence, documentation, and branch state.
```

# Planning Protocol

**Project:** `amulbham/cybernetics-mbp`
**Scope:** Planning and executing website-development sprints with ChatGPT as planner/reviewer, Amul as product authority, and Claude Code as implementation agent.
**Version:** 1.0
**Calibrated against:** Sprints 7–12 and the planned Sprint 13–17 research-object arc.

---

## 1. Purpose

This system turns product direction into durable, executable sprint and ticket contracts. It preserves the development method already proven by the repository:

> Audit reality → implement the smallest earned grammar → adversarially test it → freeze only what survives.

The system exists to solve one current gap: the repository records implementation outcomes extremely well, but the original ticket contract usually remains only in conversation. A future reviewer can see what shipped, but not always what was authorized, what was excluded, or whether a deviation was justified.

The planning layer therefore preserves intent before execution while keeping current architectural truth in the repository's existing canonical documents.

---

## 2. Roles and authority

### Amul — product authority

- Sets direction, priorities, editorial meaning, and acceptable product tradeoffs.
- Approves sprint contracts and material changes in scope.
- Decides whether a staging result is acceptable for production.
- Retains sole authority over indexing changes, public/private boundaries, and major publication semantics.

### ChatGPT — planner and reviewer

- Converts direction into sequenced sprint contracts and sealed implementation tickets.
- Separates verified repository facts, proposed decisions, hypotheses, and unresolved questions.
- Reviews Claude Code's completion report against the ticket and repository evidence.
- Identifies drift, contradictions, unjustified expansion, and newly earned work.
- Does not treat a confident implementation report as proof of completion.

### Claude Code — implementation agent

- Reads the repository's current instructions and source before changing anything.
- Executes one sealed ticket at a time.
- May correct a ticket assumption when direct repository evidence disproves it, but must report the correction explicitly.
- Stops for a product decision when evidence changes the meaning, public contract, privacy boundary, route model, or sprint scope.
- Returns a structured completion report with commands, results, deviations, and unresolved findings.

### Repository and deployed artifacts — verification authority

The source tree, diffs, validators, build output, workflow state, staging deployment, and production deployment determine what is true. Agent narration is evidence to inspect, not the final authority.

---

## 3. Source-of-truth map

Each fact should have one canonical home.

| Surface | Owns | Must not become |
|---|---|---|
| `ROADMAP.md` | Short index of current and deferred work | Full sprint history or ticket archive |
| `PLANNING.md` | This operating protocol | Product architecture specification |
| `planning/programs/` | Provisional long-range dependency arcs | Frozen sprint or implementation contracts |
| `planning/sprints/` | Active sprint intent, dependencies, gates, ticket order | Current runtime truth after the sprint closes |
| `planning/tickets/` | Sealed executor contracts and completion reconciliation | Permanent duplication of implementation docs |
| `planning/templates/` | Canonical planning document shapes | Project architecture or current product truth |
| `CHANGELOG.md` | Immutable history of verified outcomes | Mutable current-state documentation |
| `AGENTS.md` | Pipeline, routing, deploy, indexing, and implementation gotchas | Sprint narrative |
| `PUBLISHING.md` | What a published research object is | Ticket queue |
| `CONTENT-MODULES.md` | Content-module and relation manifestation contracts | General project history |
| `design-system/` | Visual contract | Content or routing rules |
| `.claude/skills/content-manager/` | Reusable content-authoring procedure | A second canonical architecture |
| Code, schemas, validators | Executable contract | Historical explanation that can go stale |
| Commit message | Concise implementation evidence | Replacement for the ticket or changelog |

**Planning documents may authorize change but do not become competing runtime or architecture truth.** A planning document can say what a sprint or ticket is allowed to do; only code, schemas, validators, deployed artifacts, and the existing canonical docs above say what the product currently *is*.

### Promotion rule

During execution, a ticket owns intended change. After verification, every surviving fact is promoted to its correct canonical surface. The ticket then becomes a closed record; it does not remain the authority for current behavior.

Once closed, a ticket is an immutable historical record of authorization, execution, and reconciliation. Do not revise it to describe later behavior. Later corrections or supersession belong in a new ticket; current truth belongs in canonical documentation, schemas, validators, and code.

### History rule

Never rewrite a historical changelog entry to make an old statement appear current. Add a later correction. Present-tense operating instructions, however, must be updated when they become false.

---

## 4. Planning hierarchy

```text
PROGRAM ARC
long-range dependency sequence

    ↓

SPRINT CONTRACT
one capability or question, with a measurable exit state

    ↓

TICKET CONTRACT
one bounded audit, implementation, validation, or release operation

    ↓

COMPLETION REPORT
what Claude Code actually changed and proved

    ↓

RECONCILIATION
accepted, corrected, deferred, or blocked

    ↓

CLOSURE FREEZE
surviving truth moves into canonical docs and validators
```

Sprints may change ticket numbering when evidence changes the work. Numbering symmetry is never a reason to invent a ticket.

---

## 5. Work types

Every ticket declares one mode.

| Mode | Purpose | Production behavior change allowed? |
|---|---|---:|
| `AUDIT` | Inspect reality and answer bounded questions | No |
| `DECISION` | Freeze a contract from verified findings | Documentation only unless stated |
| `IMPLEMENTATION` | Add or change a bounded capability | Yes, within scope |
| `VALIDATION` | Turn proven behavior into a persistent oracle | Only validation/build wiring |
| `POLISH` | Correct visual or interaction defects without changing semantics | Yes, presentation only |
| `RELEASE` | Promote verified staging state and freeze documentation | Merge/deploy only |
| `SPIKE` | Test feasibility without committing to adoption | Isolated or reversible only |

### Risk classes

| Class | Meaning | Minimum evidence |
|---|---|---|
| `R0` | Audit or documentation-only | Source inspection, diff boundary, relevant build |
| `R1` | Additive, isolated behavior | Build, focused assertions, regression checks |
| `R2` | Cross-cutting schema/rendering/content behavior | Full validator chain, adversarial mutations, artifact inspection |
| `R3` | Routing, canonical identity, deployment, migration, privacy, or publication semantics | Full local chain, staging verification, rollback/stop conditions, production re-verification when released |

Risk determines the required proof; it does not indicate urgency.

---

## 6. Lifecycle and gates

### Ticket states

```text
DRAFT
→ READY
→ IN PROGRESS
→ IMPLEMENTED
→ VERIFIED LOCAL
→ VERIFIED STAGING
→ CLOSED
```

Exceptional states: `BLOCKED`, `SUPERSEDED`, `REJECTED`.

Not every ticket needs every deployment state. An audit may close after a verified documentation commit. A release ticket begins only after all implementation tickets have passed their required gates.

### Sprint states

```text
PROPOSED
→ AUDITING
→ CONTRACT FROZEN
→ EXECUTING
→ STAGING ACCEPTED
→ PRODUCTION VERIFIED
→ CLOSED
```

### Standard sprint lifecycle

1. **Program placement** — state what the sprint inherits and what it must earn for the next sprint.
2. **Reality audit** — inspect current source, corpus, artifacts, and relevant external standards.
3. **Contract freeze** — revise the plan using audit evidence; resolve material product choices with Amul.
4. **Ticket execution** — execute one sealed ticket at a time on `staging` unless a ticket explicitly says otherwise.
5. **Completion reconciliation** — compare authorization, diff, validation evidence, and deviations.
6. **Staging gate** — verify a marker unique to the new deployment, with cache busting where appropriate.
7. **Closure freeze** — migrate surviving truths to canonical docs/validators and remove stale present-tense claims.
8. **Production promotion** — merge only after acceptance; verify production independently of workflow success.

The two freezes serve different purposes:

- **Contract freeze** authorizes what implementation may do.
- **Closure freeze** records what implementation proved and promotes surviving truth into canonical homes.

---

## 7. Change-control rules

### Claude Code may proceed without interruption when

- A ticket assumption is factually wrong and repository evidence supports a narrower correction.
- An incidental defect must be corrected to meet the ticket's acceptance criteria and remains within the named affected surface.
- An implementation detail changes without changing the product contract.

The completion report must name the assumption, evidence, correction, and resulting scope. (This is the same discipline the **Promotion rule** and **History rule** in §3 already establish for closed tickets — a correction belongs in a new record, never a silent rewrite of the old one.)

### Claude Code must stop when

- The correction changes editorial meaning or public semantics.
- A new canonical route, identity, data owner, or source of truth is required.
- Private material may become public.
- The implementation requires weakening an existing schema or validator.
- The ticket would touch indexing controls without explicit authorization.
- The work expands into another sprint's question.
- A destructive migration or difficult-to-reverse operation becomes necessary.

### Unrelated defects

Record them as findings. Do not fix them inside the current ticket unless they block its acceptance criteria. "While here" is not scope.

---

## 8. Sprint contract

A sprint contract must state: Status, Risk ceiling, Branch, Depends on, Unlocks, Core question, Outcome, Inherited truths, Hypotheses to test, Hard constraints, Explicit exclusions, Ticket sequence, Sprint-level acceptance criteria, Validation plan, Stop conditions, Exit state, and Canonical documentation targets.

The exact copyable structure is canonical in `planning/templates/sprint-contract.md` — do not maintain a second authoritative copy of the template body here.

---

## 9. Sealed ticket

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

A ticket must state: Status, Mode, Risk, Branch, Depends on, Unlocks, Goal, Why now, Starting state, Decisions already frozen, Questions this ticket may answer, Scope, Explicit exclusions, Implementation contract, Acceptance criteria, Validation matrix, Adversarial tests, Regression boundaries, Documentation updates, Git and deployment boundary, Stop conditions, Required completion report, and Done when.

The exact copyable structure is canonical in `planning/templates/ticket-contract.md`.

---

## 10. Completion report

A completion report must state: Result, Branch, Commit, Deployment, Outcome, Files changed, Acceptance criteria, Validation performed, Adversarial tests, Deviations from ticket, Newly discovered findings, Regression confirmation, Documentation reconciliation, and Remaining gate.

The exact copyable structure is canonical in `planning/templates/completion-report.md`.

---

## 11. Planner review

After Claude Code returns a report, ChatGPT classifies each result:

| Classification | Meaning | Action |
|---|---|---|
| `SATISFIED` | Contract met with adequate evidence | Advance gate |
| `JUSTIFIED DEVIATION` | Assumption disproved; correction preserves intent | Accept and update downstream plan |
| `DEFECT` | Acceptance criterion failed or evidence missing | Issue corrective ticket |
| `SCOPE DRIFT` | Unnecessary or unauthorized expansion | Revert or isolate before proceeding |
| `NEW FINDING` | Real adjacent work not required now | Add to roadmap or later ticket |
| `BLOCKED` | Requires product decision or authority | Stop and ask Amul |

The review ends with one decision: `ACCEPT`, `ACCEPT WITH FOLLOW-UP`, `RETURN FOR CORRECTION`, or `BLOCKED`.

---

## 12. Documentation-drift gate

Every sprint freeze searches all active instructions, skills, workflows, code comments, and roadmap text for claims invalidated by the sprint.

Required checks include:

- Duplicate headings or duplicated entries.
- "Next," "pending," "not live," "unwired," "not decided," and similar stale state language.
- Old validator counts or pipeline orders.
- Comments describing a component as unused after it gains consumers.
- Workflow prerequisites already completed.
- Roadmap items that shipped but were not removed.
- Canonical rules duplicated across multiple documents with different wording.
- Completion text claiming staging or production verification that did not occur.

The gate updates current instructions but never rewrites historical changelog evidence.

---

## 13. Planning maxim

> The roadmap preserves direction. The program preserves dependency logic. The sprint earns a capability. The ticket constrains execution. The validators prove behavior. The closure freeze moves surviving truth into its canonical home.

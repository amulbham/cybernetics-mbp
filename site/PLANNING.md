# Planning Protocol

**Project:** `amulbham/cybernetics-mbp`
**Scope:** Planning and executing website-development sprints with ChatGPT as planner/reviewer, Amul as product authority, and Claude Code as implementation agent.
**Version:** 1.1
**Calibrated against:** Sprints 7–12, the planned Sprint 13–17 research-object arc, and T13.2's process-efficiency calibration (§13, adopted 2026-09-22).

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

### Clerical repair rule

Closed tickets are immutable in substantive meaning, authorization, implementation evidence, deviations, and outcome. A closed ticket may receive a clerical repair only through a separately sealed corrective ticket when necessary to fix a broken citation, invalid internal reference, typo, or similarly non-substantive defect. The corrective ticket and Git history must preserve traceability.

This does not create permission to reinterpret old authorization, rewrite results, add missing evidence after the fact, change a past deviation, change an outcome, or make historical wording appear current — the Promotion and History rules above still govern all of that.

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

### Proportionality and scope economy

Planning rigor must be proportional to the risk and independence of the work.

The purpose of tickets, gates, and corrective records is to preserve correctness, authority, and traceability — not to maximize procedural granularity.

Use the smallest governance unit that safely contains the work.

**Before seal**: directly adjacent low-risk work may be incorporated into a not-yet-sealed ticket when doing so preserves a clear, unified contract. Such incorporation must not hide a materially different product decision, architecture change, source-of-truth change, privacy boundary, or risk class inside an otherwise unrelated ticket.

**After seal**, a finding may be absorbed into the sealed ticket only when it:

- falls within the ticket's already-authorized surfaces;
- introduces no new product, semantic, architectural, editorial, privacy, or source-of-truth decision;
- introduces no materially different risk;
- can be validated by the ticket's existing acceptance criteria without changing the contract.

Otherwise: defer it, or create a separate ticket. Do not rewrite the sealed contract to make newly discovered work appear pre-authorized.

Examples of work that may reasonably remain inside an appropriate existing gate: removing a duplicate Markdown heading during an already-authorized documentation closure; correcting a clerical typo in an active document already being reconciled; making a narrow implementation-detail correction already required by an existing acceptance criterion.

Create a separate ticket when the finding introduces an independent unit of risk, authority, decision, or verification — for example: a runtime or product defect outside authorized implementation; a new semantic or editorial decision; a route, identity, schema, privacy, indexing, or source-of-truth change; a substantive correction to the historical record of a closed ticket; work that can fail independently and should not contaminate the current ticket's evidence; work belonging to another sprint's core question.

Do not create a ticket solely because a defect exists or because the planning hierarchy has somewhere to put one. Likewise, do not absorb work merely to avoid creating a ticket. The governing test is:

> Does separating this work materially improve safety, authority, traceability, or evidence?

If not, prefer the simpler path.

Evidence depth follows the risk classes in §5 — apply only the minimum evidence required by the actual risk. Reference established validators and procedures when they already provide the required proof; do not reproduce higher-risk validation merely because an earlier ticket used it.

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

Every field above is delta-only and length-capped by risk class — §13 governs both; the exact caps live in the template itself. Inherited truth is referenced (`Inherits: <path> @ <commit>`), never recopied.

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

A `DEFECT` classification does not automatically imply a new ticket. The reviewer first applies the proportionality rule in §7 and determines whether the defect can be safely absorbed by an already-authorized adjacent gate. A new ticket is required when separation materially improves safety, authority, traceability, or evidence, or when the existing sealed contract does not authorize the work.

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

## 13. Process efficiency (2026-09-22 calibration)

Adopted prospectively once `T13.2` closed at `cdb1b10`. Does not rewrite sealed or closed tickets, and does not replace §§1–12 — it tightens how they are applied, in the same spirit as §7's proportionality rule.

### Delta-only contracts

A sealed ticket inherits frozen truth by repository path and commit; it records only the authorized delta.

> An inherited invariant must not be recopied merely because it is important; copy it only when the current ticket changes, constrains, or directly tests it.

Reference inherited truth once — `Inherits: <path> @ <commit>` — instead of restating `PLANNING.md`, `PUBLISHING.md`, `AGENTS.md`, the sprint narrative, or an earlier decision ticket.

### Length caps

Ticket contracts and completion reports are capped by risk (frontmatter/header and the completion report itself excluded from the contract count). Exact limits and the one-sentence exception clause: `planning/templates/ticket-contract.md` and `planning/templates/completion-report.md`. Exceeding a cap never triggers a reconciliation exercise — cut duplication first.

### One-review rule (pre-seal draft review)

Distinct from §11's post-completion Planner review. Before a ticket seals, planner feedback on the *draft* uses three classes:

| Class | Meaning |
|---|---|
| `BLOCKER` | Contract cannot safely seal |
| `REQUIRED` | Must be corrected before seal |
| `OPTIONAL` | Does not delay seal; defer or omit |

Only `BLOCKER`/`REQUIRED` trigger another draft. Once corrected, no further prose-polish cycle unless the correction introduced a new contradiction.

### Commit choreography follows risk

Seal-before-execution (§9) is unchanged. What's proportional is how many commits follow it:

```text
R0 audit                         → normally one completion commit
R1 polish/documentation          → normally one implementation/closure commit
R2/R3, cross-agent execution     → seal commit → implementation commit
                                    (+ closure commit only when post-commit
                                     evidence or canonical-doc promotion
                                     creates new durable truth worth recording)
```

Never commit solely to flip `READY`→`CLOSED`, and never embed a commit's own hash in itself (`git log -1 --format=%H -- <path>` remains the resolution, per existing convention).

### Evidence economy

Do not reproduce evidence an authoritative validator or CI job already generated — reference the command, assertion, commit, or workflow result instead. Repeat a check only when it proves a distinct layer (local / staging / production). Once a named verification bundle (e.g. a `package.json` script composing several checks) exists and is trusted, cite it plus only the ticket-specific delta — never recopy its component commands. Bundle scripts themselves are implemented separately, never inside a docs-only calibration commit.

### Closure economy

Close when acceptance criteria pass, required evidence exists, and surviving truth is in its canonical home. Do not extend execution to polish prose, collect redundant evidence, repair unrelated documentation, restate already-frozen architecture, or open a ticket solely because a defect exists (§7 already governs the last one; restated here because it's the most common closure-scope violation).

### No pre-created downstream tickets

Provisional work stays a short list in the active sprint contract. Do not draft `T{n+1}` until `T{n}` has produced the evidence that determines its actual shape — numbering symmetry is not authorization (extends §4's existing renumbering rule to drafting, not just renumbering).

### One primary development intent at a time

Do not run two primary lines of work as concurrent primary intents (e.g., a new sprint's planning alongside an unclosed one, or a new primary publication alongside unclosed architecture work). Finish or explicitly re-scope the current one first.

---

## 14. Planning maxim

> The roadmap preserves direction. The program preserves dependency logic. The sprint earns a capability. The ticket constrains execution. The validators prove behavior. The closure freeze moves surviving truth into its canonical home.

> Apply the minimum governance necessary for the actual risk. More process is justified only when it materially improves safety, authority, traceability, or evidence.

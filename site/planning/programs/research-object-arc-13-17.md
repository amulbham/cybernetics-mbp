# Research Object Program — Sprints 13–17

**Status:** PROVISIONAL
**Depends on:** Sprint 12 closure
**Next authorization gate:** none. `T14.0` and `T14.1` are closed. Sprint 14 stays open. `T14.2` is not authorized. Sprint 13 is closed (`planning/sprints/sprint-13-iwl-foundation.md`). Production behavior was verified at `ca67561`. The pre-sprint repo state is `fbe9389`. The Sprint 14 contract is authoritative for this sprint.
**Authority:** Directional program plan, not an implementation contract
**Program owner:** Amul Bham

This file preserves the long-range dependency arc. It may propose likely ticket sequences, but no sprint-level implementation contract becomes authorized until the preceding evidence gate is satisfied.

---

## Program invariant

Sprints 13–16 define the knowledge system. Sprint 17 only tests whether a CMS deserves permission to edit it.

```text
13 → CONTAINER
14 → DECOMPOSITION / CORROBORATION
15 → GRAMMAR
16 → GENERALIZATION
17 → INTERFACE PRESERVATION
```

No later sprint may reach backward and dictate the model of an earlier one. In particular:

- Sprint 15 must not invent an ontology before Sprint 14 produces a real fixture.
- Sprint 17 must not simplify the content/IWL model merely to fit Keystatic.
- Public machine semantics may remain thinner than internal product truth.
- Absence remains valid: not every research object requires Reader Context or an IWL.

---

## Sprint 13 — IWL Foundation

**Status:** CLOSED. Present-tense authority is `planning/sprints/sprint-13-iwl-foundation.md`. Production behavior was verified at `ca67561`. Closure documentation is in the closed repo state `fbe9389`. The sequence below is retained as program direction, not as open authorization.

**Core question:** What is the minimum architecture required for an Intellectual Work Ledger (IWL) to exist beside a published Article without pretending its internal grammar is already known?

**Risk ceiling:** R3, because canonical routing, publication identity, search/index behavior, and public/private boundaries may be affected.

**Governing opaque-body rule:** Sprint 13 may render the real Chisel IWL body as authored document content, but freezes only the outer envelope (parent Article association, title/minimal publication metadata, visibility/publication state, authored body). The four surfaces the current IWL fixture happens to contain — Development Ledger, Decision Record, Authorial Accountability, Dependency/Proof Chain — are evidence informing the audit, not schema fields merely because the fixture contains them.

**Presence and publication are separate states.** The architecture must reason about at least three states — no IWL source; source exists but is not publication-authorized; source exists and is publication-authorized — never collapsed into one boolean. Merely existing in source is not equivalent to being public.

**Evidence fixtures**: Fixture A is the current production architecture (`main @ ce93ade`, owning current routing, Article identity, Reader Context, PDFs, Pagefind, relations, semantic validation, deployment, and indexing). Fixtures B and C are real `.docx` files — `ChiselFallacy_v6.docx` (Article) and `ChiselFallacy_IWL_v2.docx` (IWL) — real, architecturally representative, near-final, but their editorial near-final status never implies production authorization by itself.

**Ticket sequence** (supersedes the prior `T13.0`–`T13.6` table directionally; do not preserve old numbering for symmetry):

| Ticket | Mode | Risk | Purpose | Authorization |
|---|---|---:|---|---|
| `T13.0` | AUDIT | R0 | Reality audit using production architecture + Chisel Article/IWL fixtures | CLOSED |
| `T13.1` | DECISION | R1 | Freeze outer Article/IWL contract | CLOSED |
| `T13.2` | IMPLEMENTATION | R3 | Implement minimal envelope, presence/publication state, route, plain shell, navigation | CLOSED |
| `T13.3` | VALIDATION | R2/R3 | Adversarial QA of fixture + true absence + unpublished-source state + regressions | CLOSED |
| `T13.4` | RELEASE | R3 | Production promotion + Sprint 13 closure freeze | CLOSED |

**Inherited truths**

- The Article remains the primary scholarly object; the IWL may have a canonical page of its own while remaining subordinate to exactly one valid parent Article and incapable of public existence without it.
- IWL presence is optional; true absence produces no placeholder route or navigation.
- Source existence and publication authorization are distinct states.
- The IWL is public curated intellectual provenance, not raw process dumping — chats, hidden model reasoning, chain-of-thought, credentials, or private notes are never presumed publishable.
- Public machine semantics may remain thinner than internal product truth; semantic silence is valid.
- No IWL PDF has yet been earned. Existing indexing policy remains untouched. No inner IWL grammar is authorized in Sprint 13. Keystatic remains downstream of Sprints 13–16.

**Hard constraints** — Sprint 13 must not: define node types or edge vocabulary; formalize epistemic statuses; make the four IWL surfaces schema objects; auto-generate provenance; publish raw model interactions or private development material; make IWL presence universal; duplicate Article canonical route truth; make an IWL a peer primary scholarly object; add an IWL PDF for symmetry; let Schema.org dictate internal architecture; alter external indexing policy; weaken existing schemas/validators; simplify the future model for Keystatic.

**Exit state** — full Sprint 13 lifecycle: `T13.0` (where can the IWL live?) → `T13.1` (freeze the outer contract) → `T13.2` (make one real IWL exist safely, body treated as opaque authored content) → `T13.3` (prove public/unpublished/absent states, protect existing research architecture) → `T13.4` (production + closure freeze, Sprint 14 unlocked).

---

## Sprint 14 — IWL Decomposition & Corroboration

**Status:** ACTIVE. Contract: `planning/sprints/sprint-14-iwl-decomposition-corroboration.md`. `T14.0` and `T14.1` are closed. `T14.2` stays unwritten. Redirected 2026-09-22 from "build the first public Chisel IWL": that IWL already existed, and Sprint 13 published it.

**Core question:** What semantic structure can actually be observed when the authored Chisel IWL is compared with the development evidence it claims to represent?

**Risk ceiling:** R3, because raw research history may contain private, sensitive, misleading, or chain-of-thought-like material.

**The evidence relation:**

```text
DEVELOPMENT EVIDENCE ──────┐
                           ├── corroboration + decomposition
AUTHORED IWL v2 ───────────┘
                           ↓
                   OBSERVED STRUCTURE
                           ↓
                   CANDIDATE GRAMMAR
```

Raw chats or model reasoning may be inspected privately only when explicitly authorized and necessary for this corroboration; they are never presumed publication material. Sprint 14 compares private development evidence against the already-authored public IWL — it does not publish the private corpus by default.

**Public provenance filter** (still applicable to whatever new material this comparison surfaces):

```text
PUBLIC → necessary and safe to expose
SUMMARIZE → preserve the intellectual event without raw private detail
REDACT → exclude sensitive content but record the public consequence if useful
PRIVATE → never enter the public IWL
```

Raw chain-of-thought and hidden model reasoning are always `PRIVATE`; the ledger may publish concise conclusions, decisions, evidence references, or verification outcomes derived from authorized artifacts.

The prior `T14.0`–`T14.6` sequence (gather artifacts → private chronology → candidate classes → hand-construct the first public IWL) is superseded. It assumed the IWL did not exist. `T14.0` and `T14.1` are closed. Numbering symmetry does not authorize `T14.2`.

**Exit state** (reconciled 2026-09-23; the previous exit asked this sprint to construct the public IWL and enumerate node/state/edge types)

```text
meaningful Chisel IWL records are mapped against authorized development evidence
gaps, contradictions, and unexamined rows stay explicit
the four layers are assessed as editorial views for this fixture only
retrospective rationale stays distinct from observable draft changes
private evidence stays out of the public repository
no inner grammar, validator, or public machine semantics is frozen
Sprint 15 receives observations and unresolved questions, not an ontology
```

---

## Sprint 15 — IWL Schema v1

**Core question:** What minimum grammar does the Chisel fixture justify?

**Risk ceiling:** R2, rising to R3 if the schema changes public routes or machine identity.

**Ticket sequence**

| Ticket | Mode | Purpose | Gate |
|---|---|---|---|
| `T15.0` | AUDIT | Decompose every meaningful public Chisel unit and record classification ambiguity | Full fixture accounted for |
| `T15.1` | DECISION | Define minimum node types and distinguish type from lifecycle state | No redundant type/state encoding |
| `T15.2` | DECISION | Define edge vocabulary, semantics, directionality, symmetry, cardinality, and cycle rules | Each edge has explicit meaning and failure cases |
| `T15.3` | DECISION | Define status/order/supersession behavior and provenance classes | Chronology does not imply causality |
| `T15.4` | IMPLEMENTATION | Implement strict source schema and fail-closed validation | Unique IDs, referential integrity, enums, and edge-specific constraints enforced |
| `T15.5` | IMPLEMENTATION | Migrate Chisel into the formal representation | Zero fixture meaning lost to fit the schema |
| `T15.6` | IMPLEMENTATION | Build prose-first rendering with only earned structured views | No mandatory giant graph or dashboard |
| `T15.7` | VALIDATION | Adversarial mutations, artifact QA, and v1 contract freeze | Chisel validates and renderer consumes the same contract |

**Required modeling distinctions**

- Object identity versus object state.
- Chronological order versus causal dependency.
- Source-backed evidence versus author interpretation.
- Hypothesis versus verified claim.
- Contradiction versus uncertainty.
- Supersession versus deletion.
- Directed, symmetric, and cyclically permissible relationships.

**Exit state**

```text
IWL schema v1 exists
Chisel validates without distortion
typed relationships have explicit semantics
validator fails closed
renderer consumes the contract
public and private provenance remain separated
```

---

## Sprint 16 — Corpus Generalization

**Core question:** Does the Chisel-derived grammar survive heterogeneous research it was not designed around?

**Risk ceiling:** R2.

**Ticket sequence**

| Ticket | Mode | Purpose | Gate |
|---|---|---|---|
| `T16.0` | AUDIT | Select structurally diverse rollout fixtures and define why each tests a different pressure | Selection is not convenience-based |
| `T16.1` | IMPLEMENTATION | Build the second IWL without immediately changing v1 | Every mismatch enters a pressure log first |
| `T16.2` | AUDIT | Classify pressures as fixture error, missing field/type/edge, bad abstraction, or presentation issue | Schema and UI concerns remain separate |
| `T16.3` | IMPLEMENTATION | Build one or more additional selective fixtures where they add distinct evidence | No universal IWL requirement |
| `T16.4` | VALIDATION | Test cross-object semantic consistency, links, states, and rendering | Same label means the same thing everywhere |
| `T16.5` | AUDIT | Conduct reader-usefulness tests against concrete provenance questions | Avoid provenance theater |
| `T16.6` | AUDIT | Test machine usefulness through stable IDs, typed nodes/edges, state, and parent identity | No oversized public ontology required |
| `T16.7` | DECISION | Revise to v1.1 only where repeated or severe evidence warrants it; otherwise freeze v1 | All changes linked to fixture evidence |

**Schema-change discipline**

The first awkward case is recorded before the grammar changes. Immediate change is justified only when the current schema makes a false assertion, loses material meaning, or permits unsafe invalid state. Otherwise, seek recurrence across heterogeneous fixtures before expanding the grammar.

**Eligibility principle**

> An IWL exists when meaningful intellectual construction history is available and its publication adds inspectability.

It is never required merely for structural symmetry.

**Exit state**

```text
multiple heterogeneous IWLs exist
pressure log is resolved or explicitly deferred
eligibility rule is evidence-backed
v1 or v1.1 is frozen
human and machine usefulness have been tested separately
```

---

## Sprint 17 — Keystatic Compatibility Spike

**Core question:** Can Keystatic act as an interface over the research system without becoming its source of truth?

**Mode:** SPIKE
**Risk ceiling:** R3, because a CMS can silently rewrite authored source or pressure canonical models.

**Ticket sequence**

| Ticket | Mode | Purpose | Gate |
|---|---|---|---|
| `T17.0` | AUDIT | Freeze a field-by-field and artifact-by-artifact preservation matrix | Every tested truth has an owner and oracle |
| `T17.1` | SPIKE | Configure Keystatic on an isolated branch/fixture set; test paper, essay, and memo authoring | No production-content migration |
| `T17.2` | SPIKE | Test Reader Context complete-or-absent behavior | Blank/partial states cannot masquerade as absence or validity |
| `T17.3` | SPIKE | Test canonical relation and projection registries | Dangling or normalized-away relationships fail |
| `T17.4` | SPIKE | Test IWL nodes, edges, status, order, and provenance | Giant unusable forms are evidence against broad CMS ownership |
| `T17.5` | VALIDATION | Run byte/semantic Markdown round trips on representative structures | No silent destructive rewrite |
| `T17.6` | VALIDATION | Run build, relation/link/semantic/PDF validators, routing checks, and Git ownership checks | Existing pipeline remains authoritative |
| `T17.7` | DECISION | Classify each domain as CMS-managed, file-native, or unsupported | Mixed authoring is explicitly allowed |
| `T17.8` | DECISION | Record PASS, PARTIAL, or FAIL and define whether Sprint 18 is authorized | Failure is a valid successful spike result |

**Preservation matrix minimum**

| Domain | Required test |
|---|---|
| Strict content schema | Invalid and extra fields still fail closed |
| Reader Context | Absence remains true absence; presence requires `why` and `for` |
| Authored Markdown | Save without destructive normalization |
| Citations and anchors | Transforms and inline destinations survive round trip |
| Research primitives | Syntax and rendered semantics remain intact |
| Canonical routing | No hand-authored or CMS-owned competing route truth |
| Relations | IDs, types, direction, optional inline state, anchors, and `near` survive |
| Semantic projections | Separate registry and editorial authorization remain separate |
| IWL | Node/edge/state/provenance grammar remains lossless and usable |
| PDFs | The existing build and validation pipeline remains green |
| Git ownership | Ordinary files remain the durable source of truth |

**Decision outcomes**

```text
PASS
Keystatic can manage the architecture broadly.
Sprint 18 may proceed.

PARTIAL
Keystatic may manage bounded article/frontmatter domains.
Specialized relation and/or IWL systems remain file-native.
Sprint 18 requires an explicit bounded ownership contract.

FAIL
Keystatic pressures or damages the architecture.
File-native authoring remains the system.
No Sprint 18.
```

**Automatic failure conditions**

- Weakening schemas or validators.
- Duplicating canonical data.
- Moving truth into CMS-only state.
- Changing canonical routes to satisfy the CMS.
- Flattening typed relationships or provenance semantics.
- Accepting lossy Markdown rewrites.
- Requiring migration before compatibility is proved.

---

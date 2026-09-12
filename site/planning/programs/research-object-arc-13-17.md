# Research Object Program — Sprints 13–17

**Status:** PROVISIONAL
**Depends on:** Sprint 12 closure
**Next authorization gate:** T13.0 — IWL architecture audit
**Authority:** Directional program plan, not an implementation contract
**Program owner:** Amul Bham

This file preserves the long-range dependency arc. It may propose likely ticket sequences, but no sprint-level implementation contract becomes authorized until the preceding evidence gate is satisfied.

---

## Program invariant

Sprints 13–16 define the knowledge system. Sprint 17 only tests whether a CMS deserves permission to edit it.

```text
13 → CONTAINER
14 → OBSERVATION
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

**Core question:** What is the minimum architecture required for an Intellectual Work Ledger to exist beside an Article without pretending its internal grammar is already known?

**Risk ceiling:** R3, because canonical routing, publication identity, search/index behavior, and public/private boundaries may be affected.

**Inherited truths**

- The Article is the finished intellectual result and remains the primary scholarly object.
- The IWL is public, curated intellectual provenance — not a changelog, chain-of-thought transcript, raw lab notebook, or second article.
- Optional presence must produce genuine absence: no empty navigation or placeholder shell.
- Internal product truth outranks available Schema.org vocabulary.
- The site remains intentionally deindexed unless Amul explicitly changes that separately.

**Ticket sequence**

| Ticket | Mode | Purpose | Gate |
|---|---|---|---|
| `T13.0` | AUDIT | Inspect Chisel and at least one published project; answer identity, route, privacy, search, PDF, navigation, and source-model questions | Audit produces an evidence matrix; zero runtime diff |
| `T13.1` | DECISION | Freeze the outer Article/IWL contract and public-provenance boundary | Amul approves unresolved product decisions |
| `T13.2` | IMPLEMENTATION | Establish the minimal co-located source/detection contract for one fixture | Presence/absence works without authored route duplication |
| `T13.3` | IMPLEMENTATION | Build the deliberately plain IWL route, shell, parent identity, and bidirectional human navigation | No empty links; Article remains canonical primary object |
| `T13.4` | DECISION or IMPLEMENTATION | Evaluate `hasPart`/`isPartOf` and ship only the truthful, earned projection, if any | Semantic validator migrates atomically with emitted semantics |
| `T13.5` | VALIDATION | Adversarial, route, responsive, accessibility, search/index, PDF, and corpus QA; freeze the outer contract | Full chain and staging gate pass |
| `T13.6` | RELEASE | Promote and verify production if 13.5 passes | Canonical docs current; production independently verified |

**Key ordering correction:** the source/detection contract precedes the shell that consumes it. This prevents an empty route shell from implicitly dictating how IWL existence is authored.

**Explicit exclusions**

- No frozen node or edge vocabulary.
- No auto-generation.
- No graph UI, timeline system, or large component family.
- No IWL PDF unless the audit produces a concrete need.
- No hidden reasoning, credentials, private notes, or raw model output.

**Exit state**

```text
Article/IWL pairing exists
canonical subordinate route exists
human navigation exists only when earned
one fixture can render through a plain shell
public provenance boundary is explicit
internal ledger grammar remains deliberately open
```

---

## Sprint 14 — Chisel IWL Fixture

**Core question:** What public provenance objects and relationships actually occurred during one real research process?

**Risk ceiling:** R3, because raw research history may contain private, sensitive, misleading, or chain-of-thought-like material.

**Ticket sequence**

| Ticket | Mode | Purpose | Gate |
|---|---|---|---|
| `T14.0` | AUDIT | Gather Chisel artifacts and create a private inventory with provenance and sensitivity labels | No artifact becomes public |
| `T14.1` | AUDIT | Build a private chronological reconstruction | Chronology distinguishes observed sequence from inferred causality |
| `T14.2` | AUDIT | Identify candidate object classes and state transitions from recurring evidence | Categories remain candidates, not schema |
| `T14.3` | AUDIT | Identify observed relationship types, directionality, and ambiguous cases | No standardized edge vocabulary yet |
| `T14.4` | DECISION | Perform editorial selection, privacy/redaction review, and public-provenance boundary check | Every public item is intentionally authorized |
| `T14.5` | IMPLEMENTATION | Hand-construct the first public Chisel IWL in prose-first form | No automatic generation or schema-driven theater |
| `T14.6` | VALIDATION | Adversarial reader review and fixture freeze | Reader can distinguish evidence, interpretation, uncertainty, rejection, and survival |

**Public provenance filter**

Every candidate record must be classified before publication:

```text
PUBLIC → necessary and safe to expose
SUMMARIZE → preserve the intellectual event without raw private detail
REDACT → exclude sensitive content but record the public consequence if useful
PRIVATE → never enter the public IWL
```

Raw chain-of-thought and hidden model reasoning are always `PRIVATE`; the ledger may publish concise conclusions, decisions, evidence references, or verification outcomes derived from authorized artifacts.

**Exit state**

```text
one manually constructed public IWL exists
private chronology remains separate
candidate node/state/edge types are enumerated
awkward and unclassifiable cases are preserved as evidence
fixture is ready for decomposition, not yet forced into a schema
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

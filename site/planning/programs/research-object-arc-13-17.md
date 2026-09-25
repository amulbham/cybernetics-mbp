# Research Object Program — Sprints 13–17

**Status:** PROVISIONAL
**Depends on:** Sprint 12 closure
**Next authorization gate:** none. Sprint 15 is closed on OPAQUE V1 (`planning/sprints/sprint-15-minimum-iwl-formalization.md`). No next sprint is authorized. Sprint 14 is closed (`planning/sprints/sprint-14-iwl-decomposition-corroboration.md`). Sprint 13 is closed (`planning/sprints/sprint-13-iwl-foundation.md`). Production behavior was verified at `ca67561`. The pre-Sprint-14 repo state is `fbe9389`.
**Authority:** Directional program plan, not an implementation contract
**Program owner:** Amul Bham

This file preserves the long-range dependency arc. It may propose likely ticket sequences, but no sprint-level implementation contract becomes authorized until the preceding evidence gate is satisfied.

---

## Program invariant

The original arc below is historical. Current position: Sprints 13–15 are closed. Sprint 15 closed as OPAQUE V1, not as an inner grammar. Sprint 16 is optional and not authorized. The Sprint 17 Keystatic label is deferred post-MVP and unscheduled. It is not renumbered.

```text
13 → CONTAINER                         closed
14 → DECOMPOSITION / CORROBORATION   closed
15 → OPAQUE V1                       closed; not an inner schema
16 → second-IWL generalization       optional, not authorized
17 → Keystatic                      deferred post-MVP, unscheduled
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

**Status:** CLOSED at T14.2. Contract: `planning/sprints/sprint-14-iwl-decomposition-corroboration.md`. `T14.0`, `T14.1`, and `T14.2` are closed. Sprint 15 later closed on OPAQUE V1. Redirected 2026-09-22 from "build the first public Chisel IWL": that IWL already existed, and Sprint 13 published it.

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

The prior `T14.0`–`T14.6` sequence (gather artifacts → private chronology → candidate classes → hand-construct the first public IWL) is superseded. It assumed the IWL did not exist. Sprint 14 closed on the evidence it had: `T14.0`, `T14.1`, and `T14.2`. Numbering symmetry does not authorize a Sprint 15 ticket.

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

## Sprint 15 — Minimum IWL Formalization

**Status:** CLOSED on OPAQUE V1 at T15.1. Contract: `planning/sprints/sprint-15-minimum-iwl-formalization.md`.

The previous `T15.0`–`T15.7` sequence (decompose every unit, then define node types, edge vocabulary, statuses, a strict schema, a Chisel migration, structured views, and a v1 freeze) is superseded. It required an inner grammar before any necessity test. Numbering does not restore it.

**Exit achieved:** the typed outer envelope stays authoritative. The inner body stays prose-first authored Markdown. No inner machine schema was earned for the current MVP. Reopen inner formalization only when a later accepted operation demonstrably cannot be performed, or becomes unsafe or meaning-losing, after the outer contract and an appropriate editorial convention have been tried.

---

## Sprint 16 — Corpus Generalization

**Status:** OPTIONAL / NOT AUTHORIZED. It runs before launch only if a genuinely different second intellectual history exists and product authority chooses to use it as a generalization test. One live OPAQUE V1 companion is sufficient for the MVP.

Earlier direction, collapsed so it is not a queue: an eight-ticket sequence, `T16.0`–`T16.7`, assumed a Chisel-derived schema, a second IWL, further fixtures, and a possible v1.1. That assumption is superseded by OPAQUE V1. The old eligibility sentence still holds as direction: an IWL exists when meaningful intellectual construction history is available and its publication adds inspectability. It is never required merely for structural symmetry.

---

## Sprint 17 — Keystatic Compatibility Spike

**Status:** DEFERRED POST-MVP / UNSCHEDULED. The Keystatic label stays Sprint 17 and is not renumbered. It is not the next pre-launch step.

Historical direction, collapsed so it is not a queue: `T17.0`–`T17.8` asked whether Keystatic could sit over the research system without becoming source of truth. Failure was a valid result. The old preservation matrix included an IWL row that assumed a node/edge/state grammar. OPAQUE V1 did not earn that grammar. No Sprint 18 or 19 contract is created.

---

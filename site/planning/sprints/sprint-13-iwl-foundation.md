# Sprint 13 — IWL Foundation

Status: AUDITING
Risk ceiling: R3 (canonical routing, publication identity, search/index behavior, and public/private boundaries may be affected — no ticket has exercised this ceiling yet; `T13.0` runs at R0)
Branch: staging
Depends on: Sprint 12 closure (Reader Context — `readerNote`, `FromTheAuthor`, `audience` projection, all production-verified at `main @ b64e381`)
Unlocks: the outer Article/IWL contract decision (`T13.1`) and, downstream, Sprint 14's decomposition/corroboration work against the already-authored Chisel IWL

**Ticket disposition**: `T13.0` READY (sealed, not yet executed) · `T13.1`–`T13.4` PROVISIONAL, not sealed. Only `T13.0` is authorized as of this contract. `T13.1` must be written from `T13.0`'s real audit findings, not pre-sealed alongside it.

## Core question

What is the minimum architecture required for an Intellectual Work Ledger (IWL) to exist beside a published Article without pretending its internal grammar — node types, edge vocabulary, statuses, epistemic ontology, chronology model, supersession rules, graph model — is already known?

## Outcome

A minimal, truthful outer container: an IWL can be associated with exactly one parent Article, can exist in one of three states (no source; source exists but is not publication-authorized; source exists and is publication-authorized), has a canonical route and identity of its own, renders through a deliberately plain shell with earned human navigation, stays outside internal search/index scope until the audit says otherwise, and produces no public machine semantics beyond what is truthfully earned — all while the IWL's internal body (the four surfaces observed in the real fixture: Development Ledger, Decision Record, Authorial Accountability, Dependency/Proof Chain) remains opaque authored content, not schema.

```text
Article (canonical, primary scholarly object)
   |
   | optional, at most one
   v
IWL (subordinate, own route, own identity)
   state: ABSENT | SOURCE-EXISTS-UNPUBLISHED | SOURCE-EXISTS-PUBLISHED
   body: opaque authored content (internal grammar stays open)
```

## Governing opaque-body rule

The IWL's authored body may be rendered as content, but its internal structure — the four surfaces the real fixture happens to contain, and any headings/tables/records within them — are evidence informing the outer-architecture audit, not ontology. They must not become schema fields, enums, or component boundaries in this sprint.

## Evidence fixtures

- **Fixture A** — current production architecture, `main @ ce93ade`. Owns current routing, Article identity, Reader Context, PDFs, Pagefind, relations, semantic validation, deployment, and indexing.
- **Fixture B** — `ChiselFallacy_v6.docx` (the Chisel Article). Real, architecturally representative, near-final. NOT production-authorized.
- **Fixture C** — `ChiselFallacy_IWL_v2.docx` (the Chisel IWL). Real, architecturally representative, near-final. NOT production-authorized.

Fixtures B and C are read-only audit evidence. They must never be committed to the repository, and must never be mined during Sprint 13 for formal node types, edge enums, status enums, provenance classes, epistemic schema, timeline schema, or dependency ontology — only for outer-architecture pressure (identity, route, source ownership, presence/publication state, envelope, rendering boundary, navigation, search, privacy, PDF, public semantics).

## Presence and publication are separate states

An IWL's existence in source and its public availability are never collapsed into one boolean. The architecture must reason about at least three states:

```text
ABSENT                    — no IWL source exists for this Article
SOURCE-EXISTS-UNPUBLISHED — IWL source exists but is not authorized for public display
SOURCE-EXISTS-PUBLISHED   — IWL source exists and is authorized for public display
```

## Inherited truths

- The Article is the finished intellectual result and remains the primary scholarly object; an IWL, even with its own canonical route, stays subordinate to exactly one valid parent Article and cannot exist publicly without one.
- The IWL is public, curated intellectual provenance — not a changelog, chain-of-thought transcript, raw lab notebook, or second article.
- Optional presence must produce genuine absence: no empty navigation, no placeholder shell, no route that resolves to nothing meaningful.
- Source existence and publication authorization are distinct states — a real, near-final `.docx` fixture existing is not equivalent to it being public.
- Internal product truth outranks available Schema.org vocabulary — public machine semantics may stay thinner than internal truth, and semantic silence is an acceptable, already-precedented outcome (Sprint 12's `backstory` decision).
- The site remains intentionally deindexed unless Amul explicitly changes that separately; Sprint 13 does not alter `SITE_WIDE_NOINDEX`/`robots.txt`.
- No IWL PDF has yet been earned; existing PDF pipeline and validation stay untouched unless the audit surfaces a concrete need.
- No inner IWL grammar (node types, edge vocabulary, statuses, epistemic ontology, chronology model, supersession rules, graph model) is authorized in Sprint 13 — that work is explicitly deferred to Sprint 15 (GRAMMAR) at the earliest, after Sprint 14's decomposition/corroboration pass.
- Keystatic remains downstream of Sprints 13–16 (per `ROADMAP.md`'s existing note) — nothing in Sprint 13 may simplify the future model to make an eventual authoring layer easier.
- Real production evidence (Fixture A, `main @ ce93ade`) already carries all of the Sprint 11–12 invariants: canonical Person identity, DOI/publisher, relation-projection contract, independent semantic validator, Reader Context — all live and unchanged going into this sprint.

## Hypotheses to test

Not yet decisions — `T13.0`'s job is to produce evidence for `T13.1` to decide against, not to assume any of these:

- **H1** — the IWL can be a genuine content-collection sibling to `research`, reusing the same routing/discovery machinery rather than inventing a parallel system.
- **H2** — presence/publication state can be expressed through the same co-located source/frontmatter convention the `research` collection already uses, without a new out-of-band flag file.
- **H3** — the IWL route can be a subordinate path under its parent Article's own canonical URL, rather than a sibling top-level route.
- **H4** — the plain IWL shell can reuse substantial parts of `ArticleShell.astro`/`ResearchLayout.astro` rather than requiring a parallel layout family.
- **H5** — Pagefind should exclude IWL content from Sprint 13 onward until a deliberate decision says otherwise, matching the "internal search scope" default of the existing corpus.
- **H6** — no public JSON-LD relation between Article and IWL is earned in Sprint 13; that projection, if any, is deferred the same way `audience`/`backstory` were separated and decided one at a time in Sprint 12.

## Hard constraints

Sprint 13 must not:

- Define node types or edge vocabulary for the IWL's internal grammar.
- Formalize epistemic statuses (verified/rejected/superseded/etc.) as schema.
- Make the four observed IWL surfaces (Development Ledger, Decision Record, Authorial Accountability, Dependency/Proof Chain) schema objects or component boundaries.
- Auto-generate provenance from any source.
- Publish raw model interactions, hidden reasoning, chain-of-thought, credentials, or private development material.
- Make IWL presence universal or infer it algorithmically — it remains author-edited, exactly like `readerNote`'s eligibility rule.
- Duplicate Article canonical-route truth (`research-routing.ts` stays the single source of routing truth).
- Make an IWL a peer primary scholarly object to the Article it belongs to.
- Add an IWL PDF for symmetry with Article PDFs.
- Let Schema.org vocabulary availability dictate internal architecture decisions.
- Alter external indexing policy (`SITE_WIDE_NOINDEX`/`robots.txt`).
- Weaken any existing schema, validator, or independent-oracle discipline established in Sprints 7–12.
- Simplify the future internal model in anticipation of Keystatic.
- Commit either `.docx` fixture, or any verbatim extract long enough to reconstruct one, into the repository.
- Mine the fixtures for anything beyond outer-architecture pressure (see "Evidence fixtures" above).

## Explicit exclusions

- Frozen node/edge vocabulary or graph model — out of this sprint, belongs to Sprint 15 (GRAMMAR) at the earliest.
- IWL PDF generation.
- Graph UI, timeline system, or any large component family beyond the plain shell.
- Public provenance selection/redaction work on real Chisel development history — that is Sprint 14's (decomposition/corroboration), not Sprint 13's.
- Production promotion of any Sprint 13 work before `T13.4`.

## Ticket sequence

| Ticket | Mode | Risk | Purpose | Depends on | Gate |
|---|---|---|---|---|---|
| `T13.0` | AUDIT | R0 | Reality audit — production architecture + Chisel Article/IWL fixtures; produce evidence matrix, state matrix, ≤3 candidate outer architectures, `T13.1` decision queue, explicitly-open inner-grammar list | Sprint 12 closure | Zero runtime diff; audit-only — AUTHORIZED, currently executing |
| `T13.1` | DECISION | R1 | Freeze the outer Article/IWL contract from `T13.0`'s real findings | T13.0 | Amul approves unresolved product decisions — PROVISIONAL, not yet written |
| `T13.2` | IMPLEMENTATION | R3 | Minimal envelope: presence/publication state, route, plain shell, navigation | T13.1 | Build/validator regression green, deployed-staging verified — PROVISIONAL |
| `T13.3` | VALIDATION | R2/R3 | Adversarial QA — fixture rendering, true absence, unpublished-source state, full regression | T13.2 | Local/CI/staging all green, zero defects — PROVISIONAL |
| `T13.4` | RELEASE | R3 | Production promotion + Sprint 13 closure freeze | T13.3 | Production independently verified, Sprint 14 unlocked — PROVISIONAL |

## Sprint-level acceptance criteria

- The three-state presence/publication model (ABSENT / SOURCE-EXISTS-UNPUBLISHED / SOURCE-EXISTS-PUBLISHED) is real and demonstrable at every ticket from `T13.2` onward, never collapsed to a boolean.
- No ticket in this sprint formalizes internal IWL grammar — every internal-structure question surfaced by the fixtures is recorded as explicitly open, not resolved.
- Neither `.docx` fixture, nor content mined from them beyond outer-architecture pressure, ever enters the committed repository.
- The Article remains the sole primary scholarly object and sole owner of canonical routing truth throughout.

## Validation plan

- `T13.0`: `git diff --check`, `npm run build`; any temporary local probes fully reverted with proven zero diff before closure.
- `T13.2` onward: full existing validation chain (`npm run build`, `build:pdfs`, `validate:pdfs`, `validate-research-semantics.mjs`), real headless-Chrome viewport/accessibility measurement for shell-affecting changes, deployed-staging verification before any ticket closes.
- `T13.4`: full production-parity verification matching T12.4's precedent (human matrix, semantic matrix, reading-shell smoke test, PDF regression, canonical/Person/DOI/relation regression, indexing-state regression).

## Stop conditions

- If either Chisel fixture becomes unavailable at any point in the sprint — stop and request them again; do not proceed on memory or reconstruction.
- If any ticket would require inferring IWL presence or publication state algorithmically rather than from an explicit author-edited signal — return to Amul.
- If projecting any Article↔IWL relationship into public JSON-LD would require stretching a Schema.org property's real meaning — stop and prefer silence, per the standing Sprint 12 precedent.
- If `T13.1`'s decision would require freezing any inner-grammar element ahead of Sprint 15 — stop; that decision does not belong to this sprint.

## Exit state

- What must be true when Sprint 13 closes: outer Article/IWL contract frozen and shipped to production; one real IWL (the Chisel fixture, publication-authorization state to be decided at `T13.1`) can exist through the envelope without runtime error; true absence remains genuinely empty on every other piece; internal grammar remains fully open.
- What remains deliberately open past this sprint: node/edge vocabulary, epistemic ontology, chronology/supersession model, graph model, any Article↔IWL public JSON-LD relation, IWL PDF, Keystatic authoring layer.

## Canonical documentation targets

- `CHANGELOG.md` — one entry per closed ticket.
- `ROADMAP.md` — Sprint 13 in-progress bullet, updated as tickets close.
- `planning/programs/research-object-arc-13-17.md` — the provisional 13–17 program arc, reconciled 2026-09-22 to match this contract's ticket sequence and Sprint 14's redirected framing.
- `PUBLISHING.md`/`AGENTS.md` — updated once `T13.1` freezes real architecture decisions; not before.

# Sprint 13 — IWL Foundation

Status: EXECUTING
Risk ceiling: R3 (canonical routing, publication identity, search/index behavior, and public/private boundaries may be affected — no ticket has exercised this ceiling yet; `T13.0` runs at R0)
Branch: staging
Depends on: Sprint 12 closure (Reader Context — `readerNote`, `FromTheAuthor`, `audience` projection, all production-verified at `main @ ce93ade`)
Unlocks: the outer Article/IWL contract decision (`T13.1`) and, downstream, Sprint 14's decomposition/corroboration work against the already-authored Chisel IWL

**Ticket disposition**: `T13.0` CLOSED · `T13.1` CLOSED (outer Article/IWL contract frozen, all 8 decisions accepted as recommended — see its Final Decision Record) · `T13.2` CLOSED (outer envelope implemented on staging, one real Article/IWL pair live — "The Chisel Fallacy: What Pangram Actually Measures," the first `ai-systems` paper) · `T13.3` READY (sealed, validation authorized) · `T13.4` PROVISIONAL, not sealed — drafted only if `T13.3`'s evidence earns it.

## Frozen outer contract (T13.1)

```text
research collection
└── Article — primary scholarly identity

iwl collection
└── IWL
    ├── parent: reference('research'), required, exactly one
    ├── title: string, required
    ├── publicationState: 'unpublished' | 'published', no default/inference
    ├── pubDate: required iff published
    └── opaque authored body

route:      /research/{category}/{slug}/iwl/  (derived from parent's canonicalPath, not authored)
search:     published IWL indexed normally by existing Pagefind — no new opt-out
navigation: Article→IWL in the existing after-title region (conditional, no placeholder);
            IWL→Article via an explicit "Companion to: <title>" link
licensing:  inherits sitewide LICENSE (CC BY-NC 4.0) — no per-object license field;
            Chisel fixtures' own "CC BY 4.0" text must be reconciled before publication
semantics:  deliberate silence — no Article↔IWL JSON-LD relation this sprint
Article:    stays free of authored IWL metadata; link is derived at build time, not authored
PDF:        none — IWL never enters the scholarly PDF pipeline
```

Full rationale for each decision: `planning/tickets/T13.1-iwl-outer-contract-decision.md`'s Final Decision Record. Inner grammar (the four surfaces, edge/node vocabulary, epistemic status, chronology) remains explicitly open — inherited by Sprint 15+, not this sprint.

## Core question

What is the minimum architecture required for an Intellectual Work Ledger (IWL) to exist beside a published Article without pretending its internal grammar — node types, edge vocabulary, statuses, epistemic ontology, chronology model, supersession rules, graph model — is already known?

## Outcome

A minimal, truthful outer container: an IWL can be associated with exactly one parent Article, can exist in one of three states (no source; source exists but is not publication-authorized; source exists and is publication-authorized), has a canonical route and identity of its own, renders through a deliberately plain shell with earned human navigation, and produces no public machine semantics beyond what is truthfully earned — all while the IWL's internal body (the four surfaces observed in the real fixture: Development Ledger, Decision Record, Authorial Accountability, Dependency/Proof Chain) remains opaque authored content, not schema. Internal-search (Pagefind) behavior is explicitly decided by `T13.1` from `T13.0`'s audit evidence, not pre-decided by this contract.

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

Resolved by `T13.0`'s real audit (see its completion report for full evidence — not re-decided here, since `T13.1` still owns the actual freeze):

- **H1** — confirmed as viable, not yet chosen: two candidate outer architectures survive the real-fixture pressure test, and both keep the IWL a `research`-adjacent structure (either a sibling file in the same collection, or a small satellite collection with a typed parent reference) rather than an unrelated parallel system. `T13.1` decision queue item 1.
- **H2** — partially contradicted: no existing frontmatter field expresses a third state today (every optional field in the schema is binary present/absent), so a *new* dedicated field is required — confirmed feasible, but not "already available." `T13.1` decision queue item 2.
- **H3** — confirmed as the lower-risk direction: nesting under the parent Article's own resolved path extends `canonicalPath()`/`categorySegment()` rather than duplicating routing truth. Still needs an explicit freeze. `T13.1` decision queue item 3.
- **H4** — confirmed: both fixtures are ordinary Markdown-shaped prose the existing rehype/remark pipeline already parses (tables, parenthetical citations); the plain shell can reuse `ArticleShell.astro`/`ResearchLayout.astro`'s render path with a reduced prop set.
- **H5** — contradicted as a default: Pagefind has no per-page opt-out mechanism anywhere in this codebase today (confirmed by repo-wide search and the build's own console output — "Indexing all `<body>` elements on the site"). Excluding IWL content requires *adding* new code, not relying on an existing scope. `T13.1` decision queue item 4.
- **H6** — confirmed: no "default-on" public-semantic path exists anywhere in this codebase (the `isBasedOn`/`audience` precedents both required a standalone, deliberate ticket). No Article↔IWL JSON-LD relation is earned by `T13.0`; `T13.1` decision queue item 7 asks whether Sprint 13 ships in deliberate silence, matching the `backstory` precedent.

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
| `T13.0` | AUDIT | R0 | Reality audit — production architecture + Chisel Article/IWL fixtures; produce evidence matrix, state matrix, ≤3 candidate outer architectures, `T13.1` decision queue, explicitly-open inner-grammar list | Sprint 12 closure | Zero runtime diff; audit-only — CLOSED, see completion report for full evidence |
| `T13.1` | DECISION | R3 | Freeze the outer Article/IWL contract from `T13.0`'s real findings | T13.0 | Amul approves unresolved product decisions — CLOSED, all 8 decisions accepted as recommended |
| `T13.2` | IMPLEMENTATION | R3 | Minimal envelope: presence/publication state, route, plain shell, navigation | T13.1 | Build/validator regression green, deployed-staging verified — CLOSED, one real Article/IWL pair live |
| `T13.3` | VALIDATION | R3 | Adversarial QA — fixture rendering, true absence, unpublished-source state, full regression | T13.2 | Local/CI/staging all green, zero defects — READY, sealed |
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

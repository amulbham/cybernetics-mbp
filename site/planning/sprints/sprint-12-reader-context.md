# Sprint 12 — Reader Context

Status: CLOSED
Risk ceiling: R3 (canonical publication semantics; T12.2 exercised this ceiling with the `audience` JSON-LD projection and T12.4 exercised it again with production promotion — T12.0/12.1/12.1.1/12.3 stayed R1–R2)
Branch: staging (production-promoted at T12.4 — `main @ b64e381`)
Depends on: Sprint 11 closure (canonical Person identity, DOI/publisher, relation-projection contract, semantic validator — all production-verified, see `CHANGELOG.md`'s Sprint 11.0–11.7 entries and the `main` promotion recorded in Sprint 12.0's own entry)
Unlocks: Sprint 13 (IWL Foundation) — unlocked. Next earned operation: `T13.0`, the architecture/reality audit. No Sprint 13 implementation tickets are pre-created.

**Ticket disposition**: `T12.0` CLOSED · `T12.1` CLOSED · `T12.1.1` CLOSED · `T12.2` CLOSED · `T12.3` CLOSED · `T12.4` CLOSED. Production verified; closure freeze complete.

## Core question

How should optional author-to-reader orientation (`readerNote.why`/`readerNote.for`) become a truthful human *and*, eventually, machine projection of a research object — without ever forcing the feature onto the corpus, inferring eligibility from content type or voice, or letting human presentation and machine semantics silently drift apart?

## Outcome

A `readerNote` source model and its one human-facing surface (`FromTheAuthor.astro`) exist, are authored only where they add real orientation, render correctly across the reading shell and print pipeline, and remain fully decoupled from Sprint 11's semantic graph until a deliberate, separately-authorized projection decision says otherwise.

## Inherited truths

- `readerNote` is optional at the module level, `.strict()` and complete-or-absent inside (`content.config.ts`) — no why-only/for-only state has ever been demonstrated as useful.
- Eligibility is edited by the author, never inferred at runtime. The only rule `ResearchLayout.astro` contains is `readerNote && (...)`.
- The corpus currently splits by *voice*, not `format`: Invariants and Three SOS (analytically neutral, no personal motivation in the authored text) earn `readerNote`; FAFSA and the Frontier essay (already motivated, occasion-driven prose) intentionally carry none — this is recorded editorial fact from Sprint 12.0's audit, never encoded as a runtime rule.
- `FromTheAuthor.astro` renders exactly `why`/`for` — no author bio, ORCID, correspondence, DOI, date, relations, IWL status, or disclosures; those keep their existing homes (`ArticleMasthead`, `AuthorNote`, authored `## Declarations`, the relation-projection layer).
- Placement is a dedicated `ArticleShell.astro` slot (`reader-context`), between the title block and the mobile TOC — deliberately not the existing `after-title` slot, and the title `<hr>` stays untouched.
- Reader Context is HTML-visible, PDF-hidden (`print-research.css`'s `.from-the-author` rule), verified by actually parsing both typeset PDFs with `pdfjs-dist`, not just trusting the CSS selector.
- `Article.audience` is now live (T12.2): `readerNote.for → { @type: 'Audience', audienceType: <verbatim> }`, present exactly on Invariants/Three SOS, absent on FAFSA/Frontier — verified locally, in CI, and on deployed staging. `Article.backstory` remains permanently absent everywhere — `readerNote.why` stays human-visible-only, per T12.2's frozen decision that `backstory`'s real definition doesn't truthfully fit. `validate-research-semantics.mjs` independently derives and enforces both, never by importing `ResearchLayout.astro`'s own construction.
- Schema.org's own docs were live-checked twice now (Sprint 12.0, then re-confirmed at T12.2 execution) — `audience` a clean, truthful fit; `backstory` a named imperfect fit, confirmed to remain unearned both times. Asymmetric projection (`audience` shipped, `backstory` didn't) is the actual, verified outcome, not just a permitted one.
- A real mobile-viewport regression check (headless Chrome, Sprint 12.1.1) confirmed `.from-the-author` stays fully contained within `.prose` at 375/390/430/768px on every piece that has it, with zero document-level horizontal-scroll regression versus production.

## Hypotheses to test

Both resolved by T12.2:

- `readerNote.for → Article.audience` **did** earn its projection once implemented and re-verified against the real fixtures — shipped, live on staging.
- `readerNote.why → Article.backstory` **remains human-visible-only permanently** — began from silence, stayed there; not a temporary state pending a future revisit.

## Hard constraints

- Never infer `readerNote` eligibility from `format`, voice, or any other content signal at runtime.
- Never let the semantic validator (`validate-research-semantics.mjs`) share transformation/selection logic with whatever production serializer eventually emits `audience`/`backstory` — same independent-oracle discipline Sprint 11.7 established for `isBasedOn`.
- Never treat `audience` shipping as an obligation for `backstory` to ship, or vice versa.
- No new Schema.org relation property beyond what a future ticket explicitly earns.

## Explicit exclusions

- IWL, provenance, or origin-record semantics of any kind — out of this sprint entirely, belongs to the Sprint 13–17 program.
- A memo fixture fabricated solely to test format scope — none exists yet; format eligibility stays open until a real one does.
- Indexing changes — `SITE_WIDE_NOINDEX`/`robots.txt` remain untouched throughout this sprint.
- Production promotion of Sprint 12 work — every ticket to date has shipped to `staging` only.

## Ticket sequence

| Ticket | Mode | Purpose | Depends on | Gate |
|---|---|---|---|---|
| `T12.0` | AUDIT | Corpus/behavior audit — earn the Reader Context grammar from the real four pieces before any schema exists | Sprint 11 closure | Documentation only, zero production diff — CLOSED |
| `T12.1` | IMPLEMENTATION | `readerNote` source model + `FromTheAuthor.astro` human surface, on exactly the two pieces that earned it | T12.0 | Full build/PDF/semantic-validator regression green, deployed-staging verified — CLOSED |
| `T12.1.1` | POLISH | Mobile regression check (real headless-Chrome measurement, production vs. staging) + `FromTheAuthor` visual polish | T12.1 | Zero viewport regression proven before *and* after the CSS change, deployed-staging re-verified — CLOSED (retroactively sealed under this planning system; see `planning/tickets/T12.1.1-mobile-regression-reader-context-polish.md`) |
| `T12.2` | IMPLEMENTATION | Semantic projection (`audience`, and independently, `backstory`) + atomic validator migration — the semantic decision itself is already frozen in T12.2's own sealed contract, not made during execution | T12.1.1 | Local/CI/deployed-staging all verified, three-commit choreography (seal/implementation/closure) followed — CLOSED, first prospective product/semantic ticket executed under Planning System v1 |
| `T12.3` | VALIDATION | Full Reader Context contract QA — adversarial, responsive, accessibility, corpus | T12.2 | Local, seal-CI, deployed-staging, and closure-CI all green — CLOSED, zero defects found, zero committed runtime change |
| `T12.4` | RELEASE | Production promotion + closure freeze | T12.3 | `main @ b64e381`, production independently verified (human/semantic matrix, reading-shell smoke, PDFs, canonical/Person/DOI/`isBasedOn` regression, indexing unchanged) — CLOSED |

## Sprint-level acceptance criteria

- `readerNote` presence/absence on the live corpus matches editorial intent exactly (Invariants/Three SOS present, FAFSA/Frontier absent) on every verification pass.
- `FromTheAuthor` never contributes to TOC state, heading model, or PDF output.
- Every semantic-projection decision this sprint makes is independently re-derived by the validator, never by re-invoking the production serializer.
- No ticket in this sprint infers eligibility, format-gates the feature, or lets `audience`/`backstory` ship as a package deal.

## Validation plan

- `npm run build` / `build:pdfs` / `validate:pdfs` on every ticket that touches runtime behavior.
- Real headless-Chrome viewport measurement (`puppeteer-core`, reusing the Chrome binary Vivliostyle already downloads) for any presentation-affecting ticket.
- Direct built-HTML/JSON-LD inspection for every semantic claim — never inferred from validator output alone.
- Deployed-staging verification before any ticket is considered closed.

## Stop conditions

- Any point where projecting `readerNote.why`/`readerNote.for` would require stretching a Schema.org property's real meaning to fit — stop and prefer silence (T12.2's own governing rule).
- Any point where a future ticket would need to infer Reader Context eligibility algorithmically — return to Amul; this sprint's contract forbids it outright.

## Exit state — achieved

```text
readerNote source model frozen           ✅
FromTheAuthor surface frozen             ✅
semantic projection decision validated   ✅
full contract QA passed, zero defects    ✅
production promotion verified            ✅ (main @ b64e381)
```

What remains deliberately open past this sprint: IWL/provenance semantics (Sprint 13+), any further Reader Context field beyond `why`/`for`, and IWL-adjacent relation properties.

## Canonical documentation targets

- `CHANGELOG.md` — one entry per closed ticket (current through T12.4 — Sprint 12's final entry).
- `ROADMAP.md` — the "Reader Context" in-progress bullet, updated as tickets close.
- `PUBLISHING.md`/`AGENTS.md` — now current through T12.2's projection decision (frozen and shipped, not rejected).

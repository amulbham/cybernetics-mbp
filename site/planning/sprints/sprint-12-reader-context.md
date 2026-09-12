# Sprint 12 — Reader Context

Status: EXECUTING
Risk ceiling: R3 (canonical publication semantics and, eventually, a JSON-LD projection decision are in scope for later tickets in this sprint; work to date has stayed R1)
Branch: staging
Depends on: Sprint 11 closure (canonical Person identity, DOI/publisher, relation-projection contract, semantic validator — all production-verified, see `CHANGELOG.md`'s Sprint 11.0–11.7 entries and the `main` promotion recorded in Sprint 12.0's own entry)
Unlocks: Sprint 13 (IWL Foundation) only after this sprint's remaining tickets close — no dependency runs the other direction

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
- Zero JSON-LD projection exists yet: `Article.audience`/`Article.backstory` are absent from every built page, and `validate-research-semantics.mjs` is unmodified — confirmed by direct inspection after every ticket in this sprint so far.
- Schema.org's own docs (live-checked, Sprint 12.0) confirm `audience` is a clean, truthful fit for `readerNote.for`; `backstory` is a named imperfect fit for `readerNote.why` (its real definition centers `NewsArticle`/journalistic reporting process, not a research paper's intellectual motivation) — asymmetric projection (`audience` ships, `backstory` doesn't) is an explicitly valid outcome, not a defect to reconcile later.
- A real mobile-viewport regression check (headless Chrome, Sprint 12.1.1) confirmed `.from-the-author` stays fully contained within `.prose` at 375/390/430/768px on every piece that has it, with zero document-level horizontal-scroll regression versus production.

## Hypotheses to test

- Whether `readerNote.for → Article.audience` still earns its projection once actually implemented and re-verified against the real fixtures, not just judged clean in the abstract (T12.2).
- Whether `readerNote.why → Article.backstory` should ship at all, or remain human-visible-only permanently (T12.2 — begin from silence).

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
| `T12.2` | DECISION + IMPLEMENTATION | Semantic projection decision (`audience`, and independently, `backstory`) + atomic validator migration | T12.1.1 | First ticket fully sealed and executed under this planning system |
| `T12.3` | VALIDATION | Full Reader Context contract QA — adversarial, responsive, accessibility, corpus | T12.2 | Full chain green, staging gate passed |
| `T12.4` | RELEASE | Production promotion + closure freeze | T12.3 | Canonical docs current, production independently verified |

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

## Exit state

What must be true when Sprint 12 closes:

```text
readerNote source model frozen
FromTheAuthor surface frozen
semantic projection decision made and validated
full contract QA passed
production promotion verified
```

What remains deliberately open past this sprint: IWL/provenance semantics (Sprint 13+), any further Reader Context field beyond `why`/`for`, and IWL-adjacent relation properties.

## Canonical documentation targets

- `CHANGELOG.md` — one entry per closed ticket (already current through T12.1.1).
- `ROADMAP.md` — the "Reader Context" in-progress bullet, updated as tickets close.
- `PUBLISHING.md`/`AGENTS.md` — updated only once T12.2's projection decision (or its rejection) is frozen; not before.

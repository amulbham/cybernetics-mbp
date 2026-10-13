# Sprint 19 — Publication Taxonomy

Status: PROPOSED (awaiting Product Authority authorization of the sealed T19.0)
Risk ceiling: R3
Branch: `staging`
Depends on: Sprint 18 CLOSED (`main @ 6db9e80`); Product Authority taxonomy decisions and Planner review, 2026-10-13
Unlocks: Desk content ingestion; Publication MD v1.0 finalization
Inherits: `site/PLANNING.md`, `site/PUBLISHING.md`, `site/AGENTS.md`, `site/ROADMAP.md` @ `e5b3dbb`; `site/planning/tickets/T18.1-canonical-paper-pdf-identity-migration.md` @ `e5b3dbb`

## Core question

Can editorial category and scholarly-PDF eligibility be separated, and the live corpus moved to the four approved categories, without losing any public URL or scholarly PDF identity?

## Outcome

Required `category` (`cybernetics`, `knowledge-work`, `ai-systems`, `essays`) routes every entry. `format: paper` alone carries the scholarly PDF, Highwire and `ScholarlyArticle`. A DOI requires `format: paper`. Every retired public URL is a validated single-hop 301. The four scholarly PDFs, FAFSA included, are protected by a route-history ledger of historical public commitments.

## Inherited truths

- Routes derive from `categorySegment()`/`canonicalPath()`; a paper's PDF is `{entry.id}.pdf` with `paper.pdf` as a 301 (T18.1); IWL routes derive from the parent Article.
- `main` is production; the TP2 governance lineage stays on `staging` only. Sitewide `noindex, nofollow` and `robots.txt Disallow: /` are intentional.
- Live corpus: five entries (Invariants, Three SOS, Chisel with its IWL, FAFSA, Frontier Utility).

## Hypotheses to test

- Explicit no-slash `_redirects` lines are needed and work on Cloudflare Pages (T19.0 Q1).
- PDF text and link annotations, not bytes, are the stable preservation oracle (Q2).

## Hard constraints

- Current category, format and IWL relationship stay authoritative in frontmatter/schema and the `iwl` collection. The route-history registry records historical public commitments only.
- No body, title, DOI or other frontmatter change beyond the category key. No indexing change.
- Production promotion is product-only, from a branch off `origin/main`, after Amul's typed approval of the staging result.

## Explicit exclusions

Desk ingestion; Chisel Draft v6 appendix and IWL editorial mismatches; Publication MD v1.0 authoring; Home/About redesign; PDF typesetting changes; discovery or indexing; Zenodo actions; `/research-hub/` legacy redirects.

## Ticket sequence

| Ticket | Mode | Purpose | Depends on | Gate |
|---|---|---|---|---|
| `T19.0` | IMPLEMENTATION / R3 | Publication taxonomy migration: `category`, route-history registry, direct 301 matrix, validators, staging QA, product-only promotion | Sprint 18 CLOSED; this contract | DRAFT. Two-reviewer pre-seal review, then Amul's authorization to seal |

## Sprint-level acceptance criteria

- All five entries serve at their approved category routes on staging; all four landing pages and `/research/memos/` return 200.
- Every retired public URL returns a single-hop 301 to a 200 target.
- Four scholarly PDFs verify against the pre-change baseline.
- Validators fail closed on each T19.0 adversarial case.
- Indexing controls are unchanged; production is verified after approved promotion or the deferral is recorded.

## Validation plan

Baseline capture at `origin/staging`; the full local chain (`build`, `build:pdfs`, `validate:pdfs`); route and HTML delta review; PDF text and annotation comparison; contrast measurement; adversarial mutations; Actions run; staging matrix; production matrix after promotion. Detail: T19.0.

## Stop conditions

Any PDF difference beyond the category segment or label; a Cloudflare redirect behavior that cannot yield a single hop; a baseline fact that changes a public-route decision; any need for editorial text change, a new source of truth, an indexing change, or a Desk/memo placement decision.

## Exit state

- True at close: the taxonomy is live on staging (and on production if approved); docs and the content-manager skill describe `category` and PDF eligibility correctly; the ROADMAP direction below is applied.
- Deliberately open: Desk ingestion, Publication MD v1.0, Home/About redesign, Chisel editorial work, discovery and indexing.

## Canonical documentation targets

`AGENTS.md`, `PUBLISHING.md`, `CONTENT-MODULES.md`, `ROADMAP.md`, `CHANGELOG.md`, `design-system/{tokens,components,do-not,README}.md`, `.claude/skills/content-manager/SKILL.md`.

## ROADMAP direction (applied by T19.0 at its documentation step)

Replace in `ROADMAP.md`:

1. **Header paragraph, final sentence** ("Production Ready corpus/front door work (next planned object: the Chisel paper, not yet executing) and route-aware discovery stay directional and unnumbered.") →
"Sprint 19 (`T19.0`, publication taxonomy migration: `pillar` → required `category`, scholarly-PDF eligibility decoupled from editorial category) is the next planned object. After it, the next manuscript pilot is *The Desk Is Where You Write It Down* (Knowledge Work, Zenodo DOI-backed, scholarly PDF required). Home and About follow Desk. The Chisel paper is deferred editorial work. Corpus/front-door work and route-aware discovery stay directional and unnumbered."

2. **Research Object MVP block, item B** → 
```text
S19 — Publication taxonomy (T19.0, R3)
    NEXT: required `category` (cybernetics | knowledge-work |
    ai-systems | essays) replaces `pillar`; `format: paper` carries
    the scholarly PDF; a DOI requires `format: paper`; direct 301s
    for every retired public URL; route-history ledger protects
    all four scholarly PDF identities (FAFSA included)

B — Production Ready corpus + front door
    NEXT MANUSCRIPT PILOT (after S19, not yet executing):
    "The Desk Is Where You Write It Down" — Knowledge Work, Zenodo
    DOI-backed, scholarly PDF required; compiled MD v41.10 carries a
    legacy `pillar: systems-architecture` to reconcile under an
    approved content ticket (no silent argument edits)
    Publication MD v1.0 (Grokbot-to-site authoring contract)
    finalized against post-S19 code and tested on the final Desk
    manuscript
    Workflow: author draft -> compiled MD -> Zenodo draft DOI
    reserved -> DOI in MD -> ingest/validate -> HTML + exact scholarly
    PDF -> that PDF (SHA-256 verified) to Zenodo -> Zenodo publication
    coordinated with the site release
    THEN Home / About redesign (separate specifications)
    THEN remaining launch-corpus editorial readiness
    DEFERRED editorial work: the Chisel paper (older Draft v6 IWL
    development-log appendix and manuscript identity; IWL editorial
    mismatches under "Polish, not urgent")
    CONTENT / READER / SCHOLARLY checks
    editorial refinement
```

3. **"Related-research module" bullet**: replace the pillar clause with: "Invariants and Three SOS share the `cybernetics` category, so both pages render a related-research card for the other. The `essays` category gives no similarity bonus, so FAFSA and Frontier Utility show nothing from category alone — correct, not a bug."

4. **"Three of five pillars…" bullet** →
"**Category coverage** — `cybernetics` (Invariants, Three Self-Organizing Systems), `knowledge-work` (The Chisel Fallacy), and `essays` (FAFSA, a scholarly paper placed editorially among essays; Frontier Utility). `ai-systems` is intentionally empty until a work belongs there; its landing page shows an empty state and the homepage links it unconditionally. `/research/memos/` remains a functional empty route outside the four-category navigation."

Unchanged: the public-launch block, the Sprint 18 status line, and "Polish, not urgent" (including the Chisel IWL editorial mismatches).

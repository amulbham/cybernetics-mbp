# Sprint 19 — Publication Taxonomy

Status: CLOSED — production verified 2026-10-13 (`main @ 077a0c1`, Actions run 38453516645); evidence: `planning/audits/T19.0-taxonomy-migration-evidence.md`. T19.0 was sealed under a Product Authority one-time exception to the second independent R3 pre-seal review, which was not completed
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

- Explicit no-slash `_redirects` lines are needed and work on Cloudflare Pages (T19.0 Q1); some are deliberate aliases, even when the old URL was previously 404.
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
| `T19.0` | IMPLEMENTATION / R3 | Publication taxonomy migration: `category`, route-history registry, direct 301 matrix, validators, staging QA, product-only promotion | Sprint 18 CLOSED; this contract | CLOSED. Verified on staging (run 38450257817 @ `84d0025`) and on production (`main @ 077a0c1`, run 38453516645) after a product-only release; sealed 2026-10-13 with one independent review plus a recorded one-time exception to the second; evidence `planning/audits/T19.0-taxonomy-migration-evidence.md` |

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

- True at the validated staging gate: taxonomy, PDF preservation and redirects are verified on staging; ROADMAP explicitly says STAGING ACCEPTED / awaiting production approval. At production closure, record PRODUCTION VERIFIED / CLOSED **only after** the matching production workflow and postrelease matrix pass. If promotion is deferred, record that deferral rather than asserting the taxonomy is live on production.
- Deliberately open: Desk ingestion, Publication MD v1.0, Home/About redesign, Chisel editorial work, discovery and indexing.

## Canonical documentation targets

`AGENTS.md`, `PUBLISHING.md`, `CONTENT-MODULES.md`, `ROADMAP.md`, `CHANGELOG.md`, `design-system/{tokens,components,do-not,README}.md`, `.claude/skills/content-manager/SKILL.md`.

## ROADMAP direction (applied by T19.0 at its documentation step)

Replace in `ROADMAP.md`:

1. **Header paragraph, final sentence** (the existing Chisel-next wording) → replace using the **actual verified release gate**. Before staging acceptance, say "Sprint 19 taxonomy migration in progress; Desk planned after taxonomy." After staging acceptance but before promotion, say "Sprint 19 staging accepted; production promotion pending Product Authority authorization; Desk is the next manuscript pilot after taxonomy release." After production verification, say "Sprint 19 publication taxonomy production-verified and closed at [verified SHA]; next manuscript pilot: *The Desk Is Where You Write It Down* (Knowledge Work, Zenodo-backed, PDF required); then Home and About." If promotion is deferred, record it expressly; never use NEXT/COMPLETE language unsupported by deployed evidence. Chisel remains published with editorial revision deferred. Corpus readiness and indexing stay separately gated.

2. **Research Object MVP block, item B** → 
```text
S19 — Publication taxonomy (T19.0, R3)
    STATUS: reflect verified PLANNED / EXECUTING / STAGING ACCEPTED /
    PRODUCTION VERIFIED / CLOSED or explicit release deferral; never
    hard-code NEXT once implementation has shipped
    required `category` (cybernetics | knowledge-work |
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

Unchanged: the public-launch block, Sprint 18 historical closure, and "Polish, not urgent" (including Chisel IWL editorial mismatches). Record staging/production SHAs only after the corresponding deployments are verified, and preserve an explicit production deferral if one exists. The Product Authority coordinates independent reviewers; the Executor receives the approved contract and does not call review tooling.

## Closure (2026-10-13)

Sprint 19 is closed on production at `main @ 077a0c1`, released product-only (the implementation commit cherry-picked onto `main`; the TP2 governance lineage on `staging` was not merged). Outcome against the sprint-level criteria: all five entries serve at their approved category routes and the four category landing pages plus `/research/memos/` return 200; every retired public URL (22 sources) returns a single-hop 301 to a 200 target; the four scholarly PDFs, FAFSA included, match the pre-change text, link annotations, fonts and page counts; the validators fail closed on every adversarial case; indexing controls are unchanged. The two-reviewer pre-seal requirement was waived once by the Product Authority and is recorded as not completed. Accepted nonblocking follow-ups: homepage hero and About editorial copy, RSS `guid` for the two moved entries, the Planner's optional CI hardening. Deliberately open: Desk ingestion, Publication MD v1.0, Home/About redesign, Chisel editorial work, discovery and indexing.

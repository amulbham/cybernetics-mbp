# Sprint 27 — Cognition as a Self-Organizing System: new scholarly paper publication

Status: **AUDITING / DRAFT — NOT SEALED; NO EXECUTION OR DEPLOYMENT AUTHORITY**
Risk ceiling: **R3** for new public route, scholarly PDF and release manifest; each ticket independently classified
Branch: `planner/context` for planning; later isolated website/research branches only by a sealed contract; `staging` indexes CLOSED; `main` production is separately owner-approved
Depends on: Sprint 25 accepted publication/intake process; Sprint 26 Lab Bubble production CI PASS and owner-confirmed visible article (formal independent HTML check still open); website `PLANNING.md`, `PUBLISHING.md`, `AGENTS.md` and `MANUSCRIPT-CONTRACT.md`
Unlocks: first verified new six-PDF scholarly publication workflow, with author-controlled Zenodo v2 parity

## Core question
Can Paper B be published in HTML and as a scholarly PDF from a strictly immutable underlying manuscript plus author-approved primitive-only treatment, while adding the sixth frozen PDF without changing any of the original five, and then depositing the exact live PDF as a new Zenodo version?

## Outcome
A verified production page, metadata and staged-approved exact PDF, unchanged five historical PDFs, a future-safe six-line release manifest, and a later **separately verified** Zenodo v2 deposit of precisely the same PDF bytes. A website-release success is **not** automatically Zenodo parity or full sprint closure.

## Inherited verified facts / immutable source pins (read 2026-11-02)
- Research `amulbham/amulbham-research main = staging @ 88c5a97a058c401bfc0b19e2c619521fa3eb31ec` (as checked); preserved feature branch `papers/cognition-as-self-organizing-system-spm-init @ 44d22b9313c1dec1123470348c3b458e7d7591d2`; research SPM import PR #20 merged to `staging` on 2026-10-29, and research `main` presently contains it.
- Clean baseline: `papers/cognition-as-self-organizing-system/assets/manuscript.md` at immutable research commit above; Git blob `e0f422e67ed4cbc587659d7c3620bd476c1c56b7`; SPM `source-integrity.json` reports SHA-256 `116fbe5882d0820749a46bfd03c319158b2dcbce72772efd6768d409d323dec2`. Source of the *text preservation* invariant; existing v8 site-format cleanup is historical, not permission for new prose edits.
- Primitive candidate: `papers/cognition-as-self-organizing-system/assets/manuscript-primitives.md` at the same immutable commit; blob `601e22826c7d88c77ced641cf5662b89bdaee207`, reported SHA-256 `f5230539385a768677505e8e3c60f8f820a3346c9818254ead543e5190e469d7`; eleven candidate blocks (1 Definition, 7 Evidence, 1 Key idea, 1 Counterpoint, 1 Implication); **author review pending** per research `STATE.md` and IWL-002. The prior 11-change-region comparison must be reproduced against these exact pins by T27.0, not accepted by assertion.
- Paper originally published 2026-09-30, v1 DOI `10.5281/zenodo.23068821`; concept DOI `https://doi.org/10.5281/zenodo.23068820` selected by author for stable all-versions public linking. Author will create **new Zenodo version after site publication**, not overwrite v1. Never invent or assert a v2-specific DOI before Zenodo creates it.
- Website `main @ bb6f1701654d9a8a051a4999c550864707fc5e9e`, `staging @ 201027752876cacc0fef6cc9cea0a19952ba3e11` (2026-11-02 check). No Paper B site route; production has five protected scholarly PDF identities. `staging` carries unreleased Chisel article/IWL changes: no wholesale merge.
- Website `site/scripts/build-research-pdfs.mjs` discovers papers dynamically, but `site/scripts/carry-over-pdfs.sh` fixes `EXPECTED_COUNT=5` and fetches production paths before any non-Desk frozen-blob fallback. A sixth **initial production 404** is a known technical stop unless adapted deliberately.

## Article starting-state audit
| Dimension | Status | Evidence / minimum action |
| --- | --- | --- |
| Exact manuscript text | **READY / LOCKED** | Research clean source blob above; never rewrite argument, paragraphs, table, references, headings, disclosures, date line or conclusions |
| SPM / provenance | **READY** | Existing `STATE.md`, immutable v8 `checkpoints/`, IWL-001/002, `source-integrity.json`, Zenodo copies; reconcile stale mutable instructions, preserve historical records |
| Primitive acceptance | **OWNER DECISION** | Candidate 11 anchored blocks predates current intake; full T27.0 positional/duplication audit of exactly these; retain every one of seven original citation-blockquote citation payloads even if a primitive is removed/revised |
| References / links | **WORK NEEDED** | 23 numbered references, nine currently without a URL; author previously searched. Audit link identities (not assumed found). Do not edit bibliographic prose; optional website-only wording-preserving linked destinations with exact owner signoff. Ref #12 uncited is preserved, not a license to delete |
| Metadata / publishing identity | **PARTLY APPROVED** | `format: paper`, proposed `category: cybernetics` and slug `cognition-as-self-organizing-system`, historical `pubDate: 2026-09-30` and concept DOI. Approve exact excerpt/description, route and whether dateModified is warranted; do not invent author voice or new DOI |
| Figure / Paper A link | **WORK NEEDED** | Existing Figure 2 with two PNG resolutions and authored separate caption; verify single appropriate visible caption/alt in HTML/PDF. Insert approved internal links to site's Paper A at existing mentions, without altering displayed words; retain original reference DOI |
| Website HTML and Scholar | **NOT STARTED** | No Paper B entry; test article route, citation anchors, eleven approved asides, sitemap, robots, canonical, OpenGraph, Google Scholar Highwire, ScholarlyArticle JSON-LD, Google-facing metadata and indexing |
| PDF new-paper workflow | **BLOCKED UNTIL T27.1** | Build six; preserve five frozen SHA-256; explicitly bootstrap the sixth from its approved staged frozen artifact rather than fetching its initially absent live path; later ordinary six-PDF carry-over |
| Zenodo v2 parity | **OWNER ACTION PENDING** | Site PDF first, author uploads *exact downloaded bytes* as a new version, then verify deposited/downloaded SHA-256; keep website success and Zenodo parity as separate facts |

## Hypotheses to test
- Eleven callouts may be too repetitive in a 10-page scholarly paper; retaining them in revised, source-oriented primitive form may improve both screen and PDF while original prose remains byte-equivalent.
- Existing DOI/Highwire/sitemap primitives should support Paper B once ingestion is valid; prove actual generated and served output rather than inferring.
- A narrowly bounded sixth-PDF bootstrap can preserve all historical hashes without weakening the fail-closed guard.

## Hard constraints
- **Underlying manuscript is immutable**, including evidence claims even if a reviewer questions them: no edits to ordinary prose, section headings, tables, existing bibliography text/order, original citation information, declarations, figure label or conclusions. T27.0 may recommend only primitive-specific changes and exact non-visible/wording-preserving site projection.
- Preserve the citation tokens and attributed sources from **all seven original citation-only blockquotes**, including when callouts are shortened or removed: if removed, reinstate the original blockquote or make an author-approved structurally equivalent citation-preserving representation. No dropped, reassigned or invented citation.
- Pin clean baseline, candidate and final accepted manuscript by immutable commits and Git blobs; record SHA-256 of the final exact file and an independently reproducible normalized public-text comparison (separately report authorized primitive/link/metadata projections).
- Source-only/HTML/PDF rendering decisions are not permission for prose corrections. An issue requiring prose changes is recorded as a finding and deferred to a separately approved manuscript revision, not fixed by the Executor.
- Frozen approved staging PDF byte identity must be **exactly** the artifact installed in production. Use the direct staging-deployed PDF URL (not an article's production-origin Download PDF link when it points at old bytes). Record its SHA-256; commit/freeze the *same* bytes; verify the production downloaded-byte SHA-256.
- Initial six-PDF release must handle production 404 for the sixth file by approved frozen-artifact bootstrap **before** a live fetch, while enforcing unchanged identities for the original five; a subsequent normal redeploy must preserve all six.
- A standalone site success is **WEBSITE PRODUCTION VERIFIED**; **ZENODO PARITY VERIFIED** requires user-created v2 and an independently downloaded exact file hash match. Do not close Sprint 27 under the original exit until both, unless the author changes the scope prospectively.
- No unapproved staging/main push, Zenodo action, indexing change, PDF_MANIFEST bypass, force push, unfrozen regenerated PDF substitution or unrelated branch merge.

## Explicit exclusions
No argument/factual revision, new source manuscript history, Paper A edits, compulsory public IWL, Chisel release, FAFSA/Desk corrections, new CMS, broad PDF architecture redesign or Google Scholar indexing guarantee. Historical raw checkpoints/IWL-001/002 are not silently rewritten; make prospective addenda.

## Ticket sequence — provisional, issue one contract only when its prerequisites are established
| Ticket | Mode | Purpose | Depends on | Gate |
| --- | --- | --- | --- | --- |
| **T27.0** | AUDIT / owner DECISION | Independently audit 11 primitives against unchanged manuscript, citation payloads, duplicated text, figure/link projection, then freeze exact author-approved source | Research immutable pins | **Draft prepared; author reviews exact choices; no execution yet** |
| **T27.1** | IMPLEMENTATION / VALIDATION | Six-PDF fail-closed first-publication 404 bootstrap, existing-five preservation, normal six-PDF redeploy test | T27.0 source/metadata identity fixed sufficiently to name new path | Technical contract drafted only after predecessor evidence and scoped review |
| **T27.2** | IMPLEMENTATION / VALIDATION | Ingest immutable approved Paper B, render HTML/figure/primitives/citations/metadata; run complete six-PDF staging QA | T27.0 acceptance and T27.1 safety proof | Closed-indexing staging as prospectively sealed; owner visual review of **exact** PDF |
| **T27.3** | RELEASE | Freeze the **exact approved staging PDF**, selectively release Paper B with a six-line manifest; verify live HTML and exact-byte PDF | T27.1/2 verified, owner authorizes exact production commit and PDF hash | Separate owner production release approval |
| **Final owner action** | AUTHOR ACTION / VALIDATION | New Zenodo v2 using exact public-site PDF download; verify version DOI and bytes; reconcile research `STATE.md` | T27.3 website live | Explicit site–Zenodo parity outcome |

## Sprint-level acceptance criteria
1. Product Authority accepts exact primitive markup without any change to the locked manuscript or loss of the seven source-citation payloads; final file identity is pinned.
2. Site displays the entire approved research text, a correctly rendered figure, linked Paper A references with unchanged visible words, and 23 bibliography entries without fabrications or dropped citations.
3. Trusted build passes research linking, semantics, indexing and PDF validation; direct staging screen and print reviews cover desktop/mobile, light/dark, citation targets, generated anchors, figure/caption and page breaks.
4. All scholarly metadata matches: title/author/ORCID, original publication date, concept DOI, canonical/OG, one derived PDF URL used by download + Highwire + JSON-LD; Paper B included in sitemap for indexable production, staging remains blocked.
5. Original five production PDF SHA-256 values unchanged, sixth matches **frozen staged-approved** hash. Initial-production 404 is handled without weakening manifest guards; next standard deploy preserves six.
6. Production selectively deploys no Chisel source/IWL change and no unrelated migration; live page, direct PDF bytes, robots, sitemap, schema and Scholar meta are independently checked.
7. Website production status is separately recorded from owner-provided Zenodo v2 publication and deposited-PDF parity; sprint closure requires both.

## Validation plan
- Text/primitive audit: immutable blob checks, explicit 11-change-hunk replay, citation-blockquote seven-payload inventory, callout kind/slug uniqueness, visible prose preserved, citation/ref map and twenty-three-bibliography entries.
- Site/SEO: `npm run build` (includes link, semantic and indexing validators), closed vs open indexing outputs, canonical, OG, sitemap, Scholar Highwire, DOI resolution meaning and no invented new version DOI.
- PDF: `npm run build:pdfs` + `npm run validate:pdfs`; six-PDF presence/parse/references/ORCID, visual paper QA. Adversarial initial production-404, stale/incorrect SHA, extra or missing PDF, wrong source version, unapproved regeneration and subsequent ordinary carry-over.
- Production proof: authoritative Actions SHA and artifact manifest, exact selected paths, direct served HTML metadata and six PDF downloaded hashes, protected other files, route history and live sitemap. No inference from only CI success.
- Post-Zenodo: owner version created, concept latest-version DOI resolves appropriately, version-specific DOI recorded, downloaded deposited PDF hash equals exact live/downloaded approved hash.

## Stop conditions
Any prose/authorial drift; lost citation or bibliography information; ambiguous primitive approval; missing linked-source identity; figure caption conflict not approved; unresolved site metadata; scholarly metadata/PDF mismatch; initial sixth-path 404; any protected PDF hash change; surprise branch divergence or Chisel inclusion; missing author release approval; site/Zenodo hash mismatch.

## Exit state and documentation
- **Milestone A — Website production verified:** accepted Paper B site HTML and frozen PDF, five unchanged historical PDF hashes and sixth verified, all indexing/SEO/Scholar gates proven. **Sprint not closed yet** if Zenodo v2 outstanding.
- **Milestone B — Zenodo parity verified:** the author-created v2 file matches the exact live PDF; final DOI and evidence recorded; only then **CLOSED** absent a new scoped owner decision.
- Canonical targets: sprint/ticket & Planner STATE (`planner/context`), website `site/CHANGELOG.md` / `site/ROADMAP.md`, `site/PUBLISHING.md` / `site/AGENTS.md` only if proven code behavior changes, protected PDF release manifest, research `papers/cognition-as-self-organizing-system/STATE.md` with new-version instruction, append-only IWL follow-up, never mutate sealed history.

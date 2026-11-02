# Sprint 27 — Cognition as a Self-Organizing System: new scholarly paper publication

Status: **T27.0 AUTHOR EDITORIAL ACCEPTANCE PASS; SOURCE COMMITTED ON ISOLATED RESEARCH BRANCH; T27.1 DRAFT — NO WEBSITE DEPLOYMENT AUTHORITY**
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
- Initial primitive candidate blob `601e22826c7d88c77ced641cf5662b89bdaee207` at research base `88c5a97`, SHA-256 `f5230539385a768677505e8e3c60f8f820a3346c9818254ead543e5190e469d7`. **Accepted source** on isolated research branch commit `ccac0659aff4150b1be5b0a903753bd3a684e5bd`, blob `71bba0d79423e98d10f10005cf7ff30321e5b587`, SHA-256 `8f8b5cf6a6ce18f47299278e96bf507838a36d8b58d347f1f1971ec90c1e0fe0`. Eleven-change-region baseline and nine approved primitive-only edits reproduced; [T27.0 evidence](../audits/sprint-27/T27.0-primitive-source-acceptance.md). Research staging/main not modified.
- Paper originally published 2026-09-30, v1 DOI `10.5281/zenodo.23068821`; concept DOI `https://doi.org/10.5281/zenodo.23068820` selected by author for stable all-versions public linking. Author will create **new Zenodo version after site publication**, not overwrite v1. Never invent or assert a v2-specific DOI before Zenodo creates it.
- Website `main @ bb6f1701654d9a8a051a4999c550864707fc5e9e`, `staging @ 201027752876cacc0fef6cc9cea0a19952ba3e11` (2026-11-02 check). No Paper B site route; production has five protected scholarly PDF identities. `staging` carries unreleased Chisel article/IWL changes: no wholesale merge.
- Website `site/scripts/build-research-pdfs.mjs` discovers papers dynamically, but `site/scripts/carry-over-pdfs.sh` fixes `EXPECTED_COUNT=5` and fetches production paths before any non-Desk frozen-blob fallback. A sixth **initial production 404** is a known technical stop unless adapted deliberately.

## Article starting-state audit
| Dimension | Status | Evidence / minimum action |
| --- | --- | --- |
| Exact manuscript text | **READY / LOCKED** | Research clean source blob above; never rewrite argument, paragraphs, table, references, headings, disclosures, date line or conclusions |
| SPM / provenance | **READY ON WORKING BRANCH** | Original checkpoints/clean manuscript unchanged; source commit `ccac0659aff4150b1be5b0a903753bd3a684e5bd` adds accepted primitive treatment, mutable STATE's Zenodo v2 correction and IWL-003, not merged to research staging |
| Primitive acceptance | **ACCEPTED 2026-11-02** | [T27.0 evidence](../audits/sprint-27/T27.0-primitive-source-acceptance.md): retained 11 anchors, refined exactly 9 bodies, unchanged original source text and 7 citations; committed research working source `ccac0659aff4150b1be5b0a903753bd3a684e5bd` |
| References / links | **WORK NEEDED** | 23 numbered references, nine currently without a URL; author previously searched. Audit link identities (not assumed found). Do not edit bibliographic prose; optional website-only wording-preserving linked destinations with exact owner signoff. Ref #12 uncited is preserved, not a license to delete |
| Metadata / publishing identity | **PARTLY APPROVED** | `format: paper`, proposed `category: cybernetics` and slug `cognition-as-self-organizing-system`, historical `pubDate: 2026-09-30`, **Paper B concept DOI `23068820`** for masthead/Highwire/JSON-LD, not original v1 `23068821`. Exact excerpt/description, route and dateModified remain intake decisions. [DOI audit](../../planner/checkpoints/2026-11-02-paper-a-b-concept-doi-audit.md) |
| Figure / Paper A link | **WORK NEEDED** | Existing Figure 2 and caption/alt mechanics need site render QA. Approved contextual internal Paper A canonical links preserve visible words. **DOI exception:** Paper B website/PDF bibliography #4 must use Paper A concept `20531588` in place of older `20531589` (single explicitly allowed identifier substitution; research source pinned unchanged). [DOI audit](../../planner/checkpoints/2026-11-02-paper-a-b-concept-doi-audit.md) |
| Website HTML and Scholar | **NOT STARTED** | No Paper B entry; test article route, citation anchors, the author-approved primitive set, sitemap, robots, canonical, OpenGraph, Google Scholar Highwire, ScholarlyArticle JSON-LD, Google-facing metadata and indexing |
| PDF new-paper workflow | **BLOCKED UNTIL T27.1** | Build six; preserve five frozen SHA-256; explicitly bootstrap the sixth from its approved staged frozen artifact rather than fetching its initially absent live path; later ordinary six-PDF carry-over |
| Zenodo v2 parity | **OWNER ACTION PENDING** | Site PDF first, author uploads *exact downloaded bytes* as a new version, then verify deposited/downloaded SHA-256; keep website success and Zenodo parity as separate facts |

## Release-bound DOI decision (2026-11-02)
Paper B launch is not blocked by existing old Paper A DOI links on other live pages. Its **own public DOI** and Paper A bibliography #4 shall use concept DOIs, with **exactly one approved, site-only reference #4 identifier substitution**; original research source `ccac0659` and its checksum stay unchanged. [Detailed audit and next-sprint normalization](../../planner/checkpoints/2026-11-02-paper-a-b-concept-doi-audit.md). Sitewide Paper A/Three SOS and Zenodo metadata/PDF parity adjustments are deferred, not absorbed into T27.1 or T27.2.

## Hypotheses to test
- Eleven callouts may be too repetitive in a 10-page scholarly paper; retaining them in revised, source-oriented primitive form may improve both screen and PDF while original prose remains byte-equivalent.
- Existing DOI/Highwire/sitemap primitives should support Paper B once ingestion is valid; prove actual generated and served output rather than inferring.
- A narrowly bounded sixth-PDF bootstrap can preserve all historical hashes without weakening the fail-closed guard.

## Hard constraints
- **Underlying research manuscript is immutable**, including prose, section headings, tables, all 23 bibliographic entries/order, citation attribution, declarations, figure and conclusions. **Sole new author-approved site projection exception:** replace exactly the Paper A DOI identifier `https://doi.org/10.5281/zenodo.20531589` with all-versions `https://doi.org/10.5281/zenodo.20531588` in Paper B bibliography #4, visible text and link alike. Do not modify accepted research file/checksum or other entry text. The Paper B site masthead/Highwire/JSON-LD use concept DOI `https://doi.org/10.5281/zenodo.23068820`, never historical v1 DOI. [Narrow audit](../../planner/checkpoints/2026-11-02-paper-a-b-concept-doi-audit.md).
- Preserve the citation tokens and attributed sources from **all seven original citation-only blockquotes**, including when callouts are shortened or removed: if removed, reinstate the original blockquote or make an author-approved structurally equivalent citation-preserving representation. No dropped, reassigned or invented citation.
- Pin clean baseline and initial primitive candidate by immutable research commit and blobs. At T27.0 closure pin the **approved candidate projection** and its calculated SHA-256 to Planner audit evidence; the **separate owner-authorized source commit** then pins final research commit/blob/SHA-256 before T27.2 intake. Reproduce a strict nonprimitive-text comparison; report separately authorized primitive/link/metadata projections.
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
| **T27.0** | AUDIT / owner DECISION | Audit 11 primitives and all citation payloads against immutable paper | Original research pins | **PASS: delegated selection approved and separate research-source commit verified `ccac0659`** |
| **T27.1** | IMPLEMENTATION / VALIDATION | Six-PDF fail-closed first-production-404 bootstrap, five-hash preservation, normal redeploy | Accepted source `ccac0659aff4150b1be5b0a903753bd3a684e5bd` | [Draft ticket](../tickets/T27.1-sixth-pdf-bootstrap.md) awaiting independent review and separate prospective seal; code not started |
| **T27.2** | IMPLEMENTATION / VALIDATION | Ingest immutable approved Paper B, render HTML/figure/primitives/citations/metadata; run complete six-PDF staging QA | T27.0 acceptance, **separately authorized committed approved research source**, and T27.1 safety proof | Closed-indexing staging as prospectively sealed; owner visual review of **exact** PDF |
| **T27.3** | RELEASE | Freeze the **exact approved staging PDF**, selectively release Paper B with a six-line manifest; verify live HTML and exact-byte PDF | T27.1/2 verified, owner authorizes exact production commit and PDF hash | Separate owner production release approval |
| **Final owner action** | AUTHOR ACTION / VALIDATION | New Zenodo v2 using exact public-site PDF download; verify version DOI and bytes; reconcile research `STATE.md` | T27.3 website live | Explicit site–Zenodo parity outcome |

## Sprint-level acceptance criteria
1. Product Authority accepts exact primitive markup without any change to the locked manuscript or loss of the seven source-citation payloads; final file identity is pinned.
2. Site displays the entire approved research text, a correctly rendered figure, linked Paper A references with unchanged visible words, and 23 bibliography entries without fabrications or dropped citations.
3. Trusted build passes research linking, semantics, indexing and PDF validation; direct staging screen and print reviews cover desktop/mobile, light/dark, citation targets, generated anchors, figure/caption and page breaks.
4. All scholarly metadata matches: title/author/ORCID, original publication date, **Paper B concept DOI `23068820`** in masthead/Highwire `citation_doi`/JSON-LD, canonical/OG, one derived PDF URL used by download + Highwire + JSON-LD; Paper A bibliography #4 uses **concept DOI `20531588` in both HTML and PDF**, no original `20531589` in the generated Paper B publication. Sitemap includes Paper B, staging remains blocked.
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

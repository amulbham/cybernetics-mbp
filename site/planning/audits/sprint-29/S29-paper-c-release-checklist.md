# Sprint 29 — Paper C release checklist (T29.5 and the production gate)

Status: PLANNING CHECKLIST, 2026-11-12. Prepared in parallel with the T29.4 staging replan. **No authority:** T29.5 is an unsealed draft ([ticket](../../tickets/T29.5-paper-c-seven-pdf-release-controls.md)); production promotion, Zenodo publication and indexing changes each need their own seal and owner authorization. Nothing here was run.
Purpose: list every gate between an accepted staging preview and a published Paper C, with who proves it and what evidence closes it, so none is assumed from the staging preview.

## What the staging preview does and does not prove
The staging candidate is a **labeled specimen** (`noindex`, no canonical, JSON-LD, Highwire or date; "Candidate specimen"; PDF `fe6eaf21…9446`). It proves the design, the served bytes and the six historical PDFs' preservation. It does **not** prove publication-mode metadata, the production guard, the final dated PDF, the excerpt/slug/date decisions or the claim audit. The corrected final-form PDF `2b0f1e35…53e2` exists only as a rehearsal artifact. **The PDF released to the website and to Zenodo will differ from the labeled staging candidate** (it is the publication-mode render, a different byte string from the labeled candidate; the owner approves that exact final PDF hash, see item 9).

## Checklist

| # | Gate | Needs | Evidence that closes it | Owner / reviewer |
| --- | --- | --- | --- | --- |
| 1 | T29.3a closed | Planner's independent post-implementation record and a Planner ACCEPT ([closure status](S29-T29.3a-closure-status.md)) | The record attached; the Executor completion report accepted | Planner |
| 2 | T29.4 staging accepted | Owner visual acceptance bound to the deployment URL and candidate hash; exceptions E1–E6 dispositioned | T29.4 completion report; capture index; owner decision | Owner |
| 3 | **Independent publishing-facts oracle** (T29.5) | Extend `site/scripts/validate-publishing-facts.mjs` and its independent HTML oracle with the Paper C expectations built from **independently reviewed, owner-approved** metadata, route and identity sources, never from generated HTML, runtime constants or the render input. Include the **forward-masthead identity-link census** (exact permitted identity links and counts) and the approved excerpt, DOI, role, author note and publication dates; preserve the legacy page/link expectations | Reviewed diff and oracle inputs with hashes; mutation tests rejecting missing, extra, duplicate or misdirected identity links, altered metadata, stale dates and candidate claims | Independent reviewer |
| 4 | **Seven-PDF production guard** (T29.5) | The six historical path/hash pairs derived from `site/scripts/fixtures/approved-six-production-pdfs.sha256`; the seventh canonical path/hash added only from an independently reviewed oracle bound to the release manifest, identity and exact bytes (not from build output). Fixture and carry-over bootstrap extended for the seventh PDF. Keep the six-file guard live until the authorized transition | Guard runs in the same job after assembly and before every production upload path; fixture and manifest diff reviewed | Independent reviewer |
| 5 | **Negative tests** | Wrong count, path or hash; missing, extra or duplicate records; candidate bytes or provisional identity; config mismatch; fallback rendering; guard bypass or skip; failed or partial assembly | Mutation and workflow-wiring harness reporting each expected failure observed; the old six-file regression suite and baseline suites still pass (28 contract cases, `test:facts`, guard, carry-over, PDF-images) | Executor, independent R3 review |
| 6 | **Full release rehearsal** | In an isolated clean tree, a production-mode build: production-mode HTML (canonical, JSON-LD, Highwire, dates), `validate:facts`, `validate:pdfs` (7/7, scholarly metadata), the identity-link census, all seven PDFs assembled from exact approved bytes with **no renderer calls**, the production guard wired before upload; stop before upload. Visual table QA: mobile (390 px) and desktop (1440 px) captures of all 16 Paper C tables; targeted captures of PC-T1 (4-col blank-header matrix) and PC-T13 (8-col appendix); no page-level horizontal overflow on mobile; contained scrolling for PC-T13 and other wide tables; no regression to existing published articles; reuse existing `.table-container` components and responsive CSS only | Diff, candidate tree, oracle inputs, full-build logs, rollback/abort plan and all seven verified digests returned for independent R3 review; table captures at both widths; overflow and scroll assertions PASS; existing-article regression check PASS | Executor, independent reviewer |
| 7 | Route-history and page facts | Route-history row, relations, excerpt (owner-approved, [register §13](../../programs/future-scholarly-pdf-standard.md#13-owner-approved-publication-excerpt--2026-11-11)), final slug and **publication date** installed and validated against the independent oracle; the `paper.pdf` legacy redirect and `_redirects` regenerated | Oracle diff; rehearsal output; sitemap/closed-to-open indexing delta listed explicitly | Owner decisions; independent reviewer |
| 7a | **Candidate notices, DOI and description cleanup** (owner decision 2026-11-12) | The concept DOI `10.5281/zenodo.24120332` is verified against the authenticated deposit and resolves; the article `<meta name="description">` (truncated in the staged candidate) is corrected; the final PDF carries a clean, clickable DOI line; **both candidate notices are removed** from the final PDF ("Candidate specimen — not published" and the "public verification pending" wording) and from the production HTML | Oracle expectations and negative tests assert the absence of both notices and of the pending wording; rehearsal HTML and PDF checked; link target equals the verified DOI | Owner; independent reviewer |
| 8 | **Primary-source claim audit disposition** | The independent claim-to-source audit is OPEN. Either the audit completes, or the owner records an explicit informed disposition (accept risk, narrow the claims, or defer publication) | Audit report or the owner's written disposition referencing exact claim set and manuscript pin | Owner; independent reviewer |
| 9 | **One final PDF hash for website and Zenodo** | The owner approves the exact final publication-form PDF bytes (SHA-256) once; the same bytes are deposited on Zenodo and served on the website (the seventh frozen PDF). DOI concept `10.5281/zenodo.24120332`, version `10.5281/zenodo.24120333`: authenticated deposit reconciliation (title, authors, date, file hash, version/concept relation) matches the website's Highwire and JSON-LD | Approval record naming the hash; deposit metadata reconciliation; hash equality between the staged release artifact, the Zenodo file and the post-deploy live download | Owner |
| 10 | Production release (separate seal) | Exact upload inventory and tuple GO; preflight variable evidence for the seven-row `PDF_MANIFEST`; carry and guard before Wrangler; post-deploy download of all seven hashes; closed-to-open indexing only as authorized | Actions run evidence, seven live hashes, OPEN indexing check | Owner; Planner verification |
| 11 | Zenodo publication (separate authorization) | Deposit created from the approved bytes, metadata reviewed, published only after the website's final bytes are fixed; no independent regeneration | Published record URL and hash | Owner |
| 12 | Indexing and discovery changes (separate authorization) | The staging candidate must have no canonical/sitemap entry; production sitemap and robots changes are part of the release seal | Live verification after release | Owner |

## Ordering and dependencies
1 and 2 precede any T29.5 seal. 3–6 are one R3 implementation ticket (T29.5) and end before upload. 7, 8 and 9 are owner decisions that must be recorded before the final release rehearsal's expectation files are finalized (the oracle must be built from approved values, not guessed). 10–12 each need a separate seal and GO. A change to the approved final PDF bytes after item 9 voids the approval and every dependent gate.

## Closed items
- **Item 1 — CLOSED** (2026-11-13): T29.3a closure status record accepted by Planner.
- **Item 2 — CLOSED** (2026-11-13): T29.4 staging preview accepted by owner, bound to deployment `285fb0df` and candidate PDF hash `fe6eaf21…9446`. All 22 assertions PASS; 7/7 PDFs verified; production unchanged.

## Owner decisions recorded — 2026-11-13

**Decision 1 — Research tags (resolved 2026-11-13).** The owner authorized the Executor to derive Paper C's research tags from the v4.6 manuscript Keywords and site taxonomy. Derivation performed 2026-11-13:

Manuscript Keywords (retrieved from staged HTML): cybernetics; self-organizing systems; cognitive physics; structural conditions; GLC; C=MSV; feedback; homeostasis; second-order cybernetics; complexity science; emergence; verification; AI failure modes; Wiener; Ashby.

**Owner-approved tag set (8 existing taxonomy terms):**
- `cybernetics` — primary subject; in Paper C's title and all series papers
- `self-organizing systems` — core topic; same series as Papers A and B
- `cognitive-physics` — series designation; explicitly in subtitle ("A Cognitive Physics Framework")
- `complexity-science` — field scope covered (manuscript Keywords, Papers A and B)
- `cognition` — explicit test domain in excerpt ("tests across biology, cognition, and AI")
- `seven-invariants` — the framework this paper extends (Papers A and B)
- `attractor-dynamics` — named structural condition in the framework (Papers A and B)
- `conservation-law` — named structural condition in the framework (Paper A)

All eight tags exist in the current site taxonomy. No new taxonomy term is introduced. The Coordinator reviewed and approved this derivation as within scope (routine tag selection per owner authorization). These tags must appear visibly in Paper C's article front matter.

**Decision 2 — Homepage and research hub (resolved 2026-11-13).** The owner authorized Paper C to appear in all appropriate publication discovery surfaces:
- **Homepage spotlight**: Paper C as the spotlighted research publication, replacing the current spotlight (The Lab Bubble, Oct 30, 2026). The Lab Bubble is not deleted or modified.
- **Research hub** (`/research/`): Paper C as a normal published entry.
- **Cybernetics category** (`/research/cybernetics/`): Paper C as a normal entry.
- **Tag listings**: Paper C discoverable through each of its eight approved tag pages.

Both bounded additions to items 3 and 7 identified in the gap analysis are now resolved: the T29.5 ticket's oracle clause (item 3) and rehearsal scope (item 7) have been updated to include these requirements.

## Open items
The seven-PDF release controls are not implemented; the six-file guard remains the only live enforcement. The following decisions and actions are required before T29.5 can be sealed and production release can proceed:

- **Item 7** (open): final slug, publication date and excerpt installation (excerpt register §13, publication date approval). Also includes: tag installation, homepage spotlight installation, hub/category listing installation (all scoped by owner decisions above).
- **Item 8** (open): primary-source claim audit disposition.
- **Item 9** (open): owner approval of the final publication PDF hash.

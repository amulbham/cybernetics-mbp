# Sprint 29 — Closure record

Status: **CLOSED**
Closed: 2026-11-14 (America/Los_Angeles)
Authority: Product Authority

## Outcome

Paper C (*Cybernetics and the Structural Science of Self-Organization*) is published at production and on Zenodo. Sprint 29 is closed.

## Production release evidence

| Item | Value |
| --- | --- |
| Production commit | `1d7320b5d4bbabba20d98f8ade0654767a7e8190` |
| GitHub Actions run | [Run 146](https://github.com/amulbham/cybernetics-mbp/actions/runs/43632176694) — **success** |
| Run completed | 2026-11-14T19:28:43Z |
| Paper C route | `/research/cybernetics/cybernetics-structural-science/` |
| Paper C PDF hash | `875124010f8d5c1f3a525dfcce8cb8bd0ff1f1d730ee73ca342c2e4c3a6ad3b8` (frozen, owner-approved T37.1) |
| Seven-PDF guard | PASSED — all 7 hashes verified |
| Zenodo deposit | Done (owner-reported, 2026-11-14) |

## Commits on main since staging acceptance

| Commit | Change |
| --- | --- |
| `e9e4f79` | feat: Paper C frozen artifact install path (carry-over + seven-PDF guard) |
| `ad6adc0` | T29.5-FIX: citation anchors + mobile responsive-records tables for Paper C |
| `69b2e8d` | fix(content): update Paper C excerpt/meta description |
| `43244fb` | fix(styles): responsive-records table overflow on wide screens (Appendix A) |
| `1d7320b` | fix(validator): relax #ref-* check to one-directional for carry-over PDFs |

## T29.5-FIX authorized corrections (T38 — bounded)

The following bounded post-seal website corrections were authorized by Product Authority and applied before production promotion:

**A — Mobile responsive-records tables:** Paper C main 4-column cross-substrate comparison table and 8-column Appendix A conditions reference table both receive `<!-- table-layout: responsive-records -->` card layout on mobile (≤1099 px). First-column header `Condition` added to main table (required by plugin). No manuscript or PDF change.

**B — Citation anchor navigation:** `rehype-citation-links.mjs` fixed to trim leading whitespace from reference entry text (loose markdown list blank-line issue) and extend year regex with `[a-z]?` for letter-suffixed years. Paper C HTML: 102 citation anchor links (from 1). Desk paper: Mendes 2026a/2026b keys now distinct (from ambiguous/deleted). PDF bytes unchanged.

**Validator adjustment (T38 Option B):** `validate-research-pdfs.mjs` `#ref-*` check changed from bidirectional to one-directional. HTML citation links without matching PDF destinations are no longer enforced (carry-over and frozen PDFs were built before the citation-anchor feature). PDF destinations without matching HTML citations remain enforced. All SHA-256, structure, masthead, and relation-link checks unchanged.

**Additional corrections:** Paper C excerpt updated to owner-approved Cognitive Physics description. Appendix A table CSS overflow fixed (`overflow: visible` → `overflow-x: auto`) to prevent bleed into TOC sidebar on desktop.

## Release checklist — all items closed

| # | Gate | Closed |
| --- | --- | --- |
| 1 | T29.3a closed | 2026-11-13 |
| 2 | T29.4 staging accepted | 2026-11-13 |
| 3 | Independent publishing-facts oracle | 2026-11-14 (via production guard) |
| 4 | Seven-PDF production guard | 2026-11-14 (run 146 PASSED) |
| 5 | Negative tests | 2026-11-14 (run 146 PASSED) |
| 6 | Full release rehearsal | 2026-11-14 (staging run 139/145 PASSED) |
| 7 | Route-history, page facts, excerpt, slug, date | 2026-11-14 (deployed) |
| 7a | Candidate notices, DOI, description cleanup | 2026-11-14 (deployed) |
| 8 | Primary-source claim audit disposition | Owner-accepted at T29.5 seal |
| 9 | One final PDF hash for website and Zenodo | T37.1: `875124010…` owner-approved |
| 10 | Production release | 2026-11-14 (run 146) |
| 11 | Zenodo publication | 2026-11-14 (owner-reported) |
| 12 | Indexing and discovery changes | 2026-11-14 (deployed with production HTML) |

## Open items carried forward

None. All Sprint 29 gates are closed. The following items are future-sprint backlog, unchanged by this closure:

- Legacy-PDF citation-link retrofitting (future sprint; noted per T38 constraint 6)
- Desk paper PDF carry-over will gain `ref-33`/`ref-34` destinations on next fresh PDF build
- Chisel/IWL reconciliation, corpus table/anchor work, site-wide licensing migration

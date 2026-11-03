# Sprint 28 — Whole-sprint independent pre-seal review request

**Review only; do not execute tickets, edit article/site files, change branches, rerun live deployment, or seal the sprint.**

## Exact review subject
Repository: `amulbham/cybernetics-mbp`, branch `planner/context`, **review the single exact commit shared in the reviewer handoff**, not a later moving branch. Primary contract: `site/planning/sprints/sprint-28-publication-identity-search-integrity.md`.

Read in this order:
1. `site/PLANNING.md` and `site/planning/templates/sprint-contract.md` (risk, approvals, contract completeness).
2. Sprint 28 primary plan at the pinned reviewer commit.
3. `site/planning/tickets/T28.4-google-scholar-inclusion-audit.md` and `site/planning/tickets/T28.5-search-schema-integrity-audit.md` (two read-only draft audit scopes).
4. `site/PUBLISHING.md`, `site/AGENTS.md`, `site/ROADMAP.md`, only as needed to validate inherited state/technical boundaries.
5. Website sources where assertions are material: `site/src/consts.ts`, `site/src/pages/about.astro`, `site/src/layouts/ResearchLayout.astro`, `site/src/lib/structured-data.ts`, Paper A/B and Three SOS frontmatter/bibliography, validators and `site/release-pdfs/expected.txt`.

**Baseline:** production `main @ 7583d87dd0b4214d69e3fc11b67be1d5c1da8407`; staging `3f2b0369169278f6606804dee17749944aee0e32`. Sprint 27 engineering released and six PDFs protected; Paper B Zenodo v2 archive byte parity still pending. Do not conflate website published with archived deposit completed.

## Review the sprint as ONE product contract
- Does a unified identity/metadata/search integrity outcome justify including DOI cleanup, author role, Substack retirement, Google Scholar and Google Search Schema.org in one sprint? Are T28.0/T28.4/T28.5 read-only audits properly ahead of implementation and rerun after launch?
- Is the work safely bounded: Paper A concept DOI `20531588`, Paper B `23068820`, dateModified only by author-approved real revision; old six PDF hashes and immutable scholarship remain intact? Is the known old v1 DOI inside a *frozen PDF* an explicitly acceptable version-history exception, or a scholarly identity conflict requiring owner decision?
- Does changing from “Independent Researcher” to **Systems Researcher** avoid misrepresenting formal `affiliation` and keep `Person.jobTitle`, author bio, future-PDF convention, and current Google-facing metadata consistent? Should there be a separate `role` field rather than blindly renaming `AUTHOR.affiliation`?
- Does removing Substack promotion from footers/About/`sameAs` correctly preserve historical factual mentions in the Chisel research article/IWL and archived PDFs?
- Are Google Scholar `citation_*`, first-page PDF/abstract/headers, canonical/author/date/DOI/robots, and Google Search Article/ScholarlyArticle/Person/JSON-LD/image/OG/indexing audits appropriate to **official recommendations**? Do they distinguish valid schema, Google Rich Results eligibility, and *observed indexing*? Are live and local sources kept separate?
- Is the current source→rendered validation architecture adequately independent, especially source identity fields checked via shared production `personIdentity()`, and are targeted negative tests/release safeguards proportionate?
- Can T28.1–3 share one risk-bounded CLOSED staging QA and selective production release without importing unreleased Chisel and without mutating the six protected PDF artifacts? Is optional T28.6 correctly separated?
- Are inherited state, risk ceiling, dependencies, hypothesis vs fact, exclusions, measurable exit, stop conditions, canonical documentation targets and owner decisions sufficient to authorize *later ticket drafting* after review?

## Expected response format
**BLOCKER / REQUIRED / OPTIONAL** findings. Give exact path/section/table-row anchors and minimum necessary corrections, not broad rewrites. State **PASS / PASS WITH REQUIRED CORRECTIONS / NOT READY**, make clear which pending decisions can be deferred to the relevant implementation ticket (Paper A date, role-vs-affiliation modeling) vs which must be fixed before the *sprint plan* is sealed. End with a minimal prospective correction set and any residual risks.

No substantive work beyond review; no implementation/seal/merge/deploy or publication metadata changes.

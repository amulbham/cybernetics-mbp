# Sprint 28 — Implementation seal and Claude Code Executor handoff

**Date:** 2026-11-03. **Status:** Four implementation tickets SEALED **for isolated working-branch execution only**. Reviewed contract: `planner/context @ 1731d0d71d463a1ab271c34fba07b0968eab93b7`; independent focused review **PASS — 0 BLOCKER, 0 REQUIRED, 0 OPTIONAL**. Product Authority approved proceeding: “okay we ready now.”

## Exact pins and authority
- Site production **`main @ 7583d87dd0b4214d69e3fc11b67be1d5c1da8407`** and staging **`3f2b0369169278f6606804dee17749944aee0e32`** (unreleased Chisel). Refresh and stop if they drift.
- Isolated candidate branch **`work/t28-publishing-integrity-candidate`**, created from exact site main pin; **work only on that branch**, never import staging or run a hosted preview.
- Permitted: source/validator/tests in four sealed tickets, local scratch builds (with temporary PDF output excluded from releases), commits on work branch, and pushing that work branch if needed.
- Forbidden: pushes to staging/main, Cloudflare deploy, PDF publication/regeneration of frozen final bytes, six-PDF manifest/expected.txt edits, Zenodo actions, schema/SEO improvements outside tickets, or triggering any staging/main GitHub Actions deploy.

## Sequential commits and gates
1. **T28.5a — baseline checker:** independent baseline oracle, post-build checker, normal `site/package.json` `npm run build` CI hook; unchanged pinned main website source; pass two baseline builds at distinct About build timestamps with **only** legacy `ProfilePage.dateModified` dynamic-timestamp exception. Observe unverified legacy `dateCreated`, do not endorse it. Full pre-target `sameAs` set strict; negative fixtures. Commit SHA1 and verify build PASS.
2. **T28.1 — DOI:** approved A1 Paper A frontmatter concept `20531588`; A2 Data Availability **retains v1 `20531589`**; A3 Three SOS reference #1 label/href `20531588`. Paper A original pubDate unchanged and **dateModified absent**. **In the same atomic commit**, update independent DOI fixture. PASS normal build and scoped failures before advancing.
3. **T28.2 — author/About:** `Systems Researcher` as **professional role** and About `jobTitle`, not invented academic affiliation; exact approved AuthorNote first sentence and unchanged remaining bio. About `dateCreated` and `dateModified` **absent by default** without separate owner-evidenced real dates. Remove T28.5a's About legacy date exception **in the same commit** as matching independent identity/date fixture. PASS two builds with different wall-clock times, role/author/date negative probes.
4. **T28.3 — Substack:** remove promotional footer/About/social entry and Substack from `Person.sameAs`; preserve historical *Chisel* factual references. **In same commit**, update full independently approved expected `sameAs` set and ensure extra/missing/duplicate/substitution fails. PASS normal build and regression.

All four commits must individually PASS against their paired fixture, then **final exact combined candidate SHA** must PASS complete build, semantic/Scholar/link/indexing and mutation tests. Report each SHA and file diff. Do not run or approve a hosted staging or production deployment here.

## Six-PDF safety: later release only
The **six existing PDFs, including Paper A**, remain immutable. Current staging workflow builds PDFs fresh, while carry-over executes only on main: CLOSED indexing on staging **does not guarantee preservation**. Any staging preview would require an independent explicitly approved frozen-six PDF-safe prep and hash gate **before Cloudflare upload**. Any production release would require separate Product Authority approval of exact candidate, active `PDF_MANIFEST` equal to the six approved path/hash values, all six final **post-carry/preupload** SHA-256 checks and six fresh live downloads/hash checks **after deployment**. Do not treat two-entry `site/release-pdfs/expected.txt` as full manifest.

## Executor completion report
Return four sequential candidate SHAs, exact parent lineage and changed paths; clean-source main pin; test commands/logs and **caught/escaped/untested** mutation matrix, two baseline-build About time observations, exact metadata A1/A2/A3 and role/sameAs emitted HTML checks, all-eight-article verification, evidence that Chisel research and six PDF release artifacts were not changed, any blockers, and **one final combined candidate SHA**. Stop for independent Planner acceptance before new release planning.

The sealed [tickets](../../tickets/T28.5a-independent-publishing-metadata-validation.md) and owner [decision record](S28-owner-decision-record.md) remain authoritative. This handoff does not claim code implementation has occurred.

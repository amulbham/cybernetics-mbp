# Sprint 25 — Corpus SPM exit condition and Chisel publication-readiness

**Date:** 2026-10-28 · **Mode:** Owner-scoped planning and read-only publication assessment. No execution, release, manuscript edit or prospective ticket seal.
**Authority:** The owner expressly confirmed an additional Sprint 25 finish-line condition: each existing published research entry has a recoverable SPM home and canonical author-approved, primitive-bearing manuscript; the website is reconciled to accepted corrections or an explicit no-change verdict.

## Scope lineage
- Original 2026-10-21: author-owned Markdown/primitives, recoverable handoffs and validated update/new-entry publication procedures.
- Earlier expanded 2026-10-28: audit six published research entries plus Chisel IWL; produce author-approved corrections; ship FAFSA v2.4, Lab Bubble and Chisel/IWL; fourth independent workflow test; canonical runbooks.
- **New explicit expansion now:** all **six baseline published research entries**, not every unrelated or unfinished paper in `amulbham-research`, end Sprint 25 with `papers/<slug>/STATE.md`, one current `assets/manuscript.md` with all **author-selected primitives in place** (including intentional zero), and source-anchored `editorial/` or `checkpoints/` records as applicable. New Sprint 25 entries and fourth manuscript also follow this pattern when prepared, but fourth publication remains optional/separately authorized.
- An SPM backfill is a **best-effort reconstruction**; preserve public source hashes and recovered decisions, mark missing history **UNRECOVERED** and avoid inventing private drafts, author approvals, prior rationales or an IWL. A folder can be complete with explicitly bounded history; no compulsory IWL or invented checkpoint.
- Website acceptance: source-to-site comparison at exact commits; authorized corrections actually released and verified, **or deliberate author-approved no-change**. Keep title/slug/DOI, date, PDF/version identities and accepted exceptions unless independently approved. No quota or compulsory primitive insertion.
- Owner requested **deferring Desk/Invariants and other legacy SPM backfills** until later. Scope addition entails real work; do not create six migration tickets or implement any backfills now. Pair later recoveries with individual article editorial dispositions.

## Baseline six-entry reconciliation inventory (site main 9697dbc7310c480d4b6349104e9504107e4341a2)
| Entry | Site callouts | Status / provenance boundary |
|---|---:|---|
| Desk | 4 | Owner reports missing SPM; later trace T20 evidence and existing publication without invented drafting history; protected PDF |
| Three SOS | 0 | T25.4 reasoned zero-primitive keep; folder/accepted source inventory later |
| Invariants of SoS | 5 | Owner reports missing SPM; later recover as possible; unlinked-reference policy still unresolved |
| Frontier Training | 5 | Folder/accepted source lineage to be verified; T25.4 reading and citation issues pending |
| Chisel | 9 | **SPM + approved research source present** on `papers/chisel-s25-editorial @ 3ceccad4f6180a3820829dd600fdede7f3a0db04`; website still old; PDF release pending |
| FAFSA | 11 published / 18 proposed v2.4 | Backfill inventory later, author approval for v2.4 and protected PDF/version decision pending |
This table does not assert whether other five research SPM folders currently exist: no comprehensive research-repository folder inventory was performed.

## Chisel pinned publication-readiness assessment
**Accepted research article:** `amulbham/amulbham-research` `papers/chisel-s25-editorial @ 3ceccad4f6180a3820829dd600fdede7f3a0db04`; `papers/the-chisel-fallacy/assets/manuscript.md` Git blob `bfed8b1b3f40cd117aeb3ccb57e4ed87c1d345f6`. All 9 accepted primitive anchors integrated. Companion `papers/the-chisel-fallacy/editorial/IWL.md` blob `dee280aec9a39dded0b2eeea35669da590760457`, preserving the historical OPAQUE V1 ledger with approved dated clarification. Research `STATE.md` says **EDITORIALLY APPROVED**, **NOT PUBLICATION-READY**.
**Current website:** `main @ 9697dbc7310c480d4b6349104e9504107e4341a2`; Chisel `site/src/content/research/the-chisel-fallacy-what-pangram-actually-measures/index.md` blob `632d2d9d331bf885f0aaa279f7e6d99aaaca04b1`; IWL `site/src/content/iwl/the-chisel-fallacy.md` blob `9219e954826050a267a86b72748d5ded5078be0d`. These remain the original public edition; no site write here.
**Original identity:** article `format: paper`, `category: knowledge-work`, same entry slug/route and IWL `parent`; `pubDate 2026-09-22`, inherited `dateModified 2026-10-18`. Listed DOI `https://doi.org/10.5281/zenodo.23458660` is **not independently confirmed deposited/resolving**. Old Chisel PDF listed in `site/release-pdfs/expected.txt` with hash `1f68d9eec9a0d8412a7fefc4d2c42b17f340801fbbef438b671edbffaf4582f3`; do not replace casually.
**Website flow:** `site/PUBLISHING.md` §“Revising a published paper (T23.0 flow)” requires source hashes/comparison, owner-approved `dateModified` and IWL edition/date decision, DOI custody, named mechanical projection only; separately sealed website intake; staging article/IWL/OG/print-PDF inspection; exact owner approval of newly generated PDF; preserved other four scholarly PDF bytes; controlled release and fresh all-five PDF postrelease check; owner-managed Zenodo parity later.

## Chisel next authorization decisions
1. Owner sets article and companion IWL substantive revision date(s); chooses whether IWL remains called **v4** with dated updates or receives an explicitly versioned edition. Retain original `pubDate` and current slug/parent unless separately approved.
2. Owner confirms DOI/Zenodo deposited/reserved status and any versioning/deposit operation. Neither the URL in frontmatter nor a Git commit verifies DOI parity.
3. Retain T23.0 approved Chisel unlinked-reference exceptions; decide whether to perform a narrow actual landing-page verification for Daily Californian ref 12 and other reported link anomalies. Do not auto-apply newer blanket link requirements.
4. Once choices are recorded, draft one **bounded website intake ticket** with exact accepted Chisel source SHAs and allowed metadata changes; independent pre-seal review, owner prospective seal, and later staged PDF/production approvals. Do not edit research/source wording in the website Executor.
**No branch merge, staging/main change, build, PDF change or release authorized by this checkpoint.**

## Sprint 25 positional recap
- **Original goal:** canonical author-owned manuscript/primitive handoff and reproducible release mechanism.
- **Approved expansions:** six-entry audit and named release outcomes; now additionally six SPM homes with canonical manuscripts and cross-repo source/site reconciliation.
- **Verified:** Chisel canonical research files accepted; public version and frozen PDF still unchanged; source-level publishing prerequisites inspected. **Not verified:** other five SPM folder states, new article render, live links, PDF release, DOI or deployment.
- **Completed → current → next:** foundation/T25.4 audit accepted → Chisel editorial source approved/**publication readiness now** → author metadata/DOI decisions → prospective website ticket/staging/PDF/release → FAFSA/Lab Bubble and later SPM+corpus backfill → fourth test/final runbooks.
- **Scope creep:** explicit owner-approved **additional SPM completion work** with limited corpus; legacy backfill deferred and separately authorized, not buried in Chisel release.

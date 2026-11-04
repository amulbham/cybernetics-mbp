# Sprint 28 — Next implementation package: focused independent pre-seal review

**Status: FOCUSED REVIEWER R1–R3 CORRECTIONS APPLIED / RECHECK READY / NO TICKET SEALED.** Whole-package independent review at `bf78f9d` returned **PASS WITH REQUIRED CORRECTIONS — 0 BLOCKER, 3 REQUIRED, 1 OPTIONAL**. [Focused reconciliation](S28-implementation-review-corrections-reconciliation.md) is the delta under recheck. Review the immutable, explicit [Product Authority decision record](S28-owner-decision-record.md) and the following **four draft tickets together**, against site `main @ 7583d87dd0b4214d69e3fc11b67be1d5c1da8407`; `staging @ 3f2b0369169278f6606804dee17749944aee0e32`, unreleased Chisel excluded.

Files:
- `site/planning/tickets/T28.5a-independent-publishing-metadata-validation.md` (F2 independent factual oracle and caught/escaped regressions)
- `site/planning/tickets/T28.1-paper-a-three-sos-doi.md` (A1 change, A2 retain, A3 change)
- `site/planning/tickets/T28.2-systems-researcher-author-identity.md` (short role vs affiliation, shared author note, About date)
- `site/planning/tickets/T28.3-substack-promotion-retirement.md` (active Substack only)

## Focused correction recheck: previous R1–R3 and O1
- **R1:** baseline checker actually runs in normal `npm run build` (and therefore CI), admits *only* the legacy build-time About `ProfilePage.dateModified` exception, records legacy `dateCreated` as unverified, then target removes date exceptions and enforces **entire exact sameAs set** (extra/missing/duplicate fail).
- **R2:** T28.5a owns standalone passing checker + baseline oracle; T28.1 DOI, T28.2 role/About and T28.3 `sameAs` each own their **paired source + expectation fixture** modifications, with a PASS after each isolated candidate commit and a **single final combined SHA** required before any future preview/release.
- **R3:** **NO staging push under any of these four seals**. Existing staging workflow skips main carry-over and generates fresh PDFs. Any Cloudflare preview needs a separate PDF-safe frozen-six prep contract. Separately authorized main production must check active six-row manifest plus six post-carry preupload deployable SHA values, then independently download/hash six live PDFs after deploy.
- **O1:** T28.1 wrong-old-DOI test applies to A1/A3 only; A2 must remain version-specific.

## Reviewer focus
1. Does T28.5a's two-phase **production baseline → approved target atomic transition** avoid making CI fail while T28.1–3 are pending? Are independent expectations minimal and truly distinct from production's Person helper/frontmatter? Would the validation stop the measured false DOI, role, dates, license and sameAs cases?
2. Are **all three Paper A/Three SOS occurrence decisions** preserved precisely (A1 `20531588`, A2 `20531589`, A3 `20531588`), with dateModified absent, actual scholarly citation meaning and *explicitly permitted* HTML vs historical immutable PDF divergence, no new artifact version?
3. Is `Systems Researcher` a profession/role rather than affiliation, with same canonical Person `@id`/ORCID and shared `AUTHOR.bio` unchanged except approved first sentence? Do source and template consumers require a migration strategy? Is About `dateModified` real/omitted and unverified `dateCreated` omitted until documented?
4. Is Substack marketing removal limited to `SOCIAL_LINKS`, footer and About, leaving historic Chisel references untouched and maintaining accurate other `sameAs` identities?
5. Are all tickets appropriately staged, isolated from unreleased Chisel, and safe to implement only after prospective seal? Is there any hazard from needing a **single selective candidate** for validation oracle plus source transition versus separate staged commits? Does the six-PDF manifest and exact pre/post byte verification survive?
6. Keep recommendations proportionate; defer Sprint 29 PDF redesign and nonessential Google-rich-result cosmetics. Any unknown date/oracle fact must be flagged, not inferred.

Return **BLOCKER / REQUIRED / OPTIONAL**, minimum correction against file+section anchors, and **PASS / PASS WITH REQUIRED CORRECTIONS / NOT READY**. No file edits, seal, implementation, staging/main push, PDF regeneration, repo-variable edits or Zenodo action. Focus review on implementation safety; sealed Sprint 28 whole-sprint contract itself is not being reopened.

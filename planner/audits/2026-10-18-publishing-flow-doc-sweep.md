# Publishing flows — documentation sweep and improvement backlog

Inspected 2026-10-18. Source revision: main `1878c269ef837ce5abe203d742cdc85e3e14ebc0`.
Scope: read-only repo/docs sweep plus approved Planner notes; recommendations are not sealed work.

## Verified release and evidence boundary

- Run #122/39175614360 attempt 2 on this SHA succeeded. Job 117818404757 logs show one frozen swap and five live hashes matching the manifest.
- Main/staging refs and open PRs were freshly checked; no open PRs. G5 host/render/cache observations below are Executor-reported, not independently repeated.
- Owner explicitly takes over Zenodo upload and deposit/DOI checks; do not duplicate the deposited-file verification.
- Two retired tag paths still serve cached noindex 200s without cache busting, versus 404 with it. Bare-URL E2 remains a caveat; no global cache fix is earned by this alone.
- Actual final G5 supplement is local-only Executor commit 36ed554. Do not import an imagined supplement or assert it is already on main.

## Current documentation corrections (not applied to main here)

| Priority | Source at inspected main | Verified issue | Proposed correction / canonical owner |
|---|---|---|---|
| High | HANDOFF.md:8,18–34,49–50 | Pre-S6 refs/status, PR #1 transition, old Chisel hash and Desk-only exception | Refresh release snapshot, current article/IWL/PDF and owner handoff; retain provenance and fresh-check instruction |
| High | site/ROADMAP.md:14,16,22 | 41 tags vs current 40; S6 simultaneously pending/accepted; T23 production pending | Current active index: S6 accepted/promoted, Chisel delivered, cache follow-up, Zenodo owner-managed, process then content batch |
| High | site/AGENTS.md:32 | S6 still prepared/awaiting release | Correct current release pointer and provenance; keep earlier runs as historical facts |
| High | site/PUBLISHING.md:61–72,127–138 | New revision flow coexists with old new-version procedure and “Chisel next/not frozen”; flow is hard-coded to five PDFs | One authoritative update/new-entry runbook; label existing technical limits honestly until implemented; explicit owner-managed external handoff |
| High | .claude/skills/content-manager/SKILL.md:23,53,61,71–72 | Removed homepage grid; four papers; automatic new-paper claim; merge-to-main guidance; sitewide deindexed claim | Condensed checklist derived from canonical docs: current routing/indexing/promotion, intake, update/new branch and artifact preservation |
| Medium | site/CHANGELOG.md latest entry; T23 sprint/ticket/evidence | Candidate/staging record is valid history but lacks later production result; actual final supplement not yet imported | Append new production outcome; add prospective authorization/closure reconciliation without altering seal/historical meaning; import actual evidence selectively |
| Medium | CONTENT-MODULES.md:85; validate-desk-presentation.mjs:179 onward | Table integrity is sound, but every new allowed article requires code inventory changes | Separate generic opt-in integrity from Desk-specific fixtures; preserve per-ticket scope/inventory and fail-closed semantics |
| Medium | planner/README.md:25,31 on planner/context | PR #1 fallback says “until merges,” but it closed superseded | Working-branch boot pointer corrected in this checkpoint; selectively reconcile main copy at next approved release |

Do not edit every document to restate the same process. PUBLISHING owns publication semantics/flow; AGENTS owns implementation gotchas; skill is the small operational adapter; ROADMAP indexes work; CHANGELOG records outcomes.

## Technical gaps that documentation alone cannot fix

1. **New scholarly paper:** carry-over-pdfs.sh:45,93–98 fixes the count at five. A sixth paper fails manifest shape. Derive/check exact intended PDF set deliberately; never drop cardinality/path/hash checks.
2. **New scholarly paper:** carry-over-pdfs.sh:100–106,115–120 requires an HTTP 200 production PDF before frozen fallback. A new path returns 404 and fails before it can install the approved blob. Any new bootstrap branch must be limited to the explicitly approved path/hash; unrelated missing PDFs must still fail.
3. **Updating Desk:** carry-over-pdfs.sh:117–120 takes Desk's pinned old Zenodo artifact branch and excludes Desk from generic frozen replacement. A generic update runbook must not claim any paper can already use the Chisel path.
4. **Per-article table allow-list:** validate-desk-presentation.mjs:179 onward pins two Chisel pages and Desk. Reuse must retain label/cell/ID/search/print checks without requiring shared-code changes for every authorized marker.
5. **Manual manifest transition:** runtime safety worked, but the first release push used a manifest that did not match the candidate. Generate the exact proposed manifest, validate expectation/artifact agreement, and require real owner-setting confirmation or authenticated preflight before pushing. This is not solved by another successful local check against a supplied proposed value.
6. **Regeneration/custody:** every staging push regenerates PDF bytes; the builder typesets all papers before carry-over replaces them. Freeze only final accepted bytes; no evidence-only staging push. Selective generation/stable CI artifact reuse is a possible later optimization, not a prerequisite or implemented feature.
7. **Local dates:** FormattedDate.astro uses host-local formatting of UTC dates. UTC build convention mitigates today; a shared date fix is a separately bounded follow-up.

## Proposed two-flow contract

| Stage | Existing entry update | New entry submission |
|---|---|---|
| Intake | Exact MD hashes; diff against current source; changed reference/metadata/IWL inventory | Exact MD hashes; settle id/category/format/date/description/excerpt/DOI/license/IWL |
| Identity | Keep id/routes/pubDate; substantive dateModified; explicit DOI/version decision | Choose permanent id; original pubDate; new route-history commitment and optional companion |
| Preparation | Apply agreed mechanical normalizations; preserve other prose | Same normalization contract; detect unsupported grammar before staging |
| Review | One coherent staging review of rendered delta and final artifact | One coherent first-publication review of article/OG/optional IWL/PDF |
| Artifact | Replace selected approved PDF; preserve unrelated PDFs | For paper, add approved PDF and extend exact inventory; essay/memo has no PDF |
| Release | Freeze, main-based candidate, real manifest readiness, one authorized push | Same release discipline, including genuinely new-path bootstrap |
| Close | Live verification; owner deposit handoff; non-deploying records | Same, plus correct new sitemap/feed/tag/history inventory |

Subcases matter: IWL-only or HTML-only changes need not imply a newly versioned article PDF. Paper additions differ from essay/memo additions. Dates/categories/routes/DOI moves are not routine cosmetic changes.

## First improvements to choose next session (proposals)

- One bounded intake/normalization contract shared with the prose compiler; ideally a quick preflight command/report rather than another multi-agent audit. It checks actual schema/grammar and emits unresolved editorial choices instead of rewriting claims.
- Two short runbook branches in PUBLISHING, referenced by the content-manager skill. Reuse standing invariants; a ticket records only the actual delta and required risk/review gates.
- Group decisions into intake/scope approval, final staging/artifact acceptance and production authorization. Keep prospective seals and required reviews; do not silently extend the T23 waiver.
- Reuse trusted validation evidence once per changed input and distinct layer. No repeated full-corpus source hunts, frozen primitive/reference counts copied from another paper, or repeated optional prose polishing.
- Make “add one new paper without touching unrelated PDF bytes” and “revise any existing paper, including Desk” explicit acceptance experiments for a generalized release mechanism.
- Fix table validator reuse at its actual seam. Do not create a CMS, parallel renderer, new skill suite, new review orchestrator or automated versioning service.
- Capture timing next time (preparation, review decisions, build/deploy, recovery); do not promise an unmeasured minute target from this one session.

## Prose compiler handoff defects to prevent

- Complete valid frontmatter; no PENDING pubDate/description; no invented abstract. Required description may reuse authored excerpt for no-abstract work.
- Distinguish original publication date, revision date and historical manuscript/IWL development dates.
- Contiguous numbered references, visible DOI/source-path labels, unchanged true hrefs, explicit unlinked-source exceptions.
- Semantic headings and explicit blockquote boundaries; no lazy continuation swallowing ordinary prose.
- Companion parent/version/title/license reconciliation; remove duplicated shell title/byline and empty publication placeholders; verify authored numerical claims such as entry counts.
- No separately compiled prose-agent PDF: website builds the approved canonical artifact; owner deposits the downloaded production file.

## Upcoming About / author / homepage batch

- Verified owners: SITE_DESCRIPTION in site/src/consts.ts:5 is both homepage positioning and site description; AUTHOR.bio:40 is shared closing biography; AUTHOR name/affiliation/location/email:25–29 feed ArticleMasthead.
- site/src/pages/about.astro owns About prose, pageDescription:10 and contextual ProfilePage jobTitle/knowsAbout:25–31. CATEGORIES descriptions feed About cards and category listings; changes are not About-local.
- AuthorNote.astro:18–23 and print-research.css:200–208 explicitly retain the author bio in PDFs; masthead also prints. A shared identity update changes all current article HTML, while approved PDFs retain their historical text.
- **Owner decision required before that edit:** current-web biography versus publication-time PDF identity, and when a true artifact revision is warranted. Do not regenerate all PDFs or rewrite deposited bytes as a side effect of a bio refresh.
- Approve coherent copy once across About/hero/byline/bio/meta/contextual schema, preserve canonical Person identity and indexing. This is a bounded next content batch after the process unit, not authorization to implement it today.

## Promotion and exit

Save this audit and current decisions on planner/context only. Correct active instructions and append historical release evidence in one future approved batch; do not deploy solely to flip CLOSED. Obtain the actual local G5 evidence and retain the cache exception and verification provenance.

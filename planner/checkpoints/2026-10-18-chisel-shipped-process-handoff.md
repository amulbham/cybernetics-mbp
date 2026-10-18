# Chisel shipped — session checkpoint and next-session handoff

Date: 2026-10-18, America/Los_Angeles. Working memory, not a new implementation seal.

## Session outcome and provenance

- Main `1878c269ef837ce5abe203d742cdc85e3e14ebc0`; staging `dd475ef5b0580bde875cc47e0ec6be94e52b4319`; preceding Planner context `b58ffb5c1142c48c6bc53f38816f0d54e9343b3a`.
- Chisel canonical v9 article and v4 IWL reached production under unchanged URLs. Original date 2026-09-22, revision date 2026-10-18, CC BY-NC 4.0 and reserved DOI 10.5281/zenodo.23458660.
- Canonical source hashes and exact editorial decisions remain in `2026-10-18-chisel-revision-decisions.md`; no argument rewrite was authorized during ingestion.
- Read-only comparison found Markdown/frontmatter/reference/callout and IWL identity issues. User approved specific mechanical corrections, five tags, no visible abstract, excerpt-as-description metadata and an outer IWL revision date.
- R3 draft rev 1 was reviewed against code. Four findings led to rev 2: bind release hash before deploy; retry/rollback consistency; preserve H2 TOC and permit IWL markers; targeted documentation reconciliation.
- Owner gave discretion to omit outside reviews. T23-only waiver recorded at seal `e1388da`, not represented as reviews completed. Implementation `f93393c`, staging run #120 succeeded.
- Executor stopped correctly when the Desk-only validator blocked already-approved Chisel table opt-ins. Bounded R1 T23.0.1 seal `c92ec78`, implementation `dd475ef`, staging #121 succeeded. No original seal was rewritten.
- Article has two opted tables; IWL thirteen. Rendering checked at 375/768/1280, both themes, per Executor. Unmarked tables retained their normal wrapper; repeated records excluded from search/print.
- Final staging PDF was frozen as `site/release-pdfs/1f68d9eec9a0d8412a7fefc4d2c42b17f340801fbbef438b671edbffaf4582f3.pdf`; 289,922 bytes, 23 pages. Old run-120 hash was provisional and superseded.
- Main-based product candidate: a8145f0 content, e1b686e preservation/artifacts, 1878c26 reconciled docs plus selected S6 closure. No wholesale staging merge or TP2 governance promotion.
- Owner authorized production. Run #122 attempt 1 failed before build because its variable manifest did not match the committed expectation. Required preflight was not effective before the push.
- After owner requested retry, Planner used GitHub connector to retry the failed job at the same SHA. Attempt 2/job 117818404757 succeeded. Logs independently show exactly one frozen-artifact swap and all-five live manifest verification after deployment.
- Logged Cloudflare URL: https://d6d89fa0.cybernetics-mbp-site.pages.dev . Do not conflate this with a separately inspected dashboard deployment id.
- G5's 26-check live matrix is Executor-reported: 23 redirects, 13 canonical URLs, metadata, six RSS entries, 40 tags and production/preview indexing protections. Planner independently checked source/CI and six Linux synthetic release cases, not the entire live matrix or final PDF visually.

## Accepted outcome and remaining limits

- Website runtime work delivered. Two retired tag URLs still return cached noindex 200 responses without cache busting; cache-busted checks return 404, per Executor. Record this as a remaining E2 caveat, not an all-criteria pass.
- No cache purge performed. Scope any later purge to the two retired URLs; do not change global cache policy based only on this observation.
- Owner now explicitly manages Chisel Zenodo upload, deposited-file verification and DOI handling. No second assistant PDF download/hash check is needed. Record owner-managed/unverified rather than fabricate parity or resolution.
- Published site PDF hash is verified by CI; preserve it on future unrelated builds. Four other approved PDFs remain unchanged.
- Final G5 evidence exists only as Executor-reported local staging commit 36ed554; its actual file/log must be obtained before canonical import. No evidence-only deploy.
- Screen-reader and forced-colors behavior, FormattedDate time-zone behavior and external Google/Scholar effects remain follow-ups. A 4px IWL table spill had no reported clipping or page scroll.
- T22 S6 closure documents were selectively promoted with this substantive release. Closed PR #1 is superseded, never merged.

## Two-hour lesson

- Owner reports about two hours to update one article. This is elapsed session experience, not a measured benchmark or proof of a future speed target.
- Part was setup: selective immutable PDF custody/release expectation, IWL dateModified support and extending reusable table presentation beyond Desk.
- Recurring friction: incomplete incoming metadata and Markdown grammar, conflicting instructions, article-specific table inventory, repeated small handoffs, manual variable transition and staging PDF regeneration.
- Guard behavior was correct; the stale manifest is a release-preflight failure to prevent, not a reason to weaken artifact verification.
- Do not make every routine revision repeat shared-system design, a broad audit or T23's entire adversarial corpus. Keep existing seal/risk/review rules until any prospective change is approved.

## Next primary intent: two operational flows

- APPROVED direction: improve existing-article updates and new-article submissions next session, then likely About/author/home content. Detailed designs below are proposals, not implementation authority.
- Update flow: hash inputs and diff against current source; preserve identity/pubDate; classify article/IWL/metadata/shared changes; normalize approved presentation; validate once per meaningful layer; one final staging/PDF approval; freeze; prepare main candidate; confirm manifest before push; verify production; owner Zenodo handoff.
- New submission flow: settle id/category/format/date/summary/DOI/IWL/license; create content and historical route commitments; validate generated reading identity; for a paper, approve/freeze first PDF and deliberately extend preserved artifact inventory; release/verify and hand deposit to owner. Essay/memo path has no scholarly PDF.
- Current release code is not ready for a generic new paper: count fixed at five; origin fetch must return 200 before blob fallback. Desk revisions also still take its old pinned Zenodo branch ahead of the generic frozen path.
- Use the accompanying source-linked documentation audit; do not start a new discovery sprint or create a CMS/new skill system.

## Prose-compiler feedback to carry forward

- Emit complete schema-compatible frontmatter; no PENDING fields or invented abstract. Separate original publication date, approved revision date and historical development dates.
- Keep References contiguous, numbered and ordered; use visible DOI/source paths and preserve hrefs. Report real unlinked exceptions instead of fabricating URLs.
- Delimit callout/pull-quote boundaries with blank lines; use semantic heading levels; remove duplicate shell title/byline from IWL ingestion.
- Reconcile companion identity/version/parent/license and remove publication placeholders. Check authored counts such as the five Discovery Context notes.
- Preserve the canonical prose; supply a small normalization/change report. Website builds the PDF; prose compiler supplies Markdown, not a separately typeset deposit file.
- Update the existing prose-writer handoff convention after agreeing the input contract; do not create a new compiler agent/tool project.

## Next session start and publishing-doc promotion

1. Read current main HANDOFF plus Planner STATE and this checkpoint; verify refs/recent workflow before status claims.
2. Use `planner/audits/2026-10-18-publishing-flow-doc-sweep.md` to choose the smallest earned process/technical improvement. Distinguish verified limitations, proposals and approved decisions.
3. Reconcile current docs in one scoped batch; append release history, never rewrite old CHANGELOG/ticket seals. Promote actual final T23 evidence with the next appropriate approved release, not a status-only deploy.
4. Decide shared author identity across evolving HTML and preserved publication PDFs before editing AUTHOR.bio/masthead. About copy/meta/schema and homepage positioning can then be reviewed as one bounded content batch.
5. No runtime implementation, variable change, global cache change, next numbered ticket or About rewrite was authorized by this checkpoint request.

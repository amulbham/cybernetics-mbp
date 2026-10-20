# Homepage and About copy — reviewed packet

Date: 2026-10-20, America/Los_Angeles.
Status: approved copy and reviewed scope; contracts remain unsealed. No execution authorized by saving this packet.

## Verified baseline
- Fresh GitHub heads: main 1878c269ef837ce5abe203d742cdc85e3e14ebc0; staging dd475ef5b0580bde875cc47e0ec6be94e52b4319.
- Preceding Planner context: c4730db12e18e83fbf4cec172ecb5f33d3018fb8.
- No open PRs at the planning check. Source read from main; latest main workflow remains successful #122 attempt 2.
- Homepage visible blurb currently shares SITE_DESCRIPTION with metadata/WebSite JSON-LD. About introduction is page-local.
- Shared author identity prints in PDFs and is excluded from this sprint.

## Approved direction and scope
- Owner prioritizes this web-only copy batch now. Publishing-workflow mini-sprint remains separate deferred work.
- The three PRIMARY selections supplied by the owner are final copy; alternatives are excluded.
- Sprint 24 / one R1 IMPLEMENTATION ticket T24.0. Product edits limited to index.astro and about.astro.
- Homepage visible blurb becomes page-local; retain SITE_DESCRIPTION and all current metadata values.
- About intro uses the exact supplied text in three paragraphs. Other About sections remain unchanged.
- No CSS, shared components, author bio/byline, research/IWL, PDF, routing, indexing, manifest or pipeline changes.

## Review and disposition
- Owner supplied external review: SEAL-READY after confirmation of final PRIMARY copy; no structural changes needed.
- Existing owner selection already provides that copy approval; do not ask to select variants again.
- Optional clarification incorporated: apply existing lead class to all three About paragraphs and check visible spacing locally; stop if CSS is required.
- Optional clarification incorporated: source on accepted sealed base is authoritative over a differing live/cached H1.
- Reviewer identity was not supplied. No extra external review is claimed.
- This is a bounded correction check, not a new broad review cycle.

## Reviewed drafts
- site/planning/sprints/sprint-24-homepage-about-copy.md on planner/context.
- site/planning/tickets/T24.0-homepage-about-copy.md on planner/context.
- Read main separately for executable source. Do not merge planner/context wholesale or treat its older code tree as the deployment baseline.

## Next gate and operating flow
1. Owner authorizes the Executor to retrieve only the reviewed packet, recheck refs, record prospective seal, implement and validate, then deploy staging if explicitly granted.
2. Planner/owner review one staged copy/layout packet; expected product diff is the two page files.
3. Prepare a scoped main-based candidate after acceptance/authorization. Approve exact SHA before main push.
4. Production CI preserves five PDFs; expected frozen swaps zero. Verify the two live pages and record actual evidence without another status-only deploy.
5. Update Planner STATE/checkpoints at meaningful gates. Promote selected verified conclusions into canonical docs only through authorized work.

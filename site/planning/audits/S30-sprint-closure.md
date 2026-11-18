# Sprint 30 — Release, closure and continuity record

Date: 2026-11-17 (America/Los_Angeles)
Disposition: CLOSED for approved Sprint 30 scope; owner confirms final push and post-check and requests handoff to next sprint. No new release authorization.

## Release evidence
- VERIFIED GitHub main `ee3ebc6ccf658a7005e219830db247f2c8c75c89`, staging `15c37e9a17b2c1fe65317a3a62d0aea4f4d14128`.
- [Production run #154](https://github.com/amulbham/cybernetics-mbp/actions/runs/44222302915) success; deploy job 134526896274, completed 2026-11-18T02:20:18Z (Nov 17 local). Planner inspected steps and logs: build/open indexing 67 pages, 0 issues; PDF identity 7 papers/7 PDFs OK; 25 redirects, 9 route-history rows; seven-PDF pinned manifest equality and dist digest guard PASS; carry-over 7, zero swaps; Wrangler 4.129.0 upload of exact SHA to production successful; [deployment URL](https://f9c67004.cybernetics-mbp-site.pages.dev); post-deploy live verification matched manifest on attempt 1. These are independently inspected workflow results, not separate Planner downloads.
- Prior baseline `1d7320b5d4bbabba20d98f8ade0654767a7e8190`; [comparison](https://github.com/amulbham/cybernetics-mbp/compare/1d7320b5d4bbabba20d98f8ade0654767a7e8190...ee3ebc6ccf658a7005e219830db247f2c8c75c89) independently checked: 12 commits ahead, none behind, 34 changed files. No workflow, frozen PDF, manifest or guard-fixture edits. Product-only promotion, not a wholesale staging merge.
- [Staging #153](https://github.com/amulbham/cybernetics-mbp/actions/runs/44158502957) green. Executor reports hosted license inventory matched 13 routes, other work pages unchanged except Paper C footer; Latency Trap PDF routes 404.
- Executor reports production preflight of exact released SHA PASS (PDF_CARRY_OVER=true, PDF_RELEASE unset, SITE_INDEXING=open); validate:pdfs 7/7, 65/65 facts mutations, 23 license checks, 28 scholarly correction cases. Candidate vs live: 49 identical, 6 new, 12 differing as accounted for in report. Owner confirms final fast-forward push and post-check; detailed standalone post-check transcript not supplied.
- Preflight fixes: required Latency Trap route-history row, two release-context CHANGELOG headings; two ROADMAP conflicts resolved within scope; excluded staging-only governance, hooks, rules, planning experiments. Executor's reported excluded-file count is not a disjoint arithmetic partition; verified actual release diff is 34 paths.

## Ticket dispositions
| Ticket | Outcome | Evidence |
|---|---|---|
| T30.1 | ACCEPT local checkout recovery | Executor report, historical handoff collision waived; not production code |
| T30.2 | ACCEPT local-first workflow and preflight | af8e7a0 / #147; production preflight tool promoted; governance remains staging/planner-only |
| T30.3 | ACCEPT responsive titles | f97dfa9 / #148; owner preview |
| T30.4 | ACCEPT citation offsets and DOI layout | 78f2c93 / #149; owner preview |
| T30.5 | ACCEPT mobile search control | fbd67d1 / #150; deferred polish/warning below |
| T30.6 | ACCEPT forward-only print typography | b06da567 / #151; CSS 9 4 4, word-spacing -0.04em, chromium ignores line-limit; existing bytes protected |
| T30.7 | ACCEPT essay intake and publication | a3058f9 / #152; pinned source and editorial audit; route-history added at release |
| T30.8 | ACCEPT forward work licensing | 15c37e9 / #153; revised R3 contract c9a53b1; preflight and production evidence close earlier PDF-check deviation |

T30.7: [live essay](https://amulbham.com/research/ai-systems/the-latency-trap/), manuscript research commit 821b08bae7fad44bec021e4d0d41210c3023f599, blob 0927175545d08f7ed8d5f5c41055d83c26d7be9f, v6; six verbatim primitives, four findings, 14 inline links, 12 references, no PDF/DOI. [Published editorial audit](https://github.com/amulbham/cybernetics-mbp/blob/ee3ebc6ccf658a7005e219830db247f2c8c75c89/site/planning/audits/T30.7-latency-trap-editorial-audit.md). Production indexing validator confirmed open; actual search inclusion not verified.
T30.8: CC BY 4.0 default for new works; eight explicit legacy NC overrides; Paper C footer consistency only; one resolver, strict schema and independent facts checks. Executor reports 71 cases/65 mutations, 23 resolution checks, seven end-to-end adversarial scenarios restored, forward print specimens. Sitewide/IWL policy untouched. Full standalone local completion and release readiness reports not available through GitHub; this is consolidated Planner evidence, not their verbatim reproduction. No need to redeploy to archive them.

## Findings and carry-forward
Already in production ROADMAP: legacy PDF harness debt (19/84 failures and incomplete legacy six-guard coverage; explanation provisional), screen-only header rules leak into future rebuilt print (T30.6 harness neutralized; frozen PDFs unaffected), sitewide/IWL licensing decision; unverified Paper C first-table-header difference, possible 56f197b.
Recorded here as deferred/not release blockers in owner-accepted scope:
- DOI size at 320px deferred; T30.5 approximately 8px mobile nav shift, polish only.
- scholarlyReview build warning: exact cause/disposition not established; review before related schema work.
- Paper C lacks route-history row per Executor; adding pdf:true creates legacy redirect, requires owner decision and separate routing ticket; no inferred approval.
- Advisory ticket guard is staging-only/inert; do not promote automatically.
- Canonical docs documentary lag: current main and staging ROADMAP/AGENTS still contain older six/five-PDF and pre-S29 snapshots, even though production uses seven. Current verified workflow/guard/code and this closure supersede stale status prose; scoped docs reconciliation candidate, not new release or mandatory Sprint 31 objective.
- Standalone reports are local/untracked per Executor; preserve if available in later doc-only checkpoint. Earlier no-dist-PDF validate:pdfs failure resolved in full preflight/CI context, not a proven checker defect.
- Preserve existing Chisel/IWL reconciliation, historic PDF citation retrofit and corpus table/anchor backlog; no next sprint scope approved.

## Operating lesson and next gate
Owner endorses local-first operation with a manual final owner production push acceptable. Planner commits canonical delta-only R0–R3 tickets; optional exact-commit independent reviewer, BLOCKER/REQUIRED/OPTIONAL; preserve risk-required evidence and explicit seal/authorization. Claude local executor reads planner branch without merging, handles routine Git, CLI, test, CI and release-candidate preparation. GitHub Actions performs actual Wrangler upload. Two intake paths share the publishing pipeline. See [workflow checkpoint](../../../planner/checkpoints/2026-11-17-sprint-30-workflow-findings.md).
This is record-only closure on planner/context. No change to main/staging, no new release. Next: fresh Planner chat reconstructs the state using repository alone, checks refs/runs, proposes Sprint 31 direction for owner discussion. Recovery test is pending, not a demonstrated result.

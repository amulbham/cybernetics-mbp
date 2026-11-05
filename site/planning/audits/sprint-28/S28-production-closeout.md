# Sprint 28 — Production acceptance and remaining closeout

Date 2026-11-05. Status CLOSED / PRODUCT AUTHORITY ACCEPTED.

## Accepted release
- Production source `710964480f432c9b8e5582b09c811308aa7c50f2`, tree `4b4f226823475f0c91ef0d58046d7c7d8048d1bd`, fast-forwarded from `7583d87dd0b4214d69e3fc11b67be1d5c1da8407`.
- [Actions #135](https://github.com/amulbham/cybernetics-mbp/actions/runs/41939517601) completed successfully. Planner independently inspected carry, PDF validation, independent six-PDF guard, Wrangler upload and live verification in that order.
- Executor reports full SHA-256 checks of six fresh production downloads matching `site/scripts/fixtures/approved-six-production-pdfs.sha256`, zero carry swaps, correct DOI A1/A2/A3, role/bio, About dates and sameAs, OPEN production indexing, and preserved historical Chisel references. Planner has inspected the report and Actions steps, but has not independently repeated the six fresh downloads.
- Product Authority visually accepted the hosted desktop/mobile preview at `https://a352447e.cybernetics-mbp-site.pages.dev`, digest `a732f2b181c4f61b890eb7e00dbcf3073a3c25372c143f7e67d8770512ae3cfe`, and subsequently stated the production result looks good. Owner authenticated CLI output supplied Actions-variable and Cloudflare account/project evidence.
- T28.4 Scholar and T28.5 schema audits, their findings and bounded corrections are retained in their existing reports. External Search Console/validator and Scholar observations remain qualified by those reports; no fresh indexing claim is inferred from deployment.

## Owner-approved disposition
The current conversation agrees to finish Sprint 28 with a bounded documentation closeout and carry the remaining staging/PDF system work into proposed Sprint 29.
- Staging remains at `3f2b0369169278f6606804dee17749944aee0e32`. Its older hosted identity is recorded as a deferred integration issue, without invalidating the selective production release.
- Preserve proposal branch `work/t28-staging-reconciliation-candidate` at `0ac207fed57943db17a28dad9f258dc41f7478ce`, tree `0f0d205ec0f91d462c490cea06d8ae4c6dadd706`. It is six commits/14 changed paths above staging. Its production-guard conditions still apply only to main. The illustrative workflow patch is a future design input, not accepted implementation.
- Sprint 29 will plan staging reconciliation, published versus candidate PDF handling, explicit per-work artifact selection and HTML/PDF version correspondence alongside the existing future-PDF presentation goals. Chisel v2/IWL and publication decisions stay author controlled. New staging-generated candidate PDFs require explicit future authorization. Existing six production artifact hashes remain protected.
- Retain the hosted preview while useful. Deletion is optional follow-up, not a Sprint 28 closure prerequisite.
- Paper B Zenodo v2 parity remains a separate Sprint 27 archive obligation.
- Retiring Paper B bootstrap/recovery behavior and cosmetic workflow comment cleanup are deferred. No executable cleanup is required to close this release.

## Remaining closeout
[T28.9](../../tickets/T28.9-production-documentation-closeout.md) prepares the small canonical docs correction from released main, records Sprint 28 in CHANGELOG/ROADMAP, and returns an exact docs candidate for the separately approved main promotion. After that pipeline succeeds and the release record is reconciled, append completion evidence and obtain final Product Authority Sprint 28 acceptance. Earlier sealed bodies and audit outcomes retain their historical meaning.

## T28.9 isolated documentation review — 2026-11-05
Planner verdict PASS for candidate `fc3cb775aeb104b362426a589d64cbacf9fe9411`, tree `d60f7b1f8eb4f0097ff16bf32855971be7b2eaee`.
- Independently compared to fresh main `710964480f432c9b8e5582b09c811308aa7c50f2`. One commit, four authorized Markdown paths, +27/-10. No code, workflow, fixture or PDF delta.
- Independently read complete commit diff. Live guard, both main triggers, rejected release values and independent baseline are described accurately. Historical entries are preserved; S29 staging/PDF work is proposed and deferred.
- Git trees confirm `site/CLAUDE.md` stays mode 120000 with identical blob `47dc3e3d863cfb5727b87d785d09abf9743c0a72`.
- Executor reports successful CLOSED normal build, TARGET facts and indexing checks. Planner did not independently rerun the build.
- No corrections required. Unrelated dated roadmap/documentation lag remains outside the sealed delta. Main promotion and resulting pipeline/live verification still need exact-candidate Product Authority approval; final CLOSED is pending.

## T28.9 production verification and final disposition — 2026-11-05
Planner verdict PASS / ALL TECHNICAL CLOSEOUT WORK COMPLETE / FINAL PRODUCT AUTHORITY SPRINT ACCEPTANCE PENDING.
- Fresh main ref is `fc3cb775aeb104b362426a589d64cbacf9fe9411`, tree `d60f7b1f8eb4f0097ff16bf32855971be7b2eaee`. Compared with `7109644`: one commit and exactly four authorized Markdown paths.
- Independently fetched [Actions #136](https://github.com/amulbham/cybernetics-mbp/actions/runs/42084464807): push event on main at exact `fc3cb775`, completed success. Carry, PDF validator, independent six-PDF guard, Wrangler and postdeploy live verification all succeeded, with guard before upload.
- Executor reports zero carry swaps and six fresh cache-busted production downloads at 2026-11-05T18:29Z whose full SHA-256 values match the approved fixture, with OPEN indexing and accepted content preserved.
- Planner's additional canonical-host download attempt returned the same 195-byte HTML 'Site Unavailable' response for all six PDF routes and robots.txt, so that attempt cannot establish PDF hashes. An independent deployment-host request returned application/pdf, and web retrieval opened the canonical homepage. Treat the canonical six-download evidence as Executor-reported plus successful live workflow verification; do not label the failed Planner attempt as a PDF hash mismatch or an independent success.
- Updated canonical operating docs and additive changelog/roadmap are now on released main. No further deployment is required to record final sprint acceptance; planner status reconciliation stays on planner/context.
- Owner pre-push variable and Cloudflare target checks retain their stated provenance. Staging reconciliation, candidate/published PDF policy and future print standards remain proposed Sprint 29 work.

| Work | Closure disposition |
| --- | --- |
| T28.0 | Baseline inventory recorded in existing audit. |
| T28.4 / T28.5 | Audits completed; official-guidance, indexing and external-tool evidence limits retained. |
| T28.5a | Independent factual checker and mutation coverage released. |
| T28.1 / T28.2 / T28.3 | Approved DOI occurrences, professional role/bio/About dates and promotional Substack removal released; historical exceptions preserved. |
| T28.6a | Documentation foundation released; superseded pending-guard directions corrected by T28.9. |
| T28.8a | Guard released and independently observed succeeding in production runs #135 and #136. |
| T28.7a / T28.7 | Preparation, owner-run upload, hosted byte checks and desktop/mobile author acceptance completed with documented provenance. |
| T28.8 | Core production release verified at run #135. |
| T28.9 | Four-file documentation release verified at run #136; final sprint acceptance remains the sole closure gate. |
| T28.6 executable cleanup | Deferred by owner disposition; bootstrap/recovery retirement requires separate authorization. |

Pending owner acceptance, append final CLOSED reconciliation to this record and update the sprint/Planner status. No source or deployment task remains within the scoped Sprint 28 finish.

## Final acceptance and closure — 2026-11-05
Product Authority explicitly directed: “Sprint 28 accepted—close it”. Sprint 28 and T28.9 are CLOSED. This acceptance resolves the pending gate in the preceding review records. Main release `fc3cb775aeb104b362426a589d64cbacf9fe9411`, core release Actions #135 and documentation release Actions #136 remain the evidence anchors. Planner STATE, sprint status and T28.9 status are reconciled on planner/context. The previous evidence limits, deferred staging/PDF work for proposed Sprint 29, separate Paper B Zenodo parity obligation and unverified external indexing outcomes retain their stated meaning. No further production deployment is needed for this closure record.

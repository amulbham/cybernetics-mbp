# Sprint 28 — Production acceptance and remaining closeout

Date 2026-11-05. Status PRODUCTION VERIFIED / DOCUMENTATION CLOSEOUT PENDING.

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

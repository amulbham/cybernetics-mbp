# Sprint 28 — Independent pre-seal review request for release-safety follow-on

**Review anchor:** use the **exact immutable `planner/context` commit specified in the review invitation**; do not substitute a moving branch head or the earlier candidate-source commit.  
**Prior accepted candidate:** `work/t28-publishing-integrity-candidate @ d7149d24c81526f66e337927c06b65060f657d3d`; production main `7583d87dd0b4214d69e3fc11b67be1d5c1da8407`, staging `3f2b0369169278f6606804dee17749944aee0e32`.

Read the [release-safety package](S28-release-safety-package.md) and **T28.6a**, **T28.7**, **T28.8** draft contracts. Compare key claims to the pinned `main` workflow `.github/workflows/deploy-pages.yml`, `site/scripts/carry-over-pdfs.sh`, `site/AGENTS.md`, `site/CLAUDE.md`, `site/PUBLISHING.md`, and accepted candidate `d7149d24`.

**Review specifically:**
1. Can docs-only updates be made safely and symmetrically without silently rewriting history or touching the new validator, and should they be accepted before preview?
2. Are all six frozen PDFs protected on a manual, isolated **non-`staging`** Cloudflare Pages branch from the **exact docs-inclusive candidate**, with `SITE_INDEXING=closed`, independent trusted active manifest equality, postbuild carry-over and complete preupload SHA matching? Is the manual Wrangler deployment route technically viable without triggering the existing GitHub deploy workflow or touching production?
3. Does T28.8 explicitly require a production CI guard that compares the **actual GitHub variable**, not merely whichever manifest the carry script receives, to approved six-path baseline **before Wrangler upload**, and six fresh live hashes after deploy?
4. Are individual authority gates and stop conditions correctly distinguished (review PASS ≠ ticket seal ≠ authorization to upload preview ≠ production GO)?
5. Are final candidate clean-build/fact mutations, About date absence, Paper A A1/A2/A3, exact `sameAs`, unmodified Chisel and no six-PDF release changes adequately covered? Is external link authenticity honestly marked UNVERIFIED where blocked?

Return per-ticket and package-level **BLOCKER / REQUIRED / OPTIONAL** plus overall **PASS / PASS WITH REQUIRED CORRECTIONS / NOT READY**. Provide minimal prospective corrections. **Review only:** do not edit, seal, implement, create GitHub branch, push staging/main, run a deploy workflow, upload Pages, change manifest, regenerate published PDF binaries or touch Zenodo.

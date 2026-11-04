# Sprint 28 — Focused independent recheck of corrected release-safety package

**Review `planner/context` at the exact commit supplied in the handoff, not a moving branch.**
Previously reviewed `9b49bb3` package: **NOT READY — 1 BLOCKER / 3 REQUIRED / 0 OPTIONAL**. Begin with [correction reconciliation](S28-release-safety-review-corrections-reconciliation.md), then read [package](S28-release-safety-package.md) and revised **T28.6a, NEW T28.8a, T28.7 and T28.8**.

Check **R1** docs sync is DECISION/R0, three-file-only and describes independent six-path guard as pending, not deployed. Check **R2** T28.7 is RELEASE/R3 and binds exact candidate SHA, entire directory digest, Cloudflare account/project/preview branch and all six PDF pairs to the owner preview GO, then **re-reads actual active manifest and reconfirms target/digest/six file hashes after approval immediately before Wrangler**. Check **B1** T28.8a defines executable non-bypassable independent six-pair and post-carry preupload byte checks in actual production workflow on *both main push and workflow_dispatch on main*, with negative tests and no unguarded bootstrap. Check **R3** T28.8 production allowlist explicitly includes that guard, requires guard inside approved exact tree before preview, and reruns tests/requires new exact-tree GO after any post-preview drift.

Verify no guard or docs were actually implemented; existing source candidate `d7149d24c81526f66e337927c06b65060f657d3d`, main `7583d87dd0b4214d69e3fc11b67be1d5c1da8407`, staging `3f2b0369169278f6606804dee17749944aee0e32` unchanged. Active live PDF_MANIFEST and Cloudflare target remain **UNVERIFIED**, not PASS.

Return gate-specific **PASS / PASS WITH REQUIRED CORRECTIONS / NOT READY**, BLOCKER/REQUIRED/OPTIONAL, and shortest exact file/section corrections. **Review only; no edits, seals, implementation, GitHub staging/main push, Cloudflare upload, PDF/manifest/Zenodo changes.**

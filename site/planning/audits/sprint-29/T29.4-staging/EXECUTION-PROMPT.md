# T29.4 staging execution prompt (copy-ready; usable only after the seal and the owner's exact-tuple GO)

Status: DRAFT. **Not authorized.** Do not paste this to an Executor until (1) the [T29.4 staging ticket](../../../tickets/T29.4-paper-c-staging-preview.md) is sealed by the owner, (2) the owner has issued the exact-tuple GO described in the ticket, and (3) the placeholders in angle brackets are filled. The prompt carries no authority beyond the sealed ticket; if the two differ, the ticket governs and the Executor stops.

```text
Executor — T29.4 Paper C staging preview. Begin with the MBP mini-map header.

Authority: the SEALED ticket site/planning/tickets/T29.4-paper-c-staging-preview.md at planning commit <SEAL_COMMIT> on origin/planner/context, and the owner's GO of <GO_DATE> naming this tuple. Read both before acting; read the kit README site/planning/audits/sprint-29/T29.4-staging/README.md. If anything below disagrees with the sealed ticket, stop and report.

Tuple (stop on any mismatch; recompute, never copy-trust):
- Project cybernetics-mbp-site; branch label staging; alias https://staging.cybernetics-mbp-site.pages.dev; production amulbham.com untouched.
- Correction commit 63372f2b73d4d5287e92d283a4e71ee766a95e75, tree 740d13d8bedebe8c4a5f9ec81a11dc9af7c0c837 (local branch work/t29-3a-audit-corrections; never pushed).
- Candidate PDF fe6eaf21c0c0feadd61429a9d6ebb90ea1d3c623a8b363bc02b96e53b8039446 (592,164 bytes); manifest f004b0e3ce0707546ca91afa3e68d6324ff80ac434e89476e305d8959b79f875; route HTML 3b9e316989f3649f51ed2cf3b7cae0e9735733dec11820ab19ba1ccc152bb743.
- Upload tree: 187 files, 8,308,883 bytes, directory digest 0cf5cc898798ccabac066018446c76a876cebe483834f32a74344188373ff834.
- Kit SHA256SUMS digest 6137ef420bfb1c6a23366e90b35bfa49b9a8d09fe7c775e0b628adb053f3111e; Node 22.2 or later.
- Pre-upload state file T29.4-staging-pre-upload-state.tsv SHA-256 832dc1c4af32a15a66bfbe6b8db3675aad63deda1167afef23e8409985643735 (part of the GO).
- Owner has accepted exceptions E1, E2, E3, E5, E6 (kit README) and decision D-PUB (the preview is public).

You may: run the kit tests; extract the prepared zip and verify the folder (never rebuild or regenerate the tree); read public URLs; run verify-staging.mjs and capture-staging.mjs; write reports and captures in your scratch area; report. You may NOT: hold or ask for Cloudflare credentials; run `wrangler` yourself; upload, deploy, delete or roll back anything; change Pages, DNS, Access, GitHub variables or workflows; push or merge any Git ref (staging and main included); push private source, the review set or the zip to any remote; regenerate or re-render any PDF; touch production, Zenodo or indexing.

Phase 0 (before the owner uploads):
1. Verify the kit: `node test-staging.mjs` (40 cases pass; the kit digest printed equals the tuple). Compare the kit digest printed by EVERY CLI run in every phase with the tuple; stop on any difference. Never pass `--pins` or `--inventory`. `SHA256SUMS` covers the scripts, tests, pins, inventory, redirects and pre-upload-state files, but also recompute and compare these three file hashes yourself: inventory TSV b9857d960f7f823419839d24a7dca81b215712bbba0f50fc6c3abaf1c7996265, redirects 9dce4d8cac66946fbb2c0eb8b824137767211940a111b75098b80989bf33dba6, pre-upload state 832dc1c4af32a15a66bfbe6b8db3675aad63deda1167afef23e8409985643735.
2. Verify the folder you deliver: `node verify-upload-dir.mjs <folder>` PASS, digest equals the tuple; do NOT rebuild or regenerate the tree: the prepared zip is the authoritative upload source.
3. Read-only preflight: `node verify-staging.mjs --production-only` and `node verify-staging.mjs --rollback-check` must pass (alias still equals the recorded pre-upload state; production unchanged). If the alias changed since the GO, stop; the GO is void.
4. Deliver to the owner: the zip, its SHA-256 (a zip is not byte-deterministic; the directory digest is the pin), the kit as a zip, and the exact upload command from the ticket. Stop and wait.

Phase 2 (after the owner returns Wrangler's output and the deployment URL https://<8hex>.cybernetics-mbp-site.pages.dev):
5. `node verify-staging.mjs --origin <deployment URL> --production --out staging-verification-report.json` (set NODE_USE_ENV_PROXY=1 if your sandbox needs it). Any failure: stop, report, do not retry silently.
6. `NODE_PATH=$(npm root -g) node capture-staging.mjs --origin <deployment URL> --report staging-verification-report.json --out captures`.
7. Re-run `verify-staging.mjs --production-only` to prove production is unchanged.

Return (use the completion-report template, R3, at most 100 lines): result; the tuple you actually observed; the owner-supplied Wrangler output and URL labeled as owner-supplied; the verification report with its SHA-256; the capture index and a representative desktop and mobile image set delivered to the owner; the HTML-rewrite observation; exceptions E1–E6 dispositions; production and Git re-verification; the rollback procedure's readiness; UNVERIFIED items. Keep observed and reported facts separate. Never self-accept: the owner's visual decision and the Planner's review decide acceptance.

Stop and report (do not continue) on: any pin, digest or kit-digest mismatch; Node older than 22.2; the alias or production differing from the recorded state before upload; Wrangler output naming Functions, `_worker.js` or a branch label other than staging; a PDF or article hash mismatch; a rewrite of the article page; a failed redirect, header or robots assertion; production, Git refs or the six live PDFs changing; any request to widen scope.
```

## Owner action list (after the seal)
1. Review the ticket, issue the exact-tuple GO (the tuple is in the ticket's GO gate) naming exceptions E1, E2, E3, E5 and E6.
2. Receive the zip and kit from the Executor (Phase 0) and run `node verify-upload-dir.mjs <folder>`; compare the digests by eye.
3. Run the single upload command from an empty folder; send back Wrangler's complete output and the deployment-specific URL.
4. Review the desktop and mobile captures and the live deployment URL; send acceptance or required changes.
5. If rolling back is wanted, follow the README's rollback section (the GitHub Actions run, then `--rollback-check`).

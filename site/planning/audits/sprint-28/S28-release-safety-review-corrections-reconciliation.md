# S28 — Release-safety reviewer corrections reconciliation

**2026-11-03 (Pacific) · Pre-review pin `9b49bb3d8f0431d1cab01ed6b3e4c038be1e96b9`** · Independent verdict **NOT READY: 1 BLOCKER, 3 REQUIRED, 0 OPTIONAL**.  
**Planner:** all addressed in *prospective contracts only*, **not implemented nor sealed**; no deployment or PDF custody action.

| Finding | Resolution | Next independent check |
| --- | --- | --- |
| R1 — Docs mode / false active guard claim | T28.6a classified **DECISION/R0**, explicit independent six-PDF production upload guard **PENDING T28.8a** until tested and released. Historical five-PDF descriptions stay historical. | Verify only three canonical docs would change, with no claims guard exists now |
| R2 — Preview artifact/time-of-check | T28.7 classified **RELEASE/R3**. Preview GO binds **exact SHA, digest of every `dist/` file, Cloudflare account/project/nonproduction branch, six PDF hashes, live manifest proof**. **After GO immediately before Wrangler**, freshly read actual active manifest, reconfirm target and digest, and rehash all six; STOP/new GO on drift. | Verify no postcheck mutation and Wrangler SHA is metadata only |
| B1 — Actual workflow guard absent | New **T28.8a** owns separately pinned six-row baseline fixture, independent guard, tests and mandatory same-job **post-carry/pre-Wrangler** workflow step that reads **effective Actions `PDF_MANIFEST`** and hashes deployable `dist` PDFs. Covers `main` push and `workflow_dispatch` on `main`, with no PDF_RELEASE or conditional bypass. | Verify workflow wiring and fail-closed synthetic adversarial tests, no unguarded bootstrap |
| R3 — Guard excluded from main diff | T28.8 now explicitly adds **guard files + workflow** to production allowlist and selects order **docs → guard on isolated candidate → independent exact-tree review → preview → production**. Changes after preview require fresh review/tests/exact-tree Owner GO. | Verify same guard-inclusive tree is deployed; no staging/Chisel import |

**Ground truth:** site main `7583d87`, staging `3f2b036`, source candidate `d7149d24` unchanged. Six frozen PDFs including Paper A remain immutable. Active variable and Cloudflare config were not read; neither preview nor main is authorized. This corrections package is **ready for focused independent pre-seal review**, not a clearance to implement or deploy.

# T23.0 — rev 2 disposition and staging authorization

Date: 2026-10-18, America/Los_Angeles. Approved working checkpoint; not deployment evidence.

## Verified baseline

- Fresh Git fetch completed before this checkpoint. Main remains `5bf8518f7cbba16a7a8a950b2abac2a42c3502a6`; staging remains `b26267cfa619dd0ccbd63e4b39a7512b0d13521e`; preceding Planner context is `f4b460ba45c7b234c22a942befadad0d5998433f`.
- The Planner read the two supplied rev 1 drafts and compared the release proposal with main's carry-over script, workflow, publication docs and H2-only contents implementation.
- Supplied canonical manuscript/IWL identities and content decisions remain in `2026-10-18-chisel-revision-decisions.md`; no broad content audit is reopened.
- T22.0 S6 is accepted with recorded evidence limits; selective final-report/evidence promotion remains queued for the next authorized substantive release.

## Rev 1 findings and reported rev 2 resolution

- BLOCKER: an old manifest could deploy old PDF bytes with new HTML. Reported fix: committed `site/release-pdfs/expected.txt`, containing the Chisel path and approved hash, checked against PDF_MANIFEST before build/deploy in guard and again in carry. Empty/missing/mismatched manifest fails.
- REQUIRED: initial transition requires one swap, but successful reruns require zero; recovery permissions must distinguish pre-deploy failure from already deployed state. Reported fixed.
- REQUIRED: preserve H2-only contents navigation while adding semantic H3/H4; permit evidence-justified responsive-records markers in IWL normalization. Reported fixed.
- REQUIRED: name the no-abstract description convention, IWL dateModified docs and now-false workflow comments. Reported fixed with documentation/comment-only edits; no executable workflow change.
- Executor additionally corrected the IWL table inventory from two to fifteen. Rendering acceptance covers the actual inventory.

## Evidence limits

- Reported rev 2 ticket SHA-256: `ecd1e316b0519f0fe06854a7ecd8fd041eed4d37f3ca35b9c5062b0d8b05274d`.
- Reported rev 2 sprint SHA-256: `23ff78a0ff5f5b8ed392aa6c91081dde35b653fbfb5717eef61bed832a77299c`.
- The available scratch attachments still hash to rev 1; the Claude-hosted links were inaccessible. The Planner assessed the revision report, not the exact rev 2 bytes.
- Authorization is conditional on Executor confirmation of those exact pre-authorization hashes and a diff limited to the reported corrections. Recording authorization/waiver then naturally changes the document hashes.
- No implementation SHA, sealed contract, test result, staging deploy or new PDF has yet been independently inspected. Owner reports the work is running.

## Approved boundaries and decisions

- Product Authority gave discretion to omit the outside review round if unnecessary; Planner recommended a **T23.0-only waiver** and issued a handoff requiring the Executor to record it explicitly.
- Keep risk R3 and its local, adversarial, staging and later production verification. Never describe two outside reviews as completed. This waiver does not change PLANNING.md or apply to later tickets.
- Approved next execution: confirm rev 2 identity/delta, add authorization record, seal, implement the contract, run checks and deploy to staging. No further broad pre-seal review cycle required for the already addressed findings.
- Revision date fixed at 2026-10-18, with original publication date retained.
- Git custody for the new and retiring PDF blobs is accepted. Binding expectation/manifest/blob agreement is required; preserve the other four approved PDFs byte for byte.
- Recovery/rerun authorization follows the narrowed contract. Anything after deployment, any rollback or any different production SHA needs separate Product Authority authorization.
- Production promotion, repository variable changes, Zenodo actions, executable workflow changes and About work are not authorized by the staging handoff.
- Website-first publication remains approved: freeze staging-built PDF, approve/promote exact bytes, owner downloads production file and uploads it to the reserved Zenodo record, then verify deposit parity and DOI resolution.

## Next evidence and gate

1. Executor returns seal and implementation commits, successful staging workflow, deployed article/IWL URLs and focused acceptance results.
2. Return the exact staging PDF with SHA-256, size and page count for owner/Planner inspection; a later regenerated PDF is not a substitute.
3. Include old-manifest/v9-candidate rejection before deployment and zero-swap matching-rerun evidence, plus preservation checks and all deviations/unverified layers.
4. Owner/Planner review staging, then separately approve the exact main-based production candidate and manifest transition. No automatic production go follows staging success.
5. Owner-operated Zenodo publication/parity gate follows website promotion. About follows Chisel. Prose-compiler feedback remains an earned follow-up, not another tooling project.

## Checkpoint procedure

- Chat checkpoint: concise current objective, verified evidence, approvals, uncertainty and next gate; useful immediately but not a durable source of repository truth.
- Approved decision clusters, consequential reviews and meaningful handoffs: update `planner/STATE.md` and add a dated checkpoint on non-deploying `planner/context`. Avoid one checkpoint per command or minor exchange.
- STATE is mutable; checkpoints preserve dated provenance. Do not silently rewrite an old decision; record supersession in a later checkpoint.
- Code, current canonical docs and sealed tickets retain their respective authority. Only verified/accepted conclusions are selectively promoted into canonical paths during approved work.
- Never merge all of planner/context or staging into main. Never deploy solely to update Planner status.
- Fresh Planner chat: read main HANDOFF.md, planner README/STATE and latest relevant checkpoint, then recheck live refs and relevant release evidence before claiming current status.

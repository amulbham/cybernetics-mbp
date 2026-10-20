# Planner state — research website

Snapshot: 2026-10-20, America/Los_Angeles. Read current main separately from this notes branch.
State: Chisel v9 / IWL v4 deployed; production workflow/PDF preservation verified; G5 matrix Executor-reported. Sprint 24 homepage/About copy is the current primary intent; reviewed drafts are prepared and await execution authorization.

## Authority and current direction

- Product Authority: Amul. Planner/reviewer: this chat. Executor: Claude Code. Executor does not orchestrate reviewers.
- APPROVED: approved working context on non-deploying planner/context; promote selected verified/accepted conclusions to canonical docs through authorized work. Never wholesale merge staging or planner/context into main.
- APPROVED, 2026-10-18: owner handles Chisel's Zenodo upload, deposited-file checks and DOI publication/resolution. Do not perform a second deposited-PDF download/hash check or wait on an assistant-operated Zenodo gate.
- Owner-managed is not independently verified. Record any later owner confirmation as owner-reported; do not claim deposited parity or DOI resolution today.
- APPROVED wrap-up direction, 2026-10-18: organize a small publishing-workflow sprint using the existing sprint/ticket formats. Scope targeted repo checks and optimizations needed for two flows: update an existing article and publish a new article. Reuse this session’s audit; avoid a broad repository-optimization program. Exact changes still require normal prospective authorization.
- Content follow-up: About page and homepage copy are a separate bounded batch, potentially next session as the owner prefers. Keep shared author bio/byline changes explicitly separate until their printed-PDF implications are decided; do not make web-only copy depend on regenerating PDFs.
- Current request: incorporate user-supplied review and produce the bounded Sprint 24 / T24.0 packet. PRIMARY copy is approved; two non-blocking review clarifications are incorporated. Reviewed contracts are saved unsealed on planner/context; no runtime execution, seal or deploy is authorized by this notes commit.

## Verified repository and release state

- main `1878c269ef837ce5abe203d742cdc85e3e14ebc0`; staging `dd475ef5b0580bde875cc47e0ec6be94e52b4319`; Planner parent `c4730db12e18e83fbf4cec172ecb5f33d3018fb8`. Remote heads rechecked via GitHub 2026-10-20; release evidence was inspected 2026-10-18. No open PRs at this check.
- VERIFIED: run #122 / `39175614360`, attempt 2, job `117818404757`, successful on main's exact SHA. Guard/build/PDF generation/carry/validation/deploy/post-deploy verify all passed.
- VERIFIED step logs: exactly one frozen-artifact swap; all five live PDF hashes match the manifest after deploy, attempt 1. Cloudflare logged deployment URL `https://d6d89fa0.cybernetics-mbp-site.pages.dev` (not a separately queried dashboard deployment id).
- Attempt 1 failed at guard with stale manifest expectation, before build/deploy. Planner triggered the authorized same-SHA retry through GitHub after the owner requested it; no new code push was needed.
- VERIFIED source: manuscript v9, IWL v4, pubDate 2026-09-22, dateModified 2026-10-18, reserved DOI `10.5281/zenodo.23458660`; stable routes; CC BY-NC 4.0; two article and thirteen IWL responsive-records opt-ins; schema has optional outer IWL dateModified.
- Approved production Chisel PDF: SHA-256 `1f68d9eec9a0d8412a7fefc4d2c42b17f340801fbbef438b671edbffaf4582f3`, 289,922 bytes, 23 pages. Size/pages and visual inspection are Executor-reported; CI independently confirmed live hash agreement. Four other PDFs retained approved hashes.
- EXECUTOR-REPORTED G5: 26 checks pass; 23 redirects, 13 indexable canonical sitemap URLs, 40 tag pages, 6 RSS items, metadata, responsive layout and host/indexing protections. Planner did not repeat the full live-host matrix.
- Follow-up: two removed tag URLs still serve cached noindex 200s without cache busting; cache-busted requests return 404 (Executor report). Do not claim bare-URL E2 is satisfied. Cache expiry/purge and recheck are separate; no purge was authorized or performed here.
- Zenodo/DOI are owner-managed and not independently verified. Screen-reader/forced-colors behavior and Google/Scholar outcomes remain unverified.
- T22.0 S6 was accepted and its two closure documents were selectively promoted in main's T23 candidate. PR #1 remains closed without merge, superseded.

## Closure and evidence handling

- Runtime website work is delivered; remaining tag-cache, documentary and owner-operated deposit items are explicit follow-ups, not authorization for another deployment. No unconditional claim that every T23 criterion is satisfied.
- Executor reports final G5 evidence at local-only staging commit `36ed554`; source/log not available on GitHub yet. Earlier local evidence commits include dc4b55f. Do not invent their contents or push staging merely to publish them.
- On the next appropriate authorized release: selectively import the actual final evidence; append factual completion/report records under the repository's caps; update active current-state docs; append a new CHANGELOG release entry. Preserve seals and earlier history.
- Normal R3 requirements remain. T22 and T23 had separately recorded one-ticket waivers; T23.0.1 was a bounded corrective R1. No blanket review waiver or new planning protocol was adopted.

## Current next gate — Sprint 24 reviewed packet

1. Read site/planning/sprints/sprint-24-homepage-about-copy.md and site/planning/tickets/T24.0-homepage-about-copy.md from planner/context; current main remains the executable baseline. Both documents are DRAFT/unsealed.
2. Copy/scope are settled: exact three PRIMARY blocks, two page files; localize visible homepage blurb and preserve metadata, shared identity, remaining About sections and PDFs. Reviewer's SEAL-READY condition is satisfied by the existing copy approval.
3. Await explicit Executor seal/implementation/staging authorization. Then use one staging review and separate exact-SHA production go; no wholesale branch merges.
4. Publishing-flow audit and mini-sprint remain deferred; reuse the saved findings when resumed, including five-PDF/new-path/Desk limitations.
5. Shared author bio/byline remains outside this copy packet. Its printed-PDF implications require a separate decision.

## Pointers

- planner/checkpoints/2026-10-20-homepage-about-copy-review.md: approved scope, review disposition, packet paths and next gate.

- `planner/checkpoints/2026-10-18-chisel-shipped-process-handoff.md`: session chronology, approvals, two-hour lesson, next intent.
- `planner/audits/2026-10-18-publishing-flow-doc-sweep.md`: exact current-source findings, process proposals and proposed documentation targets.
- `planner/checkpoints/2026-10-18-chisel-revision-decisions.md`: source hashes and approved normalization decisions.
- main `site/planning/tickets/T23.0-chisel-canonical-revision.md`, `T23.0.1-chisel-responsive-records-opt-in.md`; current main has staging/candidate evidence only, final G5 supplement remains local to Executor.
- Run #122: https://github.com/amulbham/cybernetics-mbp/actions/runs/39175614360 .

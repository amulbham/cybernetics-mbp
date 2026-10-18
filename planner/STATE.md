# Planner state — research website

Snapshot updated: 2026-10-18.
State: T22.0 S6 ACCEPTED WITH RECORDED FOLLOW-UPS; launch closure recorded. Chisel decisions approved; R3 draft next.
Primary intent: draft a bounded Chisel v9 / IWL v4 revision contract, including safe selective PDF replacement and the website-first Zenodo handoff.

## Authority and decisions

- **APPROVED:** repo-backed Planner workspace; approved working notes on non-deploying `planner/context`; promote only verified/accepted conclusions into canonical paths through scoped release work.
- **RELEASE EXECUTED:** Product Authority's conditional S6 go was given to Claude Code; the Executor promoted `5bf8518` and returned the After-S6 report. Product Authority requested moving to the next work after that report.
- **PLANNER ACCEPTANCE, 2026-10-18:** S6 accepted with the recorded verification limitations. No further production deployment is required solely to stamp CLOSED. Final R3 report is appended to the canonical ticket path on this branch; its later promotion to main belongs with an authorized release.
- **APPROVED sequencing:** Chisel canonical article plus IWL update and an evidence-earned reusable revision flow, then About simplification.
- **Historical exception:** T22.0 alone had two outside R3 pre-seal reviews waived. Preserve that record; it does not authorize later exceptions.
- Approved Chisel decisions are recorded in the checkpoint below. No seal, manuscript/IWL implementation, DOI publication, variable/workflow change or production deployment is authorized yet.

## Verified state and evidence limits

- `main = 5bf8518f7cbba16a7a8a950b2abac2a42c3502a6`; `staging = b26267cfa619dd0ccbd63e4b39a7512b0d13521e`; Planner note base `f5e74c18cdfe58707e825056da3c1300673aaaaf`. Rechecked 2026-10-18; these are base snapshots, not this note's own commit SHA.
- **VERIFIED:** main's tree `622e58be04b1ea1fc073e315c53d02810f95c1e7` exactly equals reviewed candidate `abb26e3`; main advanced from `384f034` with the exact 17-file docs-only diff.
- **VERIFIED (GitHub):** production #119 / `39165606863` succeeded on `5bf8518`; all 14 job steps successful, including guard, carry-over, PDF validation, deploy and post-deploy PDF verify.
- **EXECUTOR-REPORTED:** full direct After-S6 matrix passed: 23 redirects; five approved PDF hashes; Desk/Zenodo parity; six entries/IWL/OG/RSS/homepage; open intended production indexing, 13 sitemap URLs, exclusions and preview-host protections. The Planner did not independently repeat those live requests.
- Cloudflare deployment ID and private `PDF_RELEASE` unset state were not read. SHA-linked workflow, changed About build stamp and the live matrix support deployment correspondence. Carry-over ran and all hashes were preserved; do not claim private settings were independently inspected. Confirm normal `PDF_RELEASE` state in the next authorized release preflight.
- **S5:** owner-confirmed Search Console setup complete; Google processing/crawling and Scholar inclusion remain UNVERIFIED external outcomes.
- **PR #1:** closed without merge as superseded by the combined S6 release; branch and history retained. No second production push was made.

## Chisel decisions and next action

1. **VERIFIED:** supplied manuscript v9 and IWL v4 were inspected and hashed against the supplied files; current published sources are manuscript v6 / IWL v2. Exact source identities and normalization findings are in the new checkpoint.
2. **APPROVED:** reserved DOI, no visible abstract, metadata description from the supplied excerpt, original publication dates retained, meaningful revisions recorded with dateModified, stable routes/IDs, new five-tag set, and CC BY-NC 4.0 for the IWL.
3. **APPROVED:** bounded heading/reference/callout corrections; opaque IWL body with normal outer frontmatter and optional outer dateModified. Preserve canonical prose apart from the specifically approved corrections.
4. **APPROVED flow:** website compiles the canonical PDF; freeze approved bytes, publish those bytes on the website, then the owner uploads the downloaded production PDF to Zenodo. DOI resolution and deposited-file parity are final gates, not prerequisites to website publication.
5. **PROPOSED implementation, not sealed:** minimal selective PDF-release mechanism to use the frozen website-built Chisel artifact while preserving the other four PDFs and all-five manifest validation. Current carry-over would overwrite a newly built Chisel PDF. Exact artifact custody and manifest transition need a concrete contract proposal.
6. Next: Claude drafts minimal Sprint 23 / T23.0 R3 contract and returns it for the usual two independent outside pre-seal reviews coordinated by the owner. Confirm numbering against fresh refs. No implementation or deploy yet. About follows Chisel.
7. Selectively promote the accepted S6 final report/addendum with the next appropriate approved release; do not deploy solely to flip status. Prose-compiler feedback follows this decision handoff; no new compiler skill or tooling project is authorized.

## Pointers

- `planner/checkpoints/2026-10-18-chisel-revision-decisions.md`: approved inputs, scope and release-flow decisions; next contract draft.

- `planner/checkpoints/2026-10-18-s6-accepted-chisel-intake.md`: closure review, evidence provenance and queued canonical promotion.
- `site/planning/tickets/T22.0-public-mvp-launch.md` on this branch: preserved original contract plus accepted R3 completion report.
- `site/planning/audits/T22.0-public-mvp-launch-evidence.md` on main: earlier preparation evidence and exact release matrix pointer.
- [Run #119](https://github.com/amulbham/cybernetics-mbp/actions/runs/39165606863); [closed PR #1](https://github.com/amulbham/cybernetics-mbp/pull/1).

# Planner state — research website

Snapshot updated: 2026-10-18.
State: T22.0 S6 ACCEPTED WITH RECORDED FOLLOW-UPS; launch closure recorded. Chisel intake next.
Primary intent: compare the latest canonical Chisel manuscript and companion IWL with their published sources, then bound the revision/publication flow.

## Authority and decisions

- **APPROVED:** repo-backed Planner workspace; approved working notes on non-deploying `planner/context`; promote only verified/accepted conclusions into canonical paths through scoped release work.
- **RELEASE EXECUTED:** Product Authority's conditional S6 go was given to Claude Code; the Executor promoted `5bf8518` and returned the After-S6 report. Product Authority requested moving to the next work after that report.
- **PLANNER ACCEPTANCE, 2026-10-18:** S6 accepted with the recorded verification limitations. No further production deployment is required solely to stamp CLOSED. Final R3 report is appended to the canonical ticket path on this branch; its later promotion to main belongs with an authorized release.
- **APPROVED sequencing:** Chisel canonical article plus IWL update and an evidence-earned reusable revision flow, then About simplification.
- **Historical exception:** T22.0 alone had two outside R3 pre-seal reviews waived. Preserve that record; it does not authorize later exceptions.
- No new manuscript/IWL implementation, DOI publication, variable/workflow change or production deployment is authorized by this intake.

## Verified state and evidence limits

- `main = 5bf8518f7cbba16a7a8a950b2abac2a42c3502a6`; `staging = b26267cfa619dd0ccbd63e4b39a7512b0d13521e`; Planner note base `72d8828d6c597bafeff3a049057c4683456c1da9`. Rechecked 2026-10-18; these are base snapshots, not this note's own commit SHA.
- **VERIFIED:** main's tree `622e58be04b1ea1fc073e315c53d02810f95c1e7` exactly equals reviewed candidate `abb26e3`; main advanced from `384f034` with the exact 17-file docs-only diff.
- **VERIFIED (GitHub):** production #119 / `39165606863` succeeded on `5bf8518`; all 14 job steps successful, including guard, carry-over, PDF validation, deploy and post-deploy PDF verify.
- **EXECUTOR-REPORTED:** full direct After-S6 matrix passed: 23 redirects; five approved PDF hashes; Desk/Zenodo parity; six entries/IWL/OG/RSS/homepage; open intended production indexing, 13 sitemap URLs, exclusions and preview-host protections. The Planner did not independently repeat those live requests.
- Cloudflare deployment ID and private `PDF_RELEASE` unset state were not read. SHA-linked workflow, changed About build stamp and the live matrix support deployment correspondence. Carry-over ran and all hashes were preserved; do not claim private settings were independently inspected. Confirm normal `PDF_RELEASE` state in the next authorized release preflight.
- **S5:** owner-confirmed Search Console setup complete; Google processing/crawling and Scholar inclusion remain UNVERIFIED external outcomes.
- **PR #1:** closed without merge as superseded by the combined S6 release; branch and history retained. No second production push was made.

## Chisel intake and next action

1. Obtain the Product Authority's exact canonical manuscript MD and companion IWL MD. No latest-version source has been inspected yet; do not substitute a guessed Library version.
2. Published source baseline: Chisel is a Knowledge Work paper dated 2026-09-22, no DOI authored in current frontmatter; its IWL is published v2 and identifies manuscript v6. The current PDF is protected by the launch manifest. External deposit/version status is not inferred from absent DOI frontmatter.
3. Compare content, title/identity, citations, frontmatter, original/modified dates, reader components, companion linkage and version history. Determine PDF/DOI/version implications and preservation of the other four approved PDFs before implementation.
4. Derive the reusable revision checklist from this real delta; preserve OPAQUE V1 and avoid an automatic versioning system or pre-created downstream tickets. About follows Chisel.
5. Promote the accepted S6 final report/addendum into main with the next appropriate approved docs/product release; do not deploy solely to flip state. Further release work still needs its normal seal and authorization.

## Pointers

- `planner/checkpoints/2026-10-18-s6-accepted-chisel-intake.md`: closure review, evidence provenance and queued canonical promotion.
- `site/planning/tickets/T22.0-public-mvp-launch.md` on this branch: preserved original contract plus accepted R3 completion report.
- `site/planning/audits/T22.0-public-mvp-launch-evidence.md` on main: earlier preparation evidence and exact release matrix pointer.
- [Run #119](https://github.com/amulbham/cybernetics-mbp/actions/runs/39165606863); [closed PR #1](https://github.com/amulbham/cybernetics-mbp/pull/1).

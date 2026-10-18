# Planner state — research website

Snapshot updated: 2026-10-18.
State: ACTIVE — T22.0 S6 documentation candidate prepared; release not authorized/executed.
Primary intent: finish S6 administrative/evidence closure, then address the Chisel manuscript/IWL revision.

## Decision and authority state

- **APPROVED:** repo-backed Planner Workspace v1; routine approved checkpoints belong on non-deploying `planner/context`; canonical documents receive only selected verified/accepted conclusions.
- **APPROVED, 2026-10-18:** Product Authority approved preparation of one combined S6 documentation candidate after the Planner boot/status review. Production push/deployment remains a separate approval gate.
- **APPROVED sequencing:** after S6, update Chisel's article and companion IWL from the Product Authority's latest canonical versions, using that case to establish a reusable article-revision flow. About simplification follows Chisel.
- **APPROVED historical exception:** two outside R3 pre-seal reviews waived for T22.0 only. Technical release gates were not waived; do not generalize the exception.
- **NOT AUTHORIZED by this preparation:** production push/deploy, Actions-variable change, Chisel manuscript/IWL implementation, new DOI publication or overwriting published PDF bytes.

## Confirmed repository state at the preparation base

- `main = 384f0349fb313733c4feb27e17a8e5caf3580696`; `staging = b26267cfa619dd0ccbd63e4b39a7512b0d13521e`; `planner/context` and draft PR #1's source branch were both `72a2f8f902f6c0701588a2abad664a1f5964fb86`. Remote heads rechecked 2026-10-18; these are base snapshots, not a claim that this note's own future commit has that SHA.
- **VERIFIED (GitHub):** latest production run #118 / `38982151022` on `384f034` succeeded, including guard, carry-over, validation, upload and post-deploy PDF verification. Production source contains 5 papers + 1 essay.
- **REPORTED, not freshly reproduced:** S4 open-indexing matrix, 13 intended sitemap URLs, 23 redirects, and Desk/Zenodo byte parity. Production robots/sitemap requests from the Planner environment returned unusable "Site Unavailable" HTML; no live outage or fresh deployed-matrix result is inferred.
- **S5:** owner-confirmed Search Console setup complete on 2026-10-16. Private dashboard, actual Google crawling/indexing and Scholar inclusion remain UNVERIFIED.
- **S6:** local combined candidate `abb26e3ec04dc4f98b475dbc2d105a5aa5e4ffd3` prepared on `planner/t22-s6-closure` against `main @ 384f034`; PR #1 is still open/draft at the same source head; its stale description was corrected through GitHub. Selected staging ticket/evidence records are included, with historical text preserved and later release addenda. No candidate production push/deployment has occurred.

## Next action and release boundary

1. Review the S6 candidate: PR #1 content, selected T20/T21/T22 records, narrow AGENTS/PUBLISHING/ROADMAP/CHANGELOG reconciliation and `site/planning/audits/T22.0-public-mvp-launch-evidence.md`. Do not wholesale merge staging or Planner history.
2. Give Claude Code the reviewed candidate. PR #1's body now correctly records S5 and the three-commit/eight-file initial draft; update it again to the final scope when updating/superseding that draft. Obtain explicit production release approval before pushing main.
3. Preserve `SITE_INDEXING=open`, `PDF_CARRY_OVER=true`, the approved exact five-entry `PDF_MANIFEST`, and normally unset `PDF_RELEASE`. Check current settings without changing them. On authorized deployment, verify the full ticket's After S6 matrix and all five PDF hashes. Only then accept/mark S6 CLOSED and append the final R3 report (maximum 100 lines).
4. **Chisel next:** identify exact latest canonical manuscript/IWL sources, compare with published sources, and decide article/PDF/DOI/version and paired-IWL release implications. The canonical versions and reusable workflow are not yet established; no implementation ticket is pre-created.
5. About simplification follows Chisel. Treat Search Console/Scholar discovery monitoring, the historical Invariants DOI mismatch, date-format and AT follow-ups separately.

## Pointers

- `planner/checkpoints/2026-10-18-s6-preparation-and-chisel-next.md`: current approval, provenance, candidate and handoff limits.
- `planner/checkpoints/2026-10-18-public-launch-continuity.md`: earlier launch context; preserve unchanged.
- `HANDOFF.md`, `planner/README.md`, canonical `site/PLANNING.md` and `site/AGENTS.md` retain their separate authority.
- GitHub: [PR #1](https://github.com/amulbham/cybernetics-mbp/pull/1), [production #118](https://github.com/amulbham/cybernetics-mbp/actions/runs/38982151022).

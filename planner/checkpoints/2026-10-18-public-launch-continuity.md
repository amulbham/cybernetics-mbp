# Checkpoint — public MVP launch and Planner continuity

**Date:** 2026-10-18  
**Topic:** T22.0 launch outcomes, document drift, transition to fresh-chat planning.  
**Type:** selected working-context snapshot; not a sealed ticket, external review, or product spec.

## Why this checkpoint exists
A long series of Planner/Executor conversations contained important reasons behind the Astro website release, but each new chat risked losing the approved state and technical constraints. The Product Authority approved a lightweight, version-controlled Planner workspace so new chats can start fast. Full transcripts are not required.

## Release milestones worth retaining
1. **VERIFIED (GitHub):** production `main` at `384f0349`, successful deployment run #118 (2026-10-16); `staging` at `b26267c` when checked 2026-10-18. Source release tickets/evidence are split across branches pending closure.
2. **UNVERIFIED here, Executor-reported deployed checks:** six research entries (five scholarly papers + one essay), Desk homepage spotlight, five-item feed, 23 redirects, one Chisel IWL; production indexing open with 13-url sitemap. Preview hosts and tag/empty/search pages remain noindex.
3. **APPROVED / deployed workflow:** keep `SITE_INDEXING=open` only for authorized production builds; `PDF_CARRY_OVER=true` and approved five-line `PDF_MANIFEST` preserve exact scholarly PDF bytes across redeploys. Manifest mismatch stops deploy. `PDF_RELEASE=new-version` is a special authorized PDF-version path, not permission to overwrite an existing published deposit.
4. **UNVERIFIED here, reported cross-source byte test:** the Zenodo Desk deposit `10.5281/zenodo.23328158` and live Desk PDF both have SHA-256 `268d16c0f29d6ba4c0e8299ff30a816fe44d62591206e434ae277d080b40cfd9`. The first production typesetting differed in bytes, so a pinned Zenodo bootstrap was used; the other four production PDF bytes remained stable.
5. **APPROVED / historical exception:** two outside R3 pre-seal reviews were explicitly waived for T22.0 only. Do not claim reviewers independently approved the release. Local/source validation and release gates still applied.
6. **APPROVED by Product Authority:** Google Search Console setup was completed on 2026-10-16. Submission is not evidence that pages are already indexed or Google Scholar has included them.
7. **PENDING:** S6 formal docs/evidence closure, followed by About simplification and later editorial work. No need to re-open S4 once reported verified unless newer contradictory evidence appears.

## Planner Workspace v1 decision (2026-10-18)
- **APPROVED:** root `HANDOFF.md` is the durable entry point; `planner/STATE.md` tracks current short working state; `planner/checkpoints/` archives dated reasoning and decisions; `planner/README.md` governs their use.
- **APPROVED:** use independent non-deploying `planner/context` branch for frequent notes. Curate/verify/promote only accepted facts to canonical `site/` documents and source via explicit git changes. The production branch is not a scratchpad.
- **APPROVED:** next active development session will be a fresh Planner chat. The old chat remains consulting context; the repo becomes the transfer mechanism.
- **Rejected as disproportionate:** automatic transcript dumping, a new memory database, a second code/architecture canon, a checkpoint per chat turn, or extra production deployments just to save notes.

## Unresolved / instructions for next session
- Root handoff/README/roadmap draft PR #1 and T22.0 S6 are not yet merged/closed at this checkpoint. Do not mistake prepared documentation for deployed closure.
- The original T22.0 ticket lives on staging and still contains dated historical gate language; closure must **append** accurate subsequent evidence rather than rewrite older authorization as though it always existed.
- Published Zenodo historical Invariants PDF reportedly differs from the latest live PDF; inspect publication/version semantics when it matters. Do not silently expand S6 around this.
- Validate current branch heads and deployment state independently. The user's Search Console dashboard is not connected here.
- Begin new-chat development with the boot instruction in `planner/README.md`. Keep planning checkpoints compact and owner-approved.

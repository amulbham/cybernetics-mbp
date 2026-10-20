# Sprint 24 — Homepage and About copy refresh

Status: EXECUTING — contract sealed 2026-10-20 with T24.0; authorized through T24.0 staging acceptance
Risk ceiling: R1
Branch: staging; product-only production candidate from current main
Depends on: production main 1878c269ef837ce5abe203d742cdc85e3e14ebc0
Unlocks: approved public-facing copy; publishing-workflow improvements remain separate

## Core question
Can the three approved copy blocks be published through a small, repeatable two-page change without affecting publication artifacts or shared author identity?

## Outcome
The approved homepage heading, homepage blurb and About introduction are live, with clear ownership of page copy versus metadata.

## Inherited truths
- site/AGENTS.md and site/PLANNING.md @ 1878c26 govern implementation and promotion.
- Page-specific content belongs to its page; shared author identity remains in consts.ts.
- Production PDF preservation is already implemented and remains enabled.

## Hypotheses to test
- Existing page structure and styling accommodate the approved copy without redesign.

## Hard constraints
- Use the selected PRIMARY copy verbatim.
- Preserve current metadata values and structured-data identity.
- Preserve all five approved production PDFs.

## Explicit exclusions
Shared author bio/byline; remaining About sections; research content; publication tooling; routing; indexing; design-system changes.

## Ticket sequence
| Ticket | Mode | Purpose | Depends on | Gate |
|---|---|---|---|---|
| T24.0 | IMPLEMENTATION | Install and verify the three approved blocks | Accepted contract and seal | Staging acceptance, then separate production authorization |

## Sprint-level acceptance criteria
- All three approved blocks appear at their intended locations.
- Both pages remain readable and functional on narrow and wide screens.
- Metadata, shared identity, research navigation and publication artifacts retain their existing contracts.

## Validation plan
Existing build and CI checks, focused copy/layout inspection on staging, then production verification after authorization. Check the spacing of the three consecutive About lead paragraphs explicitly.

## Stop conditions
A copy rewrite, shared component change, metadata change or styling redesign becomes necessary.

## Exit state
- True: approved copy is production verified and release evidence is recorded.
- Open: remaining About content, shared author biography and publishing-workflow improvements.

## Canonical documentation targets
This sprint contract, T24.0 and scoped ROADMAP/CHANGELOG entries. No broad documentation reconciliation.

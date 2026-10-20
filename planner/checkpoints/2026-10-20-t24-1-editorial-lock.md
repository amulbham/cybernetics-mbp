# Checkpoint — T24.1 homepage / About editorial lock

**Date:** 2026-10-20 (America/Los_Angeles)  
**Status:** Product Authority **APPROVED** final copy and UX direction; implementation **not authorized** by this checkpoint.  
**Verbatim content owner:** `planner/assets/T24.1-approved-content.md` (read that file rather than retyping or paraphrasing copy).

## Verified / reported starting point

- **VERIFIED via GitHub:** `main = 1878c269ef837ce5abe203d742cdc85e3e14ebc0`; `staging = e292703b746c86fe57aa0df1f7f2b577829e89e4`. Staging workflow **#123 completed successfully** on this implementation SHA.
- **VERIFIED staging source:** T24.0 placed Copy A H1 + unchanged Copy B blurb in `site/src/pages/index.astro`, and Copy C as three prominent `.lead` paragraphs in `site/src/pages/about.astro`. Current About order: three leads → Research Focus/cards → generic Methodology → credentials list at bottom.
- **EXECUTOR-REPORTED:** 17 staging HTML checks pass; responsive testing at 375px / 1280px light/dark; six-line mobile H1; about lead spacing ~21/23px; staging HTML matches local output except expected About `dateModified`. Local completion-report commit `279474d` is unpushed/unavailable on GitHub. We independently resolved workflow uncertainty (#123 SUCCESS); no production T24 copy change.
- **PREVIOUS APPROVED CONTRACT:** T24.0 was sealed, staged and verified locally, but its exact earlier text/constraints remain historical. The later changes belong to **new T24.1**, not an alteration of T24.0.

## Editorial decisions and rationale

- **APPROVED H1 supersession:** `The structure behind how systems behave.` replaces T24.0's `Finding structure where systems appear to do one thing but do another.` A shorter H1 resolves the oversized mobile heading; existing Copy B supplies the more specific appearance/behavior contrast.
- **APPROVED positioning:** retain **cybernetics** prominently in page title and both descriptions. A narrower scholarly audience and honest domain identification matter; don't remove this based on presumed search volume. Google rankings are unknown.
- **APPROVED metadata:** homepage title `Amul Bham | Research on AI Systems, Cybernetics & Knowledge`; approved page-specific homepage and About meta descriptions in the content asset. Prior generic descriptions and alternative title suggestions are superseded.
- **APPROVED About hierarchy:** keep `Amul Bham` H1 and one opening lead; move a compact, accessible **Profiles & Contact** row beneath it; put the other two T24.0 paragraphs verbatim in normal **Background** prose; preserve Research Focus and its category cards; then the expanded Methodology. Move existing credential links rather than duplicate them.
- **APPROVED methodology:** two ordinary paragraphs describing observation-led questioning, independent first-principles derivation, comparison with established research, and cybernetics convergence as evidence worth examining—not proof by itself. The product-owner-provided insight was refined to distinguish *derive first, compare second*; use **`I derive`**, not `I try to`.
- **APPROVED minimal presentation:** page-local, design-token-based CSS only if needed, no global redesign, no process graphic, no heavy hero cards or additional components.

## Deliberate technical implications

- T24.0 froze metadata; T24.1 intentionally **changes homepage and About descriptions** and homepage SEO title, so a new ticket must update the regression expectations. This is not a T24.0 defect or license to change other metadata.
- Staging `index.astro` currently feeds both homepage `BaseHead` and `WebSite.description` from `SITE_DESCRIPTION`; preserve shared `SITE_TITLE` / Person identity, inspect any other consumers, and reconcile the homepage description for meta and JSON-LD intentionally. About `ProfilePage` identity and existing dateModified logic remain.
- Preserve article/PDF author bio, source manuscripts, routing, indexing protections, five production PDF hashes and deployment variables. Production acceptance is a separate gate.

## Next action / promotion

1. New Planner session reads this checkpoint + the verbatim asset, current remote heads, `site/PLANNING.md`, staging T24.0 ticket, `index.astro`, `about.astro`; draft **T24.1 delta-only ticket** and review before seal.
2. Product Authority separately authorizes seal/implementation/push to staging. Executor returns one focused acceptance packet; **no** product-only production candidate or `main` push before a second authorization.
3. After staged acceptance and approved production release, promote verified outcome to canonical `site/ROADMAP.md`, `site/CHANGELOG.md` and ticket records; keep this dated checkpoint as rationale.

No files on `main` or `staging` are changed by saving this checkpoint on `planner/context`.

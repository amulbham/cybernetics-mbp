# Sprint 31 — Research reading surface

Status: PROPOSED — approved for independent whole-sprint review, with scope approval to follow review
Risk ceiling: R2 for the reading surface and forward print work, R3 for a separately authorized production release
Branch: staging for execution, planner/context for the contract and seals
Depends on: Sprint 30 closure and the accepted [local Planner transition](../../../planner/checkpoints/2026-11-18-local-codex-planner-transition.md)
Unlocks: A verified reading treatment across the corpus and an evidenced local Planner-to-Executor handoff

## Core question

Can readers distinguish the opening Key Findings map from the moves in a long argument at a glance, with a clear heading hierarchy and predictable future PDF output?

## Outcome

Research pages use the previewed screen treatments for primitives and Key Findings. The article subtitle immediately under the main `h1` renders as `h2` with the same styling. Key Findings retains its existing `h2` section heading, and the audit verifies that the individual findings render as native list items. The sprint documents which Sprint 30 carry-forward issues matter to this work, and it exercises the existing local-to-GitHub planning workflow through an independently reviewed plan, sealed tickets, and reconciled Executor evidence.

## Inherited truths

- Fresh baseline on 2026-11-18: `origin/staging` at `15c37e9a17b2c1fe65317a3a62d0aea4f4d14128`, `origin/main` at `ee3ebc6ccf658a7005e219830db247f2c8c75c89`, and `origin/planner/context` at `b0bb93acdd267c3a778c4a0c1bfa929a5d4cc626`. Use staging's `site/PLANNING.md` and templates. Recheck refs before each review and seal.
- Source intake: `site/planning/audits/reading-surface-sprint-intake.md` from the Executor checkout, SHA-256 `e9b13fae869747ac14d6a82a6ecc8b6f81b7ceb5c25fa822d90204aeb2fd3d7b`. The CSS preview exists there and is absent from the fetched staging ref. Its appearance and reported preview checks are design inputs. Execution authority comes from the eventual ticket seals. This plan supersedes the intake's six-PDF count with the seven-PDF [Sprint 30 baseline](../audits/S30-sprint-closure.md).
- Existing Markdown already emits primitive kind classes. The Key Findings transform wraps `## Key findings` plus a list. On staging, the three existing lists are in Paper C, *The Latency Trap*, and *How Frontier Model Training Became a Public Utility*. Their findings are complete statements without separate labels. `ArticleShell.astro` renders a frontmatter subtitle as `p.subtitle`, and is shared with the IWL layout. The TOC uses depth-2 headings from the article Markdown, with a six-heading threshold.
- Main's independent seven-PDF guard and post-deploy verification passed in [production run #154](https://github.com/amulbham/cybernetics-mbp/actions/runs/44222302915). Published PDF bytes, public routes, indexing, licenses, and publication identity are inherited constraints.

## Proposed reading treatment

- **Primitives.** Keep the label as the primary kind cue. Use steel for Definition and Key idea, green for Evidence, amber for Counterpoint, and slate for Implication. Keep the 6px rule, add a label hairline, and use an 8% kind wash except for Key idea, which uses raised paper and 1.15em body type. The preview's light/dark ink pairs are steel `#2e4a68` / `#8fa8c4`, green `#2d6a52` / `#6fba9a`, amber `#7c5f26` / `#d4b36a`, and slate `#4a5563` / `#a0a8b4`. Use dedicated tokens across the default, explicit dark, and system-dark cases. Label contrast must reach 4.5:1 against the actual fill in both themes.
- **Key Findings.** Raised paper, plain 1px border, accent markers, a compact uppercase mono section label, and clearer space between items. Keep its existing content, order, and placement. Its visual identity remains distinct from the primitive cards, alerts, and pull quotes. Audit the built HTML and accessibility tree for the existing `h2` section and native `ul` or `ol` with `li` children. Preserve the current structure where it passes the audit. Scope any verified semantics correction in the reading-treatment ticket.
- **Reading rhythm.** Use the preview's larger body-section gaps and mobile section sizing, with the existing Lab Bubble treatment retained. Test a whole-bold thesis paragraph and a paragraph with normal text around one bold phrase. The preview's `:has(> strong:first-child:last-child)` selector matches the latter too because child selectors count elements. Keep the thesis emphasis only if it can be targeted accurately inside the sealed scope.
- **Article subtitle.** Render the frontmatter subtitle immediately below the main research article `h1` as an actual `h2` in the built HTML. Preserve its font, size, weight, color, line height, wrapping, and spacing against the accepted screen treatment and established print baseline. Keep it out of the site's TOC. Preserve body section headings, section subtitles, cards, shared IWL rendering, and the existing Key Findings anchor and TOC count. [W3C heading guidance](https://www.w3.org/WAI/tutorials/page-structure/headings/)

## Hypotheses to test

- The preview treatment makes primitive roles and the introductory map distinguishable in both themes without relying on color alone.
- The article subtitle tag can change through the existing rendering path while preserving authoring, navigation, and screen and print appearance.
- A narrow fix to the pre-existing title and DOI rules can restore intended print typography while preserving the responsive screen behavior. Reproduce the leak before allocating the fix.

## Hard constraints

- Scope screen styling to screen media. Test shared markup in the actual forward-PDF renderer as well as print emulation. Use disposable specimens and preserve all seven frozen production artifacts and the existing guard.
- Preserve scholarly prose, Markdown authoring, references, citation targets, and the closed-indexing staging policy. Limit heading changes to the subtitle beneath the main research article title. Any material change to routing, licensing, indexing, or artifact custody requires a new Product Authority decision.
- Apply the existing role, review, seal, Git, and release gates. The Planner prepares prompts and verifies evidence. The Product Authority sends each sealed handoff to the Executor.

## Explicit exclusions

- New primitive types, article rewrites, new findings, typography or navigation redesign outside the named reading surfaces, and changes to frozen PDFs, DOI identity, or Zenodo deposits.
- A broad harness rewrite, new redirects, sitewide or IWL relicensing, and the older Chisel/IWL, historical PDF citation, and corpus-wide table and citation-anchor projects.

## Ticket sequence

Provisional sequence for whole-sprint review. Draft each contract when the preceding evidence establishes its scope.

| Order | Mode / risk | Purpose | Depends on | Gate |
|---|---|---|---|---|
| T31.0 — Baseline and triage | AUDIT / R0 | Pin the local preview and built reading specimens. Audit Key Findings list semantics, capture heading/TOC and print baselines, reproduce the two screen-to-print symptoms, and classify the carry-forward findings below. | Reviewed and approved sprint direction | One evidence record with severity, scope, and disposition. Runtime checks use isolated outputs. |
| T31.1 — Reading treatment | IMPLEMENTATION / R2 | Apply the proposed screen treatment for primitives, Key Findings, and reading rhythm. Preserve native list semantics. | T31.0 baseline | Owner local preview, theme and viewport evidence, contrast, list semantics, and negative print checks. |
| T31.2 — Forward print title and DOI | IMPLEMENTATION / R2, conditional | Isolate the screen title sizing and DOI clamp from print if reproduced. | T31.0 reproduction | Intended print layout verified in disposable specimens. The mobile title and DOI remain usable. If the leak is absent, record the evidence and skip this ticket. |
| T31.3 — Article subtitle tag | IMPLEMENTATION / R2 | Render the subtitle directly under the main research article `h1` as `h2` while preserving its appearance and the TOC. | T31.1 and a verified print baseline from T31.0/T31.2 | Built HTML and accessibility heading checks, before-and-after render parity, validator evidence, and real print comparison. |
| Production release | RELEASE / R3, separately authorized | Promote accepted changes on the current main baseline. The Product Authority authorizes and performs the final push. | Accepted staging and exact-candidate preflight evidence | Verify the deployed SHA, reading-surface behavior, approved indexing, and all seven frozen PDF digests. |
| Sprint closeout | Planner documentation | Reconcile ticket and deployment evidence, record deferred findings and the pilot result, and update sprint and Planner state. | Verified production release | Publish the closure record, final pilot checkpoint, and updated `planner/STATE.md` on `planner/context`. |

## Sprint 30 carry-forward triage

This is a planning assessment from source and recorded evidence. T31.0 supplies any missing runtime evidence before adjustments to scope.

| Item | Evidence and proposed disposition |
|---|---|
| Forward print title/DOI | Staging has scoped title `cqi` sizing and a masthead DOI clamp used by the shared article HTML. Sprint 30 reported print effects. Reproduce both before the conditional R2 fix. This is the only proposed carry-forward product fix at intake. |
| Legacy PDF harness | The older carry-over suite's 19/84 failures and six-guard coverage gaps remain historical observations. Compare the legacy cases with the current seven-PDF contract, run the smallest useful isolated checks, and separate outdated assertions from meaningful failures. Bring a harness-only repair back for scope if warranted. Active guard or preflight failure blocks release. |
| Paper C table header | Commit [`56f197b`](https://github.com/amulbham/cybernetics-mbp/commit/56f197bfb0911f799c47de79569159c6c6d97d01) added `Condition` to support responsive records. The source change is verified. Compare the approved PDF with a disposable render to determine whether the reported difference is expected historical drift or a current print defect. Preserve the responsive label and frozen file. |
| `scholarlyReview` warning | The same empty-collection warning appears in the successful staging and production jobs. The source defines an optional review collection and gates populated review input to explicit closed builds. Confirm the normal empty case and the isolated review path before proposing any change. |
| Paper C route history | The row is absent on both refs. The current `paper.pdf` alias is derived from `format: paper` independently of the ledger. Check the actual redirect and determine which historical paths, if any, the row would add. A route mutation needs separate scope and approval. |
| DOI at 320px and mobile nav shift | Measure DOI clipping or legibility and the reported ~8px link shift during the mobile baseline. Include DOI regression coverage for the print ticket. Raise standalone mobile polish only if the evidence warrants it. |
| Sitewide and IWL licenses | Keep as a Product Authority policy decision. The current reading work does not require a license change. |
| Stale docs and standalone Executor reports | Correct stale statements in docs directly touched by this sprint. Record available report references in Planner memory if supplied. Existing Sprint 30 closure evidence is sufficient for planning. |

## Sprint-level acceptance criteria

- **A noticeably improved, cohesive scholarly reading experience.** Use before-and-after examples to show distinct primitive treatments, a recognizable Key Findings map, and clearer section rhythm on representative dense and sparse articles at desktop and 390px in both themes. All five primitive kinds remain identifiable with color disabled and pass the 4.5:1 label contrast check. Check distinction from pull quotes, alerts, and citation blockquotes, and record masthead DOI and navigation behavior at 320px.
- **A consistent and accessible semantic document structure.** A research article with a subtitle renders it as `h2` directly under its main `h1`, with the same text styling and layout. Key Findings retains its section heading and exposes each finding as a native list item, with markers, order, and inline formatting preserved. Verify the built HTML and accessibility tree. Section anchors, desktop and mobile TOC membership, and citation anchors stay stable. Pages without these modules render no empty headings or cards.
- **Reliable forward PDF generation with all seven historical PDFs preserved.** Use the repository renderer to show that disposable forward specimens have the intended title, DOI, and Key Findings layout and that accepted screen styling and the subtitle tag leave print behavior within the verified baseline. Verify all seven frozen PDF digests through the existing exact-candidate and post-deploy safeguards.
- **A demonstrated local-first, multi-model development workflow.** Record the local Grok CLI's independent review of the exact published sprint draft, the approved seal SHA in the owner's handoff, the Executor's retrieval and implementation evidence, and independent Planner verification. Capture what worked and where the process needed adjustment in the [workflow pilot checkpoint](../../../planner/checkpoints/2026-11-18-sprint-31-local-workflow-pilot.md).

## Validation plan

- Use the normal site build and existing validators from the pinned staging revision. Inspect built DOM and the browser's accessibility tree, including one page at the TOC threshold or a focused equivalent. Check ordered and unordered finding lists, a page without findings, existing anchors, and IWL heading behavior. Compare the article subtitle's computed styles and before-and-after renders at desktop and 390px in both themes, using the accepted screen treatment as the baseline.
- Primary visual specimens: Lab Bubble for all five primitive types and reading rhythm, Latency Trap and Frontier Model Training for essay Key Findings, and Paper C for paper Key Findings and masthead. Use FAFSA and Invariants to sample dense and sparse primitive use. Capture desktop and 390px light/dark comparisons and targeted 320px evidence. A token-only estimate puts light-mode Counterpoint at about 4.76:1, the narrowest contrast margin. Verify the actual computed and composited colors in the browser.
- Emulate print on the built HTML and make disposable forward PDF specimens with the repo renderer for the masthead and heading work. Compare heading/list text, print styles, pagination, and relevant first-page layout against the appropriate baseline. Follow normal exact-candidate preflight and seven-PDF verification if production is approved.

## Stop conditions

- Stop for Product Authority direction if the subtitle tag or a verified list correction requires new authoring rules or changes to established TOC, IWL, or print behavior beyond the agreed boundary.
- Stop promotion on active PDF guard or preflight failure, a changed frozen digest, or a needs-authorization change to a route, license, publication identity, or indexing policy.
- Bring back any carry-forward item that requires new scope. Use the collected evidence to decide whether it blocks this outcome or belongs in the backlog.

## Exit state

Product Authority confirmed the finish line on 2026-11-18. Close Sprint 31 after the separately authorized final push to production, verification of the exact deployed candidate, and completion of post-sprint documentation. Record ticket dispositions, release evidence and deferred work in the sprint closure, update the plan and `planner/STATE.md`, and synchronize the closeout and workflow evidence to `origin/planner/context`. Staging acceptance remains an intermediate milestone.

## Canonical documentation targets

- Lock the accepted visual design in `site/design-system/tokens.md` and `site/design-system/components.md`. Update `site/PUBLISHING.md` for the article subtitle rendering and `site/CONTENT-MODULES.md` if the list audit establishes a documentation correction.
- Use `site/ROADMAP.md` and `site/CHANGELOG.md` for verified backlog dispositions and shipped changes according to the existing protocol. After production verification, add the Sprint 31 closure record under `site/planning/audits/` and update the sprint contract, Planner state, and pilot checkpoint on `planner/context`. Amend operating instructions only where the pilot earns a lasting clarification.

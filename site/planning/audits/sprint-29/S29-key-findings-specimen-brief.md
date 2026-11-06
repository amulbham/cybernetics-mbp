# Sprint 29 — Key findings specimen brief

Updated: 2026-11-06
Status: CONTENT EXAMPLES READY / LAYOUT EXPERIMENT BRIEF; no website implementation or rendered pipeline proof
Inherits: [sprint roadmap](../../sprints/sprint-29-future-scholarly-pdf-foundation.md), [prospective standard](../../programs/future-scholarly-pdf-standard.md).
Fixed source copy: [eight-article examples](https://github.com/amulbham/amulbham-research/blob/f17779eff0d47f88bac8d7031df552c9ff000b46/meta/manuscript-authoring/v0.2_Key_Findings_Corpus_Examples.md).
Authoring entry point: [MANUSCRIPT-AUTHORING.md](https://github.com/amulbham/amulbham-research/blob/f17779eff0d47f88bac8d7031df552c9ff000b46/MANUSCRIPT-AUTHORING.md).
The current owner direction authorizes finalizing copy and making varied examples. The separate whole-sprint review still precedes executor-ticket development; this brief scopes those later rendering experiments.

## Coverage and content

Current main fc3cb775 has eight articles: six papers, two essays. Seven lack a findings section; Frontier has one to revise/reuse.
All eight now have a four-bullet example, 72–88 words, with source-section mapping. No planned exclusions or editorial hold remains.
This is a one-time HTML migration; future manuscripts supply findings or intake flags them for completion.

| Article | Opening condition | What it tests |
| --- | --- | --- |
| Lab Bubble | Essay, no abstract/readerNote | Summary before narrative opening without overwhelming the story |
| Frontier Training | Essay, existing findings after introductory prose | Relocate/reuse one component, preserve anchor, no duplicated list/heading/TOC entry |
| Cognition | Paper with abstract | Before-/after-abstract alternatives, architectural claim and causal boundary |
| Invariants | Paper with abstract and readerNote | Full opening stack without repetitive panels |
| Three SOS | Paper with abstract and readerNote | Concrete cross-domain preview alongside framework metadata and comparisons |
| Chisel | Paper without abstract | Required summary without fabricating an abstract |
| Desk | Paper with preface and abstract | Respect authored preface and test how much material precedes the main argument |
| Financial Aid | Paper in essay category, opening warning/log and long abstract | Format/category separation; preserve authored warning and readability |

## Bounded comparisons

Use the same fixed wording when comparing layouts. Content changes must be recorded separately so they do not confound placement judgments.
For essays and no-abstract papers, propose the component after masthead/compact metadata and before the long body.
For papers with abstracts, compare findings before versus after the abstract. Preserve abstract, preface/warning, readerNote and the introduction; inspect the entire stack.
For readerNote/preface cases, the experiment may vary ordering or propose a restrained presentation; it may not silently delete, collapse or rewrite approved material.
Use a clear heading, real list, ordinary readable text and restrained border/background. Keep findings visible by default on mobile.
No summary generation at runtime/build time; no separate manual PDF copy.

Inspect representative 375/390px and 1440px widths in light/dark themes, plus enlarged text. Use the sprint's integrated validation matrix for remaining breakpoints.
Review all eight content variants; prioritize the distinct opening configurations above rather than eight cosmetic variants.
Test duplicate detection, anchor compatibility, TOC coherence, focus and reading order.

## Future PDF experiment

After the reviewed ticket permits it, render one clearly labeled nonpublication fixture through the actual PDF pipeline using the same findings text.
Compare a light after-abstract heading/list with the web-only projection. Check first-page crowding, repetition, page breaks and title/author/abstract extraction.
Do not create or overwrite a published PDF path. Specimen bytes stay outside production packaging and the six-file legacy baseline.
Decision: include in future PDFs only if the example earns it. Web findings are required regardless of that decision.
A mockup cannot substitute for the actual PDF-pipeline proof.

## Acceptance and remaining evidence

Content milestone complete: all eight copy examples exist, the prior Frontier mismatch is corrected, and the authoring entry point is consolidated.
Layout milestone remains: actual rendered openings, owner selection and future-PDF decision. Then implement the shared component and one-time 8/8 HTML adoption through earned tickets.
Final publication copy is reviewed in one grouped package. An unexpected source mismatch is flagged and corrected; do not silently drop that article.
Passing this brief's content checks is not a claim that the website rollout has shipped.

# Sprint 29 — bounded first local specimen brief

Updated: 2026-11-06 (America/Los_Angeles)
Status: REVIEW-READY EXPERIMENT SCOPE — not an executor ticket or seal
Proposed mode: SPIKE · proposed risk: R2 · local/nonpublication only
Inherits: [sprint roadmap](../../sprints/sprint-29-future-scholarly-pdf-foundation.md), [standard/decision register](../../programs/future-scholarly-pdf-standard.md).
Fixed research package: f17779eff0d47f88bac8d7031df552c9ff000b46.
[Eight summaries](https://github.com/amulbham/amulbham-research/blob/f17779eff0d47f88bac8d7031df552c9ff000b46/meta/manuscript-authoring/v0.2_Key_Findings_Corpus_Examples.md) are fixed experiment input: exactly eight four-bullet payloads, 72–88 words. Do not edit, regenerate, merge or reopen their copy.
[Authoring entry point](https://github.com/amulbham/amulbham-research/blob/f17779eff0d47f88bac8d7031df552c9ff000b46/MANUSCRIPT-AUTHORING.md) and companion one-pagers remain pinned at that same commit.

## Purpose and dependency

Earn a local rendered comparison for the opening, primitives/tables, anchors and future-only PDF design, then let the owner choose defaults.
This scope may become the first earned ticket only after independent sprint review and prospective seal.
It does **not** depend on implementing the production artifact resolver, migrating all article content or reconciling hosted staging. O1/O2 in the standard must be decided before the persistent licensing/artifact operations they govern; local experiments can display explicitly proposed notices.
Final placement/fonts/PDF inclusion are experiment questions, not preconditions.

## Bounded outputs

1. **Two primary web openings:** Lab Bubble (essay) and Cognition (paper/abstract), using exact fixed findings and existing source prose.
2. **Six additional opening fragments:** Frontier, Invariants, Three SOS, Chisel, Desk and Financial Aid. Show their distinct first-screen/stack configurations; no need to typeset eight complete manuscripts.
3. **Five primitive examples:** one existing authored excerpt or clearly labeled authoring-guide fixture per kind. Definition gets the first visual comparison; no new empirical claims or primitive kinds.
4. **Six real table cases T1–T6 and the one adversarial fixture T7** from the audit. Prototype alternatives only where the shape warrants them.
5. **Anchor cases A1–A7** from the audit in a local served experiment; no assertion of a fix without measured target/chrome positions and navigation checks.
6. **At most two PDF variants of one paper specimen:** same approved findings text after abstract versus a web-only findings projection. Use the accepted minimal identity/no closing bio and proposed CC BY line. Output into a dedicated nondeployable specimen directory.

The paper may be a clearly marked local design rendition of the existing Cognition work with its full source/figure/reference assets, or a labeled fixture using approved excerpts with clear provenance. Do not attach a real DOI to a synthetic work as if it were registered. Record source-work identity separately from specimen identity.
Do not automatically create a scholarly PDF for an essay or IWL.

## Opening variety matrix

| Article | Source opening condition | What the example must expose |
| --- | --- | --- |
| Lab Bubble | Essay, no abstract/readerNote | Findings before narrative opening, useful hook without an oversized panel |
| Frontier | Existing findings after introductory prose | One relocated component; retained anchor; no duplicate list/heading/TOC entry |
| Cognition | Paper with abstract | Before-/after-abstract web alternatives and architectural claim/causal limit intact |
| Invariants | Abstract plus readerNote | Whole opening stack without repeated summary panels |
| Three SOS | Abstract plus readerNote | Concrete preview alongside framework orientation and comparative material |
| Chisel | Paper with no abstract | Required findings without fabricating an abstract; use published main source in first experiment |
| Desk | Preface then abstract | Preserve authored preface; compare delay before substantive prose |
| Financial Aid | Paper in essay category, warning/log and long abstract | Format/category separation, retained warning, opening density |

## Permitted local experiment surface

Use an isolated checkout/scratch copy based on pinned main fc3cb775, with a disposable specimen HTML/CSS/asset/output root outside any deployable dist.
A narrow local adapter may project built Astro HTML and fixed findings into this root, reuse link absolutization/image handling as needed, and invoke the repository's pinned Vivliostyle CLI with the real print stylesheet plus experimental overrides.
Do not invoke the unmodified all-paper builder in the shared checkout: it writes every PDF to normal dist paths. A selected-paper adapter must explicitly own its temporary output; a later ticket decides whether any adapter deserves production adoption.
Prototype only the needed opening projection, style/offset behavior and print treatment. Do not add a live route, publication field, registry, dependency or workflow to enable the experiment.
Run/record any baseline build checks honestly. Passing an unmodified baseline build is not validation of modified experimental HTML. Add local output assertions and visual inspection for the projection being compared; production validators stay intact.
Exact Markdown bullet wording/ordering/emphasis from the research payload is preserved. Layout may vary; article prose, claims, citations and published metadata decisions may not.

## Comparisons and acceptance evidence

Web: 375px and 390px phones, 1440px desktop, light/dark and enlarged text. Add 1099/1100px for the table/TOC breakpoint and 768px where the observed case requires it.
Compare before-/after-abstract placement only on papers with real abstracts. Preserve readerNote/preface/warnings and inspect the whole opening. Do not silently delete or collapse approved prose to make a layout fit.
Table evidence preserves every cell, long qualification, header relationship and link; show one active accessible/search projection. A matrix needs comparisons preserved, not automatic records.
Anchor evidence records the visible sticky bar bottom and target's first line after navigation; test collapsed/expanded details, direct hash, same-page tap, keyboard, history and Astro navigation where the served fixture reproduces it. Report unsupported fixture behavior rather than imply the real app passed.
PDF evidence: source/render settings and output hashes, contact sheet plus first/last-page detail, all five primitives, representative tables, full figure, citations/references and any declarations; title/name/ORCID and sample body text via two independent extractors; actual fonts, pagination and clipping inspected.
Keep no-bio print behavior separate from the website author note. The proposed BY notice and role do not alter archived PDF bytes.
Return a compact comparison/decision sheet: selected candidate, rejected alternative, measured issue, remaining uncertainty. No claim of Scholar indexing from local checks.

## Forbidden and stop boundaries

No main/staging push, workflow dispatch/re-run, Wrangler/Cloudflare upload, repository-variable/settings changes, Zenodo operation, frozen-PDF rewrite or production-guard/baseline edit.
No specimen PDF at an existing published path, no sample in a future upload package, and no silent edits to the fixed research copy.
Stop the affected experiment if it requires publication/deployment authority, source meaning changes, unknown artifact provenance, a new renderer/dependency or production-oracle weakening. Finish unrelated bounded comparisons.

## Hosted gate and work after specimens

Hosted staging is separately authorized only after the candidate/published policy is accepted and implementation supplies explicit selected-artifact behavior, noindex proof, six-file upload/hash guard, exact target/revision checks and postupload verification.
Preserve staging Chisel/IWL changes without promoting them to production. No hosted candidate PDF is proposed for the first S29 preview; only six published archived artifacts may be packaged.
After specimen acceptance, draft earned adoption/rollout tickets: real extractor/slot/intake checks, rendering integration, final license/identity/artifact logic, anchors/tables and all-eight HTML migration; then integrated preview/release checks.
A local prototype does not prove that extraction, current validators or production packaging already support these decisions.

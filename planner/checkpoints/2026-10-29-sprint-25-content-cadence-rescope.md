# Sprint 25 rescope — Content-centered publishing cadence

**Decision:** Approved by Product Authority on 2026-10-29. Prospective **planning** revision, not an execution ticket, content change, branch merge or release.  
**Earlier scope preserved as history:** The original October 21 workflow foundation, October 28 expanded releases/corpus/SPM commitments, all sealed tickets, completed audits and editorial approvals remain true as recorded. **Only the unfinished future Sprint 25 exit requirements are superseded here.**

## Operating philosophy

Follow-on sprints each have **one primary content outcome**: publish a new essay/paper or substantively improve one current website entry. Audit that piece's source, history, citations, author-selected primitives, metadata, and publication identity as part of its sprint. Recover the article's research SPM home with a `STATE.md`, one author-approved canonical `assets/manuscript.md` containing integrated prose and primitives, and real checkpoints/IWL only where supported; mark historical gaps **UNRECOVERED**, never invent author decisions. A derived audit may list primitives, but there should be **no competing hand-maintained primitive manuscript**. Intentional zero primitives remains valid; no numerical quotas.

Use author/editorial approval first, non-editorial Executor intake second, then independently reviewed candidate, **separately approved exact staging-push SHA**, staged HTML and PDF checks if scholarly, separately sealed production release and postrelease verification. An essay does not use scholarly PDFs; an academic paper can entail DOI/Zenodo and protected frozen PDF versioning. Make process improvements only when actual content demonstrates them. Target a steadier flow of new and updated research, but **do not promise sprint lengths, publication frequency or a ship-at-any-cost quota**. Reorder future sprints from evidence and the user's priorities.

## Sprint 25 — Revised mandatory scope

**Retain completed work:** T25.0/T25.1 continuity/audit; T25.2 authoring/manuscript contract **accepted with follow-up on planning branch** (not automatically a globally promoted standard); T25.3/T25.3a fresh Executor handoff trials **accepted with stated evidence limitations**; T25.4 static six-article + Chisel-IWL audit **accepted with follow-up**. Its findings form a **per-content-item backlog**, not a six-article fix mandate. Chisel v2 author-approved canonical article/IWL source exists on research `papers/chisel-s25-editorial @ 3ceccad4f6180a3820829dd600fdede7f3a0db04`.

**Remaining Sprint 25 work:**
1. Finish already-sealed **T25.5 Chisel existing-scholarly-paper/IWL update pilot** with independent candidate approval, separately owner-authorized staging push, deployed article/IWL/PDF review evidence and Planner acceptance. Prefer production revision **only with independently authorized release and confirmed DOI/Zenodo plus frozen-PDF parity**. If unresolved, explicitly record **staging verified / production blocked**, without treating staging as publication or holding unrelated foundation documentation hostage.
2. Reconcile author-controlled Markdown/primitives and SPM handoffs, with actual production vs notes-only/draft documentation status clearly distinguished. Five primitive kinds, authored placement and zero permitted.
3. Write **bounded, usable procedures** for updating a scholarly paper/IWL, publishing a new essay (no scholarly PDF), and introducing a new academic paper (DOI, frozen PDF/version and indexing requirements). **Mark untested new-essay/new-academic pathways and sixth-PDF limitations explicitly** rather than promising unproven functionality.
4. Finish essential Planner/operator references for the next content sprint; production-doc promotion still needs independent approval where deployment would follow.

**Moved to future content sprints, not cancelled:** release FAFSA v2.4 and Lab Bubble, make all six article corrections, backfill all six research SPM folders, test a fourth scholarly manuscript and implement generalized new-scholarly-PDF extensions as actually needed. No retroactive modification of original accepted audits or T25.5 seal.

## Tentative roadmap — Priority, not a schedule

| Sprint | Main publication outcome | Distinct learning |
|---|---|---|
| **26 — Lab Bubble** | Publish already-approved new **essay** | Author metadata/final source and new-essay/no-PDF workflow |
| **27 — Invariants of Self-Organizing Systems** | Substantively update existing academic paper | Recover missing SPM only as evidenced, revise author-selected primitives/references, PDF/DOI version gate |
| **28 — New academic paper (provisional)** | Publish new scholarly work | End-to-end new-paper and sixth-PDF/DOI/Zenodo capability limits |
| **Later or reprioritized** | FAFSA v2.4, Desk, Frontier, Three SOS and other findings | One paper at a time, with best-effort SPM backfills and owner-approved corrections |
No fixed duration, dates or automatic downstream tickets. Existing-corpus urgency may move FAFSA before the proposed new academic paper.

## Current verified position (2026-10-29)

- T25.5 **SEALED** on website `planner/context @ aed7538701abe7cc730cf51752de8ebae146d50c`. Seal permits isolated candidate/local checks, **not** staging deployment.
- Isolated Chisel candidate `work/t25.5-chisel-intake @ 412f1de2bfd81e43f0419aff35da50b0f356b72a`, parent `staging @ 043e351f00f6834a053847209caca4749941e91d`, has exactly two content-path changes. Planner's static comparison found the article and IWL each identical to accepted research Markdown **except for one approved `dateModified: 2026-10-28` line**. Nine primitive anchors and 32 consecutively numbered references retained.
- Executor **reports** local CLOSED build (57 pages), five generated PDF previews, 24-page local Chisel PDF and negative tests PASS; Planner did not rerun local build or inspect a *deployed* PDF. Website `main @ 9697dbc7310c480d4b6349104e9504107e4341a2` and staging remain unchanged.
- **Next gate:** independent Planner review of candidate/local evidence and **separate Product Authority authorization of exact `412f1de2…` SHA for staging push**, with fresh HEAD/lease check. That push auto-deploys nonindexable staging and regenerates five preview PDFs, requiring deployed-PDF SHA/URL evidence. Existing DOI `https://doi.org/10.5281/zenodo.23458660` is permitted **unchanged for closed staging only**; unresolved deposit/version and production PDF parity **block production release**.

## Scope and reporting discipline

After each Sprint 25 task, distinguish **Oct 21 original**, **Oct 28 expansion**, and **Oct 29 prospective narrower scope**; include verified vs reported evidence, done/current/next, transferred work, scope-creep classification and exact next approval gate. This checkpoint **does not authorize website changes, staging, production, DOI/Zenodo, PDF freezing, research branch merges, or Sprint 26 execution**.

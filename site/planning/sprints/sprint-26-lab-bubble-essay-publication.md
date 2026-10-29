# Sprint 26 — The Lab Bubble: first content-centered new-essay release

Status: **PROPOSED — NOT FROZEN OR EXECUTABLE**, 2026-10-29
Risk ceiling: R3 **provisional for production release**; each future ticket independently classifies risk
Branch: `planner/context` for plan; later isolated source branch, preauthorized closed-indexing staging only if a future seal expressly permits it; production separately authorized
Depends on: [Sprint 25 foundation CLOSED](sprint-25-workflow-consolidation.md), accepted V2.6.3 research SPM/manuscript, website `PLANNING.md`/publishing and manuscript contract
Unlocks: one actually live **new essay**, tested new-entry/no-scholarly-PDF workflow, evidence-earned refinements

## Core question and outcome
Can we publish the author-approved **The Lab Bubble** as `format: essay`, `category: ai-systems`, on a new canonical route while preserving the exact integrated seven-primitive manuscript, validating all citations and metadata, and leaving five frozen production scholarly PDFs intact? **Sprint closes only on verified production publication**, not a staging build. No fixed sprint calendar or throughput promise.

## Inherited truth and source pins
- **Research branch verified 2026-10-29:** `amulbham/amulbham-research papers/the-lab-bubble-spm-init @ 7be299fa7d57bcd9a0799c43e42e80de017c79b7`. `papers/the-lab-bubble/STATE.md` says V2.6.3 **EDITORIALLY APPROVED, publication pending**, canonical `assets/manuscript.md` Git blob `a17d91247fd73a583c9773f577b1e64431cca85d`, SHA-256 `ab08bc15fee197f9227dc73f91273245f9a835b4d48e7cd4dae21815230c4f34`. Complete real SPM with checkpoint and IWL-005; **no source recovery/extra manuscript rewrite needed**.
- Handoff's proposed public suffix begins `## I Had Tokens to Burn` and ends at reference 20; expected body SHA-256 `857c1933d8bee98ed164df7291a1e406ef31541aae02d3a5920eb4bf9facaa63` (**not yet independently executed on Astro**). Strip only approved offline masthead; do not publish internal IWL/handoff/history.
- Nine narrative sections, seven approved callouts (2 Definition, 2 Key idea, 1 Evidence, 1 Counterpoint, 1 Implication), 20 contiguous references and 23 explicit `[[N]](URL)` citations. Preserve all author-owned prose, anchors, emphasis and URLs.
- Website `staging @ 412f1de2bfd81e43f0419aff35da50b0f356b72a` has **no** Lab Bubble research entry; intended `/research/ai-systems/the-lab-bubble/` still needs collision/route-history checks at intake. Production `main @ 9697dbc7310c480d4b6349104e9504107e4341a2`.

## Article starting-state audit — 2026-10-29, read-only baseline

| Dimension | Status | Verified evidence / scoped next action |
| --- | --- | --- |
| Canonical manuscript and editorial status | **READY** | Research `STATE.md`, V2.6.3 approved `assets/manuscript.md` `a17d9124` @ pinned research `7be299fa`; preserve exact prose/markup, no new editorial rewrite |
| SPM and provenance | **READY** | Existing `papers/the-lab-bubble/` has `STATE.md`, approved source, checkpoints, IWL-005, review and source-reconciliation records; **do not create a second workspace or invented history** |
| Primitives / reading treatment | **READY** | Seven author-approved unique anchors, two Definition, two Key idea, one Evidence, one Counterpoint, one Implication; no selection/rewrite/quantity quota task |
| References and links | **WORK NEEDED / OWNER DECISION** | 20 sequential references, 23 explicit outbound `[[N]](URL)` citations; targeted live link/claim checks before publication, plus grouped decision for linked-title/DOI display labels; no change to substantive citation targets without author approval |
| Metadata and publication identity | **OWNER DECISION** | Title, `format: essay`, `category: ai-systems` approved; exact `pubDate`, identical proposed excerpt/description pending final explicit selection; no abstract, DOI or scholarly PDF |
| Website source and rendered route | **WORK NEEDED** | No Lab Bubble entry under staging research directory; need collision/route-history check, authorized body projection and exact-body hash, new route (`pdf:false`), staging build/mobile/source QA then live site verification |
| Scholarly PDF/DOI/Zenodo | **NOT APPLICABLE to this essay** | Existing five frozen scholarly PDFs **must remain untouched**; no new-PDF/DOI/deposit task or sixth-PDF infrastructure scope |
| Production publication | **NOT YET SHIPPED** | No Lab Bubble `main` release; separate release decision **within Sprint 26** after approved closed staging and evidence; only verified live `main` deployment satisfies this content sprint |

**Audit-derived minimal plan:** resolve one author metadata/reference cluster → one sealed bounded essay-intake ticket (prefer preauthorized **closed staging**) → staging evidence and independent acceptance → one separately approved **production RELEASE inside Sprint 26** → verify public article and five-PDF preservation → close and update canonical docs/CHANGELOG/ROADMAP. No new SPM, prose rewrite, primitives election, IWL publication, DOI/PDF build extension or redundant audit ticket is warranted by this baseline. The initial source/presentation audit is **static**; render/mobile and full fresh-link verification remain work, not PASS claims.

## Clustered author decisions — OPEN (resolve together, once)
1. Exact first-publication `pubDate` **PENDING**: the source masthead says only October 2026; don't invent a day.
2. Exact `excerpt` and `description` **PENDING author approval**; proposal for both: “How inference budgets, model choice, and learning histories shape AI workflows—and why internal product intuition needs testing under customer conditions.”
3. Reference-label display policy **PENDING**: twenty bibliography entries contain linked titles and some `doi:10.…` labels, which differ from `site/PUBLISHING.md` presentation policy. Obtain a bounded approval for **display-label-only normalization in the website projection**, preserving destinations/claims and showing the exact diff, **or** an explicit essay-specific exception preserving authored bytes.
4. Already accepted: title `The Lab Bubble`, `format: essay`, `category: ai-systems`; no public abstract/subtitle, DOI, scholarly PDF, extra IWL, hero, tag, reader note invented.

## Hard constraints and explicit exclusions
- One canonical author-approved research Markdown; no second hand-maintained primitives, unapproved editorial changes, fabricated metadata or inferred source claims. Verify live-link/pricing/access/chronology claims where material before publication; flag uncertain claims for author decision rather than rewriting.
- A new **essay**, not scholarly paper: `Article` JSON-LD, no Highwire, no DOI, no generated essay PDF; add approved first-publication route-history entry (`pdf: false`) only in separately sealed implementation.
- Maintain exact five production frozen scholarly PDF identities, protected `main` vars/indexing and other papers. Do not bring Chisel DOI/Zenodo revision, older SPM backfills, sixth-PDF architecture or unrelated site work into this sprint.
- **Approval economy:** plan for one grouped author metadata/reference decision and one risk-appropriate prospective ticket seal that can **preauthorize closed-indexing staging** if exact path/source/lease and PASS/BLOCKED stop conditions are specified. Avoid duplicate staging approvals. **Production release separately owner-approved** after evidence. No forced pushes, manual reruns or unapproved restoring pushes.

## Provisional execution sequence — NOT created or sealed tickets
- **Reality/metadata intake:** this draft plus the verified SPM/source and site inventory; cluster remaining author choices and perform targeted current-source/link checks.
- **Bounded implementation candidate:** after metadata signoff, produce risk-classified exact-source site ticket for new essay, one pre-seal independent review, and proposed preauthorized isolated-candidate→closed-staging flow. Stage/render QA includes seven unique aside IDs, 20 references/23 outbound citations, TOC, metadata, OG, search/robots, first route-history and mobile.
- **Independent production gate, within Sprint 26:** after staging evidence, separately approve a bounded `main` RELEASE ticket, verify actual live article/indexing and unmodified five production scholarly PDFs, and only then close this content sprint. This is a distinct authorization **not a separate sprint**. Failures mean BLOCKED, never publication.

## Sprint-level acceptance criteria, validation and exit
Author-approved public metadata and source fidelity; trusted Astro/schema/links/semantics/indexing builds PASS; no leaks, collisions, unintended scholarly PDF/DOI/Highwire; staging site content and mobile readability checked; exact live production output independently verified with article routing, citations, social/metadata and five untouched frozen PDFs. Record observed versus reported evidence, and append shipped outcome to CHANGELOG and remove superseded priority from ROADMAP. **Only a verified live new essay closes Sprint 26.**
STOP for unapproved metadata/normalization, authorial fact disputes, source SHA/branch drift, renderer defect, privacy/indexing change, failed builds, protected PDF mutation or unexpected release effect. No prospective sprint seal, site edit, task ticket, stage push or production deployment is authorized by this PROPOSED plan. No fixed dates.

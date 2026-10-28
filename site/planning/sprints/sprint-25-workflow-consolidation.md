# Sprint 25 — Workflow consolidation

Status: EXECUTING — T25.0/T25.1 CLOSED; T25.2 docs-only ACCEPT WITH FOLLOW-UP; T25.3/T25.3a audits ACCEPTED; owner expanded exit to corpus-wide review, three production article outcomes, reusable update/new-entry procedures, and fourth independent test (2026-10-28); T25.4 corpus audit DRAFT, not sealed
Risk: R0 for proposed T25.4; later product releases/technical extensions have independent risk classifications, review and prospective seals (previous R2 planning ceiling is not blanket authority for releases)
Branch: planner/context for planning and audit; implementation branch set per approved ticket
Depends on: accepted T24.0 + T24.1 release, main @ 9697dbc7310c480d4b6349104e9504107e4341a2
Unlocks: portable role handoffs, consistent author-owned primitives, verified corpus updates and a repeatable new-entry-to-production workflow

## Core question
Can fresh agents reliably author, audit, update and publish research content under author-controlled primitives and verifiable release gates, demonstrated on the existing corpus and real production articles?

## Outcome
Owner-approved sprint finish line (2026-10-28): maintain the manuscript/primitive authoring contract and SPM handoff; audit all existing research content consistently; author-approve and release warranted revisions; publish FAFSA v2.4, The Lab Bubble, and an accepted Chisel paper/IWL state to production; document both update and new-entry workflows; then test on a fourth independent article. Earlier accepted audit results are inherited; every edit, staging action, production push, DOI/PDF action and publication decision requires a later exact-scope authorization.

## Inherited truths
- Inherits: site/PLANNING.md @ 9697dbc7310c480d4b6349104e9504107e4341a2 — roles, source ownership, gates and proportionality.
- [Planner README](../../../planner/README.md) owns branch separation and continuity practice.
- [T24 checkpoint](../../../planner/checkpoints/2026-10-20-t24-release-workflow-next.md) records release acceptance and evidence provenance.
- [Decision checkpoint](../../../planner/checkpoints/2026-10-21-sprint-25-planning-model.md) records the owner's agreed planning direction.

## Hypotheses to test
- Final authored Markdown removes upload-time editorial decisions.
- State plus relevant checkpoint/assets is sufficient for fresh-session recovery.
- Exact-revision reviews and linked CI evidence reduce reconstruction and repeated checks.
- Supported content runbooks can be clarified without first rewriting the PDF pipeline.
- The [inventory](../audits/sprint-25/optimization-inventory.md) is a candidate list, not a commitment to fix each row.

## Hard constraints
- Proposed packages do not grant execution authority; later detailed tickets follow T25.0 evidence.
- One canonical manuscript contract; CONTENT-MODULES continues to own renderer grammar.
- Larger new-paper/Desk/PDF mechanisms remain separately scoped when current capability is insufficient.

## Explicit exclusions and authority boundaries
- This sprint plan does **not itself authorize** prose edits, author acceptance, a metadata decision, any site source write, staging push, `main` promotion, Cloudflare/Actions deployment, Zenodo operation, PDF replacement or release-variable change. Each needs its own ticket, review, seal and approval gate.
- The earlier T25.0–T25.3a nonpublishing and docs-only exclusions remain binding **to those sealed tickets**, not to separately authorized later Sprint 25 releases.
- No new primitive types/visual systems, CMS, memory machinery, automated reviewer orchestration, indiscriminate artifact regeneration or shared identity-policy changes. New-paper/PDF extensions require independent technical scope and preservation proof.
- No claim that all articles must contain primitives, or contain fixed counts. Meaning, authored voice, citations and historical release provenance have priority over numerical consistency.

## Scope evolution — Lab Bubble and real corpus releases

The earlier Lab Bubble pilot was authorized as editorial preparation only; its V2.6.3 source is now author-approved, while date, final excerpt/description and label decisions remain open. On 2026-10-28 the Product Authority elevated **FAFSA v2.4, The Lab Bubble, and Chisel paper/IWL** to explicit production-grade Sprint 25 outcomes and added a site-wide primitive/quality audit and one further independent article test. This supersedes the sprint's *future target*, not the scope of old sealed tickets. No prior audit, fixture or research handoff grants a production release.

## Ticket sequence
T25.0/T25.1 are closed. T25.2 [contract](../../MANUSCRIPT-CONTRACT.md) v1.0 and [sealed R1 ticket/completion record](../tickets/T25.2-publish-ready-manuscript-contract.md) were executed at `c1fad33`, corrected narrowly at `5e85af7`, then [Planner-accepted with follow-ups](../audits/sprint-25/T25.2-planner-review.md) on 2026-10-27. Notes-branch delivery is complete, but selective promotion to production docs, fresh-agent validation and remaining packages are separate. T25.3 executed @ `538c712` and reported C1–C8 PASS; Planner initially found E1/E2 evidence gaps. T25.3a executed @ `6fc0006`, providing pinned skill verification and recovered original-scratch evidence; Planner ACCEPTED both bounded R0 audits, with non-durable scratch limitations recorded below. Other remaining rows are provisional packages, not reserved ticket numbers.

| Ticket / package | Mode | Purpose | Depends on | Gate |
|---|---|---|---|---|
| [T25.0 sealed audit](../tickets/T25.0-workflow-consolidation-audit.md) | AUDIT | Report delivered at 4bb4f6f; [Planner review](../audits/sprint-25/T25.0-planner-review.md) | Sealed 2026-10-21 | Accepted by Planner and owner |
| [T25.1 closed packet](../tickets/T25.1-continuity-and-owner-guide.md) | DECISION | Stable entry points and the owner's one-page Git/cloud guide on planner/context | T25.0 acceptance | Accepted at 74624d2; main promotion separate |
| [T25.2 manuscript contract](../tickets/T25.2-publish-ready-manuscript-contract.md) | DECISION / R1 | Final MD interface, upstream authoring-guide handoff and skill reconciliation (docs-only) | T25.0/T25.1 and authoring design | Planner ACCEPT WITH FOLLOW-UP 2026-10-27 @ `5e85af7`; notes-branch complete; production promotion deferred |
| [T25.3 intake handoff trial](../tickets/T25.3-nonpublishing-intake-handoff-trial.md) | AUDIT / R0 | Fresh Executor recovery and manual clean-source/negative-case trial; report only, no runtime oracle | T25.2 acceptance and a fresh owner-selected session | Planner ACCEPT 2026-10-27, read with T25.3a and stated limits |
| [T25.3a corrective evidence](../tickets/T25.3a-corrective-evidence-supplement.md) | AUDIT / R0 | Direct pinned-skill read and provenance-labeled C3–C6 specimens | T25.3 evidence gaps | EXECUTED @ `6fc0006`; Planner ACCEPT 2026-10-27 |
| [T25.4 corpus primitive/quality audit](../tickets/T25.4-corpus-primitive-audit.md) | AUDIT / R0 proposed | Read-only six-article + Chisel-IWL baseline and per-article recommendations | T25.3/T25.3a accepted; owner expanded Sprint 25 exit | DRAFT for independent pre-seal review; no audit executed |
| Fresh-session continuity demonstration | VALIDATION | Test a new Planner using the new entry path, with actual evidence and limits | T25.1 | Record recovery; do not equate review exchange with full SPM validation |
| Manuscript validation, if earned | VALIDATION | Enforce gaps that existing checks do not cover | Approved contract | Risk-appropriate proof |
| Release evidence and operator handoff | DECISION | Authenticated evidence retrieval and exact-SHA release packet | T25.0 | Capability demonstrated |
| Existing-update and new-entry runbooks | DECISION | Supported cases, prerequisites and limitations | Contract and release handoff | Flow walkthroughs accepted |
| Canonical documentation reconciliation and selective promotion | DECISION | Reconcile ROADMAP/CHANGELOG/AGENTS/PUBLISHING/skill and promote accepted notes/guide through an approved batch | Accepted packages | Current claims agree; no rewrite of history or status-only deploy |
| Technical extensions, if needed | — | Scope independently risky pipeline work separately | Tested limitation | New owner decision |

Adjacent low-risk documentation packages may share a ticket where inherited policy supports it.

## Sprint-level acceptance criteria
These are proposed full-sprint targets, subject to T25.0 evidence and owner-approved scope refinement; they are not commitments granted by this packet.
1. A fresh session identifies the current objective, authority, unknowns and next gate from repository links; record evidence and limits.
2. A reviewer submits attributed findings against an exact revision; Planner disposition and Executor handoff are traceable.
3. Sprint plan owns work sequence, STATE points to the current position, and affected canonical instructions agree.
4. A maintained manuscript contract covers supported metadata, primitive/emphasis boundaries, citations, optional IWL and allowed integration; editorial decisions stay upstream.
5. **Inventory audit:** All six research articles on verified `main` and the Chisel IWL are assessed against the new primitive/intake/reading guidelines, with per-item PASS / TECHNICAL DEFECT / EDITORIAL CANDIDATE / INTENTIONAL EXCEPTION; zero primitives is valid where reasoned, and a numerical quota is forbidden.
6. **Author-controlled corrections:** Actual semantic/primitive/placement/emphasis improvements are drafted by a prose/editorial agent, reviewed as a whole by the Product Authority, and only then handed to a non-editorial website Executor. Defects are fixed and warranted improvements shipped; no mass automatic rewriting or version-history erasure.
7. **Three production outcomes:** FAFSA v2.4 revised paper (including approved frozen-PDF/version custody), The Lab Bubble as new essay (approved metadata and clean public projection; no PDF), and Chisel's paper plus IWL at accepted production grade (review existing state and publish an update only where author-approved). Each must have attributable staging, release approval, `main`/deployment and postrelease verification evidence.
8. **Repeatable procedures:** Maintain a usable prose-agent/primitive authoring document; existing-article revision, new essay, and new scholarly-paper runbooks including metadata/DOI/PDF/IWL branches, failure/rollback gates, and cited source identity. Test one further article independently after the first three; prefer a new scholarly paper to expose the sixth-PDF limitation. Any fourth production release is separately approved and not assumed by this test target.
9. **Evidence and promotion:** Canonical docs and actual release artifacts agree; approved code/docs selectively promoted; original source, version and published-PDF histories preserved. Do not claim a production-capable new-scholarly-paper path merely because an essay was published. No invented time savings.

The immediate handoff pilot is narrower: an exact-revision review plus an actual fresh-session recovery. The review exchange is verified; the audit reports one Executor recovery and authenticated access result. General fresh-Planner recovery remains unverified.

## Validation plan
- T25.0: current-source inspection, existing evidence and document/diff checks, without build or deployment.
- Use the [review entry point](../audits/sprint-25/README.md) for the owner-selected session; record what was actually demonstrated.
- Later validation scope derives from source/body/emphasis/order/anchor/citation fidelity and actual missing checks.
- Existing PDF rendering/preservation checks continue to apply when publication work occurs.

## Stop conditions
Return for a scope decision if a runbook requires unsupported technical behavior, required access is unavailable, or work exceeds the proposed R2 ceiling.
Inherited stop conditions apply by reference.

## Exit state
All six baseline research entries plus the Chisel IWL have a recorded audit disposition; warranted author-approved remedies are verified on production or explicitly accepted as intentional nonchanges. FAFSA v2.4, The Lab Bubble and Chisel paper/IWL meet the three real production gates with verified release evidence. The two update/new-entry procedures and primitive guide are accurate and usable, and a fourth independent manuscript test records repeatability and any unsupported scholarly-PDF case. Separately authorized technical extensions must be completed before claiming capability they enable; no extra deploy merely to record status.

## Canonical documentation targets
- Planner README/STATE/checkpoints: procedure, resume pointer and rationale respectively.
- HANDOFF: orientation; ROADMAP: active/deferred index; CHANGELOG: verified history.
- PUBLISHING: flows; CONTENT-MODULES: grammar; AGENTS: operations; content-manager skill: concise adapter.
- Proposed site/MANUSCRIPT-CONTRACT.md: maintained input interface/editorial guide; exact placement follows audit.
- PLANNING/templates only if an evidence-earned process amendment is separately approved.

## Review disposition
[Grok's original review](https://github.com/amulbham/cybernetics-mbp/blob/ff45b4f23fd057e7fc4ba9c1017aa64a534f3e36/site/planning/audits/sprint-25/sprint-plan-review-grok-2026-10-21.md) assessed revision 1 @ 5807038.
[Planner disposition](../audits/sprint-25/review-disposition-2026-10-21.md) records both REQUIRED corrections and the OPTIONAL decisions.
Revision 2 has not received a separate Grok approval. No independent reviewer is invoked automatically.

## Audit outcome and next scope
T25.0 report @ 4bb4f6f is accepted with follow-up at Planner review and accepted by Product Authority on 2026-10-21.
[Planner qualifications](../audits/sprint-25/T25.0-planner-review.md) preserve historical/current settings distinctions, workflow_dispatch, and branch artifact custody.
A new-paper mechanism is needed before a real new scholarly publication, not before the non-published example or this documentation work.
Broader current-state corrections in ROADMAP/AGENTS/PUBLISHING/skill and CHANGELOG remain candidates for a later approved canonical batch.

## T25.1 acceptance and remaining coverage — 2026-10-21
Product Authority accepted the corrected guide and entry documents as the initial usable baseline. [Progress checkpoint](../../../planner/checkpoints/2026-10-21-sprint-25-progress-and-remaining-scope.md) maps the remaining owner goals.
Notes-only improvements are not promoted to main. Authenticated run/log reading and notes-branch push worked; settings reads were blocked in the tested session and full cloud PDF build remains untested.
The manuscript contract, primitive guide/example, portable prose-agent input, Executor instruction reconciliation, missing validation, both publishing flows, release preflight/evidence and canonical-document correction batch remain in scope for earned packages.
Branch/governance reconciliation is an explicit decision if needed, not automatic TP2 promotion. Generalized new-paper/Desk artifacts remain separately authorized R3 work before those publications.

## T25.3 sealed scope — 2026-10-27
Product Authority prospectively sealed the corrected T25.3 draft at approved pre-seal `planner/context @ 7a5367379644ac8efcad9e7d16eca6cb71f52955` after a focused Planner recheck. The sealed audit tests a genuinely fresh Executor's nonpublishing intake behavior using the pinned Lab Bubble source and synthetic zero/malformed/combined cases. AUDIT / R0 is intentional: no persistent validator/build wiring is authorized. The trial does not replace separate fresh-Planner recovery, fresh prose-agent, FAFSA/Chisel, rendering or release gates. No trial has run; execution must start from the full seal commit SHA supplied in the handoff. Disposition stays with the Planner.

## T25.3a evidence supplement — 2026-10-27
Product Authority prospectively approved the narrow E1/E2 corrective audit after T25.3 completion @ `538c712`. Original ticket and report must not change; new verification cannot masquerade as original scratch. At the time this seal was recorded, T25.3a had not run; it subsequently executed @ `6fc0006` and passed Planner review as recorded below.

## T25.3 / T25.3a Planner acceptance — 2026-10-27
- **Disposition: ACCEPT both bounded R0 audit deliveries.** T25.3 [evidence](../audits/sprint-25/T25.3-intake-handoff-trial.md) @ `538c712c23ed793c4193cae8a9ef75f1ddd0d0a1` reports C1–C8 observed success; Planner independently confirmed its one fast-forward, two authorized paths, untouched `main`/`staging`, and source references. T25.3a [supplement](../audits/sprint-25/T25.3a-evidence-supplement.md) @ `6fc0006ab1285101ee860459797897cebe9ba158` records a pinned skill read without contradiction, recovered original C3–C6 scratch with reported hash matches, and C5/C6 rechecks. Planner independently confirmed the two-path corrective commit and unchanged original T25.3 report/ticket blobs.
- **Evidence limit:** the recovered originals were in a shared untracked `/tmp` directory, not Git-tracked durable fixtures. The supplement's checks are traceable Executor observations; Planner did not independently read the temporary bytes through GitHub. Do not generalize to automated extractor enforcement, rendered output, fresh-Planner recovery, repeated-model equivalence, time-savings or publication approval.
- Closure is a Planner decision on the accepted workstream; original tickets and original audit evidence remain as sealed historical records. No production branch, workflow or release has been changed by these audits.

## Previously proposed package — nonpublishing manuscript-validation evidence (not authorized; sequenced after baseline inventory audit)
**Purpose:** Check the upstream prose-agent authoring/handoff workflow beyond the developer-intake audit, then determine whether a persistent manuscript preflight validator is actually earned. Initial gate should be a narrow nonpublishing audit/validation trial, not an implementation ticket or automatic deployment.
- **Inputs:** pinned research `MANUSCRIPT-AUTHORING.md` v0.2 and `meta/examples/primitive-worked-example.md` v0.1 @ `bec57c4d05aa41e1fcf9d261251b9ae72322c94a` (drafts, not global standards); FAFSA v2.4 *working* manuscript (18 proposed callouts, not author-approved for publication), Chisel as a distinct existing-entry diagnostic (nine callouts, including adjacent pairs), and the accepted website intake contract on `planner/context`. Confirm exact current source refs and author/approval state before any test.
- **Proposed checks:** have a fresh prose-agent use the guide on a bounded, nonpublic excerpt/candidate and produce a handoff with source attribution and honest pending decisions; verify that callout kind/placement, optional anchors, inline bold/italic, heading order, references/citations and optional abstract are author-owned. Use FAFSA for primitive-density/meaning diagnosis and Chisel for adjacent-callout/placement diagnosis; no unapproved rewrites to real manuscripts. Contrast a valid zero-primitive case and a malformed intended primitive with correct fail-closed reporting. Verify developer preservation of an explicitly approved test fixture without inventing metadata. Keep original versus test-generated bytes separate.
- **Evidence and stop gate:** exact input revisions, role/agent initial context, source-vs-candidate diffs, observed pass/fail, and which checks are human/manual versus implemented. No writing to live research or site content, no Astro/PDF/CI run or publication under this proposal. If evidence shows a material unguarded failure, return to Product Authority with a separately scoped risk-appropriate validator decision; otherwise advance to release/evidence runbooks without building speculative automation. A future detailed ticket requires its own review and prospective seal.

## 2026-10-28 Product Authority acceptance revision — corpus quality and production outcomes
**Primary objective:** stop at neither documentation nor synthetic intake tests. Establish an evidenced, reproducible editorial-to-website release system and use it for real content. The first new action is the read-only [T25.4 corpus audit DRAFT](../tickets/T25.4-corpus-primitive-audit.md), not execution or cleanup.

**Current source inventory @ `main 9697dbc7310c480d4b6349104e9504107e4341a2` (six research entries):**
| Existing entry | Source-labeled primitive inventory | Audit focus |
|---|---:|---|
| The Desk Is Where You Write It Down | 4 | Deep editorial coverage/placement review, including whether framework transitions merit author-owned primitives; preserve its frozen publication identity/PDF |
| Three Self-Organizing Systems | 0 | Determine whether zero is the correct authored treatment; no quota or automatic additions |
| The Invariants of Self-Organizing Systems | 5 | Coverage, evidence-label truthfulness and placement |
| How Frontier Model Training Became a Public Utility | 5 | Coverage, definitions, sourced Evidence and reading flow |
| The Chisel Fallacy | 9 | Four adjacent primitive pairs and accompanying published IWL; author-owned approved changes, if any |
| An Engineer's Guide to Structural Financial Aid Exploits (FAFSA) | 11 | Compare to working v2.4's **18 proposed** primitives; v2.4 is not yet publication-approved |
Counts are a source-level structural baseline, not quality grades; they do not include implicit blocks or ordinary emphasis. The inventory audit also examines the Chisel public IWL for article/ledger continuity, while not treating it as a seventh research article.

**One canonical editorial decision boundary:** the prose agent may propose new/repositioned/revised/deleted primitives using the authoring guide; it must provide exact source identity, proposed full integrated Markdown, rationale and pending decisions. Product Authority approves the whole manuscript. The website Executor preserves approved bytes/wording/placement/anchors/citations and must refuse unapproved guesses. Clean manuscript + optional handoff and bounded combined-file inputs remain permitted, but an unverified combined source is never copied directly into the site. The technical audit can identify malformed grammar, citation/reference/metadata issues, leakage and source-to-render drift; editorial assessment judges intellectual utility without quotas.

**Release cases and gates:** FAFSA v2.4 = existing published scholarly paper revision with original `pubDate`, frozen PDF and approved artifact/version protocol; The Lab Bubble V2.6.3 = new `essay` in `ai-systems`, editorially approved but missing final publication date, excerpt/description approval and bibliography-label decision; Chisel = existing scholarly paper + published IWL/DOI, review and release only the author's accepted revision (a no-change assessment may preserve identical production bytes). Every live change requires staging review, exact owner approval, selective `main` promotion, Actions/deployed-URL verification and PDF/DOI custody where applicable.

**Fourth independent acceptance test:** prefer a different **new scholarly paper** to challenge the currently unsupported sixth PDF / five-line PDF manifest release mechanism; a production release is conditional on a separately authorized technical implementation and owner publication approval. Mere new-essay success does not validate new-paper capability; if still unsupported, report the failing exit criterion instead of claiming full completion.

**Next sequence:** read-only T25.4 audit and evidence → independent Planner review/owner prioritization → upstream prose-agent manuscript/primitive validation and integrated author approvals → specific remediation and article release tickets with distinct risk/deploy gates → fourth independent test → runbooks, canonical promotion, and sprint exit acceptance. No downstream tickets are pre-created. Historical ticket results and non-durable T25.3a scratch limitations stand unchanged.

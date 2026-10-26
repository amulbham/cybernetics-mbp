# Planner state — research website

Snapshot: 2026-10-26 (America/Los_Angeles).
Primary intent: scope T25.2, the publish-ready manuscript contract. T25.0 and T25.1 are closed.

## Resume
Use the [review/task entry](../site/planning/audits/sprint-25/README.md).
Next gate: review the [research authoring guide v0.2](https://github.com/amulbham/amulbham-research/blob/bec57c4d05aa41e1fcf9d261251b9ae72322c94a/MANUSCRIPT-AUTHORING.md) and its [synthetic worked example](https://github.com/amulbham/amulbham-research/blob/bec57c4d05aa41e1fcf9d261251b9ae72322c94a/meta/examples/primitive-worked-example.md); then run bounded FAFSA/Chisel nonpublishing reviews and obtain author acceptance before scoping website T25.2 intake contract. [Latest Sprint 25 progress checkpoint](checkpoints/2026-10-21-sprint-25-progress-and-remaining-scope.md) maps remaining owner goals; no T25.2 ticket is sealed.

## Current decisions and evidence
- **Lab Bubble live pilot — two local promotions approved 2026-10-26:** author approved Definition callouts for Lab Bubble and Dogfood Validity, **and explicitly requires full publication-ready treatment before going live**. Research branch `papers/the-lab-bubble-spm-init @ c7e100ac767bb14f2c69df0104d04e190bc46399` contains a [full-text candidate](https://github.com/amulbham/amulbham-research/blob/c7e100ac767bb14f2c69df0104d04e190bc46399/papers/the-lab-bubble/editorial/candidates/v2.6.2_t25.2-reading-treatment-candidate.md) with exactly those two reversible promotions, plus [publication-package handoff](https://github.com/amulbham/amulbham-research/blob/c7e100ac767bb14f2c69df0104d04e190bc46399/papers/the-lab-bubble/editorial/t25.2-publication-package-handoff.md), IWL-003 and STATE. Canonical V2.6.2 `assets/manuscript.md` Git blob `687bc7e` **unchanged**; source has 9 sections and 20 references. **Still working, not complete editorial approval or publication-ready**. Next: holistic primitive/emphasis/prose review, entire source/citation verification, metadata decisions, developer intake, separate live staging/production authorization. `essay` / `ai-systems` is proposed only; paper path would need new PDF handling. FAFSA/Chisel bounded tests still pending.
- **T25.2 design approved 2026-10-23:** authoritative research-side [manuscript authoring design checkpoint](https://github.com/amulbham/amulbham-research/blob/9a60df077ddbb3b48fd6bf956aaf4e919e45a376/meta/checkpoints/2026-10-23-manuscript-authoring-design.md) at exact commit `9a60df077ddbb3b48fd6bf956aaf4e919e45a376` on dedicated branch `workflow/manuscript-authoring-t25-2` (created from research `main @ 7231414`). Approved ten-section outline; five existing primitives plus bold/italic; coverage not quotas; author-owned placements; combined or separate authoring package with a validated clean-publication boundary; optional abstracts; editorial vs publication readiness; FAFSA and Chisel are tests only. Guide **v0.2 and example v0.1 drafted on the research working branch** at `bec57c4d05aa41e1fcf9d261251b9ae72322c94a`; both **await author approval and actual agent/case tests**. Website intake contract **not drafted or sealed**, combined-file extraction enforcement **not implemented**, and manuscript publication **not authorized**. Later research-branch reconciliation is user-controlled.
- T25.1 correction @ 74624d2240bd86fae4a0b9b1a6cdb7b74b51ea4a accepted by Planner and owner as a usable baseline. [Owner guide](../site/OPERATOR-GUIDE.md) is maintained from here; full fresh-session usability is not claimed.
- [Audit report](../site/planning/audits/sprint-25/T25.0-current-state-audit.md) committed by Executor at 4bb4f6f866f3a5883748ea659da5672113559be7.
- [Planner review](../site/planning/audits/sprint-25/T25.0-planner-review.md): ACCEPT WITH FOLLOW-UP; independently verified report-only commit, 26 IDs and key source claims.
- Product Authority accepted T25.0 and T25.1 on 2026-10-21; both are closed. Broader canonical corrections/promotion remain separate.
- [Sprint plan](../site/planning/sprints/sprint-25-workflow-consolidation.md) owns proposed work order; no later manuscript/validator/release implementation is authorized.
- [Grok disposition](../site/planning/audits/sprint-25/review-disposition-2026-10-21.md) and [decision checkpoint](checkpoints/2026-10-21-sprint-25-planning-model.md) retain prior rationale.
- Role/branch authority: [Planner README](README.md) and its canonical references.

## Production and limits
- Main 9697dbc7310c480d4b6349104e9504107e4341a2; staging 043e351f00f6834a053847209caca4749941e91d, freshly checked 2026-10-21.
- T24 accepted; [release checkpoint](checkpoints/2026-10-20-t24-release-workflow-next.md) owns evidence and documentary lag.
- Audit session authenticated run/log reads and report push worked; settings reads were blocked in the tested session, and the full cloud PDF build remains untested.
- A prior run is historical evidence, not proof of current variables. New-paper/Desk mechanisms are needed before those releases, not before drafting guides/examples.
- Fresh Executor recovery is one reported data point; general Planner recovery, model equivalence and measured time savings are unverified.
- Chisel external Zenodo/DOI completion remains owner-managed/unverified.

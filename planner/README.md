# Planner workspace — continuity protocol v1

Status: **APPROVED** by the Product Authority, 2026-10-18. Scope: the `amulbham/cybernetics-mbp` research website.

**Purpose:** preserve useful context across fresh Planner chats without copying entire conversations into the repository and without turning working hypotheses into product policy. This directory is a **working memory and provenance layer**, not a second source of architecture or execution authority.

## Where information lives

| Surface | Owns | Treatment |
|---|---|---|
| Root `HANDOFF.md` | Durable entry point: release snapshot, provenance, repo map, branch pointers | Refresh at meaningful milestones; deployed truth must be rechecked |
| `planner/STATE.md` | Short, mutable active Planner state (objective, approvals, blockers, next action) | Update on `planner/context`; ideally under 150 lines |
| `planner/checkpoints/YYYY-MM-DD-topic.md` | Selected discussion/decision snapshots, assumptions, rejected options and rationale | Append new checkpoint, don't silently rewrite old conclusions |
| `planner/assets/` | Occasional explicitly approved verbatim copy/content packets for an upcoming ticket | Source editorial decisions to reference; **not** a sealed executor authorization |
| `site/ROADMAP.md` | Current and deferred product work | Canonical after approved promotion |
| `site/PLANNING.md`, `site/planning/` | Formal risk process, prospective seals, sprint/ticket contracts, evidence and closure | Never overridden by a Planner checkpoint |
| `site/AGENTS.md`, `site/PUBLISHING.md`, code, deployed artifacts | Current technical and publishing behavior | Canonical within their respective scopes |
| `site/CHANGELOG.md` | Verified historical outcomes | Add later history, do not rewrite old entries |

This follows the source-of-truth and promotion rules in `site/PLANNING.md` §3. A working-note approval does **not** seal a ticket, deploy code, or override a later contradictory verification result.

## Branch strategy — avoid involuntary production deployment

- **`main`** is the source and deploy branch for the live site; a push triggers a full Cloudflare publication pipeline. **`staging`** also deploys. Do not use either for routine Planner checkpoints.
- **`planner/context`** is the long-lived working-memory branch. Commit `planner/STATE.md` and `planner/checkpoints/` there when useful. It does **not** trigger the configured site workflow, which listens to `main` and `staging` only.
- **`docs/launch-handoff-2026-10-16`** is the historical initial release-documentation branch. PR #1 was closed without merge as superseded by the combined S6 release at `main @ 5bf8518`; its branch/history are retained. Read current main for deployed source.
- No automatic whole-branch promotion from `planner/context` to `main`. Promote selected verified/approved changes deliberately into canonical files as a scoped PR/ticket. Don't merge `staging` wholesale into `main`.
- A later release may leave `planner/context` behind `main` for code. Read live `main` separately, and periodically reconcile only documentation pointers. A branch name is not a proof of freshness.

## Boot procedure for every fresh Planner chat

1. Open root `HANDOFF.md` on current `main` as an orientation snapshot. Use `planner/README.md` and **`planner/STATE.md` from `planner/context`**, plus its latest relevant checkpoint, for later working context. PR #1 is closed/superseded; do not wait for it to merge or default to its historical branch. Recheck main before treating a snapshot as deployed truth.
2. Check remote heads for `main`, `staging`, `planner/context`; recent deploy runs and open relevant PRs. Distinguish reported production checks from independently examined ones.
3. Read `site/ROADMAP.md`, `site/AGENTS.md`, `site/PLANNING.md`, `site/PUBLISHING.md` and the relevant ticket/code from the branch where each actually exists. Retrieve **only relevant** dated checkpoints; no need to ingest the entire archive.
4. Summarize in five short categories: verified state, Product Authority approvals, unresolved/unverified claims, current objective, proposed next action. Ask one question only if a decision is essential.
5. Plan and review normally. Do not assume GitHub state from a checkpoint is still current. Do not push or deploy without appropriate approval.

## Checkpointing and promotion

- Create a checkpoint after a **meaningful cluster** of decisions, a review with consequences, an earned finding, or a session handoff — not after every turn. Suggest one when context risks becoming difficult to recover; wait for the Product Authority to approve it unless explicit standing write permission is granted.
- Keep each checkpoint concise (~40–120 lines when possible): date, context/goal, exact source refs or commit heads, key decisions and rationale, alternative rejected/deferred, verification status, unresolved questions, next actions, promotion candidates.
- Mark claims **VERIFIED** (evidence inspected), **APPROVED** (Product Authority decision), **PROPOSED** (not authorized), **UNVERIFIED** (report/claim not independently established), or **SUPERSEDED** (later evidence/decision). A decision may be APPROVED while implementation remains UNVERIFIED.
- Write working updates to `planner/context` only. Treat checkpoint files as dated snapshots; explain later corrections in a new dated checkpoint or explicit addendum. `STATE.md` is the intentionally mutable summary.
- Promote only earned truth to its **canonical home** after verification and Product Authority approval; preserve source references back to checkpoint/ticket/commit. If closure requires an implementation ticket, obey seal-before-execution. Keep source policy and runtime behavior out of `planner/STATE.md`.
- Store **no secrets, credentials, private account content, personal health or financial details**, or full private chat logs in this Git repository.

## End-of-session checklist

- Is `planner/STATE.md` accurate about the current objective, branch heads **as checked**, approvals, blockers and next action?
- Is a new checkpoint warranted to preserve hard-to-recreate reasoning?
- Did an approved, verified finding need promotion to `site/ROADMAP.md`, `site/AGENTS.md`, `site/CHANGELOG.md`, a ticket, or code?
- Can a fresh chat resume with a short boot prompt and `HANDOFF.md` + `planner/STATE.md` without consulting this conversation?

## Sprint 25 planning and review pilot — 2026-10-21

Product Authority approved trying repository-mediated handoffs. Role authority remains in site/PLANNING.md §2.
The [review entry point](../site/planning/audits/sprint-25/README.md) contains task retrieval, review submission and role prompts.
The [sprint plan](../site/planning/sprints/sprint-25-workflow-consolidation.md) owns proposed work sequence; STATE points to the current gate.
For this pilot, update related artifacts and STATE in a coherent milestone commit after checking branch freshness.
No additional execution authority follows from this adapter.

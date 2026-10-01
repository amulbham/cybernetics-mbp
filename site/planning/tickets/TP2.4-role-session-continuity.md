# TP2.4 — Role-session continuity: proactive rotation without automatic compaction

Status: READY (sealed; contract is rev 2)
Mode: IMPLEMENTATION
Risk: R1
Branch: staging
Depends on: TP2.3 CLOSED (`staging @ 5ff46aa`)
Unlocks: nothing drafted (`project:status` and hooks come later, and they don't depend on this ticket)
Inherits: `PLANNING.md` §2 and §13 @ `5ff46aa`; `planning/templates/ticket-contract.md` @ `5ff46aa`
Authorized paths: `site/PLANNING.md`, `site/CHANGELOG.md`, `site/planning/tickets/TP2.4-*.md`
Authorized local paths (Amul's machine, outside the repo): `AI-Orchestrator\README.md`, `AI-Orchestrator\planner-handoff.md`, `AI-Orchestrator\executor-handoff.md`, `AI-Orchestrator\scratch\` (drill worktrees, logs, backups)

## Goal
Planner and Executor are logical roles whose lifetime may exceed one physical conversation. Continuity comes from repository and worktree state plus a bounded explicit handoff, never from automatic compaction.

## Why now
This Planner thread has already been through one automatic compaction. Its continuity then rested on a lossy summary the protocol doesn't recognize. TP2.3's executor also stopped partway at a usage limit, and the resume worked only because the same session came back. Nothing in `PLANNING.md` §2 (`:22-58`) says a role may span sessions or how a replacement session recovers authority.

## Starting state
- `PLANNING.md` §2 defines the roles (`:22-58`) and says nothing about session lifetime or continuity.
- `AI-Orchestrator\` holds `review.ps1`, `summarize.ps1` and `README.md` from TP2.3. It has no handoff files.
- Reviewers are one-shot sessions (`pre-seal-review.md`).

## Decisions already frozen
- **§13 one-intent: Product Authority re-scope for TP2.4** (Amul, 2026-10-01, decision card), on the same footing as TP2.3.
- Amul, 2026-10-01: one ticket covering both roles. It is a single runtime problem: physical conversation lifetime is shorter than logical role lifetime.
- `PLANNING.md` gets only the vendor-neutral rule. Thresholds, filenames and measurement commands live in `AI-Orchestrator\README.md`.
- Live handoffs are ephemeral, sit outside the repo, and are overridden by repository truth. Templates under `AI-Orchestrator\templates\` and version control for `AI-Orchestrator` are deferred to the versioning decision.
- Reviewers get no handoff mechanism.

## Questions this ticket may answer
- How does each role measure its own context use? `/context` works in a CLI session (Planner-run check, TP2.1 closure). The ticket records what works for a Remote Control session and for a Projects thread session. Where nothing works, the README names the fallback trigger (natural boundaries, or the first compaction warning). Record the answer; don't build tooling for it.

## Scope
1. **`PLANNING.md` §2: add `### Session continuity`** after the line "Tool bindings for each role live in the orchestrator's configuration, not in this protocol." (`:53`). Starting text, Amul's wording:
   > Planner and Executor roles may span multiple physical sessions. Before context compaction becomes necessary, the active role must produce a bounded handoff and stop. A replacement session independently recovers authority from repository state before continuing. Planner handoffs may carry transient planning state; Executor handoffs may carry execution progress only and never expand or reinterpret the sealed contract. Conversation summaries and automatic compaction are not project authority.

   Reviewers are not covered. No thresholds, filenames or tool names.
2. **`AI-Orchestrator\planner-handoff.md`: template for live use.** Banner: "EPHEMERAL PLANNING STATE: repository truth overrides this file." It has only these sections:
   - verified refs (staging and main SHAs, the active branch);
   - current primary intent;
   - active sprint and ticket state;
   - frozen decisions needed for immediate continuation;
   - open findings;
   - pending Product Authority decisions;
   - short-lived calibration observations;
   - next exact action;
   - required canonical boot reads;
   - explicit non-goals;
   - required recovery (Scope 4a).
   It points to files and SHAs and never copies contracts or architecture.
3. **`AI-Orchestrator\executor-handoff.md`: template for live use.** It follows Amul's skeleton (plan notes, "TP2.4 design inputs"). Banner: "EPHEMERAL EXECUTION STATE: the sealed ticket and repository/worktree are authoritative." Sections:
   - Identity: ticket path, seal commit, branch, worktree, current HEAD;
   - Execution state: completed, active and untouched scope items;
   - changed files;
   - verification already run (command → result);
   - known failures and unresolved facts;
   - stop conditions encountered;
   - working-tree state and uncommitted files;
   - next exact action;
   - required recovery (Scope 4b);
   - Do not: reinterpret scope, modify the ticket contract, add unauthorized paths, reset or discard prior work without evidence, push `staging` or `main`.
4. **`AI-Orchestrator\README.md`: a "Session rotation" section** containing:
   - Rotation policy: below 50% context, normal operation. At 50–60%, finish the current bounded step and don't begin another major phase. At 60%, write the role handoff, stop, and start a fresh role session. Rotate earlier at clean natural boundaries.
   - The per-role measurement source found under Questions. A warning-based fallback trigger is allowed only if a test shows it leaves room to write a handoff. Otherwise the fallback is rotation at natural boundaries.
   - After an automatic compaction has already happened: the session treats its own recollection as non-authoritative, writes the handoff only from repo-verified state, and rotates.
   - **a. Fresh Planner recovery:**
     1. read the handoff;
     2. `git fetch`;
     3. verify the refs independently;
     4. do the repository-mandated boot reads (root `CLAUDE.md`: `ROADMAP.md`, the active sprint contract, the active ticket) and the handoff's named sources, and nothing else;
     5. report staging SHA, main SHA, primary intent, active ticket and state, next action, and discrepancies;
     6. continue only after a clean recovery. Any failed check or unresolved discrepancy means stop and report to Product Authority.
   - **b. Fresh Executor recovery:**
     1. read the handoff;
     2. verify the ticket and seal commit;
     3. `git merge-base --is-ancestor <seal> HEAD`;
     4. verify branch, worktree and working-tree state;
     5. read the sealed ticket;
     6. check each handoff claim against its own evidence: committed and working changes (`git diff <seal>`, `git status`), untracked file contents, local artifacts by hash, and verification results by re-running or by the cited output;
     7. report seal verified, branch/worktree verified, HEAD, changed files, remaining scope, next action, and discrepancies;
     8. continue only within the sealed authorization. A failed seal, identity or worktree check, or an unresolved progress mismatch, means stop and report to the Planner. Staying inside Authorized paths doesn't resolve it.
   - **Pre-handoff classification:**
     - Planner: durable project truth goes to its canonical repo owner; authorization or evidence goes to the ticket or closure record; only transient continuation state goes in the handoff.
     - Executor: durable implementation truth must already exist in the worktree, diff or execution evidence. The handoff never substitutes for source state.
   - Size target: each live handoff ≤ 2,000 tokens, preferably much less. The old session stops after writing it.
5. **`CHANGELOG.md`:** one dated entry about the `PLANNING.md` rule. The local files are named only.

## Explicit exclusions
All other `PLANNING.md` sections, the templates under `site/planning/templates/`, `AGENTS.md`, `CLAUDE.md` files, `.claude/`, code, content, workflows, indexing controls, closed tickets, Sprint 18 files, `review.ps1`, `summarize.ps1`, `~/.codex/config.toml`, credentials, `project:status`, hooks, `AI-Orchestrator\templates\`, version control for `AI-Orchestrator`, and any automation that triggers rotation.

## Implementation contract
- Back up `README.md` to `scratch\pre-TP2.4\` before editing.
- The live handoff files ship as blank templates (headings, banner, recovery and Do-not blocks only), with no state filled in.

## Acceptance criteria
- `git diff --name-only <seal>` ⊆ repo Authorized paths. `git diff <seal> -- site/PLANNING.md` touches only §2 and adds one subsection of at most 8 lines.
- The `PLANNING.md` vendor grep (`codex|grok|claude|gpt|openai|anthropic|xai|model famil`) has no added matches. No `%`, filename or `/context` appears in the new subsection.
- The handoff templates contain exactly the sections in Scope 2 and 3. The README's procedures match Scope 4 step for step.

## Validation matrix
| Layer | Check | Expected |
|---|---|---|
| Diff | Commands above | Within bounds |
| Planner drill | Fill a copy of `planner-handoff.md` in `scratch\drill-TP2.4\` for the real current state. A fresh session given only "recover as Planner from `AI-Orchestrator\planner-handoff.md`" follows 4a | The report matches `git rev-parse origin/staging origin/main` and the ticket `Status:` lines. Handoff ≤ 2,000 tokens (characters ÷ 4) |
| Executor drill | In `scratch\drill-TP2.4\`, a throwaway worktree at the seal with one trivial uncommitted edit, fill a copy of `executor-handoff.md` there. A fresh session follows 4b | The report shows seal verified, the correct HEAD, the changed file and the next action. The drill worktree is then removed |
| Discrepancy | Repeat the executor drill with the handoff falsely listing a second changed file | The fresh session reports the discrepancy and stops |
| Templates intact | After the drills, hash both live handoff files against their delivered blank versions | Hashes match, and no drill state is in the live files |
| Measurement | Try `/context` in a Remote Control session, and record whether a Projects thread session can read its own context. If a warning trigger is chosen, record whether it left room for a handoff | Each result recorded in the README |
| Build | `npm run build` | Passes, or the known sandbox failure. Staging Actions is the authority |

## Adversarial tests
- In the executor drill, the handoff's "next action" is set to edit a path outside the drill ticket's Authorized paths. The fresh session must refuse it.

## Regression boundaries
The review tooling and its outputs are unchanged. Reviewers stay one-shot.

## Git and deployment boundary
R1: seal commit. The Executor is a fresh session on Amul's machine, started from this ticket at its seal commit. It makes one completion commit on its own branch setting `Status: VERIFIED LOCAL`, with local files evidenced by hash and excerpt. The Planner fast-forwards `staging` after review. Closure needs a green staging Actions build and is recorded in the next legitimate planning commit. No `main`.

## Stop conditions
The rule can't stay vendor-neutral within 8 lines; a drill needs a credential or an excluded path; a fresh session's recovery can't be run separately from the session that wrote the handoff.

## Pre-seal review
Reviewer: Codex (R1, new TP2.3 wrapper; summary assembled mechanically) · Reviewed: rev 1 @ `34ea222` · REVISE (1 BLOCKER, 5 REQUIRED). All incorporated:
- BLOCKER, re-scope pending: Amul granted it at approval, and it is recorded under Decisions already frozen.
- REQUIRED, recovery could skip mandated boot reads: Planner recovery now always does the root `CLAUDE.md` boot reads.
- REQUIRED, a diff can't verify local files, untracked content or results: each claim is now checked against its own evidence type.
- REQUIRED, recovery didn't stop on mismatch: both procedures now stop and report.
- REQUIRED, the warning trigger's timing was unproven, and nothing covered an already-compacted session: the trigger now needs a timing test, natural boundaries are the default, and post-compaction behavior is defined.
- REQUIRED, drills could leave state in the shipped files: drills use copies, plus a template-intact hash check.

## Required completion report
Standard template, appended here (≤ 25 lines). Include both drill reports, the discrepancy result, handoff token estimates and local file hashes.

## Done when
`PLANNING.md` carries the continuity rule, the two templates and the README procedures exist, both drills recover cleanly and catch the planted discrepancy, and staging is green.

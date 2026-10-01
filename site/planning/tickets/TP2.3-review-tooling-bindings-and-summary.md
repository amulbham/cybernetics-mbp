# TP2.3 — Review tooling: explicit bindings, structured findings, mechanical summary

Status: DRAFT (rev 1, for pre-seal review)
Mode: IMPLEMENTATION
Risk: R1
Branch: staging
Depends on: TP2.2 CLOSED; TP2.1 CLOSED (`staging @ 7f25037`)
Unlocks: nothing drafted
Inherits: `PLANNING.md` §2 and §13 @ `7f25037`; `planning/templates/pre-seal-review.md` @ `7f25037`; TP2.2 `## Pre-seal review` (first Full-tier run evidence)
Authorized paths: `site/planning/templates/pre-seal-review.md`, `site/CHANGELOG.md`, `site/planning/tickets/TP2.3-*.md`
Authorized local paths (Amul's machine, outside the repo): `AI-Orchestrator\review.ps1`, `AI-Orchestrator\summarize.ps1`, `AI-Orchestrator\README.md`, `AI-Orchestrator\scratch\` (fixtures, backups, logs)

## Goal
Make the review tooling produce a trustworthy normalized summary without the Planner reading raw reviews, and without depending on any personal CLI default.

## Why now
TP2.2's dual review was the first end-to-end run of the wrapper, and it failed in two places (TP2.2 `## Pre-seal review`; `AI-Orchestrator\scratch\run-log.md`):
- The wrapper's Grok call (`review.ps1:73`) has no `-m`/`--effort`. It was cancelled after 3 turns with no review text. The direct pinned command completed in 345 s.
- `summarize.ps1` parsed 0 findings from both reviews, because each reviewer used its own heading format. It still wrote a summary with 0/0/0 counts. That silent failure is worse than no summary.

The README is also stale: it uses `-Ticket` while the script uses `-Id`, its Grok example has no pins, and it has no tier mapping.

## Starting state
- Codex pins (`-m gpt-6.1-sol -c model_reasoning_effort=medium`, fallback `gpt-5.6-sol` medium) are in `review.ps1` and smoke-tested. `~/.codex/config.toml` defaults to a different model at high effort.
- The tiers are `-Tier R1|Standard|Full`. The reviewer prompt asks for free-form findings (`pre-seal-review.md`, "For each finding give").

## Decisions already frozen
- Amul, 2026-10-01: bindings live in `AI-Orchestrator\README.md` and `review.ps1` only, never in `PLANNING.md`. `~/.codex/config.toml` is not edited. Claude never writes `summary.md`.
- Bindings: Codex `gpt-6.1-sol` at medium, the default reviewer; Grok `grok-4.7` at high, the second reviewer for R3. Planner: medium by default, low for mechanical work, high only on escalation (§13 Resource proportionality). Executor: medium by default, low only for genuinely mechanical work, high after failed verification or material ambiguity.
- Consensus merges only on an identical match (Scope 3). When equivalence is uncertain, both findings are kept.

## Questions this ticket may answer
- **For Product Authority, before seal:** does Amul re-scope §13 one-intent (`PLANNING.md:430`) for TP2.3 alongside Sprint 18, on the same footing as TP2.2?

## Scope
1. **`pre-seal-review.md`: structured finding lines.** Replace the "For each finding give" block with a required one-line format and no other finding syntax:
   ```
   FINDING | <BLOCKER|REQUIRED|OPTIONAL> | <ticket section> | <path:line> | <problem, ≤ 30 words> | <minimal fix, ≤ 30 words>
   NEW | <path:line> | <out-of-scope issue, ≤ 30 words>
   VERDICT: SEAL | REVISE
   ```
   Fields contain no `|`. Free prose is allowed only above the first `FINDING` line, and the parser ignores it. Keep the ten criteria, the class definitions and the NEW-FINDINGS-never-authorize rule unchanged.
2. **`review.ps1`: explicit bindings and tiers.**
   - All model and effort values are named constants at the top: Codex model, effort and fallback; Grok model and effort. Every invocation passes them explicitly, and nothing reads or relies on CLI config defaults.
   - The Grok call adds `-m`/`--effort` to the verified form (`--output-format json --max-turns 12 --permission-mode dontAsk --sandbox read-only --disable-web-search`, plus the prompt's tool-call budget).
   - `-Tier R1|R2|R3` maps to the §13 table: R1 and R2 run Codex, and R3 runs Codex and Grok. `-Elevate` runs both for a lower tier and writes `ELEVATED` into the summary header. `Standard`/`Full` are removed.
   - Each review file starts with a header recording the reviewer, the model and effort the CLI reported, the commit reviewed, the duration, the exit code and any fallback used. Fallbacks include the model fallback and the stdin-bundle fallback that runs when the Codex read-only sandbox fails. A reviewer failure is recorded, not hidden.
   - The prompt goes to each CLI from a file or stdin, keeping its line structure. The PowerShell 5.1 one-line flattening is removed.
   - If a review has no `VERDICT` line (for example, Grok cancelled early), the reviewer is retried once. A second miss is recorded as `FAILED` in the header and the run exits non-zero.
3. **`summarize.ps1`: mechanical assembly, fail-closed.**
   - It parses only Scope 1 lines.
   - Group rules:
     - CONSENSUS: same path (ignoring line number), same section and same severity.
     - SEVERITY SPLIT: same path and section, different severity. The Planner adjudicates these.
     - CODEX-ONLY and GROK-ONLY.
     - NEW FINDINGS (NOT AUTHORIZED).
     - PLANNER DISPOSITION: left blank.
   - Matched findings are shown with both reviewers' text verbatim. Text is never merged or paraphrased.
   - Counts are per group and per reviewer, plus both `VERDICT` lines.
   - If a review has no `VERDICT` line, or has a finding-like line (`^\s*(\d+\.|#+|-\s*\*\*Class)`) that isn't valid Scope 1 syntax, the script writes `UNPARSED: <reviewer>` with the offending line numbers and exits non-zero. It never writes zero counts for a review it couldn't read.
4. **`README.md`:** the bindings above (Claude effort tiers included), the fallback rule, the exact commands, the `-Id`/`-TicketPath`/`-Tier` usage, the tier mapping, the model-list commands (`codex debug models`, `grok models`), the folder layout, and the no-credentials rule. It must agree with the script line for line.
5. **`CHANGELOG.md`:** one dated entry about the template change. Local-only changes are named but not detailed.

## Explicit exclusions
`PLANNING.md`, all other templates, `AGENTS.md`, `.claude/`, code, content, workflows, indexing controls, closed tickets, Sprint 18 files, `~/.codex/config.toml`, `~/.grok/`, credentials. Also excluded, as deferred items from the infrastructure plan: `project:status`, Claude hooks, path guards, and version control for `AI-Orchestrator`, which is a separate future decision.

## Implementation contract
- Before editing, copy the three local files to `scratch\pre-TP2.3\` for rollback.
- PowerShell 5.1 compatible, as today. No new dependencies.

## Acceptance criteria
- `git diff --name-only <seal>` ⊆ repo Authorized paths. Local changes ⊆ Authorized local paths.
- `Get-FileHash ~/.codex/config.toml` is identical before and after.
- The README's commands and flags match `review.ps1`'s parameters and constants (checked by a grep for each flag).
- Fixture and live checks below pass.

## Validation matrix
| Layer | Check | Expected |
|---|---|---|
| Fail-closed | `summarize.ps1` on the existing `reviews\TP2.2-codex.md` / `TP2.2-grok.md` (free-form) | Non-zero exit with `UNPARSED: codex` and `UNPARSED: grok`, and no zero-count summary |
| Grouping | Fixture pair in `scratch\fixtures\` with one exact match, one severity split, one finding per single reviewer and one NEW each | Exactly one finding in each group, verbatim text, correct counts |
| R1 live | `review.ps1 -Id TP2.2 -Tier R1` on a worktree at `b0144e8` | Codex only. The header reports `gpt-6.1-sol`/medium, the summary parses, and its counts are non-zero |
| R3 live | `review.ps1 -Id TP2.2 -Tier R3` at `b0144e8` | Both reviewers complete. Grok's header reports `grok-4.7`/high. The summary parses |
| Defaults | Both live runs with `config.toml` untouched | The headers show the pinned values, not the defaults |
| Docs | `npm run build` | Passes, or the known sandbox font failure. Staging Actions is the authority |

## Adversarial tests
- Corrupt one fixture `FINDING` line (drop a field). The summary must exit non-zero with that line number.
- Temporarily set the Codex model constant to a non-existent ID. The run must record the fallback in the header, or fail visibly. Restore it.

## Regression boundaries
The worktree-at-SHA review flow, the read-only sandbox flags and the no-credentials rule are unchanged.

## Git and deployment boundary
R1: seal commit. The Executor is a fresh session on Amul's machine, started from this ticket at its seal commit. It makes one completion commit on its own branch (template, CHANGELOG, ticket) setting `Status: VERIFIED LOCAL`. Local files are evidenced by hash and excerpt in the report. The Planner fast-forwards `staging` after review. Closure needs a green staging Actions build and is recorded in the next legitimate planning commit. No `main`.

## Stop conditions
A CLI can't be pinned by flag; a required check needs `config.toml` or credentials; a reviewer CLI's output can't be held to Scope 1 syntax after one prompt retry (record it, don't loosen the parser).

## Pre-seal review
_[To be filled after review.]_ R1: one outside reviewer, Codex, through the current wrapper's tested Codex-only path.

## Required completion report
Standard template, appended here (≤ 25 lines). Include local file hashes, both live-run headers and the fixture summary excerpt.

## Done when
Both live tiers produce parsed summaries with the pinned models, free-form reviews fail closed, the README matches the script, `config.toml` is unchanged, and staging is green.

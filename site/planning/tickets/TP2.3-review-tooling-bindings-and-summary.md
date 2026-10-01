# TP2.3 — Review tooling: explicit bindings, structured findings, mechanical summary

Status: DRAFT (rev 2, after pre-seal review)
Mode: IMPLEMENTATION
Risk: R1
Branch: staging
Depends on: TP2.2 CLOSED; TP2.1 CLOSED (`staging @ 7f25037`)
Unlocks: nothing drafted
Inherits: `PLANNING.md` §2 and §13 @ `7f25037`; `planning/templates/pre-seal-review.md` @ `7f25037`; `planning/tickets/TP2.2-review-depth-and-resource-policy.md` `## Pre-seal review` @ `7f25037` (first Full-tier run evidence)
Authorized paths: `site/planning/templates/pre-seal-review.md`, `site/CHANGELOG.md`, `site/planning/tickets/TP2.3-*.md`
Authorized local paths (Amul's machine, outside the repo): `AI-Orchestrator\review.ps1`, `AI-Orchestrator\summarize.ps1`, `AI-Orchestrator\README.md`, `AI-Orchestrator\scratch\` (fixtures, backups, logs, and all validation-run output under `scratch\validation\<run>\`). Reviews written later under `reviews\` in normal use are runtime output, not changes

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
- Consensus merges only on an unambiguous key match (Scope 3). When equivalence is uncertain, both findings are kept.

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
   - The prompt goes to each CLI from a file or stdin, keeping its line structure. The PowerShell 5.1 one-line flattening is removed. The prompt is read from the worktree's `pre-seal-review.md` by default. `-PromptPath <file>` overrides this, and the override is recorded in the header.
   - `-OutDir <dir>` sets where review files, the manifest and the summary go (default `reviews\`). Each run writes `<Id>-<reviewer>.md`, `<Id>-manifest.txt` and `<Id>-summary.md` only in that directory.
   - Stdin-bundle fallback: the bundle contains the ticket, every `Inherits:` source at its pinned commit (`git show <rev>:<path>`), and each `-Extra` file, all with line numbers. If any source can't be resolved, the run fails visibly instead of sending a partial bundle.
   - If a review has no `VERDICT` line (for example, Grok cancelled early), the reviewer is retried once. A second miss is recorded as `FAILED` in the header and the run exits non-zero.
3. **`summarize.ps1`: mechanical assembly, fail-closed.**
   - Input boundary: `review.ps1` writes its header lines, then a line `=== REVIEW ===`. The parser reads only what follows that line. In that body, free prose is allowed, but every line starting with a reserved prefix (`FINDING`, `NEW`, `VERDICT`) must be valid Scope 1 syntax.
   - It reads only the reviewers listed in the run's manifest (written by `review.ps1`). A selected reviewer whose output is missing fails the run. Files from other runs or reviewers are never read.
   - Key = path (ignoring line number) + section. Group rules:
     - CONSENSUS (key match, Planner confirms): each reviewer has exactly one finding on the key, with the same severity.
     - SEVERITY SPLIT: exactly one finding each on the key, with different severities. The Planner adjudicates these.
     - AMBIGUOUS: a reviewer has more than one finding on a shared key. All of them are listed, unpaired.
     - CODEX-ONLY and GROK-ONLY.
     - NEW FINDINGS (NOT AUTHORIZED).
     - PLANNER DISPOSITION: left blank.
   - Matched findings are shown with both reviewers' text verbatim. Text is never merged or paraphrased.
   - Counts are per group and per reviewer, plus both `VERDICT` lines.
   - Fail-closed: the script writes `UNPARSED: <reviewer>` with the offending line numbers, writes no counts and exits non-zero when:
     - any reserved-prefix line is malformed;
     - there isn't exactly one valid `VERDICT` line, as the last non-blank line;
     - the verdict is `REVISE` with no `BLOCKER`/`REQUIRED` record, or `SEAL` with one.
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
| Fail-closed | Copy `reviews\TP2.2-codex.md` / `TP2.2-grok.md` into `scratch\fixtures\historical\` (originals untouched), add a header and the `=== REVIEW ===` line, and run `summarize.ps1` on them | Non-zero exit, `UNPARSED: codex` and `UNPARSED: grok` (`REVISE` with no records), no counts |
| Grouping | Deterministic fixture pair in `scratch\fixtures\` covering one consensus, one severity split, one single finding per reviewer, one NEW each, one AMBIGUOUS key (two Codex findings and one Grok finding on the same path and section), and one unrelated pair that shares a path but has different sections | Each finding in its expected group, verbatim text, exact counts |
| R1 live | `review.ps1 -Id TP2.2-val -TicketPath site/planning/tickets/TP2.2-review-depth-and-resource-policy.md -Worktree scratch\wt-val-b0144e8 -Tier R1 -PromptPath <new template> -OutDir scratch\validation\r1` | Codex only. The header reports `gpt-6.1-sol`/medium and the prompt override. The summary parses; zero findings is valid |
| R3 live | The same command with `-Tier R3 -OutDir scratch\validation\r3` | Both reviewers complete or record `FAILED` visibly. Grok's header reports `grok-4.7`/high. The summary parses |
| Defaults | Both live runs with `config.toml` untouched | The headers show the pinned values, not the defaults |
| Docs | `npm run build` | Passes, or the known sandbox font failure. Staging Actions is the authority |

## Adversarial tests
- Corrupt one fixture `FINDING` line (drop a field), and separately one `NEW` line. Each must exit non-zero with the line number.
- Add a stale `TP2.2-val-grok.md` to the R1 output directory. The R1 summary must ignore it.
- Temporarily set the Codex model constant to a non-existent ID. The run must record the fallback in the header, or fail visibly. Restore it.

## Regression boundaries
The worktree-at-SHA review flow, the read-only sandbox flags and the no-credentials rule are unchanged.

## Git and deployment boundary
R1: seal commit. The Executor is a fresh session on Amul's machine, started from this ticket at its seal commit. It makes one completion commit on its own branch (template, CHANGELOG, ticket) setting `Status: VERIFIED LOCAL`. Local files are evidenced by hash and excerpt in the report. The Planner fast-forwards `staging` after review. Closure needs a green staging Actions build and is recorded in the next legitimate planning commit. No `main`.

## Stop conditions
A CLI can't be pinned by flag; a required check needs `config.toml` or credentials; a reviewer CLI's output can't be held to Scope 1 syntax after one prompt retry (record it, don't loosen the parser).

## Pre-seal review
Reviewer: Codex (R1) · Reviewed: rev 1 @ `f1dc34b` · REVISE (1 BLOCKER, 7 REQUIRED, 1 OPTIONAL). All findings incorporated except the identical-text rule:
- BLOCKER, re-scope unresolved: put to Amul at approval, and recorded at seal.
- REQUIRED, false consensus on a shared key: consensus now needs a 1:1 key match, otherwise AMBIGUOUS, with a fixture. Not adopted: requiring identical problem text. Independent reviewers never share wording, so consensus would always be empty (TP2.2's two reviews shared no wording on any agreed finding). The Planner still confirms every consensus.
- REQUIRED, the regex missed malformed records and flagged prose: replaced by an explicit body boundary, reserved-prefix validation, one terminal verdict, and a verdict/record consistency rule.
- REQUIRED, `b0144e8` holds the old template: added `-PromptPath` and the full commands.
- REQUIRED, `reviews\` outside the boundary: validation output goes to `scratch\validation\` via `-OutDir`.
- REQUIRED, stale or unselected reviewer files: added the run manifest and the stale-file test, and historical reviews are copied, not reused.
- REQUIRED, the fallback bundle omitted sources: the bundle now has every pinned source with line numbers, or fails.
- REQUIRED, non-zero live counts were stochastic: zero is valid live, and fixtures prove the counts.
- OPTIONAL, unpinned TP2.2 inherit: pinned.

## Required completion report
Standard template, appended here (≤ 25 lines). Include local file hashes, both live-run headers and the fixture summary excerpt.

## Done when
Both live tiers produce parsed summaries with the pinned models, free-form reviews fail closed, the README matches the script, `config.toml` is unchanged, and staging is green.

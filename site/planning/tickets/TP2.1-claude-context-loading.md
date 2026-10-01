# TP2.1 — Claude context loading: real site/CLAUDE.md and path-scoped rules

Status: DRAFT (rev 2, after pre-seal review)
Mode: IMPLEMENTATION
Risk: R1
Branch: staging
Depends on: TP2.0 CLOSED (`staging @ cc37023`)
Unlocks: nothing drafted
Inherits: `PLANNING.md` §3 and §13 @ `cc37023`; root `CLAUDE.md` @ `cc37023`; Claude Code memory docs (https://code.claude.com/docs/en/memory, read 2026-10-01)
Authorized paths: `site/CLAUDE.md`, `.claude/rules/*.md`, `site/CHANGELOG.md`, `site/planning/tickets/TP2.1-*.md`

## Goal
Make every Claude session auto-load a small, curated instruction set instead of the whole 57,747-byte `site/AGENTS.md`, while keeping `AGENTS.md` intact as the vendor-neutral deep reference.

## Why now
`site/CLAUDE.md` is a git symlink to `AGENTS.md` (`git ls-files -s site/CLAUDE.md` → mode `120000`). Claude Code loads a subdirectory `CLAUDE.md` when it reads any file under `site/` (memory docs, "How CLAUDE.md files load"), so in practice every session ingests all of `AGENTS.md`. Amul's Windows clone has `core.symlinks=true` and resolves the link (checked 2026-10-01), so the cost is context size, not a broken file.

## Starting state
- Root `CLAUDE.md` is 10 lines and loads at launch.
- `site/CLAUDE.md` is a symlink. `.claude/rules/` doesn't exist.
- Per the memory docs: a directory with a real `CLAUDE.md` doesn't auto-read its `AGENTS.md`. Rules without `paths:` load at launch. Path-scoped rules load when a matching file is read. `InstructionsLoaded` hooks fire for `CLAUDE.md` and rule files but **not** for an `AGENTS.md` read directly, so the hook alone can't prove absence.
- `AGENTS.md` heading names, verbatim: `## Development`, `## Deploy workflow — staging → production`, `## Indexing state — READ BEFORE TOUCHING`, `## Design system`, `### Content-section transforms — standing policy`, `## Content`.

## Decisions already frozen
- **§13 one-intent: Product Authority re-scope for TP2.1**, on the same footing as TP2.0 (no product behavior, no Sprint 18 file). _[Pending Amul's confirmation before seal.]_
- Plan v2.1 (Amul, 2026-10-01): `AGENTS.md` stays byte-for-byte unchanged. Canonical docs stay vendor-neutral. `.claude/rules/` only dispatches Claude to canonical owners.

## Questions this ticket may answer
Does a session launched in `site/` load the repo-root `.claude/rules/`? Record the result. Don't change the design based on it.

## Scope
1. **Replace the `site/CLAUDE.md` symlink with a regular file (≤ 60 lines)** containing:
   - a one-paragraph description of the site;
   - a site map with one line per §3 owner, giving its file path (`AGENTS.md`, `PUBLISHING.md`, `CONTENT-MODULES.md`, `design-system/README.md`, `ROADMAP.md`, `CHANGELOG.md`, `PLANNING.md`, `planning/templates/ticket-contract.md`, `.claude/skills/content-manager/SKILL.md`);
   - hard gates as dispatch lines, each citing a verbatim heading above (indexing, deploy/production, design system, content-section transforms);
   - the commands `npm run build`, `npm run build:pdfs`, `npm run validate:pdfs`, `astro dev --background`.
2. **`.claude/rules/`: four files, each with `paths:` frontmatter and ≤ 12 lines.** Each names the files and verbatim headings to read before editing matching paths, and restates no rules:
   - `planning.md`: `site/planning/**` → `site/PLANNING.md`, `site/planning/templates/ticket-contract.md`, `site/planning/templates/pre-seal-review.md`.
   - `content.md`: `site/src/content/**`, `site/src/lib/**`, `site/src/layouts/**`, `site/scripts/**`, `site/astro.config.mjs` → `site/PUBLISHING.md`, `site/CONTENT-MODULES.md`, `AGENTS.md` `## Content` and `### Content-section transforms — standing policy`, and the content-manager skill for new entries.
   - `design.md`: `site/src/styles/**`, `site/src/components/**`, `site/design-system/**` → `site/design-system/README.md` and `AGENTS.md` `## Design system`.
   - `deployment.md`: `.github/workflows/**`, `site/public/robots.txt`, `site/src/components/BaseHead.astro`, `site/package.json` → `AGENTS.md` `## Deploy workflow — staging → production` and `## Indexing state — READ BEFORE TOUCHING`. `BaseHead.astro` deliberately also matches `design.md`.
3. **`CHANGELOG.md`:** one new dated entry.

## Explicit exclusions
`site/AGENTS.md` (byte-for-byte), root `CLAUDE.md`, `PLANNING.md`, templates, `.claude/settings.json`, `.claude/skills/`, hooks, code, content, workflows, indexing controls, closed tickets, Sprint 18 files.

## Implementation contract
- Gate lines paraphrase in at most 12 words and cite the owner heading. No rule text is copied.
- No unconditional rules. Every cited heading exists verbatim.

## Acceptance criteria
- `git ls-files -s site/CLAUDE.md` shows mode `100644`. The file is ≤ 60 lines.
- `git diff --stat cc37023 -- site/AGENTS.md` is empty.
- **All repo-authored instruction content that can auto-load is ≤ 120 lines:** root `CLAUDE.md` + `site/CLAUDE.md` + all four rule files.
- Every rule parses with a `paths:` list, and a grep confirms every cited heading.
- The diff is a subset of Authorized paths.

## Validation matrix
| Layer | Check | Expected |
|---|---|---|
| Diff | `git diff --name-only cc37023` | ⊆ Authorized paths |
| Static load set | The documented rules applied to the final file set | `AGENTS.md` excluded because `site/CLAUDE.md` is a real file |
| Live load (where headless auth works) | `claude -p` with a throwaway `--settings` file outside the repo holding an `InstructionsLoaded` logging hook. Record `claude --version` and the effective Project-instructions setting. Reads: (a) none; (b) `site/planning/README.md`; (c) `site/src/styles/global.css`; (d) `site/src/content/` (any entry); (e) `site/public/robots.txt`; (f) `site/src/components/BaseHead.astro`; (g) launch from `site/` and read a planning file | (a) root `CLAUDE.md`; (b) + `site/CLAUDE.md` + `planning.md`; (c) + `design.md`; (d) + `content.md`; (e) + `deployment.md`; (f) both `design.md` and `deployment.md`; (g) recorded. `--debug` output contains no "AGENTS.md loaded" line |
| No live auth | State "static only, live verification pending" | Ticket stays open until the live check runs |
| Build | `npm run build` | Passes, or the known sandbox font-fetch failure |

## Adversarial tests
- Remove `paths:` from one rule, re-run (a), and confirm the rule now loads at launch. Restore it.
- Introduce a misspelled heading and confirm the heading grep fails. Restore it.

## Regression boundaries
`AGENTS.md`, root `CLAUDE.md`, and all build and deploy behavior.

## Git and deployment boundary
R1: seal commit, then one completion commit on the executor's own branch, setting `Status: VERIFIED LOCAL`. The Planner pushes the fast-forward to `origin/staging` after review. **Closure requires the staging Actions build to be green and the live load check to be recorded.** The Planner records closure in its next legitimate planning commit (§13: no status-only commits). No `main`.

## Stop conditions
`AGENTS.md` still loads; a needed fact can't be pointed to; any excluded file must change.

## Pre-seal review
Reviewer: Codex (R1) · Reviewed: rev 1 @ `7aaefc0` · REVISE. All findings incorporated:
- BLOCKER, no TP2.1 re-scope: re-scope added, pending Amul.
- REQUIRED, line budget omitted path-scoped rules: the budget now counts all four rules; `site/CLAUDE.md` is capped at 60 and each rule at 12.
- REQUIRED, the hook can't prove `AGENTS.md` absent: added the static rule, the version/setting record and the `--debug` negative check.
- REQUIRED, fallback vs closure conflict: static-only now keeps the ticket open.
- REQUIRED, headings not verbatim and directory pointers vague: verbatim headings and file targets added.
- REQUIRED, matrix too narrow: added content, deployment, the BaseHead overlap and launch from `site/`.
- REQUIRED, staging boundary: separated the local commit from the push; closure waits for green staging.
- OPTIONAL, 50-line minimum: removed.
Material changes: Why-now corrected after checking Amul's clone (`core.symlinks=true`, link resolves).

## Required completion report
Standard template, appended here (≤ 25 lines), with the load-log excerpt.

## Done when
All auto-loadable repo instructions total ≤ 120 lines, `AGENTS.md` is unchanged and not auto-loaded, the rules dispatch as the matrix shows, staging is green, and the live check is recorded.

# TP2.1 — Claude context loading: real site/CLAUDE.md and path-scoped rules

Status: DRAFT
Mode: IMPLEMENTATION
Risk: R1
Branch: staging
Depends on: TP2.0 CLOSED (`staging @ cc37023`)
Unlocks: nothing drafted
Inherits: `PLANNING.md` §3 source-of-truth map and §13 @ `cc37023`; root `CLAUDE.md` @ `cc37023`; Claude Code memory docs (https://code.claude.com/docs/en/memory, read 2026-10-01)
Authorized paths: `site/CLAUDE.md`, `.claude/rules/*.md`, `site/CHANGELOG.md`, `site/planning/tickets/TP2.1-*.md`

## Goal
Make every Claude session auto-load a small, curated instruction set instead of the whole 57,747-byte `site/AGENTS.md`, while keeping `AGENTS.md` intact as the vendor-neutral deep reference.

## Why now
- `site/CLAUDE.md` is a git symlink to `AGENTS.md` (`git ls-files -s site/CLAUDE.md` shows mode `120000`). Claude Code loads a subdirectory `CLAUDE.md` as soon as it reads any file under `site/` (memory docs, "How CLAUDE.md files load"). So effectively every planner, reviewer and executor session ingests all 142 lines and 57 KB of it.
- Windows: the same docs say Git checks out a committed symlink as a one-line text file unless `core.symlinks` is on. Amul's clone is on Windows, so local sessions there may get a `site/CLAUDE.md` containing only `AGENTS.md`. Starting state verifies this rather than assumes it.

## Starting state
- Root `CLAUDE.md` (10 lines, TP2.0) loads at launch for root sessions.
- `site/CLAUDE.md` → `AGENTS.md` symlink. No `.claude/rules/` directory exists. `.claude/` holds only `skills/content-manager/`.
- Per the memory docs: a real `site/CLAUDE.md` means `site/AGENTS.md` is **not** auto-read (a directory's `AGENTS.md` loads only when that directory has no `CLAUDE.md`). Rules without `paths:` frontmatter load at launch. Rules with `paths:` load when Claude reads a matching file.

## Decisions already frozen
- Plan v2.1, approved by Amul 2026-10-01: `AGENTS.md` stays byte-for-byte unchanged. Canonical docs stay vendor-neutral. `.claude/rules/` only dispatches Claude to canonical owners.
- **§13 one-intent:** _pending Amul's re-scope confirmation, on the same footing as TP2.0_ (no product behavior, no Sprint 18 file).

## Questions this ticket may answer
- Does a session launched in `site/` (not the repo root) load root `.claude/rules/`? Record the observed behavior. Don't change the design based on it.

## Scope
1. **Replace the `site/CLAUDE.md` symlink with a regular file (50–80 lines).** It contains:
   - a one-paragraph statement of what the site is;
   - a **site map**, one line per owner from `PLANNING.md` §3, saying what each owns (`AGENTS.md`, `PUBLISHING.md`, `CONTENT-MODULES.md`, `design-system/`, `ROADMAP.md`, `CHANGELOG.md`, `planning/`, the `content-manager` skill);
   - **hard gates as dispatch lines**, each naming the owning section rather than restating its rule: indexing (`AGENTS.md` "Indexing state"), deploy and production (`AGENTS.md` "Deploy workflow"), design tokens (`design-system/`), markdown pipeline (`CONTENT-MODULES.md` plus `AGENTS.md` "Content-section transforms");
   - **commands:** `npm run build`, `npm run build:pdfs`, `npm run validate:pdfs`, `astro dev --background`, quoted from `site/package.json` and `AGENTS.md` "Development".
2. **`.claude/rules/` (new, every file path-scoped, 5–15 lines each).** Each file says which canonical doc and section to read before editing matching files, and restates no rules:
   - `planning.md`, `paths: ["site/planning/**"]` → `PLANNING.md` and `planning/templates/`.
   - `content.md`, `paths: ["site/src/content/**", "site/src/lib/**", "site/src/layouts/**", "site/scripts/**", "site/astro.config.mjs"]` → `PUBLISHING.md`, `CONTENT-MODULES.md`, `AGENTS.md` "Content" and "Content-section transforms", and the `content-manager` skill for new entries.
   - `design.md`, `paths: ["site/src/styles/**", "site/src/components/**", "site/design-system/**"]` → `design-system/` and `AGENTS.md` "Design system".
   - `deployment.md`, `paths: [".github/workflows/**", "site/public/robots.txt", "site/src/components/BaseHead.astro", "site/package.json"]` → `AGENTS.md` "Deploy workflow" and "Indexing state". `BaseHead.astro` deliberately matches both `design.md` and `deployment.md`.
3. **`CHANGELOG.md`:** one new dated entry.

## Explicit exclusions
`site/AGENTS.md` (byte-for-byte), root `CLAUDE.md`, `PLANNING.md`, templates, `.claude/settings.json`, `.claude/skills/`, hooks, code, content, workflows, indexing controls, closed tickets, Sprint 18 files.

## Implementation contract
- Every gate statement in `site/CLAUDE.md` names its owner section. No rule text is copied from `AGENTS.md` beyond a 12-word paraphrase per gate.
- Every rule file has `paths:` frontmatter. No unconditional rules.
- Section names cited must exist verbatim as `##`/`###` headings in the target doc.

## Acceptance criteria
- `git ls-files -s site/CLAUDE.md` shows mode `100644`. The file is 50–80 lines.
- `git diff --stat cc37023 -- site/AGENTS.md` is empty.
- Repo-authored auto-loaded instruction content is ≤ 120 lines, meaning root `CLAUDE.md` + `site/CLAUDE.md` + unconditional rules (none).
- Each of the four rule files has valid `paths:` YAML, and every heading it cites exists (checked by grep).
- The diff is a subset of Authorized paths.

## Validation matrix
| Layer | Command/check | Expected result |
|---|---|---|
| Diff boundary | `git diff --name-only cc37023` | Subset of Authorized paths |
| AGENTS.md untouched | `git diff --stat cc37023 -- site/AGENTS.md` | Empty |
| Load behavior | Headless `claude -p` with a throwaway `--settings` file (outside the repo) holding an `InstructionsLoaded` hook that logs file paths: (a) at root, read nothing; (b) read `site/planning/README.md`; (c) read `site/src/styles/global.css` | (a) root `CLAUDE.md` only; (b) adds `site/CLAUDE.md` and `planning.md`; (c) adds `design.md`; `AGENTS.md` never appears |
| Fallback | If headless auth is unavailable, derive the expected load set from the docs and say so | Recorded as not live-verified |
| Build | `npm run build` | Passes, or the known sandbox font-fetch failure, with staging Actions as the check |

## Adversarial tests
- Temporarily remove the `paths:` block from one rule, re-run check (a), and confirm the rule then loads at launch. Restore it and confirm it no longer does.
- Confirm a typo'd heading in a rule is caught by the heading grep.

## Regression boundaries
`AGENTS.md`, root `CLAUDE.md`, all build and deploy behavior.

## Git and deployment boundary
R1: seal commit, then one completion commit on the executor's own branch. The Planner fast-forwards `staging` after review. No `main`.

## Stop conditions
The load check shows `AGENTS.md` still auto-loading; a needed fact exists only in `AGENTS.md` and can't be pointed to; any excluded file needs to change.

## Pre-seal review
_To be filled after Codex review (R1)._

## Required completion report
Standard template, appended to this file (R1 cap of 25 lines), including the load-check log excerpt.

## Done when
Claude sessions auto-load ≤ 120 repo-authored lines, `AGENTS.md` is unchanged and no longer auto-loaded, the path-scoped rules dispatch correctly, and staging carries the completion commit.

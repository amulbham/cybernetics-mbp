# Pilot ticket P1 — HANDOFF/README link audit (R0, read-only)

Base: branch pilot/multi-agent-handoff-refresh at e534398c78fd3bf401d16cdc02e35d9070a1a505 (copy of planner/context). Diff baseline = that SHA.

Goal: confirm every relative Markdown link target (`[text](target)`) in HANDOFF.md and planner/README.md resolves to an existing file or directory in this checkout; bare or backticked paths are out of scope.

Method: for each markdown link target that is relative (not http), resolve it against the file's own directory (HANDOFF.md and planner/README.md respectively; planner/README.md links resolve from planner/); strip #anchors; test existence with git ls-files / filesystem. Absolute http(s) links: list them but do NOT fetch them. HANDOFF.md line 4 hash 2a50965 is an intentional history pointer: only note whether `git cat-file -t 2a50965` succeeds.

Output: ONE new file site/planning/audits/pilot-multi-agent/P1-link-audit.md, at most 60 lines: a table of source file, link text, resolved path, PASS or FAIL, then a one-line verdict. Include the exact commands used.

Forbidden: editing any existing file (including HANDOFF.md, README, PLAN.md and codex-review.md), creating other files, network fetches, commit, push.

Done when: P1-link-audit.md exists, `git status --porcelain` shows only untracked files under site/planning/audits/pilot-multi-agent/, and no other path changed.

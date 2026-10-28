# Multi-agent loop — pilot record (sandbox branch, 2026-10-28)

Branch: pilot/multi-agent-handoff-refresh (from planner/context e534398). Sandbox only; not promoted, no deploy.

## Roles
- Planner/orchestrator: Claude in the project thread. Writes the sprint plan and one ticket at a time; reviews each result; keeps scope inside Sprint 25.
- Reviewer: one external model per ticket, Codex (`codex exec -s read-only -m <cheapest listed Codex model> -c model_reasoning_effort=low`) or Grok (`grok -p ... -m <cheapest listed Grok model> --effort low --permission-mode dontAsk --sandbox read-only --disable-web-search`). Never a restricted or expensive model. Read-only, findings as BLOCKER / REQUIRED / OPTIONAL, saved to a file.
- Coder: headless `claude -p` with a narrow allowlist (file writes use `Edit(path)`, not `Write(path)`), given one complete ticket packet.

## Loop per ticket
1. Planner writes the ticket (base SHA, scope, method, output file, forbidden actions, done condition).
2. Reviewer reviews the ticket.
3. Planner revises; the same reviewer does a short recheck of its own findings. Stop on any BLOCKER or REQUIRED.
4. Coder executes.
5. Planner reviews the output and the git diff against the ticket.

The next ticket is written only after the previous one is accepted.

## Learnings
- The reviewer caught a real planner error: the plan was built from main's older HANDOFF.md instead of the branch copy. Always read the actual branch bytes before writing a ticket.
- Codex review at low effort used about 21k tokens. A trivial Grok call cost about $0.04. Both use existing logins; no API keys.
- The branch tracks origin/planner/context by default, so always push with an explicit refspec.
- A Remote Control session parks itself when idle; the next user message restarts it.
- gh is not installed on the machine, so GitHub work is done from the cloud side.
- A reviewer's finding quality depends on a defined scope: a "links and paths" versus "Markdown links" mismatch was caught on recheck.

## Results
P1 link audit (read-only): 15 of 15 relative links in HANDOFF.md and planner/README.md resolve; history hash 2a50965 exists. Files: PLAN.md, codex-review*.md, P1-link-audit.md.

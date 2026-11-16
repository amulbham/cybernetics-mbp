# cybernetics-mbp — session bootstrap

Pointers only. Each owner below holds its own rules.

- The site lives in `site/`.
- Process (roles, tickets, sprints, review): `site/PLANNING.md`.
- Product truth lives in the owners listed in `site/PLANNING.md` §3.
- Indexing state: `site/AGENTS.md`, "Indexing state".
- Start every session by fetching and reading `site/ROADMAP.md`, the active sprint contract, and the active ticket.
- The sealed ticket, at its seal commit, is the Executor's only authority.
- Approved tickets and planner state are read from `origin/planner/context` with `git show`, never merged; work from `staging`: `site/PLANNING.md` §2 "Local-first execution".
- When the owner directs, read `.claude/SESSION_HANDOFF.md` (local, Git-ignored) and verify its claims against Git and the ticket; it is context, not authority.

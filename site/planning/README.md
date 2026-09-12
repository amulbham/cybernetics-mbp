# Planning

This directory holds the working records the planning process produces. It does not define the process itself — that's `../PLANNING.md`, which governs how work here gets authorized, executed, reviewed, and closed.

```text
programs/
→ where are we going?
  Long-range dependency arcs, provisional until their own evidence gate.

sprints/
→ what capability or question are we currently earning?
  One active contract per sprint, updated as tickets close.

tickets/
→ what exactly may the implementation agent do?
  Sealed, one-ticket-at-a-time authorization. Once closed, a ticket
  becomes an immutable historical record (see PLANNING.md §3's
  Promotion rule) — a later correction is a new ticket, not an edit.

templates/
→ how are those records structured?
  The one canonical copy of each document shape. PLANNING.md describes
  what a sprint/ticket/completion report must contain; these files own
  the exact copyable Markdown.
```

`PLANNING.md` governs the process. `planning/*` applies it. Neither one is current product truth — that stays owned by `AGENTS.md`, `PUBLISHING.md`, `CONTENT-MODULES.md`, `CHANGELOG.md`, `design-system/`, and the code/schemas/validators themselves (see `PLANNING.md` §3's source-of-truth map).

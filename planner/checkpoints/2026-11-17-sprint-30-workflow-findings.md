# Sprint 30 — Workflow findings and prospective operating model

Status: owner-endorsed direction, 2026-11-17; release and sprint closure pending.

## Findings
- Local-first persistent Executor checkout removes routine owner-mediated terminal/Git/deployment commands. Exact Wrangler execution for current release not yet evidenced.
- Planner commits canonical delta-only ticket contracts to planner/context; retain PLANNING.md R0–R3, proportional proof and report caps, explicit authorization and seal-before-execution.
- Optional independent Reviewer reads the exact planning commit before seal, reports BLOCKER/REQUIRED/OPTIONAL; Planner reconciles material findings and owner approves. Risk-required independent proof is not waived. No mandatory extra review for routine low-risk changes.
- Executor reads approved ticket directly, implements and tests locally, handles routine Git/CI/deployment operations within explicit authority. Owner retains semantic and production decisions. Keep staging and production verification distinct.
- Two intake paths: author-directed primitive instructions and assisted editorial selection with owner review; common publication system. T30.7 demonstrated manuscript-to-preview and one editorial refinement pass (Executor report).
- T30.8 centralized forward CC BY 4.0, legacy overrides and stricter oracle (local candidate 15c37e9, Executor report; staging authorized, verification pending).

## Closure obligations
Reconcile T30.1–T30.8 evidence, T30.6 forward typography implementation, seven-PDF production guard, validate:pdfs checkout limitation, and staging/live results. Retain sitewide/IWL licensing question as backlog. Promote surviving workflow guidance into canonical planning/agent docs where needed during authorized closure; avoid duplicating existing rules. Do not claim release or closure yet.

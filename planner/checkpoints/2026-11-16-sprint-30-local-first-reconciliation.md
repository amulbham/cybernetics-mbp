# Sprint 30 — Local-first workflow reconciliation

Date: 2026-11-16 (America/Los_Angeles).
Status: **CURRENT OPERATIONAL CHECKPOINT**. Supersedes the proposed environment model in the 2026-11-13 intake; preserves that checkpoint as historical planning evidence.

## Decision and rationale

Sprint 29 closed with Paper C published on the website and Zenodo (see prior closure record). The owner chose to restore the earlier enjoyable, low-friction development loop instead of introducing more cloud orchestration: approved Planner ticket -> Claude Code in persistent Windows desktop repository -> Astro local preview and owner feedback -> scoped commit/push to staging -> CI and hosted verification -> several accepted changes batched into an explicitly owner-authorized production release.

The owner retains product and production-release authority. The Planner maintains `planner/context` (tickets, decisions, checkpoints). Claude Code is the local implementation Executor. Normal work begins from `staging`; `main` is production. The Planner branch is read through Git objects without merging. Staging is production-like but may contain unreleased work and staging-only governance; do not wholesale merge it into main. Research/editorial approval remains outside website engineering. Website implementation does not re-audit approved scholarship.

`.claude/SESSION_HANDOFF.md` is a Git-ignored, local-only, on-demand context-reset handoff. It is not Planner memory or an execution authority. The historical untracked `handoff.md` was overwritten by a case-insensitive Windows path collision; the owner explicitly waived historical recovery. Avoid case-only collisions during future resets.

## Ticket evidence and status

- **T30.1 — Local repo recovery: COMPLETE (Executor-reported).** Local `main` synced to production `1d7320b`, `staging` synced to `61fe4f5`; two T23 evidence commits preserved at `backup/t23-evidence-local` (`dc4b55f`, `36ed554`). Astro build, facts tests and seven-PDF validation passed; planner/context readable without merge; dev server preview verified. Note: overwritten untracked handoff disclosure supersedes the original preservation claim.
- **T30.2 — Local-first contract: COMPLETE ON STAGING.** Commit `af8e7a0830da8da42b2056e972e8fbcef791d0c2`, GitHub Actions run #147 (`43938767563`) **success**. Portable `.claude/launch.json`; read-only Planner intake; branch/release guidance; `npm run preflight:production` reuses seven-PDF guards; local session handoff ignored via `.git/info/exclude`. Reported 60-route comparison: 50 equivalent after noindex normalization, 10 differ by Cloudflare email obfuscation. Seven staging PDFs are regenerated and not byte-identical to frozen production PDFs: maintain production carry-over guard. Technical debt recorded in staging ROADMAP: legacy PDF test harness 19/84 failures (cause unverified) and inert advisory ticket-path warning.
- **T30.3 — Responsive article title wrapping: COMPLETE ON STAGING.** Shared `ArticleShell.astro` CSS scales title font within column; no manuscript changes. Executor reported local visual tests for nine articles at six widths (54 combinations), build and facts tests passed; owner accepted local preview. GitHub staging commit `f97dfa9e280b11ae8243b449dc8a127db124e458`; Actions run #148 (`43957776988`) **success**. Hosted mobile visual verification beyond CI is not independently established here.
- **T30.4 — Citation anchor offset: APPROVED FOR LOCAL IMPLEMENTATION, NOT COMPLETE.** On mobile, sticky “ON THIS PAGE” bar obscures the start of bibliography entries after clicking `#ref-N`. Small shared native CSS offset preferred; check direct fragments, TOC, browser history, mobile and desktop. No PDF, scholarly-content or production changes. Local preview/owner acceptance before staging push.

The T30.1–T30.4 tickets in this branch are retrospective transcriptions of the owner-approved conversation contracts, **not fabricated contemporaneous seal commits**. Their status must not be treated as evidence of a formal historical seal.

## Next gates

1. Execute T30.4 locally and obtain owner preview acceptance before staging delivery.
2. Continue a few small real website tickets to test autonomous local-first workflow, avoiding new infrastructure unless actual friction appears.
3. Batch accepted staging improvements into a scoped release; run production seven-PDF preflight and require explicit owner production authorization.
4. Update `planner/STATE.md` at meaningful ticket or release milestones; create fixed checkpoints for substantive changes, not every small edit.

## Verification boundary

GitHub branch and Actions outcomes above were checked 2026-11-16. Local build, visual, handoff and content-comparison results are Executor-reported unless specifically marked GitHub-verified. The older 2026-11-13 checkpoint remains a proposal at its historical date; it is not the current execution plan.

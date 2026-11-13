# Sprint 29 — Process friction observations (held for process-optimization sprint)

Status: OBSERVATIONS ONLY. Not an authorized sprint or ticket. Do not begin work from this document.
Recorded: 2026-11-13. No ordering, priority or implementation authorization implied.

---

## 1. Cloudflare API token injection in cloud sessions

**Friction**: The T29.4 Executor-as-operator amendment (§6) stopped immediately because `CLOUDFLARE_API_TOKEN` was not in the session environment. Mid-session credential injection is not supported in the cloud container; the token must be present at session start. This forced the owner-run Path B fallback.

**Observation**: The process for injecting a Cloudflare API token into a cloud Code session should be documented before the next Direct Upload sprint. Specifically: (a) where in claude.ai session settings a token is added as a secret, (b) whether a session restart is required, (c) the minimum Cloudflare permission scope needed for `wrangler pages deploy` (Account › Cloudflare Pages › Edit).

**Potential improvement**: Document the secret-injection path in the sprint setup checklist so the owner can confirm the token before the GO, not after. Executor-as-operator is valuable for reducing round-trips; it only works when credentials are available at session start.

---

## 2. Wrangler file-count discrepancy interpretation

**Friction**: Wrangler reported "74 files uploaded, 111 already uploaded" (total 185), which does not equal the 187-file inventory. The owner had to flag this as a potential issue; the Executor had to explain that `_headers` and `_redirects` are routing control files counted separately by Pages and not included in Wrangler's dedup file count. This consumed a verification cycle.

**Observation**: The Phase 2 completion report and the kit README should include a standing note explaining the Wrangler file-count interpretation (185 deduplicated asset files + 2 routing control files = 187 inventory). This would remove uncertainty at upload time without changing any technical behavior.

---

## 3. Playwright proxy injection complexity

**Friction**: `capture-staging.mjs` uses `context.request.get()` (Playwright's APIRequestContext) for the PDF fetch at line 79. This does not inherit `HTTPS_PROXY`; it bypassed the proxy agent and failed with DNS ENOTFOUND for `*.pages.dev`. The fix required an external `inject-proxy.mjs` preload hook patching `chromium.launch` → `browser.newContext`, which is not part of the sealed kit and must be re-created or carried across sessions.

**Observation**: For future kits that run in cloud Code sessions and need to fetch `*.pages.dev` or other proxy-required hosts, either (a) use `node-fetch`/undici with `NODE_USE_ENV_PROXY=1` for all network calls instead of Playwright's APIRequestContext, or (b) make the proxy preload hook a first-class kit file (sealed, in `SHA256SUMS`) so it travels with the kit.

---

## 4. Owner deployment verification round-trip

**Friction**: The T29.4 owner-run upload required the owner to: (a) download/extract a 8MB ZIP, (b) run `verify-upload-dir.mjs` locally, (c) run the Wrangler command, (d) paste the terminal output back into the session. This is four context switches and one local CLI requirement (Wrangler + Node 22.2). The owner flagged it as "unnecessarily cumbersome."

**Observation**: Three options for future sprints: (1) Executor-as-operator (requires credential injection at session start — see friction 1 above); (2) GitHub Actions workflow dispatch with a `deploy-staging` path that accepts a pinned ZIP URL and runs Wrangler in CI (adds infrastructure); (3) a Cloudflare Pages API upload path using the REST API rather than Wrangler CLI (removes the local Wrangler requirement for the owner). Option 1 is lowest overhead if the credential injection path is documented. Options 2 and 3 require new infrastructure authorization.

---

## 5. Staged site URL structure vs. oracle expectations

**Friction**: The gap analysis (T29.5 item 3 addition) required knowing the exact staged URL for Paper C. The URL is `research/cybernetics/cybernetics-structural-science/`, which is different from the slug proposal (`cybernetics-and-the-structural-science-of-self-organizing-systems`) in the source intake audit. The final slug/route is an owner decision (checklist item 7) but was not yet confirmed, leaving the oracle addition partially indeterminate until item 7 is resolved.

**Observation**: Route/slug decisions should be recorded explicitly as a named owner decision earlier in the sprint lifecycle (at or before the first hosted preview ticket), so oracle contract additions don't have to work around uncertainty about the final URL.

---

## 6. Tag derivation authorization granularity

**Friction**: Tag selection was identified as an owner decision in the gap analysis, requiring a separate owner authorization turn to unlock the T29.5 oracle clause. In practice, tag selection from existing taxonomy is routine editorial work and the owner authorized the Executor to derive it.

**Observation**: For future publications, pre-authorize the Executor to derive tags from manuscript Keywords + existing taxonomy as part of the standard staging-to-release checklist scope, rather than treating it as a named owner decision requiring a separate turn. The owner retains override authority on any specific tag choice.

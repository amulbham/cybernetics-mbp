# T29.4 owner-run kit and Cloudflare setup checklist

Status: PLANNING ARTIFACT for the [T29.4 draft](../../../tickets/T29.4-paper-c-closed-hosted-preview.md). Not sealed, not run against any Cloudflare resource. Hosted execution needs the separate seal and, for the candidate, your exact-tuple GO.
Files: `pins.json` (machine-readable pins), [`../T29.4-preview-upload-inventory.tsv`](../T29.4-preview-upload-inventory.tsv), `verify-upload-dir.mjs`, `anonymous-denial-check.mjs`, `verify-hosted-preview.mjs`, `test-kit.mjs`, `kit-common.mjs`. All scripts import `node:` built-ins only and need Node 22 or later. `node test-kit.mjs` runs 29 cases against local mock servers (no network, no credentials).

## Who runs what

| Step | Who | Credentials |
| --- | --- | --- |
| Create the project, enable Access, run every `wrangler` command, delete canary deployments | You (Amul) | You keep `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; the Executor never sees them |
| Prepare the canary and candidate upload folders and their zips; run the anonymous denial matrix; assemble reports | Executor | none |
| Verify an upload folder before `wrangler` (`verify-upload-dir.mjs`) | You | none |
| Authenticated verification of all seven PDFs and the inventory (`verify-hosted-preview.mjs`); the desktop and mobile captures | You, in your own browser session | your Access session cookie, in an environment variable on your machine only |
| Independent verification of the anonymous results | A reviewer who is not the Executor, re-running `anonymous-denial-check.mjs` | none |

Evidence from your authenticated run and your captures is **owner-supplied** evidence; the anonymous results are the part a third party can reproduce.

## Cloudflare setup checklist (before any upload; nothing here has been done)

1. **Name.** `cybernetics-mbp-preview` looked unclaimed on 2026-11-12 (the host did not resolve, like a random unused name); only Cloudflare's creation call is authoritative. If it is taken, stop and choose another name; the hostnames and pins are then re-derived and re-reviewed.
2. **Create the project with Wrangler, not the dashboard upload wizard** (the wizard demands an immediate upload). In PowerShell, with the two credentials set in your own session:
   `npx wrangler@4.129.0 pages project create cybernetics-mbp-preview --production-branch no-production`
   No Git integration, no custom domain, no deployment to the production branch. The production hostname `cybernetics-mbp-preview.pages.dev` stays empty.
3. **Enable Access before any deployment.** Cloudflare dashboard → Workers & Pages → `cybernetics-mbp-preview` → Settings → General → **Enable access policy**, then Manage. Set one **Allow** policy whose only Include rule is your explicit email address(es); no Everyone, no bypass, no domain-wide or account-wide include unless you intend it; a login method you can complete (existing provider, or One-time PIN); a short session (for example 8 to 24 hours). Cloudflare's documentation says this toggle protects the preview deployment addresses (`<hash>.<project>.pages.dev` and the branch alias) and **not** the production `<project>.pages.dev` address or custom domains.
4. **Send the Executor read-only evidence**: the project name, account ID (not the token), production branch name, a screenshot or export of the Access application hostnames and policy rules, and confirmation that there is no custom domain and no custom branch alias.
5. **Network.** If the Executor cannot reach the new `*.pages.dev` host, approve that exact host in the session prompt when asked.
6. **Keep the token to yourself.** Use an API token scoped to Pages edit for this account; revoke it after the review.

## Fixed names

Project `cybernetics-mbp-preview`; branch label `t29-4-paper-c-preview` (alias `https://t29-4-paper-c-preview.cybernetics-mbp-preview.pages.dev`); never `main`, `staging` or `no-production` as `--branch`. Always pass `--branch` explicitly: Wrangler otherwise infers it from a Git checkout.

## Phase 1: harmless canaries (you run Wrangler; no Paper C bytes)

1. The Executor sends `canary-1.zip` and `canary-2.zip` with their inventories and digests. Each folder holds a root page, `robots.txt`, `canary.txt`, the same `_headers` as the candidate, a page at the article path carrying the same noindex meta, the words "Candidate specimen" and "Download candidate PDF" and the line "T29.4 canary — no manuscript content", and a harmless generated PDF at the candidate PDF path. Extract each to a new empty folder and run `node verify-upload-dir.mjs <folder> --pins canary-N-pins.json --inventory canary-N.tsv`. Continue only on PASS.
2. Upload canary 1: `npx wrangler@4.129.0 pages deploy <canary-1 folder> --project-name cybernetics-mbp-preview --branch t29-4-paper-c-preview --commit-hash <40-hex id supplied> --commit-message "T29.4 canary 1"`. Copy the printed deployment URL and alias URL to the Executor.
3. The Executor runs the anonymous matrix on the alias and the canary 1 immutable URL; you may run it too.
4. In your browser sign in at the canary 1 immutable URL, copy the `CF_Authorization` cookie value (developer tools → Application → Cookies), and in PowerShell set `$env:CF_AUTHORIZATION = '<value>'` (never paste it into chat or a file). Run `node verify-hosted-preview.mjs --origin <canary 1 immutable URL> --pins canary-1-pins.json --inventory canary-1.tsv --out canary-1-report.json`. This proves the cookie method, the PDF hash and the `_headers` effect end to end on harmless bytes.
5. Upload canary 2 the same way to the same branch label. The Executor immediately runs the anonymous matrix on the **new immutable URL** (a brand-new address must be protected the moment it exists) and on the alias.
6. Delete canary 1: `npx wrangler@4.129.0 pages deployment list --project-name cybernetics-mbp-preview` to read its ID, then `npx wrangler@4.129.0 pages deployment delete <canary-1 ID> --project-name cybernetics-mbp-preview --force`. The latest deployment of a branch cannot be deleted, which is why canary 2 comes first. Check in a signed-in browser that the canary 1 address now returns a not-found page, and send the `deployment list` output.
7. **Return to the Executor:** every hostname (alias, each immutable URL, the production hostname), the Access policy evidence, the Wrangler outputs, the `deployment list` output, and the two canary reports. The Executor assembles the Phase 1 report for independent verification. **No Paper C byte is uploaded in this phase.**

## GO gate

You state an explicit GO naming the exact tuple (the ticket's table: project, branch label, correction commit and tree, candidate PDF, manifest and route-HTML hashes, upload digest `bcc01c5f…464b`, six historical pairs, the exact Wrangler command, the confirmed hostname list and the Phase 1 report digest). Any change voids it.

## Phase 3: candidate upload, verification and captures

1. The Executor sends `paper-c-preview-upload.zip` (105 files) with its SHA-256. Extract to a new empty folder, run `node verify-upload-dir.mjs <folder>`; continue only on `PASS — the directory is exactly the pinned tree`.
2. Upload: `npx wrangler@4.129.0 pages deploy <folder> --project-name cybernetics-mbp-preview --branch t29-4-paper-c-preview --commit-hash 63372f2b73d4d5287e92d283a4e71ee766a95e75 --commit-message "T29.4 Paper C closed preview"`. Send the printed immutable and alias URLs and the `deployment list` output.
3. The Executor runs the anonymous matrix on the alias and **every** immutable URL (canary 2 and the candidate), and the production hostname and live hosts.
4. Sign in at the **immutable** candidate URL, set `$env:CF_AUTHORIZATION`, and run `node verify-hosted-preview.mjs --origin <candidate immutable URL> --alias <alias URL> --out hosted-report.json --captures <captures folder>`. It downloads every inventory file except `_headers` (a control file Pages applies but does not serve), checks all seven PDFs and every non-HTML file byte-exact, checks the article markers, and checks the exact `X-Robots-Tag: noindex, nofollow` on every response. HTML pages are compared informationally because Cloudflare may rewrite markup.
5. **Seven-PDF fallback by hand:** save each PDF from the immutable URL in the signed-in browser and run `Get-FileHash -Algorithm SHA256 <file>`; compare with the seven pinned hashes in the pins record §2.
6. **Captures (your browser, immutable URL only).** Open the candidate article at the immutable URL. In developer tools → Console run `copy(JSON.stringify({url:location.href,innerWidth,innerHeight,scrollHeight:document.documentElement.scrollHeight,devicePixelRatio,userAgent:navigator.userAgent}))` and save the clipboard as `page-metrics-desktop.json` (device toolbar off, window 1440 px wide, or emulate 1440×900) and, after switching to a 390×844 phone emulation, as `page-metrics-mobile.json`. For each set, scroll to the top, take a viewport screenshot ("Capture screenshot"), run `scrollTo(0, innerHeight * k)` for k = 1, 2, … and capture again until the page bottom; save as `desktop-001.png`, `desktop-002.png`, … and `mobile-001.png`, …. A single full-page capture is acceptable where the tool can produce it; segments may not exceed 16,384 px in height. The kit rejects a gap in numbering, the wrong width, a total captured height below the page height, a non-PNG file, or metrics for any URL other than the immutable article URL.
7. The kit writes `capture-index.json` that ties every screenshot (SHA-256, size) to the immutable article URL, the candidate PDF hash, the upload digest and the hash of `hosted-report.json`. Send the report, the index and the screenshots to the Executor.
8. Record your explicit visual acceptance or the changes you want, bound to the immutable URL and the candidate PDF hash.

## Stop at any of these

A mismatch from `verify-upload-dir.mjs`; any anonymous first response that is not an Access redirect or a 401/403; a failed login-redirect validation; a control that is not judged exposed; a production or live host that serves the route or PDF; a deployment in `deployment list` that is not accounted for; an expired or invalid cookie result; a changed hash. If any of these happens after the candidate is uploaded, contain it: upload a neutral deployment to the same branch label, delete the candidate deployment with `--force`, verify, and return to the Planner.

<!-- CONTRACT FROZEN 2026-10-18 from rev 2 (draft SHA-256 23ff78a0ff5f5b8ed392aa6c91081dde35b653fbfb5717eef61bed832a77299c). -->

# Sprint 23 — Chisel canonical revision

Status: EXECUTING (contract frozen 2026-10-18; authorized through T23.0 G2, staging acceptance)
Risk ceiling: R3
Branch: staging (implementation and staging verification); production promotion by product-only candidate off `main` (T22.0 precedent)
Depends on: T22.0 S6 accepted (main `5bf8518`); Product Authority decisions in `planner/checkpoints/2026-10-18-chisel-revision-decisions.md` @ planner/context `f4b460b`
Unlocks: About simplification (next sprint, not started); the owner-operated Zenodo deposit gate

## Core question
Can a revised canonical paper and its companion IWL be released over an existing published paper with stable identity, while four approved PDFs stay byte-identical and the revised PDF is the exact file that later reaches Zenodo?

## Outcome
Chisel v9 and IWL v4 live at the unchanged routes with the approved metadata and reserved DOI. The website-built Chisel PDF is frozen, hash-pinned and served byte for byte. The five-file manifest and ordinary carry-over still work afterwards. The article-update flow is written down once, from this real case.

## Inherited truths
- Published baseline is manuscript v6 / IWL v2; the supplied canonical files are v9 / v4 (hashes in T23.0).
- Entry id, routes, PDF filename and the route-history row are keyed to the folder id, not the title.
- `carry` overwrites every built PDF with production's copy (`site/scripts/carry-over-pdfs.sh`); a regenerated PDF cannot ship while `PDF_CARRY_OVER=true`. PDFs are not byte-reproducible.
- `description` is JSON-LD only (not rendered); `dateModified` already feeds the article masthead, JSON-LD and `article:modified_time`; the IWL schema is strict and has no `dateModified`.
- Indexing is open on production only; 13 sitemap URLs; tag pages are noindex (41 today).

## Hypotheses to test
- A committed, content-addressed frozen PDF, the owner-set manifest and a committed release expectation (`site/release-pdfs/expected.txt`) together are the smallest sufficient custody and binding for one revised PDF; a blob alone cannot prove which version is intended.
- The revision needs only wrapper and boundary fixes in the supplied Markdown, with no component changes.

## Hard constraints
- Canonical prose is preserved except the specifically approved corrections. No restored v6 material, no editorial rewriting.
- Never merge `staging` into `main`; no force-push; no variable changes by the Executor; no Zenodo action by the Executor.
- No status-only production deployment. Production deployments are limited to what T23.0 G4 authorizes; recovery or rollback needs separate Product Authority authorization.
- R3 pre-seal review: the two independent outside reviews were **waived once by the Product Authority on 2026-10-18, for T23.0 only**; they were not performed and the contract is not to be described as externally reviewed. The waiver does not carry forward to any later ticket. R3 classification, validation requirements and the production approval gate are unchanged.

## Explicit exclusions
About work; other entries or PDFs; route or redirect changes; a new IWL schema, IWL PDF or versioning system; workflow changes other than comment-only corrections; indexing changes; a prose-compiler skill or tool; creating or publishing the Zenodo record.

## Ticket sequence
| Ticket | Mode | Purpose | Depends on | Gate |
|---|---|---|---|---|
| T23.0 | IMPLEMENTATION (R3, gated release) | Normalize and replace article and IWL; add the frozen-artifact carry path; freeze the PDF; promote; verify | Seal after two outside reviews | G0 seal → G1 staging → G2 PDF approval → G3 candidate → G4 release → G5 website acceptance |

Owner-operated, not a ticket: Zenodo gate Z1–Z3 (T23.0 §Zenodo gate). No T24 is drafted before T23.0 produces evidence.

## Sprint-level acceptance criteria
- Website acceptance (T23.0 G5): revised article and IWL live; five PDFs match the post-transition manifest; every carried-over PDF is byte-identical to its pre-release hash; redirects, indexing and header protections unchanged; tag inventory as specified.
- Parity (Zenodo gate, later and separate): production Chisel PDF hash equals the deposited file's hash and the DOI resolves to that record.

## Validation plan
Local chain (`npm run build`, `build:pdfs`, `validate:pdfs`), staging rendering and PDF inspection, stubbed-`curl` cases for the carry path, a production matrix with fresh downloads. Defined in T23.0.

## Stop conditions
A needed component, CSS or schema change beyond the authorized list; a title that cannot be shown without truncation; any prose change not approved; a mechanism that needs an executable workflow change or a different variable model; a manifest that contradicts the committed expectation; any carried-over hash difference; Zenodo state that contradicts the reserved-DOI assumption.

## Exit state
- True: Chisel v9 / IWL v4 live; one new frozen PDF; the update flow documented; S6 closure documents promoted selectively with this release.
- Open: DOI resolution and deposit parity (owner); Search Console and Scholar effects (external); About.

## Canonical documentation targets
`site/AGENTS.md` (PDF preservation; `description` convention; IWL `dateModified`), `site/PUBLISHING.md` (revising a published paper; `description`; IWL schema), `.claude/skills/content-manager/SKILL.md` and `site/src/content.config.ts` (`description` wording), `site/ROADMAP.md`, `site/CHANGELOG.md`, and comment-only lines in `deploy-pages.yml`.

# Sprint 29 — Future Scholarly PDF Foundation (mini-sprint)

**Status:** **PROPOSED / LIKELY NEXT AFTER SPRINT 28 — NOT SEALED, NO EXECUTION OR DEPLOYMENT AUTHORITY**. Product direction accepted 2026-11-03.  
**Mode:** Small print/rendering and verification foundation; **Risk ceiling R3** because rendering changes intersect published PDF custody, even if the intended source changes are limited.  
**Depends on:** Sprint 28 public researcher-role and shared AuthorNote finalization (T28.2), Sprint 28 identity/DOI validation baseline, independently approved future [PDF design standard](../programs/future-scholarly-pdf-standard.md). Do not claim Sprint 28 closed until its own production evidence and owner signoff.  
**Unlocks:** New academic paper intakes in Sprint 30 and later using a verified Scholar-oriented PDF template. *The foundation itself publishes no new research paper or new historical PDF version.*

## Objective and measurable result
Have a repeatable **future-only** PDF template that produces a new paper with correct visible and extractable page-one author identity, credible title/byline hierarchy, clean author role (not fake affiliation), correctly shared bio and metadata, searchable body/references, and the existing HTML/PDF identity requirements. Demonstrate it with a **disposable representative new-paper fixture** before authorizing any new research-paper production release.

## Starting state / why earned
- S28 Scholar audit T28.4: six historical PDFs technically ready; FAFSA, Chisel and Desk appeared as PDF-primary Scholar records with displayed author `A BHAM`. Existing `print-research.css` uses 19 pt titles and 12 pt **small-caps** bylines, with Type 3 output and line-hyphenation artifacts. These are *advisory observations*, not defects requiring retroactive work.
- `site/src/consts.ts` and `AuthorNote.astro` supply shared author identity/bio in HTML and PDF. S28 T28.2 will choose `Systems Researcher` as profession versus real organizational affiliation, and longer bio copy, before S29.
- `site/scripts/build-research-pdfs.mjs` already renders paper-only PDFs; `site/release-pdfs/expected.txt` does **not** replace the actual owner-controlled six-line `PDF_MANIFEST` guard. Main currently holds six approved immutable PDFs.

## Tentative task arc (no tickets sealed)
| Phase | Mode | Narrow output | Gate |
| --- | --- | --- | --- |
| **T29.0** | AUDIT / R0–R1 | Pin S28 final author-role contract, six PDF hashes, present print CSS, typography/extraction observations and minimal sample fixture | Confirm no current paper needs a new version |
| **T29.1** | IMPLEMENTATION / R2–R3 | Refine print stylesheet and, only if necessary, the shared author presentation of **future** PDF projections; title/author hierarchy, normal-case byline, legitimate subtitles, professional role and ORCID | Independently review precise source diff; preserve all existing HTML appearance except S28-approved role changes |
| **T29.2** | VALIDATION / R2 | Scratch-new-paper fixture tests: two PDF extractors, true full-name token, title/author, dates, DOI, references, math/hyphenation, tables, images, Page 1 and end pages; negative case for glyph-splitting and missing images | Human visual QA and reproducible fixtures |
| **T29.3** | RELEASE / R3, if earned | Approve minimal **future-template-only** source release after staging and independent review, with six **post-carry predeploy** hashes and six **fresh postdeploy live** hashes | Exact SHA / manifest reconciliation / Product Authority production go; zero original-PDF changes |
| **T29.4** | DOCUMENTATION / R0 | Promote the verified (not aspirational) new PDF standard to `PUBLISHING.md` and content-manager instructions | Prove first new paper will inherit it; clear handoff to S30 |

## Non-negotiable exclusions
- **Never regenerate, overwrite, or replace the six existing PDFs**: Paper A, Three SOS, FAFSA, Chisel, Desk and Cognition; no edits to their release hashes, expectation rows, Zenodo deposits or scholarly manuscript bodies.
- No PDF renderer/font overhaul merely to suppress Type 3 fonts unless bounded evidence proves the change essential; split into independent R3 spike if unexpected complexity arises.
- No new Google Scholar ranking or indexing guarantees. Improve extractability and identity; recheck actual Scholar indexing separately as observation.
- No adding fabricated academic affiliation/venue. `Systems Researcher` remains a **professional role**, not a university or publishing institution.
- Do not import staging-only Chisel work into main or weaken the PDF carry-over guard.

## Acceptance / falsifiable checks
1. Fixture PDF correctly shows and extracts **“Amul Bham”** in normal case adjacent to a visually dominant title; no `A BHAM` or inter-glyph spaces. Role and actual institutional statement are semantically distinct.
2. Title/byline layout checked against current official Scholar **fallback** suggestions (proposed ≥24 pt title, 16–23 pt byline); any intentional visual exception receives author review; subtitles remain legible.
3. Two engines independently find/extract selected body phrases, references and author identity; figure actual bytes, tables, math, page breaks, declarations and ORCID checked. No invented abstract or unapproved manuscript edits.
4. New-paper `citation_*` / JSON-LD / canonical PDF URL and DOI/date agree with approved source; essay negative control still has no scholarly PDF.
5. After transient regeneration/test, production package still deploys the **existing six exact byte sequences**; active six-line manifest verified and six fresh live SHA-256 values match after an explicitly approved deployment.
6. Standalone future-paper template adoption is documented only after evidence proves it works. If unfinished before S30's next paper, block silent default adoption; obtain an explicit owner legacy-template exception or complete S29 first.

## Scope intake from Sprint 28 closeout — 2026-11-05
Product Authority agreed to carry the remaining staging/PDF system work into this proposed sprint. Preserve the existing future-template goals and review the combined scope before sealing.
- Production Sprint 28 release is verified at `710964480f432c9b8e5582b09c811308aa7c50f2`, Actions #135. Staging integration is deferred, not a Sprint 28 release failure.
- Review the preserved staging proposal `0ac207fed57943db17a28dad9f258dc41f7478ce` (tree `0f0d205ec0f91d462c490cea06d8ae4c6dadd706`) and its illustrative carry/guard patch. No staging upload is approved by this intake.
- Design explicit per-work choice of published artifact or draft candidate artifact, with protected production custody and HTML/PDF version correspondence. Decide candidate URL/link semantics before exposing draft HTML with a historical PDF.
- Plan integration of production changes into staging while preserving Chisel v2/IWL and reconciling canonical operating docs and independently grounded metadata expectations.
- Frozen production artifacts remain byte-identical. The existing prohibition on generating historical PDFs remains operative until a reviewed sprint amendment specifically authorizes scratch/closed-preview candidate rendering for a revision. Chisel publication or Zenodo actions need separate content/version approval.
- The original mini-sprint task arc above is provisional. Reassess risk, sequence and ticket numbers from the combined audit before drafting executable tickets. Do not treat this intake as a new renderer or deployment implementation.

## Review and authority
This is a **prospective sprint planning placeholder**, not an implementation seal. Before any work, perform exact-source audit, bound ticket(s), independent whole-sprint review if scope expands, and Product Authority seal. Any new PDF's first-publication release, exact bytes and Zenodo deposit require their own later content-specific approvals. S29 may be mini-sprint or one concentrated release cycle; timing follows S28 signoff rather than an arbitrary calendar target.

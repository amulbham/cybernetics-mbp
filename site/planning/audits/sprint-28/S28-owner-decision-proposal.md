# Sprint 28 — Clustered Product Authority decision proposal (not approved)

**Status:** PROPOSED OPTIONS FOR OWNER DECISION, 2026-11-03. **No implementation seal, source change or automatic DOI exception.** Grounding: [T28.0 source occurrence audit](T28.0-baseline-audit.md), [T28.4 Scholar](T28.4-scholar-audit.md), [T28.5 schema](T28.5-schema-audit.md), [Planner disposition](T28.4-T28.5-planner-disposition.md).
**Purpose:** One explicit set of occurrence-by-occurrence editorial decisions before T28.1, role/affiliation decisions before T28.2, and Substack link deletion under T28.3. This plan can be accepted in parts; an unapproved row stays blocked/deferred.

## Paper A / Three SOS DOI choices (three independent approvals required)
| # | Source exact occurrence | Existing DOI | Planner recommendation | Intent and historical PDF consequence |
| --- | --- | --- | --- | --- |
| **A1** | Paper A `index.md:6`, `doi` frontmatter → current site masthead, `citation_doi`, JSON-LD | **version** `10.5281/zenodo.20531589` | **Change current HTML work identity to concept DOI `10.5281/zenodo.20531588`** if current page represents evolving Paper A work. | Existing frozen Paper A v1 PDF retains `20531589`; approve the distinct current-HTML vs historical-PDF version identity **explicitly**, or defer A1. |
| **A2** | Paper A `index.md:311`, Data Availability “the paper is archived at …” | **version** `20531589` | **Retain `20531589`** if that statement specifically denotes the archived exact v1 being described. A concept DOI would imply an *all-versions archive*; only change with revised editorial wording and owner intent. | Retaining exact-v1 link avoids rewording the original archive provenance and possible frozen-PDF mismatch. |
| **A3** | Three SOS `index.md:209`, bibliography #1 citing Paper A | **version** `20531589` | **Choose work-level `20531588` if citing the Paper A intellectual work generally**, or retain `20531589` if Three SOS explicitly depends on v1 as read. | A3 may create HTML vs frozen Three SOS PDF bibliography difference; require direct acceptance or defer. |

**None of A1–A3 has been approved as an implementation exception.** Existing PDF bytes always remain immutable. Paper B `23068820` and its Paper A bibliography `20531588` are regression-only; do not change.

## Date decisions
- Paper A original `pubDate: 2026-08-24` unchanged. **Actual content-revision date UNKNOWN**: default **defer setting `dateModified`**, leaving it absent, until owner identifies a real substantive revision; do not substitute cleanup/deployment date. A future approved website-specific editorial edit can receive its actual date if accurately described.
- About `ProfilePage.dateModified`: **REQUIRED fix** for build-time timestamp. Preference: if a genuine About/profile edit ships in T28.2, use that **author-approved actual edit date**, not build time; alternatively **omit** the optional property if no reliable date is available. Existing `dateCreated: 2026-08-01` needs owner provenance check; omit if unsupported.

## Researcher identity decisions
- Proposed public short professional title: **Systems Researcher** in masthead and About `Person.jobTitle`. Do not use `AUTHOR.affiliation` as a synonym for occupation; separate professional role from factual institutional status, and omit/informally state non-affiliation when appropriate rather than inventing an employer.
- Proposed shared end-of-article AuthorNote opener: **“Amul Bham is a systems researcher and AI systems architect.”** Preserve existing remaining biography text, subject to author approval. This will change new HTML and future PDF generation, **not any of six frozen PDFs**.
- Remove promotional Substack Footer, About and `sameAs` references; preserve Chisel's factual Substack references, published PDF history, and external Substack account itself.

## Validation and release choices
- **Recommended:** adopt an independently owner-approved metadata/identity expectation fixture (draft [T28.5a](../../tickets/T28.5a-independent-publishing-metadata-validation.md)) and review it with the T28.1–3 changes before production. Alternative: deliberately accept manual cross-surface testing with recorded Owner Authority and known residual escapes.
- One closed-staging QA and exact selective main release only after all decisions and audit-derived fixes are approved; full six-PDF carried byte baseline before deploy and six fresh live SHA checks after deploy.
- No existing PDF version or Zenodo deposit is included. New PDFs inherit improved standards only after proposed **Sprint 29** foundation verification.

**Awaiting product decisions:** A1, A2, A3, Paper A revised-date disposition, short role + author note text and affiliation model, About edit date/dateCreated, validation-hardening approach. The owner may approve the recommended bundle or choose exceptions, with actual approval recorded before tickets are sealed.

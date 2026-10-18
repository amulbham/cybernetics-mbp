# Chisel revision — approved decisions and contract handoff

Date: 2026-10-18. Working checkpoint, not a sealed implementation contract.
Product Authority approved the recommendations below, including CC BY-NC 4.0.

## Verified baseline and inputs

- Remote heads rechecked: main `5bf8518f7cbba16a7a8a950b2abac2a42c3502a6`; staging `b26267cfa619dd0ccbd63e4b39a7512b0d13521e`; preceding Planner context `f5e74c18cdfe58707e825056da3c1300673aaaaf`.
- T22.0 S6 accepted with recorded limitations; PR #1 closed without merge. Final report/addendum await selective promotion with the next real release, not another status-only deployment.
- Published Chisel: Knowledge Work paper, original pubDate 2026-09-22, manuscript v6 and companion IWL v2. No DOI authored in current article frontmatter; external deposit history is not inferred from that absence.
- Supplied canonical manuscript: `v09-Site-Bham-The-Chisel-Fallacy (2).md`, 59,819 bytes, SHA-256 `b63b61353daa7d9c1634176c357648474d0a8e1f0687f1ee539d2491cb43ede3`.
- Supplied canonical IWL: `v04-IWL-Bham-The-Chisel-Fallacy (1).md`, 41,825 bytes, SHA-256 `7644440fa0f869bac1cd7ce3fbfc3709f7aad36c1f9dd17b71fbc8efaa3150a2`.
- Comparison and source inspection completed. No additional discovery sprint is needed.

## Approved identity and metadata decisions

- Use reserved DOI `10.5281/zenodo.23458660`. The owner confirms reservation; resolution is expected only after the later Zenodo publication. Reservation was not independently inspected in a private account.
- No visible abstract for v9. Use the supplied excerpt as the required metadata description. The renderer does not require a visible abstract; do not invent one or weaken the required schema field.
- Preserve original article pubDate 2026-09-22. Set dateModified to the actual approved substantive revision date, not the build clock. Meaningful later edits advance it; cosmetic rebuilds do not.
- Keep article ID, canonical article route, companion route and PDF filename despite the revised display title. No route migration.
- Use these five tag topics with readable display labels: AI detection, Authorship, Intellectual Work Ledger, Pangram, Directed Authorship. Four existing slugs remain; Pangram is added. Remove old tag routes only if no other entry uses them; retain tag noindex policy.
- Accept v9 as content authority; do not restore the old glossary or other v6 passages merely because they existed.

## Approved presentation and IWL normalization

- Convert genuine bold-italic subsection labels into H3; nested ledger-entry headings may be H4. Preserve wording and the H2-based contents structure.
- Supply normal strict IWL frontmatter: existing parent ID, revised v4 title, published state and original pubDate. Add optional outer dateModified and pass it through the shared article shell.
- Keep IWL OPAQUE V1: no inner schema, JSON-LD, IWL PDF or automatic versioning framework.
- Remove duplicated top-level IWL title/byline from the rendered body and its unfilled Published alongside row; the shell already supplies the companion relationship.
- Preserve historical development/version dates inside the ledger.
- Reconcile supplied IWL CC BY 4.0 labels to approved **CC BY-NC 4.0**, consistent with the site's license.
- Make the 32 numbered References contiguous for the existing linker; preserve citation wording, order and exact destinations. Use visible DOI/source path labels under the established convention. Do not fabricate a Goodhart URL.
- Check all nine primitives and the closing pull quote for intended boundaries. Immediate unquoted text follows quoted blocks at supplied manuscript lines 29, 77, 102, 151, 199 and 338; add boundary blank lines as needed to prevent unintended capture.
- Correct the decision-table sentence to “using evidence for the first question to settle the fourth”; the table has four questions as rows, not the claimed columns.
- Correct the IWL's “Three entries” description: Layer 1 contains five Discovery Context notes. Use five or an accurate count-free description.
- Inspect the longer title in OG and PDF output, all four article tables and the IWL. Use existing responsive-records only where rendered need warrants it, not as a blanket conversion.
- These are approved wrappers/metadata/explicit corrections, not permission for discretionary argument or citation rewrites.

## Approved publication order and proposed mechanism

1. Owner supplies canonical Markdown; website compiles the canonical PDF.
2. Review and freeze the website-built Chisel PDF and its SHA-256 before production promotion.
3. Publish that exact approved artifact alongside the revised article/IWL; preserve the other four approved PDFs byte for byte.
4. Download the production Chisel PDF, verify its hash, and let the owner upload that exact file to the reserved Zenodo record.
5. After publication, download the deposited file, compare exact bytes/hash, and verify DOI resolution. Until then publication parity and final revision closure remain pending.

- **VERIFIED constraint:** current carry-over fetches every PDF from production and would overwrite the revised Chisel build. Disabling preservation globally would regenerate unrelated PDFs. The current special fallback is Desk-specific and assumes an already published artifact.
- **PROPOSED, implementation undecided:** a minimal selective artifact path for the approved website-built Chisel PDF, with exact hash custody, approved manifest transition and validation of all five PDFs.
- The contract must name its concrete artifact source, immutability/access requirements and recovery behavior. Missing/wrong-hash artifacts must fail closed. Do not skip manifest checks or require Zenodo publication before website publication.
- Preserve ordinary carry-over on later builds. Confirm the normal PDF_RELEASE setting before a real release; do not infer private variable state from a checkpoint.
- Manuscript v9 does not automatically establish whether the reserved Zenodo draft is an initial record or a new record version. Do not create or publish records on the owner's behalf.

## Scope, review and next action

- Draft one bounded R3 ticket and minimal sprint contract; current inventory ends at T22.0, so use Sprint 23 / T23.0 if fresh refs still confirm availability.
- Include only this revision, the necessary selective PDF mechanism, the small IWL dateModified extension, earned publishing-flow documentation, and selective promotion of accepted S6 closure documents.
- Preserve category/routes, unrelated research/PDFs, current indexing and preview protections. No About work yet.
- Validate approved source normalization, metadata and citations; rendered article/IWL/OG/PDF; unchanged unrelated PDFs; all-five artifact manifest; redirects; and indexing behavior with the revised tag inventory.
- Existing R3 two-outside-reviewer pre-seal requirement applies. Owner coordinates reviews; Claude must not invoke or supervise reviewer agents. T22's exception does not carry forward.
- Return unsealed local drafts and a concrete minimal mechanism proposal. Do not seal, implement, push, change workflow variables, publish Zenodo or deploy yet.
- A concise prose-compiler feedback checklist is a follow-up, derived from these actual input defects; do not create a new skill or compiler project.
- Promote decisions into canonical publishing documents only through the approved implementation/release work; this checkpoint describes approved intent, not deployed behavior.

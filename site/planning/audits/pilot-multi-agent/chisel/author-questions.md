# Author questions and developer-handoff outline (C1, proposal only)

Defaults apply if a question is left open: the source stays as published. Row ids refer to `decisions.md`.

1. **AQ1** D01–D06: accept the six placement moves as one set, accept a subset, or reject all? Unchanged is valid.
2. **AQ2** D03/D04: after the move each Evidence box sits beside a paragraph stating the same facts. Keep both, or remove either (zero is valid)?
3. **AQ3** D03/D04: add in-block citations "(Arvan et al., 2026)" and "(Karr et al., 2026)" to the Evidence boxes? Default no; adjacency comes from placement only.
4. **AQ4** Q04: the first Evidence box says "AI-generated text", the prose says "AI-assisted text". Which matches Arvan et al.?
5. **AQ5** Q05: are "642 abstracts", "Pangram 3.2", "0.50 threshold", "64.4–80.1%" and "reclassified" verified against Karr et al. (arXiv:2608.11256)? Who verifies, and when?
6. **AQ6** D06: put the Counterpoint before S L260 (proposed), before S L250, or leave it at the section head?
7. **AQ7** X04/X05 (F22): how is the excerpt described: leave "a sample of the actual record", relabel it condensed/partly illustrative, or align it to IWL v4? Are the two extra sentences at S L327 from a source version of the ledger?
8. **AQ8** Q01: "AI-specific in v1–v3" vs "five or six prior versions" (S L331, IWL L189); which is true?
9. **AQ9** Q02/O03: are "Section 5" (S L331) and the IWL "Section N" notes draft numbering? Preserve (default) or clarify?
10. **AQ10** Q03: does "nowhere in the published paper" mean the article alone, given the published IWL states those details?
11. **AQ11** O02/O04 (F23): footer "August 2026" and the license lines: preserve bytes (default), or authorize a specific change?
12. **AQ12** O01/Q09 (F18): authorize link and citation checks for refs 12 and 16 and the uncited refs 5, 7, 22? Is `PUBLISHING.md:55` retroactive for pre-October papers?
13. **AQ13** Q07: add "(IWL)" to the IWL Definition and/or a Fabrication Paradox Definition? Default no.
14. **AQ14** K06: is an approved candidate a substantive revision (`dateModified`)? What version/PDF path applies to the frozen PDF and the reserved DOI?
15. **AQ15** Q06: keep the Tao sentence in both S L48 and S L185?

## Developer-handoff outline (only after approval)
1. Owner approves the exact candidate (blob id) and answers AQ1–AQ15; the Planner seals a bounded ticket.
2. Executor copies the approved candidate to the article path unchanged; touches the IWL only if the owner approved exact bytes.
3. No Executor editorial choices; frontmatter unchanged unless the owner decides (AQ14).
4. Static checks: 9 primitives, 9 unique anchors, headings and reference list intact, no stray `{#`.
5. Build, then rendered desktop, mobile and print review; PDF/version decision is its own gate.
6. Staging and release only under separate sealed tickets.

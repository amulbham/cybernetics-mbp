# Chisel article + IWL: decisions table (C1, PROPOSAL ONLY)

Run baseline: `git rev-parse HEAD` = `845c26e156f0c6daf57c0fabf34952f017c394da` on branch `pilot/multi-agent-handoff-refresh` (as expected). Nothing committed or pushed.
Pinned inputs present: `77ce447` (checkpoint, T25.4 routing), `fa6084a` (T25.4 audit), `06468a8` (contract), `9697dbc` (site main), guide `bec57c4` (amulbham-research). Blobs at `9697dbc`: article `632d2d9d331bf885f0aaa279f7e6d99aaaca04b1`, IWL `9219e954826050a267a86b72748d5ded5078be0d`; both match the expected values.

Anchors: **S L#** = pinned article line; **C L#** = candidate line; **IWL L#** = pinned IWL line; **H#** = hunk in `diff-map.md`; **AQ#** = `author-questions.md`. "Guide preference" = Guide v0.2 DRAFT heuristic, not a global standard. Nothing here is approved.
Net effect: 7 hunks. Six callouts MOVED verbatim, none added or removed (still 9: Definition 4, Key idea 1, Evidence 2, Implication 1, Counterpoint 1). No prose, frontmatter, reference or IWL change. Source 403 lines, candidate 400.

## A. Proposed changes (each is a hunk)
| ID | Action | Anchor | Findings / hunk | Reason |
|---|---|---|---|---|
| D01 | MOVE | S L30–31 → C L33–34 (after S L38) | F14, H1 | Two Definitions opened the section before the example (S L36) and before the paragraph that names the term (S L38). The box now follows that paragraph. Text and `{#vending-machine-assumption}` unchanged. Guide preference: context before crystallization. |
| D02 | MOVE | S L33–34 → C L42–43 (after S L44) | F14, H1 | S L44 is where "this paper calls it Directed Authorship"; the box now follows it, and S L42's "The definition here" has a nearby definition. Text and `{#directed-authorship}` unchanged. |
| D03 | MOVE | S L108–109 → C L118–119 (after S L121) | F16, H2+H3 | At the section head the box preceded its source paragraph (S L121, cites Arvan et al., 2026) and split the heading from "Pangram's own documentation" (S L111). Trade-off: it now sits next to a paragraph with the same facts (guide redundancy trigger); REMOVE is the alternative. Body not strengthened, no citation added. AQ2, AQ3. |
| D04 | MOVE | S L155–156 → C L156–157 (after S L163) | F16, H4 | Box now follows the paragraph that carries its source (Karr et al., 2026); the section opens on the Goodhart sentence its heading sets up (S L161). Same redundancy trade-off as D03. Body unchanged (see Q05). AQ2, AQ3. |
| D05 | MOVE | S L158–159 → C L171–172 (after S L175) | F16, H4+H5 | Implication was stacked under the Evidence before any argument. It now closes the section after the confounding/evasion discussion (S L173–175) it follows from. Hedge ("can be dismissed") unchanged. No Evidence/Implication pair stays adjacent. AQ1. |
| D06 | MOVE | S L207–208 → C L254–255 (after S L258) | F17, H6+H7 | Counterpoint opened "A Better Standard" ahead of the framework it challenges. S L260 ("not the objection to overcome… the starting condition") begins the answer and S L262–284 finishes it. Text and `{#fabricated-development-records}` unchanged. Nearest alternative anchor: before S L250. AQ6. |
| D07 | REMOVE (presentational) | S L29, L107, L154 | H1, H2, H4 | Doubled blank line after a heading collapses to one where the callout beneath it moved. No rendered effect; accounts for 403 → 400 lines. |

## B. Deliberate no-change dispositions
| ID | Action | Anchor | Findings | Reason |
|---|---|---|---|---|
| K01 | KEEP | S L79–83 (C L78–82) | F15 | Valid as written: S L23 and L74 already named the fallacy, the section is named for it, the Key idea's "one question… the other" leans on the Definition's two terms, and S L85 explains straight after. S L80 repeats the frontmatter description/excerpt and S L23; kept as the thesis line. |
| K02 | KEEP | S L204–205 (C L201–202) | F17 | IWL Definition stays at the head of the section proposing the framework; S L232 elaborates its four components. Abbreviation point: Q07. |
| K03 | KEEP | S L352 | n/a | Pull-quote (single bold line), not a primitive; repeats S L93 by design. |
| K04 | KEEP (no ADD) | whole article | n/a | Chisel Fallacy, VMA, Directed Authorship, IWL have Definitions. Fabrication Paradox (S L258), consistency tax (S L268), Agency Gradient/ReTI (S L347) do not; no quota applies, nothing added. One owner option: Q07. |
| K05 | KEEP | whole article | n/a | No inline bold/italic added, removed or normalized (guide preference: selective; the article uses almost none outside tables and S L360). |
| K06 | KEEP | S L1–17 | n/a | Frontmatter, title, subtitle, thesis, tags, `doi`, `pubDate`, `dateModified` unchanged. Version/date consequences are a question only: AQ14. |
| K07 | KEEP | S L286–343 | F22 | "This Paper's Own IWL" prose and tables unchanged; classification in X01–X05. |
| K08 | KEEP | S L363–403 | F18 | Notes and References unchanged. |
| K09 | KEEP | headings, anchors | n/a | Heading sequence (13 `##`, TOC rule unaffected) and all nine `{#…}` slugs unchanged and unique; the IWL does not reference any article anchor (searched). |
| K10 | KEEP | IWL L1–275 | F21 | OPAQUE V1 and authored organization preserved. Static checks: title and dates equal the article (IWL L1–7), 13 table markers, Discovery Context notes 5 + 3 as stated (IWL L53, L112). No IWL change proposed: `iwl-proposal.md`. |

## C. F22: article excerpt vs public IWL v4
| ID | Class | Anchor | Verdict | Reason |
|---|---|---|---|---|
| X01 | condensed | S L296–297 vs IWL L66, L94 | KEEP | Same events and phases; wording recomposed, with clauses absent from the IWL ("structurally inevitable rather than arbitrary"; "VMA now framed as an error about the gradient…"). |
| X02 | illustrative | S L301–309, L333–337 | KEEP | Author/Fabricator entries have no IWL counterpart. Hooks match where checkable (v1 lacks VMA: IWL L31; Agency Gradient at v6: IWL L94). "~25-page" (S L303) is unverifiable here. |
| X03 | part verbatim, part condensed | S L317–319 vs IWL L118, L127, L136 | KEEP | S L317 rejected/adopted cells equal IWL L118, its reason is expanded. S L318 cells are recomposed (adopted text mirrors S L44, not IWL L127). S L319 cells lightly reworded, reason expanded. |
| X04 | near-verbatim plus additions | S L327 vs IWL L129 | NEEDS OWNER DECISION | Quote equals IWL L129 plus two sentences not in the public IWL ("The AI-specific framing had crept in… never AI-specific."; "That was the problem."). Not verbatim; no IWL change (invented-history risk). AQ7. |
| X05 | label | S L288, L343 | NEEDS OWNER DECISION | "a sample of the actual record" holds only partly under X01–X04. Options: leave; relabel as condensed/partly illustrative in the owner's words; align excerpt to IWL v4. Candidate leaves S L288 unchanged. AQ7. |

## D. Other source-visible discrepancies (no change made)
| ID | Action | Anchor | Reason |
|---|---|---|---|
| Q01 | NEEDS OWNER DECISION | S L329 vs L331; IWL L34, L189 | "AI-specific… in v1–v3" (three versions) vs "five or six prior versions" (S L331, IWL L189); IWL L34 puts the broadening at v4. Neither object changed. AQ8. |
| Q02 | NEEDS OWNER DECISION | S L331 "Section 5"; IWL "Section N" (see O03) | Draft numbering; the published headings are unnumbered (Sanderson sits under the 4th `##`, S L95; own-IWL section is the 9th, S L286). May be historically right for the cited drafts. AQ9. |
| Q03 | NEEDS OWNER DECISION | S L303, L337, L339, L341 vs S L343, IWL L31, L127–129, L136 | Article says these details appear "nowhere in the published paper/artifact", yet the published IWL it announces (S L343) states them. True only if "paper" means the article alone. AQ10. |
| Q04 | NEEDS OWNER DECISION | S L109 vs S L121 | Evidence says "AI-generated text", prose says "AI-assisted text"; no in-block citation. Accuracy to Arvan et al. not verifiable here. AQ4. |
| Q05 | NEEDS OWNER DECISION | S L156 vs S L163 | Evidence adds "642", "Pangram 3.2", "0.50 threshold", "64.4–80.1%", "reclassified"; the prose says 64–80% and "escaped detection". Not verifiable offline; verify against Karr et al. before any release gate. AQ5. |
| Q06 | KEEP | S L48 vs S L185 | Near-identical Tao sentence in two sections. Flag only. AQ15. |
| Q07 | NEEDS OWNER DECISION | S L142, L205, L296, L318 | "IWL" is used from S L142, "VMA"/"DA" from S L296/L318, and none is ever expanded with an abbreviation. Options: add "(IWL)" to S L205; add a Fabrication Paradox Definition using only S L256–258 wording. Not applied. AQ13. |
| Q08 | KEEP | slug; IWL L150 | Slug and IWL `parent` keep the retired title "What Pangram Actually Measures"; deliberate identity preservation. |
| Q09 | NEEDS OWNER DECISION | refs 5, 7, 22 | Ref 7 (CNN) and ref 22 (Pangram n.d.b) have no in-text citation; ref 5 (Boneh & Shoup) is cited only in Note 3. Not called defective; unchanged. AQ12. |

## E. F18 and F23 (owner-only)
| ID | Action | Anchor | Reason |
|---|---|---|---|
| O01 | NEEDS OWNER DECISION (F18) | refs 12, 16 | Ref 12 (homepage-only URL) and ref 16 (Goodhart, unlinked) stay pending verification and owner approval. T23.0 B2 unlinked inline-citation exceptions (Ahlstrom, Pangram n.d.a/b, UC Berkeley RTL) are approved and untouched. No reference changed or relabeled. AQ12. |
| O02 | NEEDS OWNER DECISION (F23) | IWL L20–21, L275 | Footer "August 2026" vs L20 "v9 (current — September 2026)"; entry dates 2026-09-22 / 2026-10-18. T23.0 I3/I5 byte-preservation precedent stands. Options: (A) preserve bytes (default), (B) owner-authorized footer-month change, (C) owner-authorized note that older dates are historical. No change proposed. AQ11. |
| O03 | NEEDS OWNER DECISION (F23) | IWL L35, L38, L91, L102, L119, L121, L151, L181 | "Section N" notes use draft numbering (Q02). Options: (A) preserve (default), (B) owner-authorized clarification. No change proposed. AQ9. |
| O04 | NEEDS OWNER DECISION (F23) | IWL L21, L275 | License "CC BY-NC 4.0" equals the sitewide value. Noted only because `site/CLAUDE.md` says per-IWL license text is reconciled away in conversion; T23.0 evidence was not readable under this ticket. Preserve unless the owner decides. AQ11. |

Priority index: F14 D01 D02 · F15 K01 · F16 D03 D04 D05 · F17 D06 K02 · F18 O01 Q09 · F21 K10 · F22 X01–X05 · F23 O02–O04.

## Evidence limits
- Static reading of the pinned blobs only. No build, render, link check, PDF or validator was run; placements are judged by reading, not by a rendered view.
- No factual or source verification and no network use (Karr, Arvan and other sources were not checked).
- Moved blocks were confirmed identical by reading the diff, not by a hash comparison.
- Guide v0.2 is a draft; "guide preference" items are heuristics, not a standard. T23.0 evidence and ROADMAP were outside the pinned inputs and not read.
- Nothing here is approved, and no fresh-agent or blind-recovery claim is made.

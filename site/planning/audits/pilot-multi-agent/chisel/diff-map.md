# Diff map: Chisel candidate vs pinned source (C1, PROPOSAL ONLY)

Source: `git show 9697dbc7310c480d4b6349104e9504107e4341a2:site/src/content/research/the-chisel-fallacy-what-pangram-actually-measures/index.md` (blob `632d2d9d…`), extracted to the OS temp folder as `source.md`. Candidate: `chisel-candidate.PROPOSED.md` in this folder.
Command: `git diff --no-index <temp>/source.md site/planning/audits/pilot-multi-agent/chisel/chisel-candidate.PROPOSED.md`. Result: 7 hunks, 18 lines inserted, 21 deleted (403 → 400 lines). The 12 non-blank deleted lines equal the 12 non-blank inserted lines (six callouts moved verbatim; checked by reading); the remaining 9 deleted and 6 inserted lines are blank separators, and the net 3 are the collapsed doubled blanks (D07).

## Raw diff

```diff
diff --git a/C:/Users/amuli/AppData/Local/Temp/claude/C--Users-amuli-Desktop-Claude-code-cybernetics-mbp/64d074ef-b338-4d83-b983-c3e031fb8a12/scratchpad/source.md b/site/planning/audits/pilot-multi-agent/chisel/chisel-candidate.PROPOSED.md
index 632d2d9..7d3725d 100644
--- a/C:/Users/amuli/AppData/Local/Temp/claude/C--Users-amuli-Desktop-Claude-code-cybernetics-mbp/64d074ef-b338-4d83-b983-c3e031fb8a12/scratchpad/source.md
+++ b/site/planning/audits/pilot-multi-agent/chisel/chisel-candidate.PROPOSED.md
@@ -26,23 +26,22 @@ The paper names the assumption that makes this error structurally tempting, show
 
 ## Two Things Getting Conflated
 
-
-> **Definition.** {#vending-machine-assumption}
-> The Vending Machine Assumption treats near-total delegation as representative of AI-assisted writing, making detected involvement appear sufficient to establish absent intellectual contribution.
-
-> **Definition.** {#directed-authorship}
-> Directed Authorship is a tool-agnostic workflow in which an author retains intellectual direction and responsibility for what an artifact claims and why, while delegating parts of its production.
-
 Consider what one-shot AI writing actually looks like. Someone opens a browser, types a request — "write a 500-word essay arguing that standardized testing improves educational outcomes" — and receives organized prose. The essay has a thesis, supporting points, and a conclusion. The process took ninety seconds. The person who produced this document has performed little or none of the intellectual work the finished artifact appears to represent. The intellectual decisions — what to argue, how to structure it, which evidence to select, whether the reasoning holds — were largely delegated along with the prose.
 
 This is the version of AI-assisted writing that most institutional concern is correctly aimed at. And it explains why textual AI detection feels intuitively sufficient: if your mental model is prompt → finished essay, then detecting AI involvement in the text looks almost equivalent to detecting that intellectual work was absent. This paper calls that mental model the Vending Machine Assumption — the belief that AI-assisted writing is this activity, and therefore that a score indicating AI involvement is evidence of absent intellectual contribution. It is the assumption that makes detector-based authorship judgments appear coherent. The assumption is not irrational — it reflects a mental model that makes sense for one way of using AI. AI-assisted work spans a broad agency gradient. The same category of tool use can range from near-total delegation to sustained human direction, judgment, and verification. The Vending Machine Assumption collapses that gradient by treating one endpoint as the category itself.
 
+> **Definition.** {#vending-machine-assumption}
+> The Vending Machine Assumption treats near-total delegation as representative of AI-assisted writing, making detected involvement appear sufficient to establish absent intellectual contribution.
+
 ### The Other Workflow
 
 Directed Authorship is not a new activity — it is a pattern that has existed across professional writing for as long as execution could be delegated. The definition here makes explicit what that pattern involves.
 
 There is a different mode of AI-assisted writing, and this paper calls it Directed Authorship. In this mode the author retains intellectual responsibility for what the artifact claims and why. The author determines the argument's structure, evaluates which evidence matters, decides what the work needs to establish, and takes responsibility for whether the resulting reasoning holds. The model or collaborator handles the lower-level work: syntax, phrasing, spell-checking, formatting — what the programming profession, which has already navigated this split, calls syntax rather than orchestration. The author concentrates on the upper-level work: argument structure, evidence evaluation, reasoning, judgment. Directed Authorship is not specific to AI — it describes any mode of production in which intellectual direction is retained by the author while lower-level execution is delegated to any capable agent, human or otherwise.
 
+> **Definition.** {#directed-authorship}
+> Directed Authorship is a tool-agnostic workflow in which an author retains intellectual direction and responsibility for what an artifact claims and why, while delegating parts of its production.
+
 Directed Authorship is a workflow definition, not a verdict on any particular author's intellectual contribution. Whether a specific author using this mode actually retained the command and responsibility it describes is exactly the question that requires inspection — and that a detection score cannot answer. A detector can identify evidence of AI involvement somewhere along the agency gradient. It cannot, from that evidence alone, locate the intellectual workflow on it.
 
 What counts as lower-level work varies by domain. Fields Medal winner Terence Tao, writing on mathematics following the 2026 International Congress of Mathematicians, describes the emerging practice: automation handles computation and proof verification; humans determine what to prove and interpret what results mean (Tao, 2026). The structure holds across the domains this paper draws on:
@@ -104,10 +103,6 @@ The Vending Machine Assumption applies a standard to AI-assisted writing that pu
 
 ## Why the Pangram Score Answers the Wrong Question
 
-
-> **Evidence.** {#peerprism-evidence}
-> PeerPrism separates idea and text provenance across 20,690 peer reviews. Under hybrid conditions, including human-origin evaluative ideas rendered in AI-generated text, detector predictions diverged from the intellectual source.
-
 Pangram's own documentation shows what the chisel looks like from the inside.
 
 ### What the detector reads
@@ -120,6 +115,9 @@ Separate research confirms that measurable linguistic regularities in LLM-genera
 
 The problem is not detection. It is what the detection is asked to settle. PeerPrism — a 2026 benchmark of 20,690 peer reviews presented at SIGIR — was explicitly designed to separate idea origin from text origin, including cases where human-origin ideas were rendered entirely in AI-assisted text. Its authors found that detector predictions diverge sharply under hybrid conditions and conclude that current detection methods conflate surface realization with intellectual contribution (Arvan et al., 2026). Once idea provenance and text provenance diverge, a detector of the second cannot settle the first.
 
+> **Evidence.** {#peerprism-evidence}
+> PeerPrism separates idea and text provenance across 20,690 peer reviews. Under hybrid conditions, including human-origin evaluative ideas rendered in AI-generated text, detector predictions diverged from the intellectual source.
+
 The Chisel Fallacy occurs not inside the detector but one step later. Pangram may answer its own question correctly. That answer is still the wrong evidence for a different question: who supplied the upper-level intellectual contribution.
 
 ### Two cases
@@ -151,17 +149,13 @@ A perfect detector of AI involvement would still not be a detector of intellectu
 
 ## When the Metric Becomes the Target
 
-
-> **Evidence.** {#detector-incentive-evidence}
-> In a study of 642 published English abstracts, Pangram 3.2 flagged 64.4-80.1% of abstract-only refinements at a 0.50 threshold. After commercial humanization, over 96% of AI-labeled rewrites were reclassified.
-
-> **Implication.** {#knowledge-dismissal}
-> When a production flag becomes a reason to stop reading, useful knowledge can be dismissed before its evidence or reasoning receives examination.
-
 The relationship between policy targets and statistical measures is what Goodhart documented in 1975: once a measure is used as a policy target, it tends to lose the information value it had when observed independently (Goodhart, 1975). The mechanism is operating here.
 
 A 2026 study from the University of Notre Dame, presented at the ACM AI Leadership Summit, tested a proxy for guideline-compliant AI assistance — light editing of the kind many institutional policies broadly permit — and submitted the results to Pangram and GPTZero. Pangram flagged 64–80% of these lightly edited pieces. Then the researchers took fully AI-generated text, ran it through a commercial humanizer, and resubmitted. More than 96% escaped detection. The authors' conclusion: "Honest AI-editing results in a higher sanction risk than humanizer-assisted evasion" (Karr et al., 2026).
 
+> **Evidence.** {#detector-incentive-evidence}
+> In a study of 642 published English abstracts, Pangram 3.2 flagged 64.4-80.1% of abstract-only refinements at a 0.50 threshold. After commercial humanization, over 96% of AI-labeled rewrites were reclassified.
+
 ### The Market's Response
 
 The market adapted almost immediately. A cottage industry of human specialists now exists on Fiverr whose entire value proposition is defeating the authentication system. One listing: "Manual Rewriting. No spinners or bots. Every word rewritten by me. Burstiness: Short and long sentences mixed naturally. AI Detector Proof. Tested before delivery. It will pass" (Fiverr, n.d.). The system ends up rewarding human execution introduced specifically to conceal the provenance it was built to detect.
@@ -174,6 +168,9 @@ The metric was also fragile before anyone tried to game it. The same study found
 
 The result is a metric squeezed from both sides: natural confounding below, strategic evasion above. A high human score no longer uniquely identifies unaided authorship.
 
+> **Implication.** {#knowledge-dismissal}
+> When a production flag becomes a reason to stop reading, useful knowledge can be dismissed before its evidence or reasoning receives examination.
+
 ## The Floor Is Already Moving
 
 The same transition has run through other domains before it reached writing. In each, automation lowered an execution floor and the argument about what constitutes meaningful contribution shifted upward. The mathematics case shows the pattern most clearly — it has run for decades and is still accelerating.
@@ -204,9 +201,6 @@ When the execution floor moves, evaluation has to move with it.
 > **Definition.** {#intellectual-work-ledger}
 > The Intellectual Work Ledger is a proposed framework linking a Development Ledger, Decision Record, Authorial Accountability, and Dependency/Proof Chain to make claims about intellectual contribution checkable.
 
-> **Counterpoint.** {#fabricated-development-records}
-> A system can generate an article, intermediate drafts, rejected alternatives, and retrospective commentary together. Their agreement can reflect a coherent generated history rather than an independent record.
-
 ### Process provenance and what it cannot do
 
 But process evidence is only the beginning. The institutional moves described above represent a genuine shift toward inspecting development rather than merely judging finished output. Working drafts, version histories, timestamps, and oral defenses can establish that a creation process occurred. They answer questions about process provenance: what happened, in what sequence, and through whose actions. But they do not necessarily answer the question this paper is most concerned with: does the claimant command the intellectual structure the artifact claims to represent?
@@ -257,6 +251,9 @@ What if the only reliable way to fake a record of intellectual work was to do th
 
 That is not a rhetorical question. It describes a real property a verification system can approach — one where the cheapest path through fabrication increasingly resembles performing the thing the fabricator was trying to avoid. This paper proposes calling it the Fabrication Paradox.
 
+> **Counterpoint.** {#fabricated-development-records}
+> A system can generate an article, intermediate drafts, rejected alternatives, and retrospective commentary together. Their agreement can reflect a coherent generated history rather than an independent record.
+
 A generative system can cheaply produce a ledger, a decision history, rejected alternatives, and a proof chain. That is not the objection to overcome. It is the starting condition. The question is what happens as the verification gets more demanding.
 
 For that fabricated record to become convincing evidence of intellectual provenance, it must remain consistent with the final claims, external evidence, chronology, decisions, alternatives, dependencies, and the claimant's responses under unpredictable scrutiny.
```

## Hunk to decisions-row map
| Hunk | Header | What it does | decisions.md rows |
|---|---|---|---|
| H1 | `@@ -26,23 +26,22 @@` | Removes both opening Definitions (S L29–35); re-inserts VMA Definition after S L38 and Directed Authorship Definition after S L44 | D01, D02, D07; F14 |
| H2 | `@@ -104,10 +103,6 @@` | Removes the `{#peerprism-evidence}` Evidence from the section head (S L107–110) | D03, D07; F16 |
| H3 | `@@ -120,6 +115,9 @@` | Inserts that Evidence after the PeerPrism paragraph (S L121) | D03; F16 |
| H4 | `@@ -151,17 +149,13 @@` | Removes Evidence and Implication from the "Metric" section head (S L154–160); re-inserts the Evidence after S L163 | D04, D05 (removal half), D07; F16 |
| H5 | `@@ -174,6 +168,9 @@` | Inserts the `{#knowledge-dismissal}` Implication at the section end (after S L175) | D05; F16 |
| H6 | `@@ -204,9 +201,6 @@` | Removes the `{#fabricated-development-records}` Counterpoint from the "A Better Standard" head (S L206–208) | D06; F17 |
| H7 | `@@ -257,6 +251,9 @@` | Inserts that Counterpoint after S L258, before S L260 | D06; F17 |

## Deliberately unchanged
- Frontmatter S L1–17 (K06) and the opening S L19–25.
- All prose, tables, headings and the `<!-- table-layout -->` markers (nothing outside the seven hunks differs).
- Definition + Key idea pair S L79–83 (K01) and IWL Definition S L204–205 (K02).
- Pull-quote S L352 (K03); no callout added (K04); no emphasis change (K05).
- Ledger excerpt S L286–343 (K07; X01–X05 are owner-facing notes only).
- Notes and References S L363–403 (K08; F18 rows O01, Q09).
- Heading sequence and all nine anchors (K09).
- The IWL (`the-chisel-fallacy.md`): not in the diff, byte-identical (K10; `iwl-proposal.md`).

## Source-visible discrepancies (recorded, no candidate change)
Q01–Q09, X04, X05, O01–O04 in `decisions.md`: none alters the candidate; each is a NEEDS OWNER DECISION or KEEP row.

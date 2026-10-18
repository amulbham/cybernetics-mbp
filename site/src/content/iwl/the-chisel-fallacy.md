---
parent: 'the-chisel-fallacy-what-pangram-actually-measures'
title: 'Intellectual Work Ledger v4 — The Chisel Fallacy: What AI Detection Misses and What the Intellectual Work Ledger Gets Right'
publicationState: published
pubDate: 2026-09-22
dateModified: 2026-10-18
---

## Document Identity

| Item | Detail |
| --- | --- |
| Title | Intellectual Work Ledger v4 — The Chisel Fallacy: What AI Detection Misses and What the Intellectual Work Ledger Gets Right |
| Author | Amul Bham |
| ORCID | orcid.org/0009-0009-7660-4031 |
| Artifact version | v9 (current — September 2026) |
| Development span | Early August 2026 – September 22, 2026 (~7 weeks) |
| Working sessions | Approximately 6 (exact boundaries not reconstructed; v1–v9 serve as primary temporal anchors) |
| Total drafts produced | 9 (v1–v9) |
| IWL version | v4 — September 2026 |
| License | CC BY-NC 4.0 |

## Version History

Compact record of the paper's macro development arc across nine drafts. Development Ledger entries document the individual intellectual events; this table shows what kind of development each version represented and whether it received external position 3 review.

| Draft | Primary development | Character | Position 3? |
| --- | --- | --- | --- |
| v1 | First complete draft assembled; structure, sources, and cases in place; Vending Machine Assumption absent | Assembled but conceptually incomplete | Yes |
| v2 | VMA coined; DA definition refined; lower/upper table added; heading structure revised | Core conceptual development | No — internal |
| v3 | Mathematics arc added; programming as throughline across 5 locations; publishing precedent separated; glossary and 6-domain table added | Structural expansion | Yes |
| v4 | Domain examples compressed to mathematics + programming; DA broadened to tool-agnostic; Stankova claim softened; closing narrowed to theorem | Architectural precision | Yes |
| v5 | "Show your work" hook added; Section 10 demonstrates Author's Note and corroboration asymmetry; Agency Gradient seeded; IWL v1 produced | Accessibility and IWL companion | No — internal |
| v6 | Agency Gradient incorporated; domain table narrowed to 3 rows; historical inevitability language removed; closing de-triumphed; Discovery Context reclassification | Final precision pass | Yes |
| v7 | Three publication blockers corrected (chronology, TechCrunch, Goodhart attribution); five strengthening additions (IWL catches both workflows, four-questions table, detection punishes disclosure, process+IWL, FP delegation dilemma) | Blocker corrections + structural additions | Yes |
| v8 | Section 10 complete rewrite with Constraint Asymmetry format; DA tool-agnostic as primary Discovery Context demonstration; SSRN entry scrubbed; Fabrication Paradox demonstrated concretely | Section 10 demonstration pass | No — internal |
| v9 | Title changed; costly signaling (Spence 1973, Zahavi 1975) incorporated as FP theoretical grounding; consistency tax named; AI-assisted fabrication explicitly foreclosed; economic vs cryptographic bar stated; Future Directions section added (Agency Gradient + ReTI) | Theoretical grounding + future directions | No — internal |

The VMA — the paper's most important conceptual contribution — was absent from v1. The costly signaling grounding for the Fabrication Paradox arrived at v9. The ReTI concept and the consistency tax name were also products of v9. The arc from v1 to v9 shows a pattern common to genuine intellectual work: the argument reveals what it was missing at each stage by being complete without it.

## Methodology Note

This paper was developed across approximately six working sessions spanning early August through September 22, 2026 — approximately seven weeks. Claude Sonnet 4.6 (Anthropic) served as the primary development partner throughout.

Position 3, as used here, refers to an observer position with no prior context relative to the artifact under review — a concept developed in the author's ongoing work on the Observer Triad framework (forthcoming). Operationally: each draft sent for review went to a fresh instance of Grok 4.6 High (xAI) or ChatGPT Sol 5.6 (OpenAI) that had not participated in any prior development session and encountered the paper cold. This cold read is what distinguishes position 3 review from ordinary editorial feedback.

A qualification on reviewer independence: while these instances are different systems from different organizations than the primary development partner, all three are large language models with potentially overlapping training distributions. The review is best described as context-independent and cross-model rather than genuinely independent. The author handled orchestration: conceptual decisions, argument direction, example selection, and structural choices. Review instances handled precision: logical consistency, claims violating the paper's own standard, and sources requiring independent verification.

## Layer 1 — Development Ledger

Meaningful intellectual developments that materially changed the artifact. Five entries carry Discovery Context notes — retrospective authorial commentary, non-verifying. Their evidentiary value depends on whether their specifics contact independent anchors that can be checked.

| Phase | Event | What changed | Why it mattered |
| --- | --- | --- | --- |
| v1 phase | Chisel Fallacy location revised | Moved from inside Pangram's architecture to downstream inference from its score | The paper is stronger when Pangram may be entirely correct and the fallacy still holds; argument survives a hypothetically perfect detector |
| v1 phase | Three factual corrections | CTO not CEO (Emi); 1.3M not 600K words (Sanderson); Karpathy April 2026 not February 2025 | Accuracy matters when specific facts are cited as evidence; all three caught in source verification passes |
| v1 phase | Commonwealth case discovered | Foundation inspected working drafts, timestamped documents, and notes; cleared all regional winners | An institution had already deployed a primitive real-world IWL — stopped asking the detector and inspected the development record instead |
| v2 phase | Fabrication Paradox reformulated | From "cost of valid fabrication equals cost of honest production" to two-gradient mechanism: fabrication-cost gradient and epistemic-cost gradient | Previous formulation overclaimed mathematical equivalence; revised version proposes a gradient and mechanism rather than a theorem |
| v2 phase | Naming arc resolved | Epistemic Ledger → Provenance Ledger → Intellectual Work Ledger | Two prior-art collisions found before IWL was confirmed clean; naming took four iterations |
| v2 phase | Queloz & Beckmann paper selected | arXiv:2609.04962 selected over "Mechanistic Indicators of Understanding in LLMs" | Correct paper makes a general claim about understanding as relational structure — not AI-specific — which is what the IWL argument requires |
| v2 phase | v1 assembled | First complete draft produced | First version-controlled artifact; beginning of the version record |
| v2 phase | VMA coined | Missing causal antecedent identified and named as the Vending Machine Assumption | v1 distinguished two workflows but could not explain why critics feel detection is sufficient; VMA closed the logical gap |

> Discovery Context / Authorial Rationale — VMA coined:  This was the missing piece that made the paper click. Before naming this concept, the paper felt like it was circling something without being able to touch it. I have learned to recognize this feeling — when something is hard to even talk about because you are missing the words for it, that is the signal that a named concept is needed. The realization formed from watching how people criticize AI writing. Everyone uses AI differently. AI is a tool whose value is determined by the user. We all carry a different mental model of what AI-assisted work is doing. That needed to be named before the paper could explain why detection feels sufficient when it is not.

| Phase | Event | What changed | Why it mattered |
| --- | --- | --- | --- |
| v3 phase | Mathematics sub-beat added | Historical floor migration traced through computation, symbolic manipulation, proof verification, AI discovery; Tao ICM 2026 as primary citation | Provided the longest documented floor migration history of any domain; grounded the structural argument in a century-long pattern |

> Discovery Context / Authorial Rationale — Mathematics sub-beat added:  We hit a wall where adding more examples was not making the paper more convincing — quantity was diluting rather than strengthening. Creative domains like music raise contested authorship questions that distract from the core argument. The mathematics case arose organically. OpenAI released a claimed solution to Navier-Stokes in early September 2026, and I had been tracking the AI-in-mathematics conversation since August. The connection clicked: mathematics is the same abstraction the paper is making about writing, but happening at a different intellectual level. In math, what got delegated was the traversal of a long-standing problem — the syntax of proof. The real work was figuring out what it meant. There is also a practical dimension: the SEO part of my brain recognized this was an active topic. The mathematical connection is genuine and the distribution value is real — I do not think those are in tension.

| Phase | Event | What changed | Why it mattered |
| --- | --- | --- | --- |
| v2-v3 phase | v2 assembled | Second complete draft incorporating VMA, revised DA definition, programming thread | Version milestone; first draft with VMA as an explicit coined term |
| v5 phase | "Show your work" hook added | Introductory hook paragraph added to The Intellectual Work Ledger subheading | Gives the reader the core insight before the technical explanation; reader arrives at the architecture already understanding why such a system would be useful |

> Discovery Context / Authorial Rationale — "Show your work" hook added:  On one of the final full read-throughs, I hit the IWL section and just felt the paper asking too much. The reader had already done real work to follow the argument, and here was another wall of text asking them to absorb a new concept. It felt like homework. I took a step back and asked where this concept comes from at its most basic level. What is the IWL, underneath all the architecture? It is show your work. The analogy injects the core insight into the reader's head before I go into the specifics, in a form they already understand and trust. Sometimes the right move is to go back to first principles, not forward into more complexity.

| Phase | Event | What changed | Why it mattered |
| --- | --- | --- | --- |
| v3-v4 phase | Programming thread added as throughline | Programming case added in five locations: Opening, Section 2, Section 4, Section 8, Closing | Programming is the closest structural analog to writing — text production, institutional enforcement, already-shifted evaluative weight |
| v4 phase | Publishing precedent separated into standalone section | What was one paragraph became its own section: "The Delegation That Was Already There" | Strongest direct argument deserved its own structural weight |
| v3-v5 phase | v3, v4, v5 assembled | Three additional complete drafts incorporating compression, programming thread, show-your-work hook, IWL v1 companion document | Version milestones; each a discrete inspectable state |
| v6 phase | Agency Gradient coined | Concept identified as upstream from VMA; named as the empirical fact that AI-assisted work spans a broad spectrum of retained human agency; identified as path to a future paper | Named the missing upstream variable; paper created the conceptual path to the next investigation |

> Discovery Context / Authorial Rationale — Agency Gradient coined:  The core insight arrived after the paper was largely complete. AI is a fundamentally open-ended tool with no social agreement on what "using AI" means. Two people using the exact same model on the exact same task can produce outcomes that are almost incomparable: one is pulling a lever and hoping, the other is directing a complex argument with sustained intellectual judgment. I first named this "AI Variance" but that sounded like model stochasticity. Then "Agency Variance" — but variance is still statistical. "Agency Gradient" landed: it has directionality, describes the axis rather than just the range. This is probably a paper on its own. This paper created the path to that one.

| Phase | Event | What changed | Why it mattered |
| --- | --- | --- | --- |
| v6 phase | v6 assembled — final development pass | Agency Gradient, narrowed domain table, de-triumphed closing, corroboration framing in Section 10 | Version milestone; final structural state |
| v7-v8 phase | IWL v1, v2, v3 produced | Companion document developed through three versions alongside the paper, updated with each paper revision cycle | IWL demonstrates paper's relational thesis; Layer 4C shows the argument's dependency structure; Layer 4D maps concepts within discourse |
| v9 phase | Costly signaling identified as theoretical grounding | Spence (1973) and Zahavi (1975) identified as established mechanism underlying the Fabrication Paradox cost asymmetry; FP upgraded from proposed mechanism to established mechanism applied to new domain | The IWL is a costly signal in the Spence sense — honest because the genuine type's production cost is lower than the faking type's; this is not analogical borrowing but an instance of a named canonical mechanism |
| v9 phase | Consistency tax named | Cross-channel multiplicative cost structure given explicit name; the two gradients shown to couple; reality identified as the cheapest source of consistency | Explains why the Fabrication Paradox works at a more mechanistic level — the cost is multiplicative not additive because the fabricator must satisfy cross-channel consistency simultaneously; naming it makes the design rule explicit |
| v9 phase | ReTI conceived — temporal implementation of consistency tax principle | IWL covers content consistency (what was decided and why); ReTI identified as covering temporal plausibility (when, with what gaps, with what reversals); together they close both consistency axes | The paper created the conceptual path to a second instrument; the consistency tax observation suggested the design rule for it |

> Discovery Context / Authorial Rationale — ReTI conceived:  The consistency tax observation pointed directly to what a temporal channel would look like. The IWL gives you content consistency — what was decided, in what order, with what alternatives. But a fabricator could still construct a plausible content ledger after the fact. What makes retrospective fabrication specifically hard is temporal plausibility: months of spread-out, irregular, timestamped commits are annoying to fake, and the commits you would delete — the dead ends, the reversals — are the strongest authenticity signals, because a fabricator writes a highlight reel. The unflattering commit is the IWL's Discovery Context note running in real time. Once that connection formed, ReTI was obvious: a private-by-default researcher feed, hash-chained, notary-attested, reversals included. Every temporal channel should cost the honest researcher nothing and the fabricator compounding amounts. That is the design rule.

## Layer 2 — Decision Record

What was rejected and why. Three entries carry Discovery Context notes.

| Decision point | Rejected | Adopted | Reason |
| --- | --- | --- | --- |
| Chisel Fallacy location | Pangram itself commits the fallacy | Fallacy occurs in downstream inference from Pangram's score | The paper is stronger when Pangram can be entirely correct and the fallacy still exists; argument does not depend on the tool being wrong |
| Section 2 anchor example | Ghostwriting as the historical precedent | Satoshi/Bitcoin white paper | Bitcoin demonstrates origin ≠ validity without exceptions; ghostwriting carries contested disclosure norms; Bitcoin was already in the paper for proof-of-work — second independent property noticed |

> Discovery Context / Authorial Rationale — Section 2 anchor example:  I was trying to prove — or reconstruct in the reader's head — that a piece of work can have intellectual value regardless of who put the syntax together. The core observation I kept seeing: once something gets bucketed as AI-assisted, the work itself gets completely ignored. I had Bitcoin later in the paper as theoretical backing for the Fabrication Paradox. During a read-through, the connection formed. The raw thought was something like: we literally do not know who Satoshi is, yet Bitcoin's white paper and blockchain technology are foundational. Nobody disputes it. Nobody cares who Satoshi is. Coming out of that section I wanted the reader to understand that intellectual value and syntax production are two separate things.

| Decision point | Rejected | Adopted | Reason |
| --- | --- | --- | --- |
| DA definition scope | "AI-assisted production in which the author delegates lower-level work" | Tool-agnostic: "any capable agent — human collaborator, AI model, or otherwise" | Sanderson is the paper's primary demonstration and does not involve AI; AI-specific definition excluded the most important example |

> Discovery Context / Authorial Rationale — DA definition scope:  Throughout the earlier drafts, DA had been implied rather than clearly stated — a concept I was actively engaging in, but the definition had not caught up with what I actually meant. The definition clarification came from a simple pressure test. I looked at Sanderson and asked: does our current definition include what he is doing? The answer was no — "AI-assisted production" excluded him by definition. The concept was right but the words were wrong. Once that was clear, the definition wrote itself.

| Decision point | Rejected | Adopted | Reason |
| --- | --- | --- | --- |
| Closing claim | "The question answers itself" when syntax is AI and ideas are human | Narrow theorem: execution-layer evidence cannot by itself settle intellectual contribution | Presupposes the conclusion without demonstrating it; the narrow theorem is what the paper actually demonstrated |
| Domain example quantity | Six domains (programming, math, music, Yates, Xania Monet, Karpathy) | Two primary domains: mathematics and programming | Each section should add a new constraint to the argument, not restate the thesis in a new domain; quantity was diluting rather than strengthening |
| Xania Monet treatment | Presented as "doing Directed Authorship" | Dropped entirely | Cannot establish from public record which intellectual workflow she used; claiming DA as a verdict makes the same inferential move the paper criticizes |
| Yates classification | Labeled as VMA applied to credentials | Adjacent substitution error — related but distinct mechanism | VMA is specifically about AI-detection evidence used as authorship verdict; credential absence is a different instrument making the same substitution |
| Navier-Stokes treatment | "A settled landmark" | Hedged: "a claimed solution, if it stands, awaiting Clay Institute review" | Announced one week before this draft was considered complete; pending verification; too live for landmark framing |
| Stankova claim | "Stankova was doing Directed Authorship" | "Stankova's disclosed use is consistent with Directed Authorship" | DA is a workflow definition; claiming it as a verdict makes the same inferential move the paper criticizes |

> Discovery Context / Authorial Rationale — Stankova claim:  The Stankova case came from just reading the news. It worked because what happened was picture perfect: her article about students being underprepared was completely displaced by questions about her AI use. The softening — from "was doing Directed Authorship" to "consistent with Directed Authorship" — was a precision fix I had not caught myself. My position 3 methodology flagged it; I recognized immediately it was right. The paper cannot determine from outside what she was doing intellectually. The example still works without needing to settle what she was doing.

| Decision point | Rejected | Adopted | Reason |
| --- | --- | --- | --- |
| "Decisions were not made by anyone" | Categorical claim about one-shot intellectual delegation | "The intellectual decisions were largely delegated along with the prose" | One-shot use still involves decisions; categorical claim was too strong |
| Historical inevitability language | "The question has already been answered" / "expertise migrated upward anyway" | Descriptive: "the pattern held" / "the work recognized as the point was at the layer above" | Paper does not need to claim historical inevitability; descriptive framing is accurate and survives the objection that the question is still contested |
| Title: Pangram in main title | "The Chisel Fallacy: What Pangram Actually Measures" | "The Chisel Fallacy: What AI Detection Misses and What the Intellectual Work Ledger Gets Right" | The paper had evolved beyond the Pangram moment; the IWL is the primary contribution; the new title finds the reader trying to establish intellectual provenance standards; Pangram drops to a case study in the opening paragraph |
| Section 10 SSRN entry | O'Keefe and Lamba as Development Ledger examples of constraint contact | Removed; VMA coined and DA tool-agnostic selected as primary examples | Uncertainty about whether those papers exist makes the example unusable; catching a potential hallucination is quality control, not intellectual provenance |

## Layer 3 — Authorial Accountability

Written by the author directly.

### Statement of intellectual direction

This paper was personal. I am an independent researcher who uses AI as a thinking and writing partner. What motivated the paper was watching something happen in real time that troubled me: work created by people using AI thoughtfully was being dismissed or ignored not because of its content but because of how it was produced. I saw the Stankova case. I tracked the Yates case. I watched the reaction to Tyga's album. I read the general contempt for AI slop and saw tools like Pangram being celebrated as a solution. A wall of separation was forming. What I had not named yet was why. Only after starting the paper did I realize the source: a mental model I had already internalized but had not brought to the front of my mind. I had a lot loaded in the chamber. The paper did not feel forced. Those are usually the conditions under which the best work happens.

### Claims the author takes responsibility for

The Chisel Fallacy as a named category error. The VMA as the antecedent that makes the fallacy appear coherent — derived from behavioral observation. Directed Authorship as a tool-agnostic workflow definition. The Agency Gradient as the upstream empirical fact. The IWL as a costly signal — the security property follows from the cost differential between genuine documentation and fabrication. The Fabrication Paradox as an established mechanism (costly signaling) applied to a new domain — not a newly proposed mechanism. The consistency tax as the explanation for why fabrication cost is multiplicative rather than additive.

### Disclosure of AI involvement

This paper was developed across approximately six working sessions using Claude Sonnet 4.6 (Anthropic) as the primary collaborative writing and research partner. I retained final decision authority over which arguments, concepts, examples, claims, and structural changes entered the paper. Every major conceptual decision — the Chisel Fallacy, DA, the VMA, the Agency Gradient, the IWL architecture, the Fabrication Paradox, the costly signaling grounding, the consistency tax, ReTI — was set by me. This paper is, in the terms it proposes, a product of Directed Authorship.

Grok 4.6 High (xAI) and ChatGPT Sol 5.6 (OpenAI) served as position 3 reviewers — context-independent, cross-model review. Several material corrections documented in the Decision Record originated from this process.

### What the author knows under challenge

I can explain without consulting the paper or ledger: the Chisel Fallacy; the VMA; why DA predates AI; the Fabrication Paradox mechanism including the Spence model; why the Agency Gradient is upstream from the VMA; the consistency tax and why it is multiplicative; the ReTI design rule and why the unflattering commit is the strongest authenticity signal. What the paper genuinely does not settle: whether the IWL would work at scale, whether the consistency tax holds against sophisticated AI-assisted fabrication at very large scale, whether the VMA accurately describes all critics versus a significant portion.

### Challenge Surface

The author invites challenge on the following. Contact: amul.bham@gmail.com

1.  Why did the Chisel Fallacy move from inside Pangram's architecture to downstream inference? What would the argument look like if Pangram were making the fallacy rather than institutions using it?

2.  Why was Satoshi/Bitcoin superior to ghostwriting as the Section 2 anchor?

3.  What evidence would falsify the Vending Machine Assumption as the primary explanation for why critics treat detection as sufficient for authorship judgments?

4.  What breaks in the Fabrication Paradox if the IWL challenge questions are predictable rather than varied? Does the costly signaling mechanism hold if an adversary knows the challenge structure in advance?

5.  Which claim in Layer 4A is currently least externally supported?

For challengers interested in fabrication cost specifically: the entries with the highest asymmetry are the VMA (requires constructing a full prior draft state) and DA broadened (requires holding an internal inconsistency across five or six version states while constructing a Discovery Context note whose specific register is hard to engineer deliberately). These are where the consistency tax is most visible — where the fabricator must maintain cross-channel consistency simultaneously across version states, decisions, Discovery Context notes, and responses under challenge. The cost is multiplicative rather than additive, and the theoretical grounding is costly signaling: Spence (1973) demonstrated that a signal is honest when the genuine type's production cost is lower than the faking type's. The IWL is that signal applied to authorship.

### Tools and Infrastructure

Primary development environment  Claude Sonnet 4.6 (Anthropic). All sessions in Claude.ai across August–September 2026. Chosen deliberately: not overly verbose; output felt closer to the author's voice than alternatives.

Output and version control  Microsoft Word (.docx) — each complete draft compiled as a standalone file (v1 through v9). Files carried into Google Docs for cloud storage, annotation, and read-through between sessions.

Position 3 review  Grok 4.6 High (xAI) and ChatGPT Sol 5.6 (OpenAI). Submitted as fresh instances with no prior context — context-independent, cross-model review.

## Layer 4 — Dependency / Proof Chain

Four subsections: core claims with epistemic status, novel concepts derivation records, argument dependency chain, and discourse position map.

### 4A — Core Claims Traced

Epistemic status categories: Verified external fact · Externally supported premise · Internal inference · Established mechanism applied to new domain · Open hypothesis

| Claim | Depends on | Source / Evidence | Verif. | Epistemic status |
| --- | --- | --- | --- | --- |
| Detection insufficient to settle intellectual contribution | Textual provenance ≠ intellectual contribution | PeerPrism SIGIR 2026 (10.1145/3805712.3808602); PNAS 2025 (10.1073/pnas.2422455122) | ✅ | Externally supported premise |
| VMA explains why detection appears sufficient | VMA as proposed explanatory model — derived from behavioral observation | Logical derivation from observed pattern; author's observation across documented cases | Internal | Internal inference |
| Both workflows produce detection flags at high rates | Guideline-compliant editing not distinguishable from vending machine use | Karr et al. arXiv:2608.11256 (64–80% flag rate) | ✅ | Externally supported premise |
| Publishing delegation was always accepted as compatible with authorship | Editorial tradition separates intellectual direction from execution | Sanderson / Dragonsteel Books (2025); general editorial convention | ✅ + convention | Externally supported premise |
| Goodhart applies to AI detector as compliance target | Optimizing against a metric corrupts the signal | Karr et al. empirical (96%+ humanizer evasion); Craftysid Fiverr listing | ✅ | Externally supported premise |
| Programming has shifted evaluative weight toward orchestration | Profession publicly accepts AI-generated implementation as compatible with professional output | Patel/Cisco Feb 2026 (Euronews); Nadella + Pichai April 2025 (TechCrunch); Collins WOTY 2025 | ✅ | Externally supported premise |
| Mathematics shows century-long floor migration | Expertise migrates upward with each automation of a lower layer | Tao ICM 2026 arXiv:2608.16753; Navier-Stokes Sep 2026 — hedged pending Clay | ✅ | Externally supported premise |
| IWL raises fabrication cost via relational verification + costly signaling | Understanding requires relational structure; relational structure harder to fabricate than propositional possession; costly signaling: genuine type's production cost < faking type's | Queloz & Beckmann arXiv:2609.04962; Spence (1973); Zahavi (1975) | ✅ all three | Established mechanism applied to new domain |
| Fabrication Paradox: successful counterfeit requires target competence; consistency tax: multiplicative not additive | Costly signaling as established mechanism; consistency tax: cross-channel consistency must be satisfied simultaneously, costing the fabricator multiplied effort | Spence (1973); Zahavi (1975); Bellare & Goldreich (1992) as operational mechanism; Nakamoto (2008) for cost-raising design; consistency tax as named mechanism for why cost is multiplicative | ✅ Canonical | Established mechanism applied to new domain |
| Commonwealth precedent: process beats detection | Foundation examined development record, reached verdict without detector | Commonwealth Foundation statement: commonwealthfoundation.com/2026-cw-prize-update/ | ✅ | Verified external fact |

### 4B — Novel Concepts Derivation Records

| Concept | Derives from | Distinguished from |
| --- | --- | --- |
| Chisel Fallacy | Detection tools identify execution-layer signals; execution ≠ intellectual contribution; promoting one as verdict on the other is a named category error | Not general AI criticism; not a claim detectors are inaccurate; not a claim about Pangram's intent — Pangram can be correct and the fallacy still holds |
| Agency Gradient | AI is a fundamentally open-ended tool with no social agreement on what "using AI" means; two people using the same model can produce incomparable outcomes; this continuous spectrum of retained human agency was the unnamed variable VMA was implicitly ignoring | Not AI variance (sounds like model stochasticity); not a binary; not a proven measurement scale — a conceptual axis |
| Directed Authorship | Publishing and editorial tradition shows intellectual direction was always separable from execution; AI made it affordable and visible; Sanderson is the primary demonstration; confirmed clear as a formal term | Not AI-specific; not defined by iteration count or friction; not a verdict on any specific author's contribution; a workflow definition only |
| Vending Machine Assumption | Prompt→finished essay mental model makes detection appear to answer the authorship question; derived from observing behavioral patterns in how critics respond to AI-involved work; VMA collapses the Agency Gradient to its low end | Not an accusation; not what detector designers intend; not claimed as universal |
| Intellectual Work Ledger | Research citation practice and methodology sections already trace claims to sources; IWL extends to intellectual provenance; "show your work" is the universal intuition; operationalizes costly signaling as applied to authorship; security property is the Spence mechanism | Not a changelog; not process provenance (IETF PoP); not a transcript — curated intellectual provenance; the security property is costly signaling, not novelty of mechanism |
| Fabrication Paradox | Spence (1973) costly signaling and Zahavi (1975) handicap principle as the established mechanism — a signal is honest when genuine type's production cost < faking type's; consistency tax as the explanation for why cost is multiplicative (cross-channel consistency must be satisfied simultaneously); Bellare & Goldreich (1992) PoK as operational mechanism for challenge-based verification; Nakamoto (2008) for cost-raising design; AI-assisted fabrication explicitly foreclosed — a system can generate constraint-satisfying entries, but the named claimant still answers under unpredictable real-time scrutiny the AI cannot anticipate | Not: a newly proposed mechanism — costly signaling is established since 1973; the contribution is applying it to intellectual provenance verification; not: fabrication is impossible; not: costs are always equivalent; not: AI-assisted fabrication defeats the mechanism — Authorial Accountability is what forecloses it |
| Constraint Contact | Verification should test whether claimed reasoning encountered external constraints at both node level (does the source exist?) and relational level (does it support the claim?) | Not just citation checking — relational contact is what distinguishes intellectual provenance from ordinary provenance logging |

### 4C — Argument Dependency Chain

The paper's own argument rendered as typed relational structure.

| From | Relationship | To | Note |
| --- | --- | --- | --- |
| Agency Gradient (empirical fact) | COLLAPSES_TO → | Vending Machine Assumption | VMA treats the low-agency endpoint of the gradient as representative of the whole category |
| Vending Machine Assumption | EXPLAINS_WHY → | Chisel Fallacy appears coherent | Without VMA, using detection as authorship verdict feels insufficient; with VMA, it appears to follow logically |
| Chisel Fallacy | REQUIRES as enabling premise | Vending Machine Assumption | Without VMA the fallacy is immediately recognizable as a category error |
| PeerPrism 2026 (Arvan et al.) | ESTABLISHES → | Text and idea provenance can diverge | Hybrid cases show detector predictions fail precisely where intellectual contribution is present but text is AI-assisted |
| PeerPrism finding | SUPPORTS REFUTATION OF → | Detection score settling intellectual contribution | Once provenance diverges, detector of text origin cannot settle idea origin |
| Karr et al. 2026 | ESTABLISHES → | Both workflows produce detection flags at high rates | 64–80% flag rate for guideline-compliant editing; detector cannot distinguish by workflow |
| Commonwealth case | DEMONSTRATES → | Process evidence can distinguish where detection cannot | Foundation inspected development record instead of detector output |
| Process evidence limitation | MOTIVATES → | IWL architecture | Process provenance shows sequence; intellectual provenance requires relational structure — different axis |
| Queloz & Beckmann 2026 | GROUNDS → | Relational understanding as the IWL's target property | Understanding = robust relational model; IWL makes portions of that structure inspectable |
| Spence (1973) + Zahavi (1975) | GROUNDS → | Fabrication Paradox security property — costly signaling | Signal is honest when genuine type's production cost < faking type's; consistency tax explains why cost is multiplicative |
| Relational verification + unpredictable challenge + consistency tax | GENERATES (proposed) → | Fabrication Paradox | Cross-consistent challenge forces recovery of relational structure; consistency tax makes cost multiplicative across channels |
| Floor migration: Math + Programming cases | ILLUSTRATES → | Lower/upper split is structural pattern across domains | Shows the argument predates current AI capabilities |

### 4D — Discourse Position Map

Standard research program fixture. Maps each coined concept against existing and converging territory. Format adapted from the author's parallel work on the mathematics framework paper.

| Concept | Existing / converging territory | What this paper does with it | Novelty position |
| --- | --- | --- | --- |
| Chisel Fallacy | Academic integrity literature discusses proxy evidence and execution-vs-understanding distinctions; philosophy of authorship addresses tool-use questions; no prior term found naming this specific substitution | Names and defines the specific category error; makes it applicable to AI detection policy; shows it follows structurally from the VMA as a causal consequence | Candidate novel framing. The underlying problem has relatives; this name and causal chain do not appear in prior literature found |
| Agency Gradient | SAE automation level taxonomy; cognitive offloading / distributed cognition (Clark & Chalmers 1998); human-in-the-loop research | Applies the gradient concept specifically to authorship evaluation; frames it as the upstream empirical fact the VMA ignores | Convergence + distinctive application. Gradient framing has clear relatives; this specific application to authorship and the VMA causal chain is the contribution |
| Directed Authorship | Rodrigues (2026) Apt Curation Model is the closest named predecessor; cognitive offloading literature; editorial delegation norms in publishing | Names the pattern explicitly as tool-agnostic; connects to historical publishing delegation; confirmed clear as a formal coined term | Convergence + distinctive naming. Rodrigues is the strongest prior; "Directed Authorship" as a tool-agnostic term with this specific mechanism is this paper's contribution |
| Vending Machine Assumption | AI mental models research; automation bias literature; no prior term found naming this specific model as producing downstream policy error | Names the specific mental model as the causal antecedent of the Chisel Fallacy; makes it the structural explanation for why detection appears to answer authorship questions | Candidate novel: specific causal role. Mental model research has the phenomenon; no prior term found naming this model as producing the downstream policy error |
| Intellectual Work Ledger | Research data management; pre-registration practices; journalism source documentation; IETF Proof of Process (2026); Spence (1973) costly signaling as the security mechanism | Proposes a four-layer constraint architecture for intellectual provenance specifically; operationalizes costly signaling as the security property; distinguishes intellectual command from process provenance | Proposed architecture. Individual components have precedents; the specific four-layer intersection targeting intellectual command — grounded in costly signaling — is the contribution |
| Fabrication Paradox | Spence (1973) costly signaling is the established theoretical grounding; Zahavi (1975) handicap principle; consistency tax as the explanation for multiplicative cost; Bellare & Goldreich (1992) proof-of-knowledge as operational mechanism | Names the application of costly signaling to intellectual provenance verification; shows the IWL is a costly signal; names the consistency tax as the mechanism explaining multiplicative cost | Established mechanism applied to new domain. The mechanism is Spence (1973); the application to intellectual provenance verification and the consistency tax naming are this paper's contributions |
| Constraint Contact | Reliabilism in epistemology (Alvin Goldman); testimony and source evaluation literature; journalism fact-checking practice | Names two distinct verification levels (node and relational); applies specifically to intellectual provenance claims | Distinctive synthesis and naming. The two-level distinction has philosophical relatives; this application and naming in the IWL context is the contribution |
| Agency Gradient → future paper | AI capability literature; AI governance literature on use-case variability; AI mental models research | Identified as upstream of VMA; flagged as standalone paper topic this paper created the path to | Open research direction. Not a contribution of this paper; a direction this paper created |
| ReTI (Researcher Timeline) | Git-based manuscript tools (Manubot — git manuscripts without narrative feed); Electronic Lab Notebooks (structured entries that kill in-the-moment capture); OpenTimestamps (notary primitive without product around it); existing reproducibility framing (can I reproduce this? vs did a mind actually do this?) | Identifies temporal consistency as a distinct channel from content consistency; names the design rule (every channel costs honest researcher nothing, fabricator compounding amounts); identifies the unflattering commit as the strongest authenticity signal because fabricators write highlight reels; frames around proof of intellectual work rather than reproducibility | Proposed architecture; future research direction. Not a contribution of this paper — created by this paper's intellectual work. The consistency tax observation pointed directly to what the temporal channel would look like. |

---

Intellectual Work Ledger v4 — The Chisel Fallacy · Amul Bham · August 2026 · CC BY-NC 4.0

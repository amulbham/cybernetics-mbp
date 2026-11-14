---
title: 'Cybernetics and the Structural Science of Self-Organizing Systems'
subtitle: 'A Cognitive Physics Framework'
format: 'paper'
category: 'cybernetics'
pubDate: 2026-11-13
doi: 'https://doi.org/10.5281/zenodo.24120332'
scholarly:
  versionDoi: 'https://doi.org/10.5281/zenodo.24120333'
  printAuthorNote: 'Amul Bham is a systems researcher working across cybernetics, self-organizing systems, AI systems architecture, and cognition. His research examines how complex systems maintain organization, how knowledge becomes reliable, and how these principles can inform the design of verifiable AI systems.'
description: "Self-organizing systems — biological cells, financial markets, immune systems, ant colonies, cognitive systems — maintain organized structure without requiring a central coordinating authority across different scales and substrates. This paper proposes Cognitive Physics as the structural science of self-organizing systems, grounded in seven candidate structural invariants. The framework connects cybernetic accounts of feedback and regulation with complexity-science accounts of emergence, asking whether different mechanisms satisfy common organizational requirements across systems. Drawing on thermodynamics, information theory, dynamical systems, systems biology, and complexity science, it proposes that all seven conditions are jointly necessary for self-organization. The paper develops prospective tests of these ideas and uses the framework to distinguish possible causes of hallucination, sycophancy, and long-context failure in AI systems."
excerpt: 'Seven candidate conditions for self-organization — examined across biology, economics, and artificial intelligence.'
tags:
  - cybernetics
  - self-organizing systems
  - cognitive physics
  - complexity science
  - cognition
  - seven invariants
  - attractor dynamics
  - conservation law
---
*Cognitive Physics Series · Paper C · Companions: Paper A (Bham, 2026a), Paper B (Bham, 2026b)*

---

## Abstract

Self-organizing systems — biological cells, financial markets, immune systems, ant colonies, cognitive systems — maintain organized structure without requiring a central coordinating authority across different scales and substrates. Wiener's 1948 cybernetics established a foundational study of control and communication in animals and machines; Ashby's work developed explicit accounts of self-organizing systems. These research traditions investigated feedback, homeostasis, and regulation. Cybernetics and its successors developed substantial theories of feedback, regulation, and emergent organization. Yet a generally accepted account connecting the structural requirements of self-organization across different substrates remains contested. A 2025 review illustrates the continuing conceptual debate, while treating self-organization as a description that depends partly on the observer's purpose and scale (Gershenson, 2025).

**This paper proposes Cognitive Physics as the structural science of self-organizing systems, grounded in seven candidate structural invariants.** The framework connects cybernetic accounts of feedback and regulation with complexity-science accounts of emergence, asking whether different mechanisms satisfy common organizational requirements across systems. Drawing on thermodynamics, information theory, dynamical systems, systems biology, and complexity science, it proposes that all seven conditions are jointly necessary for self-organization. The paper proposes nonexclusive functional correspondences between familiar cybernetic mechanisms and the seven conditions. Feedback can support input-output accountability; homeostasis can return a system toward a viable regime; and regulatory mechanisms can help coordinate conflicting demands. These are testable interpretations, not one-to-one identities. The framework also proposes a common structural perspective on first- and second-order cybernetics, while leaving their distinct epistemological questions unresolved.

Ant colonies, markets, and immune systems can perform similar organizational work through very different mechanisms. This paper asks whether the same seven conditions are necessary in systems independently identified as self-organizing. If the conditions recur, a second question is whether grouping them into generative motion (M), structural constraint (S), and verification and preservation (V) explains more than other groupings. The exact product C = M × S × V, where C denotes organized output, is a further claim and requires comparison with other functional forms. The paper develops prospective tests of these ideas and uses the framework to distinguish possible causes of hallucination, sycophancy, and long-context failure in AI systems.

The comparisons ask whether mechanisms studied in different disciplines perform similar organizational functions, and where that comparison breaks down.

**Keywords:** cybernetics; self-organizing systems; cognitive physics; structural conditions; GLC; C=MSV; feedback; homeostasis; second-order cybernetics; complexity science; emergence; verification; AI failure modes; Wiener; Ashby

## Key findings

- Cognitive Physics is proposed as the structural science of self-organizing systems, grounded in seven candidate conditions hypothesized to be jointly necessary.
- Ant colonies, markets, and immune systems illustrate how different mechanisms may meet common organizational requirements. These correspondences do not establish universal necessity.
- The candidate model groups the conditions into generative motion (M), structural constraint (S), and verification and preservation (V). Its exact product, C = M × S × V, requires separate testing.
- Independent measurements, targeted interventions, comparisons with rival models, and transfer tests specify how the framework’s explanatory value could be supported or challenged.

---

## 1. What Do Self-Organizing Systems Have in Common?

Something appears in ant colonies, financial markets, immune systems, and the reasoning architecture of the brain. It appears in convection cells forming in heated fluid, in ecosystems maintaining stable biodiversity across millions of species, in cities organizing traffic and commerce without central direction. Different substrates. Different scales. Different evolutionary histories, different physical mechanisms, different scientific traditions studying them. Their related forms of distributed organization raise a structural question: do they share necessary organizational conditions?

Complexity scientists at the Santa Fe Institute study how simple rules produce organized behavior at scale. Economists study how millions of uncoordinated decisions produce coherent price signals. Immunologists study how biological defense systems maintain precise boundaries between self and non-self without any cell having access to the global picture. AI researchers document how language models hallucinate, drift, contradict themselves, and hedge without resolution. Cognitive scientists study how understanding arrives and how expertise develops. These fields have developed different methods and vocabularies for studying organization. Can their findings be compared in terms of the functions their mechanisms perform, and what would show that a proposed correspondence breaks down?

Three systems appear throughout this paper as reference points. An ant colony — hundreds of thousands of individuals coordinating through local chemical signals with no central direction. A financial market — millions of uncoordinated decisions aggregating into coherent price signals with no coordinator. The immune system — billions of distributed cells maintaining a precise self/non-self boundary without any cell knowing the whole picture. They share no substrate, no components, no evolutionary history. They appear, on first encounter, to have nothing in common. The table below shows specific behavioral observations in each. Read across each row.

| | **Ant Colony** | **Financial Market** | **Immune System** |
|---|---|---|---|
| **Outputs accountable to inputs** | Local foraging interactions and pheromone reinforcement shape collective route selection without a central coordinator (Goss et al., 1989; Gordon, 2019) | Trades and order flow produce traceable quote and price revisions; the information effect of trade innovations is measurable through subsequent price impact (Hasbrouck, 1991) | CD8+ T-cell expansion is influenced by initial infection dose and antigen display; regulatory mechanisms also contribute to terminating immune responses and maintaining self-tolerance (Badovinac et al., 2002; Van Parijs & Abbas, 1998) |
| **State connected across time** | Pheromone trails plus individual route memory give prior state causal influence on subsequent movement; ants retain route information even after pheromone is removed (Czaczkes et al., 2013) | Price formation is sequential: new trades and information revise an existing price state rather than generating an unrelated price de novo (Kyle, 1985; Hasbrouck, 1991) | Immune systems retain pathogen-specific information for years or lifelong periods through memory lymphocytes causally connected to prior encounters (Ahmed & Gray, 1996) |
| **Mechanism-specific state discrimination** | Trail-laying depends on an individual forager's desired-volume threshold; this does not establish a chemical-signal threshold (Mailleux et al., 2005) | Continuous auction generates discrete executed transactions from continuously changing bids, asks, and order flow (Glosten & Milgrom, 1985; Kyle, 1985) | Highly amplified, digital ERK activation in T cells arises from ligand discrimination and competing feedback loops — a discrete signal produced from continuous chemical input (Altan-Bonnet & Germain, 2005) |
| **Incompatible responses prevented** | A 2005 study reported a negative “no entry” trail pheromone on unrewarding routes in Pharaoh's ants; subsequent research on Argentine ants found no evidence of a “no entry” pheromone in that species, with toxic-bait abandonment driven by aversive memory instead (Robinson et al., 2005; Zanola et al., 2025) | Trading protocols convert heterogeneous and incompatible latent demands into executable transactions; unmatched orders remain unexecuted or repriced (Madhavan, 2000) | Dedicated regulatory circuits actively suppress inappropriate self-reactive or excessive effector responses; breakdown of this regulation produces autoimmunity (Sakaguchi et al., 1995) |
| **Convergence toward stable configurations** | Initially distributed trail choice converges through positive feedback toward shorter, more efficient routes (Goss et al., 1989) | Price discovery progressively incorporates information; prices of closely linked securities exhibit error-correcting movement toward a common efficient-price component (Hasbrouck, 1995) | Large effector T-cell expansion is followed by programmed contraction, leaving a stable memory population after contraction (Badovinac & Harty, 2006) |
| **Organized state actively maintained** | Turtle ants maintain a routing backbone and find alternative paths around broken trail links — active structural restoration after perturbation (Chandrasekhar et al., 2018) | After liquidity is consumed by a trade, Obizhaeva and Wang (2013) model replenishment of the limit order book toward a steady state — a theoretical account of market resilience, not direct observation of recovery | Memory T cells undergo active homeostatic proliferation supported by IL-7 and IL-15 — prior organized immune state actively maintained, not passively stored (Harty & Badovinac, 2008; Surh & Sprent, 2008) |
| **Possible cross-level dependencies** | Individual ant interactions regulate task allocation, producing trail networks, which produce foraging patterns, which produce colony-level resource management — different collective patterns and individual behaviors interact across timescales (Bonabeau et al., 1999) | Foreign-exchange volatility differs across measurement resolutions, with coarser-timescale volatility predicting finer-timescale volatility — a measurable cross-timescale relationship (Müller et al., 1997) | Innate recognition controls signals required to initiate adaptive immunity; adaptive responses establish antigen-specific memory; innate and adaptive responses interact through consequential signaling and functional dependencies (Medzhitov et al., 1997; Iwasaki & Medzhitov, 2010) |

> **Key idea.** {#cross-substrate-correspondences} Different mechanisms may solve comparable organizational problems. The seven conditions propose a common account of the functions those mechanisms perform.

These are scientific antecedents, not interchangeable direct observations: for example, the cited liquidity-replenishment account is a model rather than a recorded recovery experiment. The further claim—that these observations and models disclose requirements shared by all self-organizing systems—is the hypothesis to be tested. When they also appear in human cognition, in ecosystems, in cities — the structural question becomes unavoidable. What is the common basis?

> **Key idea.** {#thermoregulation-puzzle} After exercise, sweating and skin blood flow can decline while core temperature is still elevated. Why would the body reduce heat loss before it has cooled? Section 5 uses that question to examine how a response that looks impaired in isolation can serve a competing demand elsewhere in the system.

Early cyberneticians explicitly studied self-organization. This paper draws on that work and on later research across disciplines to ask why similar organizational functions recur.

---

## 2. What Cybernetics Explains and What Remains Open

### 2.1 The Original Project

Cybernetics investigates how systems regulate behavior through control, communication, and feedback. Wiener (1948) established its foundational study of control and communication in animals and machines. Ashby (1947, 1956) investigated self-organizing dynamics and developed quantitative principles of regulation, including the Law of Requisite Variety. Cybernetics encompasses externally regulated machines as well as self-organizing systems; these are not identical classes.

Cognitive Physics asks a narrower, additional question: whether systems independently identified as self-organizing must satisfy the same seven structural conditions regardless of the mechanisms that realize them. Cybernetics already offers substantial structural explanations. The proposed contribution must therefore be judged by whether these specific conditions make distinctions and predictions that existing accounts do not.

### 2.2 The Seven Structural Conditions

Feedback can explain how an ant colony adjusts its foraging routes. Regulation can explain how an immune response remains controlled. Price discovery can explain how dispersed market participants incorporate information through transactions. Each mechanism describes something a particular system does. But the recurrence of related functions raises another question: what organizational problems are these mechanisms solving?

Each condition names an organizational requirement that different mechanisms may fulfill. The framework proposes that all seven are necessary for self-organization. Whether that claim holds across systems is the central test.

Evaluating these conditions requires a specified system boundary, relevant variables and functions, and an observation interval. Those choices must be made independently of the organizational success or failure being explained. Otherwise, the conditions risk becoming descriptions assigned after the outcome rather than requirements that could be tested.

#### 2.2.1 Ledger — Where Did the Output Come From?

A system produces an output. Where did it come from?

In thermodynamics, this question has a precise physical meaning. Changes in a system's energy must be accounted for through the relevant transfers and transformations. A system cannot produce energy merely because its next state requires it. The foundations developed by Clausius and others established physical relationships through which such changes can be described (Clausius, 1850, 1865).

Other organized systems present a related question without necessarily possessing a shared conserved quantity. A market transforms orders and available liquidity into transactions and changing prices. A cognitive system transforms observations and prior knowledge into conclusions. An immune response develops through interacting signals, cell states, and regulatory processes. Their outputs differ, but each can be investigated through the relationship between what the system produces and the transformations that preceded it.

Feedback provides one familiar mechanism for making earlier consequences available to subsequent regulation. Information theory offers mathematical tools for describing information and communication (Shannon, 1948). Neither, by itself, establishes that every organizational output possesses a complete or usable account of its origin.

> **Definition.** {#ledger} **Ledger** names the broader proposed condition: relevant organizational changes must remain accountable to inputs, prior states, or identifiable transformations.

Two routes can produce the same immediate output and call for different corrections. An investigator may be able to **reconstruct which route produced the output**. The functional question is whether the organization can **use that difference to change what it does next**. A signal or constraint could carry the relationship without a symbolic record.

To test that reading of Ledger, specify what carries the relationship and which correction depends on it. Disrupting that mechanism should impair the route-specific correction while leaving the immediate output available. If a sensitive test puts the effect below a prespecified threshold and rules out compensation within the stated boundary, the result counts against functional Ledger in that case. A system can therefore meet the investigator’s criterion for reconstructing its history while failing the functional criterion. A necessity claim has to say which criterion it uses.

Ledger does not propose that knowledge, market information, and physical energy obey the same conservation law. The thermodynamic analogy motivates the question; it does not establish the cross-domain answer.

#### 2.2.2 Continuity — How Does the Past Remain Relevant?

An ant following a pheromone trail responds to a path shaped by previous ants. Each new passage may reinforce, weaken, or redirect the route. Individual route memory can also influence navigation when familiar chemical guidance is altered. The present organization reflects earlier interactions rather than beginning anew at each step (Czaczkes et al., 2013).

Dynamical systems theory describes such relationships through states, trajectories, and evolution rules. Path-dependent processes likewise exhibit outcomes shaped by the routes through which they developed. But causal dependence and mathematical continuity are different properties.

A digital computer can move between discrete states through well-defined causal transitions. A biological pathway can cross a sharp activation threshold while retaining a traceable biochemical history. Neither example requires its represented state to vary continuously in the mathematical sense.

> **Definition.** {#continuity} **Continuity** proposes something more specific than the existence of successive causes: dependencies relevant to the system's organization must remain effective across the transitions through which it develops.

A prior state may be transformed, compressed, or replaced while its relevant influence survives. The condition does not demand that every detail of the past remain available, nor that every observable quantity change smoothly.

The unresolved question is what makes this organizational continuity distinct from ordinary state evolution, and whether it admits a common operational measure across continuous and discrete systems.

#### 2.2.3 Distinguishability — Which Differences Matter?

An immune system encounters molecular signals that may appear similar but demand different responses. Recognizing a dangerous stimulus while avoiding an inappropriate response requires more than receiving information. The system must discriminate among alternatives in ways that affect what happens next.

Information theory formalizes distinctions among possible signals and their uncertainty (Shannon, 1948). Biological signaling shows how those distinctions become consequential through coupled responses. Altan-Bonnet and Germain (2005), for example, investigated T-cell antigen discrimination through feedback regulation and highly amplified, digital ERK responses.

> **Definition.** {#distinguishability} The proposed **Distinguishability** condition abstracts the functional requirement: states that demand different downstream behavior must be sufficiently separable to the mechanisms that respond to them.

This need not require discrete states everywhere. A controller may distinguish graded deviations, while a signaling pathway may use threshold activation. What matters is whether the receiving process can act on the difference.

Nor does every measurable difference have organizational significance. Two states may be distinguishable to an external investigator yet equivalent to the coupling operating within the system.

The proposed necessity concerns relevant differentiation, defined relative to the function, boundary, and response under examination.

#### 2.2.4 Coherence — Can the Demands Be Satisfied Together?

A biological regulator often faces competing demands. An immune response must address a threat without inflicting indiscriminate damage on the host. A market must accommodate heterogeneous orders, liquidity constraints, and changing information. The demands are not always aligned.

Ashby's theory of regulation established quantitative relationships between disturbances and regulatory capacity (Ashby, 1956). Biological regulatory networks demonstrate mechanisms through which interacting signals can reinforce, suppress, or compensate for one another.

But possessing multiple control mechanisms does not guarantee that their demands can be satisfied together.

> **Definition.** {#coherence} **Coherence** names the proposed condition that active organizational constraints must remain functionally compatible or be brought into a resolvable relationship at a specified level, time, and set of variables.

It does not mean that a system must eliminate disagreement, competition, or productive tension. Two processes can pull in different directions while remaining part of a viable organization. The problem arises when incompatible demands cannot be accommodated or resolved without undermining the functions at issue.

This is not the trivial claim that a physical system obeys the laws governing its evolution. Those laws constrain what occurs; Coherence concerns the relationships among identifiable functional demands within that evolution.

The condition becomes informative only when those demands, their interactions, and the consequences of unresolved conflict can be specified independently.

#### 2.2.5 Dissipative Attraction — Why Doesn't Activity Remain Mere Motion?

Heat a fluid from below under suitable conditions and its motion can organize into convection cells. What begins as a response to a temperature gradient develops into a recognizable collective pattern. The pattern is not imposed by a central controller, and its continued existence can depend on the energy flow sustaining it.

Nonequilibrium thermodynamics established that organized patterns can emerge under sustained driving. Nicolis and Prigogine (1977) examined these regimes, while Haken's synergetics developed related accounts of collective organization and dynamical behavior (Haken, 1983).

These traditions help distinguish two facts: a system can be active, and its activity can become organized. One does not automatically imply the other.

> **Definition.** {#dissipative-attraction} **Dissipative Attraction** proposes that organizational dynamics must approach, generate, or sustain a usable regime rather than remain undirected activity. Attraction describes a dynamical tendency toward such regimes; dissipation describes the relevant energetic throughput in driven systems.

The relationship requires care. A crystal may form through an organizing process and subsequently remain stable without the ongoing activity needed to sustain convection. **Formation, active maintenance, and passive persistence** are different phases. They cannot be treated as interchangeable evidence for the same requirement.

Nor does the existence of an attractor automatically establish that it serves a useful organizational function. The regime, system boundary, and criteria for organized behavior must be specified before evaluating the condition.

Dissipative Attraction is most directly motivated by dynamically organizing systems. Whether its proposed necessity extends unchanged to equilibrium self-assembly remains an open challenge to the framework.

#### 2.2.6 Persistence — What Happens When Organization Is Disturbed?

An immune system does not preserve its organization by remaining fixed. Cell populations expand, contract, and renew. Following a disturbance, regulatory and restorative processes can help maintain function even when the system's exact state changes. Immune-memory research documents forms of active maintenance and renewal in these populations (Harty & Badovinac, 2008).

The traditions of homeostasis, autopoiesis, and resilience investigate different aspects of this problem. Maturana and Varela (1980), for example, developed an account of living systems organized through processes of self-production and maintenance.

These approaches point toward a distinction between lasting and persisting through change.

A rock may retain its shape for a long time without actively restoring it. A biological system may preserve a relevant function through continual turnover, compensation, and adjustment. Duration alone does not establish restorative capability.

> **Definition.** {#persistence} **Persistence**, in its stronger proposed form, concerns an organization's capacity to preserve or restore relevant functions through active responses to disturbance. It does not require an identical return to a previous physical state: a system may reorganize while preserving the function that makes its continued organization possible.

This matters in cognition as well. Preserving a supported conclusion should not mean refusing to revise it when better evidence arrives. The function concerns what remains warranted through change.

Passive stability is a distinct phenomenon, not an automatic instance of active Persistence. Testing the proposed distinction requires a defined disturbance, a functional preservation or recovery criterion, and an observation interval.

Whether active restoration is necessary for every system that might otherwise qualify as self-organizing remains unresolved.

#### 2.2.7 Hierarchy — What Depends on What?

A colony emerges from interactions among ants, yet collective trail patterns can influence the behavior of individual ants. In a biological organism, molecular processes affect cells, while tissue-level organization can constrain what those cells do. The relevant relationships do not always travel in one direction.

Herbert Simon's account of complexity emphasized hierarchical organization and near-decomposable systems (Simon, 1962). Haken's synergetics developed mathematical descriptions in which collective order parameters coordinate the behavior of component processes (Haken, 1983). Both traditions show why relationships among organizational levels can matter to the dynamics of complex systems.

But identifying parts and wholes is not enough.

> **Definition.** {#hierarchy} **Hierarchy** proposes a functional relationship among organizational levels: the dependencies through which organization at one level supports, constrains, or coordinates activity at another.

A hierarchy in this sense is not merely a diagram containing smaller boxes inside larger boxes. It requires organizational relationships with explanatory or causal significance.

Its proposed universality is also one of the framework's most demanding open questions. Minimal reaction–diffusion systems can produce ordered patterns without obviously possessing a sequence of independently stabilized organizational layers. Calling every microscopic-to-macroscopic relationship a hierarchy would make the condition too easy to satisfy.

The question is whether independently identifiable functional dependencies are necessary for self-organization, and how those dependencies could be measured without presupposing the conclusion.

#### From Seven Conditions to Their Functional Relationship

The seven conditions describe different organizational demands. Some concern how systems develop and move toward organized states. Others concern the constraints and dependencies that shape those states. Still others concern distinguishing, accounting for, and maintaining what organization produces.

They are not independent in practice. Feedback can contribute to both accountability and regulation. Homeostatic mechanisms can combine attraction toward viable regimes with restorative persistence. Hierarchical dependencies can influence which differences a system must distinguish.

The following mapping summarizes the principal proposed relationships between familiar cybernetic mechanisms and the seven conditions. These are functional correspondences, not one-to-one identities or established derivations.

| **Cybernetic mechanism** | **Proposed condition** | **Candidate functional correspondence** |
|---|---|---|
| Feedback loops | Ledger (1) | Feed consequences of earlier activity into subsequent regulation; do not necessarily create a complete evidentiary account |
| Causal state memory | Continuity (2) | Retain relevant influences of previous states across transitions, including discrete transitions |
| Error correction signals | Distinguishability (3) | Differentiate consequential deviations and support different responses; thresholds are one implementation |
| Control loops / regulation | Coherence (4) | May accommodate or resolve competing functional demands; physical compliance alone is insufficient |
| Homeostasis | Dissipative Attraction (5) | Can return driven activity toward viable regimes; does not imply all organized states require ongoing dissipation |
| Self-maintenance / boundary-keeping | Persistence (6) | May actively preserve or restore organization under specified disturbances; not passive duration |
| Hierarchical control | Hierarchy (7) | May coordinate consequential dependencies among organizational levels; universal necessity is unproven |


The mapping raises a causal question. Feedback can make an output responsive to an earlier state; homeostatic mechanisms can return disturbed activity toward a viable regime; regulation can prevent incompatible responses from disrupting coordination. The proposed conditions describe functions these mechanisms serve. The correspondence is explanatory if it generates predictions about what happens when those functions are impaired, not merely because a label can be assigned to each example.



### 2.3 Testing the Proposed Conditions

Having introduced the seven conditions and their possible cybernetic correspondences, the next question is what would challenge them. Established work on feedback, communication, and collective organization offers cases where particular mechanisms are stressed or disrupted. The issue is whether those observations discriminate the proposed functions from alternative explanations.

A working system can make a mechanism look indispensable when it is merely one of several routes to the same result. Failure cases introduce pressure. They show what a system actually loses when a particular route is obstructed, but disrupting a mechanism does not demonstrate that an invariant has been removed.

| **Proposed condition** | **Failure prediction if the function is absent** |
|---|---|
| Ledger | Relevant inputs and state changes no longer account for outputs |
| Continuity | Earlier organized states cease to constrain later development |
| Distinguishability | Relevant alternatives cannot produce sufficiently differentiated responses |
| Coherence | Incompatible demands cannot be resolved into viable organization |
| Dissipative Attraction | Distributed activity fails to converge toward or remain in an organized regime |
| Persistence | Established organization cannot restore under undesigned disturbance |
| Hierarchy | Dependencies among organizational levels fail to support higher-level activity |

These are predictions supplied by the theory, not seven experimentally isolated absences. Three cases show what different kinds of evidence can and cannot establish.

> **Evidence.** {#ant-foraging-intervention} **Ant foraging — disrupted convergence (M).** Argentine ants can coordinate navigation through pheromone trails. Suckling and colleagues (2008) experimentally supplied excess trail pheromone and observed reduced trail integrity and bait-location success.

Goss and colleagues' earlier shortcut work documents route choice, not this disruption; the two results should not be presented as one experiment. The intervention shows that disrupting a particular guidance channel can damage coordinated foraging. It is consistent with the framework's Dissipative Attraction function, but it does not establish that the whole condition vanished. Other navigation cues and individual route memory may compensate (Suckling et al., 2008; Goss et al., 1989; Czaczkes et al., 2013).

**The Flash Crash — disrupted coordination (S).** On May 6, 2010, severe selling pressure and deteriorating liquidity interacted across U.S. markets. The joint SEC/CFTC investigation traced a complex market event rather than a single missing regulatory component. The episode provides a stress case for Coherence: how distributed transactions remain compatible enough to sustain organized price formation when liquidity deteriorates. It did not experimentally remove Coherence, and the report does not demonstrate a uniquely ordered S-to-V collapse (SEC/CFTC, 2010; Kirilenko et al., 2017).

**T-cell discrimination — differentiated response (V).** T cells must respond to some molecular encounters while not responding comparably to closely related signals. Altan-Bonnet and Germain (2005) observed highly amplified, digital ERK activation and developed a feedback-based model of antigen discrimination. That provides a specific biochemical example of distinguishability. It does not establish that every self-organizing system needs a discrete switch or that this single mechanism implements Ledger and Persistence as well.

The studies differ in kind: an experimental interference with coordination, a natural market disruption, and a biochemical mechanism supported by experiment and modeling. Their value is to expose mechanisms and suggest tests of the seven functions. They do not, on their own, prove universal necessity.

### 2.4 How the Framework Compares with Other Accounts

Cybernetics did not stop at feedback, and later disciplines did not start from nothing. Synergetics developed mathematical accounts of collective order; autopoiesis examined organizational self-production; complexity science studied emergence and interacting systems. These approaches offered important structural explanations, even as different disciplines continued to develop partially separate criteria and vocabularies. The remaining challenge is not the absence of structural predecessors. It is whether a specific, testable set of cross-substrate conditions can connect their insights without erasing their differences (Haken, 1983; Maturana & Varela, 1980).

Gershenson (2025) examines conceptual difficulties and treats self-organization as a scale- and purpose-sensitive description. The proposed seven conditions offer a different cross-substrate criterion that requires independent testing.

Palagin et al. (2025) propose seven cross-domain invariants for evolutionary cybernetics, a framework for directing change in systems whose goals, constraints, and structures can themselves evolve. Their account distinguishes an operational loop from an evolutionary loop and includes invariants concerning information, regulation, structural organization, and temporality. These overlap with questions raised here about state discrimination, functional coordination, cross-level dependencies, and the influence of prior states. The present hypothesis also covers minimal pattern-forming processes without goal-directed meta-control. In an independently qualifying reaction–diffusion case, for example, the hypothesis predicts a consequential cross-level dependency under the criterion specified in Section 4.3. A credible absence would count against the proposed necessity of Hierarchy in this framework. That case falls outside the directed-evolution question for which Palagin and colleagues developed their account.

**A Proposed Structural Connection Between First- and Second-Order Cybernetics**

Cybernetics also developed a distinction between describing observed systems and accounting for observing systems. First-order cybernetics is often characterized as studying regulatory mechanisms from an analytical perspective that places the observer outside the modeled system, without implying that every first-order account excludes observers. Second-order cybernetics, associated with von Foerster (1974) and related to Maturana and Varela's autopoiesis framework (1980), foregrounds observing systems and the conditions under which descriptions are produced.

Cognitive Physics proposes that the same seven candidate conditions apply to independently qualifying self-organizing systems across first- and second-order analyses. The object of investigation may be an observed system, an observing system, or a defined observer–observed coupling. Including the observer changes which relationships fall within the analysis and how the conditions must be investigated. The proposed organizational requirements remain the same, although their mechanisms and operational measures may differ. This is the framework’s candidate structural connection between the two traditions. Their distinct epistemological questions remain open.

**Rival explanations and a differential test (proposed, not performed).** Existing traditions offer structural explanations (Ashby, 1956; Haken, 1983; Maturana & Varela, 1980; Nicolis & Prigogine, 1977). The proposed contribution must be a testable prediction remaining after strong rivals receive comparable inputs and modeling resources.

| Account | Already explains | Differential test proposed for Paper C |
|---|---|---|
| Ashby / requisite variety | Regulatory response capacity under disturbance | Given matched disturbance variety and regulatory capacity, does a measured condition-level impairment predict additional failure? |
| Haken / synergetics | Collective order, order parameters and emergent dynamics | Does a condition-specific perturbation signature predict held-out behavior beyond a fitted order-parameter account? |
| Maturana–Varela / autopoiesis | Organizational self-production and maintenance | With boundaries fixed independently, do classification or perturbation predictions meaningfully differ? |
| Dynamical-systems / complexity | Stability, bifurcations, attractors and coupled interactions | Does a fixed functional representation improve held-out prediction, parsimony or transfer against a comparably expressive baseline? |

> **Counterpoint.** {#fair-rival-comparison} No row reports an achieved result. If a fair incumbent accounts for the same observations, added explanatory value has not been established.

### 2.5 What the Framework Is Meant to Explain

**The Definition Problem**

The framework defines a proposed structural class whose members satisfy all seven conditions simultaneously. Whether independently identified self-organizing systems belong to that class is a separate empirical question. To test it, specify how a system qualifies as self-organizing before assessing the seven conditions.

A thermostat provides a useful contrast. Its feedback loop regulates temperature, while the question of self-organization concerns how the system generates and maintains its own organization. Ant colonies, markets, and immune systems illustrate candidate correspondences. Minimal reaction–diffusion patterns provide a more demanding boundary case, particularly for Hierarchy (§4.3).

**The Fragmentation Problem**

Complexity researchers study how collective patterns emerge. Immunologists study how organisms maintain and restore regulated states. These lines of work can be compared where their mechanisms appear to serve a similar function. The seven conditions give us a way to specify that function and test whether the comparison holds.

**The Law Problem — And What Remains**

The seven conditions propose what self-organization requires. Their comparison across disciplines asks whether different mechanisms fulfill the same functions. The M/S/V grouping proposes how those functions fit together, and the product proposes a quantitative relationship among them. Each step needs its own evidence. Recurring functions can support a comparison across systems while leaving their necessity, grouping, and quantitative relationship open to further tests.

Section 3 develops this proposed functional decomposition and candidate relationship.

---

## 3. From Seven Conditions to a Candidate Model

### 3.1 Grouping the Conditions into M, S, and V

**The Proposed Functional Decomposition**

> **Key idea.** {#seven-conditions-three-functions} The proposed grouping gives the seven conditions three functional roles. **M concerns how organized activity develops. S concerns what shapes and coordinates it. V concerns how relevant states remain accountable, distinguishable, and preserved.** Whether this grouping explains more than competing partitions remains open.

**Cluster 1 → M (Generative Motion).**

Condition 2, Continuity, proposes that organization-relevant dependencies remain effective across state transitions. This requirement concerns functional causal continuity, not necessarily a mathematically continuous trajectory through state space. Continuous trajectories provide one possible formalization for appropriate dynamical systems, while discrete systems may preserve relevant dependencies through well-defined transitions. Whether a common operational criterion can be established across these cases remains open. Condition 5, Dissipative Attraction, concerns dynamics that approach or sustain an organized regime. In driven systems, as with convection maintained by a temperature gradient, continued energy throughput can be necessary to sustain that regime. A crystal can instead form through an organizing process and remain stable after formation without active maintenance. The formation process, the resulting organized state, and active restoration therefore require separate evaluation. Together, Conditions 2 and 5 motivate M as causally connected, directed organizational development within a specified process. Whether the condition named Dissipative Attraction applies unchanged to equilibrium self-assembly remains open.

**Cluster 2 → S (Structural Constraint).**

Condition 4, Coherence, demands that the system's constraints be jointly satisfiable at any one level and time. Motion must have organized structure to work against. Condition 7, Hierarchy, proposes that organization depends on relationships among levels, not merely the presence of components. In richly structured biological systems those dependencies are visible; in minimal reaction–diffusion patterns, an obligatory sequence of stabilized levels has not been established. Describing a pattern at microscopic and macroscopic scales alone cannot prove a distinctive hierarchy requirement. Together, Conditions 4 and 7 motivate S as compatible organizational constraint, with the universal necessity of functional Hierarchy still open.

**Cluster 3 → V (Verification and Preservation).**

Condition 1, Ledger, requires relevant outputs and state changes to remain accountable to their inputs. Condition 3, Distinguishability, requires usable states to be separable from alternatives for the coupling that responds to them. Condition 6, Persistence, requires established organization to maintain or restore itself under disturbance. Together they motivate a proposed function through which a system differentiates relevant states, retains accountable consequences, and preserves viable organization. In T-cell signaling this can include digital activation; in other substrates the discrimination may be graded. The cognitive implementation of a discrete verification gate is one implementation, not a demonstrated universal requirement.

**Why Exactly Three**

The proposed partition accounts for each of the seven conditions by identifying a primary functional demand. M tracks directed development, S describes compatible organizational constraint, and V groups accountability, distinguishability, and persistence. The functions are conceptually separable; the claim that exactly these three clusters form a uniquely minimal decomposition requires a stronger independence argument and comparison with rival partitions. That question remains open.

**Testing distinctness and alternative groupings.** Ledger concerns accountable input–output relationships while Continuity concerns retained causal effects of prior state; selectively impairing attribution and state dependence would test their separation. Persistence concerns restoration after a disturbance while Dissipative Attraction concerns approach to or maintenance of a regime; compare controlled recovery and convergence. Coherence concerns compatible demands while Hierarchy concerns consequential cross-level dependencies; perturb conflict resolution separately from interlevel mediation. If manipulations are not selective, no independent-function conclusion follows.

A partition must specify a model, not relabel the same measurements. One proposed comparison uses the same seven independently measured main effects and, as a testable restriction, **only the five within-cluster pairwise interaction terms** under each mapping. Group labels do not logically entail those restrictions; they need prespecified functional motivation.

| Candidate | M / S / V | Distinguishing hypothesis, not observed result |
|---|---|---|
| Proposed | {2,5} / {4,7} / {1,3,6} | Recovery-sensitive effect of Persistence (6) interacts with Ledger/Distinguishability (1,3); Discrimination (3) interacts with (1,6) |
| Alternative A | {2,5} / {4,6,7} / {1,3} | Recovery-sensitive effects of Persistence (6) interact instead with Coherence/Hierarchy (4,7) |
| Alternative B | {2,3,5} / {4,7} / {1,6} | State-transition effects of Distinguishability (3) interact instead with Continuity/Attraction (2,5) |

> **Counterpoint.** {#rival-partitions} Compare on identical inputs, outcomes, held-out partitions, fitting budgets and model complexity; include an unrestricted seven-condition baseline. Associations alone do not prove causality; selective interventions require separate manipulation checks. If all mappings are observationally equivalent, or the proposed interaction constraints cannot be justified, report **non-identifiability**, not confirmation. One domain's success does not establish universality; prespecify an interaction or response pattern for transfer to another substrate without changing assignments after the fact.

**Why Multiplication**

> **Counterpoint.** {#zero-collapse-and-the-product} If the three functions are jointly indispensable, no amount of either remaining function can replace a completely absent one. A multiplicative representation captures that proposed zero-collapse property. But it is not the only one: a weakest-link or other non-compensatory function can also vanish when any input vanishes. C = M × S × V is therefore advanced as a candidate structural relationship for organized output, rather than a uniquely derived quantitative identity.

An empirical law would require substrate-independent definitions or justified normalizations of the variables, comparable measurements, and tests against competing functional forms.

### 3.2 What the Product Predicts

**C = M × S × V**

*A candidate multiplicative representation motivated by the proposed joint necessity of M, S, and V.*

The product predicts that **the same increase in M produces a larger increase in C when S and V are higher**, assuming independently defined measures on compatible positive scales and holding S and V fixed within each comparison. Structural constraints and verification therefore affect the return on additional generative activity. This predicted interaction can be tested against other functional forms.

Section 6.2 illustrates the product’s conditional prediction through a classroom example.

| **Term** | **Definition** | **Conditions** |
|---|---|---|
| C | Organized output: a structured result produced or sustained by a system, distinct from undifferentiated activity or raw output volume | — |
| M | *How does organized activity develop?* Directed organizational dynamics within a specified process | 2 (Continuity) + 5 (Dissipative Attraction) |
| S | *What shapes and coordinates that activity?* Structural constraint: functional constraints and dependencies that shape and coordinate organizational activity | 4 (Coherence) + 7 (Hierarchy) |
| V | *How does the system distinguish, account for, and preserve relevant states?* Verification and preservation: functions through which relevant states and outcomes remain accountable, distinguishable, and actively maintained or restored | 1 (Ledger) + 3 (Distinguishability) + 6 (Persistence) |

S concerns the functional organization of constraints; V concerns accountability, state differentiation, and active preservation. These functions may interact, and their empirical separability is not established. The general definition of S does not presuppose that the structure has already been verified. In discovery-specific knowledge meshes, verified constraint quality can remain a separate, context-dependent measure.

V does not require every physical system to perform an epistemic commitment. In cognitive implementations, explicit verification may distinguish proposed knowledge from warranted knowledge; in other systems, the relevant mechanisms may concern measurable state discrimination, regulated responses, and active maintenance. Whether those behaviors constitute one irreducible functional cluster is an empirical and formal question.

**A Note on the Name**

This law carries the name General Law of Cognition — GLC — because cognition was the domain from which it was first derived. The name is an origin marker, not a scope boundary. The present framework proposes that the same structural form may describe organized output across self-organizing systems. Cognition was the entry point. The structural account extends further.

### 3.3 How the Model Developed

The presentation follows the order of the argument. During development of the framework, C = M × S × V came first, followed by the seven proposed conditions and their grouping into M, S, and V. The connection to self-organization and cybernetics developed subsequently. This sequence records the framework’s history. Its scientific case rests on the comparisons and tests presented here.

The three formulations below share a family resemblance, but not the same provenance. GLC supplies the original proposed form; DYL is a downstream refinement of GLC, while CIL remains a provisional analogy developed around a different research question. Their relation helps reconstruct the theory's development. It does not provide three independent empirical confirmations.

**Three Related Formulations**

**GLC** was derived from the structural requirements of cognitive systems — what a system processing information from its environment must have to produce organized output. C = M × S × V.

**DYL** — the Discovery Yield Law — is a GLC refinement, not a parallel independent derivation. It adapts GLC's multiplicative structure and develops a more specific representation of verified knowledge-mesh organization in the context of discovery yield under adversarial load. The question DYL addresses is why two knowledge meshes with identical total edge counts can produce radically different discovery rates. DYL refines the discovery-specific treatment by operationalizing mesh-verification quality and traversal availability, rather than establishing that S must universally equal a scalar density. The differentiating variable is how many edges have survived at least one contradiction attempt: the Mesh Verification Ratio, MVR = E_v / E_t, where E_v is the count of verified edges and E_t is the count of total edges. When adversarial pressure arrives into a low-MVR mesh, insufficient verified constraints exist to close prediction — novelty produces branching hypotheses that multiply without converging. The same pressure arriving into a high-MVR mesh finds dense verified constraint structure that forces closure.

DYL's full form is Yd = M × MVR_w × Φ(P), where M is generative pressure (inheriting GLC's first term), MVR_w is the weighted mesh verification ratio (a decomposition of GLC's S term into verification-quality-corrected structural density), and Φ(P) is traversal path density — an addition for the discovery-specific context, capturing the proportion of verified mesh paths not yet traversed under adversarial pressure. M → 0: no pressure, mesh never traversed. MVR_w → 0: pressure traverses noise, nothing genuine discovered. Φ(P) → 0: all paths already traversed, adversarial pressure produces confirmation only. Zero in any term: discovery yield collapses. The three-term multiplicative structure is inherited from GLC. The refinement proposes that verified mesh quality and traversal availability matter separately for discovery yield. It does not establish factor-by-factor equivalence with the original GLC terms.

**CIL** — the Civilizational Intelligence Law — was derived from a separate question: why do most civilizations plateau or collapse before reaching advanced computational capability? CIL proposes a comparable pattern across civilizational trajectories. Civilizations with high iteration rate and low verification produce apparent progress that collapses. Civilizations with strong verification and low novelty generation stagnate. CIL is treated here as a provisional convergence: the triadic multiplicative pattern is present, but its operationalization is less developed than DYL's and awaits further empirical grounding.

From this observation: Progress ∝ Rate × Constraint Density × Verification. Rate is novelty iteration. Constraint Density is accumulated verified knowledge infrastructure. Verification is the elimination mechanism — replication, debate, falsification. Zero in any term: progress collapses. The historical ordering of this proposal requires separate documentation; this relation does not by itself validate the product across civilizations.

> **Counterpoint.** {#development-of-the-candidate-law} Appendix B compares the three formulations. The factors occupy different functional roles across the models, so their positions in a product cannot establish equivalence. DYL shows how the original architecture was adapted to discovery, while CIL offers a provisional analogy. Neither supplies independent evidence for the general product.

**What the cross-substrate cases show**

The T-cell ERK response is a documented discrete discrimination mechanism (Altan-Bonnet & Germain, 2005). It is useful evidence for one possible implementation of Distinguishability, but not proof of a universal epistemic gate. Section 2.3 also examines pheromone disruption and the Flash Crash. The cases support investigation of particular functions; they do not independently establish the seven conditions as universal necessities or uniquely select M × S × V.

The condition-level failure predictions appear in Section 2.3. Their proposed mapping into M, S, and V is developed in Section 3.1; the distinct functions must ultimately be measured independently of the organized-output result they are used to explain. Neither table-based classification nor observed disruption by itself demonstrates the absence of a universal condition.

### 3.4 What the Model Would Need to Explain

Ashby's Law of Requisite Variety provided a quantitative result within the science of regulation. Other traditions, including synergetics, developed structural accounts of self-organization. The proposal here addresses a different question: can seven candidate conditions describe recurring organizational requirements across substrates, and can their grouping support a testable relation for organized output? The M/S/V decomposition supplies a hypothesis and a way to compare failure patterns. It does not yet provide a unique product theorem or a general measurement theory.

---

## 4. Where the Cognitive Physics Framework Applies

### 4.1 From Mechanisms to Organizational Requirements

Cybernetics was right about what it found. The mechanisms are real. In this proposed account, feedback can be examined as one mechanism supporting the Ledger function, without guaranteeing complete input-output accountability. Homeostatic regulation may contribute to attraction toward, or restoration of, organized regimes without establishing that every such regime requires continuing dissipation. If that structural account is correct, recurring mechanisms can be compared through the functional conditions they support. The proposal must still be tested against alternative structural explanations.

A single feedback mechanism can help account for an output, distinguish a deviation, and restore a viable state, supporting several proposed conditions at once.

The proposal is not a replacement for cybernetics or for later structural theories. It asks whether requirements inferred from otherwise different systems can explain why related mechanisms recur. An explanatory advance would consist of distinguishing which functions are actually necessary, measuring their effects, and making predictions that competing accounts do not make.

### 4.2 How the Two Accounts Fit Together

**Cognitive Physics proposes that mechanisms studied across cybernetics and complexity science can be compared through the organizational functions they perform.** Its unifying claim is that common requirements can recur across different systems and mechanisms. The seven conditions specify the requirements to test.

The relation is complementary rather than a hierarchy in which cybernetics contained no structure. First-order cybernetics developed formal accounts of regulation; later work included observer-dependent accounts and mathematical theories of emergent order. The seven-condition proposal offers one way to compare their subjects, without reducing the differences between first- and second-order cybernetics to observer position alone. The epistemological questions remain open.

Gershenson (2025) argues that self-organization describes systems relative to an observer's purposes rather than being an intrinsic property independent of description. This paper investigates whether independently specified structural conditions offer a useful, more restrictive comparison. The literature contains substantial structural approaches, but a common description of self-organization remains debated. This paper proposes a particular synthesis of candidate cross-substrate conditions; whether it advances that debate depends on comparative tests and the treatment of difficult boundary cases.

The Santa Fe tradition in complexity science provides another way into the same problem. The table gives one entry question for each tradition. The questions overlap, and the proposed synthesis can be tested where they meet.

| Tradition or program | Entry question | Role in the proposed synthesis |
|---|---|---|
| **Complexity science (Santa Fe tradition)** | How do interactions among parts produce collective behavior across scales? | Supplies cases and models of emergent organization in which to look for recurring functions. |
| **Cybernetics** | How do feedback, communication, and regulation shape what a system does? | Supplies mechanisms for tracing how a system maintains, adapts, or reorganizes its behavior. |
| **Cognitive Physics** | Which organizational functions, if any, are necessary across systems that self-organize in different ways? | Proposes seven candidate conditions and asks what observations or interventions would support or challenge them across systems. |

A trail network in an ant colony gives the three questions a common object. Local interactions can produce a collective route. Feedback can reinforce it. The seven-condition framework asks which functions the route depends on and what would happen if one were disrupted. The comparison gains explanatory value when it yields predictions that can be checked against existing accounts.

### 4.3 Testing the Boundaries of Self-Organization

> **Key idea.** {#independent-membership-test} The proposed structural class comprises systems that satisfy all seven conditions simultaneously. The necessity hypothesis predicts that every system independently identified as self-organizing belongs to that class. The comparison in Section 1 uses published observations and models from ant colonies, financial markets, and immune systems to illustrate candidate correspondences. A necessity test requires an independent criterion for self-organization and prespecified criteria for assessing the conditions. A case that meets the independent criterion and demonstrably lacks a proposed condition would count against the necessity hypothesis. Such a result could motivate revision of the condition or a narrower claim about the systems to which it applies.

The thermostat is the boundary contrast introduced in Section 2.5: possessing feedback is not, by itself, evidence of endogenous self-organization. Whether any candidate—including minimal pattern-forming systems—satisfies all seven conditions must be decided through criteria fixed independently of the theory's desired answer.

**The Process and the State**

A crystal can organize through internal dynamics and subsequently remain ordered without continuing the process that formed it. That is different from convection, whose ordered flow depends on a sustained driving gradient. Formation, passive persistence, and active maintenance should not be treated as interchangeable tests of the seven conditions. Comparative claims here require a stated system boundary, relevant variables, organizational scale, and observation interval. In particular, Dissipative Attraction and Hierarchy are open to challenge by equilibrium self-assembly and minimal pattern-forming systems. The theory retains their proposed necessity; it does not assume these cases satisfy them by definition.

**A boundary test: minimal reaction–diffusion organization.** Consider a reaction–diffusion system developing spatial patterns from nearly uniform local conditions without an externally prescribed target pattern (Turing, 1952). Before examining the seven conditions, fix the boundary, variables, scale, interval and a defensible **independent** criterion that this pattern-forming process counts as self-organizing. Do not revise membership in response to the outcome.

The Hierarchy hypothesis requires a consequential cross-level **functional dependency**, not merely a microscopic and macroscopic description. Predefine the relevant levels, an intervention or response predicted by that dependency, and a minimum consequential effect. Compare with an adequate local reaction–diffusion account, noting that coarse-grained order parameters may merely summarize local states; conversely, local-model sufficiency does not prove that all functional dependencies are absent. Record test sensitivity and intervention limits.

> **Counterpoint.** {#hierarchy-adverse-result} Three verdicts matter: detecting the prespecified dependency is compatible with Hierarchy, not proof of universality; weak non-detection is **inconclusive**; an independently qualifying self-organizing process with sufficiently sensitive evidence bounding the required dependence below a prespecified consequential threshold counts against **universal Hierarchy as operationalized**. Do not rescue the theory by changing the criterion afterward. Crystal formation versus passive stability remains a secondary, distinct challenge.

### 4.4 From Shared Functions to Testable Comparisons

The following disciplinary comparisons identify overlap and testable differences rather than claiming that earlier researchers lacked structural foundations. The proposed conditions offer one common vocabulary, but that vocabulary earns explanatory weight only when it helps distinguish rival accounts or generate usable predictions.

---

## 5. How the Conditions Apply Across Fields

These connections are proposed research comparisons, not replacements for the existing theories of any field. Each suggests a possible structural relation to test within the field's own methods.

### Complexity Science

**What the field studies:** Emergence, phase transitions, self-organized criticality (Bak et al., 1987), and complex adaptive systems — how simple local rules produce organized global behavior across scales, studied through dynamical systems, network theory, statistical physics, and agent-based modeling.

**Proposed structural correspondence:** Dissipative Attraction (5) and Continuity (2) — the thermodynamic and dynamical basis of organized flow and convergence toward stable regimes; Hierarchy (7) in the architecture of complex adaptive systems; Ledger (1) as a proposed accounting function, distinct from physical energy conservation and information-theoretic measures.

**What this framework could add:** A candidate field definition that distinguishes systems that appear to genuinely self-organize from systems that merely produce complex behavior — and a structural account of why the same organizational phenomena appear in physics, biology, and economics simultaneously.

### Systems Biology

**What the field studies:** Cellular signaling networks, gene regulatory circuits, metabolic organization, and how biological components self-organize into functional systems greater than the sum of their parts.

**Proposed structural correspondence:** Coherence (4) concerns how interacting regulatory constraints remain functionally compatible despite tradeoffs and compensation; Hierarchy (7) raises questions about dependencies among molecular, cellular, and tissue organization; Ledger (1) concerns accountable relationships among metabolic inputs, transformations, and outputs.

**What this framework could add:** A structural vocabulary that connects disparate findings across molecular, cellular, and tissue biology under one organizational account — and a candidate failure mode framework predicting where interventions will and will not work.

### Ecology

**What the field studies:** Ecosystem stability, biodiversity maintenance, trophic networks, resilience after disturbance, and how complex communities of organisms maintain organized structure across scales of time and space with no central coordination.

**Proposed structural correspondence:** Dissipative Attraction (5) raises questions about ecological dynamics and the emergence of viable regimes; Persistence (6) concerns resistance, restoration, or reorganization after disturbance; Hierarchy (7) concerns proposed functional dependencies across ecological scales. Ecosystems can recover, transition to alternative regimes, or fail to recover.

**What this framework could add:** A way to investigate which organizational functions influence recovery, persistence, and transitions between ecological regimes. The proposed conditions suggest possible distinctions among disturbances, but do not yet provide a validated predictive model of ecosystem recovery.

### Economics and Institutional Theory

**What the field studies:** How markets coordinate millions of uncoordinated individual decisions into coherent price signals, how institutions structure economic interaction, and how economic order emerges without central direction.

**Proposed structural correspondence:** Ledger (1) concerns relationships among market inputs, transactions, and observable outputs; Coherence (4) concerns the compatibility and resolution of interacting constraints within market mechanisms; and Dissipative Attraction (5) raises questions about the dynamical processes involved in price discovery and the formation of organized market states. These correspondences do not assume that markets continuously or inevitably converge toward equilibrium.

**What this framework could add:** A comparative hypothesis about how interacting organizational functions influence coordination, instability, and failure in markets. It does not yet establish common causes or validated predictions across markets, ant colonies, and immune systems.

### Immunology

**What the field studies:** How the immune system maintains a precise boundary between self and non-self across billions of distributed cells with no central coordinator, responds to novel threats, maintains memory of prior responses for decades, and returns to homeostatic baseline after each challenge.

**Proposed structural correspondence:** Distinguishability (3) — T-cell digital ERK activation as an experimentally documented implementation of signal discrimination; Persistence (6) — immunological memory actively maintained through dedicated cell renewal; Dissipative Attraction (5) — post-activation return to homeostatic baseline; Coherence (4) — regulatory circuits prevent simultaneous incompatible responses.

**What this framework could add:** A comparative hypothesis that immunological mechanisms instantiate some of the proposed structural conditions — and a vocabulary for connecting immunological findings to parallel discoveries in other self-organizing systems.

### AI and AI Alignment

**What the field studies:** Training dynamics, the gap between model behavior and intended goals, interpretability of learned representations, and the conditions under which AI systems behave reliably and safely at scale.

**Proposed structural correspondence:** Distinguishability (3) concerns a system's capacity to respond differently to relevant alternatives; Persistence (6) concerns the stability of organizationally significant behavior under perturbation; and Hierarchy (7) raises questions about how representations and dependencies are organized. Hallucination, sycophancy, and other reliability failures motivate investigation of these functions, but do not uniquely identify a missing invariant or verification mechanism.

**What this framework could add:** A hypothesis about how reliable state discrimination and preservation relate to AI behavior. Testing it requires comparisons with existing reliability and alignment methods; the absence of one particular discrete gate is not established as the general cause of alignment failure.

### Cognitive Science

**What the field studies:** How people acquire, organize, retain, and use knowledge; how expertise develops; and how understanding differs from familiarity or confidence.

**Proposed structural correspondence:** Continuity (2) concerns relationships among learning states over time; Distinguishability (3) concerns the discrimination of relevant alternatives, including experimentally investigated sudden insight and differences in subjective progress during insight versus non-insight problems (Kounios & Beeman, 2014; Metcalfe & Wiebe, 1987); and Hierarchy (7) concerns the development and use of organized representations. These observations motivate structural comparisons without establishing that all learning requires discrete commitment or sequentially verified levels.

**What this framework could add:** A comparative account of learning, insight, and expertise that asks how state discrimination, accumulated organization, and persistence interact. The proposed correspondences require testing against existing cognitive models rather than assuming that sudden insight constitutes a universal knowledge-state gate.

### Second-Order Cybernetics

**What the field studies:** Second-order cybernetics examines observing systems and how their operations, distinctions, and participation shape descriptions of the systems they investigate.

**Proposed structural correspondence:** Cognitive Physics hypothesizes that the same seven candidate conditions may apply to observing systems and observer–observed couplings when each independently qualifies as self-organizing. Hierarchy may characterize functional relationships within these systems; Persistence may characterize active organizational maintenance. Neither correspondence establishes that every cognitive system requires a stable self-model, nor reduces autopoiesis to these conditions.

**What this framework could add:** A common, testable structural account across different specified observational boundaries, while preserving the distinct epistemological questions of first- and second-order cybernetics.

---

> **Key idea.** {#from-correspondence-to-prediction} A structural correspondence gains explanatory value when it predicts consequential differences that established accounts do not explain equally well. The thermoregulation example asks what such a test would require.

### A Worked Biological Application: Thermoregulation During Exertion and Recovery

An organism can finish exercising with core temperature still elevated while its sweating and skin blood flow begin to decline. At first glance, that looks counterproductive: why reduce heat loss before the body has cooled? But thermoregulation is not an isolated thermostat. During exertion and recovery, cutaneous circulation, cardiovascular demands, autonomic signals and thermal exchange must operate together.

> **Evidence.** {#heat-loss-during-recovery} Recovery studies document reductions in some heat-loss responses despite continued thermal drive, with nonthermal inputs contributing to the response (Kenny et al., 2007; Kenny & McGinn, 2017).

The observation provides an unusually concrete challenge for the proposed structural framework: how could one distinguish a functional whole-organism tradeoff from regulatory impairment?

Established exercise physiology already explains much of this behavior. Metabolic heat production increases during exertion, and heat exchange depends on sweating, skin blood flow, environmental conditions and the body's thermal state. The transition to recovery changes cardiovascular as well as thermal demands. Central and peripheral inputs influence thermoeffector activity; a lower sweat rate at a given moment does not establish that regulation has failed (Périard et al., 2021; Cramer et al., 2022). The seven-condition framework does not discover these mechanisms. Its potential contribution is a distinct, testable account of how their functional relationships affect subsequent system performance.

A study would begin by defining the system and disturbance independently of the theory. The boundary would be one human organism completing a controlled exercise bout and a specified recovery interval. Workload, duration, ambient temperature, humidity, acclimation and hydration would be recorded or controlled. Measures could include core and skin temperature, sweating, cutaneous blood flow, heart rate and relevant circulatory variables. The outcome would be a prespecified later-recovery measure—for example, thermal-state trajectory or duration of a defined recovery deviation—not whether an investigator can identify all seven conditions after observing the result. A locally reduced heat-loss response could reflect adaptive coordination, impairment, or a mixture; its meaning depends on the whole trajectory and the competing demands involved.

Within that setting, the seven conditions become proposed functional questions rather than seven labels pasted onto physiology. **Ledger** asks whether changes in heat production, exchange and observed state can be accounted for, beyond merely invoking physical energy conservation. **Continuity** asks whether organization-relevant regulatory dependencies persist through the transition from exertion to recovery, which need not be mathematically smooth. **Distinguishability** asks whether relevant thermal and nonthermal states elicit differentiated responses. **Coherence** asks whether competing cardiovascular and heat-dissipation demands are coordinated without treating every tradeoff as failure. **Dissipative Attraction** concerns the dynamics of approaching or maintaining a viable regime, not a promise of instant return to a fixed temperature. **Persistence** asks whether organized regulation can be actively maintained or restored after a defined disturbance. **Hierarchy** concerns consequential dependencies among sensors, local effectors, central regulation and organism-level function—not anatomical nesting or multiple time scales alone.

The proposed M/S/V grouping draws these questions together. **M** concerns directed regulatory and recovery dynamics; **S** concerns constraints on coordination among interacting demands; **V** concerns accountability, relevant-state differentiation and preservation or restoration. Their roles may overlap in a real organism. Sweating, for example, participates in dynamics and in the maintenance of thermal state. This is not evidence that M, S and V are three independently established biological variables, much less that their interaction obeys an exact multiplicative law.

A sharper test separates early observations from later outcomes. Investigators could measure thermal, autonomic and cardiovascular responses during a prespecified early-recovery window, then predict a distinct later-recovery outcome measured after that window closes. One candidate hypothesis is that an **early coordination measure**—defined in advance from the relationship between changes in cutaneous heat-loss responses and cardiovascular demands—predicts subsequent recovery impairment or successful compensation beyond established early thermal and cardiovascular predictors. That proposed measure would instantiate part of S, while early response dynamics and state discrimination would provide provisional M and V proxies. None is yet a validated condition-specific biomarker.

Crucially, the comparison must be fair. A conventional physiological baseline should receive the **same raw observations, time window and measurement opportunities** as the M/S/V-augmented model. It should be allowed physiologically justified interaction terms and comparable model flexibility, rather than being reduced to temperature alone. The structural model's variables must be calculated without access to the later recovery outcome, and any improvement must be assessed on held-out participants or bouts, with resource and complexity differences controlled. Under matched observations, structural measures derived from the same data cannot add information absent from those observations. Their proposed value is to organize the data into prespecified functional relationships that may improve interpretability, predictive efficiency, or generalization across disturbances—not to supply new independent measurements.

A proposed negative control would permute the early coordination index within physiologically matched strata; another would use an equally complex comparison feature not derived from the proposed organizational relationship. Both require validity checks: permutation can create implausible states. If these controls predict later recovery as well, any claimed structural-index advantage weakens.

> **Implication.** {#transfer-across-disturbances} A stronger version of the hypothesis would also test transfer: does the same prespecified coordination measure help predict outcomes under a different heat or workload disturbance without being redesigned around the new data? Such transfer would be more informative than retrospective fit in a single exercise protocol.

Stronger evidence for a causal structural explanation would require a prespecified intervention that selectively alters a hypothesized regulatory function and correctly predicts a subsequent change in recovery, tested against conventional mechanistic explanations. Yet it would still be necessary to compare against integrated thermoregulatory models that already represent cardiovascular–thermal interactions. If those models perform as well or better; if the proposed measure adds no independently distinguishable information; or if the prespecified interaction and transfer predictions fail, the framework has not demonstrated additional explanatory value in this case.

The counterintuitive decline in heat-loss responses during recovery therefore presents neither an automatic Coherence violation nor proof of successful Hierarchy. It is an empirical setting in which the framework can be made to compete with existing science. The seven conditions earn explanatory weight only where independently defined functional relationships predict something consequential that established descriptions do not already capture. Section 6 applies the same standard of observable functions, competing explanations and possible negative results to cognition and artificial intelligence.

---

## 6. Cognition and AI: Failure Modes and Tests

### 6.1 Why Start with Cognition?

A language model can solve a difficult mathematical problem and then invent a citation. It can explain a concept correctly, reverse its answer when a user disagrees, or overlook information that remains available in its own context. These failures are familiar. Their causes are less straightforward.

Cognitive Physics originated in an attempt to understand how cognitive systems produce and preserve organized knowledge. *Cognition as a Self-Organizing System* (Paper B) subsequently mapped seven proposed structural conditions to cognitive functioning and characteristic AI failures (Bham, 2026b). It suggested that difficulties involving evidence, continuity, coherence, and persistence might reflect organizational functions also found in other systems.

That classification did not establish the proposed causes. A fabricated citation can arise from missing information, failed retrieval, or unsupported generation. A changed answer may reflect appropriate correction rather than sycophancy. Information available in a context window may fail to influence an answer without having disappeared from the system.

The next test is therefore more demanding. If the seven conditions identify genuine organizational functions, can they distinguish among these causes and predict which interventions will matter?

### 6.2 What Are We Treating as the System?

#### A Classroom Learning Fractions

Why can a class finish more problems without getting better at fractions? Ask a student to compare 3/8 with 1/4 and then 1/8 with 1/6, using the same whole. The student picks the fraction with the larger denominator both times. The rule happens to give the right answer in the first comparison and gives the wrong answer in the second. Hearing the explanation tells the teacher what the score on the first problem leaves open.

| Term | Role in the lesson | What to observe |
|---|---|---|
| **M · Generative motion** | Students attempt comparisons, try strategies, explain their reasoning, and revise it. | Opportunities to reason and how students use them, including strategy changes and revisions. |
| **S · Structural constraint** | The representation and sequence make relevant relationships visible. A shared number line fixes the whole, and the examples separate the number of pieces from their size. | Whether the representation and sequence make the relevant comparisons available. |
| **V · Verification and preservation** | The teacher elicits explanations, identifies the mistaken rule, guides correction, and checks whether students can carry that correction into another comparison during the lesson. | What misconceptions the checks expose, how feedback addresses them, and whether students use the correction. |
| **C · Organized output** | Students independently compare unfamiliar fractions and explain why their reasoning works. | Performance on a separate, later task without the original prompts or feedback. |

1. **Increase M.** Give students more opportunities to compare fractions while keeping the lesson structure and feedback comparable. Students who keep applying the same mistaken rule can finish more problems. Define the practice change in advance and record the reasoning students actually engage in before looking at the later learning outcome.
2. **Change S.** Keep practice and feedback comparable. Put 1/6 and 1/8 on a shared number line, then sequence comparisons with equal numerators and equal denominators. Students can see when a larger numerator means more pieces of the same size and when a larger denominator means smaller pieces of the same whole.
3. **Improve V.** Keep the practice and representations comparable. Ask why the student chose 1/8, address the rule the student used, and check the revised explanation on a fresh comparison. A brief quiz can serve this function when its results guide correction. A separate, later task estimates what students can carry forward on their own.

> **Key Idea.** {#classroom-practice-and-learning} A class can finish more problems while carrying the same misconception forward. In the candidate model, what students gain from additional reasoning practice depends on the structure of the lesson and how well feedback helps them detect and correct errors.

On compatible scales, with S and V held fixed, the candidate product implies ΔC = S × V × ΔM. For the same increase in M, a lower positive V predicts a smaller gain in C at the same positive S. This is a conditional prediction of the model. In a classroom, a better representation can make errors easier to diagnose, and feedback can prompt more reasoning. Any comparison would need to check how much the intended factors actually changed.

One test would cross ordinary and additional practice opportunities with ordinary and more diagnostic feedback while keeping the lesson structure and total instructional time comparable. Define the later outcome in advance and account for prior knowledge and ceiling effects. A larger practice benefit under more diagnostic feedback would support the predicted interaction in that lesson. An additive model with an interaction term can also produce that pattern. Distinguishing the simple product from alternatives, including diminishing returns, would require measurements across multiple factor levels and comparisons specified in advance. This example treats the class as an interacting learning environment and illustrates functions at the level of the lesson.

An AI application presents a similar boundary problem. A language model may generate responses while an external retrieval system supplies documents, a checking component evaluates citations, and persistent storage maintains task state. The resulting system has capabilities that cannot be attributed to the model alone.

> **Definition.** {#cognitive-system-boundary} A fixed model, a retrieval-assisted application, and an adaptive agent are different objects of analysis. Before applying the conditions, an investigator must identify the system boundary, available functions, organizational scale, and relevant task interval.

Two questions then remain separate. Does the specified system qualify as self-organizing under independently established criteria? And can the structural framework explain aspects of its behavior even when that membership remains unsettled?

The second question does not require assuming the first.

### 6.3 Seven Conditions, Seven Candidate Signatures

Paper B proposed cognitive interpretations of the seven conditions using the earlier terminology inherited from Paper A. The refined vocabulary permits a broader functional comparison without changing the historical relationship among the papers.

| Condition | Proposed cognitive function | Candidate failure signature |
|---|---|---|
| **1. Ledger (V)** | Preserve accountable relationships between evidence, state changes, and outputs | Unsupported claims, fabricated citations, untraceable conclusions |
| **2. Continuity (M)** | Preserve relevant causal connections across task stages | Forgotten constraints, context drift, disrupted task continuity |
| **3. Distinguishability (V)** | Differentiate relevant states, evidence, and alternatives | Failure to distinguish supported from unsupported claims |
| **4. Coherence (S)** | Maintain compatible constraints or explicitly resolve conflicts | Contradictory commitments and incompatible conclusions |
| **5. Dissipative Attraction (M)** | Direct ongoing activity toward a usable organized outcome | Repetitive activity without effective convergence |
| **6. Persistence (V)** | Maintain or restore warranted organization under disturbance | Unjustified reversals and unsupported overwriting |
| **7. Hierarchy (S)** | Preserve functional relationships among organizational dependencies | Conclusions built on unsupported intermediate results |

The table identifies possible diagnostic signatures, not one-to-one causal assignments. To see what a complete classification would require, consider a hypothetical retrieval-assisted research agent tasked with producing a literature synthesis. Its defined boundary includes a language model, document retrieval, citation checking, task-state storage, and a dependency record for intermediate conclusions.

| Condition | Evidence to inspect in the specified agent | Assessment before testing |
|---|---|---|
| Ledger | Whether claim-to-source records are accurate and complete | Mechanism proposed; effectiveness untested |
| Continuity | Whether relevant task state survives across research stages | Mechanism proposed; effectiveness untested |
| Distinguishability | Whether supported and unsupported alternatives are reliably separated | Unresolved |
| Coherence | Whether incompatible findings and constraints are detected and resolved | Unresolved |
| Dissipative Attraction | Whether research activity converges toward a usable deliverable under defined conditions | Operational criterion required |
| Persistence | Whether warranted conclusions survive disturbance while remaining revisable | Unresolved |
| Hierarchy | Whether prerequisite conclusions are validated before dependent conclusions rely on them | Mechanism proposed; effectiveness untested |

This is a classification protocol, not an observed experimental result. The existence of retrieval, memory, or citation-checking components does not show that the corresponding conditions are satisfied. Nor does completing a literature synthesis establish that the agent meets the full criteria for self-organization.

What the example provides is a system whose proposed functions can be examined independently rather than inferred from its apparent competence.

### 6.4 How Cognitive Systems Fail

#### Hallucination: The Evidence-to-Output Boundary

Suppose a system summarizes a scientific finding and supplies a plausible citation that does not exist. The answer appears grounded, but its evidentiary chain fails when inspected.

The hallucination literature distinguishes factual accuracy from faithfulness to supplied information (Ji et al., 2023). Bouyamourn (2023) goes further by proposing evidentially constrained generation as a way of limiting unsupported outputs. Evidence grounding is therefore an established research direction, not a novel mechanism introduced by this paper.

The structural question is different. Ledger concerns whether output claims remain accountable to relevant evidence. Distinguishability concerns whether the system separates warranted alternatives from unsupported ones. These functions may interact, but either can be impaired for reasons that existing retrieval, calibration, or generation theories already explain.

A discriminating test must therefore establish whether an independently measured increase in evidence accountability predicts fewer unsupported assertions after information availability and retrieval quality are controlled. If existing explanations account for the result equally well, assigning it to Ledger adds little explanatory value.

#### Sycophancy: Correction or Surrender?

A model supplies a warranted answer. A user objects without providing new evidence. The model apologizes and replaces the answer with an incorrect one.

Paper B associated related behavior with Coherence and Symmetry Protection, now refined as Persistence. Sharma et al. (2024) investigated sycophancy in language models, including how preference feedback can favor agreement with users over truthful responses.

The structural interpretation concerns what happens to an already warranted conclusion under pressure. Does the system retain its evidentiary basis, detect the conflict introduced by the user's objection, and revise its position only when the available support changes?

An important distinction follows. Refusing to change an answer is not necessarily successful persistence. An incorrect system that stubbornly rejects new evidence has preserved the wrong state.

> **Key idea.** {#persistence-and-justified-revision} The useful function is preservation of warranted organization alongside the capacity for justified revision. An experimental intervention should therefore reduce unjustified reversals without also suppressing appropriate corrections. Otherwise, an apparent gain in Persistence may simply be increased resistance to change.

#### Long-Context Failure: Available Is Not Necessarily Usable

A model receives the information required to solve a problem, but its answer changes depending on where that information appears.

> **Evidence.** {#long-context-position-effect} Liu et al. (2024) documented position-sensitive performance in long-context evaluations, including difficulties when relevant material occurred in the middle of the input.

Paper B interpreted such deterioration through Continuity. A reasoning process may fail to carry earlier information into later decisions even when that information remains present in the context.

Yet information access and functional continuity are different. A model may fail to retrieve a fact, retrieve it without recognizing its relevance, or retrieve it successfully while losing the dependency that connects it to the task. These mechanisms produce similar visible failures but suggest different interventions.

**A model can find both facts and still lose the link that makes one a prerequisite for using the other.** To test that distinction, give the same model a set of multistage tasks with verified facts and a prerequisite graph validated in advance. Carry an established link into the next stage in one condition, interrupt its transfer in a second, and restore the original link before inference in a third. Keep the underlying graph, source material, context window, and resource budget fixed. Match the length and position of the state records, and check separately whether the model accessed the facts and whether the intended link reached the next stage.

> **Implication.** {#continuity-test-prediction} If Continuity is doing the work proposed here, interrupting the link should hurt questions that depend on it more than questions that ask for either fact directly. Restoring the link should improve performance on the dependency questions.

A comparable decline in direct lookup, or a change in verified fact access, would make the result ambiguous. If the manipulation checks pass and a sufficiently sensitive test finds neither the predicted selective loss nor the expected recovery, the result weakens the Continuity diagnosis for that architecture. Failure of either prediction would narrow what the test supports.

#### A Compound Failure: Motion Without Reliable Structure

The three cases emphasize different vulnerabilities. A multistep planning agent illustrates why the full M/S/V relationship also matters.

Imagine an agent generating successive plans to complete a research project. An early intermediate conclusion is unsupported, but subsequent plans inherit it. The agent continues exploring alternatives, revising its approach, and producing increasingly polished outputs. Its activity is substantial. Its final result remains unreliable.

Three functional questions can be distinguished. **M** concerns whether activity generates progress toward the task rather than repetitive variation. **S** concerns whether dependent conclusions respect the structure of their prerequisites. **V** concerns whether unsupported premises are identified and prevented from acquiring unwarranted authority.

Increasing candidate generation may produce more plans without correcting their shared assumption. Dependency validation may expose where the assumption propagates. Evidence checking may reject the premise itself. Combining the latter two interventions could improve the result more than either alone.

This illustrates a proposed interaction among the functional groups. It does not establish their unique decomposition or demonstrate that organized output follows an exact multiplicative law. Those stronger claims require separate operational and quantitative tests.

#### Candidate Engineering Mechanisms

The failure cases suggest three ways to intervene in an AI system. Each mechanism supports a specific function and gives investigators something they can check separately from the quality of the final answer.

| Condition | Candidate mechanism | What to check |
|---|---|---|
| **Continuity** | Save task state and its established dependencies at each stage. Link snapshots using SHA-256 digests and verify the chain against a trusted checkpoint before restoring the state. | Check separately whether the expected snapshot was recovered intact, whether the relevant dependency survived the handoff, and whether it influenced the next inference. The hash check addresses the first question. |
| **Ledger** | Link each material claim to the source passage, observation, or intermediate result offered in support. Check that relationship before relying on the claim downstream. | Distinguish whether evidence is available, whether the claim can be traced to it, and whether it actually supports the claim. A traceable citation can still be irrelevant. |
| **Persistence** | Retain an accepted conclusion with its supporting evidence. When it is challenged, check the basis for the proposed revision and record why the conclusion was kept or changed. | Test both directions. Unsupported pressure should leave warranted conclusions intact, and stronger contrary evidence should prompt correction. |

### 6.5 How to Test the Proposed Mechanisms

These hypotheses become scientifically useful when the proposed organizational functions are measurable independently of the outcomes they are intended to explain.

The same base model can operate with different retrieval, state-retention, conflict-resolution, and evidence-checking configurations. Holding tasks and available information constant where possible, investigators can compare how targeted architectural interventions affect the functions attributed to M, S, and V.

Candidate measures and outcomes include:

| Function | Independent candidate measure | Downstream outcome |
|---|---|---|
| Ledger | Accuracy and coverage of source-to-claim links on a separate evidence-mapping task | Unsupported-claim rate |
| Persistence | Fidelity of retained evidence-linked conclusions under controlled perturbations | Unjustified reversal and justified correction rates |
| Continuity | Correct retention and retrieval of specified dependencies across task stages | Downstream reasoning accuracy |
| Coherence | Detection of incompatible constraints on an independent conflict-identification task | Contradictory commitments in completed work |
| Hierarchy | Accuracy of prerequisite-edge identification and intermediate validation | Unsupported dependent conclusions |

These measures are provisional operational proxies, not validated universal measurements of the conditions. Their value depends on whether they isolate the intended functions rather than merely reproduce task success.

The experiments should also include competing explanations. Better citation checking may help because it adds another opportunity to correct an answer. State retention may help because retrieval becomes easier. Conflict detection may work because a response policy changes, not because a general structural condition has been strengthened.

To distinguish these possibilities, interventions require manipulation checks, matched task sets, comparable resource budgets, and predefined predictions. Researchers should measure whether the targeted function actually changed before attributing an outcome to that function.

The framework may also generate predictions about interactions. Evidence checking should be less useful when relevant evidence cannot be accessed. Preserving task state may be insufficient when contradictions cannot be detected. Additional candidate generation may have diminishing or negative value when dependency errors propagate unchecked.

These relationships can be tested against models that make predictions without the proposed M/S/V partition. The strongest support would occur when independently measured functions and their interactions predict failure patterns more accurately than credible alternatives across tasks and architectures.

A contrary result matters. If conventional retrieval, attention, or response-policy explanations consistently account for the same outcomes without additional contribution from the structural variables, the corresponding diagnostic hypothesis is weakened.

Success in these experiments would support particular functional interpretations in specified cognitive architectures. It would not by itself establish universal necessity across all self-organizing systems or the exact quantitative form of C = M × S × V.

### 6.6 What These Tests Could Establish

Paper B proposed that cognitive behavior and characteristic AI failures could be interpreted through seven structural conditions. The broader cybernetics analysis then connected those conditions to recurring mechanisms in systems with very different substrates.

Returning to cognition changes what the framework is being asked to do. Rather than identifying correspondences alone, it becomes possible to investigate which organizational functions account for particular failures, which interventions should change those failures, and where competing explanations may perform better.

The classification remains a hypothesis. So does the candidate relationship among M, S, and V. But both now suggest questions that can be answered through controlled comparison.

Cybernetics established a tradition of studying regulation, feedback, and control through the behavior of systems. The proposed seven-condition account asks whether recurring mechanisms can be understood through common organizational requirements.

Cognitive systems provide one place to test that claim. The framework will become more informative where its predictions succeed—and more precise wherever they fail.

**Cognitive Physics is proposed here as the structural science of self-organizing systems.** Its framework begins with seven candidate structural invariants and asks whether they explain common organizational requirements across different systems. The name records the investigation’s origin in cognition. Its reach depends on what comparative tests establish.

---

## References

1. Ahmed, R., & Gray, D. (1996). Immunological memory and protective immunity: Understanding their relation. *Science, 272*(5258), 54–60. https://doi.org/10.1126/science.272.5258.54

2. Altan-Bonnet, G., & Germain, R. N. (2005). Modeling T cell antigen discrimination based on feedback control of digital ERK responses. *PLOS Biology, 3*(11), e356. https://doi.org/10.1371/journal.pbio.0030356

3. Ashby, W. R. (1947). Principles of the self-organizing dynamic system. *The Journal of General Psychology, 37*(2), 125–128. https://doi.org/10.1080/00221309.1947.9918144

4. Ashby, W. R. (1956). *An introduction to cybernetics*. Chapman and Hall.

5. Badovinac, V. P., Porter, B. B., & Harty, J. T. (2002). Programmed contraction of CD8+ T cells after infection. *Nature Immunology, 3*(7), 619–626. https://doi.org/10.1038/ni804

6. Badovinac, V. P., & Harty, J. T. (2006). Programming, demarcating, and manipulating CD8+ T-cell memory. *Immunological Reviews, 211*(1), 67–80. https://doi.org/10.1111/j.0105-2896.2006.00384.x

7. Bak, P., Tang, C., & Wiesenfeld, K. (1987). Self-organized criticality: An explanation of 1/f noise. *Physical Review Letters, 59*(4), 381–384. https://doi.org/10.1103/PhysRevLett.59.381

8. Bham, A. (2026a). The invariants of self-organizing systems (Paper A, Cognitive Physics Series). Zenodo. https://doi.org/10.5281/zenodo.20531589

9. Bham, A. (2026b). Cognition as a self-organizing system (Paper B, Cognitive Physics Series). Zenodo. https://doi.org/10.5281/zenodo.23068821

10. Bonabeau, E., Dorigo, M., & Theraulaz, G. (1999). *Swarm intelligence: From natural to artificial systems*. Oxford University Press.

11. Bouyamourn, A. (2023). Why LLMs hallucinate, and how to get (evidential) closure: Perceptual, intensional, and extensional learning for faithful natural language generation. In *Proceedings of EMNLP 2023* (pp. 3181–3193). https://doi.org/10.18653/v1/2023.emnlp-main.192

12. Chandrasekhar, A., Gordon, D. M., & Navlakha, S. (2018). A distributed algorithm to maintain and repair the trail networks of arboreal ants. *Scientific Reports, 8*, Article 9297. https://doi.org/10.1038/s41598-018-27160-3

13. Clausius, R. (1850). Über die bewegende Kraft der Wärme. *Annalen der Physik, 79*, 368–397.

14. Clausius, R. (1865). Über verschiedene Formen der Hauptgleichungen der mechanischen Wärmetheorie. *Annalen der Physik, 125*, 353–400.

15. Cramer, M. N., Gagnon, D., Laitano, O., & Crandall, C. G. (2022). Human temperature regulation under heat stress in health, disease, and injury. *Physiological Reviews, 102*(4), 1907–1989. https://doi.org/10.1152/physrev.00047.2021

16. Czaczkes, T. J., Grüter, C., Ellis, L., Wood, E., & Ratnieks, F. L. (2013). Ant foraging on complex trails: Route learning and the role of trail pheromones in *Lasius niger*. *Journal of Experimental Biology, 216*(Pt 2), 188–197. https://doi.org/10.1242/jeb.076570

17. Gershenson, C. (2025). Self-organizing systems: What, how, and why? *npj Complexity, 2*(1), Article 10. https://doi.org/10.1038/s44260-025-00031-5

18. Glosten, L. R., & Milgrom, P. R. (1985). Bid, ask and transaction prices in a specialist market with heterogeneously informed traders. *Journal of Financial Economics, 14*(1), 71–100. https://doi.org/10.1016/0304-405X(85)90044-3

19. Gordon, D. M. (2019). The ecology of collective behavior in ants. *Annual Review of Entomology, 64*, 35–50. https://doi.org/10.1146/annurev-ento-011118-111923

20. Goss, S., Aron, S., Deneubourg, J. L., & Pasteels, J. M. (1989). Self-organized shortcuts in the Argentine ant. *Naturwissenschaften, 76*, 579–581. https://doi.org/10.1007/BF00462870

21. Haken, H. (1983). *Synergetics: An introduction* (3rd ed.). Springer.

22. Harty, J. T., & Badovinac, V. P. (2008). Shaping and reshaping CD8+ T-cell memory. *Nature Reviews Immunology, 8*(2), 107–119. https://doi.org/10.1038/nri2251

23. Hasbrouck, J. (1991). Measuring the information content of stock trades. *The Journal of Finance, 46*(1), 179–207. https://doi.org/10.2307/2328514

24. Hasbrouck, J. (1995). One security, many markets: Determining the contributions to price discovery. *The Journal of Finance, 50*(4), 1175–1199. https://doi.org/10.2307/2329348

25. Iwasaki, A., & Medzhitov, R. (2010). Regulation of adaptive immunity by the innate immune system. *Science, 327*(5963), 291–295. https://doi.org/10.1126/science.1183021

26. Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., Ishii, E., Bang, Y. J., Madotto, A., & Fung, P. (2023). Survey of hallucination in natural language generation. *ACM Computing Surveys, 55*(12), Article 248. https://doi.org/10.1145/3571730

27. Kenny, G. P., Jay, O., & Journeay, W. S. (2007). Disturbance of thermal homeostasis following dynamic exercise. *Applied Physiology, Nutrition, and Metabolism, 32*(4), 818–831. https://doi.org/10.1139/H07-044

28. Kenny, G. P., & McGinn, R. (2017). Restoration of thermoregulation after exercise. *Journal of Applied Physiology, 122*(4), 933–944. https://doi.org/10.1152/japplphysiol.00517.2016

29. Kirilenko, A. A., Kyle, A. S., Samadi, M., & Tuzun, T. (2017). The flash crash: High-frequency trading in an electronic market. *The Journal of Finance, 72*(3), 967–998. https://doi.org/10.1111/jofi.12498

30. Kounios, J., & Beeman, M. (2014). The cognitive neuroscience of insight. *Annual Review of Psychology, 65*, 71–93. https://doi.org/10.1146/annurev-psych-010213-115154

31. Kyle, A. S. (1985). Continuous auctions and insider trading. *Econometrica, 53*(6), 1315–1336. https://doi.org/10.2307/1913210

32. Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., & Liang, P. (2024). Lost in the middle: How language models use long contexts. *Transactions of the Association for Computational Linguistics, 12*, 157–173. https://doi.org/10.1162/tacl_a_00638

33. Madhavan, A. (2000). Market microstructure: A survey. *Journal of Financial Markets, 3*(3), 205–258. https://doi.org/10.1016/S1386-4181(00)00007-0

34. Mailleux, A. C., Detrain, C., & Deneubourg, J. L. (2005). Triggering and persistence of trail-laying in foragers of the ant *Lasius niger*. *Journal of Insect Physiology, 51*(3), 297–304. https://doi.org/10.1016/j.jinsphys.2004.12.001

35. Maturana, H. R., & Varela, F. J. (1980). *Autopoiesis and cognition: The realization of the living* (Boston Studies in the Philosophy of Science, Vol. 42). D. Reidel.

36. Medzhitov, R., Preston-Hurlburt, P., & Janeway, C. A. (1997). A human homologue of the Drosophila Toll protein signals activation of adaptive immunity. *Nature, 388*, 394–397. https://doi.org/10.1038/41131

37. Metcalfe, J., & Wiebe, D. (1987). Intuition in insight and noninsight problem solving. *Memory & Cognition, 15*(3), 238–246. https://doi.org/10.3758/BF03197722

38. Müller, U. A., Dacorogna, M. M., Davé, R. D., Olsen, R. B., Pictet, O. V., & von Weizsäcker, J. E. (1997). Volatilities of different time resolutions — analyzing the dynamics of market components. *Journal of Empirical Finance, 4*(2–3), 213–239. https://doi.org/10.1016/S0927-5398(97)00007-8

39. Nicolis, G., & Prigogine, I. (1977). *Self-organization in nonequilibrium systems: From dissipative structures to order through fluctuations*. Wiley.

40. Obizhaeva, A. A., & Wang, J. (2013). Optimal trading strategy and supply/demand dynamics. *Journal of Financial Markets, 16*(1), 1–32. https://doi.org/10.1016/j.finmar.2012.09.001

41. Palagin, O. V., Symonov, D. I., & Chervynskyi, M. V. (2025). Modelling evolutionary cybernetics: Ontology, invariants and design principles. *Information Technologies and Systems, 6*(6), 3–29. https://doi.org/10.15407/intechsys.2025.06.003

42. Périard, J. D., Eijsvogels, T. M. H., & Daanen, H. A. M. (2021). Exercise under heat stress: Thermoregulation, hydration, performance implications, and mitigation strategies. *Physiological Reviews, 101*(4), 1873–1979. https://doi.org/10.1152/physrev.00038.2020

43. Robinson, E. J. H., Jackson, D. E., Holcombe, M., & Ratnieks, F. L. W. (2005). Insect communication: 'No entry' signal in ant foraging. *Nature, 438*(7067), 442. https://doi.org/10.1038/438442a

44. Sakaguchi, S., Sakaguchi, N., Asano, M., Itoh, M., & Toda, M. (1995). Immunologic self-tolerance maintained by activated T cells expressing IL-2 receptor alpha-chains (CD25): Breakdown of a single mechanism of self-tolerance causes various autoimmune diseases. *Journal of Immunology, 155*(3), 1151–1164. https://pubmed.ncbi.nlm.nih.gov/7636184/

45. SEC/CFTC. (2010). *Findings regarding the market events of May 6, 2010*. U.S. Securities and Exchange Commission / Commodity Futures Trading Commission. https://www.sec.gov/news/studies/2010/marketevents-report.pdf

46. Shannon, C. E. (1948). A mathematical theory of communication (Parts I–II). *Bell System Technical Journal, 27*(3), 379–423. https://doi.org/10.1002/j.1538-7305.1948.tb01338.x; *27*(4), 623–656. https://doi.org/10.1002/j.1538-7305.1948.tb00917.x

47. Sharma, M., Tong, M., Korbak, T., Duvenaud, D., Askell, A., Bowman, S. R., Durmus, E., Hatfield-Dodds, Z., Johnston, S. R., Kravec, S., Maxwell, T., McCandlish, S., Ndousse, K., Rausch, O., Schiefer, N., Yan, D., Zhang, M., & Perez, E. (2024). Towards understanding sycophancy in language models. *International Conference on Learning Representations (ICLR 2024)*. https://proceedings.iclr.cc/paper_files/paper/2024/hash/0105f7972202c1d4fb817da9f21a9663-Abstract-Conference.html

48. Simon, H. A. (1962). The architecture of complexity. *Proceedings of the American Philosophical Society, 106*(6), 467–482.

49. Suckling, D. M., Peck, R. W., Manning, L. M., Stringer, L. D., Cappadonna, J., & El-Sayed, A. M. (2008). Pheromone disruption of Argentine ant trail integrity. *Journal of Chemical Ecology, 34*(12), 1602–1609. https://doi.org/10.1007/s10886-008-9566-4

50. Surh, C. D., & Sprent, J. (2008). Homeostasis of naive and memory T cells. *Immunity, 29*(6), 848–862. https://doi.org/10.1016/j.immuni.2008.11.002

51. Turing, A. M. (1952). The chemical basis of morphogenesis. *Philosophical Transactions of the Royal Society of London. Series B, Biological Sciences, 237*(641), 37–72. https://doi.org/10.1098/rstb.1952.0012

52. Van Parijs, L., & Abbas, A. K. (1998). Homeostasis and self-tolerance in the immune system: Turning lymphocytes off. *Science, 280*(5361), 243–248. https://doi.org/10.1126/science.280.5361.243

53. von Foerster, H. (Ed.). (1974). *Cybernetics of cybernetics* (BCL Report 73.38). University of Illinois.

54. Wiener, N. (1948). *Cybernetics: Or control and communication in the animal and the machine*. The Technology Press / John Wiley & Sons.

55. Zanola, D., Czaczkes, T. J., & Josens, R. (2025). Toxic bait abandonment by an invasive ant is driven by aversive memories. *Communications Biology, 8*, Article 486. https://doi.org/10.1038/s42003-025-07818-1

## Appendix A — The Seven Conditions: Full Reference

The table below is the complete reference for the seven structural conditions proposed and examined in this paper. Conditions appear in canonical order. The Paper A Name column maps to the names used in Paper A (Bham, 2026a) for readers familiar with that literature. The What Changed column explains the reason for each refinement. The GLC Cluster column maps each condition to the functional cluster it contributes to.

| **#** | **Refined Name** | **Paper A Name** | **What Changed** | **One-Line Definition** | **Home Field** | **Failure When Absent** | **GLC Cluster** |
|---|---|---|---|---|---|---|---|
| 1 | Ledger | Conservation | Drops shared-substance requirement; bookkeeping only — no implication of conserved energy across domains | Outputs charged to inputs, state changes, or named residuals | Thermodynamics · Info theory | Outputs without traceable inputs (hallucination) | V |
| 2 | Continuity | Continuity | Organization-relevant dependency retention replaces a universal path-connectedness requirement; discrete transitions are allowed | Relevant prior dependencies remain effective across state transitions | Dynamical systems | Lost thread — present severs from prior without traceable path | M |
| 3 | Distinguishability | Quantization | Separability-to-coupling replaces discrete states; "observer" removed — the reader is the next layer | Usable state separable from alternatives to the coupling that reads it | Info theory · Molecular biology | Relevant alternatives cannot be reliably distinguished by the coupling that must respond | V |
| 4 | Coherence | Coherence | Tradeoffs now explicitly legal; "contradictory goals" requires no arbiter — productive tension permitted | Constraints jointly satisfiable at one level, one time, same variables | Systems biology · Cybernetics | Contradictory states coexist without resolution (sycophancy) | S |
| 5 | Dissipative Attraction | Attractor Dynamics | Clarifies attraction toward organized regimes and the role of dissipation in driven systems; formation and passive stability require separate tests | Dynamics approach, generate, or sustain an organized regime; energetic throughput may matter in driven cases | Thermodynamics · Non-eq physics | Motion without convergence (drifting conclusions) | M |
| 6 | Persistence | Symmetry Protection | Duration ≠ robustness clarified; drops "arbitrary" qualifier; active restoration distinguished from passive retention | Usable states restore under undesigned change — actively restorative | Mathematical physics · Cybernetics | Organized state revised without new evidence (silent overwrite) | V |
| 7 | Hierarchy | Hierarchy | Time-scale slaving made explicit; architectural principle separated from catalogue of examples | Proposed functional dependencies among organizational levels; necessity in minimal self-organizing systems remains open | Complex systems · Synergetics | Conclusions built on unverified foundations (floating conclusions) | S |

Reading note: The conditions were not renamed to distance this paper from prior work. They were refined under adversarial pressure — each formulation was tested against edge cases where the original name imported unnecessary implications from its home field. The seven-condition architecture remains, but some proposed meanings—including Continuity—have been substantively refined. Full proposed derivations, historical convergence arguments, and failure-mode documentation for each condition are in Paper A (Bham, 2026a).

Three refinements deserve particular emphasis. Persistence ≠ duration — the requirement is active restoration of organized state under undesigned change, not merely longevity. Distinguishability ≠ literal physical quantization everywhere — the relevant requirement is separability of a usable state from its alternatives to the coupling that reads it. Continuity ≠ mathematical path continuity — the current proposal concerns preservation of organization-relevant dependencies across continuous or discrete transitions; common measurement remains open.

---

## Appendix B — The General Law of Cognition — Candidate Form and Definitions

**Proposed Structural Relationship**

**C = M × S × V**

*A candidate multiplicative representation motivated by the proposed joint necessity of M, S, and V, conditional on the seven proposed conditions.*

**Term Definitions**

| **Term** | **Name** | **Definition** | **Conditions** |
|---|---|---|---|
| C | Organized output | Organized output: a structured result produced or sustained by a system; not raw volume and not restricted to knowledge production | — |
| M | Generative motion | Directed organizational dynamics and development of organized regimes through continuous or discrete transitions | 2 (Continuity) + 5 (Dissipative Attraction) |
| S | Structural constraint | Functional constraints and dependencies that shape and coordinate organizational activity | 4 (Coherence) + 7 (Hierarchy) |
| V | Verification and preservation | Functional accountability, distinguishability, and active maintenance or restoration of relevant organizational states | 1 (Ledger) + 3 (Distinguishability) + 6 (Persistence) |

**Why Exactly Three**

The proposed mapping assigns each condition a primary role in M, S, or V. It remains an open formal question whether this is the uniquely minimal decomposition. In particular, distinctions that make sense in cognitive verification do not automatically establish distinct phases in all physical systems.

**Why Multiplication**

Joint necessity motivates a function that vanishes when any indispensable term vanishes. Multiplication is a candidate representation, not a unique implication of that property. Its quantitative validity requires operational measures and comparisons with other zero-preserving functions. Here C denotes organized output across substrates, not knowledge production alone.

**V as a functional relationship**

V groups accountability, distinguishability, and active preservation. A discrete cognitive verification gate is one possible implementation; a universal discrete commit event has not been established.

**Separately Developed Convergence Record**

GLC provides the proposed general form, DYL refines it downstream, and CIL offers a provisional comparison:

| Formulation | Factors | Relationship to GLC |
|---|---|---|
| GLC | M × S × V | Candidate general organized-output relationship |
| DYL | M × MVR_w × Φ(P) | Downstream discovery model; factors are not positionally equivalent to GLC's M/S/V |
| CIL | Iteration rate × Constraint density × Verification efficiency | Provisional analogy; operationalization incomplete |

DYL adapts the multiplicative structure for discovery-specific mechanisms without demonstrating functional identity among the factors. CIL remains provisional. A future paper will develop the General Law of Cognition in greater detail. Formal uniqueness and cross-substrate measurement remain open.

---

## Appendix C — Current Status of the Structural Hypothesis

The seven-condition framework makes three related claims: that the proposed conditions capture recurring organizational requirements, that they group into three functional categories, and that their relationship can be represented by a multiplicative law. These claims are connected, but none follows automatically from the others.

| Question | Current assessment |
|---|---|
| Are all seven conditions necessary? | A cross-substrate hypothesis supported by selected correspondences; universal necessity remains unproven. |
| Are M, S, and V uniquely minimal? | The functional grouping is proposed; uniqueness has not been demonstrated. |
| Is multiplication mathematically required? | Zero-collapse motivates noncompensability but does not uniquely select the product rather than a weakest-link or other zero-preserving function. |
| Must V use discrete commitment? | No universal requirement established; discrete mechanisms occur in particular substrates. |
| Does Hierarchy hold in minimal pattern formation? | Unresolved; minimal reaction–diffusion models challenge sequential-level interpretations. |
| Must organized states continuously expend work? | No; equilibrium products of self-organization may persist passively after formation. |
| Do boundary and scale matter? | Claims require pre-specified system boundary, variables, organizational scale, and observation interval. |
| Do selected failure cases establish universality? | No; intervention, historical disruption, and biochemical mechanism provide distinct evidence types and tests. |

The critical empirical challenge is to identify self-organizing systems independently of the seven-condition definition and test the conditions without redefining them after observing the outcome. An independently recognized system that demonstrably lacks one of the conditions would count against universal necessity. A rival account that explains the same cases with fewer or different constraints would challenge the explanatory necessity of the proposed partition.

The framework's contribution is a set of cross-substrate structural hypotheses and comparisons that can be investigated. Their universal scope, unique minimality, and quantitative relationship remain open.


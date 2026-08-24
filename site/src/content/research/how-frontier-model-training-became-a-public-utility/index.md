---
title: 'How Frontier Model Training Became a Public Utility'
subtitle: 'The frontier is already everywhere. Now what?'
format: 'essay'
pubDate: 2026-08-19
description: >-
  In July 2026, Anthropic CEO Dario Amodei asked policymakers to restrict
  "industrial-scale" AI model distillation, while publicly confirming that
  distillation is more compute-efficient than training frontier models from
  scratch. This piece argues that request is structurally incoherent:
  distillation is a decade-old, commercially mainstream technique — costing
  as little as sixteen dollars to run — that cannot be selectively contained
  through policy. It traces how frontier model training has shifted from
  being a competitive moat to being infrastructure, and argues the real,
  durable competitive advantage has already moved to deployment depth and
  enterprise trust, which distillation cannot replicate.
excerpt: >-
  Dario Amodei asked Congress to restrict AI distillation while admitting
  it's more efficient than his training process. Why that can't work, and
  where the real moat is.
tags: ['distillation', 'AI policy', 'frontier models', 'AI infrastructure']
---

On July 27, 2026, Dario Amodei published [a blog post](https://www.anthropic.com/news/position-open-weights-models) on Anthropic's website laying out the company's position on open-weights AI models. It is worth reading carefully, because it contains something unusual: a senior technology executive publicly confirming the thesis of the argument he is trying to defeat.

Describing a technique called distillation — training a smaller model on the outputs of a larger one — he wrote: "Distillation is a much more compute-efficient process than training models from scratch." Then, in the same document, he asked policymakers to [crack down](https://businessmodelanalyst.com/ai-distillation-china-us-labs/) on what he called "industrial-scale distillation operations."

Before getting into why that creates a structural problem rather than a political one, consider a simpler version of the argument. Imagine the CEO of McDonald's held a press conference to announce that tacos are a much more efficient way to deliver food than burgers — and then asked the government to regulate industrial-scale taco operations. You'd understand the concern. You might also wonder about the burgers.

Strip away the technical vocabulary and that is roughly the shape of what happened. The most credible possible voice on AI safety publicly confirmed that a competing technique is more efficient than the one his business model depends on, and then asked Congress to contain it.

He isn't wrong about the efficiency claim. That is precisely the problem — and it points to something larger than one policy ask. This isn't a story about a bad regulation. It's a story about an entire industry reasoning from a frame that the technology has already made obsolete. Three pieces of evidence show why.

## Key findings

- Distillation is a decade-old, commercially mainstream technique — not a security threat — and now costs as little as ten to sixteen dollars to run on a rented GPU.
- Frontier model training has become infrastructure, not a competitive moat: everything a frontier model can do becomes reproducible at lower cost through distillation, shifting the durable advantage to deployment depth and enterprise trust instead.
- Restricting distillation is categorically different from restricting chips: it's a mathematical operation documented in public literature and taught in graduate programs, not a physical good with a manufacturing chokepoint.
- Restriction doesn't slow diffusion — it accelerates the search for a cheaper path. Chip controls already produced this dynamic once, with DeepSeek.

## This Isn't a Chinese Exploit

The first thing to establish: distillation is not a backdoor. It is not a hack. It is not a technique that lives in legal or ethical gray space. If that assumption is forming, here is the quickest way to dissolve it.

Earlier this year, before any of this became a policy controversy, Jeff Dean — Google's head of AI — described distillation on a podcast the way an engineer describes a standard tool. "Through distillation, which is a key technique for making the smaller models more capable," [he said](https://www.cnbc.com/2026/07/25/hat-is-distillation-and-why-is-everyone-so-obsessed-with-it-this-week.html), "you have to have the frontier model in order to then distill it into your smaller model." No hedging. No caveats. A routine description of how the industry works, offered by one of its most senior figures, months before anyone was debating whether to regulate it.

That's because distillation has been standard practice for a decade. The technique was formalized in [a 2015 paper](https://arxiv.org/abs/1503.02531) by three Google researchers — Geoffrey Hinton, Oriol Vinyals, and Jeff Dean, the same Jeff Dean — and has since accumulated more than 25,000 academic citations. Most fields don't produce that many total citations across their entire published history. This is not an obscure technique that someone discovered a clever use for. It is one of the foundational methods of modern machine learning.

The mechanics are straightforward. You take a large, capable model — the teacher — and use its outputs to train a smaller, cheaper one — the student. The student learns not just the right answers but the reasoning patterns behind them, which turns out to be far more transferable than raw labeled data alone. The result is a smaller model that captures most of what made the teacher useful at a fraction of the cost to run. [DistilBERT](https://www.quantamagazine.org/how-distillation-makes-ai-models-smaller-and-cheaper-20250718/), built by Hugging Face in 2019, is the textbook case: 40% smaller than Google's BERT, 60% faster, retaining 97% of its language understanding. It went on to power search systems and enterprise applications worldwide. Nobody called it a security threat.

By 2026, distillation isn't just academically established — it is commercially mainstream. Google offers it as a service. OpenAI offers it as a service. Amazon offers it as a service. Nvidia used it to build its own Llama Nemotron model family. Researchers who study the technique [describe it plainly](https://www.cnbc.com/2026/07/25/hat-is-distillation-and-why-is-everyone-so-obsessed-with-it-this-week.html): "Distillation is one of the most important tools that companies have today to make models more efficient." The production numbers back that up — [distilled models run at five to thirty times lower cost](https://zylosresearch.com/model-distillation-2026) than their teacher counterparts, respond up to four times faster, and retain 95 to 97 percent of the original model's performance.

All of which makes the phrase "industrial-scale distillation operations" worth examining carefully. Because the scale implied by that framing is already compressing. A [QLoRA fine-tuning run](https://www.spheron.network/blog/how-to-fine-tune-llm-2026/) — the standard distillation-adjacent workflow — on a rented H100 costs between ten and sixteen dollars and runs overnight. Smaller task-specific models can be fine-tuned for under ten dollars on cloud GPUs available to anyone with a credit card.

What exactly does industrial-scale enforcement protect against when the technique it's targeting already costs sixteen dollars to run?

## The Frontier Is Now the Floor

### What distillation actually changed

Here is the question the first misframing obscures: if distillation requires a frontier model to learn from, doesn't that mean frontier training still matters?

Yes. That part Dario gets exactly right — and it's the part that makes the structural problem harder, not easier.

Someone has to build the ceiling. The teacher model has to exist before anyone can learn from it. Frontier training remains the mechanism that sets the upper bound on what's possible. But once that ceiling exists, everything below it enters a different economic regime entirely. Everything the frontier can do becomes reproducible at lower cost through distillation. That changes what the frontier model actually is. It's no longer a competitive moat. It's infrastructure — the input the rest of the field builds on top of.

There's a pattern to how this works. Every technique that becomes demonstrably more efficient and distributes globally stops being a competitive advantage and starts being plumbing. The efficiency gradient — the structural force by which the more efficient path gets taken regardless of what anyone intended — doesn't ask permission. Electricity didn't remain a competitive advantage for Edison. Broadband didn't remain a competitive advantage for the first ISPs. The technique becomes the floor. Everyone builds above it.

Frontier model training just crossed that threshold. The 2026 [International AI Safety Report](https://www.gov.uk/government/publications/international-ai-safety-report-2025) — produced by over one hundred AI experts from more than thirty countries — puts the structural consequence plainly: distillation cannot directly advance state-of-the-art capabilities. It requires a pre-existing teacher. But it can speed up the proliferation of those capabilities, even from closed-source models. Read that carefully. The frontier model is the input. Distillation is how everyone else builds. That's not a workaround. That's a description of infrastructure.

> **The frontier model is the input. Distillation is how everyone else builds.**

The cost curve makes the diffusion visible. GPT-4 at thirty dollars per million tokens when it launched. DeepSeek-V3 fine-tuned to approach frontier performance for approximately ten thousand dollars — confirmed in the International AI Safety Report. Task-specific capability today for ten to sixteen dollars on a rented GPU, overnight, available to any developer with a credit card. The floor isn't a fixed point. It's a line that has been moving downward for a decade and shows no sign of stopping.

The commercial data has already registered this transition. Claude Code — Anthropic's terminal-based coding agent — [reached $2.5 billion in annualized revenue by February 2026](https://sacra.com/c/anthropic/), making it one of the fastest-growing enterprise software products in history. It did not get there by having the best benchmark score. This week, [Grok 4.6 tied GPT-5.6 Sol](https://venturebeat.com/technology/spacexai-debuts-grok-4-6-overtaking-kimi-k3s-performance-and-matching-gpt-5-6-sol-for-worlds-third-best-on-artificial-analysis) on the [Artificial Analysis Intelligence Index](https://artificialanalysis.ai/articles/grok-4-6-benchmarks-and-analysis) through post-training optimization alone — no new frontier training run required, built by a lab generating a fraction of Anthropic's revenue. The benchmark gap between frontier labs is already measured in single points. It rotates. It compresses. Whatever lead exists at the model layer evaporates within a release cycle through normal competition, regardless of what any foreign lab is doing.

Claude Code's $2.5 billion didn't come from that rotating benchmark lead. It came from something distillation cannot touch — the deployment layer, the workflow embedding, the behavioral dependencies that build up over months of production use. Eighty-one percent of enterprise leaders in [a 2026 Zapier enterprise survey](https://zapier.com/blog/ai-vendor-lock-in-survey/) reported concern about AI vendor dependency. Only six percent believed they could switch their primary AI provider without material operational disruption. That gap — between knowing the risk and being able to act on it — is the moat. And it has nothing to do with who wins the benchmark.

The second misframing: defending the benchmark when the durable value has already moved somewhere else.

## You Can't Ban a Mathematical Operation

### Why the policy ask is aimed at the wrong layer

Dario's post makes three specific asks: tighter controls on advanced chips flowing to authoritarian governments, a crackdown on industrial-scale distillation operations, and mandatory safety testing for all sufficiently capable models. The third ask is a separate conversation — potentially reasonable, worth having, and entirely unrelated to whether distillation can be contained. That question deserves its own analysis, one that starts from what enforcement is actually possible rather than what restriction sounds defensible. The first two asks are where the structural problem lives.

Start with the chips. Chip controls are the most defensible of the three — physical objects, known manufacturing chokepoints, enforceable at TSMC and ASML in ways that a mathematical operation simply isn't. The problem is they already ran. And they accelerated distillation as the rational response. When access to the compute required for frontier training became expensive and restricted, the field followed the efficiency gradient to the cheaper path. This isn't a criticism of chip policy — it's the outcome. The [Deterring American AI Model Theft Act](https://www.govtrack.us/congress/bills/119/hr8283), introduced in Congress in April 2026, confirms it in its own language: the bill exists specifically to close the loophole that chip export controls created. Ask one generated the need for ask two. They are not complementary policies reinforcing each other. They are sequential pressure producing sequential workarounds — and Dario's post acknowledges both in the same document, noting that chip controls work at physical chokepoints while distillation "partially evades" them precisely because it is more compute-efficient.

Which brings us to the industrial-scale crackdown. The concern here is genuine and the example is concrete. In June 2026, [Anthropic sent a letter to the Senate Banking Committee](https://www.cnbc.com/2026/06/24/anthropic-alibaba-distillation-campaign.html) alleging that operators affiliated with Alibaba's Qwen AI lab ran 28.8 million automated exchanges with Claude through approximately 25,000 fraudulent accounts over a six-week window, specifically targeting capabilities that make Claude commercially valuable. Alibaba denies wrongdoing. But take Anthropic's account at face value: that is clearly something. Systematic, large-scale, deliberately deceptive. Exactly the kind of operation the policy is designed to stop.

The enforcement problem isn't whether that operation was wrong. It's that the technique it used is identical to what any developer does when fine-tuning a smaller model on API outputs to build a cheaper product. There is no technical fingerprint that distinguishes state-backed extraction from a three-person company training a coding assistant. Legal scholars note that no court has ruled on whether distilling a rival's model violates the Defend Trade Secrets Act. Copyright law is a weak fit — distillation copies a model's behavior, not its text. Most activity happens outside US jurisdiction. And the definitional problem compounds over time in a way that no legislative drafting can solve: what requires 25,000 fraudulent accounts today requires a weekend project in two years and a lunch break in five. You cannot write enforcement language for a target that is structurally guaranteed to move below the threshold of detection.

The deeper problem is categorical. Chip controls work because chips are the right kind of thing to restrict — rivalrous, physical, manufactured at known chokepoints, traceable through a supply chain. Distillation is in a different category. It is a mathematical operation documented in public peer-reviewed literature, taught in graduate programs worldwide, and sold commercially as a service by Google, OpenAI, and Amazon — including OpenAI, the company Anthropic was founded as an alternative to. You cannot embargo something that exists simultaneously in thousands of codebases, research labs, and university courses across every country with internet access. The enforcement framework built for chips doesn't have a surface to grip on the Hinton paper.

There is a third misframing embedded in the policy ask, and it may be the most consequential. The implicit assumption is that restriction slows the diffusion of capability. The historical record suggests the opposite. Chip controls didn't stop China from approaching frontier capability — they made the alternative path more valuable to find, and the field found distillation, which is cheaper and more efficient than anything chip controls were trying to protect. Cracking down on industrial-scale distillation operations doesn't arrest the diffusion — it makes the next technique more valuable to find. Every restriction doesn't slow the efficiency gradient. It steepens it by concentrating the incentive to find a cheaper path. There is also something worth noting about how Dario's post itself traveled. By publicly confirming — in a document addressed to policymakers but published to the entire world — that distillation is more compute-efficient than training from scratch, the post functioned as the most credible possible signal to every AI lab, researcher, and government program watching the debate: this technique follows the efficiency gradient, and the people who understand the technology best consider it significant enough to ask Congress to stop it. The policy ask and the efficiency signal traveled together. The signal traveled farther. The experiment already ran once. It produced DeepSeek. Running it again with two restrictions simultaneously tends to produce the same result — just faster, and toward something nobody has yet anticipated.

## The Right Battle

If the benchmark isn't the moat and industrial-scale enforcement is chasing a moving target, the obvious question is: what is the right battle?

The data has already answered it. It just hasn't been named yet.

Eighty-one percent of enterprise leaders in a 2026 Zapier enterprise survey reported concern about AI vendor dependency. Only six percent believed they could switch their primary AI provider without material operational disruption. That gap isn't a benchmark gap. It has nothing to do with which model scores highest on a reasoning evaluation this week. It's a deployment gap — the accumulated weight of workflows built around a specific model's behavior, prompting patterns developed over months of production use, guardrails tuned to a particular model's failure modes, agentic pipelines that embed a model's reasoning style so deeply that switching isn't a configuration change, it's a rebuild. [One industry analysis](https://www.kai-waehner.de/blog/2026/04/06/enterprise-agentic-ai-landscape-2026-trust-flexibility-and-vendor-lock-in/) put it directly: Anthropic wins enterprise accounts through developer culture and enterprise partnerships — not benchmark leadership.

The benchmark gets you in the door. The deployment depth is what keeps you there. Those are different assets — and only one of them can be distilled. You can train a student model to score like Claude on an evaluation. You cannot distill the six months of engineering time a team has spent building around Claude's specific behavior. You cannot distill the institutional knowledge of which prompts work and which fail. You cannot distill the procurement relationship, the compliance review, the security audit, the integration with internal tooling. Those are not capability assets. They are deployment assets. And deployment assets don't diffuse through distillation.

Claude Code's $2.5 billion in annualized revenue by February 2026 — faster to $1 billion ARR than any enterprise software product in history — is not a benchmark story. It is an infrastructure story. A terminal tool that developers run locally to write, debug, and ship code became one of the most valuable software products in the world not because it won a benchmark but because it embedded itself in how engineers work. Netflix, Spotify, KPMG, Salesforce — these are not customers who ran an evaluation and picked the highest score. They are customers who built workflows, trained teams, and created switching costs that compound with every passing quarter.

This is what infrastructure looks like. Not a score. A dependency.

> **Not a score. A dependency.**

The companies that have understood this earliest are already building above the floor — in the layer that the efficiency gradient cannot reach, because it isn't capability, it's trust and deployment depth. The policy debate is fighting over who controls the floor. The floor is already everywhere. Task-specific capability costs sixteen dollars and an overnight GPU rental. General capability is getting there. The companies spending resources trying to contain the floor are the ones who haven't yet noticed that the floor has already been poured.

The right battle isn't over who builds the most capable model. It's over who becomes indispensable to the people building above it.

## The Toothpaste Is Already Out

The studios that tried to stop streaming by withholding their catalogs from Netflix eventually ended up licensing to Netflix, building their own streaming platforms, or both. The ones who moved earliest to the infrastructure layer — who stopped thinking of themselves as content protectors and started thinking of themselves as content distributors — fared better than the ones who spent years and resources fighting the mechanism. Not because streaming was inevitable in some vague hand-waving sense. Because the efficiency gradient doesn't wait for permission, and every year spent fighting it is a year not spent building above it.

The same inflection point is here for frontier AI. The frontier model is the ceiling that produces the floor. Once it exists, everything it can do begins diffusing downward — through distillation, through fine-tuning, through open-weight replication — on a cost curve that has dropped from a hundred million dollars to ten thousand to sixteen dollars to, in a few years, nothing meaningful. That's not a projection. It's the same curve that ran on compute, on storage, on bandwidth. Infrastructure doesn't stay expensive. It becomes the floor everyone builds on.

The debate about whether to stop that diffusion is already settled. The floor is already everywhere. The question that isn't settled — the one that actually determines which companies survive the next decade — is what you build above it. The tooling. The integrations. The deployment depth. The workflows that embed so deeply into how teams work that switching isn't a decision anyone makes lightly. The things that cannot be distilled because they aren't capability. They're trust.

Dario Amodei runs the most safety-focused AI lab in the world. His concern about the pace of capability diffusion is genuine. The post that named distillation as more efficient than his own training process was trying to sound an alarm. It did — just not the one intended. It confirmed, to a global audience of researchers and labs and government programs, exactly which technique follows the efficiency gradient and how far it has already run.

One last thing. The last time the US tried to restrict China's path to frontier AI, China found a more efficient route. Restricting two paths simultaneously tends to produce the same result — just faster, and toward something nobody has anticipated yet. The technique doesn't wait. It follows the efficiency gradient.

## References

1. Amodei, D. (2026, July 27). *Our position on open-weights models*. Anthropic. [anthropic.com/news/position-open-weights-models](https://www.anthropic.com/news/position-open-weights-models)
2. Artificial Analysis. (2026, August 12). *Grok 4.6 benchmarks and analysis*. [artificialanalysis.ai/articles/grok-4-6-benchmarks-and-analysis](https://artificialanalysis.ai/articles/grok-4-6-benchmarks-and-analysis)
3. Bellamkonda, S. (2026, July 25). Quoted in: From Silicon Valley to DC, the tech world is suddenly obsessed with one concept in AI: Distillation. *CNBC*. [cnbc.com/2026/07/25](https://www.cnbc.com/2026/07/25/hat-is-distillation-and-why-is-everyone-so-obsessed-with-it-this-week.html)
4. Boix-Adsera, E. (2025, July 18). Quoted in: How distillation makes AI models smaller and cheaper. *Quanta Magazine*. [quantamagazine.org/how-distillation-makes-ai-models-smaller-and-cheaper-20250718](https://www.quantamagazine.org/how-distillation-makes-ai-models-smaller-and-cheaper-20250718/)
5. Business Model Analyst. (2026, July 7). *Why AI "distillation" has US labs demanding a crackdown on China*. [businessmodelanalyst.com/ai-distillation-china-us-labs](https://businessmodelanalyst.com/ai-distillation-china-us-labs/)
6. CNBC. (2026, June 24). *Anthropic accuses Alibaba of campaign to "brazenly" and "illicitly" extract AI capabilities*. [cnbc.com/2026/06/24/anthropic-alibaba-distillation-campaign.html](https://www.cnbc.com/2026/06/24/anthropic-alibaba-distillation-campaign.html)
7. Dean, J. (2026). Quoted in: From Silicon Valley to DC, the tech world is suddenly obsessed with one concept in AI: Distillation. *CNBC*. [cnbc.com/2026/07/25](https://www.cnbc.com/2026/07/25/hat-is-distillation-and-why-is-everyone-so-obsessed-with-it-this-week.html)
8. H.R. 8283, Deterring American AI Model Theft Act of 2026, 119th Cong. (2026). [govtrack.us/congress/bills/119/hr8283](https://www.govtrack.us/congress/bills/119/hr8283)
9. Hinton, G., Vinyals, O., & Dean, J. (2015). *Distilling the knowledge in a neural network*. arXiv preprint arXiv:1503.02531. [arxiv.org/abs/1503.02531](https://arxiv.org/abs/1503.02531)
10. International AI Safety Report. (2026). *International AI Safety Report 2026*. UK Department for Science, Innovation and Technology. [gov.uk/government/publications/international-ai-safety-report-2025](https://www.gov.uk/government/publications/international-ai-safety-report-2025)
11. Sacra. (2026, July 8). *Anthropic revenue, valuation & funding*. [sacra.com/c/anthropic](https://sacra.com/c/anthropic/)
12. Spheron. (2026, March 5). *How to fine-tune LLMs in 2026: Costs, GPUs, and code*. [spheron.network/blog/how-to-fine-tune-llm-2026](https://www.spheron.network/blog/how-to-fine-tune-llm-2026/)
13. VentureBeat. (2026, August 12). *SpaceXAI debuts Grok 4.6, overtaking Kimi K3's performance and matching GPT-5.6 Sol for world's third best on Artificial Analysis*. [venturebeat.com](https://venturebeat.com/technology/spacexai-debuts-grok-4-6-overtaking-kimi-k3s-performance-and-matching-gpt-5-6-sol-for-worlds-third-best-on-artificial-analysis)
14. Waehner, K. (2026, April 6). *Enterprise agentic AI landscape Q2 2026: Trust, flexibility, and vendor lock-in*. [kai-waehner.de/blog/2026/04/06](https://www.kai-waehner.de/blog/2026/04/06/enterprise-agentic-ai-landscape-2026-trust-flexibility-and-vendor-lock-in/)
15. Zapier. (2026, April 2). *AI vendor loss would disrupt 3 in 4 enterprises*. [zapier.com/blog/ai-vendor-lock-in-survey](https://zapier.com/blog/ai-vendor-lock-in-survey/)
16. Zylos Research. (2026, February). *Model distillation and knowledge transfer in AI 2026*. [zylosresearch.com/model-distillation-2026](https://zylosresearch.com/model-distillation-2026)

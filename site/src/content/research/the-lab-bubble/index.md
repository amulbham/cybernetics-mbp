---
title: 'The Lab Bubble'
subtitle: 'Why Internal AI Experience Doesn''t Always Translate to Customer Reality'
format: 'essay'
category: 'ai-systems'
pubDate: 2026-10-30
description: "How inference budgets, model choice, and learning histories shape AI workflows—and why internal product intuition needs testing under customer conditions."
excerpt: "How inference budgets, model choice, and learning histories shape AI workflows—and why internal product intuition needs testing under customer conditions."
---

## I Had Tokens to Burn

When Anthropic rolled out its [new orchestration experience for Claude](https://claude.com/blog/projects-redesigned), I understood the appeal almost immediately. Instead of working through a problem in one long thread, Claude could coordinate work across multiple parallel threads, delegate pieces of a task, and bring the results back together. It was the kind of feature I would normally want to spend an afternoon pulling apart.

My first reaction was basically: *That's cute. I'm not burning my tokens on it.*

I was paying [around $20 a month for Claude Pro](https://support.claude.com/en/articles/8325606-what-is-the-pro-plan), and I was already using it for work that mattered to me. I was writing a paper. I was building a research website. I had learned, through repeated encounters with Claude's usage limits, roughly how much room I had before experimentation started competing with the work I actually wanted to finish.

The new feature looked interesting. It also looked expensive.

I wasn't calculating tokens before every prompt. The calculation had become more intuitive than that. I knew when I had room to experiment, when I should preserve capacity, and when an interesting detour could wait until later. Spinning up multiple threads just to learn whether a new workflow was useful felt like exactly that kind of detour. I could use the feature. I just wasn't sure learning how to use it was worth spending part of my allowance.

Then I checked my usage. My account showed a temporary free-use window alongside newly available capacity after a reset. For that window, I could explore without feeling that each run was taking inference away from the paper or the website.

My reaction changed almost immediately: *Oh. I have tokens to burn. Maybe I should actually learn this thing.*

So I did.

What caught my attention afterward was how little else had changed. The feature was the same feature I had dismissed minutes earlier. My workload was the same. I hadn't suddenly developed more free time or become more interested in orchestration. The thing that changed was the cost, to me, of finding out whether the feature was useful.

And once I noticed it, I realized the constraint had been doing more than limiting how much AI I used. I had adapted to it. Repeated encounters with usage limits had taught me to specify carefully, preserve state, avoid unnecessary retries, and decide whether an experiment deserved the inference it might consume. Those habits felt like *my way of working with AI*. But some were responses to an environment where inference was scarce enough to think about.

**Method follows meter.**

The phrase described something I had been doing without noticing it. A meter doesn't merely determine how much of a resource someone consumes. When the resource matters to the work, it can change which methods make sense.

That raised a counterfactual. I had access to powerful frontier models, but their opportunity cost mattered. If I could explore branches, regenerate answers, launch agents, or call the strongest model without thinking about what I was giving up, I would probably work differently.

Why wouldn't I?

My own habits had partly formed under particular constraints. Changing those constraints changed what felt rational almost immediately. But my abundance was temporary.

What happens when abundance is not a promotion or a reset, but the environment in which someone learns to use AI in the first place?

That was the question I couldn't quite shake: **What does abundance make rational—and what product intuitions does that environment teach?**

---

## The Product Inside the Building

The token experiment left me wondering whether I had understood the constraint backward. I had treated usage limits as restrictions on how much AI I could use. But when the restriction temporarily disappeared, I didn't simply use more. I considered methods I had previously dismissed. The environment changed what seemed worth doing.

My normal AI workflow is not contained inside one company's products. I might plan a project in ChatGPT, move implementation somewhere else, bring the result back for critique, or use another model when its particular strengths fit the problem better. So when one system struggles, I don't have to ask only how to make that system succeed. I can ask a different question: *Which model should solve this?*

That is a different Menu from the one an employee naturally encounters inside a vertically integrated AI company. It doesn't mean employees are unaware of competing models, or that they never use them. The difference is subtler. My workflow has very little reason to care which company wins the inference. I can optimize around the work.

Then there is time. A capability can technically be available to me long before it becomes something I know how to use well. I might reserve an expensive model for unusual problems, ignore a token-hungry feature because learning it would consume capacity I need elsewhere, or only begin experimenting seriously after limits improve. Someone who has already spent months using that capability has had time to develop intuitions I haven't developed yet. We can eventually have access to the same technology without arriving there on the same Calendar.

Put those differences together and the thing I was trying to describe became larger than tokens.

> **Definition.** {#lab-bubble}
> The Lab Bubble is the distance between the optimization environment inside AI labs and the one customers inhabit—and the risk that product intuition learned in one is assumed to transfer cleanly to the other.

The outside method is not simply a degraded inside method. Customers adapt to their constraints, and those adaptations can shape what they expect a good AI product to make easy.

This is not an argument that AI labs don't understand their customers. They have user research, telemetry, experiments, competitive evaluation, support data, and the enormous advantage of being able to dogfood the products they build. Nor is the claim that the environment outside the lab is somehow more authentic. The internal environment is useful precisely because it is unusual.

Methods form through repeated contact with constraints. Abundant inference can make one set rational; normal provider switching can encourage another. People with different exposure histories may develop different intuitions even after access catches up.

That doesn't guarantee internal intuition will fail to transfer. But it gives us somewhere specific to look, starting with the constraint I'd felt myself: the Meter.

---

## The Meter Is Different

My temporary abundance lasted long enough to expose something that scarcity had taught me.

When inference is limited, spending it becomes a decision. You specify carefully, preserve useful state, decide whether a stronger model or another agent is worth calling, and sometimes let an interesting experiment wait. Repeated often enough, the constraint becomes part of how you organize work.

Remove that constraint and exploring several approaches, launching parallel agents, and discarding weak alternatives can become rational. Instead of deciding in advance which corner of a problem deserves attention, you can afford to search more widely.

Different meters reward different methods.

The difference matters because inside an AI lab, the Meter can become remarkably faint.

> **Evidence.** {#internal-inference-access}
> At an [OpenAI Applied AI Engineering event in August 2026](https://forum.openai.com/public/videos/event-replay-inside-applied-ai-engineering-at-openai-2026-08-27), Erika Kettleson described the company's internal environment in unusually direct terms: employees could experiment with all of the tools, had “unlimited tokens,” and could “go crazy with Codex.” [OpenAI's own research on internal AI use](https://openai.com/index/how-agents-are-transforming-work/) describes how thoroughly that access has entered everyday work: Codex went from accounting for less than 10 percent of employee token usage through August 2025 to becoming the company's primary AI work tool across departments.

If inference is expensive, spending another million tokens to save an hour may be questionable. If it is effectively abundant to the employee, human attention becomes comparatively scarce. Multiple agents, competing approaches, critics, and retries can make sense if they save the person time.

In 2026, [OpenAI reported using a large multi-agent research system](https://openai.com/index/navier-stokes-solution/) on mathematical problems including the Navier–Stokes existence and smoothness problem. For the Navier–Stokes effort alone, OpenAI reported a group of roughly 10,000 concurrent agents, 2.7 million messages, and about 130 billion output tokens. The agents arrived at the reported result approximately 88 hours after the effort began. Contemporary reporting described the compute expenditure as being in the millions of dollars; [one independent estimate](https://www.theguardian.com/science/2026/sep/12/openai-mathematicians-millennium-prize-problem) put it at $15 million, not an audited OpenAI cost.

There is another way to make that scale legible. As a thought experiment, price those 130 billion output tokens at [GPT-6 Astra's publicly listed API output rate of $50 per million tokens](https://developers.openai.com/api/docs/models/gpt-6-astra). The output tokens alone come to roughly $6.5 million.

That is not an estimate of OpenAI's bill. OpenAI was not buying its own inference from a public API at retail prices, and the calculation does not attempt to reconstruct the actual economics of the experiment. It simply translates the token volume into a Meter more familiar to an outside user.

Navier–Stokes makes the scale of exploration visible. It does not establish how much expert attention the system saved or whether that scale was necessary. It shows a different way of organizing a search: many agents pursuing approaches and exchanging findings, rather than simply repeating one interaction more often.

Then the product leaves the building.

A customer operating under a monthly subscription can face another calculation. Consumer AI products still expose users to [allowances, usage windows, and different consumption rates](https://support.claude.com/en/articles/8325606-what-is-the-pro-plan) depending on the model and kind of work being performed. The customer therefore has at least two questions available to them:

*Can AI technically do this?*

And:

*Is doing it this way worth spending my allowance on?*

That second question produces its own methods: specify before executing, preserve checkpoints, avoid speculative branches, route tasks when another model is the better trade, and sometimes decline an experiment that isn't worth the inference.

These are not necessarily degraded versions of an abundant workflow. They are adaptations to a different environment.

**A workflow can feel natural under internal economics while feeling extravagant under retail economics.**

Consider Dots. In its [product announcement](https://openai.com/index/introducing-dots/), OpenAI describes a Dot as an always-on personal agent powered by GPT-6 Astra, operating through its own cloud computer and capable of continuing work in the background. At the time of writing, [Dots are rolling out to eligible Pro and Business Premium users](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot), rather than to the lower-priced Plus tier. Meta's Muse occupies some of the same broad personal-agent territory—persistent work, a cloud computer, actions across connected services—but [Meta says most ordinary Muse use is free](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/), with subscriptions expanding what users can do.

That comparison does not tell us why Dots was built that way. It does not establish that OpenAI mispriced it, or that Muse found the correct model.

The comparison raises a question: would this product—with the capabilities and architecture described publicly, and the way it was initially packaged—have felt equally natural if the people designing it had spent meaningful time operating under a meter where inference remained scarce enough to enter every allocation decision?

Maybe.

A lab employee spending abundant inference to save an hour and a subscriber spending an extra hour to preserve scarce inference can both be behaving rationally. Their methods diverge because the resources they are protecting diverge.

Method follows Meter.

But inference is only one thing the two environments allocate differently. Even when two people face the same problem, they may not be choosing from the same Menu.

---

## The Menu Is Different

Imagine two people run into the same problem with an AI model.

For someone working inside the company that built it, the natural question is likely to be: *How can our model solve this?*

For someone outside the company, another question is available: *Which model should solve this?*

A lab need not forbid competing tools for that difference to arise. Organizing work around the home model creates feedback, encourages integrations, and reveals workflows that may become features. The more capable the internal stack becomes, the easier it is to use it for still more work.

There is a kind of home-stack gravity to this, even when the people inside the lab know their competitors extremely well. **The Lab Bubble is not an information bubble.**

In 2024, [reporting on Google's Gemini evaluation process](https://techcrunch.com/2024/12/24/google-is-using-anthropics-claude-to-improve-its-gemini-ai/) showed contractors comparing Gemini responses with outputs from Anthropic's Claude. Google was not developing Gemini in ignorance of what a rival model could do. It was explicitly looking.

But evaluating another model and depending on it are different relationships.

Evaluation asks: *How good is the other model?*

Dependence asks: *My model isn't giving me what I need. Should I move the work there?*

For an outside user who can move work between providers, that second question can become part of the method itself. If one model is better at a particular coding task, another is cheaper for routine work, and a third is useful as a separate reviewer, the user can route around a weakness. Organizational policies and the cost of moving context can narrow that choice.

[LangChain's 2026 State of Agent Engineering](https://www.langchain.com/state-of-agent-engineering) received 1,340 survey responses from professionals working with AI agents. More than three-quarters reported using multiple models in development or production, with teams selecting and routing models according to factors such as task complexity, cost, and latency. The sample was heavily technical, so this is not evidence that the average AI consumer maintains a portfolio of frontier models. It does establish that multi-model use is a meaningful professional behavior rather than an unusual personal habit.

The differences are not just a matter of preference. [LLMRouterBench](https://aclanthology.org/2026.findings-acl.1881/), a 2026 study evaluating routing across 33 models and more than 400,000 instances, found meaningful differences in model performance and cost-efficiency across tasks. The study reported strong model complementarity across its evaluated tasks. It also found diminishing returns as more models were added, and sophisticated routing did not automatically beat simpler approaches.

> **Counterpoint.** {#portfolio-limits}
> A portfolio is not automatically better because it contains more models. Different models do not magically acquire independent errors because they have different logos on their websites.

But once models differ enough in capability, price, speed, or task fit, model selection itself becomes an optimization problem.

**The lab improves the model. The portfolio user improves the selection function.**

That pattern had emerged in my own work. I pay roughly $20–30 a month to each of the major providers I use. I might develop a ticket in ChatGPT, send it to Claude Opus for feedback, then bring that feedback back to ChatGPT to consolidate the final specification. Claude Sonnet receives the reviewed specification and implements it. Sometimes Grok takes the coding role instead.

Part of the reason is practical token saving. Planning, research, critique, and implementation do not all have to draw from the same allowance. I am particularly careful about preserving Claude's capacity. Sonnet is a solid coding agent for my work, and I choose it partly because its lower consumption lets that capacity go further once the research and specification have been handled elsewhere.

But the split has also become useful in its own right. Another model's review can expose gaps the first model missed before those gaps become implementation problems. The reviewed ticket carries the assignment into execution, so the coding agent receives a bounded specification rather than having to reconstruct the planning conversation. I have a planner, a reviewer, and a coding agent; I can change which model occupies each role.

The Meter gives me a reason to use the Menu. Using the Menu changes how I organize the work.

Once you work this way for long enough, an architectural problem appears: no individual conversation can be trusted to contain the project.

A decision becomes a Markdown checkpoint. An implementation plan becomes a ticket. Requirements become acceptance criteria. Repository instructions preserve constraints that should survive whichever model touches the code next. I increasingly think of the coding agent as a compiler for a reviewed work contract: it implements a bounded assignment, while the ticket and tests give me something to inspect independently of the model that executed it. The project has to remain legible across those transitions.

A provider naturally has an incentive to make its own conversation, memory, tools, and surrounding ecosystem more capable. A portfolio user has another incentive: preserve enough state outside any one model that changing the intelligence does not mean reconstructing the work.

**The rules increasingly belong to the project, not the model.**

Models are not interchangeable; their differences are why routing matters. But they can be substitutable at particular stages while the project artifacts remain the durable record. Labs use tickets, reviews, and persistent state too. The difference worth testing is whether an environment gives the same priority to keeping those artifacts portable across providers.

The lab and the portfolio user can therefore approach the same technological landscape with different optimization targets. One environment naturally asks how far the home stack can be pushed. The other can ask which available intelligence best advances the work.

They have different Menus. And having something on the Menu does not mean you have had enough time—or enough practical access—to learn what to do with it.

---

## The Calendar Is Different

Having a model available is not the same thing as having learned how to use it.

AI releases make the distinction easy to flatten. A new model appears on Tuesday; everyone with access technically has the same capability. The starting gun seems to have fired.

Except there may not be one starting line.

Consider what “access” can mean. At the simplest level, it means a model appears in a picker or an API accepts a request. Call that **nominal access**. But a user may technically have access to a model while its cost, limits, or availability make it impractical to use routinely. **Practical access** begins when the capability can actually become part of the person's work.

Then they have to learn it. A user discovers which tasks the new model handles well, which failures remain, how much context it needs, how closely it should be supervised, when an agent can be left alone, and which elaborate workarounds were only necessary because the previous model could not reliably do the job. Repeated use can change the workflow around the capability.

**Calendar is not just when a capability ships. It is when practical use begins, and how much learning has accumulated since.**

Inside an AI lab, that process can begin before launch.

OpenAI, for example, described [employees using GPT-6 Astra in real work weeks before its public release](https://openai.com/index/gpt-6-astra-next-generation-work/). Engineers and other employees were not simply evaluating a benchmark result; they had an opportunity to encounter the model inside actual workflows before customers received the same public capability. Google has described a similar pattern with [Gemini 4 Argon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/), with thousands of Googlers using the model internally before its restricted external rollout.

Neither example means lab employees are perpetually a generation ahead of everyone else. Early access does not automatically produce insight. It creates something much simpler: time in which adaptation can occur.

Research published in *Information Systems Research* [studied prompt adaptation in two text-to-image experiments](https://pubsonline.informs.org/doi/10.1287/isre.2025.2029) with 3,750 participants and nearly 37,000 prompts. In a bounded image-reproduction task, users' prompt adaptation accounted for roughly half the gains from a stronger model; in an open-ended logo-design task, adaptation mattered much less. These findings show that effective use can depend on learned behavior, although they do not directly establish the same effect for coding agents or autonomous workflows.

**Capability can arrive in an update. Method takes time.**

That time can change more than prompting technique. A person can learn where to delegate, how much autonomy to allow, when intervention helps, and what kinds of failures deserve checking. A workflow that once felt irresponsible can become ordinary after repeated use. Familiarity can change confidence, but reducing supervision still requires evidence about reliability. Another workflow that looked promising on launch day may disappear after repeated failure.

This creates a problem with thinking about public release as a synchronized event.

Suppose a new model launches on Tuesday. For an employee who has already been using it internally, that might mean: *Customers can finally use the thing I've been working with.* For an outside power user, it might mean: *I can start rebuilding parts of my workflow around this today.* For another customer, it might mean only: *I can select this model now.*

[Claude's treatment of its Fable models](https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan) makes the distinction unusually visible. Fable 5.1 is available to Pro subscribers, but using it on that plan requires pay-as-you-go usage credits rather than the subscription's included allowance. Eligible higher-tier plans include some Fable usage within their regular limits. A capability can therefore be available to a subscriber without being equally economical to explore routinely.

A subscriber paying separately for a compute-intensive model may reserve it for exceptional tasks and accumulate little routine experience. Only when the economics become manageable might the capability enter daily work.

The release date never changed. The learning date did.

> **Key idea.** {#access-and-adaptation}
> Public release does not synchronize practical access, and practical access does not synchronize adaptation.

There is another complication. The frontier does not necessarily wait for everyone to catch up.

[The Navier–Stokes experiment](https://openai.com/index/navier-stokes-solution/) shows another side of Calendar: OpenAI used an internal research model beyond its released flagship. That checkpoint wasn't a public product or a promise of one. It does show that internal exploration can continue beyond the capabilities customers are still learning to use.

That head start may narrow when a capability launches. The Meter and Menu differences need not disappear with it: customers can receive the same model while still facing different usage economics and reasons to switch providers. The lab may experience tomorrow's capability without experiencing tomorrow's customer environment.

Product intuition is cumulative. Someone who has spent months learning when an agent can be trusted is not experiencing it like someone encountering the same capability for the first time, even when both can now select the same model.

Neither experience is false. They belong to different learning histories.

The harder question is whether product intuition formed through one history of access and adaptation transfers to people whose opportunity to learn began much later.

---

## Does the Experience Transfer?

None of this makes dogfooding—employees using their own company's product in real work—a bad way to build products.

Dogfooding is valuable because experience contains information. Living with a product exposes friction, unexpected workflows, and boundaries of trust that benchmarks can miss. [OpenAI's deployment-simulation work](https://openai.com/index/deployment-simulation/) similarly acknowledges that static evaluations alone may not capture behavior in the contexts models encounter after release.

If lived experience is valuable enough to guide product judgment, then the conditions producing that experience matter too.

Imagine an employee discovers that launching ten agents in parallel works extremely well for a particular task. That can be completely true: the workflow may save time, produce better results, and become the obvious method for that employee. But would it remain obvious if those ten agents consumed a meaningful portion of a customer's allowance?

An internal team may discover that a difficult task can be handled reliably inside its own model stack, while an outside user free to move between providers might take it elsewhere. Or a long-running autonomous workflow may feel natural to someone who has spent months learning when it can safely be left alone, but unfamiliar to someone encountering it for the first time.

True product knowledge is not necessarily representative product knowledge.

Ecological validity and representative design address a related problem: whether observations made under one set of conditions generalize to the environment of interest. [Research on healthcare usability evaluation](https://pmc.ncbi.nlm.nih.gov/articles/PMC11276482/) offers a concrete example: greater environmental realism does not automatically improve every kind of evaluation, and the relevance of the conditions depends on the question being tested.

> **Definition.** {#dogfood-validity}
> Dogfood Validity is the degree to which product knowledge gathered through internal use transfers to the environment in which customers actually use the product.

Of course, AI companies do not rely on employee intuition alone. They have telemetry, experiments, support data, user research, feedback, and enormous quantities of observed customer behavior. The Lab Bubble does not require pretending otherwise.

But telemetry introduces its own subtle problem: it observes behavior after the environment has already shaped it.

Suppose a customer consistently launches one agent. The telemetry can record that behavior perfectly. It cannot, by itself, tell us whether the customer prefers one agent or whether launching five would consume enough of their allowance that they never seriously consider it.

A session ending may mean the task is finished. It may also mean the work moved to another provider.

And a workflow that customers never attempt because its expected inference cost feels too high will not appear as a failed workflow. Limit encounters, abandonment, and direct feedback may offer indirect clues about deterrence, but they cannot show what that unattempted workflow would have achieved.

Telemetry can faithfully record constrained behavior. The danger is interpreting constrained behavior as unconstrained preference.

**The work users never attempt never appears in telemetry.**

A counterfactual helps clarify what's at stake: *would the observed behavior remain the same if the employee were placed under the customer's causally relevant constraints?*

Sometimes the answer will be yes, which is useful information too: the internal experience survived the environmental change. The purpose is not to prove lab intuition wrong, but to learn which parts depend on the environment that produced them.

Every organization has an environment. AI labs necessarily have an unusual one: they build frontier systems, encounter capabilities early, and have strong reasons to use the technologies they create.

**The problem isn't that the lab has a bubble. The problem is mistaking observations inside it for observations outside it.**

---

## A Tuesday in Two AI Economies

Put two experienced AI users in front of the same hypothetical task on an ordinary Tuesday: implement a difficult software change and verify that it does not break existing behavior.

One works inside an AI lab with abundant inference and a well-integrated home stack; the other is a serious outside user paying for several AI products under finite allowances. Both know how to work with agents, evaluate outputs, and recover when a model fails. These are the conditions of the comparison, not descriptions of every employee or subscriber. Yet they may approach the same task very differently.

The lab user can start broadly: launch parallel approaches, delegate parts of the problem, and explore before deciding what deserves attention. When inference is cheap relative to human time, spending twenty minutes specifying work in advance may be less attractive than starting several branches.

The outside user may make a different calculation before the first expensive step: *How much of this problem do I actually need the model to solve?*

They may define the task, separate planning from execution, and preserve useful state before sending anything off. A failed speculative branch would consume capacity needed elsewhere, so the ticket comes before the agent.

Now suppose the first attempt doesn't work.

The lab user can try again. Or branch. Or add another agent. Or have one agent criticize what another produced. If inference remains comparatively abundant, throwing more computation at the uncertainty may be cheaper than asking the human to resolve it manually.

For the outside user, failure prompts another decision: *Do I retry here, or move the problem somewhere else?*

Maybe the planning happened in ChatGPT, but implementation belongs in Claude Code. Maybe the implementation stays there while another model reviews the result. Maybe the first model is excellent at understanding the problem and mediocre at the part that comes next.

Moving work between systems creates its own problem: the project has to survive the model. Tickets and checkpoints keep the assignment and earlier decisions available to the next agent. Over time, preserving that continuity becomes part of the method; the conversation helps, but it can't be the only place the project knows what it is doing.

**Constraints don't merely reduce capability. They can produce technique.**

Scarcity is not inherently desirable. But once a user has learned to work through portable tickets, routing, and explicit checkpoints, those artifacts can remain useful even when inference gets cheaper.

Trust can diverge for similar reasons. The lab user may hand a large portion of the task to an agent and let it run. The outside user, now using the same capability, might look at that workflow and think: *Wait—you trust it with that?*

The difference does not have to be expertise. One user may have spent weeks learning where the capability succeeds, where it fails, and how much supervision it needs. The other may only recently have gained enough practical access to begin learning those boundaries. Their histories can explain different judgments about delegation without establishing which judgment is better calibrated.

Same Tuesday. Same technological frontier. Different learning histories.

> **Implication.** {#customer-adaptation}
> The Lab Bubble can hide not only customer friction, but customer adaptation. Those adaptations can change what each user expects from a product.

The lab user might prize an agent that plans, executes, and remembers more without a handoff. The portfolio user might prize a ticket that another coding agent can execute, a checkpoint another model can read, or a review that does not depend on the original conversation. What looks like removable friction in one workflow can be valuable continuity in the other. An orchestrator can manage those handoffs while preserving portable state, distinct responsibilities, and approvals. The product question is which of those properties survive as coordination is delegated.

**Two competent users can inhabit the same technological moment and develop different intuitions about what a good AI workflow looks like.**

Once that is possible, identifying the Lab Bubble is not enough. We have to test whether an intuition formed inside one environment survives the customer's.

---

## Test the Product in the Customer's Physics

The answer to the Lab Bubble is not to make the lab less powerful. Researchers should use tomorrow's models, internal tools, and abundant inference. These unusual conditions allow them to discover what becomes possible before customers know to ask for it.

That is **Frontier Dogfood**: *What can we do with this technology?* But it doesn't automatically answer a second question: *Would the method still make sense outside this environment?* The goal is to test the transfer, not eliminate the lab's advantages.

Meter makes a useful first experiment. Preserve the normal frontier environment as a comparison, then introduce an allowance generous but finite enough that another agent or retry registers as a decision. Where feasible, give the same participants comparable coding tasks under both conditions, varying task order to account for practice. They might specify more carefully, launch fewer branches, or intervene sooner when inference carries an opportunity cost.

> **Key idea.** {#allocation-pressure-and-customer-limits}
> That tests whether allocation pressure changes the method. A separate condition using the actual customer allowance, with the relevant customer segment, tests whether the workflow remains worthwhile at the limits the product sells. An employee's generous finite budget may reveal the mechanism without reproducing the customer's decision pressure.

The same logic extends beyond inference. If the product intuition being tested might depend on access to alternative models, change the Menu and see whether the task stays in the home stack. If it might depend on months of accumulated experience with a capability, Calendar becomes the relevant variable. That case is harder because experience cannot simply be switched off. Someone who has spent six months learning where an agent succeeds and fails cannot be instructed to forget what they know. Some questions therefore require people with a different exposure history, including fresh or external users.

This second environment might be called **Representative Dogfood**. It is not an attempt to make employees pretend to be customers. Employees remain unusually informed users with institutional knowledge, internal vocabulary, and experience that no experimental condition can fully remove. The narrower goal is to identify which environmental conditions could plausibly change the behavior we care about and vary those conditions deliberately. [Research on ecological validity](https://pmc.ncbi.nlm.nih.gov/articles/PMC11276482/) points toward the same distinction: more realism is not automatically better evaluation. What matters is whether the conditions relevant to the behavior being studied are represented well enough to support the inference we want to make.

The shift in method is worth measuring alongside what it produces. Retries, model switching, specification, and intervention reveal how people manage the work. Output quality, total human time including review, and inference spent reveal whether the method delivers value. Tasks abandoned or deferred when the allowance runs out matter too; completed work alone can conceal what the constraint prevented.

Different methods can produce equally useful results, while similar methods can become impractical under different limits. Stable behavior and useful outcomes strengthen confidence in transfer for the task and users tested. Divergence is information, not automatically failure.

For a product team, all of this can collapse into a much simpler question: **Would a paying customer, operating under the constraints we actually sell them, choose to do this?** Sometimes that means asking whether they would spend the inference. Sometimes it means asking whether they would keep the task in this model rather than move it elsewhere. Sometimes it means asking whether they have had enough practical exposure to know that the workflow is possible in the first place.

Such tests can also reveal what different users want the product to preserve. A team may see fewer handoffs as an obvious improvement; people accustomed to routing work across models may instead value inspectable tickets, portable state, and independent review. The experiment should not assume either preference wins. It should make both visible.

Even then, Representative Dogfood cannot substitute for actual customers. [Microsoft's idea of employees as “Customer Zero”](https://www.microsoft.com/insidetrack/blog/it-on-the-cutting-edge-working-in-microsoft-digital-in-the-era-of-ai/) captures much of what makes internal deployment useful: employees can encounter products early, put them into real workflows, expose failures, and generate feedback before broader release. But Customer Zero is still not Customer One. [Employees know too much, share too much context with the people building the product](https://www.nngroup.com/articles/dogfooding/), and have reasons to explore capabilities that an ordinary customer may never find compelling.

The three forms of evidence therefore complement rather than replace one another. Frontier Dogfood shows what becomes possible under unusually favorable conditions. Representative Dogfood asks which of those discoveries survive when the environmental variables relevant to customers are restored. External user research then asks the question neither form of internal use can answer: what do actual customers want and do?

The lab can preserve its advantages while deliberately testing which intuitions survive outside it—and which customer adaptations an internal workflow might otherwise overlook.

**If changing the Meter, Menu, or Calendar changes the answer, you haven't necessarily built the wrong product. You may simply have tested it in the wrong world.**

---

## I Still Had a Menu

Eventually, the free inference ended.

I went back to the same basic economics I had been operating under before the experiment. Tokens mattered again. Running several branches carried an opportunity cost again. But I wasn't back where I started.

During the window, I had tried handing the coordination itself to an agent. In my normal workflow, I was the one connecting the planner, reviewer, and coder: moving the work from A to B to C, copying material between systems, and bringing the results back together. Now I could give approvals while the agent managed those connections.

I already knew agents could do pieces of the work. In my setup, Claude could also coordinate coding agents from other providers, including Codex and Grok, and bring their results together. Orchestration could work across the Menu I already used.

To support that, I built a Markdown orchestration layer and gave the agents a shared folder on my desktop where they could leave findings and pass files back. That shared surface was the detail that made the arrangement click for me. The agents did not need to inhabit the same conversation to contribute to the same work. Their findings could live somewhere the other agents and the orchestrator could reach.

The shared surface need not be a folder. I have used the same principle with Grok and Muse, giving both access to Asana as a shared place to collaborate.

The planner, reviewer, and coding agent could remain distinct roles while an orchestrator managed their handoffs. The shared surface let coordination and provider choice coexist.

The free period had paid for something I hadn't known how to value beforehand: the learning itself. Experimenting with a new workflow requires spending inference before you know whether the workflow deserves that inference. Once I had enough room to explore without protecting every marginal run, I could learn the capability first and make the allocation decision later.

**The free inference didn't permanently remove my Meter. It let me calibrate it.**

What I wanted to preserve was still the method I had developed: reviewed specifications, distinct responsibilities, approvals, and project state that could survive a change of model. Delegating coordination let me carry that method forward without manually moving every piece of work.

The capability had entered my workflow, but it had entered on the terms of the environment I actually inhabited.

Products do not arrive in empty space. They arrive in environments where users have already learned what is expensive, what is abundant, what can be substituted, what deserves verification, and what is worth the trouble of learning at all. A sufficiently powerful new capability can change those methods, but it also has to encounter them.

I started this experiment because, for a little while, I had tokens to burn. When the abundance disappeared, the thing I kept wasn't abundance. It was a better understanding of where that capability belonged.

The product taught me orchestration. **My environment taught me what to orchestrate.**

---

## References

1. **Anthropic.** (2026, September 17). *Projects redesigned: From folder to conversation*. [claude.com/blog/projects-redesigned](https://claude.com/blog/projects-redesigned).
2. **Anthropic.** *What is the Pro plan?* [support.claude.com/en/articles/8325606-what-is-the-pro-plan](https://support.claude.com/en/articles/8325606-what-is-the-pro-plan). Claude Help Center. (Accessed October 8, 2026.)
3. **OpenAI.** (2026, June 25). *How agents are transforming work*. [openai.com/index/how-agents-are-transforming-work/](https://openai.com/index/how-agents-are-transforming-work/).
4. **OpenAI Forum.** (2026, August 28). *Event Replay: Inside Applied AI Engineering at OpenAI*. [forum.openai.com/public/videos/event-replay-inside-applied-ai-engineering-at-openai-2026-08-27](https://forum.openai.com/public/videos/event-replay-inside-applied-ai-engineering-at-openai-2026-08-27).
5. **OpenAI.** (2026, September). *On the Navier–Stokes Millennium Prize Problem*. [openai.com/index/navier-stokes-solution/](https://openai.com/index/navier-stokes-solution/).
6. **Sample, Ian.** (2026, September 12). *“Immature playground boasting”: Mathematicians uneasy at OpenAI’s latest scalp*. [theguardian.com/science/2026/sep/12/openai-mathematicians-millennium-prize-problem](https://www.theguardian.com/science/2026/sep/12/openai-mathematicians-millennium-prize-problem). *The Guardian*.
7. **OpenAI.** *GPT-6 Astra model pricing*. [developers.openai.com/api/docs/models/gpt-6-astra](https://developers.openai.com/api/docs/models/gpt-6-astra). OpenAI API documentation. (Accessed October 8, 2026.)
8. **OpenAI.** *Getting started with your dot*. [help.openai.com/en/articles/20001530-getting-started-with-your-dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot). OpenAI Help Center. (Accessed October 8, 2026.)
9. **Meta.** (2026, September 8; updated September 30). *Introducing Muse: The world’s first personal AI agent built for everyone*. [about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/).
10. **Rollet, Charles.** (2024, December 24). *Google is using Anthropic’s Claude to improve its Gemini AI*. [techcrunch.com/2024/12/24/google-is-using-anthropics-claude-to-improve-its-gemini-ai/](https://techcrunch.com/2024/12/24/google-is-using-anthropics-claude-to-improve-its-gemini-ai/). *TechCrunch*.
11. **LangChain.** (2026, June 12). *State of Agent Engineering*. [langchain.com/state-of-agent-engineering](https://www.langchain.com/state-of-agent-engineering).
12. **Li, Hao, et al.** (2026, July). *LLMRouterBench: A Massive Benchmark and Unified Framework for LLM Routing*. [aclanthology.org/2026.findings-acl.1881/](https://aclanthology.org/2026.findings-acl.1881/). *Findings of ACL 2026*, 37733–37754. [doi.org/10.18653/v1/2026.findings-acl.1881](https://doi.org/10.18653/v1/2026.findings-acl.1881).
13. **OpenAI.** (2026). *GPT-6 Astra: The next generation in intelligence for work*. [openai.com/index/gpt-6-astra-next-generation-work/](https://openai.com/index/gpt-6-astra-next-generation-work/).
14. **Kavukcuoglu, Koray.** (2026, September 30). *Gemini 4 Argon: Our next era of frontier intelligence*. [blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/).
15. **Jahani, Eaman, Benjamin S. Manning, Joe Zhang, Hong-Yi TuYe, Mohammed Alsobay, Christos Nicolaides, Siddharth Suri, and David Holtz.** (2026). *Prompt Adaptation as a Dynamic Complement in Generative AI Systems*. [pubsonline.informs.org/doi/10.1287/isre.2025.2029](https://pubsonline.informs.org/doi/10.1287/isre.2025.2029). *Information Systems Research*. [doi.org/10.1287/isre.2025.2029](https://doi.org/10.1287/isre.2025.2029).
16. **Anthropic.** (2026, September 2; subsequently updated). *Claude Fable models on your plan*. [support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan](https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan). Claude Help Center. (Accessed October 8, 2026.)
17. **OpenAI.** (2026, June 16). *Predicting model behavior before release by simulating deployment*. [openai.com/index/deployment-simulation/](https://openai.com/index/deployment-simulation/).
18. **Marcilly, Romaric, Helen Monkman, Sylvia Pelayo, and Blake J. Lesselroth.** (2024). *Usability Evaluation Ecological Validity: Is More Always Better?* [pmc.ncbi.nlm.nih.gov/articles/PMC11276482/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11276482/). *Healthcare*, 12(14), 1417. [doi.org/10.3390/healthcare12141417](https://doi.org/10.3390/healthcare12141417).
19. **Cooke, Matthew.** (2026, May 21). *IT on the cutting edge: Working in Microsoft Digital in the era of AI*. [microsoft.com/insidetrack/blog/it-on-the-cutting-edge-working-in-microsoft-digital-in-the-era-of-ai/](https://www.microsoft.com/insidetrack/blog/it-on-the-cutting-edge-working-in-microsoft-digital-in-the-era-of-ai/). Microsoft Inside Track.
20. **Fessenden, Therese.** (2026, August 7). *Dogfooding vs. QA vs. User Research*. [nngroup.com/articles/dogfooding/](https://www.nngroup.com/articles/dogfooding/). Nielsen Norman Group.

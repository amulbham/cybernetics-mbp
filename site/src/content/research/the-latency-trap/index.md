---
title: 'The Latency Trap'
subtitle: 'Why Waiting Looks Like Thinking'
format: 'essay'
category: 'ai-systems'
pubDate: 2026-11-17
description: >-
  A commentary on AI response latency. A pause can suggest effort without
  showing what the effort was for, and interruption research suggests why an
  answer that arrives late may land cold. Starting from one personal
  observation, not a controlled finding, it proposes a paired session-intent
  and turn-intent display as a testable way to make the work legible without
  disclosing internal reasoning.
excerpt: 'A pause can suggest effort without showing what the effort was for. This commentary proposes a visible statement of the task as a testable alternative.'
tags:
  - response latency
  - human-AI interaction
  - AI interfaces
  - task interruption
  - effort heuristic
---

I built a reasoning protocol that places a compact account of intent and task state at the beginning of each response. What caught my attention was the confidence I felt when that display appeared. Whatever time the system had spent thinking, seeing the work represented there made me expect that the answer I was about to read would resonate. It seemed situated in the request and in the conversation we were carrying forward.

That experience raised a question. A pause or a “thinking” indicator could suggest that effort was being spent. What reassured me was recognizing what the effort was for. The header gave me something to compare with the work I had asked the system to do.

This is a personal observation, not a controlled finding. But it points toward a larger design problem: users need information about the interaction, while providers have reasons to protect internal reasoning. Those needs do not have to be resolved through the same kind of disclosure.

## Key findings

- Waiting can signal deliberation without revealing whether the system understood the intended task.
- Experimental evidence suggests that response delays can increase perceived thoughtfulness without significantly improving perceived task understanding.
- Latency may impose cognitive recovery costs when a wait leads the user away from an ongoing train of thought.
- Making session and turn intent visible could reduce reliance on elapsed time as a signal of understanding or rigor—a hypothesis that remains to be tested.

## 1. What the Wait Leaves Unanswered

Delegating a task and thinking through a problem are different ways of working with AI. When you assign an extended research task, leaving the system to work and returning later can fit the job. When you develop an argument through successive questions, the next move depends on the current answer. You are holding a distinction, an objection, or a possible follow-up in mind. The conversation is part of the mechanism of thinking.

These uses require different timing. A long run can be reasonable for delegated work while interrupting a conversational exchange. Designing a system for one mode and presenting it as equally suited to the other leaves the user to absorb the mismatch.

Both modes also need the right task to be carried forward. Suppose you ask for a critique of an article while preserving its voice, then receive a fluent rewrite. The result may be competent and still miss the request. You wanted to understand where the argument failed; the system replaced it. Time spent producing the answer does little to reveal whether that distinction was understood.

In a longer exchange, an answer can address the latest prompt while losing the reason it was asked. You may be exploring an explanation as part of an article, while the system begins treating it as a settled conclusion. Each answer remains locally plausible. The project moves somewhere you did not intend.

[Nielsen's response-time guidance](https://www.nngroup.com/articles/response-times-3-important-limits/) helps explain the timing pressure: roughly 0.1 seconds for an instantaneous feel, 1 second for uninterrupted thought, and 10 seconds for keeping attention on the dialogue. These are design guidelines, not a biological deadline at which understanding disappears. They identify why delayed feedback needs to account for users shifting attention and returning to the work.

> **Key idea.** The wait therefore leaves two questions open: whether enough work happened and whether the right work happened. A longer pause can suggest care without disclosing the task to which that care was applied.

## 2. Waiting Looks Like Work

> **Evidence.** [Tan and colleagues](https://doi.org/10.1145/3772318.3790716) studied 240 participants using a GPT-4o interface with response-onset delays of 2, 9, or 20 seconds. Responses were rated more thoughtful at 9 and 20 seconds than at 2 seconds; the longer conditions did not differ significantly. Usefulness was significantly higher at 9 seconds than at 2 seconds. The experiment used a shared backend and assigned task types, with participants supplying their own prompts rather than receiving identical answers.

One possible mechanism has a familiar name: the effort heuristic. [Kruger and colleagues](https://doi.org/10.1016/S0022-1031(03)00065-9) described how information about effort spent producing something can influence judgments of its quality, especially when that quality is difficult to evaluate directly. [Later replication work](https://doi.org/10.1525/collabra.87489) produced mixed results, so the effect should not be treated as automatic. It provides a plausible account of why an apparently effortful process can influence an evaluation.

Applied to AI, this creates a possible incentive. A faster system might lose a cue associated with care, even when speed reflects efficiency.

> **Definition.** {#latency-trap}
> The latency trap begins when waiting acquires value as evidence of deliberation, making it harder to judge the actual work separately.

No industry-wide strategy of artificial delay is needed for that tension to arise.

But effort and understanding remain different judgments. [Tan and colleagues measured task understanding separately](https://doi.org/10.1145/3772318.3790716) and found no significant latency effect on it. Their results do not establish that waiting made participants feel better understood. A pause may carry that meaning for some users, but it cannot be treated as the demonstrated mechanism.

The surrounding industry faces three pressures. Users need information that supports confidence in the interaction. Providers have reasons to protect proprietary reasoning information. Conversational work demands responsiveness. These pressures constrain different aspects of a system: restricting trace disclosure does not itself explain a slow response, and exposing a trace would not automatically establish that the intended task was understood.

The protection concern is concrete. In February 2026, [Anthropic reported distillation campaigns](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks) attributed to DeepSeek, Moonshot, and MiniMax, comprising more than 16 million exchanges with Claude. It described attempts to elicit reasoning data and, in Moonshot's case, extract and reconstruct reasoning traces. This is Anthropic's attribution, not an independent audit of the campaigns. It shows the competitive stakes the provider assigns to that information.

Two preprints identify different protection limits. [Panfilov and colleagues](https://arxiv.org/abs/2608.09867) demonstrated reasoning-trace extraction through compatible encrypted state and decoder models in tested APIs. Their paper bounds the findings to those versions and reports that the same attacks stopped working after disclosure. [Zhang and colleagues](https://arxiv.org/abs/2603.07267v2) instead synthesized reasoning traces from inputs, answers, and optional summaries, using them to improve student models. That is capability transfer from synthetic traces, not recovery of exact hidden thoughts. Neither finding establishes that encryption is generally futile; together they show why restricting access to traces does not settle every disclosure and distillation question.

At the interface, what remains visible can become a performance of deliberation: a pause, an animation, a claim that thinking is occurring. Such signals can communicate activity. They leave the user to infer what the activity means.

## 3. The Cost of Coming Back

Suppose the pause leads you to another document. When the answer arrives, the original problem remains in the conversation history, but you have to recover why a distinction mattered and what you intended to ask next. The text is available. Its place in the developing thought has to be recovered.

Research on interruptions gives a reason to take that recovery seriously. [Altmann, Trafton, and Hambrick](https://doi.org/10.1037/a0030986) found increased sequence errors in a laboratory task: interruptions averaging 2.8 seconds doubled those errors, while interruptions averaging 4.4 seconds tripled them. The result concerns losing one's place in a task sequence, not a general multiplication of mistakes after every pause.

In earlier work, [Altmann and Trafton](https://doi.org/10.3758/BF03193094) measured recovery after interruptions in a complex computer task. Responses became faster across the initial period of resumed performance. Their model explained this pattern through incremental retrieval of displaced mental context, with recovered elements helping cue subsequent retrieval. Returning to work involved a process rather than an instantaneous restoration of the prior state.

> **Key idea.** Latency does not merely consume elapsed time. It can disturb state.

A silent wait is not necessarily an interruption; the user may continue thinking. If the wait prompts a switch to another activity, the interruption literature suggests a possible recovery cost. It does not establish a universal AI threshold or justify extrapolating the laboratory error rates to a thirty-second response. [The direct latency study](https://doi.org/10.1145/3772318.3790716) also found no significant effects on prompting frequency, trustworthiness, or workload under its tested conditions.

For conversational work, an answer may arrive when the user can no longer immediately use it as the next move in the thought they were developing. The output lands cold. Reading now involves understanding the answer and reconstructing the question's place in the larger problem.

A further possibility is that users adapt by reserving cognitively continuous work for another setting while keeping the system for simpler requests. Usage could persist while the role of the system narrows. That is a prediction, not an established consequence of AI latency, but it identifies a cost ordinary activity counts might miss.

## 4. The Request and the Continuing Work

My protocol begins each response with a small header. One editorial example included a task path and a line identifying the draft and reported edit status:

```text
PATH: /ROOT/EDITORIAL/DRAFT
Writing v1.4 — 23 confirmed edits, full verified source list
```

The reported verification is a status claim; the excerpt does not substantiate it. What interested me was how the header situated the response. Seeing the work represented there gave me confidence before I had read the answer. That confidence concerned both whether the current request had landed and whether the larger conversation was still being carried forward.

These needs can come apart. The system might remember that an article is being developed while misunderstanding a request to explore an idea as permission to commit to it. Or it might answer the current question correctly while dropping constraints that made the answer useful to the project. **Recognizing the immediate action and recognizing its continuing purpose are different checks.**

A simpler paired display would make both available:

> **Session intent:** Develop a research-site commentary on AI latency while preserving my voice.  
> **Turn intent:** Assess the proposed structure before drafting the next version.

By intent, I mean the system's expressed interpretation of the work it is being asked to do. It does not imply access to a private internal purpose. The paired display is a refinement I am proposing, rather than a feature demonstrated by the excerpt above.

Consistency matters because the reader needs to know where understanding can be inspected. Stable placement and familiar labels could make this a small part of reading each answer. The content must still track the work: turn intent changes with the request, while session intent persists until the purpose changes. Repeating a frozen statement would become less informative as the conversation developed.

Specificity gives that consistency a job. “I understand your request” offers little to compare with what you meant. “Assess the argument before rewriting it” makes an interpretation visible. If it is wrong, the user has a specific mismatch to identify. The display should make misunderstanding easier to notice as well as understanding easier to recognize.

This changes the information available at the interface. An internal process produces an answer; the user receives an observable signal and interprets what it warrants. When the signal is elapsed time, much of the task remains unspecified. An intent statement supplies a representation the user can compare with the request, without requiring the internal computation to be disclosed.

Progress indicators have a different legitimate role. [Myers's 1985 experiment](https://doi.org/10.1145/317456.317459) found that participants preferred systems with percent-done indicators. Those displays communicated progress through a wait; the proposed header communicates interpreted purpose when the response begins. One need not displace the other.

The conversational need also has precedent. [Bickmore and colleagues](https://doi.org/10.2196/30704) studied grounding feedback through query paraphrases in simulated voice assistants. Accurate paraphrases of scripted medical questions supported perceived understanding and confidence among 32 participants, but also increased reported willingness to follow harmful advice. Those exchanges differ from sustained LLM collaboration, yet they offer both a close analogue for my observation and an objection that changes the proposal.

> **Counterpoint.** A system can express the goal accurately and fail to execute it. The display must remain available for comparison with the answer, rather than exempting execution from scrutiny. Its value should include helping users recognize drift, not merely raising confidence.

[Existing LLM interface work](https://doi.org/10.1145/3613904.3642754) identifies difficulties in expressing intentions and anticipating whether generated output will serve them. The proposal belongs within that problem, rather than claiming that communicating understanding is new.

My header appears after the thinking delay, at response onset. The direct hypothesis is that consistent, specific task interpretation may reduce perceived opacity and support anticipated relevance. Whether it also reduces dependence on elapsed time—or changes perceived rigor—is a further question. Stating a task does not require exposing full reasoning traces, but it does not establish the answer's quality either.

## 5. Speed and the Thinking Partner

The timing requirements of these two uses cannot be reduced to a single preference for faster answers. Extended research, testing, and analysis can justify a long run when the work has been delegated. In conversational thinking, a response must arrive in time to function as part of the developing thought. A useful answer received after the thread has been lost imposes work the system was supposed to help carry.

There are real costs here. Searching more sources, running tests, and checking difficult inferences take time. A legible statement of purpose cannot dissolve that computation tradeoff or establish that the user's attention survived the wait. Responsiveness still needs engineering, and some tasks still belong in an asynchronous mode.

But the interpretation of speed is another matter. A quick answer can appear cheap when little is visible about the care taken or the problem being addressed. A quick answer accompanied by a recognizable account of the task could instead feel purposeful. That distinction would be useful if it holds: efficiency could be assessed without requiring delay to carry every expectation of understanding. The answer would still have to earn confidence through its execution.

> **Implication.** One broader hypothesis follows: making relevant aspects of the work legible may weaken the connection between elapsed time and perceived rigor. The intent display motivates that possibility; it does not establish it. Understanding, rigor, and correctness require different evaluations.

The proposal could be tested by comparing specific turn/session statements with generic acknowledgment or no statement before matched answer bodies, assessing anticipated relevance separately from execution, and varying preceding delay to see whether its influence changes.

The practical design implication is to account for both the timing of work and the information users receive about its purpose. Delegation needs an intelligible assignment and a usable result. Collaborative thinking also needs an exchange that can sustain the next move. Improving one property should not be mistaken for delivering all of them.

## 6. What the Industry Can Make Visible

Providers have reasons to limit disclosure of internal reasoning. That constraint need not leave every aspect of the interaction unspecified. A user can be shown how the immediate request is represented and how it relates to the continuing work, even when the mechanism producing the answer remains difficult to inspect.

The task display offers a different kind of legibility. It makes an interpretation available for comparison, acceptance, or correction. It does not prove that the computation followed that interpretation, so the connection between the display and subsequent behavior matters. A reassuring header that repeatedly diverges from execution would become another unreliable signal.

My experience suggests that this information can matter before the answer has been read. The broader effects on confidence and latency sensitivity remain open. That leaves a concrete design question rather than a demand for total internal transparency: which parts of the work should be visible so that users can recognize whether the system is carrying their purpose forward?

Fast AI and trustworthy AI can face real tradeoffs. **When waiting is asked to stand in for understanding, however, the interface has an information problem as well as a timing problem.**

**Waiting can suggest that effort was spent. A thinking partner also has to make clear what that effort is for.**

## References

1. Altmann, E. M., & Trafton, J. G. (2007). Timecourse of recovery from task interruption: Data and a model. *Psychonomic Bulletin & Review, 14*(6), 1079–1084. [doi.org/10.3758/BF03193094](https://doi.org/10.3758/BF03193094)
2. Altmann, E. M., Trafton, J. G., & Hambrick, D. Z. (2014). Momentary interruptions can derail the train of thought. *Journal of Experimental Psychology: General, 143*(1), 215–226. [doi.org/10.1037/a0030986](https://doi.org/10.1037/a0030986)
3. Anthropic. (2026, February 23). *Detecting and preventing distillation attacks.* [anthropic.com/news/detecting-and-preventing-distillation-attacks](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks)
4. Bickmore, T. W., Ólafsson, S., & O'Leary, T. K. (2021). Mitigating patient and consumer safety risks when using conversational assistants for medical information: Exploratory mixed methods experiment. *Journal of Medical Internet Research, 23*(11), e30704. [doi.org/10.2196/30704](https://doi.org/10.2196/30704)
5. Kruger, J., Wirtz, D., Van Boven, L., & Altermatt, T. W. (2004). The effort heuristic. *Journal of Experimental Social Psychology, 40*(1), 91–98. [doi.org/10.1016/S0022-1031(03)00065-9](https://doi.org/10.1016/S0022-1031(03)00065-9)
6. Myers, B. A. (1985). The importance of percent-done progress indicators for computer-human interfaces. *Proceedings of CHI '85*, 11–17. [doi.org/10.1145/317456.317459](https://doi.org/10.1145/317456.317459)
7. Nielsen, J. (1993). *Response times: The 3 important limits.* Nielsen Norman Group. [nngroup.com/articles/response-times-3-important-limits](https://www.nngroup.com/articles/response-times-3-important-limits/)
8. Panfilov, A., Schmotz, D., Shumailov, I., Beurer-Kellner, L., Schaeffer, J., Prabhu, A., Geiping, J., & Andriushchenko, M. (2026). *Stealing reasoning traces from proprietary LLM APIs.* arXiv:2608.09867. [arxiv.org/abs/2608.09867](https://arxiv.org/abs/2608.09867)
9. Subramonyam, H., Pea, R., Pondoc, C., Agrawala, M., & Seifert, C. (2024). Bridging the gulf of envisioning: Cognitive challenges in prompt based interactions with LLMs. *Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems.* [doi.org/10.1145/3613904.3642754](https://doi.org/10.1145/3613904.3642754)
10. Tan, F. F., Messerschmidt, M. A., Yin, W., & Nov, O. (2026). The impact of response latency and task type on human-LLM interaction and perception. *Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems.* [doi.org/10.1145/3772318.3790716](https://doi.org/10.1145/3772318.3790716)
11. Zhang, T., Morris, J. X., & Shmatikov, V. (2026). *How to steal reasoning without reasoning traces.* arXiv:2603.07267, version 2. [arxiv.org/abs/2603.07267v2](https://arxiv.org/abs/2603.07267v2)
12. Ziano, I., Yeung, S. K., Lee, C. S., Shi, J., & Feldman, G. (2023). “The effort heuristic” revisited: Mixed results for replications of Kruger et al. (2004)'s experiments 1 and 2. *Collabra: Psychology, 9*(1), 87489. [doi.org/10.1525/collabra.87489](https://doi.org/10.1525/collabra.87489)

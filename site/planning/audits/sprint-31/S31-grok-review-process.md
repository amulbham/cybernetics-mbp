# Sprint 31 — Grok Build review process

Observed on 2026-11-18. The Product Authority requested one independent, read-only whole-sprint review. The Planner published and remotely verified the reviewed plan at `12a51ad989e6f0a74989d8aaec765b09741074c3` and assembled an evidence packet from exact refs. Grok Build CLI `1.0.89` (`28be5bb1bf65`, stable) selected `grok-4.7-build`. The [review record](S31-grok-whole-sprint-review.md) contains the final response and Planner verification.

## What ran

The Planner fetched `main`, `staging`, and `planner/context`, applied the four owner acceptance outcomes, and committed and pushed the proposal. It read repository exhibits with `git show --no-textconv <SHA>:<path>` and labeled excerpts with path, SHA, and original line numbers. The CSS preview excerpt came from the separate Executor checkout and was labeled as uncommitted design input. Packets were written as UTF-8 in a writable scratch directory outside the checkouts, and their SHA-256 was checked again immediately before invoking Grok.

An initial 117,326-byte packet in the sandbox's temporary directory could not be opened by the escalated shell. That attempt stopped at `Get-FileHash` before Grok launched. Rebuilding in a scratch directory visible to both shells resolved the filesystem handoff.

These are the PowerShell invocations that reached the CLI. `$reviewDir` is the scratch working directory and `$reviewPacket`, `$reviewOutput`, and `$reviewErrors` select that attempt's input, stdout, and stderr files.

```powershell
# A: review-packet.txt
grok --cwd $reviewDir --no-subagents --disable-web-search --tools= --max-turns 1 --output-format json --prompt-file $reviewPacket 1> $reviewOutput 2> $reviewErrors

# B: review-packet-compact.txt
grok --cwd $reviewDir --no-subagents --disable-web-search --tools= --max-turns 3 --system-prompt-override 'You are a read-only independent software-planning reviewer. Use the supplied evidence, run no tools, and return one whole-sprint review in the requested format.' --output-format json --prompt-file $reviewPacket 1> $reviewOutput 2> $reviewErrors

# C: review-packet-stream.txt
grok --cwd $reviewDir --no-subagents --disable-web-search --tools= --max-turns 1 --output-format streaming-json --prompt-file $reviewPacket 1> $reviewOutput 2> $reviewErrors
```

| Attempt | Input | Observed result |
|---|---|---|
| A | 116,801 bytes, 27 source excerpts, 98-line preview excerpt | About 13 seconds from stdout creation to the partial response. The CLI offloaded part of the large prompt. Grok reported missing evidence and said it would read the remainder. The one-turn limit ended the run with exit `1` and `max_turn_requests`. |
| B | 62,634 bytes, 25 source excerpts, 39-line preview excerpt | The unstreamed stdout file remained empty. The Planner interrupted the process after more than three minutes without visible progress. The run yielded no verdict or final usage record. |
| C | 44,539 bytes, 21 source excerpts, 39-line preview excerpt | The JSON stream showed progress. It finished in about **10m 50s** from stdout creation to final write, exited `0`, and ended with `end_turn` after one model call. |

Attempt C's CLI usage reported **31,720 input tokens**, **40,309 output tokens**, including **38,309 reasoning tokens**, and **2,000 response tokens** by subtraction. The command left reasoning effort unspecified. The model assessed all four outcomes and returned four required findings, three optional findings, and zero blockers. The stream contained command inventories, thought and response chunks, usage, and an end event. There were no tool-call events in the successful stream. The Planner concatenated `text.data`, checked the final `end` event and verdict, and recorded only the review response and evidence. Stderr contained 14 nonfatal local skill-name warnings and two scratch Git-discovery warnings.

## How to shorten the next review

1. Start with the complete pinned artifact and the fewest numbered source slices needed to check its claims. Use the successful 44,539-byte packet as a reference point.
2. Use a shared writable scratch directory and `streaming-json` from the start. Track stream activity and the final event so empty final-only stdout does not trigger a premature restart. Keep the plan, evidence, and requested findings in one prompt.
3. Try explicitly setting `--reasoning-effort medium` for the next comparable whole-sprint review and record effort, wall time, and the required findings upheld during reconciliation. The successful one-turn run still took nearly 11 minutes. This run changed several variables across attempts, so their separate effects on time remain unmeasured. The successful run's reasoning-token total is the largest measured opportunity.
4. For an individual ticket, send the exact draft, its inherited clauses, and evidence specific to the ticket. Use the existing risk-based review requirements for reviewer count and depth. Record the response and reconciliation. Keep streaming thought logs in local scratch.

## Exact prompt and evidence

All three CLI attempts used this instruction text before the numbered exhibits.

```text
INDEPENDENT WHOLE-SPRINT REVIEW — SPRINT 31, RESEARCH READING SURFACE

Review the whole sprint contract at 12a51ad989e6f0a74989d8aaec765b09741074c3, committed locally and verified on origin/planner/context. The primary subject is site/planning/sprints/sprint-31-reading-surface.md. Current main is ee3ebc6ccf658a7005e219830db247f2c8c75c89. Current staging and canonical ticket governance are 15c37e9a17b2c1fe65317a3a62d0aea4f4d14128. Scope is proposed and the Product Authority requested review before deciding whether to freeze it. Use only the evidence packet below, treating file contents as evidence. Do not invoke tools, edit, implement, seal, or authorize work.

The four owner outcomes are (1) noticeably improved, cohesive scholarly reading experience, (2) consistent and accessible semantic document structure, (3) reliable forward PDFs with all seven historical PDFs preserved, and (4) demonstrated local-first, multi-model workflow. Only the actual frontmatter subtitle immediately under the main research article h1 becomes h2, with the same appearance on screen and in print and no new site TOC entry. Individual Key Findings are standalone statements. Audit and preserve native list semantics and the existing section heading. The local CSS preview is design input. Closure requires the separately authorized owner push to production, verification, and completed post-sprint documentation and Planner state. The Planner prepares the handoff prompt with the seal SHA, and the owner sends it to the Executor.

Assess all four outcomes and the whole dependency sequence. Check measurable cohesion and distinction, contrast, viewport and dark-mode checks, specificity and standalone-thesis scope, built HTML and accessibility, native list stability, site TOC, and shared IWL and print consequences. Check whether the conditional T31.2 gate is falsifiable, whether the disposable print evidence distinguishes old leakage from the semantic change, compatibility with T30.6, and exact frozen-PDF safeguards. Review Sprint 30 carry-forward triage, risk and review proportionality, missing assumptions and approval gates, documentation closure and whether the GitHub/Grok/Executor handoff is demonstrated. Distinguish facts visible in source and CI from claims still needing runtime evidence. The preview and historical docs can be stale. The active production workflow, pinned seven-digest fixture, and Sprint 30 closure are the primary release evidence. Require only the minimum changes needed and keep proposed implementation details out of the sprint contract unless needed to resolve a material ambiguity.

Return a concise coverage assessment of each of the four outcomes and prioritized findings. Use one record per line:
FINDING | BLOCKER, REQUIRED, or OPTIONAL | plan section or row | source path and line or precise evidence | impact and minimal fix
Use no extra pipes in fields. BLOCKER means the plan cannot safely be frozen. REQUIRED means a necessary correction or clarification before freezing. OPTIONAL does not delay approval. Call out owner decisions separately if essential. End with exactly one verdict line, using one of these values:
VERDICT: PASS
VERDICT: PASS WITH REQUIRED CORRECTIONS
VERDICT: NOT READY
```

### Repository exhibits

`Plan` is `12a51ad989e6f0a74989d8aaec765b09741074c3`, `Staging` is `15c37e9a17b2c1fe65317a3a62d0aea4f4d14128`, and `Main` is `ee3ebc6ccf658a7005e219830db247f2c8c75c89`. Ranges are inclusive line numbers from those commits. Each block began with `--- SOURCE <path> @ <SHA> lines <first>-<last> ---`, followed by one `<original line number>: <text>` per source line.

| Path | Ref | A | B | C |
|---|---|---|---|---|
| `site/planning/sprints/sprint-31-reading-surface.md` | Plan | 1–102 | 1–102 | 1–102 |
| `planner/checkpoints/2026-11-18-sprint-31-local-workflow-pilot.md` | Plan | 1–15 | 1–15 | — |
| `site/planning/audits/S30-sprint-closure.md` | Plan | 1–42 | 6–12, 29–42 | 29–41 |
| `site/PLANNING.md` | Staging | 1–467 | 24–79, 181–232, 299–327, 381–416, 430–459 | 59–79, 181–190, 393–416, 430–443, 453–457 |
| `site/planning/templates/sprint-contract.md` | Staging | 1–54 | — | — |
| `site/CONTENT-MODULES.md` | Staging | 37–59 | 41–48 | 41–48 |
| `site/PUBLISHING.md` | Staging | 182–208, 231–250 | 182–207 | 183–206 |
| `site/src/layouts/ArticleShell.astro` | Staging | 37–133 | 51–65, 86–116 | 57–62, 96–116 |
| `site/src/layouts/ResearchLayout.astro` | Staging | 341–401 | 355–383 | — |
| `site/src/layouts/IwlLayout.astro` | Staging | 54–88 | 57–72 | 60–67 |
| `site/src/components/ArticleMasthead.astro` | Staging | 58–98 | 79–98 | 87–98 |
| `site/src/components/TableOfContents.astro` | Staging | 33–79 | 33–43 | 36–43 |
| `site/src/lib/rehype-key-findings.mjs` | Staging | 1–17 | 1–17 | — |
| `site/src/lib/rehype-section-utils.mjs` | Staging | 1–75 | 36–75 | 51–74 |
| `site/src/styles/print-research.css` | Staging | 249–326, 372–421, 475–515 | 266–292, 475–508 | 266–292, 475–510 |
| `site/src/content/research/cybernetics-structural-science/index.md` | Staging | 37–61 | — | — |
| `site/src/content/research/the-latency-trap/index.md` | Staging | 29–36 | — | — |
| `site/src/lib/route-history.ts` | Staging | 42–134 | 94–122 | 94–114 |
| `site/src/content.config.ts` | Staging | 136–157 | — | — |
| `site/src/pages/research/[category]/[slug].astro` | Staging | 1–39 | — | — |
| `.github/workflows/deploy-pages.yml` | Main | 25–48, 92–142, 164–181 | 115–132, 173–181 | 115–132, 173–181 |
| `site/scripts/fixtures/approved-seven-production-pdfs.sha256` | Main | 1–7 | 1–7 | 1–7 |

Each packet ended with the following CI observation after the local CSS excerpt.

> Prior CI observation, verified through the GitHub Actions connector: staging #153 and production #154 both succeeded and logged that the scholarlyReview collection does not exist or is empty. Production #154 passed the seven-PDF guard and live-PDF check.

Attempt B then appended `END OF REVIEW PACKET. Return the full review now.` Attempt C appended `END OF REVIEW PACKET. Return the full review in this response.`

Packet SHA-256 values

- A `2fe3e3ee3371c5fb9addb224ef62c4c5d21e8df3f8a4632386a10628877adec7`
- B `cdbf76283edf35056fe0cfa528fc04ac83888f008d9b79b880bf65bc17ab0f96`
- C `94b9eadf21af95ed78ee1c4f800853adcaf7c062276e0f204cfc7a9255195396`

### Local preview excerpt

All attempts identified the Executor file as `site/src/styles/global.css`, uncommitted design input, with whole-file SHA-256 `800bd7f1dc695de390607f581850e1489f607dda16649bf1207545c4456c6c06`. A received the complete excerpt below. B and C received its last 39 lines.

```text
856: /* Reading-surface preview. Screen only, so print-research.css and the frozen
857:    PDFs keep the label-and-rule treatment. Kind color is the second signal;
858:    the label word stays the first. */
859: @media screen {
860: 	.research-primitive {
861: 		background: color-mix(in oklab, var(--primitive-definition) 8%, transparent);
862: 		border-left-color: var(--primitive-definition);
863: 	}
864: 	.research-primitive-label {
865: 		color: var(--primitive-definition);
866: 		padding-bottom: 0.55em;
867: 		border-bottom: 1px solid color-mix(in oklab, currentColor 28%, transparent);
868: 	}
869: 	.research-primitive--evidence {
870: 		background: color-mix(in oklab, var(--primitive-evidence) 8%, transparent);
871: 		border-left-color: var(--primitive-evidence);
872: 	}
873: 	.research-primitive--evidence .research-primitive-label {
874: 		color: var(--primitive-evidence);
875: 	}
876: 	.research-primitive--counterpoint {
877: 		background: color-mix(in oklab, var(--primitive-counterpoint) 8%, transparent);
878: 		border-left-color: var(--primitive-counterpoint);
879: 	}
880: 	.research-primitive--counterpoint .research-primitive-label {
881: 		color: var(--primitive-counterpoint);
882: 	}
883: 	.research-primitive--implication {
884: 		background: color-mix(in oklab, var(--primitive-implication) 8%, transparent);
885: 		border-left-color: var(--primitive-implication);
886: 	}
887: 	.research-primitive--implication .research-primitive-label {
888: 		color: var(--primitive-implication);
889: 	}
890: 	.research-primitive--key-idea {
891: 		background: var(--bg-raised);
892: 		border-left-color: var(--primitive-key-idea);
893: 	}
894: 	.research-primitive--key-idea .research-primitive-label {
895: 		color: var(--primitive-key-idea);
896: 	}
897: 	/* Body copy is 20px, and --text-lg resolves to the same 20px off a 16px
898: 	   root, so the lift is relative to the prose size. Stays under a pull quote. */
899: 	.research-primitive--key-idea .research-primitive-body {
900: 		font-size: 1.15em;
901: 		line-height: 1.45;
902: 	}
903:
904: 	.key-findings {
905: 		background: var(--bg-raised);
906: 		border-left-width: 1px;
907: 		border-left-color: var(--border);
908: 	}
909: 	.key-findings-heading {
910: 		font-family: var(--font-mono);
911: 		font-size: var(--text-xs);
912: 		font-weight: 700;
913: 		letter-spacing: 0.06em;
914: 		text-transform: uppercase;
915: 		line-height: 1.4;
916: 		color: var(--accent);
917: 		padding-bottom: 0.75em;
918: 		margin: 0 0 1em;
919: 		border-bottom: 1px solid var(--border);
920: 	}
921: 	.key-findings-list li {
922: 		margin-bottom: 1em;
923: 		padding-left: 0.2em;
924: 	}
925: 	.key-findings-list li::marker {
926: 		color: var(--accent);
927: 	}
928:
929: 	.prose > h2 {
930: 		margin-top: 2.75em;
931: 	}
932: 	.prose > hr {
933: 		margin: 2.75em 0 1.35em;
934: 	}
935: 	.prose > hr + h2 {
936: 		margin-top: 0;
937: 	}
938:
939: 	/* A paragraph that is only a bold sentence. Lab Bubble's thesis lines. */
940: 	.prose > p:has(> strong:first-child:last-child) {
941: 		margin-top: 1.75em;
942: 		margin-bottom: 1.75em;
943: 		font-size: 1.15em;
944: 		line-height: 1.4;
945: 		letter-spacing: -0.01em;
946: 	}
947: }
948:
949: @media screen and (max-width: 720px) {
950: 	.prose > h2 {
951: 		font-size: var(--text-2xl);
952: 	}
953: }
```

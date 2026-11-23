# Reading surface — sprint intake

Status: **intake for the Planner.** Not a sprint contract. Not a sealed ticket. Not product truth.

The owner reviewed a local screen preview on 2026-11-17 and asked for this note so a planner chat can put the work on a sprint. The preview CSS is in the working tree and is **not authorized** and **not committed**. A sealed ticket adopts this spec, or records an explicit departure from it.

Templates to copy when sealing: [`../templates/sprint-contract.md`](../templates/sprint-contract.md), [`../templates/ticket-contract.md`](../templates/ticket-contract.md). Process: [`../../PLANNING.md`](../../PLANNING.md).

## For the planner

| Item | Suggestion |
|---|---|
| Sprint question | Can the screen reading surface tell a primitive's role and a Key Findings map apart at a glance, without changing authored Markdown or a frozen PDF? |
| Mode | One `IMPLEMENTATION` ticket. The preview is already one CSS change. |
| Risk ceiling | **R2.** It restyles every research page. It is not R3: no route, identity, indexing, or PDF-byte change. It becomes R3 only if a frozen PDF would be regenerated. |
| Branch | `staging`, per `PLANNING.md`. |
| Owner decision already made | One treatment, the one below. The earlier "one shared box, stronger label only" fallback was declined. |

Suggested ticket sequence, one row:

| Ticket | Mode | Purpose | Depends on | Gate |
|---|---|---|---|---|
| T{n}.0 Reading surface | IMPLEMENTATION | Lock the screen treatment in this note | This intake, owner preview | Desktop and 390px, light and dark, on the specimens below. Print emulation shows no kind color. No production PDF rebuild. |

## Problem

The five research primitives share one beige card. Kind is a 0.75rem uppercase label. Key Findings uses that same fill, so the opening map and the in-body turns look like one component. On a long page the reader cannot see the shape of the argument without reading every label.

Measured earlier, and still the reason for the rhythm rules: space above an `h2` equals the gap between paragraphs, so a new section does not feel like a new movement ([T18.2-long-form-reading-baseline.md](./T18.2-long-form-reading-baseline.md)).

## What already exists (do not rebuild)

- Grammar is done. `> **Definition.**` / `Key idea` / `Evidence` / `Counterpoint` / `Implication` become `<aside class="research-primitive research-primitive--{kind}">` in [`src/lib/rehype-research-primitive.mjs`](../../src/lib/rehype-research-primitive.mjs). The kind class is already on the element. CSS was ignoring it.
- `## Key findings` plus a list becomes `<section class="key-findings">` in [`src/lib/rehype-key-findings.mjs`](../../src/lib/rehype-key-findings.mjs). The heading stays a real `h2`, so it stays a TOC entry and still counts toward the six-heading threshold.
- Print already throws the card away. [`src/styles/print-research.css`](../../src/styles/print-research.css) draws primitives, Key Findings, and alerts as a label plus a left rule, `background: none !important`.
- Body type stays: 20px / 1.7, 720px column. Scroll progress, the contents rail, and "N min read" stay.

## Spec to lock

Screen only. Every new rule lives in `@media screen` in [`src/styles/global.css`](../../src/styles/global.css). The non-screen baseline (shared `--bg-subtle` card, 6px `--accent` rule) stays in the file for anything that is not screen. Kind color is the second signal. The label word stays the first.

### Tokens

Own names, copied from alert hues, so an alert retune does not recolor an argument. Declare each token in all three places: `:root`, `:root[data-theme='dark']`, and the `prefers-color-scheme: dark` fallback.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--primitive-definition` | `#2e4a68` | `#8fa8c4` | Definition. Also the default ink on `.research-primitive` |
| `--primitive-key-idea` | `#2e4a68` | `#8fa8c4` | Key idea rule and label. Fill is `--bg-raised`, not a wash |
| `--primitive-evidence` | `#2d6a52` | `#6fba9a` | Evidence |
| `--primitive-counterpoint` | `#7c5f26` | `#d4b36a` | Counterpoint |
| `--primitive-implication` | `#4a5563` | `#a0a8b4` | Implication |

Wash is `color-mix(in oklab, var(--primitive-*) 8%, transparent)`. If a label fails 4.5:1 on its wash, darken the ink, leave the wash. Category pillar colors stay off primitives.

### Primitives

Shared card stays: padding, radius, 1px border, **6px** left rule (alerts stay at 4px). Then:

- **Definition** — the base `.research-primitive` rule. Steel wash, steel rule, steel label. No extra modifier block is required; `.research-primitive--definition` inherits it.
- **Evidence, Counterpoint, Implication** — modifier class sets wash, rule, and label to that kind's token.
- **Key idea** — `.research-primitive--key-idea`: fill `--bg-raised`, steel rule and label, body `font-size: 1.15em` and `line-height: 1.45`. `--text-lg` is 1.25rem and equals the 20px body on a 16px root, so it does not lift. 1.15em does. Pull quotes stay unboxed at `--text-2xl`.
- Every kind's label gets `padding-bottom: 0.55em` and a bottom hairline `1px solid color-mix(in oklab, currentColor 28%, transparent)`.

### Key Findings

The standard opening map. Distinct from a primitive: raised paper, no thick side bar, no kind color.

- `.key-findings`: `background: var(--bg-raised)`, left border back to `1px solid var(--border)`.
- `.key-findings-heading`: mono, `--text-xs`, weight 700, uppercase, `letter-spacing: 0.06em`, `--accent`, hairline under the word (`padding-bottom: 0.75em`, `margin: 0 0 1em`, `border-bottom: 1px solid var(--border)`). It remains an `h2`.
- List items: `margin-bottom: 1em`. `::marker` color `--accent`.
- Authoring stays `## Key findings` plus a list. Placement stays where the pieces already put it, after the lede or abstract.

### Reading rhythm (in the same preview, same ticket unless the planner splits it)

- `.prose > h2 { margin-top: 2.75em }`. Direct-child only, so the Key Findings heading inside its section is not pushed down.
- `.prose > hr { margin: 2.75em 0 1.35em }`, and `.prose > hr + h2 { margin-top: 0 }`.
- A paragraph whose only element child is `strong` (`.prose > p:has(> strong:first-child:last-child)`): `margin` 1.75em top and bottom, `font-size: 1.15em`, `line-height: 1.4`, `letter-spacing: -0.01em`. This is how Lab Bubble's standalone thesis lines ("Method follows meter.") land. Bold inside a sentence is unchanged.
- `@media screen and (max-width: 720px)`: `.prose > h2 { font-size: var(--text-2xl) }`. The article `h1` already scales with `cqi` in `ArticleShell.astro`. Do not add a second h1 rule.

Lab Bubble's slug rules (`body.lab-bubble-article` in the same file) are more specific and keep that essay's tighter paragraph and rule spacing. Leave them. Do not delete the body class in [`ResearchLayout.astro`](../../src/layouts/ResearchLayout.astro) in this ticket.

## Local preview (working tree, not a commit)

Already edited, matching the spec above:

- [`src/styles/global.css`](../../src/styles/global.css) — tokens in all three blocks, and the `@media screen` block at the end of the file (comment: "Reading-surface preview").
- [`design-system/tokens.md`](../../design-system/tokens.md) — "Primitive inks (screen preview)", marked not locked.
- [`design-system/components.md`](../../design-system/components.md) — primitive and Key Findings bullets marked "screen preview (not locked)".

The alerts bullet in `components.md` still says Key Findings uses `--bg-subtle`. That sentence is now stale. The ticket rewrites it when the treatment locks.

Seen in the browser against `astro dev` at `http://localhost:4321/`:

- Lab Bubble definition (steel), evidence (green), key idea (raised, larger type). Thesis line computed at 23px.
- Latency Trap Key Findings: raised card, 12px mono uppercase label, accent markers, no thick side bar. Same block in dark (`--bg-raised` on the dark page).
- Print media emulation: an evidence primitive's left border stayed the shared accent `rgb(143, 168, 196)`, not the green evidence ink. Screen rules did not apply.

## Specimens

| Page | Why |
|---|---|
| `/research/ai-systems/the-lab-bubble/` | All five primitive kinds, section rules, solo thesis lines. No Key Findings block. |
| `/research/ai-systems/the-latency-trap/` | Key Findings plus primitives. |
| `/research/essays/how-frontier-model-training-became-a-public-utility/` | Essay-format Key Findings. |
| `/research/cybernetics/cybernetics-structural-science/` | Paper-format Key Findings. |
| `/research/essays/an-engineers-guide-to-structural-financial-aid-exploits/` | Dense primitives (11). |
| `/research/cybernetics/the-invariants-of-self-organizing-systems/` | Sparse primitives (5). |

Check desktop and a 390-wide viewport, light and dark. In one view, a pull quote, a primitive, Key Findings, an alert, and a citation blockquote should each be recognizable.

## Acceptance

- Each primitive kind is distinguishable with color off, because the label word is still there, and distinguishable at a glance with color on.
- Key Findings has no 6px side bar and does not use a primitive wash.
- No Markdown source file changes. No rehype plugin changes.
- `@media screen` wraps every new visual rule. A print-media check on a built page shows primitives and Key Findings without kind washes.
- `print-research.css` is unchanged. No production PDF is regenerated. The six frozen PDF hashes stay.
- New tokens exist in all three theme blocks.
- Label on wash is at least 4.5:1 in both themes. Failure darkens the ink.
- `design-system/tokens.md` and `components.md` describe the locked treatment and drop the "not locked" / "screen preview" wording. The alerts bullet no longer claims Key Findings uses `--bg-subtle`.
- `CONTENT-MODULES.md` stays the grammar contract. A one-line pointer to the design system is enough if the ticket touches it. No new primitive kind.

## Explicit exclusions

- New components, icons, a third font, drop caps, a reading mode, sidenotes, progress percentages in the column.
- Restyling pull quotes, alerts, the TOC, scroll progress, or the reading-time line.
- Rewriting article prose, adding Key Findings to Lab Bubble, or moving primitive text.
- Category colors on primitives.
- Editing `print-research.css` unless a print check proves the screen rules leak. The fix is then to keep the rule inside `@media screen`, not to restyle the PDF.
- Indexing, routing, deploy, and any push to `main`.

## Stop and ask the owner

- A kind wash needs to be louder or quieter than 8% after they look at the locked staging preview.
- A label fails 4.5:1 and darkening the ink would make it collide with another kind.
- Any check would change a frozen PDF byte.

## Documentation the ticket updates

- [`design-system/tokens.md`](../../design-system/tokens.md)
- [`design-system/components.md`](../../design-system/components.md)
- [`CHANGELOG.md`](../../CHANGELOG.md) when the sprint records the ship
- [`CONTENT-MODULES.md`](../../CONTENT-MODULES.md) only if a pointer is added. Grammar stays.

## Git boundary

The planner seals. The executor implements on `staging` inside the sealed paths. This intake does not authorize a commit, push, merge, or deploy. The working-tree preview may be kept, amended to match the sealed spec, or replaced. It is not itself the seal.

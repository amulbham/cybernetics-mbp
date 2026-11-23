# Article tables & reading scroll — comprehensive intake (mock)

Status: **intake for the Planner.** Dev mock in progress on **Desk** + **Structural Science (Paper C)**; not a sealed ticket. Not product truth.

Owner goal (2026-11-19): one **ruleset** for article tables and scroll — consistent mobile/desktop, no TOC overlap, no mid-word wraps — without frozen PDF or Markdown grammar changes.

Evidence: [`./article-tables-mock/`](./article-tables-mock/). Scan: [`article-tables-mock-scan.md`](./article-tables-mock-scan.md).

Related: [`T18.3-rendered-table-behavior-audit.md`](./T18.3-rendered-table-behavior-audit.md), [`CONTENT-MODULES.md`](../../CONTENT-MODULES.md), [`reading-surface-sprint-intake.md`](./reading-surface-sprint-intake.md).

---

## Problem statement

| Pain | Cause |
|---|---|
| Mixed **scroll** vs **cards** in one paper | Partial `responsive-records` opt-in (e.g. Paper C had 2/16). |
| Mobile **scroll nesting** | Default `.table-container`, `tabindex="0"`, nowrap headers. |
| Desktop **inner horizontal scroll** on wide grids | Intrinsic width &gt; 720px prose column. |
| **Mid-word breaks** | Mock used `overflow-wrap: anywhere` + `hyphens: auto` in fixed narrow columns. |
| **TOC overlap** | Mock **960px breakout** widened tables outside `.prose` and drew over the rail. |

PDF clipping (T18.3 M1) and TOC/scroll chrome are **out of scope** here unless noted.

---

## Ruleset (authoritative — ship this, not the interim mock)

### Shell geometry

At **≥1100px** when TOC shows (≥6 `h2`s), [`ArticleShell.astro`](../../src/layouts/ArticleShell.astro):

```text
.article-body (flex, centered)
  .prose          → --content-width-prose (720px)
  gap (~3em)
  .toc-rail       → 220px sticky
```

All markdown tables are **inside `.prose`**. There is no free band to widen into without overlapping the rail.

| Rule | Requirement |
|---|---|
| **L1** | With TOC visible, tables **must not extend outside `.prose`** (no negative margins, no breakout to 960px, no transforms). Desktop “full width” = **full prose width (~720px)**. |
| **L2** | Short articles without TOC: same 720px rule for this intake (no second layout). |

### Two modes only (A / B)

| | **Mode A — `responsive-records`** | **Mode B — default** |
|---|---|---|
| **Authoring** | `<!-- table-layout: responsive-records -->` + blank line before table | Plain GFM table |
| **Desktop ≥1100px** | Table **inside prose**; `break-word` + `hyphens: manual`; optional **one** global density step (smaller cell type + padding) on opted tables; all columns visible (tall rows OK) | Wrapping headers; same wrap rules; **if still wider than prose** after density → **in-container horizontal scroll** + sticky first column + edge cue |
| **Mobile &lt;1100px** | **Record cards** only | Sticky first column + in-container scroll + edge cue |
| **Print/PDF** | Authored `<table>` only (records hidden) | Unchanged pipeline |

| Rule | Requirement |
|---|---|
| **M1** | Opted-in → cards below 1100px; never grid + cards at same breakpoint. |
| **D1** | No `overflow-wrap: anywhere` or `hyphens: auto` on **desktop** table cells. |
| **D2** | No per-table `:has()` column recipes or per-work CSS matrices. |
| **D3** | At most **one** fallback tier: in-box horizontal scroll (mode B, or mode A by explicit owner call on a specimen). |

### Authoring policy (corpus)

- **Matrices, comparisons, appendix inventories** → Mode A (Desk, Chisel pattern; Paper C mock uses 16× markers pending planner).
- **Simple 2–3 column** → Mode B if readable at 720px with wrap; else Mode A.
- No build-time auto-marking; validators pin opt-in counts per entry when blessed.

### Explicitly out of scope

- PDF print clipping fixes (T18.3 M1).
- Full-bleed tables spanning prose + rail (**shell/grid** ticket).
- Per-column-width hacks for 7- vs 8-column tables.

---

## Target implementation (screen CSS)

**Location:** `@media screen` block in [`src/styles/global.css`](../../src/styles/global.css) (promote from mock footer or merge into `.table-container` section). Baseline T20.1 rules above remain for non-screen.

### Mode A — `responsive-records`

**&lt;1100px** (target — largely done in mock):

- Wrapper: transparent, no side scroll; **record cards** (`--bg-raised`, radius, spacing).
- `table { display: none }`; `.table-records { display: block }`.

**≥1100px** (target — **differs from current broken mock**):

- `.prose .table-container[data-table-layout='responsive-records']`: `width: 100%`, `max-width: 100%`, `overflow-x: visible` (**no breakout**).
- `table`: `width: 100%`, `table-layout: auto`, `min-width: 0`.
- `th` / `td`: `white-space: normal`, `overflow-wrap: break-word`, `hyphens: manual`, `word-break: normal`.
- Optional **density step** (all opted tables): e.g. `tbody td { font-size: 0.8125rem; line-height: 1.5; padding: var(--space-2) var(--space-3); }`.
- Zebra / hover (optional polish).

**Remove from mock before ship:** 960px negative margins, `:has(…nth-last-child(8))` width hints, desktop `overflow-wrap: anywhere`.

### Mode B — default

**&lt;1100px** (target):

- Sticky first column + edge fade on overflowing wrappers (mock).

**≥1100px** (target):

- Wrapper: `max-width: 100%`; `overflow-x: auto` when content exceeds prose (allowed fallback).
- `thead th { white-space: normal }`.
- Same wrap rules as Mode A (D1).
- Override base `thead th { white-space: nowrap }` inside `.table-container` at this breakpoint.

### Unchanged

- `rehype-table-wrap.mjs`, print CSS, `tabindex="0"` on mode B wrappers.

---

## Mock corpus (working tree — not authorized)

| Entry | Change |
|---|---|
| **Paper C** (`cybernetics-structural-science/index.md`) | 16× `responsive-records` markers (mock). |
| **Desk** | 3× markers unchanged; CSS only. |
| **`global.css`** | Article-tables mock block (includes **regressions** to revert per L1/D2). |

**Validator:** `validate-desk-presentation.mjs` still allow-lists Desk + Chisel only — Paper C opt-ins fail until extended.

---

## Working tree ownership (for other agents / sessions)

These **uncommitted** paths come from **this repo’s Cursor agent session** (2026-11-19), not from an unrelated author:

| Path | Session work |
|---|---|
| `site/src/content/research/cybernetics-structural-science/index.md` | Paper C table mock (`responsive-records` markers). |
| `site/src/styles/global.css` | Article-tables mock (+ reading-surface preview CSS if present). |
| `site/src/consts.ts`, `site/src/pages/index.astro` | Homepage Explore strip mock (separate from table intake). |

Another agent saying it “hasn’t touched” those files and that “Paper C edit isn’t reflected” in *their* previews is consistent with **them** using committed `HEAD` while **your** working tree has local mocks. That disowning line is **not** a claim that Paper C was never edited locally — it’s that **their** run didn’t include your uncommitted work.

---

## Verification (after target CSS landed)

| Check | Expect |
|---|---|
| `npm run build` | Pass with Paper C markers if kept. |
| Appendix A @ ≥1100px | Table **wholly inside prose**; **no overlap** with TOC; **no** mid-word breaks (D1). |
| Appendix A @ 390px | Record cards. |
| Desk appendices | Same mode A behavior. |
| FAFSA (mode B) @ ≥1100px | Wrap or in-box scroll; no page overflow. |
| 1440 / 390, light/dark | Spot-check. |

---

## Acceptance criteria (sealed ticket)

- [ ] Ruleset L1, M1, D1–D3 implemented; 960px breakout removed.
- [ ] `CONTENT-MODULES.md` + `design-system/components.md` updated for modes A/B.
- [ ] Paper C marker set confirmed or trimmed by Product Authority.
- [ ] Validator allow-list updated if Paper C ships with 16 opt-ins.
- [ ] Frozen PDFs unchanged unless separate ticket.

---

## Preview captures (historical mock)

See [`article-tables-mock/`](./article-tables-mock/). Some desktop shots predate L1 (breakout overlap).

---

## File checklist

| File | Role |
|---|---|
| `planning/audits/article-tables-mock-spec.md` | This intake |
| `planning/audits/article-tables-mock-scan.md` | Typography / specimen notes |
| `planning/audits/article-tables-mock/*.png` | Evidence |
| `src/styles/global.css` | Target CSS (mock block to reconcile) |
| `src/content/research/cybernetics-structural-science/index.md` | Mock markers |

---

*Spec consolidated 2026-11-19. Ruleset is authoritative; interim mock CSS may contradict until implementation pass 2 (revert breakout, enforce L1).*
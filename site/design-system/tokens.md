# Tokens

All defined in `src/styles/global.css`, in three places kept in sync by convention: `:root` (light default), `:root[data-theme='dark']` (explicit dark choice), and `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { ... } }` (OS default, no explicit choice made). **Every color token needs a value in all three** — a token shipped without the `prefers-color-scheme` fallback has been a real bug in this project before.

## Surfaces / type / accent

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#f4f1ea` | `#0e1013` | Page field |
| `--bg-raised` | `#fbfaf6` | `#16191e` | Cards, elevated chrome |
| `--bg-subtle` | `#ebe7de` | `#1c2026` | Footer, key-findings, mobile TOC, inline code, table header |
| `--border` | `#d5d0c6` | `#2a2f36` | Hairline |
| `--text-primary` | `#1c1d1f` | `#ede9e1` | Ink |
| `--text-secondary` | `#5c6168` | `#9aa0a8` | Meta, lede, captions |
| `--accent` | `#2e4a68` | `#8fa8c4` | Links, focus, primary fill, scroll-progress, TOC active |
| `--accent-hover` | `#243c56` | `#a8bdd4` | Hover of accent |
| `--accent-fg` | `#fbfaf6` | `#0e1013` | Text on the primary button |

## Pillars (5)

12% wash + a small dot + label. Never full page chrome — a pillar colors a badge, a dot, an optional 3px leading edge on a research card. It never colors a page background.

| Token | Light | Dark |
|---|---|---|
| `--pillar-ai-systems` | `#2e4a68` | `#8fa8c4` |
| `--pillar-seo-architecture` | `#2d6a52` | `#6fba9a` |
| `--pillar-systems-architecture` | `#4a5563` | `#a0a8b4` |
| `--pillar-policy-systems` | `#6b4e38` | `#c4a48a` |
| `--pillar-cybernetics` | `#6b4a62` | `#c4a8b8` |

## Alerts (severity, not pillars)

8% wash. `--alert-warning`'s light value is `#7c5f26`, **not** the original Signal-pass spec's `#8a6a2a`: that value computed to 4.05:1 against its own 8% wash (WCAG AA needs 4.5:1) — darkened to `#7c5f26`, verified at 4.75:1. The spec's own suspected failure, `--pillar-systems-architecture`, actually passed clean (5.64:1 light / 6.64:1 dark) and needed no change.

| Token | Light | Dark |
|---|---|---|
| `--alert-note` | `#2e4a68` | `#8fa8c4` |
| `--alert-tip` | `#2d6a52` | `#6fba9a` |
| `--alert-important` | `#4a5563` | `#a0a8b4` |
| `--alert-warning` | `#7c5f26` | `#d4b36a` |
| `--alert-caution` | `#9b3b32` | `#e07068` |

**If contrast is ever re-checked and something fails: darken the text token, not the wash.**

## Everything else

- **Spacing**: `--space-1` (4px) through `--space-8` (64px).
- **Radius**: `--radius-sm` 6px, `--radius-md` 10px, `--radius-lg` 16px, `--radius-full` 999px. Not touched this sprint or the last one — stays 6/10/16 unless explicitly reopened after a color pass.
- **Type scale**: `--text-xs` through `--text-4xl` (0.75rem–3.052rem), modular.
- **Content widths**: `--content-width-prose` 720px (reading columns), `--content-width-wide` 960px (grids/listings).
- **Body text**: 20px / 1.7 line-height by default, drops to 18px under a 720px viewport.
- **Focus ring**: `--focus-ring` (aliases `--accent`), `--focus-ring-width` 2px, `--focus-ring-offset` 2px — drives a sitewide `:focus-visible` rule.
- **Motion**: `--motion-fast` 150ms, `--motion-ease` `ease`. Respected by a `prefers-reduced-motion` block that kills transitions/animations and hides the scroll-progress bar outright.
- **Shadows**: `--shadow-sm/md/lg` are real box-shadow values in light mode, `none` in dark — dark surfaces read better with a 1px border than a shadow, so this is deliberate, not a placeholder.

## Known inconsistency — recorded, not fixed this sprint

`.table-container` (`global.css`) still sets `background: var(--bg)`, not `--bg-raised`, even though tables are conceptually "elevated chrome" like cards. Left as-is deliberately — this sprint is documentation only, no styling changes beyond what Sprint 0.5 already shipped. Fix it in a future visual sprint if it's ever worth the diff.

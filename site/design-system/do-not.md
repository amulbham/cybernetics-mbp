# Do not

Short rules. This is the load-bearing file — if you're about to do one of these, stop and reread `tokens.md`/`components.md` for the actual answer instead.

## Do not

- Add a third font, or a display face. Two families, no exceptions.
- Use electric `#2337ff` / `#5b6bff`, or any neon — that's the palette Signal replaced.
- Color H1s, gradient text, glass, noise, glow, blobs, parallax.
- Give a page a pillar-colored background. Pillars are a 12% wash on a badge/dot, never chrome.
- Add a new component when a token plus an existing component will do.
- Add a new content primitive here — that's Sprint 2 / `CONTENT-MODULES.md` territory, not a visual-token change.
- Ship a different palette per route.
- Set `outline: none` without a `:focus-visible` replacement.
- Ship a color token without both a dark pair and the `prefers-color-scheme` fallback. This exact omission has been a real bug in this project before.
- Put unique information only in an image (no alt-text-only content).
- Flip `SITE_WIDE_NOINDEX` as part of visual work. That's a launch decision, gated on the user's explicit go-ahead, completely unrelated to styling.
- Introduce Keystatic, MDX-for-decoration, or a "reading mode" UI.
- Ship header chrome that fails at 375px, or use a hamburger to hide that failure. Shrink or drop chrome instead — the header stays one row at every width.

## Do

- Quiet indigo/steel, paper, hairlines.
- Dual-theme everything, as complete pairs — never ship one side.
- Underline prose links.
- 8–12% tints for pillar/alert washes, nothing more saturated.
- Atkinson for body/headings, mono for `.meta` only.
- Build grammar from observed research (what real papers actually need), not imagined requirements.

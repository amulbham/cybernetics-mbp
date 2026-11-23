# Article tables mock — desktop typography scan

Quick pass after owner feedback on **mid-word breaks** in Structural Science Appendix A (2026-11-19). Screen CSS only; manual visual review at **≥1100px** in dev.

## Root cause (Appendix A)

| Setting | Effect |
|---|---|
| `table-layout: fixed` on **equal** column widths in **720px** | ~90px per column on an 8-column grid. |
| `overflow-wrap: anywhere` | Breaks inside words (`substanc-e`, `conserve-d`) when the column is too narrow. |
| `hyphens: auto` | Inserts hyphens at arbitrary break points in narrow cells. |

**Fix applied (mock):** match prose (`overflow-wrap: break-word`, `hyphens: manual`, `word-break: normal`); **960px breakout** for `responsive-records` in `.prose`; `table-layout: auto` by default; **fixed + column % hints** only for 8-column opted tables (`:has(thead tr > th:first-child:nth-last-child(8))`); slightly smaller body cell type in opted tables (`0.8125rem`).

## Specimen review (desktop)

| Work | Tables | Layout | After fix (expected) |
|---|---|---|---|
| **Structural Science** | 16× `responsive-records` | Mix: 3–4 col matrices, 2-col glossaries, **1× 8-col appendix** | Appendix: wider box, word-boundary wrap; narrow cols still tall but not chopped. §1 4-column matrix: adequate at 960px. 2-column rows: readable. |
| **Desk** | 3× `responsive-records` (appendices) | 4–5 columns, long citation cells | 960px breakout; auto column widths; wrap at words. |
| **Chisel article** | 2 opted + 2 default | Mixed | Opted: breakout; default: auto + wrap headers (same desktop rules). |
| **FAFSA** | 12 default | Wide headers, 5-col grids | Unmarked: stays in **720px** prose; headers wrap; auto layout — spot-check §4.1 “Forfeited value…” column for density (may need future opt-in). |
| **Invariants / Three SOS** | default | Mostly 2–3 col | Should read cleanly at 720px with wrap. |
| **Chisel IWL** | 13 opted + 2 plain | Dense 4–8 col | Opted get breakout when rendered inside `.prose` on IWL page — confirm IWL shell uses `.prose` (yes). |

## Residual risks

- **Very long unbreakable strings** (URLs, DOIs): may still overflow one cell — `break-word` only breaks at word boundaries unless the token exceeds the column.
- **Equal-width 7-column tables** without `:has` hints: may need the same column-bias pattern as appendix (extend selectors by column count).
- **960px breakout** may kiss the TOC rail on tight viewports (1100–1200px): wrapper uses `min(960px, 100vw - 2.5rem)` to cap.
- **Mobile record cards** still use `overflow-wrap: anywhere` on `dd` — intentional for narrow cards.

## Re-check in dev

1. Structural Science → Appendix A (8 columns).
2. Structural Science → §1 ant/market/immune matrix.
3. Desk → Appendix A figure survey.
4. FAFSA → §4.1 wide header table (unmarked).

Owner sign-off when word breaks look normal and no inner horizontal scrollbar on desktop opted tables.
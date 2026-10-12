# Print fonts

Latin Modern Roman 10, the body face of the scholarly paper PDFs. Used only by `src/styles/print-research.css` (T18.5); no screen page references these files. Vivliostyle loads them by a path relative to that stylesheet, so the PDF never depends on a system font or an external web font. `public/` also publishes them under `/fonts/print/`, which is harmless and unreferenced from HTML.

## Source and license

| Item | Value |
|---|---|
| Family | Latin Modern Roman 10 (`LMRoman10-Regular`, `-Italic`, `-Bold`, `-BoldItalic`), version 2.004 (2009-10-30) |
| Origin | GUST e-foundry: `https://www.gust.org.pl/projects/e-foundry/latin-modern/download/lm2.004otf.zip` (3,907,819 bytes, SHA-256 `5b0236051d3728be6616f1b274e3b910473875b5a3ef9382f0ef00384ddb161b`). Only the four files below were extracted. |
| License | GUST Font License 1.0 (`GUST-FONT-LICENSE.txt`, fetched from `https://www.gust.org.pl/projects/e-foundry/licenses/GUST-FONT-LICENSE.txt`), based on the LaTeX Project Public License 1.3c. Free to use, copy, and redistribute unmodified. The four font files are byte-for-byte as shipped. The license text differs from the fetched file only in whitespace (CRLF to LF, trailing spaces and the final blank line removed, so the repository's whitespace check passes): fetched file SHA-256 `5eb61bb836bb1845ef668717cb15b382e997748ce2629e4388cc5e4c3fa4e433`, file here `cebc6af455d26a96751ada71a2bcba151b262a87aa089f2f3eae8a3f388ccff4`. |
| Copyright | 2003, 2009 B. Jackowski and J. M. Nowacki, on behalf of the TeX user groups |

| File | SHA-256 |
|---|---|
| `lmroman10-regular.otf` | `1aa18cfefa58132c52ce5de70db1fd1154201c19cd2b2cdaffba4906a33e6852` |
| `lmroman10-italic.otf` | `c1fce25075567bb8dbf2151658c3b442690041db17a2d49fc9e55905ea5b7169` |
| `lmroman10-bold.otf` | `102fe06c430a8b681b2bf6876b7cd967ae4d47b4b6b41d915eb7913b726d9fb1` |
| `lmroman10-bolditalic.otf` | `c37a28eed7a6e03f792b98b5e5f637b2fcda378bb4855f99284f1a88fe35f124` |

## Glyph-coverage fonts

Latin Modern Roman has no Greek letters or pictographs, and the site's code font has no `∞`. Two characters in the paper corpus needed coverage; each is supplied by a bundled face limited with `unicode-range` to exactly those characters, so ordinary text is unaffected. Every other character stays in Latin Modern Roman.

The third gap, `⚠` in Three Self-Organizing Systems, is not covered. The source writes it as U+26A0 U+FE0F, an emoji-presentation sequence, and Chrome honors an explicit emoji variation selector over any CSS: a bundled Noto Sans Symbols 2 face placed first, with and without the selector in its `unicode-range`, and `font-variant-emoji: text` all still rendered the system color-emoji font. It therefore uses the system emoji font, as the pre-T18.5 PDF did.

| Character | Face (CSS family) | File | Origin | License |
|---|---|---|---|---|
| `δ` (U+03B4, any Greek) | Latin Modern Math 1.959 (`LM Math Print`) | `latinmodern-math.otf` | GUST e-foundry: `https://www.gust.org.pl/projects/e-foundry/lm-math/download/latinmodern-math-1959.zip` (576,413 bytes, SHA-256 `aaaa060b4ffc091461e875efb9498b9abfa7c7a48f38eb33882868839903a4f8`); only the OTF extracted | GUST Font License. The zip ships the 2006 preliminary text, kept as `GUST-FONT-LICENSE-LatinModernMath-as-shipped.txt` (whitespace-normalized as above; SHA-256 `e120f067589d589a9fa436db09940bd2e03b477cf29b15443c6f87d3861f734b`); the current 1.0 text above has the same grant. |
| `∞` (U+221E) in code | `lmroman10-regular.otf` again (`LM Infinity Print`) | none new | already bundled | as above |

| File | SHA-256 |
|---|---|
| `latinmodern-math.otf` | `6075562b771f8b82f0c179e363389684f2dd09de30038269e2628e504bd7be0f` |

The font files are byte-for-byte as shipped. Evidence of the embedded fonts: `planning/audits/T18.5-scholarly-pdf-visual-evidence.md`.

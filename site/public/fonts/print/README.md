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

## Known glyph gaps

Latin Modern Roman has no Greek letters or pictographs. In the current paper corpus that affects `δ` (U+03B4, Invariants and Three Self-Organizing Systems), the `⚠` emoji (U+26A0, Three Self-Organizing Systems), and `∞` (U+221E) inside FAFSA's one monospace code block. They render through the stylesheet's serif and generic fallbacks, which are system fonts. Evidence and the decision about them: `planning/audits/T18.5-scholarly-pdf-visual-evidence.md`.

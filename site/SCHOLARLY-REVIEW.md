# Forward scholarly review

Use an isolated checkout. The selected-paper review command stages exactly one private
content-collection entry, runs the real Astro route and typesets that route with the
existing Vivliostyle renderer. It removes the staged input on exit. The existing
research collection, legacy PDF builder and deployment workflow remain independent.

Supply the pinned manuscript bytes and a private JSON configuration. The
configuration contains the selected slug/category, source repository/commit/path,
Git blob and SHA-256, asset list and hashes, concept and version DOI URLs, approved
print author note, exact projection start/end/footer, and any print table plan
(header match, repeated key columns, ordered panels and widths). Pin the configuration's
SHA-256 independently. Published prose and table data stay in the manuscript.
An empty asset list is appropriate only when the pinned source has no assets.

```sh
TZ=UTC node --import ./node_modules/tsx/dist/loader.mjs scripts/build-scholarly-review.mjs \
  --input "$INPUT" --input-sha256 "$APPROVED_INPUT_SHA256" --source "$SOURCE" \
  --output "$NEW_PRIVATE_OUTPUT" --browser "$BROWSER" --mode candidate
```

Run it with `TZ=UTC`. The script also forces `TZ=UTC` for the Astro child process, and forward pages
format their visible dates as UTC calendar days, so the visible date, `<time datetime>`, Highwire
`citation_publication_date` and JSON-LD dates always describe the same day even from a non-UTC shell.

Candidate mode hides publication date, canonical URL, ScholarlyArticle/Highwire and
production PDF URL. It serves the intended DOI with provisional language. For an
isolated publication-form rehearsal, use another new private directory and
`--mode final-form --test-date YYYY-MM-DD`. This checks the canonical identity and
clean print treatment without establishing a real publication date or an approved
artifact. Both modes are closed, exclude the review route from the sitemap, and write
the PDF outside the HTML output tree. For browser evidence, use
`node scripts/verify-scholarly-browser.mjs "$CANDIDATE_DIR" "$BROWSER" "$EVIDENCE_DIR"`.

The artifact assembler reads an independent approval record, the exact candidate
manifest and bytes, and the six pinned existing PDFs. Rehearsal approval uses
`state: rehearsal-only` and the fixture-date final form; the approved installer
requires an authorized release-candidate manifest with a real approved date, matching
release approval, and no fixture date. Producing that release manifest, activating a
deployment workflow and publishing are separate gates. The assembler has no renderer
or upload call. It verifies input inventories and hashes and installs into a new
isolated tree as one operation. Use `scripts/assemble-scholarly-artifacts.mjs` with
the tsx loader and a JSON configuration containing `htmlRoot`, `legacyRoot`,
`candidateRoot`, `approvalPath`, `output`, and `mode`.

## Acceptance checks for a review set

Both checks read finished artifacts only. They never render, write to a protected path or use the network.

- **Running head (`scripts/verify-scholarly-header.mjs <pdf>`).** Page 1 carries no running head. Every
  later page must read the surname `Bham` as one word at the left, the article title at the right and its
  own page number at the bottom, in all three extractors: Poppler `pdftotext -layout`, MuPDF (through
  `scripts/mupdf-page-words.py`, which needs `pip install pymupdf`; point `SCHOLARLY_PYTHON` or `--python`
  at that interpreter) and the lockfile-pinned `pdfjs-dist`. Tokens are reported exactly as each extractor
  returned them, with no joining of split words, so the legacy header (small caps with letter-spacing, read
  as `B ham` by Poppler and `B | H | A | M` by pdfjs) fails by design. LM Roman 10 has no small-cap glyphs and
  the renderer synthesizes them as separate scaled runs, so the forward head sets the surname in ordinary
  case (`print-research.css`, `@page scholarly`); everything else about the head is unchanged.
- **Dates (`scripts/verify-scholarly-dates.mjs <index.html> --mode candidate|final-form [--date YYYY-MM-DD]`).**
  A final-form page must show one date in the visible text, `<time datetime>`, Highwire, JSON-LD and Open
  Graph, compared with an independent UTC formatting of the fixture date. A candidate page must carry no
  publication date of any kind. The fixture date is a rehearsal value, never a publication decision.
- `scripts/test-scholarly-correction.mjs` exercises both checks with mutated inputs. With
  `--workspace <dir> --expect pass|reject` it also runs the real extractors over the workspace's two review
  PDFs: `pass` for a corrected set, `reject` for the original set (it must refuse the original split).

## Reproducing the contract suite

`scripts/test-scholarly-contract.mjs` runs 28 cases (projection and source-pin rejection, DOI and note
rules, citation-link variants, and the renderer-free artifact assembler). It needs private inputs that never
enter Git: the pinned manuscript, the candidate and final-form review sets (PDF + manifest + built HTML) and
the six protected PDFs at their baseline fixture paths. Before it runs any case it checks every input
against its pin (`scripts/scholarly-workspace.mjs`) and stops with the full list of problems if any input
is missing or differs; it never reports a pass on partial inputs.

```sh
# 1. From a fresh worktree of the implementation commit: locked dependencies.
cd site && npm ci
# 2. Build a relocatable private workspace (verifies each input first, then writes
#    rehearsal-config.json with workspace-relative paths and a fresh synthetic approval + assembly log).
node --import ./node_modules/tsx/dist/loader.mjs scripts/prepare-scholarly-workspace.mjs \
  --input "$INPUT" --source "$SOURCE" --legacy "$SIX_PDF_DIR" \
  --candidate "$CANDIDATE_DIR" --final-form "$FINAL_FORM_DIR" --workspace "$NEW_WORKSPACE"
# 3. From the repository root: run all 28 cases.
cd .. && TZ=UTC node --import ./site/node_modules/tsx/dist/loader.mjs \
  site/scripts/test-scholarly-contract.mjs "$NEW_WORKSPACE" "$SOURCE"
```

`$SIX_PDF_DIR` holds the six protected PDFs at their fixture paths; verify them against
`scripts/fixtures/approved-six-production-pdfs.sha256` (two have tracked frozen copies, the others must be
exact verified copies; never render replacements). An archived original review set whose final-form page is
a single HTML file is supplied with `--final-form-html`, plus `--approval` and `--assembly-log` to reuse its
archived records. The workspace may be moved: its configuration paths are relative.

Record the toolchain with every review set: `node scripts/record-scholarly-toolchain.mjs --browser "$BROWSER"`
prints Node, Astro, Vivliostyle, pdfjs-dist, the browser version and SHA-256, the bundled print fonts and the
extractor versions. The browser matters: the same inputs typeset to a different page count with a different
Chromium, so an approved PDF is always frozen as bytes and never re-rendered.

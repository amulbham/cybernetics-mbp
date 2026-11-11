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
node --import ./node_modules/tsx/dist/loader.mjs scripts/build-scholarly-review.mjs \
  --input "$INPUT" --input-sha256 "$APPROVED_INPUT_SHA256" --source "$SOURCE" \
  --output "$NEW_PRIVATE_OUTPUT" --browser "$BROWSER" --mode candidate
```

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

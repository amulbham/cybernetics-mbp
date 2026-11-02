#!/usr/bin/env bash
# T22.0 — keep the production scholarly PDFs byte-identical across a redeploy.
#
# Vivliostyle output is not byte-reproducible, so every redeploy would change every
# PDF — breaking "the PDF on Zenodo is the exact file the site serves". While the
# repository variable PDF_CARRY_OVER is "true" (main only), the workflow:
#   carry   after build:pdfs, before validate:pdfs and deploy — replace each freshly
#           typeset PDF with the one production serves, then require every byte to
#           match the approved manifest (the S2/S3 production hashes, held in the
#           repository variable PDF_MANIFEST). Any mismatch, missing or unexpected
#           file, or manifest defect exits non-zero and nothing is deployed.
#   verify  after the upload — re-download the live PDFs and check them against the
#           same manifest again.
# guard   first step of every main deploy — fail-closed rule that keeps an ordinary deploy from
#         replacing approved PDFs once a manifest exists (details at the guard block below).
# The default source is the production origin below; there is no override. There are exactly two
# alternate sources, each only for a path whose production copy does not already match the
# manifest, and the manifest hash still gates every byte (bytes from any source are accepted only
# if they match it):
#   1. The Desk bootstrap (T22.0 Amendment A): the Desk's published Zenodo deposit is the approved
#      Desk artifact, so for exactly that one path `carry` fetches the pinned Zenodo file. Once
#      production serves the approved bytes, the Zenodo branch is never taken again.
#   2. A frozen artifact for a revised paper (T23.0, described next): one hash-named file
#      committed under site/release-pdfs/, at most one swap per run, and only when the committed
#      release expectation also names it.
#   The same frozen artifact is also the source for the one new-paper first publication (T27.1,
#   "New paper" below).
# No other path has an alternate source.
#
# Revised papers (T23.0). A revised paper's PDF cannot come from production (production still
# serves the old bytes), so `carry` may install ONE frozen, hash-named artifact per run from
# site/release-pdfs/<sha256>.pdf — but only when ALL of these hold: the owner-set manifest line
# for that path names that hash; the committed blob exists, hashes to its own name and is a PDF;
# and the committed release expectation (site/release-pdfs/expected.txt, lines in manifest
# format) names the same path and hash. `guard` and `carry` both fail closed when expected.txt
# exists and PDF_MANIFEST does not contain every expectation line byte for byte, so a revised
# article can only deploy under a manifest that names its approved PDF. A path whose production
# copy already matches the manifest is never swapped (zero swaps on any later run).
#
# New paper (T27.1). A paper that has never been published has no production PDF: its first request
# returns HTTP 404, which is fatal for every other path. Exactly one literal path, NEW_PAPER_PATH
# (Cognition as a Self-Organizing System), may treat that 404 as the first publication. It is then
# installed from the committed frozen artifact under the T23.0 rules above (the exact bytes approved
# at staging QA), counts against the same one-swap limit, and additionally requires the owner's
# six-line manifest and expected.txt to name the same hash. It is a property of that one path, never
# of expected.txt: a historical path (Chisel included, which already has an expectation line) whose
# production copy is missing still fails, and for the new path a 403, 5xx, transport failure or a
# 200 that is not a PDF fails too. Once production serves the six approved PDFs, an ordinary
# redeploy carries all six over with zero swaps.
#
# PDF_MANIFEST: exactly five lines (the launch corpus) or, once the new paper is part of the release,
# exactly six lines (the same five plus NEW_PAPER_PATH), in `sha256sum` format, e.g.
#   <64 hex>  research/knowledge-work/<id>/<id>.pdf
# Run from site/ (the workflow's working directory).

set -euo pipefail

ORIGIN="https://amulbham.com"
LAUNCH_COUNT=5 # the launch corpus: five scholarly PDFs. Change deliberately, with the manifest.
NEW_PAPER_COUNT=6 # the launch corpus plus NEW_PAPER_PATH. Any other count is refused.
# The one new-paper path (T27.1): the only path whose HTTP 404 can mean "first publication".
NEW_PAPER_PATH="research/cybernetics/cognition-as-self-organizing-system/cognition-as-self-organizing-system.pdf"
# Desk bootstrap source (Amendment A) — Zenodo record 10.5281/zenodo.23328158, its single published file.
DESK_PATH="research/knowledge-work/the-desk-is-where-you-write-it-down/the-desk-is-where-you-write-it-down.pdf"
DESK_BOOTSTRAP_URL="https://zenodo.org/api/records/23328158/files/v41.10-Site-Bham-The-Desk-Is-Where-You-Write-It-Down.pdf/content"
mode="${1:-}"
dist="${DIST_DIR:-dist}"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

fail() { echo "carry-over-pdfs: $*" >&2; echo "::error title=carry-over-pdfs::$*"; exit 1; } # the ::error:: line shows the reason as a run annotation

# Committed release expectation (T23.0): see the header. Absent file -> no check, unchanged behavior.
here="$(cd "$(dirname "$0")" && pwd)"
frozen_dir="$here/../release-pdfs"
check_expectation() {
  [ -f "$frozen_dir/expected.txt" ] || return 0
  sed 's/\r$//' "$frozen_dir/expected.txt" | sed '/^[[:space:]]*$/d' > "$work/expected-release"
  [ -s "$work/expected-release" ] || fail "release-pdfs/expected.txt exists but has no entries"
  if grep -vqE '^[0-9a-f]{64}  research/[a-z0-9_./-]+\.pdf$' "$work/expected-release"; then fail "release-pdfs/expected.txt has a malformed line"; fi
  printf '%s\n' "${PDF_MANIFEST:-}" | sed 's/\r$//' | sed '/^[[:space:]]*$/d' > "$work/manifest-for-expectation"
  [ -s "$work/manifest-for-expectation" ] || fail "release-pdfs/expected.txt exists but PDF_MANIFEST is empty — a revised paper may not deploy without the manifest that names its approved PDF"
  while read -r want rel; do
    grep -qxF "$want  $rel" "$work/manifest-for-expectation" || fail "PDF_MANIFEST does not carry the release expectation for $rel (release-pdfs/expected.txt names $want) — the owner must set PDF_MANIFEST to the approved manifest before this release deploys"
  done < "$work/expected-release"
}

# guard — runs first on every main deploy (see the workflow). Once a production manifest exists,
# an ordinary deploy must not regenerate and replace the approved PDFs:
#   no manifest                 -> pass (initial content release; nothing to protect yet)
#   manifest + PDF_CARRY_OVER=true -> pass (the carry step then enforces the manifest)
#   manifest + PDF_RELEASE=new-version -> pass: a separately authorized release of a NEW Zenodo
#       version (or new paper) that is meant to produce new PDFs. No other value authorizes
#       regeneration; replacing the bytes behind an already-published Zenodo version is never
#       authorized (published files are immutable — publish a new version first).
#   anything else               -> stop before anything is built or deployed.
if [ "$mode" = "guard" ]; then
  check_expectation # first: applies in every mode, including PDF_RELEASE=new-version
  manifest_text="${PDF_MANIFEST:-}"
  if [ -z "${manifest_text//[[:space:]]/}" ]; then echo "carry-over-pdfs guard: no production PDF manifest — initial/unprotected state, deploy allowed."; exit 0; fi
  if [ "${PDF_CARRY_OVER:-}" = "true" ]; then echo "carry-over-pdfs guard: manifest present and PDF_CARRY_OVER=true — the carry step will enforce it."; exit 0; fi
  if [ "${PDF_RELEASE:-}" = "new-version" ]; then echo "carry-over-pdfs guard: PDF_RELEASE=new-version — authorized PDF release; PDFs may regenerate."; exit 0; fi
  fail "a production PDF manifest exists but PDF_CARRY_OVER is not 'true' and PDF_RELEASE is not 'new-version' — refusing to deploy regenerated PDFs over the approved ones. Set PDF_CARRY_OVER=true, or run the separately authorized PDF release procedure (PDF_RELEASE=new-version for a new Zenodo version). Never unset PDF_MANIFEST to get past this."
fi

[ -n "${PDF_MANIFEST:-}" ] || fail "PDF_MANIFEST is empty — refusing to carry over unverified PDFs"
# Blank lines (a trailing newline in the variable, CRLF pasting) are not entries; every other line must be one.
printf '%s\n' "$PDF_MANIFEST" | sed 's/\r$//' | sed '/^[[:space:]]*$/d' > "$work/manifest"

# Manifest shape: exactly five well-formed, unique lines, or exactly six when NEW_PAPER_PATH is one of them.
n="$(grep -c '' "$work/manifest")"
{ [ "$n" -eq "$LAUNCH_COUNT" ] || [ "$n" -eq "$NEW_PAPER_COUNT" ]; } || fail "manifest has $n lines, expected exactly $LAUNCH_COUNT (launch corpus) or $NEW_PAPER_COUNT (launch corpus plus the new paper)"
if grep -vqE '^[0-9a-f]{64}  research/[a-z0-9_./-]+\.pdf$' "$work/manifest"; then fail "manifest has a malformed line"; fi
awk '{print $2}' "$work/manifest" | sort > "$work/expected"
[ "$(uniq "$work/expected" | wc -l)" -eq "$n" ] || fail "manifest lists a path twice"
if grep -qxF "$NEW_PAPER_PATH" "$work/expected"; then
  [ "$n" -eq "$NEW_PAPER_COUNT" ] || fail "manifest names $NEW_PAPER_PATH but has $n lines — the new paper requires exactly $NEW_PAPER_COUNT"
else
  [ "$n" -eq "$LAUNCH_COUNT" ] || fail "manifest has $n lines but does not name $NEW_PAPER_PATH — only the new paper may make it $NEW_PAPER_COUNT"
fi

fetch() { # $1 = relative path, $2 = destination, $3 = optional absolute URL (the pinned Desk bootstrap only)
  mkdir -p "$(dirname "$2")"
  url="$ORIGIN/$1"; follow="-sS"
  if [ -n "${3:-}" ]; then url="$3"; follow="-sSL"; fi
  code="$(curl $follow --retry 3 --retry-all-errors -o "$2" -w '%{http_code}' "$url")" || fail "download of $url failed (curl exit $?)"
  [ "$code" = "200" ] || fail "download of $url returned HTTP $code"
  [ "$(head -c 5 "$2")" = "%PDF-" ] || fail "$1 (from $url) is not a PDF"
}

# NEW_PAPER_PATH only: like fetch, but a clean HTTP 404 is reported in new_paper_status instead of
# being fatal. Every other status, a transport failure and a non-PDF 200 still fail.
new_paper_status=""
fetch_new_paper() { # $1 = relative path (NEW_PAPER_PATH), $2 = destination
  mkdir -p "$(dirname "$2")"
  url="$ORIGIN/$1"
  code="$(curl -sS --retry 3 --retry-all-errors -o "$2" -w '%{http_code}' "$url")" || fail "download of $url failed (curl exit $?)"
  case "$code" in
    200) [ "$(head -c 5 "$2")" = "%PDF-" ] || fail "$1 (from $url) is not a PDF"; new_paper_status=200 ;;
    404) rm -f "$2"; new_paper_status=404 ;;
    *) fail "download of $url returned HTTP $code" ;;
  esac
}

# Install the one frozen artifact (T23.0 revised paper, T27.1 first publication): $1 = manifest hash,
# $2 = path, $3 = why production cannot supply it. Uses and updates $swaps; at most one per run.
install_frozen() {
  [ -s "$work/expected-release" ] && grep -qxF "$1  $2" "$work/expected-release" || fail "$3 and no committed release expectation (release-pdfs/expected.txt) names $1 for it"
  blob="$frozen_dir/$1.pdf"
  [ -f "$blob" ] || fail "$3 and release-pdfs/$1.pdf is not committed"
  [ "$(sha256sum "$blob" | cut -d' ' -f1)" = "$1" ] || fail "release-pdfs/$1.pdf does not hash to its own name"
  [ "$(head -c 5 "$blob")" = "%PDF-" ] || fail "release-pdfs/$1.pdf is not a PDF"
  swaps=$((swaps + 1))
  [ "$swaps" -le 1 ] || fail "more than one path needs a frozen artifact — a release may swap exactly one PDF"
  cp "$blob" "$dist/$2"
  echo "installed frozen artifact release-pdfs/$1.pdf as $2"
}

case "$mode" in
  carry)
    check_expectation
    swaps=0
    (cd "$dist" && find . -name '*.pdf' | sed 's#^\./##' | sort) > "$work/built"
    if ! diff -u "$work/expected" "$work/built" > "$work/diff"; then cat "$work/diff" >&2; fail "built PDF set differs from the manifest (missing or unexpected files)"; fi
    while read -r want rel; do
      if [ "$rel" = "$NEW_PAPER_PATH" ]; then
        fetch_new_paper "$rel" "$dist/$rel"
        if [ "$new_paper_status" = "404" ]; then
          # T27.1 first publication: production has never served this paper, so the committed frozen
          # artifact (named by the manifest and the release expectation) is the only acceptable source.
          echo "production has no $rel yet (HTTP 404) — first publication from the committed frozen artifact"
          install_frozen "$want" "$rel" "production returned HTTP 404 for the new paper $rel"
        fi
      else
        fetch "$rel" "$dist/$rel"
      fi
      if [ "$rel" = "$DESK_PATH" ] && [ "$(sha256sum "$dist/$rel" | cut -d' ' -f1)" != "$want" ]; then
        echo "production's $rel does not match the manifest — bootstrapping it from the pinned Zenodo deposit"
        fetch "$rel" "$dist/$rel" "$DESK_BOOTSTRAP_URL"
      elif [ "$rel" != "$DESK_PATH" ] && [ "$(sha256sum "$dist/$rel" | cut -d' ' -f1)" != "$want" ]; then
        # T23.0 frozen artifact: production's copy differs from the manifest, so the only acceptable
        # source is the committed, hash-named blob that the release expectation also names.
        install_frozen "$want" "$rel" "production's $rel does not match the manifest"
      fi
      echo "carried over $rel"
    done < "$work/manifest"
    if ! (cd "$dist" && sha256sum -c "$work/manifest" > "$work/carry.log" 2>&1); then
      cat "$work/carry.log" >&2
      fail "a carried-over PDF does not match the approved manifest: $(grep -v ': OK$' "$work/carry.log" | tr '\n' ' ')"
    fi
    echo "carry-over-pdfs: $n PDFs carried over and verified against the manifest ($swaps frozen-artifact swap(s))."
    ;;
  verify)
    # Right after the upload the edge can briefly serve the previous deployment: retry before failing.
    for attempt in 1 2 3 4 5 6; do
      rm -rf "$work/live"; mkdir -p "$work/live"
      while read -r _ rel; do fetch "$rel" "$work/live/$rel"; done < "$work/manifest"
      if (cd "$work/live" && sha256sum -c "$work/manifest" > "$work/verify.log" 2>&1); then
        echo "carry-over-pdfs: live PDFs match the manifest after deploy (attempt $attempt)."
        exit 0
      fi
      echo "carry-over-pdfs: live PDFs not yet matching (attempt $attempt of 6)" >&2
      sleep 10
    done
    cat "$work/verify.log" >&2
    fail "a live PDF does not match the approved manifest"
    ;;
  *)
    fail "usage: carry-over-pdfs.sh guard|carry|verify"
    ;;
esac

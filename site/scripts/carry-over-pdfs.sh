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
# The source is always the production origin below; there is no override.
#
# PDF_MANIFEST: exactly five lines in `sha256sum` format, e.g.
#   <64 hex>  research/knowledge-work/<id>/<id>.pdf
# Run from site/ (the workflow's working directory).

set -euo pipefail

ORIGIN="https://amulbham.com"
EXPECTED_COUNT=5 # the launch corpus: five scholarly PDFs. Change deliberately, with the manifest.
mode="${1:-}"
dist="${DIST_DIR:-dist}"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

fail() { echo "carry-over-pdfs: $*" >&2; exit 1; }

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
  manifest_text="${PDF_MANIFEST:-}"
  if [ -z "${manifest_text//[[:space:]]/}" ]; then echo "carry-over-pdfs guard: no production PDF manifest — initial/unprotected state, deploy allowed."; exit 0; fi
  if [ "${PDF_CARRY_OVER:-}" = "true" ]; then echo "carry-over-pdfs guard: manifest present and PDF_CARRY_OVER=true — the carry step will enforce it."; exit 0; fi
  if [ "${PDF_RELEASE:-}" = "new-version" ]; then echo "carry-over-pdfs guard: PDF_RELEASE=new-version — authorized PDF release; PDFs may regenerate."; exit 0; fi
  fail "a production PDF manifest exists but PDF_CARRY_OVER is not 'true' and PDF_RELEASE is not 'new-version' — refusing to deploy regenerated PDFs over the approved ones. Set PDF_CARRY_OVER=true, or run the separately authorized PDF release procedure (PDF_RELEASE=new-version for a new Zenodo version). Never unset PDF_MANIFEST to get past this."
fi

[ -n "${PDF_MANIFEST:-}" ] || fail "PDF_MANIFEST is empty — refusing to carry over unverified PDFs"
printf '%s\n' "$PDF_MANIFEST" | sed 's/\r$//' > "$work/manifest"

# Manifest shape: exactly EXPECTED_COUNT well-formed, unique lines.
n="$(grep -c '' "$work/manifest")"
[ "$n" -eq "$EXPECTED_COUNT" ] || fail "manifest has $n lines, expected exactly $EXPECTED_COUNT"
if grep -vqE '^[0-9a-f]{64}  research/[a-z0-9_./-]+\.pdf$' "$work/manifest"; then fail "manifest has a malformed line"; fi
awk '{print $2}' "$work/manifest" | sort > "$work/expected"
[ "$(uniq "$work/expected" | wc -l)" -eq "$EXPECTED_COUNT" ] || fail "manifest lists a path twice"

fetch() { # $1 = relative path, $2 = destination
  mkdir -p "$(dirname "$2")"
  curl -fsS --retry 3 -o "$2" "$ORIGIN/$1"
  head -c 5 "$2" | grep -q '%PDF-' || fail "$1 from $ORIGIN is not a PDF"
}

case "$mode" in
  carry)
    (cd "$dist" && find . -name '*.pdf' | sed 's#^\./##' | sort) > "$work/built"
    if ! diff -u "$work/expected" "$work/built" > "$work/diff"; then cat "$work/diff" >&2; fail "built PDF set differs from the manifest (missing or unexpected files)"; fi
    while read -r _ rel; do
      fetch "$rel" "$dist/$rel"
      echo "carried over $rel"
    done < "$work/manifest"
    (cd "$dist" && sha256sum -c "$work/manifest") || fail "a carried-over PDF does not match the approved manifest"
    echo "carry-over-pdfs: $EXPECTED_COUNT PDFs carried over and verified against the manifest."
    ;;
  verify)
    mkdir -p "$work/live"
    while read -r _ rel; do fetch "$rel" "$work/live/$rel"; done < "$work/manifest"
    (cd "$work/live" && sha256sum -c "$work/manifest") || fail "a live PDF does not match the approved manifest"
    echo "carry-over-pdfs: live PDFs match the manifest after deploy."
    ;;
  *)
    fail "usage: carry-over-pdfs.sh guard|carry|verify"
    ;;
esac

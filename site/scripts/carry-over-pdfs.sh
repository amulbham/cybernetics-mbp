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
# The source is the production origin below; there is no override. The one exception is the
# Desk bootstrap (T22.0 Amendment A): the Desk's published Zenodo deposit is the approved Desk
# artifact, so if production's copy of exactly that one path does not already match the manifest,
# `carry` fetches the pinned Zenodo file instead. The manifest hash still gates the result — bytes
# from any source are accepted only if they match it — and no other path has an alternate source.
# Once production serves the approved bytes, the Zenodo branch is never taken again.
#
# PDF_MANIFEST: exactly five lines in `sha256sum` format, e.g.
#   <64 hex>  research/knowledge-work/<id>/<id>.pdf
# Run from site/ (the workflow's working directory).

set -euo pipefail

ORIGIN="https://amulbham.com"
EXPECTED_COUNT=5 # the launch corpus: five scholarly PDFs. Change deliberately, with the manifest.
# Desk bootstrap source (Amendment A) — Zenodo record 10.5281/zenodo.23328158, its single published file.
DESK_PATH="research/knowledge-work/the-desk-is-where-you-write-it-down/the-desk-is-where-you-write-it-down.pdf"
DESK_BOOTSTRAP_URL="https://zenodo.org/api/records/23328158/files/v41.10-Site-Bham-The-Desk-Is-Where-You-Write-It-Down.pdf/content"
mode="${1:-}"
dist="${DIST_DIR:-dist}"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

fail() { echo "carry-over-pdfs: $*" >&2; echo "::error title=carry-over-pdfs::$*"; exit 1; } # the ::error:: line shows the reason as a run annotation

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
# Blank lines (a trailing newline in the variable, CRLF pasting) are not entries; every other line must be one.
printf '%s\n' "$PDF_MANIFEST" | sed 's/\r$//' | sed '/^[[:space:]]*$/d' > "$work/manifest"

# Manifest shape: exactly EXPECTED_COUNT well-formed, unique lines.
n="$(grep -c '' "$work/manifest")"
[ "$n" -eq "$EXPECTED_COUNT" ] || fail "manifest has $n lines, expected exactly $EXPECTED_COUNT"
if grep -vqE '^[0-9a-f]{64}  research/[a-z0-9_./-]+\.pdf$' "$work/manifest"; then fail "manifest has a malformed line"; fi
awk '{print $2}' "$work/manifest" | sort > "$work/expected"
[ "$(uniq "$work/expected" | wc -l)" -eq "$EXPECTED_COUNT" ] || fail "manifest lists a path twice"

fetch() { # $1 = relative path, $2 = destination, $3 = optional absolute URL (the pinned Desk bootstrap only)
  mkdir -p "$(dirname "$2")"
  url="$ORIGIN/$1"; follow="-sS"
  if [ -n "${3:-}" ]; then url="$3"; follow="-sSL"; fi
  code="$(curl $follow --retry 3 --retry-all-errors -o "$2" -w '%{http_code}' "$url")" || fail "download of $url failed (curl exit $?)"
  [ "$code" = "200" ] || fail "download of $url returned HTTP $code"
  [ "$(head -c 5 "$2")" = "%PDF-" ] || fail "$1 (from $url) is not a PDF"
}

case "$mode" in
  carry)
    (cd "$dist" && find . -name '*.pdf' | sed 's#^\./##' | sort) > "$work/built"
    if ! diff -u "$work/expected" "$work/built" > "$work/diff"; then cat "$work/diff" >&2; fail "built PDF set differs from the manifest (missing or unexpected files)"; fi
    while read -r want rel; do
      fetch "$rel" "$dist/$rel"
      if [ "$rel" = "$DESK_PATH" ] && [ "$(sha256sum "$dist/$rel" | cut -d' ' -f1)" != "$want" ]; then
        echo "production's $rel does not match the manifest — bootstrapping it from the pinned Zenodo deposit"
        fetch "$rel" "$dist/$rel" "$DESK_BOOTSTRAP_URL"
      fi
      echo "carried over $rel"
    done < "$work/manifest"
    if ! (cd "$dist" && sha256sum -c "$work/manifest" > "$work/carry.log" 2>&1); then
      cat "$work/carry.log" >&2
      fail "a carried-over PDF does not match the approved manifest: $(grep -v ': OK$' "$work/carry.log" | tr '\n' ' ')"
    fi
    echo "carry-over-pdfs: $EXPECTED_COUNT PDFs carried over and verified against the manifest."
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

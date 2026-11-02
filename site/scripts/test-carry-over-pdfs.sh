#!/usr/bin/env bash
# T27.1 — synthetic tests for carry-over-pdfs.sh (first publication of the sixth scholarly PDF).
#
# Each case builds a throwaway tree (a copy of the script, a release-pdfs/ directory, a dist/ of
# "freshly typeset" PDFs, and a stub `curl` that answers from a fixture directory), runs the real
# script against it, and checks the exit code, the message and what ended up in dist/. Nothing touches
# the network, the repository's release-pdfs/, a repository variable or a deployment: the origin is
# the script's own constant, answered by the stub, and PDF_MANIFEST is passed per run.
#
#   bash scripts/test-carry-over-pdfs.sh                      # synthetic bytes
#   REAL_PDF_DIR=<dir> bash scripts/test-carry-over-pdfs.sh   # also repeat every case with the five real
#                                                             # production PDFs (<dir>/<basename>.pdf),
#                                                             # first checking them against the T22.0/T23.0
#                                                             # hashes recorded in T27.1
# Exit status is non-zero if any case does not behave as expected. Run from site/.

set -uo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
script_src="$here/carry-over-pdfs.sh"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

declare -A REL=(
  [INV]="research/cybernetics/the-invariants-of-self-organizing-systems/the-invariants-of-self-organizing-systems.pdf"
  [SOS]="research/cybernetics/three-self-organizing-systems/three-self-organizing-systems.pdf"
  [FAFSA]="research/essays/an-engineers-guide-to-structural-financial-aid-exploits/an-engineers-guide-to-structural-financial-aid-exploits.pdf"
  [CHISEL]="research/knowledge-work/the-chisel-fallacy-what-pangram-actually-measures/the-chisel-fallacy-what-pangram-actually-measures.pdf"
  [DESK]="research/knowledge-work/the-desk-is-where-you-write-it-down/the-desk-is-where-you-write-it-down.pdf"
  [B]="research/cybernetics/cognition-as-self-organizing-system/cognition-as-self-organizing-system.pdf"
)
# The five historical rows recorded in T27.1 (reference fixture, not a reading of the live variable).
declare -A TICKET_HASH=(
  [INV]=4b4e3b618e32a479a140d9cac4c180c18c3f57c9861a2df4999229772a6e0ab4
  [SOS]=e86bd3005402badc647046096f71968bdfbb248efa017d467e2d769e2df1c21e
  [FAFSA]=d8ec32df31da35dd2e8efa6eda2aeb1d75cde70bd7e3a2a35a90cb93bf4df54f
  [CHISEL]=1f68d9eec9a0d8412a7fefc4d2c42b17f340801fbbef438b671edbffaf4582f3
  [DESK]=268d16c0f29d6ba4c0e8299ff30a816fe44d62591206e434ae277d080b40cfd9
)
HIST="INV SOS FAFSA CHISEL DESK"
declare -A H # canonical (approved) SHA-256 per id, set by init_canon

sha() { sha256sum "$1" | cut -d' ' -f1; }
ok=0; bad=0; label="synthetic"
pass() { ok=$((ok + 1)); printf 'PASS  [%s] %s\n' "$label" "$1"; }
fail_case() { bad=$((bad + 1)); printf 'FAIL  [%s] %s\n' "$label" "$1"; sed 's/^/        | /' "$root/out" | tail -6; }

# Canonical bytes per path: synthetic, or the real production PDFs in REAL_PDF_DIR for the five historical ones.
init_canon() {
  rm -rf "$tmp/canon"; mkdir -p "$tmp/canon"
  for id in INV SOS FAFSA CHISEL DESK B; do
    if [ "$1" = "real" ] && [ "$id" != "B" ]; then cp "$REAL_PDF_DIR/$(basename "${REL[$id]}")" "$tmp/canon/$id.pdf"
    else printf '%%PDF-1.7\nprod %s\n' "$id" > "$tmp/canon/$id.pdf"; fi
    H[$id]="$(sha "$tmp/canon/$id.pdf")"
  done
}

write_stub() {
  cat > "$root/bin/curl" <<'STUB'
#!/usr/bin/env bash
# Stand-in for curl: answers the carry script's `curl [-sS|-sSL] --retry 3 --retry-all-errors -o DEST -w '%{http_code}' URL`
out=""; url=""
while [ $# -gt 0 ]; do
  case "$1" in -o) out="$2"; shift 2 ;; -w|--retry) shift 2 ;; -*) shift ;; *) url="$1"; shift ;; esac
done
echo "$url" >> "$STUB_ROOT/requests.log"
case "$url" in
  https://amulbham.com/*) key="${url#https://amulbham.com/}" ;;
  https://zenodo.org/*) key="__zenodo" ;;
  *) echo "stub curl: unexpected URL $url" >&2; exit 99 ;;
esac
[ -e "$STUB_ROOT/neterr/$key" ] && exit 7
if [ -e "$STUB_ROOT/status/$key" ]; then code="$(cat "$STUB_ROOT/status/$key")"; printf '<html>%s</html>' "$code" > "$out"; printf '%s' "$code"; exit 0; fi
if [ -e "$STUB_ROOT/serve/$key" ]; then cp "$STUB_ROOT/serve/$key" "$out"; printf 200; exit 0; fi
printf '<html>not found</html>' > "$out"; printf 404 # an unpublished path, as the edge answers it
STUB
  chmod +x "$root/bin/curl"
}

# First-release baseline: five historical PDFs live, the new paper not yet; six freshly built; six-line manifest;
# expected.txt names Chisel (as in the repo) and the new paper; both blobs committed.
setup() {
  local id
  root="$(mktemp -d "$tmp/case.XXXXXX")"
  mkdir -p "$root"/{site/scripts,site/release-pdfs,site/dist,bin,serve,status,neterr}
  cp "$script_src" "$root/site/scripts/"
  write_stub
  for id in $HIST; do
    mkdir -p "$(dirname "$root/serve/${REL[$id]}")"; cp "$tmp/canon/$id.pdf" "$root/serve/${REL[$id]}"
  done
  for id in $HIST B; do build "$id"; done
  expect CHISEL B
  M="$(manifest INV SOS FAFSA CHISEL DESK B)"
}
build() { mkdir -p "$(dirname "$root/site/dist/${REL[$1]}")"; printf '%%PDF-1.7\nbuilt %s\n' "$1" > "$root/site/dist/${REL[$1]}"; }
manifest() { for id in "$@"; do printf '%s  %s\n' "${H[$id]}" "${REL[$id]}"; done; }
expect() { # expected.txt lines + committed blobs for the given ids
  : > "$root/site/release-pdfs/expected.txt"
  for id in "$@"; do printf '%s  %s\n' "${H[$id]}" "${REL[$id]}" >> "$root/site/release-pdfs/expected.txt"; cp "$tmp/canon/$id.pdf" "$root/site/release-pdfs/${H[$id]}.pdf"; done
}
serve_b() { mkdir -p "$(dirname "$root/serve/${REL[B]}")"; cp "$tmp/canon/B.pdf" "$root/serve/${REL[B]}"; }
unserve() { rm -f "$root/serve/${REL[$1]}"; }
status() { mkdir -p "$(dirname "$root/status/${REL[$1]}")"; printf '%s' "$2" > "$root/status/${REL[$1]}"; }
old_bytes() { mkdir -p "$(dirname "$root/serve/${REL[$1]}")"; printf '%%PDF-1.7\nOLD %s\n' "$1" > "$root/serve/${REL[$1]}"; }

run() { # $1 mode, then optional KEY=VAL env overrides
  local mode="$1"; shift
  (cd "$root/site" && env PATH="$root/bin:$PATH" STUB_ROOT="$root" DIST_DIR=dist PDF_MANIFEST="$M" PDF_CARRY_OVER=true "$@" bash scripts/carry-over-pdfs.sh "$mode") > "$root/out" 2>&1
  rc=$?
}
SUCCESS='PDFs carried over and verified against the manifest'
t_ok() { # name, optional pattern the output must contain
  if [ "$rc" -eq 0 ] && { [ -z "${2:-}" ] || grep -qE "$2" "$root/out"; }; then pass "$1"; else fail_case "$1"; fi
}
t_fail() { # name, pattern the failure message must contain; must never print the success line or annotate success
  if [ "$rc" -ne 0 ] && grep -qE "$2" "$root/out" && ! grep -q "$SUCCESS" "$root/out"; then pass "$1"; else fail_case "$1"; fi
}
t_true() { local name="$1"; shift; if "$@" > /dev/null 2>&1; then pass "$name"; else fail_case "$name"; fi; }
t_false() { local name="$1"; shift; if "$@" > /dev/null 2>&1; then fail_case "$name"; else pass "$name"; fi; }
same_bytes() { cmp -s "$1" "$2"; }
dist_is() { same_bytes "$root/site/dist/${REL[$1]}" "$tmp/canon/$2.pdf"; }
nothing_installed() { ! grep -q 'installed frozen artifact' "$root/out"; }

suite() {
  local id i

  # --- positive paths -------------------------------------------------------------------------------
  setup; run carry
  t_ok "first release: five live PDFs + new paper 404 + approved frozen artifact" "1 frozen-artifact swap"
  t_true "first release: the new paper is the frozen artifact's exact bytes" dist_is B B
  for id in $HIST; do t_true "first release: $id carried over byte for byte" dist_is "$id" "$id"; done
  t_true "first release: exactly six production requests, none to Zenodo" test "$(grep -c . "$root/requests.log")" -eq 6 -a "$(grep -c zenodo "$root/requests.log")" -eq 0

  setup; serve_b; run carry
  t_ok "redeploy: all six live PDFs reused, zero frozen swaps" "0 frozen-artifact swap"
  t_true "redeploy: no frozen artifact installed" nothing_installed
  for id in $HIST B; do t_true "redeploy: $id equals production's bytes" dist_is "$id" "$id"; done

  setup; serve_b; expect CHISEL; run carry
  t_ok "redeploy after the new paper's expectation is retired: zero swaps" "0 frozen-artifact swap"

  setup; expect CHISEL; M="$(manifest INV SOS FAFSA CHISEL DESK)"; rm -f "$root/site/dist/${REL[B]}"; run carry
  t_ok "launch corpus (five-line manifest, five built PDFs) still passes" "5 PDFs carried over.*0 frozen-artifact swap"

  # --- a missing historical PDF is always fatal ----------------------------------------------------------
  for id in $HIST; do
    setup; unserve "$id"; run carry
    t_fail "historical $id returns 404: fails" "$(basename "${REL[$id]}") returned HTTP 404"
  done
  setup; unserve CHISEL; run carry
  t_fail "Chisel 404 fails even though expected.txt names it and its blob is committed" "chisel-fallacy.*returned HTTP 404"
  t_false "Chisel 404: its frozen blob is never installed" dist_is CHISEL CHISEL
  t_true "Chisel 404: no artifact substituted" nothing_installed
  setup; unserve CHISEL; unserve B; run carry
  t_fail "Chisel 404 and new paper 404 together: still fails on Chisel" "chisel-fallacy.*returned HTTP 404"
  setup; rm -f "$root/site/release-pdfs/expected.txt"; unserve CHISEL; run carry
  t_fail "Chisel 404 without any expectation: fails" "chisel-fallacy.*returned HTTP 404"

  # --- only the new path tolerates 404; every other status or error is fatal -----------------------------
  for code in 403 500 502 503; do
    setup; status B "$code"; run carry
    t_fail "new paper returns HTTP $code: fails (not mistaken for 404)" "returned HTTP $code"
    t_true "new paper HTTP $code: no artifact substituted" nothing_installed
    t_false "new paper HTTP $code: the frozen bytes are not in dist" dist_is B B
  done
  setup; mkdir -p "$(dirname "$root/neterr/${REL[B]}")"; : > "$root/neterr/${REL[B]}"; run carry
  t_fail "new paper network failure: fails" "download of .* failed \(curl exit"
  t_true "new paper network failure: no artifact substituted" nothing_installed
  t_false "new paper network failure: the frozen bytes are not in dist" dist_is B B
  setup; mkdir -p "$(dirname "$root/serve/${REL[B]}")"; printf '<html>spa fallback</html>' > "$root/serve/${REL[B]}"; run carry
  t_fail "new paper answers 200 with a non-PDF: fails" "is not a PDF"

  # --- the new paper's first publication needs the approved artifact -----------------------------------
  setup; expect CHISEL; run carry
  t_fail "new paper 404 without an expectation line: fails" "no committed release expectation"
  setup; rm -f "$root/site/release-pdfs/expected.txt"; run carry
  t_fail "new paper 404 without expected.txt at all: fails" "no committed release expectation"
  setup; rm -f "$root/site/release-pdfs/${H[B]}.pdf"; run carry
  t_fail "new paper 404 with no committed frozen blob: fails" "release-pdfs/${H[B]}.pdf is not committed"
  setup; printf '%%PDF-1.7\nTAMPERED\n' > "$root/site/release-pdfs/${H[B]}.pdf"; run carry
  t_fail "frozen blob with altered bytes (wrong SHA-256): fails" "does not hash to its own name"
  setup; printf 'not a pdf\n' > "$root/np"; nh="$(sha "$root/np")"; cp "$root/np" "$root/site/release-pdfs/$nh.pdf"
  { printf '%s  %s\n' "${H[CHISEL]}" "${REL[CHISEL]}"; printf '%s  %s\n' "$nh" "${REL[B]}"; } > "$root/site/release-pdfs/expected.txt"
  M="$(manifest INV SOS FAFSA CHISEL DESK; printf '%s  %s\n' "$nh" "${REL[B]}")"; run carry
  t_fail "frozen blob that hashes to its name but is not a PDF: fails" "is not a PDF"
  setup; sed -i "s/^${H[B]}/$(printf 'f%.0s' {1..64})/" "$root/site/release-pdfs/expected.txt"; run carry
  t_fail "expected.txt names a different sixth hash than the manifest: fails" "does not carry the release expectation"
  setup; sed -i "s/^${H[CHISEL]}/$(printf 'e%.0s' {1..64})/" "$root/site/release-pdfs/expected.txt"; run carry
  t_fail "expected.txt Chisel line disagrees with the manifest: fails" "does not carry the release expectation"
  setup; M="$(manifest INV SOS FAFSA CHISEL DESK; printf '%s  %s\n' "$(printf 'a%.0s' {1..64})" "${REL[B]}")"; run carry
  t_fail "manifest names a sixth hash that expected.txt does not: fails" "does not carry the release expectation"
  setup; expect CHISEL; M="$(manifest INV SOS FAFSA CHISEL DESK; printf '%s  %s\n' "$(printf 'a%.0s' {1..64})" "${REL[B]}")"; serve_b; run carry
  t_fail "live new paper differs from the manifest and no expectation approves it: fails" "no committed release expectation"

  # --- manifest shape -----------------------------------------------------------------------------------
  setup; M="$(manifest INV SOS FAFSA CHISEL)"; run carry
  t_fail "manifest with a row missing (4 lines): fails" "manifest has 4 lines"
  setup; M="$(manifest INV SOS FAFSA CHISEL DESK B; printf '%s  %s\n' "$(printf 'b%.0s' {1..64})" "research/cybernetics/extra/extra.pdf")"; run carry
  t_fail "manifest with an extra row (7 lines): fails" "manifest has 7 lines"
  setup; M="$(manifest INV SOS FAFSA CHISEL B B)"; run carry
  t_fail "manifest listing the new paper twice: fails" "lists a path twice"
  setup; M="$(manifest INV SOS FAFSA CHISEL DESK; printf '%s  %s\n' "$(printf 'b%.0s' {1..64})" "research/cybernetics/extra/extra.pdf")"; run carry
  t_fail "six rows where the sixth is not the new paper: fails" "does not name research/cybernetics/cognition"
  setup; expect CHISEL B; M="$(manifest INV SOS FAFSA CHISEL B)"; run carry
  t_fail "five rows that include the new paper (a historical row dropped): fails" "names research/cybernetics/cognition.*has 5 lines"
  setup; M="$(manifest INV SOS FAFSA CHISEL DESK B | sed '1s/^[0-9a-f]/G/')"; run carry
  t_fail "malformed manifest line (uppercase hex): fails" "malformed line"
  setup; M="$(manifest INV SOS FAFSA CHISEL DESK B | sed '2s/  / /')"; run carry
  t_fail "malformed manifest line (single space): fails" "malformed line"
  setup; M=""; run carry
  t_fail "empty manifest: fails" "PDF_MANIFEST is empty"
  setup; expect CHISEL; M="$(manifest INV SOS FAFSA CHISEL DESK)"; run carry
  t_fail "partial rollout: five-line manifest while six PDFs are built: fails" "built PDF set differs"
  setup; rm -f "$root/site/dist/${REL[B]}"; run carry
  t_fail "six-line manifest but the new paper was not built: fails" "built PDF set differs"
  setup; expect CHISEL; M="$(manifest INV SOS FAFSA CHISEL DESK)"; rm -f "$root/site/dist/${REL[B]}"; mkdir -p "$root/site/dist/research/x"; printf '%%PDF-1.7\nstray\n' > "$root/site/dist/research/x/stray.pdf"; run carry
  t_fail "unexpected extra built PDF: fails" "built PDF set differs"

  # --- more than one frozen replacement ----------------------------------------------------------------
  setup; old_bytes CHISEL; run carry
  t_fail "Chisel needs a frozen artifact and the new paper is a first publication: fails (two swaps)" "more than one path needs a frozen artifact"
  setup; old_bytes CHISEL; serve_b; printf '%%PDF-1.7\nOLD B\n' > "$root/serve/${REL[B]}"; run carry
  t_fail "Chisel and the new paper both differ from the manifest: fails (two swaps)" "more than one path needs a frozen artifact"
  setup; old_bytes FAFSA; old_bytes CHISEL; run carry
  t_fail "two historical paths differ: fails" "no committed release expectation.*|more than one path"

  # --- existing protections that must not change -------------------------------------------------------
  setup; old_bytes CHISEL; unserve B; M="$(manifest INV SOS FAFSA CHISEL DESK)"; rm -f "$root/site/dist/${REL[B]}"; expect CHISEL; run carry
  t_ok "T23.0 Chisel frozen artifact (launch-corpus manifest): one swap" "1 frozen-artifact swap"
  t_true "T23.0 Chisel frozen artifact: exact frozen bytes installed" dist_is CHISEL CHISEL
  setup; old_bytes CHISEL; unserve B; M="$(manifest INV SOS FAFSA CHISEL DESK)"; rm -f "$root/site/dist/${REL[B]}" "$root/site/release-pdfs/expected.txt"; run carry
  t_fail "Chisel mismatch with no expectation: fails" "no committed release expectation"
  setup; serve_b; old_bytes DESK; mkdir -p "$root/serve"; cp "$tmp/canon/DESK.pdf" "$root/serve/__zenodo"; run carry
  t_ok "Desk bootstrap from the pinned Zenodo deposit still works" "bootstrapping it from the pinned Zenodo deposit"
  t_true "Desk bootstrap: Zenodo's bytes installed, nothing frozen" dist_is DESK DESK
  setup; serve_b; old_bytes DESK; run carry
  t_fail "Desk mismatch with Zenodo unavailable: fails" "returned HTTP 404"

  # --- guard and verify ---------------------------------------------------------------------------------
  setup; run guard PDF_MANIFEST= PDF_CARRY_OVER=
  t_fail "guard: expectation present but no manifest: fails" "PDF_MANIFEST is empty"
  setup; rm -f "$root/site/release-pdfs/expected.txt"; run guard PDF_MANIFEST= PDF_CARRY_OVER=
  t_ok "guard: no expectation and no manifest: initial state allowed" "no production PDF manifest"
  setup; run guard PDF_CARRY_OVER=
  t_fail "guard: manifest without carry-over or release flag: fails" "PDF_CARRY_OVER is not 'true'"
  setup; run guard
  t_ok "guard: manifest and PDF_CARRY_OVER=true passes" "the carry step will enforce it"
  setup; sed -i "s/^${H[B]}/$(printf 'c%.0s' {1..64})/" "$root/site/release-pdfs/expected.txt"; run guard PDF_RELEASE=new-version
  t_fail "guard: PDF_RELEASE=new-version does not excuse an expectation the manifest lacks" "does not carry the release expectation"
  setup; serve_b; run verify
  t_ok "verify: six live PDFs match the manifest" "live PDFs match the manifest after deploy"
  setup; run verify
  t_fail "verify: the new paper is still 404 after deploy: fails at once" "returned HTTP 404"

  # --- mutate, then restore ----------------------------------------------------------------------------
  setup; cp "$root/site/release-pdfs/${H[B]}.pdf" "$root/blob.keep"; printf 'x' >> "$root/site/release-pdfs/${H[B]}.pdf"; run carry
  t_fail "mutation: corrupted frozen blob: fails" "does not hash to its own name"
  cp "$root/blob.keep" "$root/site/release-pdfs/${H[B]}.pdf"; for id in $HIST B; do build "$id"; done; run carry
  t_ok "restored fixture passes again" "1 frozen-artifact swap"

  # --- structure ---------------------------------------------------------------------------------------
  t_true "the new-paper path appears exactly once as a literal in the script" test "$(grep -cF 'cognition-as-self-organizing-system/cognition-as-self-organizing-system.pdf' "$script_src")" -eq 1
  t_true "only one code path treats HTTP 404 as non-fatal" test "$(grep -c '^ *404) ' "$script_src")" -eq 1
}

# --- run ---------------------------------------------------------------------------------------------------
init_canon synthetic; label="synthetic"; suite
if [ -n "${REAL_PDF_DIR:-}" ]; then
  mismatch=0
  for id in $HIST; do
    f="$REAL_PDF_DIR/$(basename "${REL[$id]}")"
    if [ -f "$f" ] && [ "$(sha "$f")" = "${TICKET_HASH[$id]}" ]; then printf 'PASS  [real] %s matches the T27.1 historical hash %s\n' "$id" "${TICKET_HASH[$id]:0:12}"; ok=$((ok + 1))
    else printf 'FAIL  [real] %s is missing or does not match the T27.1 historical hash\n' "$id"; bad=$((bad + 1)); mismatch=1; fi
  done
  if [ "$mismatch" -eq 0 ]; then init_canon real; label="real"; suite; fi
fi
printf '\n%d passed, %d failed\n' "$ok" "$bad"
[ "$bad" -eq 0 ]

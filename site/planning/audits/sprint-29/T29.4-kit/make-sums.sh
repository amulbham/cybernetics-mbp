#!/bin/sh
# Regenerate SHA256SUMS (runtime files only). Run after any kit change, then re-run test-kit.mjs.
cd "$(dirname "$0")" && sha256sum kit-common.mjs verify-upload-dir.mjs anonymous-denial-check.mjs verify-hosted-preview.mjs pins.json > SHA256SUMS && sha256sum SHA256SUMS

#!/usr/bin/env node
// Sprint 8.1 — the PDF-only anchor-canonicalization step.
//
// A PDF has no origin of its own: a root-relative <a href="/research/...">
// that means "this site" in a browser means nothing once it's inside a
// downloaded file, and if the HTML was fetched from a local preview server
// to typeset it (the only way Vivliostyle resolves assets correctly — see
// CHANGELOG.md's Sprint 8.0 entry), that relative link resolves against
// *that* origin, landing PDF link annotations on http://localhost:PORT/...
// instead of the real site.
//
// This script copies a built directory tree to a transient destination and
// rewrites ONLY root-relative <a href="/..."> values (never "//...", never
// "#fragment", never an already-absolute https:/mailto: href, and never any
// other attribute — src/href on <link>/<script>/<img> stay untouched) to
// absolute production URLs. Everything else in the tree — CSS, fonts,
// images, other markup — is copied byte-for-byte. The result is a derived
// PDF-build input, not a second content source: nothing here touches the
// Markdown, the rehype pipeline, or research-relations.json, and the real
// `dist/` used for the actual deployed site is never modified (this always
// writes to a separate destination directory).
//
// Usage: node scripts/absolutize-pdf-links.mjs <sourceDir> <destDir> [origin]

import { cpSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

// Source of truth for the production origin is astro.config.mjs's `site:`
// field — kept as a literal here (not imported) since astro.config.mjs is
// loaded through Astro's own config pipeline, not meant to be re-imported
// as a plain module from a standalone script. Keep these two in sync by
// hand; there is only the one place either value should ever ship.
const DEFAULT_ORIGIN = 'https://amulbham.com';

// Matches href="/path" — exactly one leading slash, not two (protocol-
// relative "//host/path" is a different, non-root-relative shape and must
// never be rewritten, though nothing on this site currently emits one).
const ROOT_RELATIVE_HREF_RE = /href="(\/(?!\/)[^"]*)"/g;
const ANCHOR_TAG_RE = /<a\b[^>]*>/g;

function absolutizeAnchors(html, origin) {
	return html.replace(ANCHOR_TAG_RE, (tag) =>
		tag.replace(ROOT_RELATIVE_HREF_RE, (_, path) => `href="${origin}${path}"`),
	);
}

function walkHtmlFiles(dir, out = []) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const stat = statSync(full);
		if (stat.isDirectory()) walkHtmlFiles(full, out);
		else if (entry.endsWith('.html')) out.push(full);
	}
	return out;
}

/**
 * Copies sourceDir to destDir (whole tree, once) and rewrites every
 * root-relative <a href="/..."> found in the copy to an absolute
 * production URL. Exported so build-research-pdfs.mjs (Sprint 8.2) can
 * call this exact logic directly for its one whole-tree pass, rather than
 * reimplementing it or shelling out to this file as a subprocess per call.
 * Returns { htmlFileCount, rewrittenCount } for the caller to log/verify.
 */
export function absolutizePdfLinks(sourceDir, destDir, origin = DEFAULT_ORIGIN) {
	cpSync(sourceDir, destDir, { recursive: true });

	const htmlFiles = walkHtmlFiles(destDir);
	let rewritten = 0;
	for (const file of htmlFiles) {
		const before = readFileSync(file, 'utf8');
		const after = absolutizeAnchors(before, origin);
		if (after !== before) {
			writeFileSync(file, after);
			rewritten++;
		}
	}
	return { htmlFileCount: htmlFiles.length, rewrittenCount: rewritten };
}

function main() {
	const [sourceDir, destDir, origin = DEFAULT_ORIGIN] = process.argv.slice(2);
	if (!sourceDir || !destDir) {
		console.error('Usage: node scripts/absolutize-pdf-links.mjs <sourceDir> <destDir> [origin]');
		process.exit(1);
	}
	const { htmlFileCount, rewrittenCount } = absolutizePdfLinks(sourceDir, destDir, origin);
	console.log(`absolutize-pdf-links: ${htmlFileCount} HTML files copied, ${rewrittenCount} rewritten (origin: ${origin})`);
}

// Only run the CLI entry point when this file is executed directly (`node
// absolutize-pdf-links.mjs ...`), not when build-research-pdfs.mjs imports
// absolutizePdfLinks from it.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	main();
}

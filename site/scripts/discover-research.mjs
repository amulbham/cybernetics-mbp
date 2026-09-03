#!/usr/bin/env node
// Sprint 8.6 — the one paper/non-paper source list.
//
// Extracted straight out of build-research-pdfs.mjs's own discoverPapers()
// (Sprint 8.2), which had no reason to keep being the only place that
// logic lived once a second script (validate-research-pdfs.mjs) needed the
// identical source list — a manifest re-derived twice is exactly the kind
// of drift this whole project's routing/identity discipline exists to
// prevent (see research-routing.ts's own header comment). Both scripts
// import discoverPapers() from here now; neither defines its own copy.
//
// Discovers straight from src/content/research/*/index.{md,mdx}
// frontmatter, never from dist/ — dist/'s shape is a *consequence* of the
// frontmatter, not a second source of truth for what should exist.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { canonicalPath } from '../src/lib/research-routing.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url)); // site/
const CONTENT_DIR = join(ROOT, 'src', 'content', 'research');

// astro.config.mjs's `site:` field is the real source of truth for the
// production origin, but that file isn't safely importable from a plain
// tsx script — it runs Astro's own integration setup at import time, which
// assumes a real Astro/Vite context this script doesn't have. This is the
// same hand-synced-literal precedent absolutize-pdf-links.mjs's
// DEFAULT_ORIGIN already established (Sprint 8.1) — keep this, that
// constant, and astro.config.mjs's `site:` value in sync by hand; there is
// no fourth place this value should ever be declared.
export const SITE_ORIGIN = 'https://amulbham.com';

/**
 * Scans src/content/research/ once, splitting every entry into papers and
 * everything else. The "everything else" list (essays/memos today) is the
 * complement validate-research-pdfs.mjs's non-paper leak checks scan —
 * every entry this repo has that must NOT have a paper.pdf, Highwire tags,
 * a Download link, or a PDF MediaObject.
 *
 * Each record: { id, title, format, route }. `route` comes from the real
 * canonicalPath()/categorySegment() (research-routing.ts), never a
 * hand-built "/research/{pillar}/{slug}/" string, so it can't drift from
 * the actual route the same way canonicalURL frontmatter once did.
 */
export function discoverResearch() {
	const papers = [];
	const nonPapers = [];
	for (const slug of readdirSync(CONTENT_DIR)) {
		const dir = join(CONTENT_DIR, slug);
		if (!statSync(dir).isDirectory()) continue;
		const mdPath = join(dir, 'index.md');
		const mdxPath = join(dir, 'index.mdx');
		const filePath = existsSync(mdPath) ? mdPath : existsSync(mdxPath) ? mdxPath : null;
		if (!filePath) continue;
		const { frontmatter } = parseFrontmatter(readFileSync(filePath, 'utf8'));
		const entry = { id: slug, data: { format: frontmatter.format, pillar: frontmatter.pillar } };
		const record = {
			id: slug,
			title: frontmatter.title,
			format: frontmatter.format,
			route: canonicalPath(entry),
		};
		if (frontmatter.format === 'paper') papers.push(record);
		else nonPapers.push(record);
	}
	return { papers, nonPapers };
}

/** Papers only — format: 'paper'. Same shape/order build-research-pdfs.mjs has always discovered. */
export function discoverPapers() {
	return discoverResearch().papers;
}

/** The complement — essays/memos today. Used for non-paper leak checks, never for PDF typesetting. */
export function discoverNonPapers() {
	return discoverResearch().nonPapers;
}

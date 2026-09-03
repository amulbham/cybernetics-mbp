#!/usr/bin/env node
// Sprint 8.6 — the Scholar/PDF identity validator (`npm run validate:pdfs`).
//
//   SOURCE IDENTITY -> HTML IDENTITY -> PDF IDENTITY -> PDF LINK STRUCTURE -> DEPLOY
//
// Runs after `npm run build:pdfs`, before `wrangler pages deploy`, in
// .github/workflows/deploy-pages.yml — the actual gate that makes a
// disagreement between a paper's HTML and its own PDF a build failure
// instead of something a human has to notice on Scholar months later.
//
// This automates exactly the *stable* rows Sprint 8.5's manual corpus QA
// established: identity (citation_pdf_url / MediaObject.contentUrl /
// Download href / JSON-LD article URL, all pointing at the one real
// route), size, same-directory file existence, Highwire tag *values* (not
// just presence), #ref-* citation reachability, and research-relation link
// URIs. It does NOT re-automate the visual rows (page-1 hierarchy, table
// rendering, primitive rendering, References start, last page, no
// cross-paper content contamination) — those stay a human raster check,
// per 8.5's own finding that pdftotext alone isn't trustworthy for tables,
// and nothing here changes that. See ROADMAP.md / CHANGELOG.md.
//
// Fails closed and reports every failure found, not just the first — this
// is a validator, not a builder; a maintainer fixing a broken deploy wants
// the whole list in one run, not one failure per re-run.

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { AUTHOR } from '../src/consts.ts';
import { discoverNonPapers, discoverPapers, SITE_ORIGIN } from './discover-research.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url)); // site/
const DIST = join(ROOT, 'dist');
const MAX_PDF_BYTES = 5 * 1024 * 1024; // 5 MB

const failures = [];
function fail(scope, message) {
	failures.push(`${scope}: ${message}`);
}

// ---------------------------------------------------------------------------
// HTML extraction — regex, not a DOM parser. Every shape read here is a
// single, deterministic element Astro's own templates emit (a self-closing
// <meta>, one <script type="application/ld+json"> block, one anchor with a
// known class or attribute) — the same targeted-regex approach
// absolutize-pdf-links.mjs already uses on this exact HTML, not a
// general-purpose HTML query engine this project has no other use for.
// ---------------------------------------------------------------------------

function decodeEntities(s) {
	return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

/** { citation_title: 'x', citation_author: 'y', ... } -> counts, so duplicates are visible, not silently overwritten. */
function extractCitationMeta(html) {
	const re = /<meta name="(citation_[a-z_]+)" content="([^"]*)"/g;
	const byName = new Map();
	let m;
	while ((m = re.exec(html))) {
		const [, name, content] = m;
		if (!byName.has(name)) byName.set(name, []);
		byName.get(name).push(decodeEntities(content));
	}
	return byName;
}

function extractJsonLdBlocks(html) {
	const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
	const blocks = [];
	let m;
	while ((m = re.exec(html))) {
		try {
			blocks.push(JSON.parse(m[1]));
		} catch {
			blocks.push(null);
		}
	}
	return blocks;
}

function findArticleJsonLd(blocks) {
	return blocks.find((b) => {
		const t = b?.['@type'];
		return t === 'Article' || (Array.isArray(t) && t.includes('Article'));
	});
}

function extractPdfLinkHref(html) {
	const m = /<p class="pdf-link"[^>]*>\s*<a href="([^"]*)"/.exec(html);
	return m ? m[1] : null;
}

/** Every href="#ref-N" -> the set of distinct N values reachable from the body, not a raw occurrence count. */
function extractRefNumbers(html) {
	const re = /href="#ref-(\d+)"/g;
	const nums = new Set();
	let m;
	while ((m = re.exec(html))) nums.add(Number(m[1]));
	return nums;
}

/** <a href="..." ... data-relation="...">, the exact attribute order rehype-research-links.mjs's wrapTextNode emits. */
function extractRelationLinks(html) {
	const re = /<a href="([^"]*)"[^>]*\sdata-relation="([^"]*)"/g;
	const links = [];
	let m;
	while ((m = re.exec(html))) links.push({ href: m[1], relationId: m[2] });
	return links;
}

// ---------------------------------------------------------------------------
// PDF extraction — pdfjs-dist, not a raw-bytes/compressed-stream grep. A
// PDF's link annotations commonly live inside compressed object streams
// (/ObjStm, /FlateDecode); a real parser is the only thing here that reads
// them correctly (see the Sprint 8.0 spike this project already learned
// that from the hard way).
// ---------------------------------------------------------------------------

/**
 * Parses one paper.pdf. Returns:
 *   { ok: true, pageCount, refNumbers: Set<number>, linkUris: Set<string> }
 *   { ok: false, error }
 *
 * refNumbers is the set of #ref-N destinations reachable via a Link
 * annotation's /Dest, read off its trailing "...ref-N" (Vivliostyle names
 * its internal destinations "viv-id-<the-full-source-URL-at-build-time>",
 * so only the suffix is meaningful — matching the whole string would
 * accidentally depend on the transient localhost origin used to typeset
 * it, a build-time artifact already documented as harmless in
 * CHANGELOG.md's Sprint 8.0 entry).
 *
 * linkUris is every external Link annotation's resolved URI (its /A /URI
 * action) — what a real Scholar crawler or a human clicking the PDF
 * actually follows, used for the relation-URI check.
 *
 * A single HTML <a href="#ref-N"> can legitimately produce more than one
 * PDF Link annotation with the same dest (a hyperlink that wraps across a
 * line break gets one rectangle per line) — confirmed directly against a
 * real corpus PDF before relying on it. Comparing the *set* of reachable
 * ref numbers, not raw annotation counts, is what's actually meaningful
 * for "citations lost" and is immune to that artifact.
 */
async function parsePdf(path) {
	let data;
	try {
		data = new Uint8Array(readFileSync(path));
	} catch (err) {
		return { ok: false, error: err.message };
	}
	let doc;
	try {
		doc = await getDocument({ data, isEvalSupported: false, verbosity: 0 }).promise;
	} catch (err) {
		return { ok: false, error: err.message };
	}
	const refNumbers = new Set();
	const linkUris = new Set();
	try {
		for (let i = 1; i <= doc.numPages; i++) {
			const page = await doc.getPage(i);
			const annots = await page.getAnnotations();
			for (const a of annots) {
				if (a.subtype !== 'Link') continue;
				if (typeof a.dest === 'string') {
					const m = /ref-(\d+)$/.exec(a.dest);
					if (m) refNumbers.add(Number(m[1]));
				}
				if (a.url) linkUris.add(a.url);
			}
		}
	} finally {
		doc.cleanup();
	}
	return { ok: true, pageCount: doc.numPages, refNumbers, linkUris };
}

// ---------------------------------------------------------------------------
// UTC YYYY/MM/DD, exactly the derivation ResearchLayout.astro uses for
// citation_publication_date — see that file's own comment for why UTC
// getters are load-bearing here (pubDate parses as UTC midnight; local
// getters would silently read back the previous day west of UTC).
// ---------------------------------------------------------------------------
function expectedCitationDate(pubDate) {
	return `${pubDate.getUTCFullYear()}/${String(pubDate.getUTCMonth() + 1).padStart(2, '0')}/${String(pubDate.getUTCDate()).padStart(2, '0')}`;
}

function stripDoiPrefix(doi) {
	return doi?.replace(/^https?:\/\/doi\.org\//, '');
}

// ---------------------------------------------------------------------------
// Per-paper checks
// ---------------------------------------------------------------------------

async function validatePaper(paper, frontmatter) {
	const scope = paper.id;

	// Manifest entry + route: a malformed source (no pillar, no title) shows
	// up here directly rather than as a confusing downstream 404.
	if (!paper.title || !/^\/research\/[^/]+\/[^/]+\/$/.test(paper.route) || paper.route.includes('undefined')) {
		fail(scope, `invalid source — title=${JSON.stringify(paper.title)} route=${JSON.stringify(paper.route)}`);
		return; // nothing downstream can be trusted without a real route
	}

	const pageDir = join(DIST, paper.route);
	const htmlPath = join(pageDir, 'index.html');
	const pdfPath = join(pageDir, 'paper.pdf');
	const expectedHtmlUrl = `${SITE_ORIGIN}${paper.route}`;
	const expectedPdfUrl = `${expectedHtmlUrl}paper.pdf`;

	if (!existsSync(htmlPath)) {
		fail(scope, `index.html missing at ${htmlPath}`);
		return;
	}
	if (!existsSync(pdfPath)) {
		fail(scope, `paper.pdf missing at ${pdfPath} (expected same directory as index.html)`);
		return;
	}

	const pdfSize = statSync(pdfPath).size;
	if (!(pdfSize > 0 && pdfSize < MAX_PDF_BYTES)) {
		fail(scope, `paper.pdf size ${pdfSize} bytes — must be > 0 and < ${MAX_PDF_BYTES} bytes`);
	}

	const parsed = await parsePdf(pdfPath);
	if (!parsed.ok) {
		fail(scope, `paper.pdf does not parse: ${parsed.error}`);
		return; // no PDF-side checks possible without a parse
	}
	if (!(parsed.pageCount >= 1)) {
		fail(scope, `paper.pdf parsed but has ${parsed.pageCount} pages`);
	}

	const html = readFileSync(htmlPath, 'utf8');
	const meta = extractCitationMeta(html);
	const CORE_TAGS = ['citation_title', 'citation_author', 'citation_publication_date', 'citation_pdf_url'];
	for (const tag of CORE_TAGS) {
		const values = meta.get(tag) ?? [];
		if (values.length !== 1) {
			fail(scope, `${tag} appears ${values.length} time(s), expected exactly 1`);
		}
	}

	const citationTitle = meta.get('citation_title')?.[0];
	if (citationTitle !== undefined && citationTitle !== frontmatter.title) {
		fail(scope, `citation_title "${citationTitle}" !== frontmatter title "${frontmatter.title}"`);
	}

	const citationDate = meta.get('citation_publication_date')?.[0];
	const expectedDate = expectedCitationDate(frontmatter.pubDate);
	if (citationDate !== undefined && citationDate !== expectedDate) {
		fail(scope, `citation_publication_date "${citationDate}" !== expected "${expectedDate}" (UTC from pubDate)`);
	}

	const citationDoi = meta.get('citation_doi')?.[0];
	const expectedDoi = stripDoiPrefix(frontmatter.doi);
	if (expectedDoi) {
		if (citationDoi !== expectedDoi) {
			fail(scope, `citation_doi "${citationDoi}" !== expected "${expectedDoi}" (stripped frontmatter doi)`);
		}
	} else if (citationDoi !== undefined) {
		fail(scope, `citation_doi "${citationDoi}" present but frontmatter has no doi`);
	}

	const citationAuthors = meta.get('citation_author') ?? [];
	if (citationAuthors.length !== 1) {
		fail(scope, `citation_author appears ${citationAuthors.length} time(s), expected exactly 1`);
	} else if (citationAuthors[0] !== AUTHOR.name) {
		fail(scope, `citation_author "${citationAuthors[0]}" !== AUTHOR.name "${AUTHOR.name}"`);
	}

	const citationPdfUrl = meta.get('citation_pdf_url')?.[0];
	if (citationPdfUrl !== undefined && citationPdfUrl !== expectedPdfUrl) {
		fail(scope, `citation_pdf_url "${citationPdfUrl}" !== expected "${expectedPdfUrl}"`);
	}

	const jsonLdBlocks = extractJsonLdBlocks(html);
	const article = findArticleJsonLd(jsonLdBlocks);
	if (!article) {
		fail(scope, 'no Article/ScholarlyArticle JSON-LD block found');
	} else {
		const mediaContentUrl = article.encoding?.contentUrl;
		if (mediaContentUrl !== expectedPdfUrl) {
			fail(scope, `JSON-LD MediaObject.contentUrl "${mediaContentUrl}" !== expected "${expectedPdfUrl}"`);
		}
		if (article.url !== expectedHtmlUrl) {
			fail(scope, `JSON-LD article url "${article.url}" !== expected "${expectedHtmlUrl}"`);
		}
		if (article.mainEntityOfPage?.['@id'] !== expectedHtmlUrl) {
			fail(scope, `JSON-LD mainEntityOfPage.@id "${article.mainEntityOfPage?.['@id']}" !== expected "${expectedHtmlUrl}"`);
		}
	}

	const pdfLinkHref = extractPdfLinkHref(html);
	if (pdfLinkHref !== expectedPdfUrl) {
		fail(scope, `.pdf-link href "${pdfLinkHref}" !== expected "${expectedPdfUrl}"`);
	}

	// #ref-* citation reachability: the HTML's reachable set must equal the
	// PDF's reachable set — see parsePdf()'s own comment for why this is a
	// set comparison, not a raw count comparison.
	const htmlRefNumbers = extractRefNumbers(html);
	if (htmlRefNumbers.size > 0 || parsed.refNumbers.size > 0) {
		const missingInPdf = [...htmlRefNumbers].filter((n) => !parsed.refNumbers.has(n));
		const extraInPdf = [...parsed.refNumbers].filter((n) => !htmlRefNumbers.has(n));
		if (missingInPdf.length > 0) {
			fail(scope, `#ref-* citations lost in PDF: HTML links to ref-${missingInPdf.sort((a, b) => a - b).join(', ref-')} but the PDF has no reachable destination for them`);
		}
		if (extraInPdf.length > 0) {
			fail(scope, `PDF has ref-* destinations with no matching HTML citation: ref-${extraInPdf.sort((a, b) => a - b).join(', ref-')}`);
		}
	}

	// Research-relation links: every a[data-relation] href, resolved to an
	// absolute URI, must be reachable as a real Link annotation URI inside
	// this paper's own PDF. Generic over every relation row that ever lands
	// on a page with a PDF — nothing here names Three SOS specifically; it
	// is simply the one live row today.
	for (const link of extractRelationLinks(html)) {
		const expectedUri = link.href.startsWith('/') ? `${SITE_ORIGIN}${link.href}` : link.href;
		if (!parsed.linkUris.has(expectedUri)) {
			fail(
				scope,
				`research-relation link (data-relation="${link.relationId}") not found as a PDF link-annotation URI — expected "${expectedUri}"`,
			);
		}
	}
}

// ---------------------------------------------------------------------------
// Non-paper leak checks — the complement. Essays/memos must carry none of
// this: no paper.pdf, no citation_* tags, no Download link, no PDF
// MediaObject in JSON-LD.
// ---------------------------------------------------------------------------

function validateNonPaper(entry) {
	const scope = entry.id;
	const pageDir = join(DIST, entry.route);
	const htmlPath = join(pageDir, 'index.html');
	const pdfPath = join(pageDir, 'paper.pdf');

	if (!existsSync(htmlPath)) {
		fail(scope, `index.html missing at ${htmlPath}`);
		return;
	}
	if (existsSync(pdfPath)) {
		fail(scope, `paper.pdf exists at ${pdfPath} — ${entry.format} entries must never get one`);
	}

	const html = readFileSync(htmlPath, 'utf8');
	const meta = extractCitationMeta(html);
	if (meta.size > 0) {
		fail(scope, `citation_* tags present on a non-paper entry: ${[...meta.keys()].join(', ')}`);
	}
	if (extractPdfLinkHref(html) !== null || /Download PDF/.test(html)) {
		fail(scope, 'a Download PDF link leaked into a non-paper entry');
	}
	const article = findArticleJsonLd(extractJsonLdBlocks(html));
	if (article?.encoding?.['@type'] === 'MediaObject') {
		fail(scope, 'JSON-LD MediaObject present on a non-paper entry');
	}
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
	if (!existsSync(DIST)) {
		console.error('validate-research-pdfs: dist/ does not exist — run `npm run build` then `npm run build:pdfs` first.');
		process.exit(1);
	}

	const papers = discoverPapers();
	const nonPapers = discoverNonPapers();

	let pdfsFound = 0;
	for (const paper of papers) {
		const pdfPath = join(DIST, paper.route, 'paper.pdf');
		if (existsSync(pdfPath)) pdfsFound++;
		const { frontmatter } = readFrontmatterFor(paper.id);
		await validatePaper(paper, frontmatter);
	}

	for (const entry of nonPapers) {
		validateNonPaper(entry);
	}

	if (failures.length > 0) {
		console.error(`validate-research-pdfs: ${failures.length} check(s) failed:\n`);
		for (const f of failures) console.error(`  - ${f}`);
		console.error(`\npapers: ${papers.length} / pdfs: ${pdfsFound} / FAILED`);
		process.exit(1);
	}

	console.log(`papers: ${papers.length} / pdfs: ${pdfsFound} / ok`);
}

// Re-reads one entry's frontmatter directly — discoverPapers() already did
// this once to build the manifest, but doesn't hand back doi/pubDate (only
// what routing needs). Re-parsing here (cheap: a handful of small files)
// keeps discover-research.mjs's own return shape focused on what routing
// needs, rather than growing it into a second, wider content schema this
// validator is the only caller of.
function readFrontmatterFor(slug) {
	const dir = join(ROOT, 'src', 'content', 'research', slug);
	const mdPath = join(dir, 'index.md');
	const mdxPath = join(dir, 'index.mdx');
	const filePath = existsSync(mdPath) ? mdPath : mdxPath;
	return parseFrontmatter(readFileSync(filePath, 'utf8'));
}

main().catch((err) => {
	console.error(err.stack || err.message || err);
	process.exit(1);
});

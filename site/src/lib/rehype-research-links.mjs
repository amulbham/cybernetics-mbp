import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { canonicalPath } from './research-routing.ts';
import { relationsSchema } from './research-relations.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RELATIONS_PATH = join(__dirname, '../data/research-relations.json');
const CONTENT_ROOT = join(__dirname, '../content/research');

// Matches the source-collection-id shape this plugin is allowed to act on:
// .../src/content/research/<id>/index.md or .../index.mdx. Anything else
// (a different collection, a non-content file) is a silent no-op — this
// plugin only ever touches pages inside the research collection.
const SOURCE_PATH_RE = /\/src\/content\/research\/([^/]+)\/index\.mdx?$/;

const HEADING_RE = /^h([1-6])$/;

// Tags whose text can never be wrapped, regardless of the accepted row.
// `a` is handled separately (see resolveMatch) since "already linked" is a
// no-op, not a blanket exclusion the way these are.
const OTHER_INELIGIBLE_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'pre', 'code', 'aside']);

function headingLevel(tagName) {
	const m = HEADING_RE.exec(tagName);
	return m ? Number(m[1]) : null;
}

function classList(node) {
	const c = node.properties?.className;
	if (Array.isArray(c)) return c;
	if (typeof c === 'string') return c.split(/\s+/);
	return [];
}

/** Tags/attributes that make a node's text off-limits for this plugin, other than `a` itself. */
function isOtherIneligible(node) {
	if (node.type !== 'element') return false;
	if (OTHER_INELIGIBLE_TAGS.has(node.tagName)) return true;
	const classes = classList(node);
	if (classes.some((c) => c === 'markdown-alert' || c.startsWith('markdown-alert-'))) return true;
	if (node.tagName === 'section' && classes.includes('references')) return true;
	if (node.tagName === 'figcaption') return true;
	if (typeof node.properties?.id === 'string' && /^ref-\d+$/.test(node.properties.id)) return true;
	return false;
}

/**
 * Loads and validates src/data/research-relations.json once per build
 * (called at pipeline-setup time, inside the plugin factory — not lazily
 * per file — so a malformed registry fails the build immediately rather
 * than on whichever page happens to trigger it first).
 */
function loadAcceptedRelations() {
	const raw = JSON.parse(readFileSync(RELATIONS_PATH, 'utf8'));
	const result = relationsSchema.safeParse(raw);
	if (!result.success) {
		throw new Error(
			`rehype-research-links: research-relations.json failed schema validation: ${JSON.stringify(result.error.issues)}`,
		);
	}
	return result.data.filter((row) => row.inline?.status === 'accepted');
}

/**
 * Resolves a relation target's href via the real canonicalPath() —
 * never a hand-built /research/{pillar}/{id}/ string. Reads the target
 * entry's own frontmatter directly (the same parser Astro's own content
 * pipeline uses) rather than importing it through `astro:content`, which
 * is a Vite virtual module and is not resolvable from here: this plugin
 * runs inside Astro's markdown processor, a plain Node ESM context that
 * predates Vite's module graph for the page being rendered — confirmed by
 * a real build failure ("Only URLs with a scheme in: file, data, and node
 * are supported") when `getEntry` was tried directly, exactly as the 7.5
 * spec originally called for.
 */
function resolveTargetHref(targetId, hrefCache) {
	if (hrefCache.has(targetId)) return hrefCache.get(targetId);
	const mdPath = join(CONTENT_ROOT, targetId, 'index.md');
	const mdxPath = join(CONTENT_ROOT, targetId, 'index.mdx');
	const filePath = existsSync(mdPath) ? mdPath : existsSync(mdxPath) ? mdxPath : null;
	if (!filePath) {
		throw new Error(`rehype-research-links: relation target "${targetId}" has no matching research entry`);
	}
	const { frontmatter } = parseFrontmatter(readFileSync(filePath, 'utf8'));
	// Shaped exactly like the CollectionEntry canonicalPath() expects —
	// only the two fields categorySegment() actually reads.
	const entry = { id: targetId, data: { format: frontmatter.format, pillar: frontmatter.pillar } };
	const href = canonicalPath(entry);
	hrefCache.set(targetId, href);
	return href;
}

/**
 * Finds the heading whose id === `near`, and the sibling range from just
 * after it up to (not including) the next heading of the same or higher
 * level — searched anywhere in the tree, not just the root, so this stays
 * correct if a future `near` target is ever nested. Returns null if no
 * heading with that id exists anywhere.
 */
function findRegion(root, near) {
	let found = null;
	(function walk(nodes) {
		if (found) return;
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			const level = node.type === 'element' ? headingLevel(node.tagName) : null;
			if (level !== null && node.properties?.id === near) {
				let end = nodes.length;
				for (let j = i + 1; j < nodes.length; j++) {
					const sibLevel = nodes[j].type === 'element' ? headingLevel(nodes[j].tagName) : null;
					if (sibLevel !== null && sibLevel <= level) {
						end = j;
						break;
					}
				}
				found = { parentArray: nodes, start: i + 1, end };
				return;
			}
			if (node.type === 'element' && Array.isArray(node.children)) walk(node.children);
			if (found) return;
		}
	})(root.children);
	return found;
}

/**
 * Walks a region (a [start, end) slice of a live children array, plus
 * full recursion into nested arrays) collecting every text node whose
 * `.value` contains the anchor wholly as one piece. Classifies each match
 * by its nearest relevant ancestor: excluded outright (heading/table/pre/
 * code/aside/alert/references/a ref-N element/figcaption — never counted at all),
 * already inside an `<a>` (recorded with that link's href), or eligible
 * (a genuine wrap candidate). Never reconstructs a match across sibling
 * nodes — a phrase split by inline markup simply produces zero matches
 * here, which surfaces as the same "0 eligible" build failure as a
 * genuinely absent anchor.
 */
function collectMatches(nodesArray, start, end, anchor, insideA, matches) {
	for (let i = start; i < end; i++) {
		const node = nodesArray[i];
		if (node.type === 'text') {
			if (node.value.includes(anchor)) {
				if (insideA) {
					matches.push({ kind: 'in-a', href: insideA });
				} else {
					matches.push({ kind: 'eligible', parentArray: nodesArray, index: i, node });
				}
			}
			continue;
		}
		if (node.type === 'element' && Array.isArray(node.children)) {
			if (isOtherIneligible(node)) continue; // excluded outright, not counted at all
			const nextInsideA = node.tagName === 'a' ? node.properties?.href ?? '' : insideA;
			collectMatches(node.children, 0, node.children.length, anchor, nextInsideA, matches);
		}
	}
}

/** Splits a text node into [before, <a>match</a>, after], omitting empty pieces. */
function wrapTextNode(node, anchor, href, relationId) {
	const idx = node.value.indexOf(anchor);
	const before = node.value.slice(0, idx);
	const after = node.value.slice(idx + anchor.length);
	const out = [];
	if (before) out.push({ type: 'text', value: before });
	out.push({
		type: 'element',
		tagName: 'a',
		properties: { href, 'data-relation': relationId },
		children: [{ type: 'text', value: anchor }],
	});
	if (after) out.push({ type: 'text', value: after });
	return out;
}

/**
 * Applies one accepted relation row to a source page's tree. Fails closed
 * on every ambiguity — this plugin renders the one placement decision
 * already recorded in research-relations.json, it does not make one:
 *
 *  - No heading with id === row.inline.near anywhere in the page → fail.
 *  - The anchor string doesn't occur wholly inside exactly one eligible
 *    text node in that heading's region (0, or split across nodes) → fail.
 *  - The anchor occurs in more than one eligible place → fail (ambiguous).
 *  - The anchor is already wrapped in an <a> to the same href → no-op,
 *    the authored/already-applied link wins.
 *  - The anchor is already wrapped in an <a> to a different href → fail.
 */
function applyRow(tree, row, hrefCache) {
	const { near, anchor } = row.inline;
	const region = findRegion(tree, near);
	if (!region) {
		throw new Error(`rehype-research-links: relation "${row.id}" — no heading with id "${near}" found`);
	}

	const matches = [];
	collectMatches(region.parentArray, region.start, region.end, anchor, null, matches);

	if (matches.length === 0) {
		throw new Error(
			`rehype-research-links: relation "${row.id}" — anchor "${anchor}" not found as one whole, eligible text node in section "${near}" (absent, or split across markup)`,
		);
	}
	if (matches.length > 1) {
		throw new Error(
			`rehype-research-links: relation "${row.id}" — anchor "${anchor}" occurs ${matches.length} times in section "${near}"; must be exactly one`,
		);
	}

	const match = matches[0];
	const href = resolveTargetHref(row.target, hrefCache);

	if (match.kind === 'in-a') {
		if (match.href === href) return; // authored/already-applied link wins — no-op
		throw new Error(
			`rehype-research-links: relation "${row.id}" — anchor "${anchor}" is already inside a link to a different href ("${match.href}")`,
		);
	}

	const replacement = wrapTextNode(match.node, anchor, href, row.id);
	match.parentArray.splice(match.index, 1, ...replacement);
}

/**
 * Renders exactly the one editorial decision already recorded in
 * src/data/research-relations.json — it does not discover, score, or
 * choose relations itself. For the current file's own collection id
 * (derived from its path, see SOURCE_PATH_RE), applies every accepted
 * row whose `source` matches; every other row is ignored for this file.
 * A page with zero accepted rows for it is untouched (its HTML is
 * byte-identical to before this plugin existed).
 *
 * Must run after rehypeCitationLinks (so it never fights the citation
 * linker over the same text) and after rehypeHeadingIds (so `near` can
 * already be resolved against real heading ids — see astro.config.mjs).
 */
export function rehypeResearchLinks() {
	const acceptedRows = loadAcceptedRelations();
	const hrefCache = new Map();

	return (tree, file) => {
		if (acceptedRows.length === 0) return;
		const normalizedPath = (file.path ?? '').replace(/\\/g, '/');
		const sourceMatch = SOURCE_PATH_RE.exec(normalizedPath);
		if (!sourceMatch) return; // not a research-collection entry — no-op
		const sourceId = sourceMatch[1];

		for (const row of acceptedRows) {
			if (row.source !== sourceId) continue; // a different page's relation — ignore here
			applyRow(tree, row, hrefCache);
		}
	};
}

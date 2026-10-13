import type { CollectionEntry } from 'astro:content';
import { categoryLabel, isCategorySlug } from './categories';

/** The only two fields every routing helper reads. A `CollectionEntry<'research'>` satisfies it; so does the shape `routingEntryFromFrontmatter()` builds for plain-Node scripts. */
export interface RoutableEntry {
	id: string;
	data: { category: string };
}

/**
 * The URL category segment for a research entry: its authored `category`
 * (T19.0 — formerly a paper's `pillar`, or the pluralized `format`). Single
 * source of truth for this derivation — used by the [category] route,
 * ResearchLayout's canonicalURL, the OG image route, and the index pages —
 * so it can't drift out of sync the way a hand-duplicated canonicalURL
 * frontmatter field once did (see AGENTS.md). Category is editorial
 * placement only; `format` alone decides whether an entry gets a PDF.
 */
export function categorySegment(entry: RoutableEntry): string {
	return entry.data.category;
}

export function canonicalPath(entry: RoutableEntry): string {
	return `/research/${categorySegment(entry)}/${entry.id}/`;
}

/** A category landing page, e.g. `/research/essays/`. Takes a segment, not an entry. */
export function categoryPath(segment: string): string {
	return `/research/${segment}/`;
}

/** The Open Graph image route for an entry. Same segment/id as the HTML route. */
export function ogImagePath(entry: RoutableEntry): string {
	return `/open-graph/${categorySegment(entry)}/${entry.id}.png`;
}

/**
 * Builds the routing entry for scripts and rehype plugins that read raw
 * frontmatter in a plain-Node context (no `astro:content`). Throws on a
 * retired `pillar` key or a missing/unknown `category`, so a bad file can
 * never produce an `undefined` route silently. `format` is passed through
 * for callers that need it.
 */
export function routingEntryFromFrontmatter(
	id: string,
	frontmatter: Record<string, unknown>,
): { id: string; data: { format: string; category: string } } {
	if ('pillar' in frontmatter) {
		throw new Error(`research entry "${id}": frontmatter key "pillar" is retired — use "category"`);
	}
	if (!isCategorySlug(frontmatter.category)) {
		throw new Error(
			`research entry "${id}": category ${JSON.stringify(frontmatter.category)} is missing or not one of the registered categories`,
		);
	}
	return { id, data: { format: String(frontmatter.format), category: frontmatter.category } };
}

/**
 * Physical filename of a paper's one PDF. The slug is the research entry
 * id — the same identity canonicalPath() already uses — not a slug derived
 * from the display title. T18.1.
 */
export function paperPdfFilename(id: string): string {
	return `${id}.pdf`;
}

/** Legacy path segment. Not a second file. T18.1 serves it as a 301. */
export const LEGACY_PAPER_PDF_FILENAME = 'paper.pdf';

/** One explicit Cloudflare Pages redirect line: `{route}paper.pdf` → `{route}{id}.pdf` 301. `route` is canonicalPath() and includes the trailing slash. */
export function legacyPaperPdfRedirect(route: string, id: string): string {
	return `${route}${LEGACY_PAPER_PDF_FILENAME} ${route}${paperPdfFilename(id)} 301`;
}

/**
 * T13.1's frozen route contract: an IWL's canonical route derives from its
 * resolved parent Article's own canonicalPath() — never authored, and not
 * independently stable (if the parent's category or slug changes, this
 * route moves with it, which is the subordinate-identity contract, not
 * drift). Extends this routing authority rather than duplicating it, same
 * discipline this file's own header comment establishes for canonicalPath.
 */
export function iwlPath(parent: RoutableEntry): string {
	return `${canonicalPath(parent)}iwl/`;
}

/** Human-readable label for a category *segment* (not an entry) — "Knowledge Work" for a category slug, "Memos" for the route-only memos page. Throws on an unknown segment. */
export function categoryLabelFromSegment(category: string): string {
	return categoryLabel(category);
}

const FORMAT_LABELS: Record<CollectionEntry<'research'>['data']['format'], string> = {
	paper: 'Paper',
	essay: 'Essay',
	memo: 'Memo',
};

/** Singular label for a `format` value — "Paper"/"Essay"/"Memo" — used by the article masthead. */
export function formatLabel(format: CollectionEntry<'research'>['data']['format']): string {
	return FORMAT_LABELS[format];
}

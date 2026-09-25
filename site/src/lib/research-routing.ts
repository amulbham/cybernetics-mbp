import type { CollectionEntry } from 'astro:content';
import { formatPillarLabel } from './pillars';

/**
 * The URL category segment for a research entry: a paper's pillar
 * (e.g. "policy-systems"), or the pluralized format for anything else
 * ("essays", "memos"). Single source of truth for this derivation — used by
 * the [category] route, ResearchLayout's canonicalURL, the OG image route,
 * and both index pages — so it can't drift out of sync the way a
 * hand-duplicated canonicalURL frontmatter field once did (see AGENTS.md).
 */
export function categorySegment(entry: CollectionEntry<'research'>): string {
	return entry.data.format === 'paper' ? entry.data.pillar! : `${entry.data.format}s`;
}

export function canonicalPath(entry: CollectionEntry<'research'>): string {
	return `/research/${categorySegment(entry)}/${entry.id}/`;
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
export function iwlPath(parent: CollectionEntry<'research'>): string {
	return `${canonicalPath(parent)}iwl/`;
}

const FORMAT_PLURAL_LABELS: Record<string, string> = { essays: 'Essays', memos: 'Memos' };

/** Human-readable label for a category *segment* (not an entry) — "Policy Systems" for a pillar slug, "Essays"/"Memos" for those. */
export function categoryLabelFromSegment(category: string): string {
	return FORMAT_PLURAL_LABELS[category] ?? formatPillarLabel(category);
}

const FORMAT_LABELS: Record<CollectionEntry<'research'>['data']['format'], string> = {
	paper: 'Paper',
	essay: 'Essay',
	memo: 'Memo',
};

/** Singular label for a `format` value — "Paper"/"Essay"/"Memo" — used on badges that mix formats (homepage, tag pages). */
export function formatLabel(format: CollectionEntry<'research'>['data']['format']): string {
	return FORMAT_LABELS[format];
}

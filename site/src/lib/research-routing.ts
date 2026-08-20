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
	return `/research-hub/${categorySegment(entry)}/${entry.id}/`;
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

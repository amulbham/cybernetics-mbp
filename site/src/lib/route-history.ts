import { isCategorySlug } from './categories';
import {
	LEGACY_PAPER_PDF_FILENAME,
	canonicalPath,
	categoryPath,
	iwlPath,
	ogImagePath,
	paperPdfFilename,
	type RoutableEntry,
} from './research-routing';

/**
 * Historical public route and artifact commitments (T19.0) — the one place
 * that remembers where an entry has been publicly served, so a retired URL
 * can be a direct 301 instead of a 404.
 *
 * What this file is NOT: it holds no *current* truth. The current category,
 * `format`, and IWL relationship stay authoritative in entry frontmatter and
 * the `iwl` collection; every current target below is derived from them with
 * the canonical routing helpers. Rows are checked *against* generated
 * artifacts by `scripts/validate-research-pdfs.mjs`, never used to override
 * them.
 *
 * Append-only by governance. A row is added when an entry first ships to
 * production, and a category is appended when the entry later moves — never
 * removed. The generator and the validator both read this file, so they
 * cannot by themselves detect a deleted row; that is caught by comparing the
 * generated `_redirects` to the independently frozen migration matrix in
 * `planning/audits/T19.0-taxonomy-migration-evidence.md` (see T19.0,
 * "Matrix handling and independent oracle").
 *
 * Plain-Node compatible: loaded by the Astro layer and by tsx-run scripts.
 */
export interface RouteHistoryRow {
	/** Research entry id (its `src/content/research/` folder name). */
	readonly id: string;
	/** Every category segment under which the entry has been, or by T19.0 will be, publicly addressable. Includes retired ones. */
	readonly categories: readonly string[];
	/** A public scholarly PDF at `{id}.pdf` (and the legacy `paper.pdf` URL) has been promised. */
	readonly pdf: boolean;
	/** A public companion IWL route has been promised. */
	readonly iwl: boolean;
}

export const ROUTE_HISTORY: readonly RouteHistoryRow[] = [
	{ id: 'the-invariants-of-self-organizing-systems', categories: ['cybernetics'], pdf: true, iwl: false },
	{ id: 'three-self-organizing-systems', categories: ['cybernetics'], pdf: true, iwl: false },
	{
		id: 'the-chisel-fallacy-what-pangram-actually-measures',
		categories: ['ai-systems', 'knowledge-work'],
		pdf: true,
		iwl: true,
	},
	{
		id: 'an-engineers-guide-to-structural-financial-aid-exploits',
		categories: ['policy-systems', 'essays'],
		pdf: true,
		iwl: false,
	},
	{ id: 'how-frontier-model-training-became-a-public-utility', categories: ['essays'], pdf: false, iwl: false },
	{ id: 'the-desk-is-where-you-write-it-down', categories: ['knowledge-work'], pdf: true, iwl: false },
];

/** Category landing pages retired by T19.0, and where each now redirects. A retired segment is never a current category. */
export const RETIRED_CATEGORY_REDIRECTS: Readonly<Record<string, string>> = {
	'policy-systems': '/research/essays/',
	'seo-architecture': '/research/',
	'systems-architecture': '/research/',
};

/** What the generator needs to know about each live entry: read from frontmatter, never from the history. */
export interface CurrentEntry {
	id: string;
	format: string;
	category: string;
}

export interface RedirectRule {
	from: string;
	to: string;
}

function asEntry(id: string, category: string): RoutableEntry {
	return { id, data: { category } };
}

/**
 * The complete single-hop redirect set for the current corpus:
 *   1. for every current `format: paper` entry, the T18.1 legacy
 *      `{currentRoute}paper.pdf` → `{currentRoute}{id}.pdf`;
 *   2. for every history row, every category other than the entry's current
 *      one: the Article (with and without trailing slash), the IWL when
 *      promised (both slash forms), `{id}.pdf` and legacy `paper.pdf` when
 *      promised, and the OG image — each straight to its *current* URL;
 *   3. each retired category landing page, both slash forms.
 * Throws if the set contains a conflict, a self-redirect, or a chain, so
 * "direct, single hop" is a property of the generator, not a hope.
 */
export function redirectRules(
	entries: readonly CurrentEntry[],
	history: readonly RouteHistoryRow[] = ROUTE_HISTORY,
	retired: Readonly<Record<string, string>> = RETIRED_CATEGORY_REDIRECTS,
): RedirectRule[] {
	const rules: RedirectRule[] = [];
	const byId = new Map(entries.map((entry) => [entry.id, entry]));

	for (const entry of entries) {
		if (entry.format !== 'paper') continue;
		const route = canonicalPath(asEntry(entry.id, entry.category));
		rules.push({ from: `${route}${LEGACY_PAPER_PDF_FILENAME}`, to: `${route}${paperPdfFilename(entry.id)}` });
	}

	for (const row of history) {
		const entry = byId.get(row.id);
		if (!entry) throw new Error(`route-history: row "${row.id}" has no matching research entry`);
		const current = asEntry(entry.id, entry.category);
		const route = canonicalPath(current);
		for (const category of row.categories) {
			if (category === entry.category) continue;
			const old = asEntry(row.id, category);
			const oldRoute = canonicalPath(old);
			rules.push({ from: oldRoute, to: route });
			rules.push({ from: oldRoute.slice(0, -1), to: route });
			if (row.iwl) {
				rules.push({ from: iwlPath(old), to: iwlPath(current) });
				rules.push({ from: iwlPath(old).slice(0, -1), to: iwlPath(current) });
			}
			if (row.pdf) {
				const destination = `${route}${paperPdfFilename(row.id)}`;
				rules.push({ from: `${oldRoute}${paperPdfFilename(row.id)}`, to: destination });
				rules.push({ from: `${oldRoute}${LEGACY_PAPER_PDF_FILENAME}`, to: destination });
			}
			rules.push({ from: ogImagePath(old), to: ogImagePath(current) });
		}
	}

	for (const [slug, target] of Object.entries(retired)) {
		if (isCategorySlug(slug)) throw new Error(`route-history: "${slug}" is a live category and cannot be a retired redirect`);
		rules.push({ from: categoryPath(slug), to: target });
		rules.push({ from: categoryPath(slug).slice(0, -1), to: target });
	}

	return assertDirect(rules);
}

/** Deduplicates identical rules; throws on conflicting destinations, a self-redirect, or a chain (a destination that is itself a redirect source). Returns the rules sorted by source. */
function assertDirect(rules: RedirectRule[]): RedirectRule[] {
	const bySource = new Map<string, string>();
	for (const { from, to } of rules) {
		if (from === to) throw new Error(`route-history: self-redirect ${from}`);
		const existing = bySource.get(from);
		if (existing !== undefined && existing !== to) {
			throw new Error(`route-history: conflicting redirects for ${from}: ${existing} vs ${to}`);
		}
		bySource.set(from, to);
	}
	for (const [from, to] of bySource) {
		if (bySource.has(to)) throw new Error(`route-history: redirect chain ${from} -> ${to} -> ${bySource.get(to)}`);
	}
	return [...bySource.entries()].map(([from, to]) => ({ from, to })).sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0));
}

/** The exact `_redirects` lines (`{from} {to} 301`), sorted. */
export function renderRedirectLines(rules: readonly RedirectRule[]): string[] {
	return rules.map(({ from, to }) => `${from} ${to} 301`);
}

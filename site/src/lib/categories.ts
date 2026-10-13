/**
 * The one definition of the editorial categories (T19.0). Every consumer —
 * the content schema's enum, the homepage grid, the footer, the About cards,
 * the category landing pages, labels, descriptions, and the RelatedResearch
 * bonus rule — reads this list, so a category cannot be added, renamed or
 * retired in one place and silently drift in another.
 *
 * Plain-Node compatible (no `astro:content` import): it is loaded both by the
 * Astro/Vite layer and by tsx-run validators and build scripts.
 *
 * A category is *editorial placement* only. Whether an entry carries a
 * scholarly PDF is decided by `format: paper`, never by category.
 *
 * Color for a category is the CSS custom property `--pillar-{slug}`
 * (global.css, print-research.css); the token prefix predates this registry
 * and was deliberately not renamed (T19.0 exclusions).
 */
export const CATEGORIES = [
	{
		slug: 'cybernetics',
		label: 'Cybernetics',
		description:
			'Feedback, control, and self-organization — the structural conditions under which systems, biological, computational, or social, maintain order without external coordination. Includes the Cognitive Physics framework developed here.',
		// Whether sharing this category earns a RelatedResearch score bonus.
		// `essays` is an editorial catch-all (scholarly and commentary work
		// side by side), not a topical cluster, so it earns none.
		relatedBonus: true,
	},
	{
		slug: 'knowledge-work',
		label: 'Knowledge Work',
		description:
			'How ideas are discovered, developed, and made durable — research on cognition, authorship, and the institutions that shape knowledge work.',
		relatedBonus: true,
	},
	{
		slug: 'ai-systems',
		label: 'AI Systems',
		description:
			'Applied research on production AI systems — agent architectures, retrieval, and the operational tradeoffs of running language models at scale.',
		relatedBonus: true,
	},
	{
		slug: 'essays',
		label: 'Essays',
		description: 'Long-form analytical writing — thesis-driven prose on how systems and incentives actually behave.',
		relatedBonus: false,
	},
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

/** Tuple form for `z.enum()`. */
export const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug) as [CategorySlug, ...CategorySlug[]];

/**
 * Route-only landing pages: they always build (with an empty state) but are
 * not `category` values and are not in navigation. `/research/memos/` has
 * always existed publicly; a future memo's placement is its own decision.
 */
export const ROUTE_ONLY_CATEGORIES = [
	{
		slug: 'memos',
		label: 'Memos',
		description: 'Shorter, high-conviction notes — quicker reads than a full essay or paper.',
	},
] as const;

export function isCategorySlug(value: unknown): value is CategorySlug {
	return typeof value === 'string' && (CATEGORY_SLUGS as readonly string[]).includes(value);
}

function findRoute(segment: string): { label: string; description: string } {
	const found = [...CATEGORIES, ...ROUTE_ONLY_CATEGORIES].find((category) => category.slug === segment);
	if (!found) throw new Error(`categories: "${segment}" is not a category or route-only landing page`);
	return found;
}

/** Label for a category slug or route-only segment. Throws on anything else — never guesses a label. */
export function categoryLabel(segment: string): string {
	return findRoute(segment).label;
}

export function categoryDescription(segment: string): string {
	return findRoute(segment).description;
}

/** Whether two entries sharing this category should score a RelatedResearch bonus. */
export function categoryEarnsRelatedBonus(category: string): boolean {
	return CATEGORIES.find((entry) => entry.slug === category)?.relatedBonus ?? false;
}

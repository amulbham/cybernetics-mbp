import { type CollectionEntry, getCollection, getEntry } from 'astro:content';

export interface ResolvedIwl {
	entry: CollectionEntry<'iwl'>;
	parent: CollectionEntry<'research'>;
}

interface IwlRegistry {
	/** Every IWL source, every publication state — the complete collection. */
	all: ResolvedIwl[];
	/** The subset with `publicationState: 'published'` — the only ones a public route may exist for. */
	published: ResolvedIwl[];
	/** Published IWL keyed by its resolved parent's `research` entry id — for Article-side navigation. */
	byParentId: Map<string, ResolvedIwl>;
}

let cache: IwlRegistry | null = null;

/**
 * T13.2 — the one validated IWL registry. Loads the complete `iwl`
 * collection, resolves every parent reference, and enforces the
 * one-IWL-source-per-parent invariant across *all* publication states
 * (not just published ones) — the exact rule T13.2's own contract names:
 * an unpublished IWL and a published IWL can't both claim the same
 * Article. This runs before any publication-state filtering, so a
 * malformed or duplicate *unpublished* entry can't hide from validation
 * simply because it produces no public route.
 *
 * Both the IWL route (getStaticPaths) and Article-side navigation
 * (ResearchLayout.astro) consume this same function — never an
 * independent lookup — so they can never disagree about presence,
 * publication state, or cardinality. Same discipline this project's
 * relation-projection resolution already established (Sprint 11.4).
 *
 * Astro's own content-reference validation (a separate build pass) already
 * fails the build when a `parent` reference doesn't resolve to a real
 * `research` entry; the explicit throw below is defensive, not the
 * primary gate — matching the posture ResearchLayout.astro's own relation-
 * projection resolution already takes for a structurally equivalent case.
 *
 * Cached per process: Astro invokes getStaticPaths and every consuming
 * page's frontmatter script independently, and without this cache the
 * full collection load + validation would silently repeat once per
 * consumer. Module state doesn't survive a fresh dev-server run or build,
 * so this never serves stale data across processes.
 */
export async function getIwlRegistry(): Promise<IwlRegistry> {
	if (cache) return cache;

	const all: ResolvedIwl[] = [];
	const claimedBy = new Map<string, string>(); // parent research id -> the first iwl entry id that claimed it

	for (const entry of await getCollection('iwl')) {
		const parent = await getEntry(entry.data.parent);
		if (!parent) {
			throw new Error(
				`IWL registry: "${entry.id}" references parent research entry "${entry.data.parent.id}", which does not exist.`,
			);
		}

		const priorClaimant = claimedBy.get(parent.id);
		if (priorClaimant) {
			throw new Error(
				`IWL registry: research entry "${parent.id}" has more than one IWL source ("${priorClaimant}" and "${entry.id}") — exactly one IWL source is allowed per Article, regardless of publication state.`,
			);
		}
		claimedBy.set(parent.id, entry.id);

		all.push({ entry, parent });
	}

	const published = all.filter((resolved) => resolved.entry.data.publicationState === 'published');
	const byParentId = new Map(published.map((resolved) => [resolved.parent.id, resolved]));

	cache = { all, published, byParentId };
	return cache;
}

/**
 * The one published IWL for a given `research` entry id, or `undefined`
 * when there is none — covering both the ABSENT and SOURCE-EXISTS-
 * UNPUBLISHED states identically, exactly as T13.1 requires: a visitor
 * (and this function's caller) can't and shouldn't be able to tell those
 * two states apart.
 */
export async function getPublishedIwlForParent(parentId: string): Promise<ResolvedIwl | undefined> {
	const { byParentId } = await getIwlRegistry();
	return byParentId.get(parentId);
}

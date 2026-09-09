import { z } from 'astro/zod';
import type { Relation } from './research-relations';

// Sprint 11.3 — the explicit, deterministic Schema.org projection contract
// for accepted research relations. Deliberately a separate schema/registry
// from research-relations.ts: that file owns the richer internal
// intellectual relationship (source/target/type/reason/inline
// manifestation); this file owns only the external projection policy —
// which exact canonical edge has been editorially approved to surface as
// which exact standard Schema.org property. A row here never redefines
// source/target/type/reason — those stay authoritative in
// research-relations.json, referenced here only by `relationId` as a
// foreign key. `.strict()` is load-bearing: it's what makes a row that
// tries to smuggle in `reason`/`source`/`target` fail the schema outright,
// not just get silently ignored.
//
// v1 allowlist is deliberately exactly one property. Not because
// Schema.org only has one relevant predicate, but because the corpus
// currently has exactly one real candidate edge
// (three-sos--invariants) and exactly one plausible standard property for
// it (isBasedOn) — see CHANGELOG.md's Sprint 11.0/11.3 entries.
// `citation`/`mentions`/`hasPart`/`isPartOf` are deliberately excluded:
// none is a fallback for another (each describes a materially different
// relationship), and none has an earned fixture yet. Widen this array
// only when a real edge genuinely needs it, never speculatively.
export const PROJECTION_PROPERTIES = ['isBasedOn'] as const;

export const projectionSchema = z
	.object({
		relationId: z.string(),
		property: z.enum(PROJECTION_PROPERTIES),
	})
	.strict();

export const projectionsSchema = z.array(projectionSchema);

export type Projection = z.infer<typeof projectionSchema>;

export type ProjectionProperty = (typeof PROJECTION_PROPERTIES)[number];

// Sprint 11.4 — the first real consumer of this registry. Deliberately
// still no astro:content import anywhere in this file: it's loaded by the
// plain-Node validate-research-relation-projections.mjs (via tsx, outside
// Vite's module graph) as well as by ResearchLayout.astro, so it has to
// stay resolvable in both. Target-URL resolution needs getEntry, which
// only the Astro-context caller can do — see ResearchLayout.astro.

/**
 * Resolves the outgoing projection(s) for one research entry, selected
 * strictly by `relation.source === sourceId` — never `target`. A
 * projection is a directional, source-only claim (Sprint 11.0's finding:
 * no reciprocal/inverse relation is ever emitted on the target side).
 *
 * Never consults `relation.type` or `relation.reason`. Whether a canonical
 * relation is editorially approved to project is recorded only by a row
 * existing here, keyed by `relationId` — `type` ("applies", "extends", …)
 * is an internal taxonomy this function deliberately never maps from, and
 * `inline.status` (which only gates the in-body HTML link) is never
 * consulted either — three independent axes, per CHANGELOG.md.
 *
 * Returns one entry per matching projection row. v1's uniqueness
 * invariants (enforced by the Sprint 11.3 validator, not repeated here)
 * mean this is at most one today, but the shape stays a list so a future
 * relation with more than one approved row against the same source
 * already composes correctly through projectionsJsonLd below.
 */
export function outgoingProjectionsFor(
	sourceId: string,
	relations: Relation[],
	projections: Projection[],
): Array<{ property: ProjectionProperty; targetId: string }> {
	const projectionsByRelationId = new Map(projections.map((p) => [p.relationId, p]));
	const results: Array<{ property: ProjectionProperty; targetId: string }> = [];
	for (const relation of relations) {
		if (relation.source !== sourceId) continue;
		const projection = projectionsByRelationId.get(relation.id);
		if (!projection) continue;
		results.push({ property: projection.property, targetId: relation.target });
	}
	return results;
}

/**
 * Groups already-resolved {property, targetUrl} pairs into the exact
 * spreadable JSON-LD partial this contract requires: each property maps to
 * an array of URLs (array-first even for a single member), and a property
 * with zero matching entries is simply absent from the returned object —
 * never a `[]`/`null`/`""` placeholder. `...projectionsJsonLd([])` is `{}`,
 * so spreading it into an Article object adds nothing at all — that's the
 * point: absence, not an empty array, is how "no approved outgoing
 * projections" is represented on the wire.
 */
export function projectionsJsonLd(
	entries: Array<{ property: ProjectionProperty; targetUrl: string }>,
): Partial<Record<ProjectionProperty, string[]>> {
	const out: Partial<Record<ProjectionProperty, string[]>> = {};
	for (const { property, targetUrl } of entries) {
		(out[property] ??= []).push(targetUrl);
	}
	return out;
}

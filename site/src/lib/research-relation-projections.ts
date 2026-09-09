import { z } from 'astro/zod';

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

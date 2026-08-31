import { z } from 'astro/zod';

// Sprint 7.1: the relation contract, as real Zod, not just prose in a doc.
// Deliberately unwired — no getCollection call, nothing reads
// research-relations.json through this yet, and nothing fails astro build
// if the file is malformed. That wiring is 7.2+ work, gated on a live entry
// (Three SOS, or another real collection id) actually earning a row.
//
// A relation records that two published pieces are intellectually related.
// It does NOT mean a link exists in prose — that's a separate decision,
// captured only in the optional `inline` block. Most relations will never
// carry one, and that's the expected, common case, not a gap to fill.

export const RELATION_TYPES = ['depends_on', 'applies', 'extends', 'contrasts', 'converges_with'] as const;

const inlineSchema = z
	.object({
		status: z.enum(['proposed', 'accepted', 'rejected']),
		near: z.string().optional(),
		anchor: z.string().optional(),
		reason: z.string().optional(),
	})
	.refine((inline) => inline.status !== 'accepted' || (!!inline.near && !!inline.anchor), {
		message: 'inline.status "accepted" requires both near and anchor',
	});

export const relationSchema = z
	.object({
		id: z.string(),
		source: z.string(), // research collection id
		target: z.string(), // research collection id
		type: z.enum(RELATION_TYPES),
		reason: z.string(),
		inline: inlineSchema.optional(),
	})
	.refine((row) => row.source !== row.target, {
		message: 'source and target must differ',
	});

export const relationsSchema = z.array(relationSchema);

export type Relation = z.infer<typeof relationSchema>;

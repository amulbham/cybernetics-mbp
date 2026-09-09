#!/usr/bin/env node
// Sprint 11.3 — validates the *source configuration* for Schema.org
// research-relation projection: research-relations.json (the canonical
// internal graph, untouched by this sprint) plus the new
// research-relation-projections.json (the external projection policy).
//
// This is deliberately not a JSON-LD validator — nothing here inspects
// emitted Article output, because nothing emits a projected relation yet
// (that's Sprint 11.4's job). It's also deliberately not merged into
// validate-research-links.mjs: that script protects a different contract
// (safe in-body HTML relation-link placement via the real markdown
// pipeline); this one protects semantic-projection *source* integrity.
// They may share canonical schemas/helpers (relationsSchema, canonicalPath)
// — they must not become one validator. Runs first in `npm run build`,
// before validate-research-links.mjs, so a broken projection contract is
// reported by the semantic layer before any HTML-placement check runs.
//
// Checks, all collected and reported together (not just the first):
//   - research-relations.json parses and passes its own schema
//   - canonical relation `id`s are globally unique — a NEW invariant this
//     sprint introduces: `id` was previously just a label nothing kept
//     unique on purpose (the existing inline-link transform matches rows
//     by `source`, never by `id`); it's a real foreign key now, so
//     duplicates would make a projection row genuinely ambiguous.
//   - research-relation-projections.json parses and passes its own strict
//     schema (unknown fields, e.g. a smuggled-in `reason`, fail outright)
//   - projection `relationId`s are unique (one canonical relation -> at
//     most one projection row, the v1 contract)
//   - every projection `relationId` matches a real canonical row, by exact
//     string equality only — no fuzzy matching, no source/target fallback
//   - that canonical row's `source` AND `target` both resolve to a real
//     research entry (reusing the same parseFrontmatter + canonicalPath()
//     resolution rehype-research-links.mjs already uses — not a second,
//     independent route-construction implementation)
//   - `property` is allowlisted — enforced by the Zod schema itself
//     (z.enum(PROJECTION_PROPERTIES)), not a separate hand-rolled check

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { relationsSchema } from '../src/lib/research-relations.ts';
import { projectionsSchema } from '../src/lib/research-relation-projections.ts';
import { canonicalPath } from '../src/lib/research-routing.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url)); // site/
const RELATIONS_PATH = join(ROOT, 'src', 'data', 'research-relations.json');
const PROJECTIONS_PATH = join(ROOT, 'src', 'data', 'research-relation-projections.json');
const CONTENT_ROOT = join(ROOT, 'src', 'content', 'research');

const failures = [];
function fail(message) {
	failures.push(message);
}

function loadJson(path, label) {
	let raw;
	try {
		raw = readFileSync(path, 'utf8');
	} catch (err) {
		fail(`${label}: cannot read ${path}: ${err.message}`);
		return null;
	}
	try {
		return JSON.parse(raw);
	} catch (err) {
		fail(`${label}: invalid JSON in ${path}: ${err.message}`);
		return null;
	}
}

/**
 * Resolves a research collection id to the shape canonicalPath() expects
 * ({ id, data: { format, pillar } }), read directly from its own
 * frontmatter — the same resolution rehype-research-links.mjs's own
 * resolveTargetHref() already uses, reused here rather than re-implemented,
 * per the ticket's own "one routing source of truth" instruction. Returns
 * null if no matching entry exists (a deleted/renamed/invalid id).
 */
function resolveEntry(id) {
	const mdPath = join(CONTENT_ROOT, id, 'index.md');
	const mdxPath = join(CONTENT_ROOT, id, 'index.mdx');
	const filePath = existsSync(mdPath) ? mdPath : existsSync(mdxPath) ? mdxPath : null;
	if (!filePath) return null;
	const { frontmatter } = parseFrontmatter(readFileSync(filePath, 'utf8'));
	return { id, data: { format: frontmatter.format, pillar: frontmatter.pillar } };
}

// 1. Canonical relation registry — parse, schema-validate, uniqueness.
const rawRelations = loadJson(RELATIONS_PATH, 'research-relations.json');
let relations = [];
if (rawRelations !== null) {
	const parsed = relationsSchema.safeParse(rawRelations);
	if (!parsed.success) {
		fail(`research-relations.json failed schema validation: ${JSON.stringify(parsed.error.issues)}`);
	} else {
		relations = parsed.data;
		const seenIds = new Set();
		for (const row of relations) {
			if (seenIds.has(row.id)) {
				fail(
					`research-relations.json: duplicate relation id "${row.id}" — canonical relation IDs must be globally unique now that they're a projection foreign key`,
				);
			}
			seenIds.add(row.id);
		}
	}
}
const relationsById = new Map(relations.map((r) => [r.id, r]));

// 2. Projection registry — parse, strict-schema-validate, uniqueness,
// referential integrity against the canonical registry above.
const rawProjections = loadJson(PROJECTIONS_PATH, 'research-relation-projections.json');
let projectionCount = 0;
if (rawProjections !== null) {
	const parsed = projectionsSchema.safeParse(rawProjections);
	if (!parsed.success) {
		fail(`research-relation-projections.json failed schema validation: ${JSON.stringify(parsed.error.issues)}`);
	} else {
		const projections = parsed.data;
		projectionCount = projections.length;
		const seenRelationIds = new Set();
		for (const row of projections) {
			if (seenRelationIds.has(row.relationId)) {
				fail(
					`research-relation-projections.json: duplicate relationId "${row.relationId}" — a canonical relation may map to at most one projection row in v1`,
				);
				continue;
			}
			seenRelationIds.add(row.relationId);

			const relation = relationsById.get(row.relationId);
			if (!relation) {
				fail(
					`research-relation-projections.json: relationId "${row.relationId}" does not match any row in research-relations.json — exact foreign key required, no fuzzy matching`,
				);
				continue;
			}

			const source = resolveEntry(relation.source);
			if (!source) {
				fail(
					`research-relation-projections.json: projection "${row.relationId}" -> its canonical relation's source "${relation.source}" has no matching research entry`,
				);
			}
			const target = resolveEntry(relation.target);
			if (!target) {
				fail(
					`research-relation-projections.json: projection "${row.relationId}" -> its canonical relation's target "${relation.target}" has no matching research entry`,
				);
			}
			if (source && target) {
				// Resolved (not just existence-checked) to prove this reuses the
				// real routing source of truth rather than merely asserting the
				// files exist — canonicalPath() is the single source of truth
				// for research routes, same as rehype-research-links.mjs.
				canonicalPath(source);
				canonicalPath(target);
			}
		}
	}
}

if (failures.length > 0) {
	console.error(`validate-research-relation-projections: ${failures.length} check(s) failed:\n`);
	for (const f of failures) console.error(`  - ${f}`);
	process.exit(1);
}

console.log(
	`validate-research-relation-projections: ${relations.length} canonical relation(s), ${projectionCount} projection row(s), 0 issues.`,
);

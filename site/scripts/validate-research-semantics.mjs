#!/usr/bin/env node
// Sprint 11.7 — the emitted-semantic-graph validator (`npm run validate:semantics`).
//
//   SOURCE CONTRACTS -> BUILD -> EMITTED SEMANTIC GRAPH -> THIS ORACLE -> DEPLOY
//
// Runs after `astro build`, before `pagefind` (see package.json) — it reads
// built HTML from dist/, not source, because the object under test is what
// Astro actually emitted, not what ResearchLayout.astro intends to emit.
// Everything Sprint 11.0-11.4 proved by hand (build inspection + adversarial
// mutation, each done once and reverted) becomes a permanent, continuously
// enforced assertion here.
//
// Four independent validation layers now exist, each protecting a different
// boundary, deliberately not merged into one giant validator:
//
//   validate-research-relation-projections  source projection config
//   validate-research-links                 inline manifestation (safe placement)
//   validate-research-semantics (this file)  emitted Schema.org output
//   validate-research-pdfs                  PDF artifact identity
//
// Load-bearing design rule: this file must NEVER import
// outgoingProjectionsFor()/projectionsJsonLd() from
// research-relation-projections.ts. Those are the production serializer —
// reusing them here would let one shared bug pass as "validated" in both
// the transform and the check. Expected relation-projection state is
// derived independently below, sharing only schemas, canonical routing, and
// the canonical corpus manifest — never selection/grouping logic. See
// AGENTS.md's Sprint 11.7 standing invariants.
//
// Fails closed and reports every failure found, not just the first — same
// posture as validate-research-pdfs.mjs.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverResearch, SITE_ORIGIN } from './discover-research.mjs';
import { extractCanonicalHrefs, extractCitationMeta, extractJsonLdBlocks, findArticleLikeJsonLd } from './lib/built-html.mjs';
import { personIdentity } from '../src/lib/structured-data.ts';
import { relationsSchema } from '../src/lib/research-relations.ts';
import { PROJECTION_PROPERTIES, projectionsSchema } from '../src/lib/research-relation-projections.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url)); // site/
const DIST = join(ROOT, 'dist');
const RELATIONS_PATH = join(ROOT, 'src', 'data', 'research-relations.json');
const PROJECTIONS_PATH = join(ROOT, 'src', 'data', 'research-relation-projections.json');

const failures = [];
function fail(scope, message) {
	failures.push(`${scope}: ${message}`);
}

// Article properties this sprint asserts must never appear on a research
// Article — no corpus citation graph, no IWL/Reader Context semantics exist
// in Sprint 11. `isPartOf` is deliberately NOT here: it's the legitimate
// paper-pillar CollectionPage link (checked on its own terms below), not a
// forbidden relation property.
const FORBIDDEN_ARTICLE_PROPERTIES = ['citation', 'mentions', 'hasPart', 'backstory', 'audience'];

function stripDoiPrefix(doi) {
	return doi ? doi.replace(/^https?:\/\/doi\.org\//, '') : undefined;
}

function readDistHtml(route) {
	const path = join(DIST, route, 'index.html');
	return existsSync(path) ? readFileSync(path, 'utf8') : null;
}

/** Parses every JSON-LD block on a page, reporting a parse failure with page + block index (§10), and returns only the well-formed ones for further checks. */
function parseJsonLdBlocks(scope, html) {
	const blocks = extractJsonLdBlocks(html);
	for (const b of blocks) {
		if (b.error) fail(scope, `JSON-LD block #${b.index} failed to parse: ${b.error}`);
	}
	return blocks.filter((b) => b.parsed !== null).map((b) => b.parsed);
}

// ---------------------------------------------------------------------------
// Canonical Person expected core (§16) — the same production
// personIdentity() helper, not a validator-only copy. This is canonical
// identity truth, not projection decision logic, so reusing it is exactly
// what §16 asks for (unlike the relation-projection serializer, §26-27).
// ---------------------------------------------------------------------------
const EXPECTED_PERSON = personIdentity(new URL(SITE_ORIGIN));

/** Exact field equality for @type/@id/name/url; sameAs compared as an unordered set (§17) — incidental array order is never a failure, identity drift is. */
function assertPersonCore(scope, label, actual) {
	if (!actual || typeof actual !== 'object') {
		fail(scope, `${label} missing or not an object`);
		return;
	}
	if (actual['@type'] !== EXPECTED_PERSON['@type']) fail(scope, `${label}.@type "${actual['@type']}" !== "${EXPECTED_PERSON['@type']}"`);
	if (actual['@id'] !== EXPECTED_PERSON['@id']) fail(scope, `${label}.@id "${actual['@id']}" !== "${EXPECTED_PERSON['@id']}"`);
	if (actual.name !== EXPECTED_PERSON.name) fail(scope, `${label}.name "${actual.name}" !== "${EXPECTED_PERSON.name}"`);
	if (actual.url !== EXPECTED_PERSON.url) fail(scope, `${label}.url "${actual.url}" !== "${EXPECTED_PERSON.url}"`);
	assertSetEqual(scope, `${label}.sameAs`, Array.isArray(actual.sameAs) ? actual.sameAs : [], EXPECTED_PERSON.sameAs);
}

/** Unordered-set equality with duplicate detection — the shape every relation-target and sameAs comparison in this file needs (§17, §28). */
function assertSetEqual(scope, label, actualArr, expectedArr) {
	const actualSet = new Set(actualArr);
	if (actualSet.size !== actualArr.length) {
		fail(scope, `${label} contains duplicate entries: ${JSON.stringify(actualArr)}`);
	}
	const expectedSet = new Set(expectedArr);
	const missing = expectedArr.filter((v) => !actualSet.has(v));
	const extra = actualArr.filter((v) => !expectedSet.has(v));
	if (missing.length > 0) fail(scope, `${label} is missing expected member(s): ${JSON.stringify(missing)}`);
	if (extra.length > 0) fail(scope, `${label} has unexpected/unauthorized member(s): ${JSON.stringify(extra)}`);
}

// ---------------------------------------------------------------------------
// Independent relation-projection oracle (§26-27, §32). Reads both
// registries directly and re-validates them through the real schemas (a
// defensive re-parse — validate-research-relation-projections.mjs is the
// primary gate for source-config integrity), then computes expected
// outgoing projections with a traversal deliberately shaped differently
// from outgoingProjectionsFor(): that function walks relations and looks up
// a projection per relation; this walks projections first and looks up a
// relation per projection. Same source truth, independently derived
// expected output — not the production selection/grouping logic invoked
// twice.
// ---------------------------------------------------------------------------
const relations = relationsSchema.parse(JSON.parse(readFileSync(RELATIONS_PATH, 'utf8')));
const projections = projectionsSchema.parse(JSON.parse(readFileSync(PROJECTIONS_PATH, 'utf8')));
const relationsById = new Map(relations.map((r) => [r.id, r]));

const { papers, nonPapers } = discoverResearch();
const allRecords = [...papers, ...nonPapers];
const routeById = new Map(allRecords.map((r) => [r.id, r.route]));

/** sourceId -> Map<property, Set<expected target URL>> */
const expectedProjections = new Map();
for (const projection of projections) {
	const relation = relationsById.get(projection.relationId);
	if (!relation) continue; // 11.3's own validator already guarantees this can't happen in a healthy build
	const targetRoute = routeById.get(relation.target);
	if (!targetRoute) continue; // ditto
	const targetUrl = `${SITE_ORIGIN}${targetRoute}`;
	if (!expectedProjections.has(relation.source)) expectedProjections.set(relation.source, new Map());
	const byProperty = expectedProjections.get(relation.source);
	if (!byProperty.has(projection.property)) byProperty.set(projection.property, new Set());
	byProperty.get(projection.property).add(targetUrl);
}

// ---------------------------------------------------------------------------
// Per-research-object checks
// ---------------------------------------------------------------------------

function validateResearchObject(record) {
	const scope = record.id;
	const html = readDistHtml(record.route);
	if (html === null) {
		fail(scope, `dist HTML missing at ${record.route}`);
		return;
	}

	const expectedUrl = `${SITE_ORIGIN}${record.route}`;

	// Canonical <link> cardinality + equality (§13, §14)
	const canonicalHrefs = extractCanonicalHrefs(html);
	if (canonicalHrefs.length !== 1) {
		fail(scope, `expected exactly 1 <link rel="canonical">, found ${canonicalHrefs.length}: ${JSON.stringify(canonicalHrefs)}`);
	} else if (canonicalHrefs[0] !== expectedUrl) {
		fail(scope, `canonical <link> "${canonicalHrefs[0]}" !== expected "${expectedUrl}"`);
	}

	// Every JSON-LD block must parse (§10)
	const jsonLdBlocks = parseJsonLdBlocks(scope, html);

	// Exactly one Article-like object (§9)
	const articleMatches = findArticleLikeJsonLd(jsonLdBlocks);
	if (articleMatches.length !== 1) {
		fail(scope, `expected exactly 1 Article-like JSON-LD object, found ${articleMatches.length}`);
		return; // nothing else here can be trusted against an ambiguous/missing Article
	}
	const article = articleMatches[0];

	// Intentional @type contract (§8) — independent of the locator's own
	// resilience (§7): finding the object is never the same check as
	// validating its type.
	const type = article['@type'];
	const typeArr = Array.isArray(type) ? type : [type];
	if (record.format === 'paper') {
		if (!(typeArr.includes('ScholarlyArticle') && typeArr.includes('Article'))) {
			fail(scope, `paper @type ${JSON.stringify(type)} does not contain both "ScholarlyArticle" and "Article"`);
		}
	} else if (type !== 'Article') {
		fail(scope, `${record.format} @type ${JSON.stringify(type)} !== "Article"`);
	}

	// Canonical identity parity (§13, §15): canonical link === Article.url === mainEntityOfPage.@id
	if (article.url !== expectedUrl) {
		fail(scope, `Article.url "${article.url}" !== expected "${expectedUrl}"`);
	}
	const mainEntity = article.mainEntityOfPage;
	const mainEntityKeys = mainEntity && typeof mainEntity === 'object' ? Object.keys(mainEntity) : [];
	if (!mainEntity || mainEntity['@type'] !== 'WebPage' || mainEntity['@id'] !== expectedUrl || mainEntityKeys.length !== 2) {
		fail(
			scope,
			`Article.mainEntityOfPage ${JSON.stringify(mainEntity)} !== expected exactly {"@type":"WebPage","@id":"${expectedUrl}"}`,
		);
	}
	if (Object.prototype.hasOwnProperty.call(article, '@id')) {
		fail(scope, `Article carries a top-level @id ("${article['@id']}") — Sprint 11 freezes no additional top-level graph identity`);
	}

	// Pillar CollectionPage linkage stays paper-only and @id-free (§37, §15)
	if (record.format === 'paper') {
		const isPartOf = article.isPartOf;
		const ok = isPartOf && isPartOf['@type'] === 'CollectionPage' && typeof isPartOf.name === 'string' && typeof isPartOf.url === 'string';
		if (!ok) {
			fail(scope, `paper Article.isPartOf missing or malformed: ${JSON.stringify(isPartOf)}`);
		} else if (Object.prototype.hasOwnProperty.call(isPartOf, '@id')) {
			fail(scope, `paper Article.isPartOf carries an unexpected @id — Sprint 11 freezes no CollectionPage @id`);
		}
	} else if (article.isPartOf !== undefined) {
		fail(scope, `non-paper Article carries isPartOf (${JSON.stringify(article.isPartOf)}) — pillar linkage is paper-only`);
	}

	// Person parity (§18, §19)
	assertPersonCore(scope, 'Article.author', article.author);
	assertPersonCore(scope, 'Article.publisher', article.publisher);
	if (article.author?.['@id'] !== article.publisher?.['@id']) {
		fail(scope, `author.@id "${article.author?.['@id']}" !== publisher.@id "${article.publisher?.['@id']}"`);
	}

	// DOI / Highwire parity (§22-25)
	const expectedDoi = stripDoiPrefix(record.doi);
	const citationDoi = extractCitationMeta(html).get('citation_doi')?.[0];
	if (expectedDoi) {
		const expectedIdentifier = { '@type': 'PropertyValue', propertyID: 'DOI', value: expectedDoi };
		if (JSON.stringify(article.identifier) !== JSON.stringify(expectedIdentifier)) {
			fail(scope, `Article.identifier ${JSON.stringify(article.identifier)} !== expected ${JSON.stringify(expectedIdentifier)}`);
		}
		if (record.format === 'paper') {
			if (citationDoi !== expectedDoi) {
				fail(scope, `citation_doi "${citationDoi}" !== expected "${expectedDoi}" (source-derived)`);
			}
			// Direct pairwise comparison too, not just each-vs-source: if a
			// mutation drifts identifier.value away from citation_doi while
			// both still individually look plausible, this is the diagnostic
			// that names the actual disagreement (§39, §45) rather than
			// requiring a reader to cross-reference two separate failures.
			if (article.identifier?.value !== undefined && citationDoi !== undefined && article.identifier.value !== citationDoi) {
				fail(scope, `citation_doi "${citationDoi}" !== identifier.value "${article.identifier.value}"`);
			}
		} else if (citationDoi !== undefined) {
			fail(scope, `citation_doi "${citationDoi}" present on a non-paper entry — Highwire stays paper-only`);
		}
	} else {
		if (article.identifier !== undefined) {
			fail(scope, `Article.identifier present (${JSON.stringify(article.identifier)}) but source has no doi — absence required`);
		}
		if (citationDoi !== undefined) {
			fail(scope, `citation_doi "${citationDoi}" present but source has no doi`);
		}
	}

	// Forbidden semantic leakage (§36)
	for (const prop of FORBIDDEN_ARTICLE_PROPERTIES) {
		if (Object.prototype.hasOwnProperty.call(article, prop)) {
			fail(scope, `Article carries forbidden property "${prop}" — no corpus citation/IWL graph exists in Sprint 11`);
		}
	}

	// Relation-projection parity (§28-32) — checked against the independent
	// oracle above, for every allowlisted property, present or absent.
	const expectedByProperty = expectedProjections.get(record.id) ?? new Map();
	for (const property of PROJECTION_PROPERTIES) {
		const expectedSet = expectedByProperty.get(property);
		const actualValue = article[property];
		if (!expectedSet || expectedSet.size === 0) {
			if (actualValue !== undefined) {
				fail(
					scope,
					`Article.${property} present (${JSON.stringify(actualValue)}) but zero approved outgoing projections exist — absence required, never [] or a value`,
				);
			}
			continue;
		}
		if (actualValue === undefined) {
			fail(scope, `expected Article.${property} ${JSON.stringify([...expectedSet])}, found no property at all`);
			continue;
		}
		if (!Array.isArray(actualValue)) {
			fail(scope, `Article.${property} is not an array (${JSON.stringify(actualValue)}) — the array-first contract requires it`);
			continue;
		}
		assertSetEqual(scope, `Article.${property}`, actualValue, [...expectedSet]);
	}
}

// ---------------------------------------------------------------------------
// Homepage + About Person parity (§20, §21)
// ---------------------------------------------------------------------------

function validateHomepage() {
	const scope = 'homepage';
	const html = readDistHtml('/');
	if (html === null) {
		fail(scope, 'dist HTML missing at /');
		return;
	}
	const blocks = parseJsonLdBlocks(scope, html);

	const person = blocks.find((b) => b['@type'] === 'Person');
	if (!person) fail(scope, 'no standalone Person JSON-LD block found');
	else assertPersonCore(scope, 'standalone Person', person);

	const website = blocks.find((b) => b['@type'] === 'WebSite');
	if (!website) fail(scope, 'no WebSite JSON-LD block found');
	else assertPersonCore(scope, 'WebSite.author', website.author);
}

function validateAbout() {
	const scope = 'about';
	const html = readDistHtml('/about/');
	if (html === null) {
		fail(scope, 'dist HTML missing at /about/');
		return;
	}
	const blocks = parseJsonLdBlocks(scope, html);

	const profile = blocks.find((b) => b['@type'] === 'ProfilePage');
	if (!profile) {
		fail(scope, 'no ProfilePage JSON-LD block found');
		return;
	}
	assertPersonCore(scope, 'ProfilePage.mainEntity', profile.mainEntity);
	if (typeof profile.mainEntity?.jobTitle !== 'string' || profile.mainEntity.jobTitle.length === 0) {
		fail(scope, 'ProfilePage.mainEntity missing its jobTitle contextual enrichment');
	}
	if (!Array.isArray(profile.mainEntity?.knowsAbout) || profile.mainEntity.knowsAbout.length === 0) {
		fail(scope, 'ProfilePage.mainEntity missing its knowsAbout contextual enrichment');
	}
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
	if (!existsSync(DIST)) {
		console.error('validate-research-semantics: dist/ does not exist — run `npm run build` first.');
		process.exit(1);
	}

	for (const record of allRecords) validateResearchObject(record);
	validateHomepage();
	validateAbout();

	if (failures.length > 0) {
		console.error(`validate-research-semantics: ${failures.length} check(s) failed:\n`);
		for (const f of failures) console.error(`  - ${f}`);
		process.exit(1);
	}

	let projectedCount = 0;
	for (const byProperty of expectedProjections.values()) {
		for (const set of byProperty.values()) projectedCount += set.size;
	}
	console.log(
		`validate-research-semantics: ${allRecords.length} research object(s), ${allRecords.length} Article-like object(s), ` +
			`canonical identity parity ok, Person/publisher parity ok, DOI/Highwire parity ok, ${projectedCount} projected semantic relation(s), 0 issues.`,
	);
}

main();

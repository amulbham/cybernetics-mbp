#!/usr/bin/env node
// T28.5a — independent publishing-facts checker (`npm run build` runs it right
// after validate-research-semantics, before Pagefind).
//
//   HUMAN-REVIEWED FIXTURE (facts)  ──┐
//                                     ├──> compare ──> exit 1 on any mismatch
//   BUILT dist/ HTML (observed)     ──┘
//
// Why this exists (T28.5 audit F2): the other validators derive their expected
// values from the same source that generates the HTML (`personIdentity()`,
// `AUTHOR`, frontmatter), so a wrong author name, social URL, DOI, date,
// license or About job title is *internally consistent* and passes. This
// checker takes its expected values ONLY from
// scripts/fixtures/publishing-facts.json, a small file that is reviewed by a
// human whenever it changes (a source change that alters a published fact must
// carry the matching fixture edit in the same commit).
//
// Hard rules, enforced by scripts/test-publishing-facts.mjs:
//   * Imports node built-ins only. It must never import anything under src/,
//     `personIdentity`, `AUTHOR`, `SOCIAL_LINKS`, or read content frontmatter.
//   * No bypass flag and no env switch. `--dist` and `--fixture` exist only so
//     the test harness can point it at disposable copies.
//   * Fails closed: an unknown research page, a missing page, an unparsable
//     fixture or an unexpected value is a failure, never a warning.
//
// It checks facts that are *observable in built output*. It does not prove a
// fact is true in the real world (a reviewer approves the fixture), it does
// not fetch the network, and it does not inspect PDFs (PDF bytes are protected
// by the release carry-over/manifest gates).

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
function argValue(name, fallback) {
	const i = args.indexOf(name);
	return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}
const DIST = resolve(argValue('--dist', join(HERE, '..', 'dist')));
const FIXTURE_PATH = resolve(argValue('--fixture', join(HERE, 'fixtures', 'publishing-facts.json')));

const failures = [];
const notes = [];
const fail = (scope, message) => failures.push(`${scope}: ${message}`);

// ---------------------------------------------------------------------------
// Tiny HTML helpers (own implementation on purpose: no shared parser with the
// other validators, so one parsing bug cannot pass in both).
// ---------------------------------------------------------------------------
function decode(s) {
	return s
		.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
		.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');
}
const textOf = (html) => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

function metas(html) {
	const out = [];
	for (const m of html.matchAll(/<meta\b([^>]*)>/g)) {
		const attrs = {};
		for (const a of m[1].matchAll(/([a-zA-Z:_-]+)="([^"]*)"/g)) attrs[a[1]] = decode(a[2]);
		const key = attrs.name ?? attrs.property;
		if (key !== undefined) out.push([key, attrs.content ?? '']);
	}
	return out;
}
const metaAll = (list, key) => list.filter(([k]) => k === key).map(([, v]) => v);

function jsonLdBlocks(scope, html) {
	const blocks = [];
	for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
		try {
			blocks.push(JSON.parse(m[1]));
		} catch (err) {
			fail(scope, `JSON-LD block does not parse: ${err.message}`);
		}
	}
	return blocks;
}
const typeList = (b) => (Array.isArray(b?.['@type']) ? b['@type'] : [b?.['@type']]);

function canonicalHrefs(html) {
	return [...html.matchAll(/<link\b[^>]*\brel="canonical"[^>]*>/g)].map((m) => decode(/href="([^"]*)"/.exec(m[0])?.[1] ?? ''));
}

const sameSet = (a, b) => a.length === b.length && [...a].sort().join('\n') === [...b].sort().join('\n');
function setDiff(scope, label, actual, expected) {
	const dup = actual.filter((v, i) => actual.indexOf(v) !== i);
	if (dup.length) fail(scope, `${label} has duplicate value(s): ${JSON.stringify([...new Set(dup)])}`);
	const missing = expected.filter((v) => !actual.includes(v));
	const extra = actual.filter((v) => !expected.includes(v));
	if (missing.length) fail(scope, `${label} is missing ${JSON.stringify(missing)}`);
	if (extra.length) fail(scope, `${label} has unexpected ${JSON.stringify([...new Set(extra)])}`);
	for (const v of actual) {
		try {
			const u = new URL(v);
			if (u.protocol !== 'https:') fail(scope, `${label} value ${JSON.stringify(v)} is not https`);
		} catch {
			fail(scope, `${label} value ${JSON.stringify(v)} is not a well-formed URL`);
		}
	}
}

// ---------------------------------------------------------------------------
// Fixture load + self-validation
// ---------------------------------------------------------------------------
const DATE_MODES = new Set(['absent', 'exact', 'observed-unverified', 'legacy-build-timestamp']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

function loadFixture() {
	if (!existsSync(FIXTURE_PATH)) {
		console.error(`validate-publishing-facts: fixture missing at ${FIXTURE_PATH}`);
		process.exit(1);
	}
	let fx;
	try {
		fx = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'));
	} catch (err) {
		console.error(`validate-publishing-facts: fixture does not parse: ${err.message}`);
		process.exit(1);
	}
	const bad = (m) => fail('fixture', m);
	if (fx.fixtureVersion !== 1) bad('fixtureVersion must be 1');
	if (!['BASELINE', 'TARGET'].includes(fx.phase)) bad('phase must be BASELINE or TARGET');
	if (typeof fx.siteOrigin !== 'string' || !/^https:\/\/[^/]+$/.test(fx.siteOrigin)) bad('siteOrigin must be an https origin without a trailing slash');
	if (!fx.license || typeof fx.license.url !== 'string' || typeof fx.license.label !== 'string') bad('license {url,label} required');
	const p = fx.person;
	if (!p || typeof p.name !== 'string' || typeof p['@id'] !== 'string' || typeof p.url !== 'string' || !Array.isArray(p.sameAs)) bad('person {@id,name,url,sameAs[]} required');
	else if (new Set(p.sameAs).size !== p.sameAs.length) bad('person.sameAs contains duplicates');
	const pp = fx.profilePage;
	if (!pp || typeof pp.jobTitle !== 'string' || !pp.jobTitle) bad('profilePage.jobTitle required');
	for (const key of ['dateCreated', 'dateModified']) {
		const d = pp?.[key];
		if (!d || !DATE_MODES.has(d.mode)) bad(`profilePage.${key}.mode must be one of ${[...DATE_MODES].join('|')}`);
		else if (['exact', 'observed-unverified'].includes(d.mode) && !ISO_INSTANT.test(d.value ?? '')) bad(`profilePage.${key}.value must be an ISO-8601 UTC instant`);
		else if (d.mode === 'legacy-build-timestamp' && key !== 'dateModified') bad('legacy-build-timestamp is permitted for profilePage.dateModified only');
	}
	if (fx.phase === 'TARGET' && pp) {
		for (const key of ['dateCreated', 'dateModified']) {
			if (pp[key]?.mode === 'legacy-build-timestamp') bad(`TARGET phase must not carry the legacy build-timestamp exception (profilePage.${key})`);
		}
	}
	const v = fx.visible;
	if (!v || !v.mastheadName || !v.mastheadRoleLine || !v.authorNoteBio) bad('visible {mastheadName,mastheadRoleLine,authorNoteBio} required');
	if (!fx.identityLinks || typeof fx.identityLinks !== 'object') bad('identityLinks required');
	if (!Array.isArray(fx.entries) || fx.entries.length === 0) bad('entries[] required');
	const seen = new Set();
	for (const e of fx.entries ?? []) {
		if (seen.has(e.id)) bad(`duplicate entry ${e.id}`);
		seen.add(e.id);
		if (!['paper', 'essay'].includes(e.format)) bad(`${e.id}: format must be paper|essay`);
		if (!ISO_DATE.test(e.pubDate ?? '')) bad(`${e.id}: pubDate must be YYYY-MM-DD`);
		if (e.revisedDate !== null && !ISO_DATE.test(e.revisedDate ?? '')) bad(`${e.id}: revisedDate must be YYYY-MM-DD or null`);
		if (e.format === 'paper' && !e.pdfPath) bad(`${e.id}: paper needs pdfPath`);
		if (e.format === 'essay' && e.pdfPath !== null) bad(`${e.id}: essay must have pdfPath null`);
		if (e.format === 'essay' && e.doi !== null) bad(`${e.id}: essay must have doi null`);
		if (typeof e.title !== 'string' || !e.title || typeof e.route !== 'string' || typeof e.ogImagePath !== 'string') bad(`${e.id}: title/route/ogImagePath required`);
		if (!e.zenodoTokens || typeof e.zenodoTokens !== 'object' || !Array.isArray(e.zenodoAnchors)) bad(`${e.id}: zenodoTokens{} and zenodoAnchors[] required`);
	}
	if (failures.length) {
		console.error(`validate-publishing-facts: fixture invalid:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
		process.exit(1);
	}
	return fx;
}

const FX = loadFixture();
const ORIGIN = FX.siteOrigin;
const PERSON = FX.person;

if (!existsSync(DIST)) {
	console.error(`validate-publishing-facts: dist not found at ${DIST} — run \`astro build\` first.`);
	process.exit(1);
}

// ---------------------------------------------------------------------------
// Shared checks
// ---------------------------------------------------------------------------
function personCore(scope, label, actual) {
	if (!actual || typeof actual !== 'object') return fail(scope, `${label} missing`);
	if (actual['@type'] !== 'Person') fail(scope, `${label}.@type ${JSON.stringify(actual['@type'])} !== "Person"`);
	if (actual['@id'] !== PERSON['@id']) fail(scope, `${label}.@id ${JSON.stringify(actual['@id'])} !== ${JSON.stringify(PERSON['@id'])}`);
	if (actual.name !== PERSON.name) fail(scope, `${label}.name ${JSON.stringify(actual.name)} !== ${JSON.stringify(PERSON.name)}`);
	if (actual.url !== PERSON.url) fail(scope, `${label}.url ${JSON.stringify(actual.url)} !== ${JSON.stringify(PERSON.url)}`);
	if (!Array.isArray(actual.sameAs)) fail(scope, `${label}.sameAs missing or not an array`);
	else setDiff(scope, `${label}.sameAs`, actual.sameAs, PERSON.sameAs);
}

const pdfAnchors = (html) => [...html.matchAll(/<a\b[^>]*\bhref="([^"]*\.pdf)"/g)].map((m) => decode(m[1]));

function identityLinks(html) {
	const re = /href="(https?:\/\/(?:www\.)?(?:linkedin\.com\/in\/amul-bham|github\.com\/amulbham|orcid\.org\/0009-0009-7660-4031|[a-z0-9-]+\.substack\.com)[^"]*)"/g;
	return [...html.matchAll(re)].map((m) => decode(m[1]));
}

function pageClass(route, html = null) {
	if (route === '/') return 'home';
	if (route === '/about/') return 'about';
	if (route === '/404') return '404';
	if (route === '/research/') return 'research-index';
	if (route === '/search/') return 'search';
	if (route.startsWith('/tags/')) return 'tag';
	if (/^\/research\/[^/]+\/$/.test(route)) return 'category';
	if (/^\/research\/[^/]+\/[^/]+\/iwl\/$/.test(route)) return 'iwl';
	if (/^\/research\/[^/]+\/[^/]+\/$/.test(route)) {
		if (html && html.includes('scholarly-forward')) return 'article-scholarly';
		return 'article';
	}
	return `other`;
}

const allPages = [];
(function walk(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (relative(DIST, path).split(sep)[0] === 'pagefind') continue;
			walk(path);
		} else if (entry.name.endsWith('.html')) {
			const rel = relative(DIST, path).split(sep).join('/');
			const route = rel === '404.html' ? '/404' : '/' + rel.replace(/index\.html$/, '');
			allPages.push({ path, route });
		}
	}
})(DIST);

// ---------------------------------------------------------------------------
// Research entries
// ---------------------------------------------------------------------------
function checkEntry(e) {
	const scope = e.id;
	const file = join(DIST, e.route, 'index.html');
	if (!existsSync(file)) return fail(scope, `built page missing at ${e.route}`);
	const html = readFileSync(file, 'utf8');
	const url = ORIGIN + e.route;
	const m = metas(html);
	const blocks = jsonLdBlocks(scope, html);

	const canon = canonicalHrefs(html);
	if (canon.length !== 1 || canon[0] !== url) fail(scope, `canonical ${JSON.stringify(canon)} !== [${JSON.stringify(url)}]`);

	const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(html);
	if (!h1 || textOf(h1[1]) !== e.title) fail(scope, `visible <h1> ${JSON.stringify(h1 ? textOf(h1[1]) : null)} !== title ${JSON.stringify(e.title)}`);
	if (metaAll(m, 'og:title')[0] !== e.title) fail(scope, `og:title ${JSON.stringify(metaAll(m, 'og:title')[0])} !== ${JSON.stringify(e.title)}`);

	const articles = blocks.filter((b) => typeList(b).some((t) => t === 'Article' || t === 'ScholarlyArticle'));
	if (articles.length !== 1) return fail(scope, `expected exactly 1 Article-like JSON-LD block, found ${articles.length}`);
	const a = articles[0];

	// Article class
	const types = typeList(a);
	if (e.format === 'paper') {
		if (!(Array.isArray(a['@type']) && types.length === 2 && types.includes('ScholarlyArticle') && types.includes('Article'))) fail(scope, `@type ${JSON.stringify(a['@type'])} !== ["ScholarlyArticle","Article"]`);
	} else if (a['@type'] !== 'Article') fail(scope, `@type ${JSON.stringify(a['@type'])} !== "Article" (essay control)`);

	// Headline, url, license, image
	if (a.headline !== e.title) fail(scope, `JSON-LD headline ${JSON.stringify(a.headline)} !== ${JSON.stringify(e.title)}`);
	if (a.url !== url) fail(scope, `JSON-LD url ${JSON.stringify(a.url)} !== ${JSON.stringify(url)}`);
	if (a.mainEntityOfPage?.['@id'] !== url) fail(scope, `JSON-LD mainEntityOfPage.@id ${JSON.stringify(a.mainEntityOfPage?.['@id'])} !== ${JSON.stringify(url)}`);
	const entryLicense = e.license ?? FX.license.url;
	if (a.license !== entryLicense) fail(scope, `JSON-LD license ${JSON.stringify(a.license)} !== ${JSON.stringify(entryLicense)}`);
	const imageUrl = `${ORIGIN}/${e.ogImagePath}`;
	if (a.image !== imageUrl) fail(scope, `JSON-LD image ${JSON.stringify(a.image)} !== ${JSON.stringify(imageUrl)}`);
	for (const key of ['og:image', 'og:image:url']) {
		const v = metaAll(m, key);
		if (v.length !== 1 || v[0] !== imageUrl) fail(scope, `${key} ${JSON.stringify(v)} !== [${JSON.stringify(imageUrl)}]`);
	}
	const imgFile = join(DIST, e.ogImagePath);
	if (!existsSync(imgFile) || statSync(imgFile).size < 1000) fail(scope, `og image file missing or empty in dist: ${e.ogImagePath}`);
	else if (readFileSync(imgFile).subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') fail(scope, `og image ${e.ogImagePath} is not a PNG`);

	// Dates (JSON-LD, Open Graph, visible <time>)
	const pubIso = `${e.pubDate}T00:00:00.000Z`;
	const modIso = `${e.revisedDate ?? e.pubDate}T00:00:00.000Z`; // the layout declares dateModified = datePublished when no real revision exists
	if (a.datePublished !== pubIso) fail(scope, `JSON-LD datePublished ${JSON.stringify(a.datePublished)} !== ${JSON.stringify(pubIso)}`);
	if (a.dateModified !== modIso) fail(scope, `JSON-LD dateModified ${JSON.stringify(a.dateModified)} !== ${JSON.stringify(modIso)}`);
	const ogPub = metaAll(m, 'article:published_time');
	if (ogPub.length !== 1 || ogPub[0] !== pubIso) fail(scope, `article:published_time ${JSON.stringify(ogPub)} !== [${JSON.stringify(pubIso)}]`);
	const ogMod = metaAll(m, 'article:modified_time');
	if (e.revisedDate === null) {
		if (ogMod.length) fail(scope, `article:modified_time ${JSON.stringify(ogMod)} present but the entry has no real revision (expected absent)`);
	} else if (ogMod.length !== 1 || ogMod[0] !== modIso) fail(scope, `article:modified_time ${JSON.stringify(ogMod)} !== [${JSON.stringify(modIso)}]`);
	const times = [...html.matchAll(/<time\b[^>]*\bdatetime="([^"]*)"/g)].map((t) => t[1]);
	const expectedTimes = e.revisedDate === null ? [pubIso] : [pubIso, modIso];
	if (JSON.stringify(times) !== JSON.stringify(expectedTimes)) fail(scope, `visible <time datetime> ${JSON.stringify(times)} !== ${JSON.stringify(expectedTimes)}`);

	// Person identity
	personCore(scope, 'JSON-LD author', a.author);
	personCore(scope, 'JSON-LD publisher', a.publisher);

	// DOI + Highwire (Scholar) contract
	if (e.doi === null) {
		if (a.identifier !== undefined) fail(scope, `JSON-LD identifier ${JSON.stringify(a.identifier)} present but the entry has no DOI`);
	} else if (JSON.stringify(a.identifier) !== JSON.stringify({ '@type': 'PropertyValue', propertyID: 'DOI', value: e.doi })) fail(scope, `JSON-LD identifier ${JSON.stringify(a.identifier)} !== DOI ${e.doi}`);

	const citation = m.filter(([k]) => k.startsWith('citation_'));
	if (e.format === 'paper') {
		const pdfUrl = `${ORIGIN}/${e.pdfPath}`;
		const want = {
			citation_title: [e.title],
			citation_author: [PERSON.name],
			citation_publication_date: [e.pubDate.replaceAll('-', '/')],
			citation_pdf_url: [pdfUrl],
			...(e.doi ? { citation_doi: [e.doi] } : {}),
		};
		for (const [k, v] of Object.entries(want)) {
			const got = metaAll(m, k);
			if (JSON.stringify(got) !== JSON.stringify(v)) fail(scope, `${k} ${JSON.stringify(got)} !== ${JSON.stringify(v)}`);
		}
		const extra = [...new Set(citation.map(([k]) => k))].filter((k) => !(k in want));
		if (extra.length) fail(scope, `unexpected Scholar tag(s) ${JSON.stringify(extra)} (no journal/venue/affiliation tags are authorized)`);
		if (JSON.stringify(a.encoding) !== JSON.stringify({ '@type': 'MediaObject', contentUrl: pdfUrl, encodingFormat: 'application/pdf' })) fail(scope, `JSON-LD encoding ${JSON.stringify(a.encoding)} !== MediaObject for ${pdfUrl}`);
		const own = pdfAnchors(html).filter((h) => h.startsWith(ORIGIN + '/'));
		if (JSON.stringify(own) !== JSON.stringify([pdfUrl])) fail(scope, `own-origin PDF links ${JSON.stringify(own)} !== [${JSON.stringify(pdfUrl)}]`);
	} else {
		if (citation.length) fail(scope, `essay control carries Scholar tags ${JSON.stringify([...new Set(citation.map(([k]) => k))])}`);
		if (a.encoding !== undefined) fail(scope, 'essay control carries a JSON-LD encoding/MediaObject');
		const own = pdfAnchors(html).filter((h) => h.startsWith(ORIGIN + '/'));
		if (own.length) fail(scope, `essay control links an own-origin PDF ${JSON.stringify(own)}`);
	}

	// Per-occurrence Zenodo DOI census: every `10.5281/zenodo.N` token anywhere in the page, plus each anchor's (href, label)
	const tokens = {};
	for (const t of html.matchAll(/10\.5281\/zenodo\.(\d+)/g)) tokens[t[1]] = (tokens[t[1]] ?? 0) + 1;
	if (JSON.stringify(Object.entries(tokens).sort()) !== JSON.stringify(Object.entries(e.zenodoTokens).sort())) fail(scope, `Zenodo DOI token counts ${JSON.stringify(tokens)} !== ${JSON.stringify(e.zenodoTokens)}`);
	const anchors = [...html.matchAll(/<a\b[^>]*\bhref="(https:\/\/doi\.org\/10\.5281\/zenodo\.\d+)"[^>]*>([\s\S]*?)<\/a>/g)].map((x) => [decode(x[1]), textOf(x[2])]);
	const norm = (list) => list.map((x) => x.join(' | ')).sort();
	if (JSON.stringify(norm(anchors)) !== JSON.stringify(norm(e.zenodoAnchors))) fail(scope, `Zenodo DOI anchors ${JSON.stringify(norm(anchors))} !== ${JSON.stringify(norm(e.zenodoAnchors))}`);

	// Visible byline and shared author note
	const mast = /<div class="masthead meta"[^>]*>([\s\S]*?)<\/div>/.exec(html);
	if (!mast) fail(scope, 'article masthead missing');
	else {
		const ps = [...mast[1].matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((x) => textOf(x[1]));
		if (ps[0] !== FX.visible.mastheadName) fail(scope, `masthead name ${JSON.stringify(ps[0])} !== ${JSON.stringify(FX.visible.mastheadName)}`);
		const expectedRoleLine = e.mastheadRoleLine ?? FX.visible.mastheadRoleLine;
		if (ps[1] !== expectedRoleLine) fail(scope, `masthead role line ${JSON.stringify(ps[1])} !== ${JSON.stringify(expectedRoleLine)}`);
	}
	const bio = /<p class="author-note-bio"[^>]*>([\s\S]*?)<\/p>/.exec(html);
	if (!bio || textOf(bio[1]) !== FX.visible.authorNoteBio) fail(scope, `AuthorNote bio ${JSON.stringify(bio ? textOf(bio[1]) : null)} !== ${JSON.stringify(FX.visible.authorNoteBio)}`);
}

// ---------------------------------------------------------------------------
// Inventory: no unexpected research article, none missing
// ---------------------------------------------------------------------------
const builtArticleRoutes = allPages.filter((p) => {
	const cls = pageClass(p.route, readFileSync(p.path, 'utf8'));
	return (cls === 'article' || cls === 'article-scholarly') && p.route.startsWith('/research/');
}).map((p) => p.route);
const expectedRoutes = FX.entries.map((e) => e.route);
for (const r of builtArticleRoutes) if (!expectedRoutes.includes(r)) fail('inventory', `built research page ${r} has no entry in the fixture (add and review its facts)`);
for (const r of expectedRoutes) if (!builtArticleRoutes.includes(r)) fail('inventory', `fixture entry ${r} has no built page`);

for (const e of FX.entries) checkEntry(e);

// ---------------------------------------------------------------------------
// Homepage and About (profile)
// ---------------------------------------------------------------------------
function checkHome() {
	const scope = 'home';
	const file = join(DIST, 'index.html');
	if (!existsSync(file)) return fail(scope, 'built homepage missing');
	const blocks = jsonLdBlocks(scope, readFileSync(file, 'utf8'));
	const person = blocks.find((b) => b['@type'] === 'Person');
	if (!person) fail(scope, 'standalone Person JSON-LD missing');
	else personCore(scope, 'Person', person);
	const site = blocks.find((b) => b['@type'] === 'WebSite');
	if (!site) fail(scope, 'WebSite JSON-LD missing');
	else {
		if (site.url !== ORIGIN + '/') fail(scope, `WebSite.url ${JSON.stringify(site.url)} !== ${JSON.stringify(ORIGIN + '/')}`);
		personCore(scope, 'WebSite.author', site.author);
	}
}

function dateRule(scope, label, key, spec, actual) {
	switch (spec.mode) {
		case 'absent':
			if (actual !== undefined) fail(scope, `${label}.${key} ${JSON.stringify(actual)} present but must be absent`);
			break;
		case 'exact':
			if (actual !== spec.value) fail(scope, `${label}.${key} ${JSON.stringify(actual)} !== ${JSON.stringify(spec.value)}`);
			break;
		case 'observed-unverified':
			if (actual !== spec.value) fail(scope, `${label}.${key} ${JSON.stringify(actual)} !== observed legacy value ${JSON.stringify(spec.value)}`);
			else notes.push(`NOTE ${label}.${key} = ${actual} is the observed legacy value; provenance UNVERIFIED, recorded and not endorsed`);
			break;
		case 'legacy-build-timestamp':
			if (typeof actual !== 'string' || !ISO_INSTANT.test(actual)) fail(scope, `${label}.${key} ${JSON.stringify(actual)} is not an ISO-8601 UTC timestamp (legacy exception accepts only a valid timestamp here)`);
			else notes.push(`NOTE ${label}.${key} = ${actual} accepted ONLY under the single legacy About build-timestamp exception`);
			break;
	}
}

function checkAbout() {
	const scope = 'about';
	const file = join(DIST, 'about', 'index.html');
	if (!existsSync(file)) return fail(scope, 'built About page missing');
	const html = readFileSync(file, 'utf8');
	const blocks = jsonLdBlocks(scope, html);
	const profiles = blocks.filter((b) => b['@type'] === 'ProfilePage');
	if (profiles.length !== 1) return fail(scope, `expected exactly 1 ProfilePage block, found ${profiles.length}`);
	const pp = profiles[0];
	personCore(scope, 'ProfilePage.mainEntity', pp.mainEntity);
	if (pp.mainEntity?.jobTitle !== FX.profilePage.jobTitle) fail(scope, `ProfilePage.mainEntity.jobTitle ${JSON.stringify(pp.mainEntity?.jobTitle)} !== ${JSON.stringify(FX.profilePage.jobTitle)}`);
	dateRule(scope, 'ProfilePage', 'dateCreated', FX.profilePage.dateCreated, pp.dateCreated);
	dateRule(scope, 'ProfilePage', 'dateModified', FX.profilePage.dateModified, pp.dateModified);
	const canon = canonicalHrefs(html);
	if (canon.length !== 1 || canon[0] !== PERSON.url) fail(scope, `canonical ${JSON.stringify(canon)} !== [${JSON.stringify(PERSON.url)}]`);
}

checkHome();
checkAbout();

// ---------------------------------------------------------------------------
// Identity-link census on every built page (chrome + article + About)
// ---------------------------------------------------------------------------
for (const p of allPages) {
	const html = readFileSync(p.path, 'utf8');
	const cls = pageClass(p.route, html);
	const expected = FX.identityLinks[cls];
	if (!expected) {
		fail(`links:${p.route}`, `page class "${cls}" has no identityLinks expectation`);
		continue;
	}
	const actual = identityLinks(html);
	if (!sameSet(actual, expected)) fail(`links:${p.route}`, `identity links ${JSON.stringify([...actual].sort())} !== ${JSON.stringify([...expected].sort())}`);
}

// ---------------------------------------------------------------------------
if (failures.length) {
	console.error(`validate-publishing-facts: ${failures.length} check(s) failed against ${relative(process.cwd(), FIXTURE_PATH) || FIXTURE_PATH} (phase ${FX.phase}):\n`);
	for (const f of failures) console.error(`  - ${f}`);
	process.exit(1);
}
for (const n of notes) console.log(`validate-publishing-facts: ${n}`);
console.log(`validate-publishing-facts: phase ${FX.phase}; ${FX.entries.length} research entries, ${allPages.length} pages; person/sameAs/jobTitle, About dates, DOI/date/license/headline/image/Scholar tags, per-occurrence DOI census, byline/AuthorNote and identity-link census OK, 0 issues.`);

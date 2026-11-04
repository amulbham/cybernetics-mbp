#!/usr/bin/env node
// T28.5a — adversarial test harness for scripts/validate-publishing-facts.mjs.
//
// Run after `npm run build` (needs dist/):  node scripts/test-publishing-facts.mjs
//
// Every case runs on a DISPOSABLE copy of dist/ (and, for fixture cases, of the
// fixture) under the OS temp directory. Nothing tracked and no live origin is
// touched. A case is CAUGHT when the checker exits non-zero (and its output
// names the expected symptom); ESCAPED when it exits 0; the harness fails if a
// case that must be caught escapes, or a case that must pass does not.
//
// Cases are written relative to the fixture's own values, so the same suite
// runs unchanged against the BASELINE and the TARGET fixture phases. Where the
// right outcome depends on the phase (the About date exception) the expectation
// is derived from the fixture's declared mode, never hard-coded.

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, '..');
const CHECKER = join(HERE, 'validate-publishing-facts.mjs');
const FIXTURE = join(HERE, 'fixtures', 'publishing-facts.json');
const DIST = join(SITE, 'dist');

if (!existsSync(DIST)) {
	console.error('test-publishing-facts: dist/ missing — run `npm run build` first.');
	process.exit(1);
}

const fx = JSON.parse(readFileSync(FIXTURE, 'utf8'));
const entry = (id) => fx.entries.find((e) => e.id === id);
const PA = entry('the-invariants-of-self-organizing-systems');
const SOS = entry('three-self-organizing-systems');
const PB = entry('cognition-as-self-organizing-system');
const LB = entry('the-lab-bubble');

const work = mkdtempSync(join(tmpdir(), 'pubfacts-'));
const base = join(work, 'base');
cpSync(DIST, base, { recursive: true, filter: (s) => !s.includes('/pagefind') });
process.on('exit', () => rmSync(work, { recursive: true, force: true }));

let n = 0;
function run(dist, fixture = FIXTURE) {
	const r = spawnSync(process.execPath, [CHECKER, '--dist', dist, '--fixture', fixture], { encoding: 'utf8' });
	return { rc: r.status, out: (r.stdout ?? '') + (r.stderr ?? '') };
}
function fresh() {
	const d = join(work, `d${++n}`);
	cpSync(base, d, { recursive: true });
	return d;
}
const pageFile = (d, route) => join(d, route, 'index.html');
function editPage(d, route, fn) {
	const p = pageFile(d, route);
	const before = readFileSync(p, 'utf8');
	const after = fn(before);
	if (after === before) throw new Error(`mutation changed nothing on ${route}`);
	writeFileSync(p, after);
}
const rep = (a, b) => (t) => {
	if (!t.includes(a)) throw new Error(`mutation target not found: ${a.slice(0, 80)}`);
	return t.replace(a, b);
};
const repAll = (a, b) => (t) => {
	if (!t.includes(a)) throw new Error(`mutation target not found: ${a.slice(0, 80)}`);
	return t.split(a).join(b);
};
const withFixture = (fn) => {
	const f = JSON.parse(JSON.stringify(fx));
	fn(f);
	const p = join(work, `fx${++n}.json`);
	writeFileSync(p, JSON.stringify(f, null, 2));
	return p;
};

const results = [];
function record(id, name, mustCatch, outcome, symptom) {
	const caught = outcome.rc !== 0;
	const symptomOk = !symptom || new RegExp(symptom).test(outcome.out);
	const ok = mustCatch ? caught && symptomOk : !caught;
	results.push({ id, name, expected: mustCatch ? 'CAUGHT' : 'PASS', actual: caught ? 'CAUGHT' : 'ESCAPED/PASS', ok, note: caught && !symptomOk ? `symptom /${symptom}/ not in output` : '' });
}
function outputCase(id, name, mutate, symptom, mustCatch = true) {
	const d = fresh();
	mutate(d);
	record(id, name, mustCatch, run(d), symptom);
}

// ---- controls -------------------------------------------------------------
record('C01', 'unmutated dist passes (control)', false, run(base));
record('C02', 'second run of unmutated dist passes (control)', false, run(base));

// ---- output-level mutations (emitted HTML) -----------------------------------
outputCase('O01', 'paper emitted as plain Article', (d) => editPage(d, PB.route, rep('"@type":["ScholarlyArticle","Article"]', '"@type":"Article"')), '@type');
outputCase('O02', 'essay emitted as ScholarlyArticle', (d) => editPage(d, LB.route, rep('"@type":"Article","headline"', '"@type":["ScholarlyArticle","Article"],"headline"')), '@type');
outputCase('O03', 'JSON-LD DOI wrong, citation_doi intact', (d) => editPage(d, PB.route, rep(`"value":"${PB.doi}"`, '"value":"10.5281/zenodo.99999999"')), 'identifier');
outputCase('O04', 'DOI wrong consistently everywhere on the page', (d) => editPage(d, PB.route, repAll(PB.doi, '10.5281/zenodo.99999999')), 'Zenodo DOI token|citation_doi');
outputCase('O05', 'false future dateModified in JSON-LD', (d) => editPage(d, PB.route, rep('"dateModified":"', '"dateModified":"2031-01-01T00:00:00.000Z","x":"')), 'dateModified');
outputCase('O06', 'wrong datePublished in JSON-LD', (d) => editPage(d, PB.route, rep(`"datePublished":"${PB.pubDate}T00:00:00.000Z"`, '"datePublished":"2025-01-01T00:00:00.000Z"')), 'datePublished');
outputCase('O07', 'article:modified_time disagrees', (d) => editPage(d, PB.route, rep('property="article:modified_time" content="', 'property="article:modified_time" content="2031-01-01T')), 'article:modified_time');
outputCase('O08', 'wrong GitHub sameAs in article author/publisher', (d) => editPage(d, PB.route, repAll('https://github.com/amulbham', 'https://github.com/someone-else')), 'sameAs');
outputCase('O09', 'wrong ORCID in homepage Person', (d) => editPage(d, '/', repAll('https://orcid.org/0009-0009-7660-4031', 'https://orcid.org/0000-0000-0000-0000')), 'sameAs');
outputCase('O10', 'og:image and JSON-LD image point to a nonexistent file', (d) => editPage(d, PB.route, repAll(`${fx.siteOrigin}/${PB.ogImagePath}`, `${fx.siteOrigin}/open-graph/nope.png`)), 'image');
outputCase('O11', 'canonical points to another page', (d) => editPage(d, PB.route, rep(`<link rel="canonical" href="${fx.siteOrigin}${PB.route}"`, `<link rel="canonical" href="${fx.siteOrigin}${PA.route}"`)), 'canonical');
outputCase('O12', 'citation_title differs from title', (d) => editPage(d, PB.route, rep(`name="citation_title" content="${PB.title}"`, `name="citation_title" content="${PB.title} (draft)"`)), 'citation_title');
outputCase('O13', 'citation_author is another person', (d) => editPage(d, PB.route, rep('name="citation_author" content="Amul Bham"', 'name="citation_author" content="Jane Doe"')), 'citation_author');
outputCase('O14', 'citation_pdf_url names another file', (d) => editPage(d, PB.route, rep(`name="citation_pdf_url" content="${fx.siteOrigin}/${PB.pdfPath}"`, `name="citation_pdf_url" content="${fx.siteOrigin}/${PB.pdfPath.replace('.pdf', '-x.pdf')}"`)), 'citation_pdf_url');
outputCase('O15', 'citation_publication_date wrong', (d) => editPage(d, PB.route, rep(`name="citation_publication_date" content="${PB.pubDate.replaceAll('-', '/')}"`, 'name="citation_publication_date" content="2026/11/03"')), 'citation_publication_date');
outputCase('O16', 'JSON-LD encoding.contentUrl wrong', (d) => editPage(d, PB.route, rep(`"contentUrl":"${fx.siteOrigin}/${PB.pdfPath}"`, `"contentUrl":"${fx.siteOrigin}/other.pdf"`)), 'encoding');
outputCase('O17', 'essay control gains Scholar tags', (d) => editPage(d, LB.route, rep('</head>', '<meta name="citation_title" content="The Lab Bubble"><meta name="citation_author" content="Amul Bham"></head>')), 'essay control');
outputCase('O18', 'About jobTitle falsified', (d) => editPage(d, '/about/', rep(`"jobTitle":"${fx.profilePage.jobTitle}"`, '"jobTitle":"Professor of Cybernetics, MIT"')), 'jobTitle');
outputCase('O19', 'About dateModified is not a timestamp', (d) => editPage(d, '/about/', (t) => (t.includes('"dateModified":"') ? t.replace(/"dateModified":"[^"]*"/, '"dateModified":"not-a-date"') : t.replace('"mainEntity"', '"dateModified":"not-a-date","mainEntity"'))), 'dateModified');
{
	// Phase-dependent: a well-formed new timestamp is accepted only under the legacy exception.
	const legacy = fx.profilePage.dateModified.mode === 'legacy-build-timestamp';
	outputCase('O20', `About dateModified is a different valid timestamp (${legacy ? 'legacy exception: must PASS' : 'no exception: must be CAUGHT'})`, (d) => editPage(d, '/about/', (t) => (t.includes('"dateModified":"') ? t.replace(/"dateModified":"[^"]*"/, '"dateModified":"2031-06-01T12:34:56.789Z"') : t.replace('"mainEntity"', '"dateModified":"2031-06-01T12:34:56.789Z","mainEntity"'))), 'dateModified', !legacy);
}
outputCase('O21', 'About dateCreated changed to a false date', (d) => editPage(d, '/about/', (t) => (t.includes('"dateCreated":"') ? t.replace(/"dateCreated":"[^"]*"/, '"dateCreated":"2020-01-01T00:00:00Z"') : t.replace('"mainEntity"', '"dateCreated":"2020-01-01T00:00:00Z","mainEntity"'))), 'dateCreated');
outputCase('O22', 'JSON-LD headline differs from title', (d) => editPage(d, PB.route, rep(`"headline":"${PB.title}"`, '"headline":"A Different Headline"')), 'headline');
outputCase('O23', 'JSON-LD license changed to CC0', (d) => editPage(d, PB.route, rep(`"license":"${fx.license.url}"`, '"license":"https://creativecommons.org/publicdomain/zero/1.0/"')), 'license');
outputCase('O24', 'author @id differs from the fixture Person @id', (d) => editPage(d, PB.route, rep(`"author":{"@type":"Person","@id":"${fx.person['@id']}"`, `"author":{"@type":"Person","@id":"${fx.siteOrigin}/about/#author"`)), '@id');
outputCase('O25', 'article og:image meta removed', (d) => editPage(d, PB.route, (t) => t.replace(new RegExp(`<meta property="og:image" content="[^"]*">`), '')), 'og:image');
outputCase('O26', 'og image file removed from dist', (d) => rmSync(join(d, PB.ogImagePath)), 'og image file');
outputCase('O27', 'sameAs: duplicate value on homepage Person', (d) => editPage(d, '/', rep(`"sameAs":["${fx.person.sameAs[0]}"`, `"sameAs":["${fx.person.sameAs[0]}","${fx.person.sameAs[0]}"`)), 'duplicate');
outputCase('O28', 'sameAs: one approved value missing (homepage Person)', (d) => editPage(d, '/', rep(`"${fx.person.sameAs[0]}",`, '')), 'missing');
outputCase('O29', 'sameAs: value substituted (About Person, wrong LinkedIn slug)', (d) => editPage(d, '/about/', rep(fx.person.sameAs.find((u) => u.includes('linkedin')), 'https://www.linkedin.com/in/someone-else/')), 'sameAs');
outputCase('O30', 'sameAs: malformed value (no scheme)', (d) => editPage(d, '/', rep(fx.person.sameAs.find((u) => u.includes('github')), 'github.com/amulbham')), 'not a well-formed URL|unexpected|missing');
outputCase('O31', 'sameAs: Substack appended to homepage Person', (d) => editPage(d, '/', rep('"sameAs":[', '"sameAs":["https://amulbham.substack.com/",')), 'duplicate|unexpected');
outputCase('O32', 'masthead role line changed', (d) => editPage(d, PB.route, rep(fx.visible.mastheadRoleLine, 'Professor, Example University, USA')), 'masthead role line');
outputCase('O33', 'AuthorNote bio stale/changed', (d) => editPage(d, PB.route, rep(fx.visible.authorNoteBio.slice(0, 40), 'Amul Bham is a university professor.')), 'AuthorNote');
outputCase('O34', 'A2-type change: one Paper A DOI anchor retargeted', (d) => {
	const token = Object.keys(PA.zenodoTokens).find((t) => PA.zenodoAnchors.some((a) => a[0].endsWith(t)));
	const needle = `href="https://doi.org/10.5281/zenodo.${token}"`;
	editPage(d, PA.route, (t) => {
		const i = t.lastIndexOf(needle);
		if (i < 0) throw new Error('A2 anchor not found');
		return t.slice(0, i) + `href="https://doi.org/10.5281/zenodo.20531588"` + t.slice(i + needle.length);
	});
}, 'Zenodo DOI');
outputCase('O35', 'Three SOS reference #1 DOI points at another DOI', (d) => {
	const token = Object.keys(SOS.zenodoTokens)[0];
	editPage(d, SOS.route, repAll(`10.5281/zenodo.${token}`, token === '20531589' ? '10.5281/zenodo.20531588' : '10.5281/zenodo.20531589'));
}, 'Zenodo DOI');
outputCase('O36', 'unknown extra research page appears', (d) => {
	cpSync(join(d, PB.route), join(d, '/research/cybernetics/unreviewed-new-paper'), { recursive: true });
}, 'no entry in the fixture');
outputCase('O37', 'fixture research page missing from dist', (d) => rmSync(join(d, LB.route), { recursive: true, force: true }), 'built page missing|has no built page');
outputCase('O38', 'visible Last-updated <time> removed on a revised entry', (d) => editPage(d, PB.route, (t) => {
	const i = t.lastIndexOf('<time');
	const j = t.indexOf('</time>', i);
	if (i < 0 || j < 0) throw new Error('no <time> element');
	return t.slice(0, i) + t.slice(j + '</time>'.length);
}), '<time');
outputCase('O39', 'extra identity link injected on a tag page', (d) => editPage(d, '/tags/cognition/', rep('</body>', '<a href="https://github.com/amulbham">x</a></body>')), 'identity links');
outputCase('O40', 'footer identity link removed from a category page', (d) => editPage(d, '/research/cybernetics/', (t) => t.replace(/<a href="https:\/\/github\.com\/amulbham"[^>]*>[\s\S]*?<\/a>/, '')), 'identity links');
outputCase('O41', 'essay control links an own-origin PDF', (d) => editPage(d, LB.route, rep('</body>', `<a href="${fx.siteOrigin}/research/ai-systems/the-lab-bubble/the-lab-bubble.pdf">PDF</a></body>`)), 'PDF');
outputCase('O42', 'paper pubDate shown wrongly in visible <time>', (d) => editPage(d, PA.route, rep(`datetime="${PA.pubDate}T00:00:00.000Z"`, 'datetime="2025-01-02T00:00:00.000Z"')), '<time');

// ---- fixture-level cases ------------------------------------------------------
record('F01', 'fixture: legacy exception on a non-About date mode is invalid', true, run(base, withFixture((f) => (f.profilePage.dateCreated = { mode: 'legacy-build-timestamp' }))), 'fixture invalid');
record('F02', 'fixture: TARGET phase may not carry the legacy exception', true, run(base, withFixture((f) => { f.phase = 'TARGET'; f.profilePage.dateModified = { mode: 'legacy-build-timestamp' }; })), 'fixture invalid');
record('F03', 'fixture drift: one approved sameAs value dropped from the fixture', true, run(base, withFixture((f) => f.person.sameAs.pop())), 'sameAs');
record('F04', 'fixture drift: approved Person name altered', true, run(base, withFixture((f) => (f.person.name = 'Amul Bhem'))), 'name|citation_author');
record('F05', 'fixture: duplicate sameAs is invalid', true, run(base, withFixture((f) => f.person.sameAs.push(f.person.sameAs[0]))), 'fixture invalid');
record('F06', 'fixture drift: approved DOI changed', true, run(base, withFixture((f) => (f.entries.find((e) => e.id === PB.id).doi = '10.5281/zenodo.11111111'))), 'DOI|citation_doi|identifier');
record('F07', 'fixture drift: approved license changed', true, run(base, withFixture((f) => (f.license.url = 'https://creativecommons.org/licenses/by/4.0/'))), 'license');
record('F08', 'fixture drift: approved About jobTitle changed', true, run(base, withFixture((f) => (f.profilePage.jobTitle = 'Professor'))), 'jobTitle');
record('F09', 'fixture drift: approved revision date added where none exists', true, run(base, withFixture((f) => (f.entries.find((e) => e.id === PA.id).revisedDate = '2026-11-03'))), 'dateModified|article:modified_time|<time');
record('F10', 'fixture: unknown phase value is invalid', true, run(base, withFixture((f) => (f.phase = 'WHATEVER'))), 'fixture invalid');

// ---- structural self-tests ----------------------------------------------------
{
	const src = readFileSync(CHECKER, 'utf8');
	const imports = [...src.matchAll(/^import .*? from '([^']+)'/gm)].map((m) => m[1]);
	const bad = imports.filter((s) => !s.startsWith('node:'));
	results.push({ id: 'S01', name: `checker imports only node: built-ins (found ${JSON.stringify(imports)})`, expected: 'PASS', actual: bad.length ? 'FAIL' : 'PASS', ok: bad.length === 0, note: bad.join(',') });
	const code = src.split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');
	const forbidden = ['personIdentity(', 'SOCIAL_LINKS', 'AUTHOR.', "'../src", 'discover-research', 'process.env'];
	const hit = forbidden.filter((w) => code.includes(w));
	results.push({ id: 'S02', name: 'checker code contains no production-helper or env-bypass reference', expected: 'PASS', actual: hit.length ? 'FAIL' : 'PASS', ok: hit.length === 0, note: hit.join(',') });
	const pkg = JSON.parse(readFileSync(join(SITE, 'package.json'), 'utf8'));
	const steps = pkg.scripts.build.split('&&').map((s) => s.trim());
	const iBuild = steps.findIndex((s) => s.startsWith('astro build'));
	const iFacts = steps.findIndex((s) => s.includes('validate-publishing-facts.mjs'));
	const iPage = steps.findIndex((s) => s.startsWith('pagefind'));
	const okOrder = iBuild >= 0 && iFacts > iBuild && iPage > iFacts;
	results.push({ id: 'S03', name: 'package.json `build` runs the checker after astro build and before pagefind (so GitHub Actions npm run build enforces it)', expected: 'PASS', actual: okOrder ? 'PASS' : 'FAIL', ok: okOrder, note: '' });
	results.push({ id: 'S04', name: 'no bypass flag in the build script', expected: 'PASS', actual: /SKIP|BYPASS|\|\|\s*true/i.test(pkg.scripts.build) ? 'FAIL' : 'PASS', ok: !/SKIP|BYPASS|\|\|\s*true/i.test(pkg.scripts.build), note: '' });
}

// ---- report -------------------------------------------------------------------
const pad = (s, w) => String(s).padEnd(w);
console.log(`\ntest-publishing-facts: fixture phase ${fx.phase}\n`);
for (const r of results) console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${pad(r.id, 4)} ${pad(r.expected, 7)} -> ${pad(r.actual, 13)} ${r.name}${r.note ? `  [${r.note}]` : ''}`);
const mut = results.filter((r) => r.expected === 'CAUGHT');
const caught = mut.filter((r) => r.actual === 'CAUGHT').length;
const bad = results.filter((r) => !r.ok);
console.log(`\ntest-publishing-facts: ${results.length} cases; mutations that must be caught: ${mut.length}, caught ${caught}, escaped ${mut.length - caught}; unexpected outcomes ${bad.length}`);
process.exit(bad.length ? 1 : 0);

// T29.3a — tests for the running-head check (R1) and the date-agreement check (R5).
//
// Pure cases need nothing private. With --workspace <dir> --expect pass|reject the suite also
// runs the three real extractors over the workspace's two review PDFs (checked-candidate and
// checked-final-form): `pass` for a corrected set, `reject` for the original set, so the same
// command proves both that the corrected PDFs are clean and that the check refuses the
// original split.
//
// Usage: node scripts/test-scholarly-correction.mjs [--workspace <dir> --expect pass|reject] [--python <python3>]
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkDates, expectedForms } from './verify-scholarly-dates.mjs';
import { checkPdf, evaluatePage, EXTRACTORS } from './verify-scholarly-header.mjs';

const args = process.argv.slice(2);
const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
let count = 0;
const ok = (label, fn) => { fn(); console.log(`PASS ${label}`); count++; };

// ---- R1: per-page evaluation -------------------------------------------------------
const TITLE = 'Cybernetics and the Structural Science of Self-Organizing Systems';
const clean = (page) => Object.fromEntries(EXTRACTORS.map((e) => [e, {
	left: page === 1 ? [] : ['Bham'], right: page === 1 ? [] : TITLE.split(' '), number: [String(page)],
}]));
const mutate = (page, edit) => { const o = clean(page); edit(o); return evaluatePage({ page, title: TITLE }, o); };

ok('a clean interior page passes in all three extractors', () => assert.deepEqual(evaluatePage({ page: 7, title: TITLE }, clean(7)), []));
ok('a clean page 1 (no running head) passes', () => assert.deepEqual(evaluatePage({ page: 1, title: TITLE }, clean(1)), []));
for (const [label, tokens] of [
	['Poppler split "B ham" is rejected', ['B', 'ham']],
	['pdfjs split "B H A M" is rejected', ['B', 'H', 'A', 'M']],
	['upper-case "BHAM" is rejected', ['BHAM']],
	['lower-case "bham" is rejected', ['bham']],
	['an extra token beside the surname is rejected', ['Bham', '—']],
	['a missing surname is rejected', []],
]) {
	const extractor = label.includes('pdfjs') ? 'pdfjs' : label.includes('Poppler') ? 'poppler' : 'mupdf';
	ok(label, () => {
		const failures = mutate(5, (o) => { o[extractor].left = tokens; });
		assert.equal(failures.length, 1);
		assert.match(failures[0], new RegExp(`^${extractor}: left running head`));
	});
}
ok('a split in ONE extractor fails the combined check even when the other two are clean', () => {
	assert.equal(mutate(9, (o) => { o.poppler.left = ['B', 'ham']; }).length, 1);
});
ok('a running head on page 1 is rejected', () => assert.equal(mutate(1, (o) => { o.pdfjs.left = ['Bham']; }).length, 1));
ok('a wrong running title is rejected', () => assert.equal(mutate(4, (o) => { o.mupdf.right = ['Something', 'else']; }).length, 1));
ok('a wrong page number is rejected', () => assert.equal(mutate(12, (o) => { o.poppler.number = ['11']; }).length, 1));
ok('a missing extractor observation is rejected', () => assert.ok(evaluatePage({ page: 3, title: TITLE }, { poppler: clean(3).poppler, mupdf: clean(3).mupdf }).some((f) => f.startsWith('pdfjs:'))));

// ---- R5: date agreement --------------------------------------------------------------
const page = ({ time = '2000-01-01T00:00:00.000Z', visible = 'Jan 1, 2000', highwire = '2000/01/01', published = time, ld = time, modified = ld } = {}) => `<!doctype html><html><head>
<meta name="citation_publication_date" content="${highwire}"><meta property="article:published_time" content="${published}">
<script type="application/ld+json">${JSON.stringify({ '@type': ['ScholarlyArticle', 'Article'], datePublished: ld, dateModified: modified })}</script></head>
<body><div class="date meta"><time datetime="${time}">${visible}</time><span> · 79 min read</span></div></body></html>`;
const FIXTURE = { mode: 'final-form', date: '2000-01-01' };

ok('forms of the fixture date are derived independently in UTC', () => assert.deepEqual(expectedForms('2000-01-01'), { iso: '2000-01-01T00:00:00.000Z', visible: 'Jan 1, 2000', highwire: '2000/01/01' }));
ok('an impossible fixture date is refused', () => assert.throws(() => expectedForms('2000-02-30')));
ok('agreeing final-form dates pass', () => assert.deepEqual(checkDates(page(), FIXTURE), []));
for (const [label, overrides] of [
	['the reviewed visible-date shift (Dec 31, 1999) is rejected', { visible: 'Dec 31, 1999' }],
	['a wrong <time datetime> is rejected', { time: '2000-01-02T00:00:00.000Z', published: '2000-01-01T00:00:00.000Z', ld: '2000-01-01T00:00:00.000Z' }],
	['a wrong Highwire date is rejected', { highwire: '1999/12/31' }],
	['a wrong JSON-LD datePublished is rejected', { ld: '1999-12-31T00:00:00.000Z', modified: '2000-01-01T00:00:00.000Z' }],
	['a JSON-LD dateModified that differs is rejected', { modified: '2000-01-03T00:00:00.000Z' }],
	['a wrong article:published_time is rejected', { published: '1999-12-31T00:00:00.000Z' }],
]) ok(label, () => assert.ok(checkDates(page(overrides), FIXTURE).length >= 1));
ok('a final-form page with no date at all is rejected', () => assert.ok(checkDates('<html><head></head><body></body></html>', FIXTURE).length >= 3));
ok('a candidate with no dates passes', () => assert.deepEqual(checkDates('<html><head><meta name="robots" content="noindex, nofollow"></head><body><div class="date meta"><span>79 min read</span></div></body></html>', { mode: 'candidate' }), []));
for (const [label, html] of [
	['a candidate that shows a <time> is rejected', '<body><time datetime="2000-01-01T00:00:00.000Z">Jan 1, 2000</time></body>'],
	['a candidate with Highwire date is rejected', '<head><meta name="citation_publication_date" content="2000/01/01"></head>'],
	['a candidate with JSON-LD is rejected', '<script type="application/ld+json">{"datePublished":"2000-01-01"}</script>'],
	['a candidate with article:published_time is rejected', '<head><meta property="article:published_time" content="2000-01-01T00:00:00.000Z"></head>'],
]) ok(label, () => assert.ok(checkDates(html, { mode: 'candidate' }).length >= 1));

// ---- Real extractors over a workspace's review PDFs ----------------------------------
const workspace = option('--workspace');
if (workspace) {
	const expectation = option('--expect');
	assert.ok(['pass', 'reject'].includes(expectation), '--expect pass|reject is required with --workspace');
	const python = option('--python') ?? process.env.SCHOLARLY_PYTHON ?? 'python3';
	for (const dir of ['checked-candidate', 'checked-final-form']) {
		const manifest = JSON.parse(readFileSync(join(workspace, dir, 'manifest.json'), 'utf8'));
		const result = await checkPdf(join(workspace, dir, manifest.artifact), { python });
		if (expectation === 'pass') {
			ok(`${dir}: every page passes in Poppler, MuPDF and pdfjs-dist (${result.pageCount} pages)`, () => assert.deepEqual(result.failures, []));
		} else {
			ok(`${dir}: the check rejects the original split (${result.failures.length} failures)`, () => {
				assert.ok(result.failures.length > 0);
				assert.ok(result.failures.some((f) => f.includes('poppler:') && f.includes('["B","ham"]')), 'Poppler "B ham" not reported');
				assert.ok(result.failures.some((f) => f.includes('pdfjs:') && f.includes('["B","H","A","M"]')), 'pdfjs "B H A M" not reported');
			});
		}
	}
}
console.log(`${count} scholarly correction cases passed`);

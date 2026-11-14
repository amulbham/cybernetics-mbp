import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';
import sirv from 'sirv';
import { sha256 } from './scholarly-input.mjs';

const [candidateDir, executablePath, evidence] = process.argv.slice(2).map((argument) => resolve(argument));
const manifest = JSON.parse(readFileSync(join(candidateDir, 'manifest.json'), 'utf8'));
assert.equal(manifest.mode, 'candidate');
const pdf = readFileSync(join(candidateDir, manifest.artifact));
assert.equal(sha256(pdf), manifest.sha256);
const render = sirv(join(candidateDir, 'html'), { maxAge: 0 });
const server = createServer((request, response) => {
	response.setHeader('X-Robots-Tag', 'noindex, nofollow');
	if (request.url === manifest.route + manifest.artifact) {
		response.setHeader('Content-Type', 'application/pdf');
		response.end(pdf);
	} else render(request, response);
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
	browser = await puppeteer.launch({ executablePath, headless: 'shell', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
	mkdirSync(evidence, { recursive: true });
	const results = [];
	for (const viewport of [{width: 1440, height: 960}, {width: 390, height: 844}]) {
		const page = await browser.newPage();
		const errors = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.setRequestInterception(true);
		page.on('request', (request) => {
			if (request.url().startsWith(origin + '/') || request.url().startsWith('data:')) void request.continue();
			else void request.abort();
		});
		await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
		const response = await page.goto(origin + manifest.route, {waitUntil: 'networkidle0'});
		assert.equal(response.status(), 200);
		const review = await page.evaluate(async () => {
			await document.fonts.ready;
			const find = (selector) => document.querySelector(selector);
			const box = (selector) => {
				const element = find(selector);
				return element && { text: element.textContent.trim().slice(0, 180),
					visible: !!element.getClientRects().length };
			};
			const headings = [...document.querySelectorAll('article h1, article h2, article h3')];
			const references = ['8','9'].map((number) => {
				const link = find(`article a[href="#ref-${number}"]`);
				const target = document.getElementById(`ref-${number}`);
				return { text: link?.textContent, target: target?.textContent.trim().slice(0, 90) };
			});
			const table = find('.scholarly-screen-table');
			table.focus();
			table.scrollLeft = 100;
			const focused = document.activeElement === table;
			const tableScrolls = table.scrollLeft > 0;
			table.scrollLeft = 0;
			table.blur();
			return {
				title: box('h1'), masthead: box('.masthead'), abstract: box('#abstract'),
				findings: box('.key-findings'), matrix: box('.scholarly-screen-table'), primitive: box('.research-primitive'),
				websiteAuthor: box('.author-note'), printNote: box('.scholarly-pdf-note'), download: box('.pdf-link a'),
				doi: find('.masthead a[href^="https://doi.org/"]')?.getAttribute('href'),
				robots: find('meta[name="robots"]')?.content, canonical: find('link[rel="canonical"]')?.href,
				scholarlyTags: document.querySelectorAll('meta[name^="citation_"], script[type="application/ld+json"]').length,
				hasNavigation: !!find('header nav'), hasSkip: !!find('a[href="#main-content"]'),
				hasToc: !!find('a[href="#abstract"]'), references, tableFocus: focused, tableScrolls,
				tableHeaders: table.querySelectorAll('th[scope="col"]').length,
				visibleTables: [...document.querySelectorAll('article table')].filter((element) => element.getClientRects().length).length,
				headings: headings.map((element) => element.tagName),
				bodyWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
			};
		});
		assert.equal(review.bodyWidth, viewport.width);
		assert.equal(review.visibleTables, 16);
		assert.equal(review.tableHeaders, 8);
		assert.ok(review.hasNavigation && review.hasSkip && review.hasToc && review.tableFocus);
		assert.match(review.robots, /noindex/);
		assert.equal(review.canonical, undefined);
		assert.equal(review.scholarlyTags, 0);
		assert.ok(!review.printNote.visible);
		for (const key of ['title','masthead','abstract','findings','matrix','primitive','websiteAuthor','download']) assert.ok(review[key].visible, key);
		assert.match(review.references[0].text, /2026a/);
		assert.match(review.references[1].text, /2026b/);
		if (viewport.width === 390) assert.ok(review.tableScrolls, 'Mobile table must scroll within its wrapper');
		const citation = await page.$('a[href="#ref-8"]');
		await citation.evaluate((anchor) => anchor.click());
		await page.waitForFunction(() => location.hash === '#ref-8');
		const download = await page.$eval('.pdf-link a', (anchor) => anchor.href);
		const downloaded = await fetch(download);
		assert.match(downloaded.headers.get('content-type'), /^application\/pdf/);
		assert.equal(sha256(Buffer.from(await downloaded.arrayBuffer())), manifest.sha256);
		await page.goto(origin + manifest.route, {waitUntil: 'networkidle0'});
		await page.evaluate(() => document.fonts.ready);
		const screenshots = [];
		for (let y = 0; y < review.height; y += 2400) {
			const height = Math.min(2400, review.height - y);
			const filename = `${viewport.width}-${String(screenshots.length + 1).padStart(2, '0')}.jpg`;
			await page.screenshot({path: join(evidence, filename), type: 'jpeg', quality: 87,
				captureBeyondViewport: true, clip: {x: 0, y, width: viewport.width, height}});
			screenshots.push({ filename, y, height });
		}
		assert.deepEqual(errors, []);
		results.push({viewport, review, download, downloadSha256: manifest.sha256, screenshots, errors});
		await page.close();
	}
	writeFileSync(join(evidence, 'browser-qa.json'), JSON.stringify({ route: manifest.route, results }, null, 2) + '\n');
} finally {
	if (browser) await browser.close();
	await new Promise((done) => server.close(done));
}

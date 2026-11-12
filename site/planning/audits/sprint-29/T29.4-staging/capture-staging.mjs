// T29.4 (staging) — Executor-run desktop/mobile review captures and article checks against the PUBLIC immutable staging URL.
//
// Needs Playwright (`NODE_PATH=$(npm root -g) node capture-staging.mjs ...`) and a Chromium (`--browser`, default
// /opt/pw-browsers/chromium). It opens the article at the IMMUTABLE deployment URL at 1440x900 and at 390x844,
// takes ordered viewport screenshots from top to bottom (desktop-NNN.png, mobile-NNN.png), records page metrics
// (including the SHA-256 of the HTML the browser fetched), runs the DOM checks below, runs a Pagefind search smoke test,
// and builds capture-index.json from an EXISTING PASSING verify-staging report, tying every image to the immutable URL,
// the candidate PDF hash and the upload digest.
// DOM checks: heading, candidate label, download link resolving to the candidate PDF and its bytes (hash) fetched by the
// browser, 16 scholarly tables, citation links to #ref-8 and #ref-9, noindex meta and no canonical, no horizontal page
// overflow on mobile, a horizontally scrollable wide table, TOC anchor navigation, and search finding a published paper.
// Usage: NODE_PATH=$(npm root -g) node capture-staging.mjs --origin https://<8hex>.cybernetics-mbp-site.pages.dev
//          --report staging-verification-report.json --out <captures dir> [--browser <chromium>]
// (--local-test is accepted only for a loopback origin, for the kit's own dry run.)
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { HERE, arg, isLoopback, loadPins, requireKitIntegrity, stagingHosts } from './kit-common.mjs';
import { buildCaptureIndex } from './verify-staging.mjs';

requireKitIntegrity('capture-staging');
const argv = process.argv.slice(2);
const pins = loadPins(join(HERE, 'pins.json'));
const origin = (arg(argv, '--origin') ?? '').replace(/\/$/, '');
const local = argv.includes('--local-test');
if (!origin || !(stagingHosts(pins.project).immutable.test(origin) || (local && isLoopback(origin)))) {
	console.error(`--origin must be the immutable deployment URL https://<8 hex>.${pins.project}.pages.dev`);
	process.exit(2);
}
const out = resolve(arg(argv, '--out', 'captures'));
const reportPath = resolve(arg(argv, '--report', 'staging-verification-report.json'));
let chromium;
try {
	({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {
	console.error('Playwright is not available (set NODE_PATH to the global node_modules)');
	process.exit(2);
}
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: arg(argv, '--browser', '/opt/pw-browsers/chromium'), args: ['--no-sandbox'] });
const assertions = [];
const check = (set, name, ok, detail = '') => assertions.push({ set, name, ok: !!ok, detail: String(detail) });
const article = `${origin}${pins.route}`;

for (const [kind, viewport, mobile] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
	const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, ignoreHTTPSErrors: local });
	const page = await context.newPage();
	await page.goto(article, { waitUntil: 'networkidle', timeout: 60000 });
	const metrics = await page.evaluate(async () => {
		const bytes = await (await fetch(location.href, { cache: 'no-store' })).arrayBuffer();
		const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((x) => x.toString(16).padStart(2, '0')).join('');
		return { url: location.href, innerWidth, innerHeight, scrollHeight: document.documentElement.scrollHeight, devicePixelRatio, routeHtmlSha256: digest, userAgent: navigator.userAgent };
	});
	writeFileSync(join(out, `page-metrics-${kind}.json`), JSON.stringify(metrics, null, 1));
	const dom = await page.evaluate(() => ({
		h1: document.querySelector('h1')?.textContent ?? '',
		text: document.body.innerText,
		robots: document.querySelector('meta[name="robots"]')?.content ?? null,
		canonical: !!document.querySelector('link[rel="canonical"]'),
		jsonld: document.querySelectorAll('script[type="application/ld+json"]').length,
		citationMeta: document.querySelectorAll('meta[name^="citation_"]').length,
		tables: document.querySelectorAll('table').length,
		ref8: document.querySelectorAll('a[href="#ref-8"]').length,
		ref9: document.querySelectorAll('a[href="#ref-9"]').length,
		pdfHref: [...document.querySelectorAll('a')].find((a) => /Download candidate PDF/.test(a.textContent))?.href ?? null,
		overflow: document.documentElement.scrollWidth - innerWidth,
		wideScroll: [...document.querySelectorAll('.table-container')].some((c) => c.scrollWidth > c.clientWidth + 1),
		keyFindings: /Key findings/i.test(document.body.innerText),
	}));
	check(kind, 'article heading', dom.h1.includes('Cybernetics and the Structural'), dom.h1);
	check(kind, 'candidate label shown', dom.text.includes('Candidate specimen'));
	check(kind, 'noindex meta, no canonical, no JSON-LD, no Highwire', dom.robots === 'noindex, nofollow' && !dom.canonical && dom.jsonld === 0 && dom.citationMeta === 0, JSON.stringify({ r: dom.robots, c: dom.canonical, j: dom.jsonld, m: dom.citationMeta }));
	check(kind, 'scholarly tables present (16 source tables, screen)', dom.tables >= 16, dom.tables);
	check(kind, 'Bham 2026a and 2026b link to refs 8 and 9', dom.ref8 >= 1 && dom.ref9 >= 1, `${dom.ref8}/${dom.ref9}`);
	check(kind, 'Key findings shown', dom.keyFindings);
	check(kind, 'download link resolves to the candidate PDF path', dom.pdfHref === `${origin}/${pins.candidate.pdfPath}`, dom.pdfHref);
	if (dom.pdfHref) {
		const bytes = await (await context.request.get(dom.pdfHref)).body();
		check(kind, 'download bytes equal the pinned candidate PDF', createHash('sha256').update(bytes).digest('hex') === pins.candidate.sha256);
	}
	if (mobile) {
		check(kind, 'no horizontal page overflow on mobile', dom.overflow <= 1, dom.overflow);
		check(kind, 'a wide table scrolls inside its container', dom.wideScroll);
	}
	const toc = await page.$('[data-toc-link]');
	if (!mobile && toc) {
		const before = await page.evaluate(() => location.hash);
		await toc.click();
		await page.waitForTimeout(300);
		check(kind, 'TOC anchor navigation changes the hash', (await page.evaluate(() => location.hash)) !== before);
		await page.evaluate(() => window.scrollTo(0, 0));
	}
	await page.evaluate(() => window.scrollTo(0, 0));
	const steps = Math.ceil(metrics.scrollHeight / metrics.innerHeight);
	for (let k = 0; k < steps; k++) {
		await page.evaluate((y) => window.scrollTo(0, y), k * metrics.innerHeight);
		await page.waitForTimeout(80);
		await page.screenshot({ path: join(out, `${kind}-${String(k + 1).padStart(3, '0')}.png`) });
	}
	if (!mobile) {
		const search = await page.evaluate(async () => {
			const pf = await import('/pagefind/pagefind.js');
			await pf.init();
			const urls = [];
			for (const q of ['invariants', 'Chisel']) {
				const r = await pf.search(q);
				const urlsForQ = [];
				for (const hit of r.results.slice(0, 5)) urlsForQ.push((await hit.data()).url);
				urls.push([q, urlsForQ]);
			}
			return urls;
		});
		check(kind, 'search finds the Invariants paper', search[0][1].some((u) => u.includes('the-invariants-of-self-organizing-systems')), JSON.stringify(search[0]));
		check(kind, 'search finds the Chisel Fallacy', search[1][1].some((u) => u.includes('the-chisel-fallacy')), JSON.stringify(search[1]));
	}
	await context.close();
}
await browser.close();
writeFileSync(join(out, 'capture-assertions.json'), JSON.stringify(assertions, null, 1));
const { problems, index } = buildCaptureIndex({ dir: out, origin, pins, reportPath, allowLoopback: local });
writeFileSync(join(out, 'capture-index.json'), JSON.stringify({ ...index, assertions }, null, 1));
for (const a of assertions) console.log(`${a.ok ? 'PASS' : 'FAIL'} [${a.set}] ${a.name}${a.ok ? '' : ` — ${a.detail}`}`);
for (const p of problems) console.log(`CAPTURE FAIL ${p}`);
const bad = assertions.filter((a) => !a.ok).length + problems.length;
console.log(`capture-staging: desktop ${index.captures.desktop?.files.length ?? 0} images, mobile ${index.captures.mobile?.files.length ?? 0} images — ${bad ? 'FAILED' : 'PASS'}`);
process.exit(bad ? 1 : 0);

// T29.4 (staging) — public verification of the Paper C candidate on the EXISTING staging target. No credentials, no cookies.
//
// Checks, on the IMMUTABLE deployment URL and on the staging alias, from the pinned inventory:
//  * every inventory file except the control files (`_headers`, `_redirects`: Pages applies them and does not serve
//    them) is requested and must return HTTP 200; the seven PDFs and every non-HTML file are compared BYTE-EXACT;
//    the article page is compared byte-exact with the pinned route-HTML hash; other HTML pages are compared
//    informationally and counted (Cloudflare may rewrite markup such as e-mail obfuscation);
//  * all seven PDF path/hash pairs (six historical + the candidate) from the pins, by name;
//  * the hosted effect of `_headers`: X-Robots-Tag exactly `noindex, nofollow` on every 200 response;
//  * the hosted effect of `_redirects`: each of the 25 rules answers with its status and target (first response judged);
//  * closed indexing: robots.txt `Disallow: /`, sitemap lists no Paper C route, the article carries the noindex meta
//    and no canonical, JSON-LD, Highwire or date;
//  * the Pagefind search assets are served byte-exact.
// Separately: --production checks that amulbham.com and www serve neither the article nor the PDF, still serve the six
// approved PDFs byte-exact and a 16-URL sitemap; --rollback-check compares the staging alias with the recorded
// pre-upload state after a rollback.
//
// Usage: node verify-staging.mjs --origin https://<8hex>.cybernetics-mbp-site.pages.dev [--alias <alias>] [--production]
//          [--out report.json] | --production-only | --rollback-check
// Exit: 0 pass; 1 a check failed; 2 bad usage, a modified kit or an errored request.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { HERE, arg, isLoopback, loadJson, loadPins, pngInfo, readInventory, readTextLoose, requireInventoryMatchesPins, requireKitIntegrity, sha256, stagingHosts } from './kit-common.mjs';

async function get(url, { method = 'GET', headers = {} } = {}) {
	const res = await fetch(url, { method, redirect: 'manual', cache: 'no-store', headers: { 'user-agent': 'T29.4-staging-verify', accept: '*/*', ...headers }, signal: AbortSignal.timeout(60000) });
	return { status: res.status, headers: res.headers, body: method === 'HEAD' ? Buffer.alloc(0) : Buffer.from(await res.arrayBuffer()) };
}

/** Directory URLs for index.html, extension-less URLs for other HTML (Pages redirects `.html`). */
export const urlPathFor = (path) => (path === 'index.html' ? '/' : path.endsWith('/index.html') ? `/${path.slice(0, -'index.html'.length)}` : /\.html?$/i.test(path) ? `/${path.replace(/\.html?$/i, '')}` : `/${path}`);

export const parseRedirects = (text) => text.split(/\r?\n/).filter((l) => l.trim() && !l.startsWith('#')).map((l) => { const [from, to, status] = l.trim().split(/\s+/); return { from, to, status: Number(status) }; });

export async function verifyHost({ origin, pins, inventory, redirects }) {
	const failures = [];
	const rows = [];
	const control = new Set(pins.controlFiles);
	const robots = new Set();
	const pdfPaths = new Set([...pins.historical.map((h) => h.path), pins.candidate.pdfPath]);
	const routePage = `${pins.route.slice(1)}index.html`;
	const isHtml = (p) => /\.html?$/i.test(p);
	let htmlMismatches = 0;
	for (const rec of inventory) {
		if (control.has(rec.path)) { rows.push({ path: rec.path, kind: 'control-file', checked: false }); continue; }
		const kind = pdfPaths.has(rec.path) ? 'pdf' : isHtml(rec.path) ? 'html' : 'asset';
		let r;
		try {
			r = await get(new URL(urlPathFor(rec.path), origin).toString());
		} catch (err) {
			failures.push(`${rec.path}: request failed (${err.message})`);
			rows.push({ path: rec.path, kind, status: null });
			continue;
		}
		const hash = sha256(r.body);
		const row = { path: rec.path, kind, status: r.status, bytes: r.body.length, sha256: hash, match: hash === rec.sha256 };
		rows.push(row);
		robots.add(r.headers.get('x-robots-tag') ?? '(none)');
		if (r.status >= 300 && r.status < 400) { failures.push(`${rec.path}: unexpected redirect ${r.status} to ${r.headers.get('location')}`); continue; }
		if (rec.path === '404.html') continue; // the error page: informational only
		if (r.status !== 200) { failures.push(`${rec.path}: HTTP ${r.status}`); continue; }
		if (kind === 'pdf') {
			if (!(r.headers.get('content-type') ?? '').includes('application/pdf')) failures.push(`${rec.path}: content-type ${r.headers.get('content-type')}`);
			if (!row.match) failures.push(`${rec.path}: SHA-256 ${hash} != pinned ${rec.sha256}`);
		} else if (kind === 'asset' && !row.match) failures.push(`${rec.path}: SHA-256 differs from the inventory`);
		else if (kind === 'html' && !row.match) {
			htmlMismatches++;
			if (rec.path === routePage) failures.push(`article page SHA-256 ${hash} != pinned ${pins.candidate.routeHtmlSha256} (the page under review must be byte-exact)`);
		}
		if (r.headers.get('x-robots-tag') !== pins.robotsHeader) failures.push(`${rec.path}: X-Robots-Tag is ${JSON.stringify(r.headers.get('x-robots-tag'))}, expected "${pins.robotsHeader}"`);
		if (rec.path === routePage) {
			const html = r.body.toString('utf8');
			for (const s of pins.articleMarkers.required) if (!html.includes(s)) failures.push(`article page lacks required text: ${s}`);
			for (const s of pins.articleMarkers.forbidden) if (html.includes(s)) failures.push(`article page contains forbidden text: ${s}`);
		}
	}
	const sevenPdfs = [...pins.historical, { path: pins.candidate.pdfPath, sha256: pins.candidate.sha256 }].map((p) => {
		const row = rows.find((x) => x.path === p.path);
		return { path: p.path, expected: p.sha256, observed: row?.sha256 ?? null, match: row?.sha256 === p.sha256 };
	});
	for (const s of sevenPdfs) if (!s.match) failures.push(`pinned PDF mismatch: ${s.path}`);
	// Closed indexing, from the served files themselves.
	const body = (p) => rows.find((x) => x.path === p);
	const robotsTxt = await get(new URL('/robots.txt', origin).toString()).catch(() => null);
	if (!robotsTxt || robotsTxt.status !== 200 || !robotsTxt.body.toString('utf8').includes('Disallow: /')) failures.push('robots.txt does not serve `Disallow: /`');
	const sitemap = await get(new URL('/sitemap-0.xml', origin).toString()).catch(() => null);
	const locs = sitemap ? [...sitemap.body.toString('utf8').matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]) : [];
	if (!sitemap || sitemap.status !== 200) failures.push('sitemap-0.xml is not served');
	else if (locs.some((l) => l.includes(pins.route))) failures.push('the sitemap lists the Paper C route');
	// `_redirects`: the first response of every rule.
	const redirectResults = [];
	for (const rule of redirects) {
		try {
			const r = await get(new URL(rule.from, origin).toString());
			const loc = r.headers.get('location');
			const lu = loc === null ? null : new URL(loc, origin);
			const okTarget = lu !== null && lu.origin === new URL(origin).origin && lu.pathname + lu.search === rule.to;
			redirectResults.push({ from: rule.from, status: r.status, location: loc, ok: r.status === rule.status && okTarget });
			if (!(r.status === rule.status && okTarget)) failures.push(`redirect ${rule.from}: ${r.status} ${loc} (expected ${rule.status} ${rule.to})`);
		} catch (err) {
			failures.push(`redirect ${rule.from}: request failed (${err.message})`);
		}
	}
	// Informational: control files must not be served as assets.
	const controlServed = {};
	for (const f of pins.controlFiles) { try { controlServed[f] = (await get(new URL(`/${f}`, origin).toString())).status; } catch { controlServed[f] = null; } }
	return { origin, files: rows.length, sevenPdfs, htmlMismatches, xRobotsTagValues: [...robots].sort(), sitemapUrlCount: locs.length, redirectResults, controlServed, failures, rows };
}

/** amulbham.com must be untouched: no Paper C route or PDF, six approved PDFs byte-exact, a 16-URL sitemap. */
export async function verifyProduction({ hosts, pins }) {
	const failures = [];
	const records = [];
	for (const host of hosts) {
		for (const [name, path, opts] of [['article GET', pins.route], ['article index.html GET', `${pins.route}index.html`], ['pdf GET', `/${pins.candidate.pdfPath}`], ['pdf HEAD', `/${pins.candidate.pdfPath}`, { method: 'HEAD' }], ['pdf Range', `/${pins.candidate.pdfPath}`, { headers: { Range: 'bytes=0-15' } }]]) {
			try {
				const r = await get(new URL(path, host).toString(), opts);
				records.push({ host, request: name, status: r.status });
				if (r.status !== 404 || r.body.toString('latin1').includes('%PDF-')) failures.push(`${host} ${name}: expected 404 with no artifact, got ${r.status}`);
			} catch (err) { failures.push(`${host} ${name}: request failed (${err.message})`); }
		}
	}
	const host = hosts[0];
	try {
		const sm = await get(new URL('/sitemap-0.xml', host).toString());
		const n = [...sm.body.toString('utf8').matchAll(/<loc>/g)].length;
		records.push({ host, request: 'sitemap', status: sm.status, urls: n });
		if (n !== pins.productionSitemapUrlCount) failures.push(`${host} sitemap lists ${n} URLs, expected ${pins.productionSitemapUrlCount}`);
		if (sm.body.toString('utf8').includes(pins.route)) failures.push(`${host} sitemap lists the Paper C route`);
	} catch (err) { failures.push(`${host} sitemap: ${err.message}`); }
	for (const h of pins.historical) {
		try {
			const r = await get(new URL(`/${h.path}`, host).toString());
			const ok = r.status === 200 && sha256(r.body) === h.sha256;
			records.push({ host, request: `pdf ${h.path}`, status: r.status, match: ok });
			if (!ok) failures.push(`${host} production PDF differs or is missing: ${h.path}`);
		} catch (err) { failures.push(`${host} production PDF ${h.path}: ${err.message}`); }
	}
	return { hosts, records, failures };
}

/** After a rollback: HTML pages and routes must equal the recorded pre-upload state (PDFs are re-typeset by the normal workflow and are informational). */
export async function rollbackCheck({ alias, stateText }) {
	const [, ...rows] = stateText.split(/\r?\n/).filter(Boolean);
	const failures = [];
	const pdfDiffs = [];
	for (const line of rows) {
		const [path, status, hash] = line.split('\t');
		const r = await get(new URL(path, alias).toString());
		const same = r.status === Number(status) && sha256(r.body) === hash;
		if (path.endsWith('.pdf')) { if (!same) pdfDiffs.push(path); continue; }
		if (!same) failures.push(`rollback: ${path} is ${r.status} ${sha256(r.body).slice(0, 12)}, recorded ${status} ${hash.slice(0, 12)}`);
	}
	return { alias, failures, pdfDiffs };
}

const NEED = { desktop: { width: 1440, tol: 2 }, mobile: { width: 390, tol: 2 } };
const MIN_IMAGE_BYTES = 4096;

/** Validate the Executor-taken captures and build the capture index (tied to the immutable URL, the candidate hash and the report). */
export function buildCaptureIndex({ dir, origin, pins, reportPath, allowLoopback = false }) {
	const problems = [];
	if (!(stagingHosts(pins.project).immutable.test(origin) || (allowLoopback && isLoopback(origin)))) problems.push(`origin ${origin} is not an immutable deployment URL https://<8 hex>.${pins.project}.pages.dev`);
	let report; let reportSha256 = null;
	try { const text = readFileSync(reportPath); reportSha256 = sha256(text); report = JSON.parse(text.toString('utf8')); } catch { problems.push('the verification report is missing or not JSON'); }
	if (report) {
		if (report.origin !== origin) problems.push(`report origin ${report.origin} differs from ${origin}`);
		if (!Array.isArray(report.failures) || report.failures.length) problems.push('the verification report did not pass');
		if (report.immutable?.sevenPdfs?.at(-1)?.observed !== pins.candidate.sha256) problems.push('the report did not observe the pinned candidate PDF');
	}
	const kinds = {}; const seen = new Map(); const files = readdirSync(dir);
	for (const kind of ['desktop', 'mobile']) {
		let m;
		try { m = loadJson(join(dir, `page-metrics-${kind}.json`)); } catch { problems.push(`${kind}: page-metrics-${kind}.json is missing or not JSON`); continue; }
		const dpr = m.devicePixelRatio || 1;
		if (!(dpr >= 1)) problems.push(`${kind}: devicePixelRatio ${m.devicePixelRatio} is below 1`);
		if (!(m.scrollHeight >= (pins.captureMinScrollHeight ?? 20000))) problems.push(`${kind}: scrollHeight ${m.scrollHeight} is implausibly small for the article`);
		if (m.url !== `${origin}${pins.route}`) problems.push(`${kind}: metrics URL ${m.url} is not exactly the immutable article URL ${origin}${pins.route}`);
		if (Math.abs(m.innerWidth - NEED[kind].width) > NEED[kind].tol) problems.push(`${kind}: viewport width ${m.innerWidth} is not ${NEED[kind].width} (±${NEED[kind].tol})`);
		if (m.routeHtmlSha256 !== pins.candidate.routeHtmlSha256) problems.push(`${kind}: the fetched article HTML hashes to ${m.routeHtmlSha256}, expected ${pins.candidate.routeHtmlSha256}`);
		const names = files.filter((f) => new RegExp(`^${kind}-\\d{3}\\.png$`).test(f)).sort();
		names.forEach((n, i) => { if (n !== `${kind}-${String(i + 1).padStart(3, '0')}.png`) problems.push(`${kind}: numbering is not contiguous at ${n}`); });
		let total = 0;
		const list = names.map((n) => {
			const bytes = readFileSync(join(dir, n)); const size = pngInfo(bytes); const hash = sha256(bytes);
			if (!size) problems.push(`${n}: not a valid PNG`);
			else {
				if (bytes.length < MIN_IMAGE_BYTES) problems.push(`${n}: only ${bytes.length} bytes`);
				if (size.width !== Math.round(m.innerWidth * dpr)) problems.push(`${n}: width ${size.width} != innerWidth*dpr`);
				if (size.height > 16384) problems.push(`${n}: height ${size.height} exceeds 16384 px`);
				total += size.height;
			}
			if (seen.has(hash)) problems.push(`${n}: identical bytes to ${seen.get(hash)}`);
			seen.set(hash, n);
			return { file: n, sha256: hash, bytes: bytes.length, ...(size ?? {}) };
		});
		if (!names.length) problems.push(`${kind}: no ${kind}-NNN.png captures`);
		else if (total < Math.ceil(m.scrollHeight * dpr * 0.99)) problems.push(`${kind}: captured height ${total}px is less than the page height ${m.scrollHeight * dpr}px`);
		kinds[kind] = { metrics: m, capturedHeight: total, files: list };
	}
	return { problems, index: { origin, articleUrl: `${origin}${pins.route}`, candidatePdfSha256Pinned: pins.candidate.sha256, routeHtmlSha256Pinned: pins.candidate.routeHtmlSha256, correctionCommit: pins.correctionCommit, uploadDigest: pins.inventory.digest, verificationReportSha256: reportSha256, reportPassed: !!report && Array.isArray(report.failures) && report.failures.length === 0, builtAt: new Date().toISOString(), captures: kinds } };
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
	requireKitIntegrity('verify-staging');
	const argv = process.argv.slice(2);
	const pins = loadPins(resolve(arg(argv, '--pins') ?? join(HERE, 'pins.json')));
	const hosts = stagingHosts(pins.project);
	const inventory = readInventory(resolve(arg(argv, '--inventory') ?? join(HERE, pins.inventory.file)));
	requireInventoryMatchesPins('verify-staging', inventory, pins);
	const out = arg(argv, '--out', 'staging-verification-report.json');
	const local = argv.includes('--local-test');
	let failed = false;
	if (argv.includes('--rollback-check')) {
		const r = await rollbackCheck({ alias: hosts.alias, stateText: readTextLoose(join(HERE, pins.preUploadState)) });
		for (const f of r.failures) console.log(`FAIL ${f}`);
		console.log(`rollback check: ${r.failures.length} page differences; PDFs differing from the recorded state (informational): ${r.pdfDiffs.length}`);
		process.exit(r.failures.length ? 1 : 0);
	}
	if (argv.includes('--production-only')) {
		const r = await verifyProduction({ hosts: pins.productionHosts, pins });
		for (const f of r.failures) console.log(`FAIL ${f}`);
		console.log(r.failures.length ? 'verify-staging --production-only: FAILED' : 'verify-staging --production-only: PASS');
		process.exit(r.failures.length ? 1 : 0);
	}
	const origin = (arg(argv, '--origin') ?? '').replace(/\/$/, '');
	if (!origin || !(hosts.immutable.test(origin) || (local && isLoopback(origin)))) {
		console.error(`--origin must be the immutable deployment URL https://<8 hex>.${pins.project}.pages.dev printed by Wrangler (not the alias)`);
		process.exit(2);
	}
	const alias = (arg(argv, '--alias') ?? (local ? origin : hosts.alias)).replace(/\/$/, '');
	if (alias !== hosts.alias && !(local && isLoopback(alias))) { console.error(`--alias must be ${hosts.alias}`); process.exit(2); }
	const redirectsText = readTextLoose(join(HERE, pins.redirectsFile));
	if (sha256(Buffer.from(redirectsText.replace(/\r\n/g, '\n'))) !== pins.redirectsSha256) { console.error('the redirects reference differs from the pinned hash'); process.exit(2); }
	const redirects = parseRedirects(redirectsText);
	const immutable = await verifyHost({ origin, pins, inventory, redirects });
	const aliasResult = alias === origin ? null : await verifyHost({ origin: alias, pins, inventory, redirects });
	const production = argv.includes('--production') ? await verifyProduction({ hosts: pins.productionHosts, pins }) : null;
	const failures = [...immutable.failures.map((f) => `immutable: ${f}`), ...(aliasResult?.failures ?? []).map((f) => `alias: ${f}`), ...(production?.failures ?? []).map((f) => `production: ${f}`)];
	const report = { origin, alias, when: new Date().toISOString(), uploadDigest: pins.inventory.digest, candidatePdfSha256Pinned: pins.candidate.sha256, immutable: { ...immutable, rows: undefined }, aliasResult: aliasResult && { ...aliasResult, rows: undefined }, production, failures };
	const text = JSON.stringify(report, null, 1) + '\n';
	writeFileSync(out, text);
	for (const s of immutable.sevenPdfs) console.log(`${s.match ? 'MATCH' : 'DIFF '} ${s.observed ?? 'none'} ${s.path}`);
	console.log(`immutable ${origin}: ${immutable.files} inventory files; X-Robots-Tag ${JSON.stringify(immutable.xRobotsTagValues)}; other HTML pages not byte-identical ${immutable.htmlMismatches}; redirects ok ${immutable.redirectResults.filter((x) => x.ok).length}/${immutable.redirectResults.length}; control files served ${JSON.stringify(immutable.controlServed)}`);
	if (aliasResult) console.log(`alias ${alias}: ${aliasResult.files} files; redirects ok ${aliasResult.redirectResults.filter((x) => x.ok).length}/${aliasResult.redirectResults.length}`);
	for (const f of failures.slice(0, 25)) console.log(`FAIL ${f}`);
	console.log(`report ${out} sha256 ${sha256(Buffer.from(text))}`);
	failed = failures.length > 0;
	console.log(failed ? 'verify-staging: FAILED' : 'verify-staging: PASS');
	process.exit(failed ? 1 : 0);
}

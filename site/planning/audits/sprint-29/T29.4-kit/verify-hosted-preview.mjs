// T29.4 — owner-run authenticated verification of a hosted preview, and the capture index.
//
// MODE 1 (verify): the owner signs in to the preview in his browser, puts the app-host Access cookie value in the
// environment variable CF_AUTHORIZATION (typed at a Read-Host prompt, never on the command line), and runs
//   node verify-hosted-preview.mjs --origin https://<8hex>.<project>.pages.dev [--alias https://<label>.<project>.pages.dev] --out report.json
// It downloads EVERY inventory file from the IMMUTABLE origin except the control files in
// pins.hostedExcludedFromDownloadChecks (`_headers`: Pages applies it and does not serve it), requires HTTP 200,
// and compares: all 7 PDFs and every non-HTML file BYTE-EXACT with the pinned SHA-256; the article page byte-exact
// with the pinned route-HTML hash (the other HTML pages are compared informationally and counted, because
// Cloudflare may rewrite markup such as e-mail obfuscation); the article markers; and the exact X-Robots-Tag
// `noindex, nofollow` on every response (the hosted effect of `_headers`; Cloudflare's own default is `noindex`).
// With --alias the seven PDFs are repeated on the alias (a different host: its own cookie may be needed,
// CF_AUTHORIZATION_ALIAS). The report records the observed hashes, never the cookie.
//
// For a canary run pass the canary's own `--pins canary-N-pins.json --inventory canary-N.tsv`; the inventory's path-sorted
// digest must equal the pins' digest. (--skip-host-validation-for-tests exists only for the local mock-server tests.)
//
// MODE 2 (index): after taking the captures, build the capture index from an EXISTING PASSING report
//   node verify-hosted-preview.mjs --index --origin <immutable origin> --report report.json --captures <dir>
// It needs no cookie. It refuses a missing, failed or other-origin report, and records the observed candidate hash.
// The index is owner-attested: the kit validates structure, widths, coverage and URL binding, not pixels.
//
// Exit: 0 pass; 1 a check failed; 2 bad usage, a modified kit or no session.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { HERE, arg, hostRes, loadJson, loadPins, pngInfo, readInventory, requireInventoryMatchesPins, requireKitIntegrity, sha256 } from './kit-common.mjs';

const ACCESS_SUFFIX = '.cloudflareaccess.com';

async function get(url, token) {
	const res = await fetch(url, { redirect: 'manual', cache: 'no-store', headers: { cookie: `CF_Authorization=${token}`, 'user-agent': 'T29.4-owner-verification', accept: '*/*' }, signal: AbortSignal.timeout(60000) });
	return { status: res.status, headers: res.headers, body: Buffer.from(await res.arrayBuffer()) };
}

/** Request path for an inventory file: directory URLs for index.html, extension-less for other HTML (Pages redirects `.html`). */
export const urlPathFor = (path) => (path === 'index.html' ? '/' : path.endsWith('/index.html') ? `/${path.slice(0, -'index.html'.length)}` : /\.html?$/i.test(path) ? `/${path.replace(/\.html?$/i, '')}` : `/${path}`);

export async function verifyHosted({ origin, alias, token, aliasToken, pins, inventory, accessSuffix = ACCESS_SUFFIX }) {
	const failures = [];
	const rows = [];
	const excluded = new Set(pins.hostedExcludedFromDownloadChecks);
	const robots = new Set();
	const historical = pins.historical ?? [];
	const pdfPaths = new Set([...historical.map((h) => h.path), pins.candidate.pdfPath]);
	const routePage = `${pins.route.slice(1)}index.html`;
	const isHtml = (p) => /\.html?$/i.test(p);
	let htmlMismatches = 0;
	const sessionRedirect = (r) => {
		try {
			return new URL(r.headers.get('location') ?? '', 'https://invalid.invalid').hostname.endsWith(accessSuffix);
		} catch {
			return false;
		}
	};
	for (const rec of inventory) {
		if (excluded.has(rec.path)) {
			rows.push({ path: rec.path, kind: 'control-file', checked: false });
			continue;
		}
		const kind = pdfPaths.has(rec.path) ? 'pdf' : isHtml(rec.path) ? 'html' : 'asset';
		let r;
		try {
			r = await get(new URL(urlPathFor(rec.path), origin).toString(), token);
		} catch (err) {
			failures.push(`${rec.path}: request failed (${err.message})`);
			rows.push({ path: rec.path, kind, status: null });
			continue;
		}
		const hash = sha256(r.body);
		const row = { path: rec.path, kind, status: r.status, bytes: r.body.length, sha256: hash, expectedSha256: rec.sha256, match: hash === rec.sha256 };
		rows.push(row);
		robots.add(r.headers.get('x-robots-tag') ?? '(none)');
		if (r.status >= 300 && r.status < 400) {
			failures.push(sessionRedirect(r) ? `${rec.path}: redirect to Access — the session is not valid` : `${rec.path}: unexpected redirect ${r.status} to ${r.headers.get('location')}`);
			continue;
		}
		if (rec.path === '404.html') continue; // the error page: informational only (status and body are the host's)
		if (r.status !== 200) {
			failures.push(`${rec.path}: HTTP ${r.status}`);
			continue;
		}
		if (kind === 'pdf') {
			if (!(r.headers.get('content-type') ?? '').includes('application/pdf')) failures.push(`${rec.path}: content-type ${r.headers.get('content-type')}`);
			if (!row.match) failures.push(`${rec.path}: SHA-256 ${hash} != pinned ${rec.sha256}`);
		} else if (kind === 'asset' && !row.match) failures.push(`${rec.path}: SHA-256 differs from the inventory`);
		else if (kind === 'html' && !row.match) {
			htmlMismatches++;
			if (rec.path === routePage) failures.push(`article page SHA-256 ${hash} != pinned ${pins.candidate.routeHtmlSha256} (the page the owner reviews must be byte-exact)`);
		}
		if (r.headers.get('x-robots-tag') !== pins.hostedRobotsHeader) failures.push(`${rec.path}: X-Robots-Tag is ${JSON.stringify(r.headers.get('x-robots-tag'))}, expected "${pins.hostedRobotsHeader}"`);
		if (rec.path === routePage) {
			const html = r.body.toString('utf8');
			const need = pins.hostedArticleMarkers?.required ?? [];
			const forbid = pins.hostedArticleMarkers?.forbidden ?? [];
			for (const s of need) if (!html.includes(s)) failures.push(`article page lacks required text: ${s}`);
			for (const s of forbid) if (html.includes(s)) failures.push(`article page contains forbidden text: ${s}`);
			row.markers = { required: need.map((s) => html.includes(s)), forbidden: forbid.map((s) => html.includes(s)) };
		}
	}
	const articleRow = rows.find((r) => r.path === routePage);
	if (articleRow && articleRow.sha256 !== pins.candidate.routeHtmlSha256 && !failures.some((f) => f.startsWith('article page SHA-256'))) failures.push(`article page SHA-256 ${articleRow.sha256} != pinned ${pins.candidate.routeHtmlSha256}`);
	const sevenPdfs = [...historical, { path: pins.candidate.pdfPath, sha256: pins.candidate.sha256 }].map((p) => {
		const row = rows.find((r) => r.path === p.path);
		return { path: p.path, expected: p.sha256, observed: row?.sha256 ?? null, match: row?.sha256 === p.sha256 };
	});
	for (const s of sevenPdfs) if (!s.match) failures.push(`pinned PDF mismatch: ${s.path}`);
	let aliasPdfs = null;
	if (alias) {
		aliasPdfs = [];
		for (const p of sevenPdfs) {
			try {
				const r = await get(new URL(`/${p.path}`, alias).toString(), aliasToken ?? token);
				const ok = r.status === 200 && sha256(r.body) === p.expected;
				aliasPdfs.push({ path: p.path, status: r.status, match: ok });
				if (!ok) failures.push(`alias PDF mismatch: ${p.path} (status ${r.status}${r.status >= 300 && r.status < 400 ? '; the alias may need its own cookie in CF_AUTHORIZATION_ALIAS' : ''})`);
			} catch (err) {
				aliasPdfs.push({ path: p.path, status: null, match: false });
				failures.push(`alias PDF request failed: ${p.path} (${err.message})`);
			}
		}
	}
	return { origin, alias: alias ?? null, when: new Date().toISOString(), candidatePdfSha256Expected: pins.candidate.sha256, candidatePdfSha256Observed: sevenPdfs.at(-1).observed, inventoryDigest: pins.inventory.digest, files: rows.length, sevenPdfs, aliasPdfs, htmlMismatches, xRobotsTagValues: [...robots].sort(), failures, rows };
}

const NEED = { desktop: { width: 1440, tol: 2 }, mobile: { width: 390, tol: 2 } };
const MIN_IMAGE_BYTES = 4096;
const MIN_SCROLL_HEIGHT = 20000; // the article is tens of thousands of CSS px tall; a self-declared tiny height is not a page

/** Build and validate the capture index from a PASSING report. */
export function buildCaptureIndex({ dir, origin, pins, reportPath, project = pins.projectSubdomain }) {
	const problems = [];
	if (!hostRes(project).immutable.test(origin)) problems.push(`origin ${origin} is not an immutable preview URL https://<8 hex>.${project}.pages.dev`);
	let report;
	let reportSha256 = null;
	try {
		const text = readFileSync(reportPath);
		reportSha256 = sha256(text);
		report = JSON.parse(text.toString('utf8'));
	} catch {
		problems.push('the verification report is missing or not JSON');
	}
	if (report) {
		if (report.origin !== origin) problems.push(`report origin ${report.origin} differs from ${origin}`);
		if (!Array.isArray(report.failures) || report.failures.length) problems.push('the verification report did not pass');
		if (report.candidatePdfSha256Observed !== pins.candidate.sha256) problems.push(`report observed candidate PDF ${report.candidatePdfSha256Observed} != pinned ${pins.candidate.sha256}`);
	}
	const kinds = {};
	const files = readdirSync(dir);
	const seenHashes = new Map();
	for (const kind of ['desktop', 'mobile']) {
		let metrics;
		try {
			metrics = loadJson(join(dir, `page-metrics-${kind}.json`));
		} catch {
			problems.push(`${kind}: page-metrics-${kind}.json is missing or not JSON`);
			continue;
		}
		const dpr = metrics.devicePixelRatio || 1;
		if (!(dpr >= 1)) problems.push(`${kind}: devicePixelRatio ${metrics.devicePixelRatio} is below 1`);
		if (!(metrics.scrollHeight >= (pins.captureMinScrollHeight ?? MIN_SCROLL_HEIGHT))) problems.push(`${kind}: scrollHeight ${metrics.scrollHeight} is implausibly small for the article`);
		if (metrics.url !== `${origin}${pins.route}`) problems.push(`${kind}: metrics URL ${metrics.url} is not exactly the immutable article URL ${origin}${pins.route}`);
		if (Math.abs(metrics.innerWidth - NEED[kind].width) > NEED[kind].tol) problems.push(`${kind}: viewport width ${metrics.innerWidth} is not ${NEED[kind].width} (±${NEED[kind].tol})`);
		if (metrics.routeHtmlSha256 !== pins.candidate.routeHtmlSha256) problems.push(`${kind}: the page the browser fetched hashes to ${metrics.routeHtmlSha256}, expected ${pins.candidate.routeHtmlSha256}`);
		const names = files.filter((f) => new RegExp(`^${kind}-\\d{3}\\.png$`).test(f)).sort();
		names.forEach((n, i) => { if (n !== `${kind}-${String(i + 1).padStart(3, '0')}.png`) problems.push(`${kind}: numbering is not contiguous at ${n}`); });
		let total = 0;
		const list = names.map((n) => {
			const bytes = readFileSync(join(dir, n));
			const size = pngInfo(bytes);
			const hash = sha256(bytes);
			if (!size) problems.push(`${n}: not a valid PNG (signature, chunk CRCs, IDAT and IEND are checked)`);
			else {
				if (bytes.length < MIN_IMAGE_BYTES) problems.push(`${n}: only ${bytes.length} bytes`);
				if (size.width !== Math.round(metrics.innerWidth * dpr)) problems.push(`${n}: width ${size.width} != innerWidth*dpr ${Math.round(metrics.innerWidth * dpr)}`);
				if (size.height > 16384) problems.push(`${n}: height ${size.height} exceeds the 16384 px capture limit`);
				total += size.height;
			}
			if (seenHashes.has(hash)) problems.push(`${n}: identical bytes to ${seenHashes.get(hash)}`);
			seenHashes.set(hash, n);
			return { file: n, sha256: hash, bytes: bytes.length, ...(size ?? {}) };
		});
		const need = Math.ceil(metrics.scrollHeight * dpr * 0.99);
		if (!names.length) problems.push(`${kind}: no ${kind}-NNN.png captures`);
		else if (total < need) problems.push(`${kind}: captured height ${total}px is less than the page height ${metrics.scrollHeight * dpr}px (needs >= ${need})`);
		kinds[kind] = { metrics, capturedHeight: total, files: list };
	}
	return {
		problems,
		index: {
			attestation: 'OWNER-ATTESTED: the kit checks structure, widths, coverage, the immutable URL and the fetched-HTML hash; it cannot tie pixels to the served bytes',
			origin, articleUrl: `${origin}${pins.route}`, candidatePdfSha256Pinned: pins.candidate.sha256, candidatePdfSha256Observed: report?.candidatePdfSha256Observed ?? null,
			routeHtmlSha256Pinned: pins.candidate.routeHtmlSha256, correctionCommit: pins.correctionCommit, inventoryDigest: pins.inventory.digest,
			verificationReportSha256: reportSha256, reportPassed: !!report && Array.isArray(report.failures) && report.failures.length === 0, builtAt: new Date().toISOString(), captures: kinds,
		},
	};
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
	requireKitIntegrity('verify-hosted-preview');
	const argv = process.argv.slice(2);
	const origin = arg(argv, '--origin');
	const pins = loadPins(resolve(arg(argv, '--pins') ?? join(HERE, 'pins.json')));
	const hosts = hostRes(arg(argv, '--project', pins.projectSubdomain));
	if (!origin || !(hosts.immutable.test(origin) || argv.includes('--skip-host-validation-for-tests'))) {
		console.error(`--origin must be an immutable preview URL https://<8 hex>.${pins.projectSubdomain}.pages.dev (not the alias, not the production host)`);
		process.exit(2);
	}
	if (argv.includes('--index')) {
		const dir = resolve(arg(argv, '--captures', ''));
		const { problems, index } = buildCaptureIndex({ dir, origin, pins, reportPath: resolve(arg(argv, '--report', 'hosted-verification-report.json')) });
		writeFileSync(join(dir, 'capture-index.json'), JSON.stringify(index, null, 1) + '\n');
		for (const p of problems) console.log(`CAPTURE FAIL ${p}`);
		console.log(`capture index ${join(dir, 'capture-index.json')}: desktop ${index.captures.desktop?.files.length ?? 0} files, mobile ${index.captures.mobile?.files.length ?? 0} files, report ${index.verificationReportSha256}`);
		console.log(problems.length ? 'verify-hosted-preview --index: FAILED' : 'verify-hosted-preview --index: PASS (owner-attested)');
		process.exit(problems.length ? 1 : 0);
	}
	const alias = arg(argv, '--alias');
	if (alias && !hosts.alias(pins.branchLabel).test(alias) && !argv.includes('--skip-host-validation-for-tests')) {
		console.error(`--alias must be https://${pins.branchLabel}.${pins.projectSubdomain}.pages.dev`);
		process.exit(2);
	}
	const token = process.env.CF_AUTHORIZATION;
	if (!token) {
		console.error('Set CF_AUTHORIZATION to the app-host Access cookie value (use Read-Host; never type it on the command line).');
		process.exit(2);
	}
	const inventory = readInventory(resolve(arg(argv, '--inventory') ?? join(HERE, pins.inventory.file)));
	requireInventoryMatchesPins('verify-hosted-preview', inventory, pins);
	const report = await verifyHosted({ origin, alias, token, aliasToken: process.env.CF_AUTHORIZATION_ALIAS, pins, inventory });
	const out = arg(argv, '--out', 'hosted-verification-report.json');
	const text = JSON.stringify(report, null, 1) + '\n';
	writeFileSync(out, text);
	console.log(`origin ${origin}: ${report.files} inventory files requested; X-Robots-Tag values: ${JSON.stringify(report.xRobotsTagValues)}; other HTML pages not byte-identical: ${report.htmlMismatches}`);
	for (const s of report.sevenPdfs) console.log(`${s.match ? 'MATCH' : 'DIFF '} ${s.observed ?? 'none'} ${s.path}`);
	for (const f of report.failures.slice(0, 25)) console.log(`FAIL ${f}`);
	console.log(`report ${out} sha256 ${sha256(Buffer.from(text))}`);
	console.log(report.failures.length ? 'verify-hosted-preview: FAILED' : 'verify-hosted-preview: PASS');
	process.exit(report.failures.length ? 1 : 0);
}

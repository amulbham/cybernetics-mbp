// T29.4 — anonymous access-denial check. No cookies, no credentials, read-only requests.
//
// For every PROTECTED origin (the branch alias and every immutable preview URL) it requests the article, the
// direct PDF and a set of path variants, and judges the FIRST response only (redirects are never followed
// implicitly). A first response passes only if it is a redirect (301/302/303/307/308) whose Location is https
// on the Access host (the owner's team host with --access-host, else any *.cloudflareaccess.com) with a path
// under /cdn-cgi/access/, and its body (if any) is not a PDF, not the artifact and carries no Content-Range or
// PDF type. A bare 401/403 is NOT enough: nothing ties it to Access, so it fails unless --allow-status-denial is
// given. The Access login destination is then validated SEPARATELY with one more request.
// NOT-SERVED origins (the project's production hostname, added automatically, and the existing live hosts) must
// answer 404 to the article and the PDF. CONTROLS (a known public HTML URL and a known public PDF URL) must be
// judged EXPOSED with the same logic (and the PDF control must really return PDF bytes); otherwise the check
// cannot be trusted and exits 2.
//
// Usage: node anonymous-denial-check.mjs --protected <origin,origin,...> [--not-served <origin,...>]
//          [--project cybernetics-mbp-preview] [--route /path/] [--pdf /path.pdf] [--asset /_astro/x.css]
//          [--control-html <url>] [--control-pdf <url>] [--marker <text,...>] [--access-host <team>.cloudflareaccess.com]
//          [--allow-status-denial] [--out report.json]
// Exit: 0 all expectations met; 1 an expectation failed; 2 a control failed, a request errored or the kit changed.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { HERE, arg, hostRes, loadPins, readInventory, requireKitIntegrity } from './kit-common.mjs';

const REDIRECT = new Set([301, 302, 303, 307, 308]);
const PDF_MAGIC = '%PDF-';

async function first(url, { method = 'GET', headers = {} } = {}) {
	const res = await fetch(url, { method, redirect: 'manual', cache: 'no-store', headers: { 'user-agent': 'T29.4-denial-check', accept: '*/*', ...headers }, signal: AbortSignal.timeout(30000) });
	let body = Buffer.alloc(0);
	if (method !== 'HEAD' && res.body) {
		const reader = res.body.getReader();
		const chunks = [];
		let size = 0;
		while (size < 1048576) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(Buffer.from(value));
			size += value.length;
		}
		await reader.cancel().catch(() => {});
		body = Buffer.concat(chunks);
	}
	return { status: res.status, headers: res.headers, body };
}

const leaks = (r, markers) => {
	const text = r.body.toString('latin1');
	const lower = `${text}\n${r.body.toString('utf8')}`.toLowerCase();
	const out = [];
	if (text.includes(PDF_MAGIC)) out.push('PDF bytes');
	if ((r.headers.get('content-type') ?? '').toLowerCase().includes('application/pdf')) out.push('application/pdf');
	if (r.headers.get('content-range')) out.push('Content-Range');
	for (const m of markers) if (lower.includes(m.toLowerCase())) out.push(`marker "${m}"`);
	return out;
};

const isAccessHost = (hostname, { accessHost, accessSuffix }) => {
	const h = hostname.toLowerCase();
	return accessHost ? h === accessHost.toLowerCase() : h.endsWith(accessSuffix);
};

/** Classify one first response. */
export function classify(r, ctx) {
	const { markers, allowHttp = false, allowStatusDenial = false } = ctx;
	const leak = leaks(r, markers);
	if (REDIRECT.has(r.status)) {
		const location = r.headers.get('location');
		let url;
		try {
			url = new URL(location ?? '', 'https://invalid.invalid');
		} catch {
			return { verdict: 'FAIL', why: `unparseable Location ${JSON.stringify(location)}` };
		}
		const ok = (url.protocol === 'https:' || (allowHttp && url.protocol === 'http:')) && isAccessHost(url.hostname, ctx) && url.pathname.startsWith('/cdn-cgi/access/');
		if (!ok) return { verdict: 'FAIL', why: `redirect to a non-Access destination ${location}` };
		if (leak.length) return { verdict: 'FAIL', why: `redirect response leaks ${leak.join(', ')}` };
		return { verdict: 'DENIED_REDIRECT', location: url.toString() };
	}
	if (r.status === 401 || r.status === 403) {
		if (leak.length) return { verdict: 'FAIL', why: `${r.status} response leaks ${leak.join(', ')}` };
		return allowStatusDenial ? { verdict: 'DENIED_STATUS' } : { verdict: 'FAIL', why: `${r.status} without an Access redirect is not attributable to Access (use --allow-status-denial only with owner approval)` };
	}
	if (r.status === 200 || r.status === 206 || r.status === 304) return { verdict: 'EXPOSED', why: `status ${r.status}${leak.length ? ` with ${leak.join(', ')}` : ''}` };
	return { verdict: 'FAIL', why: `unexpected first status ${r.status} (an Access-protected host must redirect to Access)` };
}

/** Validate the Access login destination separately. */
async function validateLogin(location, ctx) {
	const url = new URL(location);
	const r = await first(url.toString());
	const leak = leaks(r, ctx.markers);
	if (leak.length) return { ok: false, why: `login destination leaks ${leak.join(', ')}` };
	if (REDIRECT.has(r.status)) {
		const next = new URL(r.headers.get('location') ?? '', url);
		return isAccessHost(next.hostname, ctx) ? { ok: true, status: r.status, to: next.hostname } : { ok: false, why: `login redirected outside Access to ${next.hostname}` };
	}
	if (r.status === 200 && (r.headers.get('content-type') ?? '').includes('text/html')) return { ok: true, status: 200 };
	return { ok: false, why: `login destination returned ${r.status} ${r.headers.get('content-type')}` };
}

/** The request set for one origin. `fail: false` entries are recorded but never fail the run. */
export const targets = ({ route, pdf, asset, extra = [] }) => {
	const noSlash = route.replace(/\/$/, '');
	return [
		{ name: 'article GET', path: route, method: 'GET' },
		{ name: 'article HEAD', path: route, method: 'HEAD' },
		{ name: 'pdf GET', path: pdf, method: 'GET' },
		{ name: 'pdf HEAD', path: pdf, method: 'HEAD' },
		{ name: 'pdf Range', path: pdf, method: 'GET', headers: { Range: 'bytes=0-15' } },
		{ name: 'root GET', path: '/', method: 'GET' },
		{ name: 'article index.html GET', path: `${route}index.html`, method: 'GET' },
		{ name: 'article without slash GET', path: noSlash, method: 'GET' },
		{ name: 'article query-string GET', path: `${route}?cb=t294`, method: 'GET' },
		{ name: 'robots.txt GET', path: '/robots.txt', method: 'GET' },
		{ name: 'sitemap-index.xml GET', path: '/sitemap-index.xml', method: 'GET' },
		...(asset ? [{ name: 'asset GET', path: asset, method: 'GET' }] : []),
		...extra.map((p) => ({ name: `${p} GET`, path: p, method: 'GET' })),
		{ name: 'cdn-cgi trace GET (informational)', path: '/cdn-cgi/trace', method: 'GET', info: true },
	];
};
const notServedTargets = ({ route, pdf }) => targets({ route, pdf }).filter((t) => /^(article|pdf) /.test(t.name) && !t.info).slice(0, 5);

export async function run({ protectedOrigins, notServed = [], route, pdf, asset, extra = [], controlHtml, controlPdf, markers, accessSuffix = '.cloudflareaccess.com', accessHost, allowHttp = false, allowStatusDenial = false }) {
	const ctx = { markers, accessSuffix, accessHost, allowHttp, allowStatusDenial };
	const records = [];
	const failures = [];
	const errors = [];
	const attempt = async (origin, role, t) => {
		const url = new URL(t.path, origin).toString();
		try {
			const r = await first(url, t);
			records.push({ origin, role, request: t.name, url, status: r.status, server: r.headers.get('server'), cfRay: r.headers.get('cf-ray'), contentType: r.headers.get('content-type'), contentLength: r.headers.get('content-length'), contentRange: r.headers.get('content-range'), location: r.headers.get('location'), r });
			return r;
		} catch (err) {
			errors.push(`${role} ${t.name} ${url}: ${err.message}`);
			return null;
		}
	};
	// Controls first: they must be judged EXPOSED (and the PDF control must really be a PDF) or nothing is trustworthy.
	const controls = [];
	for (const [kind, url] of [['html', controlHtml], ['pdf', controlPdf]]) {
		if (!url) continue;
		const u = new URL(url);
		const list = kind === 'html' ? [{ name: 'control html GET', path: u.pathname, method: 'GET' }] : [{ name: 'control pdf GET', path: u.pathname, method: 'GET' }, { name: 'control pdf Range', path: u.pathname, method: 'GET', headers: { Range: 'bytes=0-15' } }];
		for (const t of list) {
			const r = await attempt(u.origin, 'control', t);
			if (!r) continue;
			const c = classify(r, ctx);
			const isPdfBody = r.body.toString('latin1').includes(PDF_MAGIC);
			const verdict = c.verdict === 'EXPOSED' && kind === 'pdf' && t.name === 'control pdf GET' && !isPdfBody ? 'NOT_A_PDF' : c.verdict;
			controls.push({ ...t, url: u.origin + t.path, status: r.status, verdict });
		}
	}
	const controlFailed = controls.length === 0 || controls.some((c) => c.verdict !== 'EXPOSED');
	for (const origin of protectedOrigins) {
		for (const t of targets({ route, pdf, asset, extra })) {
			const r = await attempt(origin, 'protected', t);
			if (!r) continue;
			const c = classify(r, ctx);
			const rec = records[records.length - 1];
			rec.verdict = c.verdict;
			rec.informational = !!t.info;
			if (c.verdict === 'DENIED_REDIRECT') {
				try {
					rec.login = await validateLogin(c.location, ctx);
				} catch (err) {
					rec.login = { ok: false, why: err.message };
				}
				if (!rec.login.ok && !t.info) failures.push(`${origin} ${t.name}: login validation failed: ${rec.login.why}`);
			} else if (c.verdict !== 'DENIED_STATUS' && !t.info) failures.push(`${origin} ${t.name}: ${c.verdict} ${c.why ?? ''}`.trim());
		}
	}
	for (const origin of notServed) {
		for (const t of notServedTargets({ route, pdf })) {
			const r = await attempt(origin, 'not-served', t);
			if (!r) continue;
			const rec = records[records.length - 1];
			const leak = leaks(r, markers);
			rec.verdict = r.status === 404 && !leak.length ? 'NOT_SERVED' : 'FAIL';
			if (rec.verdict === 'FAIL') failures.push(`${origin} ${t.name}: expected 404 and no artifact, got ${r.status}${leak.length ? ` leaking ${leak.join(', ')}` : ''}`);
		}
	}
	return { controls, controlFailed, records: records.map(({ r, ...rest }) => rest), failures, errors };
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
	requireKitIntegrity('anonymous-denial-check');
	const argv = process.argv.slice(2);
	const list = (name) => (arg(argv, name, '') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
	const pins = loadPins();
	const project = arg(argv, '--project', pins.projectSubdomain);
	const hosts = hostRes(project);
	const protectedOrigins = list('--protected').map((o) => o.replace(/\/$/, ''));
	const bad = protectedOrigins.filter((o) => !(hosts.immutable.test(o) || hosts.alias(pins.branchLabel).test(o)));
	if (!protectedOrigins.length || bad.length) {
		console.error(`usage: node anonymous-denial-check.mjs --protected <origin,...> [--not-served <origin,...>] [--out report.json]\nEvery protected origin must be the alias https://${pins.branchLabel}.${project}.pages.dev or an immutable https://<8 hex>.${project}.pages.dev${bad.length ? `; rejected: ${bad.join(', ')}` : ''}`);
		process.exit(2);
	}
	const inventory = readInventory(join(HERE, pins.inventory.file));
	const options = {
		protectedOrigins, notServed: [...new Set([hosts.production, ...list('--not-served')])],
		route: arg(argv, '--route', pins.route), pdf: arg(argv, '--pdf', `/${pins.candidate.pdfPath}`),
		asset: arg(argv, '--asset', `/${inventory.find((r) => r.path.startsWith('_astro/') && r.path.endsWith('.css'))?.path}`),
		extra: list('--extra'),
		controlHtml: arg(argv, '--control-html', 'https://amulbham.com/'),
		controlPdf: arg(argv, '--control-pdf', 'https://amulbham.com/research/cybernetics/three-self-organizing-systems/three-self-organizing-systems.pdf'),
		markers: list('--marker').length ? list('--marker') : ['Cybernetics and the Structural', 'Candidate specimen', 'T29.4 canary'],
		accessSuffix: '.cloudflareaccess.com', accessHost: arg(argv, '--access-host', pins.accessTeamHost ?? undefined),
		allowStatusDenial: argv.includes('--allow-status-denial'),
	};
	const report = await run(options);
	const out = { when: new Date().toISOString(), options, ...report };
	if (arg(argv, '--out')) writeFileSync(arg(argv, '--out'), JSON.stringify(out, null, 1) + '\n');
	for (const c of report.controls) console.log(`control ${c.name}: ${c.status} ${c.verdict}`);
	const verdicts = {};
	for (const r of report.records.filter((r) => r.role !== 'control')) verdicts[r.verdict ?? 'ERROR'] = (verdicts[r.verdict ?? 'ERROR'] ?? 0) + 1;
	console.log(`requests: ${JSON.stringify(verdicts)}`);
	for (const e of report.errors) console.log(`ERROR ${e}`);
	for (const f of report.failures) console.log(`FAIL ${f}`);
	if (report.controlFailed) {
		console.log('anonymous-denial-check: CONTROL FAILED — a known public URL was not judged exposed; the check is not trustworthy');
		process.exit(2);
	}
	if (report.errors.length) process.exit(2);
	if (report.failures.length) {
		console.log(`anonymous-denial-check: FAILED (${report.failures.length})`);
		process.exit(1);
	}
	console.log('anonymous-denial-check: PASS — every protected first response is an Access redirect, every login redirect is valid, controls exposed, production host 404');
}

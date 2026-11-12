// T29.4 — anonymous access-denial check. No cookies, no credentials, read-only requests.
//
// For every PROTECTED origin (branch alias and every immutable preview URL) it requests the article
// and the direct PDF with GET, HEAD and, for the PDF, a Range request, and judges the FIRST response
// only (redirects are never followed implicitly). A first response passes only if it is
//   - a redirect whose Location is https on an Access host (default suffix .cloudflareaccess.com,
//     path /cdn-cgi/access/...), or a 401/403;
//   and its body, if any, is not a PDF, not the artifact, and carries no Content-Range / PDF type.
// The Access login redirect is then validated SEPARATELY: one more request to the Location URL must
// return an Access login page (or a further redirect inside the same Access host) with no artifact bytes.
// NOT-SERVED origins (the project's production hostname and the existing live hosts) must answer 404 to
// the article and the PDF. CONTROLS (a known public HTML URL and a known public PDF URL) must be judged
// EXPOSED with the same logic; if a control is not exposed the check cannot be trusted and exits 2.
//
// Usage: node anonymous-denial-check.mjs --protected <origin,origin,...> [--not-served <origin,...>]
//          [--route /path/] [--pdf /path.pdf] [--control-html <url>] [--control-pdf <url>]
//          [--marker <text,...>] [--access-suffix .cloudflareaccess.com] [--out report.json]
//          (--allow-http-login-for-tests exists only for the local mock-server tests; never use it on a real host)
// Exit: 0 all expectations met; 1 an expectation failed; 2 a control failed or a request errored.
import { writeFileSync } from 'node:fs';
import { arg, loadPins } from './kit-common.mjs';

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
	const out = [];
	if (text.includes(PDF_MAGIC)) out.push('PDF bytes');
	if ((r.headers.get('content-type') ?? '').toLowerCase().includes('application/pdf')) out.push('application/pdf');
	if (r.headers.get('content-range')) out.push('Content-Range');
	for (const m of markers) if (text.includes(m)) out.push(`marker "${m}"`);
	return out;
};

/** Classify one first response. */
export function classify(r, { accessSuffix, markers, allowHttp = false }) {
	const leak = leaks(r, markers);
	if (REDIRECT.has(r.status)) {
		const location = r.headers.get('location');
		let url;
		try {
			url = new URL(location ?? '', 'https://invalid.invalid');
		} catch {
			return { verdict: 'FAIL', why: `unparseable Location ${JSON.stringify(location)}` };
		}
		const ok = (url.protocol === 'https:' || (allowHttp && url.protocol === 'http:')) && url.hostname.toLowerCase().endsWith(accessSuffix) && url.pathname.startsWith('/cdn-cgi/access/');
		if (!ok) return { verdict: 'FAIL', why: `redirect to a non-Access destination ${location}` };
		if (leak.length) return { verdict: 'FAIL', why: `redirect response leaks ${leak.join(', ')}` };
		return { verdict: 'DENIED_REDIRECT', location: url.toString() };
	}
	if (r.status === 401 || r.status === 403) {
		return leak.length ? { verdict: 'FAIL', why: `${r.status} response leaks ${leak.join(', ')}` } : { verdict: 'DENIED_STATUS' };
	}
	if (r.status === 200 || r.status === 206 || r.status === 304) return { verdict: 'EXPOSED', why: `status ${r.status}${leak.length ? ` with ${leak.join(', ')}` : ''}` };
	return { verdict: 'FAIL', why: `unexpected first status ${r.status} (an Access-protected host must redirect or deny)` };
}

/** Validate the Access login destination separately. */
async function validateLogin(location, ctx) {
	const url = new URL(location);
	const r = await first(url.toString());
	const leak = leaks(r, ctx.markers);
	if (leak.length) return { ok: false, why: `login destination leaks ${leak.join(', ')}` };
	if (REDIRECT.has(r.status)) {
		const next = new URL(r.headers.get('location') ?? '', url);
		return next.hostname.toLowerCase().endsWith(ctx.accessSuffix) ? { ok: true, status: r.status, to: next.hostname } : { ok: false, why: `login redirected outside Access to ${next.hostname}` };
	}
	if (r.status === 200 && (r.headers.get('content-type') ?? '').includes('text/html')) return { ok: true, status: 200 };
	return { ok: false, why: `login destination returned ${r.status} ${r.headers.get('content-type')}` };
}

const targets = (route, pdf) => [
	{ name: 'article GET', path: route, method: 'GET' },
	{ name: 'article HEAD', path: route, method: 'HEAD' },
	{ name: 'pdf GET', path: pdf, method: 'GET' },
	{ name: 'pdf HEAD', path: pdf, method: 'HEAD' },
	{ name: 'pdf Range', path: pdf, method: 'GET', headers: { Range: 'bytes=0-15' } },
];

export async function run({ protectedOrigins, notServed = [], route, pdf, controlHtml, controlPdf, markers, accessSuffix, allowHttp = false }) {
	const ctx = { markers, accessSuffix, allowHttp };
	const records = [];
	const failures = [];
	const errors = [];
	const attempt = async (origin, role, t) => {
		const url = new URL(t.path, origin).toString();
		try {
			const r = await first(url, t);
			records.push({ origin, role, request: t.name, url, status: r.status, contentType: r.headers.get('content-type'), contentLength: r.headers.get('content-length'), contentRange: r.headers.get('content-range'), location: r.headers.get('location'), r });
			return r;
		} catch (err) {
			errors.push(`${role} ${t.name} ${url}: ${err.message}`);
			return null;
		}
	};
	// Controls first: they must be judged EXPOSED or nothing else can be trusted.
	const controls = [];
	for (const [kind, url] of [['html', controlHtml], ['pdf', controlPdf]]) {
		if (!url) continue;
		const u = new URL(url);
		const list = kind === 'html' ? [{ name: 'control html GET', path: u.pathname, method: 'GET' }] : [{ name: 'control pdf GET', path: u.pathname, method: 'GET' }, { name: 'control pdf Range', path: u.pathname, method: 'GET', headers: { Range: 'bytes=0-15' } }];
		for (const t of list) {
			const r = await attempt(u.origin, 'control', t);
			if (!r) continue;
			const c = classify(r, ctx);
			controls.push({ ...t, url: u.origin + t.path, status: r.status, verdict: c.verdict });
		}
	}
	const controlFailed = controls.length === 0 || controls.some((c) => c.verdict !== 'EXPOSED');
	for (const origin of protectedOrigins) {
		for (const t of targets(route, pdf)) {
			const r = await attempt(origin, 'protected', t);
			if (!r) continue;
			const c = classify(r, ctx);
			const rec = records[records.length - 1];
			rec.verdict = c.verdict;
			if (c.verdict === 'DENIED_REDIRECT') {
				try {
					rec.login = await validateLogin(c.location, ctx);
				} catch (err) {
					rec.login = { ok: false, why: err.message };
				}
				if (!rec.login.ok) failures.push(`${origin} ${t.name}: login validation failed: ${rec.login.why}`);
			} else if (c.verdict !== 'DENIED_STATUS') failures.push(`${origin} ${t.name}: ${c.verdict} ${c.why ?? ''}`.trim());
		}
	}
	for (const origin of notServed) {
		for (const t of targets(route, pdf)) {
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
	const argv = process.argv.slice(2);
	const list = (name) => (arg(argv, name, '') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
	const pins = loadPins();
	const options = {
		protectedOrigins: list('--protected'), notServed: list('--not-served'),
		route: arg(argv, '--route', pins.route), pdf: arg(argv, '--pdf', `/${pins.candidate.pdfPath}`),
		controlHtml: arg(argv, '--control-html', 'https://amulbham.com/'),
		controlPdf: arg(argv, '--control-pdf', 'https://amulbham.com/research/cybernetics/three-self-organizing-systems/three-self-organizing-systems.pdf'),
		markers: list('--marker').length ? list('--marker') : ['Cybernetics and the Structural', 'Candidate specimen', 'T29.4 canary'],
		accessSuffix: arg(argv, '--access-suffix', '.cloudflareaccess.com').toLowerCase(),
		allowHttp: argv.includes('--allow-http-login-for-tests'),
	};
	if (!options.protectedOrigins.length) {
		console.error('usage: node anonymous-denial-check.mjs --protected <origin,...> [--not-served <origin,...>] [--out report.json]');
		process.exit(2);
	}
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
	console.log('anonymous-denial-check: PASS — every protected first response denied, every login redirect valid, controls exposed, not-served hosts 404');
}

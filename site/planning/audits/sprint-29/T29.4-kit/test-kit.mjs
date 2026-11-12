// T29.4 kit tests: local mock servers only (127.0.0.1); no network, no credentials, no Cloudflare.
// Usage: node test-kit.mjs   (verifies the COMMITTED SHA256SUMS first; make-sums.mjs is for authoring only)
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { crc32 } from 'node:zlib';
import { HERE, inventoryDigest, kitIntegrity, pngInfo, readInventory, sha256 } from './kit-common.mjs';
import { run as denial, targets } from './anonymous-denial-check.mjs';
import { buildCaptureIndex, urlPathFor, verifyHosted } from './verify-hosted-preview.mjs';

let count = 0;
const results = [];
async function test(name, fn) {
	try {
		await fn();
		count++;
		results.push(`PASS ${name}`);
		console.log(`PASS ${name}`);
	} catch (err) {
		results.push(`FAIL ${name}: ${err.message}`);
		console.log(`FAIL ${name}: ${err.message}`);
		process.exitCode = 1;
	}
}
const serve = (handler) => new Promise((resolve) => {
	const server = createServer(handler);
	server.listen(0, '127.0.0.1', () => resolve({ origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((r) => { server.close(r); server.closeAllConnections(); }) }));
});
const tmp = () => mkdtempSync(join(tmpdir(), 't294-'));

// ---- synthetic tree, pins and inventory ---------------------------------------------------------
const pdf = (n) => Buffer.from(`%PDF-1.4\nsynthetic ${n}\n`);
const ARTICLE = Buffer.from('<html><meta name="robots" content="noindex, nofollow"><p>Candidate specimen</p><a href="./c.pdf">Download candidate PDF</a> Cybernetics and the Structural</html>');
const tree = new Map([
	['index.html', Buffer.from('<html>home mailto:x@example.org</html>')],
	['404.html', Buffer.from('<html>missing</html>')],
	['robots.txt', Buffer.from('User-agent: *\nDisallow: /\n')],
	['sitemap-index.xml', Buffer.from('<sitemapindex/>')],
	['_headers', Buffer.from('https://:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n')],
	['_astro/site.css', Buffer.from('body{}')],
	['research/c/c/index.html', ARTICLE],
	['research/c/c/c.pdf', pdf('cand')],
]);
const historical = ['a', 'b', 'd', 'e', 'f', 'g'].map((k) => [`research/${k}/${k}/${k}.pdf`, pdf(k)]);
for (const [p, b] of historical) tree.set(p, b);
const inventory = [...tree].map(([path, bytes]) => ({ path, bytes: bytes.length, sha256: sha256(bytes) }));
const pins = {
	projectSubdomain: 'cybernetics-mbp-preview', branchLabel: 't29-4-paper-c-preview',
	route: '/research/c/c/', correctionCommit: 'x', historical: historical.map(([path, b]) => ({ path, sha256: sha256(b) })),
	candidate: { pdfPath: 'research/c/c/c.pdf', sha256: sha256(pdf('cand')), routeHtmlSha256: sha256(ARTICLE) },
	captureMinScrollHeight: 1000, inventory: { digest: inventoryDigest(inventory) }, hostedExcludedFromDownloadChecks: ['_headers'], hostedRobotsHeader: 'noindex, nofollow',
	hostedArticleMarkers: { required: ['<meta name="robots" content="noindex, nofollow">', 'Candidate specimen', 'Download candidate PDF'], forbidden: ['rel="canonical"', 'application/ld+json', 'name="citation_'] },
};
const ROUTE = pins.route;
const PDF = `/${pins.candidate.pdfPath}`;

/** An Access-like origin. Without the GOOD cookie every path 302s to the login origin. With it: serve `files`, Pages-style
 *  (`/x.html` redirects to `/x`; `/x` serves x.html; `_headers` is never served). `openPaths` leaves paths unprotected. */
function accessOrigin({ files = tree, loginOrigin, robots = 'noindex, nofollow', leakRange = false, openPaths = [], seen = [], status = 302, contentType = {} }) {
	return serve((req, res) => {
		seen.push(req.url);
		const path = req.url.split('?')[0];
		const good = (req.headers.cookie ?? '').includes('CF_Authorization=GOOD');
		const open = openPaths.some((p) => path === p);
		if (!good && !open) {
			if (leakRange && req.headers.range) {
				res.writeHead(206, { 'content-type': 'application/pdf', 'content-range': 'bytes 0-15/100' });
				return res.end(pdf('cand'));
			}
			if (status !== 302) { res.writeHead(status, { 'content-type': 'text/html' }); return res.end('denied'); }
			res.writeHead(302, { location: `${loginOrigin}/cdn-cgi/access/login/host?kid=1` });
			return res.end();
		}
		if (path.endsWith('.html') && !path.endsWith('/index.html') && path !== '/index.html') { res.writeHead(308, { location: path.slice(0, -5) }); return res.end(); }
		let key = path === '/' ? 'index.html' : path.endsWith('/') ? `${path.slice(1)}index.html` : path.slice(1);
		if (!files.has(key) && files.has(`${key}.html`)) key = `${key}.html`;
		const body = files.get(key);
		if (!body || key === '_headers') { res.writeHead(404, { 'content-type': 'text/html' }); return res.end('not found'); }
		res.writeHead(200, { 'content-type': contentType[key] ?? (key.endsWith('.pdf') ? 'application/pdf' : key.endsWith('.html') ? 'text/html' : 'text/plain'), 'x-robots-tag': robots });
		res.end(body);
	});
}
const loginServer = (body = '<html>Access login</html>', type = 'text/html') => serve((req, res) => { res.writeHead(200, { 'content-type': type }); res.end(body); });
const publicServer = ({ bad = false, fakePdf = false } = {}) => serve((req, res) => {
	if (bad) { res.writeHead(404); return res.end('nope'); }
	if (req.url.endsWith('.pdf')) { res.writeHead(req.headers.range ? 206 : 200, { 'content-type': 'application/pdf' }); return res.end(fakePdf ? 'not a pdf' : pdf('public')); }
	res.writeHead(200, { 'content-type': 'text/html' }); res.end('<html>public</html>');
});
const notServed = (serveIt = false) => serve((req, res) => {
	if (serveIt && req.url.endsWith('.pdf')) { res.writeHead(200, { 'content-type': 'application/pdf' }); return res.end(pdf('cand')); }
	res.writeHead(404, { 'content-type': 'text/html' }); res.end('Nothing is here yet');
});
const ctx = (o, extra = {}) => ({ protectedOrigins: [o.protectedOrigin], notServed: [o.notServedOrigin], route: ROUTE, pdf: PDF, asset: '/_astro/site.css', controlHtml: `${o.controlOrigin}/page`, controlPdf: `${o.controlOrigin}/doc.pdf`, markers: ['Candidate specimen', 'T29.4 canary'], accessSuffix: '127.0.0.1', allowHttp: true, ...extra });
const protectedRecords = (r) => r.records.filter((x) => x.role === 'protected' && !x.informational);

// ---- kit integrity -------------------------------------------------------------------------------------
await test('kit integrity: SHA256SUMS matches the runtime files and tampering is detected', () => {
	const k = kitIntegrity();
	assert.equal(k.ok, true, k.problems.join('|'));
	const d = tmp();
	cpSync(HERE, d, { recursive: true });
	writeFileSync(join(d, 'verify-hosted-preview.mjs'), readFileSync(join(d, 'verify-hosted-preview.mjs'), 'utf8') + '\n// tampered\n');
	assert.equal(kitIntegrity(d).ok, false);
	rmSync(d, { recursive: true });
});

await test('kit integrity: a CRLF (Windows autocrlf) checkout still verifies', () => {
	const d = tmp();
	cpSync(HERE, d, { recursive: true });
	for (const f of ['SHA256SUMS', 'kit-common.mjs', 'verify-upload-dir.mjs', 'anonymous-denial-check.mjs', 'verify-hosted-preview.mjs', 'pins.json']) writeFileSync(join(d, f), readFileSync(join(d, f), 'utf8').replace(/\n/g, '\r\n'));
	const k = kitIntegrity(d);
	assert.equal(k.ok, true, k.problems.join('|'));
	assert.equal(k.digest, kitIntegrity().digest, 'the GO digest is the same for LF and CRLF checkouts');
	rmSync(d, { recursive: true });
});

// ---- anonymous denial check -----------------------------------------------------------------------
{
	const login = await loginServer();
	const prot = await accessOrigin({ loginOrigin: login.origin });
	const control = await publicServer();
	const ns = await notServed();
	const o = { protectedOrigin: prot.origin, controlOrigin: control.origin, notServedOrigin: ns.origin };
	await test('denial: protected origin, valid login, exposed controls, 404 production host -> pass', async () => {
		const r = await denial(ctx(o));
		assert.deepEqual(r.failures, []);
		assert.equal(r.controlFailed, false);
		assert.ok(protectedRecords(r).every((x) => x.verdict === 'DENIED_REDIRECT' && x.login.ok));
		assert.ok(protectedRecords(r).length >= 12);
		assert.equal(protectedRecords(r).filter((x) => x.request === 'pdf Range').length, 1);
	});
	await test('denial: path coverage includes root, explicit index.html, no-slash article, query string, robots, sitemap, asset', async () => {
		const names = targets({ route: ROUTE, pdf: PDF, asset: '/_astro/site.css' }).map((t) => t.name);
		for (const n of ['root GET', 'article index.html GET', 'article without slash GET', 'article query-string GET', 'robots.txt GET', 'sitemap-index.xml GET', 'asset GET']) assert.ok(names.includes(n), n);
	});
	await test('denial: the first response is judged; the redirect is not followed implicitly', async () => {
		const r = await denial(ctx(o));
		assert.ok(protectedRecords(r).every((x) => x.status === 302));
		assert.ok(protectedRecords(r).every((x) => 'server' in x && 'cfRay' in x));
	});
	await test('denial: an Access redirect to a non-Access host fails (exact team host pinned)', async () => {
		const r = await denial(ctx(o, { accessSuffix: 'access.test', accessHost: 'team.cloudflareaccess.com' }));
		assert.ok(r.failures.some((f) => f.includes('non-Access destination')));
	});
	await test('denial: a suffix-bypass login host is rejected', async () => {
		const sneaky = await serve((req, res) => { res.writeHead(302, { location: 'https://team.cloudflareaccess.com.attacker.example/cdn-cgi/access/x' }); res.end(); });
		const r = await denial(ctx({ ...o, protectedOrigin: sneaky.origin }, { allowHttp: false, accessSuffix: '.cloudflareaccess.com' }));
		assert.ok(r.failures.length > 0 && r.failures.every((f) => f.includes('non-Access destination')));
		await sneaky.close();
	});
	await test('denial: a public control that is NOT exposed marks the check untrustworthy', async () => {
		const badControl = await publicServer({ bad: true });
		const r = await denial(ctx({ ...o, controlOrigin: badControl.origin }));
		assert.equal(r.controlFailed, true);
		await badControl.close();
	});
	await test('denial: a PDF control that does not return PDF bytes marks the check untrustworthy', async () => {
		const fake = await publicServer({ fakePdf: true });
		const r = await denial(ctx({ ...o, controlOrigin: fake.origin }));
		assert.equal(r.controlFailed, true);
		await fake.close();
	});
	await test('denial: a production host serving the PDF fails', async () => {
		const leaky = await notServed(true);
		try { assert.ok((await denial(ctx({ ...o, notServedOrigin: leaky.origin }))).failures.some((f) => f.includes('expected 404'))); } finally { await leaky.close(); }
	});
	await test('denial: a host that leaks the PDF to an anonymous Range request fails', async () => {
		const leak = await accessOrigin({ loginOrigin: login.origin, leakRange: true });
		try { assert.ok((await denial(ctx({ ...o, protectedOrigin: leak.origin }))).failures.some((f) => f.includes('pdf Range') && f.includes('EXPOSED'))); } finally { await leak.close(); }
	});
	await test('denial: a host where only the article path is protected fails on the open paths', async () => {
		const open = await accessOrigin({ loginOrigin: login.origin, openPaths: ['/', '/robots.txt', '/_astro/site.css'] });
		try {
			const r = await denial(ctx({ ...o, protectedOrigin: open.origin }));
			assert.ok(['root GET', 'robots.txt GET', 'asset GET'].every((n) => r.failures.some((f) => f.includes(n) && f.includes('FAIL'))) || r.failures.length >= 3, r.failures.join('|'));
		} finally { await open.close(); }
	});
	await test('denial: a public (unprotected) origin is reported EXPOSED on article and PDF', async () => {
		const open = await publicServer();
		try {
			const r = await denial(ctx({ ...o, protectedOrigin: open.origin }, { route: '/page', pdf: '/doc.pdf' }));
			assert.ok(r.failures.length >= 5 && r.failures.some((f) => f.includes('EXPOSED')));
		} finally { await open.close(); }
	});
	await test('denial: a login destination that serves PDF bytes fails the separate login validation', async () => {
		const evil = await loginServer(pdf('cand'), 'application/pdf');
		const leak = await accessOrigin({ loginOrigin: evil.origin });
		try { assert.ok((await denial(ctx({ ...o, protectedOrigin: leak.origin }))).failures.some((f) => f.includes('login validation failed'))); } finally { await evil.close(); await leak.close(); }
	});
	await test('denial: a bare 403 is NOT accepted as Access denial unless explicitly allowed', async () => {
		const forbid = await accessOrigin({ loginOrigin: login.origin, status: 403 });
		try {
			assert.ok((await denial(ctx({ ...o, protectedOrigin: forbid.origin }))).failures.some((f) => f.includes('not attributable to Access')));
			assert.deepEqual((await denial(ctx({ ...o, protectedOrigin: forbid.origin }, { allowStatusDenial: true }))).failures, []);
		} finally { await forbid.close(); }
	});
	await test('denial: markers are matched case-insensitively in any body', async () => {
		const leakier = await serve((req, res) => { res.writeHead(403, { 'content-type': 'text/html' }); res.end('candidate SPECIMEN'); });
		try {
			const r = await denial(ctx({ ...o, protectedOrigin: leakier.origin }, { allowStatusDenial: true }));
			assert.ok(r.failures.some((f) => f.includes('leaks marker')));
		} finally { await leakier.close(); }
	});
	for (const s of [login, prot, control, ns]) await s.close();
}

// ---- authenticated hosted verification ------------------------------------------------------------
{
	const login = await loginServer();
	const seen = [];
	const good = await accessOrigin({ loginOrigin: login.origin, seen });
	const base = { origin: good.origin, alias: good.origin, token: 'GOOD', pins, inventory };
	await test('hosted: exact tree passes (Pages-style 404.html redirect included), seven PDFs match, _headers never requested', async () => {
		const r = await verifyHosted(base);
		assert.deepEqual(r.failures, []);
		assert.equal(r.sevenPdfs.length, 7);
		assert.ok(r.sevenPdfs.every((s) => s.match));
		assert.deepEqual(r.xRobotsTagValues, ['noindex, nofollow']);
		assert.ok(!seen.some((u) => u.includes('_headers')));
		assert.ok(seen.some((u) => u === '/404'), 'requested /404, not /404.html');
		assert.equal(r.aliasPdfs.length, 7);
		assert.equal(r.candidatePdfSha256Observed, pins.candidate.sha256);
	});
	await test('hosted: urlPathFor maps HTML to the served URL', () => {
		assert.equal(urlPathFor('index.html'), '/');
		assert.equal(urlPathFor('research/c/c/index.html'), '/research/c/c/');
		assert.equal(urlPathFor('404.html'), '/404');
		assert.equal(urlPathFor('_astro/a.css'), '/_astro/a.css');
	});
	await test('hosted: an expired session (Access redirect) fails with a clear message', async () => {
		const r = await verifyHosted({ ...base, token: 'BAD', accessSuffix: '127.0.0.1' });
		assert.ok(r.failures.some((f) => f.includes('session is not valid')));
	});
	await test('hosted: a non-Access redirect is reported as unexpected, not as a session failure', async () => {
		const redir = await serve((req, res) => { res.writeHead(308, { location: '/elsewhere' }); res.end(); });
		const r = await verifyHosted({ ...base, origin: redir.origin, alias: undefined });
		assert.ok(r.failures.some((f) => f.includes('unexpected redirect')));
		await redir.close();
	});
	for (const [label, mutate, expect] of [
		['one changed PDF byte', (m) => m.set(pins.candidate.pdfPath, Buffer.concat([pdf('cand'), Buffer.from('x')])), 'pinned PDF mismatch'],
		['a missing asset', (m) => m.delete('_astro/site.css'), 'HTTP 404'],
		['a changed non-HTML asset', (m) => m.set('robots.txt', Buffer.from('User-agent: *\nAllow: /\n')), 'differs from the inventory'],
		['an article page missing the candidate label', (m) => m.set('research/c/c/index.html', Buffer.from('<meta name="robots" content="noindex, nofollow"><a href="./c.pdf">Download candidate PDF</a>')), 'required text'],
		['an article page with a canonical tag', (m) => m.set('research/c/c/index.html', Buffer.from('<meta name="robots" content="noindex, nofollow">Candidate specimen Download candidate PDF <link rel="canonical" href="x">')), 'forbidden text'],
		['an article page with an injected script that keeps every marker', (m) => m.set('research/c/c/index.html', Buffer.concat([ARTICLE, Buffer.from('<script>x()</script>')])), 'article page SHA-256'],
	]) {
		await test(`hosted: ${label} fails`, async () => {
			const m = new Map(tree); mutate(m);
			const s = await accessOrigin({ files: m, loginOrigin: login.origin });
			try {
				const r = await verifyHosted({ ...base, origin: s.origin, alias: undefined });
				assert.ok(r.failures.some((f) => f.includes(expect)), r.failures.join('|'));
			} finally { await s.close(); }
		});
	}
	await test('hosted: a modified OTHER html page is counted but does not fail', async () => {
		const m = new Map(tree); m.set('index.html', Buffer.from('<html>rewritten by the host</html>'));
		const s = await accessOrigin({ files: m, loginOrigin: login.origin });
		try {
			const r = await verifyHosted({ ...base, origin: s.origin, alias: undefined });
			assert.deepEqual(r.failures, []);
			assert.ok(r.htmlMismatches >= 1);
		} finally { await s.close(); }
	});
	await test('hosted: a PDF served with the wrong content type fails', async () => {
		const s = await accessOrigin({ loginOrigin: login.origin, contentType: { 'research/c/c/c.pdf': 'text/plain' } });
		try { assert.ok((await verifyHosted({ ...base, origin: s.origin, alias: undefined })).failures.some((f) => f.includes('content-type'))); } finally { await s.close(); }
	});
	for (const robots of ['noindex', 'noindex,nofollow']) {
		await test(`hosted: X-Robots-Tag "${robots}" fails (the _headers rule did not apply)`, async () => {
			const s = await accessOrigin({ loginOrigin: login.origin, robots });
			try { assert.ok((await verifyHosted({ ...base, origin: s.origin, alias: undefined })).failures.some((f) => f.includes('X-Robots-Tag'))); } finally { await s.close(); }
		});
	}
	await test('hosted: an alias that rejects the replayed cookie names CF_AUTHORIZATION_ALIAS', async () => {
		const r = await verifyHosted({ ...base, aliasToken: 'BAD' });
		assert.ok(r.failures.some((f) => f.includes('CF_AUTHORIZATION_ALIAS')));
	});
	await good.close(); await login.close();
}

// ---- capture index -----------------------------------------------------------------------------------
const png = (w, h, seed, size = 5000) => {
	const chunk = (type, data) => { const b = Buffer.alloc(12 + data.length); b.writeUInt32BE(data.length, 0); b.write(type, 4, 'latin1'); data.copy(b, 8); b.writeUInt32BE(crc32(b.subarray(4, 8 + data.length)), 8 + data.length); return b; };
	const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
	const idat = Buffer.alloc(size); idat.writeUInt32BE(seed, 0);
	return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
};
const ORIGIN = 'https://abcd1234.cybernetics-mbp-preview.pages.dev';
let seedCounter = 1;
function captureSet({ desktop = [1440, 900, 3], mobile = [390, 844, 3], height = 2400, url = `${ORIGIN}${pins.route}`, routeHash = pins.candidate.routeHtmlSha256, report = { origin: ORIGIN, failures: [], candidatePdfSha256Observed: pins.candidate.sha256 } } = {}) {
	const dir = tmp();
	for (const [kind, [w, h, n]] of [['desktop', desktop], ['mobile', mobile]]) {
		writeFileSync(join(dir, `page-metrics-${kind}.json`), JSON.stringify({ url, innerWidth: w, innerHeight: h, scrollHeight: height, devicePixelRatio: 1, routeHtmlSha256: routeHash }));
		for (let i = 1; i <= n; i++) writeFileSync(join(dir, `${kind}-${String(i).padStart(3, '0')}.png`), png(w, h, seedCounter++));
	}
	const reportPath = join(dir, 'report.json');
	if (report) writeFileSync(reportPath, JSON.stringify(report));
	return { dir, reportPath };
}
const build = (s, origin = ORIGIN) => buildCaptureIndex({ dir: s.dir, origin, pins, reportPath: s.reportPath });
await test('captures: ordered full-height captures from a PASSING report, tied to the immutable URL, pass', () => {
	const s = captureSet({ height: 2400 });
	const { problems, index } = build(s);
	assert.deepEqual(problems, []);
	assert.equal(index.candidatePdfSha256Observed, pins.candidate.sha256);
	assert.equal(index.reportPassed, true);
	assert.match(index.attestation, /OWNER-ATTESTED/);
	assert.equal(index.articleUrl, `${ORIGIN}${pins.route}`);
	rmSync(s.dir, { recursive: true });
});
for (const [label, opts, expect, origin] of [
	['too few segments for the page height', { height: 9000 }, 'less than the page height'],
	['a capture of the alias URL instead of the immutable URL', { url: `https://t29-4-paper-c-preview.cybernetics-mbp-preview.pages.dev${pins.route}` }, 'not exactly the immutable article URL'],
	['an alias passed as --origin', {}, 'not an immutable preview URL', 'https://t29-4-paper-c-preview.cybernetics-mbp-preview.pages.dev'],
	['the production host passed as --origin', {}, 'not an immutable preview URL', 'https://cybernetics-mbp-preview.pages.dev'],
	['a query string in the metrics URL', { url: `${ORIGIN}${pins.route}?x=1` }, 'not exactly'],
	['an upper-case host in the metrics URL', { url: `https://ABCD1234.cybernetics-mbp-preview.pages.dev${pins.route}` }, 'not exactly'],
	['a mobile set at a desktop width', { mobile: [1200, 900, 3] }, 'is not 390'],
	['a mobile set at 480 px', { mobile: [480, 900, 3] }, 'is not 390'],
	['a desktop set at 1200 px', { desktop: [1200, 900, 3] }, 'is not 1440'],
	['a desktop set at a phone width', { desktop: [390, 844, 3] }, 'is not 1440'],
	['a page whose fetched HTML hash is not the pinned route hash', { routeHash: 'ab'.repeat(32) }, 'the browser fetched'],
	['no report', { report: null }, 'report is missing'],
	['a FAILED report', { report: { origin: ORIGIN, failures: ['x'], candidatePdfSha256Observed: pins.candidate.sha256 } }, 'did not pass'],
	['a report for another origin', { report: { origin: 'https://deadbeef.cybernetics-mbp-preview.pages.dev', failures: [], candidatePdfSha256Observed: pins.candidate.sha256 } }, 'differs from'],
	['a report that observed a different candidate PDF', { report: { origin: ORIGIN, failures: [], candidatePdfSha256Observed: 'cd'.repeat(32) } }, 'observed candidate PDF'],
]) {
	await test(`captures: ${label} fails`, () => {
		const s = captureSet(opts);
		const { problems } = build(s, origin);
		assert.ok(problems.some((p) => p.includes(expect)), problems.join('|'));
		rmSync(s.dir, { recursive: true });
	});
}
await test('captures: an implausibly small scrollHeight or a devicePixelRatio below 1 fails (default floor)', () => {
	const s = captureSet({ height: 100 });
	const strict = buildCaptureIndex({ dir: s.dir, origin: ORIGIN, pins: { ...pins, captureMinScrollHeight: undefined }, reportPath: s.reportPath });
	assert.ok(strict.problems.some((p) => p.includes('implausibly small')), strict.problems.join('|'));
	const m = JSON.parse(readFileSync(join(s.dir, 'page-metrics-desktop.json'), 'utf8')); m.devicePixelRatio = 0.1;
	writeFileSync(join(s.dir, 'page-metrics-desktop.json'), JSON.stringify(m));
	assert.ok(build(s).problems.some((p) => p.includes('below 1')));
	rmSync(s.dir, { recursive: true });
});
await test('captures: a numbering gap, a fabricated 33-byte PNG and duplicate images fail', () => {
	const s = captureSet({});
	rmSync(join(s.dir, 'desktop-002.png'));
	writeFileSync(join(s.dir, 'mobile-002.png'), Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(25)]));
	writeFileSync(join(s.dir, 'mobile-003.png'), readFileSync(join(s.dir, 'mobile-001.png')));
	const { problems } = build(s);
	assert.ok(problems.some((p) => p.includes('contiguous')) && problems.some((p) => p.includes('not a valid PNG')) && problems.some((p) => p.includes('identical bytes')), problems.join('|'));
	rmSync(s.dir, { recursive: true });
});
await test('captures: pngInfo checks chunk CRCs; a UTF-16 / BOM metrics file still parses', () => {
	const good = png(10, 20, 99);
	assert.deepEqual(pngInfo(good), { width: 10, height: 20 });
	const bad = Buffer.from(good); bad[40] ^= 0xff;
	assert.equal(pngInfo(bad), null);
	const s = captureSet({});
	const text = readFileSync(join(s.dir, 'page-metrics-desktop.json'), 'utf8');
	writeFileSync(join(s.dir, 'page-metrics-desktop.json'), Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(text, 'utf16le')]));
	writeFileSync(join(s.dir, 'page-metrics-mobile.json'), Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(readFileSync(join(s.dir, 'page-metrics-mobile.json'), 'utf8'))]));
	assert.deepEqual(build(s).problems, []);
	rmSync(s.dir, { recursive: true });
});

// ---- upload directory verifier (CLI) -------------------------------------------------------------------
{
	const dir = tmp();
	const write = (m) => { for (const [p, b] of m) { mkdirSync(dirname(join(dir, p)), { recursive: true }); writeFileSync(join(dir, p), b); } };
	const side = tmp();
	const tsv = join(side, 'inv.tsv');
	const tsvText = 'path\tbytes\tsha256\n' + inventory.map((r) => `${r.path}\t${r.bytes}\t${r.sha256}`).join('\n') + '\n';
	writeFileSync(tsv, tsvText);
	const pinsFile = join(side, 'pins.json');
	writeFileSync(pinsFile, JSON.stringify(pins));
	const check = (...extra) => spawnSync(process.execPath, [join(HERE, 'verify-upload-dir.mjs'), dir, '--inventory', tsv, '--pins', pinsFile, ...extra], { encoding: 'utf8' });
	write(tree);
	await test('upload dir: the exact tree passes and prints the digest to compare', () => { const r = check(); assert.equal(r.status, 0, r.stdout + r.stderr); assert.match(r.stdout, /directory digest [0-9a-f]{64}/); assert.match(r.stdout, /kit digest/); });
	await test('upload dir: an extra file fails', () => { writeFileSync(join(dir, 'extra.txt'), 'x'); assert.equal(check().status, 1); rmSync(join(dir, 'extra.txt')); });
	await test('upload dir: a changed byte in a PDF fails', () => { writeFileSync(join(dir, pins.candidate.pdfPath), pdf('other')); assert.equal(check().status, 1); writeFileSync(join(dir, pins.candidate.pdfPath), pdf('cand')); });
	await test('upload dir: a missing file fails', () => { rmSync(join(dir, 'robots.txt')); assert.equal(check().status, 1); writeFileSync(join(dir, 'robots.txt'), tree.get('robots.txt')); });
	await test('upload dir: a symlink fails', () => { symlinkSync(join(dir, 'robots.txt'), join(dir, 'link')); assert.equal(check().status, 1); rmSync(join(dir, 'link')); });
	await test('upload dir: --forbid-sha256 and --forbid-text reject forbidden content', () => {
		assert.equal(check('--forbid-sha256', sha256(tree.get('robots.txt'))).status, 1);
		assert.equal(check('--forbid-text', 'DISALLOW').status, 1);
		assert.equal(check('--forbid-text', 'not present anywhere').status, 0);
	});
	await test('upload dir: --canary rejects a folder carrying the manuscript title text', () => {
		const clean = check('--canary');
		assert.equal(clean.status, 1, 'the synthetic article contains the forbidden title phrase');
		assert.match(clean.stdout, /forbidden text/);
	});
	await test('upload dir: a CRLF inventory checkout still parses; a duplicate inventory row is refused', () => {
		writeFileSync(tsv, tsvText.replace(/\n/g, '\r\n'));
		assert.equal(readInventory(tsv).length, inventory.length);
		writeFileSync(tsv, tsvText + `${inventory[0].path}\t${inventory[0].bytes}\t${inventory[0].sha256}\n`);
		assert.throws(() => readInventory(tsv));
		writeFileSync(tsv, tsvText);
	});
	await test('digest: independent of record order and sorted by path, not by hash', () => {
		assert.equal(inventoryDigest([...inventory].reverse()), inventoryDigest(inventory));
		const byHash = [...inventory].sort((a, b) => (a.sha256 < b.sha256 ? -1 : 1));
		assert.notEqual(inventoryDigest(inventory), sha256(Buffer.from(byHash.map((r) => `${r.sha256}  ${r.path}\n`).join(''))));
	});
	rmSync(dir, { recursive: true }); rmSync(side, { recursive: true });
}

// ---- CLI-level canary runs with the canary's own pins and inventory ---------------------------------------
{
	const login = await loginServer();
	const good = await accessOrigin({ loginOrigin: login.origin });
	const control = await publicServer();
	const ns2 = await notServed();
	const side = tmp();
	const tsv = join(side, 'canary.tsv');
	writeFileSync(tsv, 'path\tbytes\tsha256\n' + inventory.map((r) => `${r.path}\t${r.bytes}\t${r.sha256}`).join('\n') + '\n');
	const pinsFile = join(side, 'canary-pins.json');
	writeFileSync(pinsFile, JSON.stringify(pins));
	const env = { ...process.env, CF_AUTHORIZATION: 'GOOD' };
	// Async spawn: the mock servers live in this process, so a blocking spawnSync would deadlock.
	const cli = (script, args, e = env) => new Promise((resolve) => {
		const child = spawn(process.execPath, [join(HERE, script), ...args], { env: e });
		let stdout = ''; let stderr = '';
		child.stdout.on('data', (d) => { stdout += d; }); child.stderr.on('data', (d) => { stderr += d; });
		child.on('close', (status) => resolve({ status, stdout, stderr }));
	});
	await test('CLI: the hosted verifier runs a canary with --pins and --inventory (exit 0)', async () => {
		const r = await cli('verify-hosted-preview.mjs', ['--origin', good.origin, '--alias', good.origin, '--pins', pinsFile, '--inventory', tsv, '--out', join(side, 'r.json'), '--skip-host-validation-for-tests']);
		assert.equal(r.status, 0, r.stdout + r.stderr);
		assert.match(r.stdout, /kit digest/);
	});
	await test('CLI: the hosted verifier without --pins refuses a canary tree (candidate inventory mismatch)', async () => {
		const r = await cli('verify-hosted-preview.mjs', ['--origin', good.origin, '--inventory', tsv, '--out', join(side, 'r2.json'), '--skip-host-validation-for-tests']);
		assert.notEqual(r.status, 0);
	});
	await test('CLI: a tampered inventory (digest differs from the pins) is refused before any request', async () => {
		writeFileSync(join(side, 'tampered.tsv'), readFileSync(tsv, 'utf8').replace(inventory[0].sha256, 'f'.repeat(64)));
		const r = await cli('verify-hosted-preview.mjs', ['--origin', good.origin, '--pins', pinsFile, '--inventory', join(side, 'tampered.tsv'), '--out', join(side, 'r3.json'), '--skip-host-validation-for-tests']);
		assert.equal(r.status, 2);
		assert.match(r.stdout, /inventory digest/);
	});
	await test('CLI: the hosted verifier rejects an alias or production origin', async () => {
		for (const o of ['https://t29-4-paper-c-preview.cybernetics-mbp-preview.pages.dev', 'https://cybernetics-mbp-preview.pages.dev']) assert.equal((await cli('verify-hosted-preview.mjs', ['--origin', o])).status, 2);
	});
	await test('CLI: the denial check requires --access-host and rejects non-project hosts', async () => {
		const common = ['--pins', pinsFile, '--inventory', tsv, '--control-html', `${control.origin}/page`, '--control-pdf', `${control.origin}/doc.pdf`, '--marker', 'Candidate specimen', '--allow-http-login-for-tests'];
		assert.equal((await cli('anonymous-denial-check.mjs', ['--protected', good.origin, ...common])).status, 2);
		assert.equal((await cli('anonymous-denial-check.mjs', ['--protected', 'https://evil.example.com', '--access-host', 'x.example', ...common])).status, 2);
	});
	await test('CLI: the denial check runs a canary with its own pins and the team host (exit 0)', async () => {
		const r = await cli('anonymous-denial-check.mjs', ['--protected', good.origin, '--not-served', ns2.origin, '--pins', pinsFile, '--inventory', tsv, '--access-host', '127.0.0.1', '--control-html', `${control.origin}/page`, '--control-pdf', `${control.origin}/doc.pdf`, '--marker', 'Candidate specimen', '--allow-http-login-for-tests', '--skip-host-validation-for-tests']);
		assert.equal(r.status, 0, r.stdout + r.stderr);
	});
	await good.close(); await login.close(); await control.close(); await ns2.close(); rmSync(side, { recursive: true });
}

console.log(`\nT29.4 kit: ${count} cases passed${process.exitCode ? ', FAILURES PRESENT' : ''}`);
process.exit(process.exitCode ?? 0);

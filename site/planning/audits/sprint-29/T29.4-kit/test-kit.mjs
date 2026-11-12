// T29.4 kit tests: local mock servers only (127.0.0.1); no network, no credentials, no Cloudflare.
// Usage: node test-kit.mjs
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { inventoryDigest, sha256 } from './kit-common.mjs';
import { run as denial } from './anonymous-denial-check.mjs';
import { buildCaptureIndex, verifyHosted } from './verify-hosted-preview.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
let count = 0;
const results = [];
async function test(name, fn) {
	try {
		await fn();
		count++;
		results.push(`PASS ${name}`); console.log(`PASS ${name}`);
	} catch (err) {
		results.push(`FAIL ${name}: ${err.message}`); console.log(`FAIL ${name}: ${err.message}`);
		process.exitCode = 1;
	}
}
const serve = (handler) => new Promise((resolve) => {
	const server = createServer(handler);
	server.listen(0, '127.0.0.1', () => resolve({ origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((r) => { server.close(r); server.closeAllConnections(); }) }));
});

// ---- synthetic tree, pins and inventory ---------------------------------------------------------
const pdf = (n) => Buffer.from(`%PDF-1.4\nsynthetic ${n}\n`);
const tree = new Map([
	['index.html', Buffer.from('<html>home</html>')],
	['404.html', Buffer.from('<html>missing</html>')],
	['robots.txt', Buffer.from('User-agent: *\nDisallow: /\n')],
	['_headers', Buffer.from('https://:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n')],
	['_astro/site.css', Buffer.from('body{}')],
	['research/c/c/index.html', Buffer.from('<html><meta name="robots" content="noindex, nofollow"><p>Candidate specimen</p><a href="./c.pdf">Download candidate PDF</a> Cybernetics and the Structural</html>')],
	['research/c/c/c.pdf', pdf('cand')],
]);
const historical = ['a', 'b', 'd', 'e', 'f', 'g'].map((k) => [`research/${k}/${k}/${k}.pdf`, pdf(k)]);
for (const [p, b] of historical) tree.set(p, b);
const inventory = [...tree].map(([path, bytes]) => ({ path, bytes: bytes.length, sha256: sha256(bytes) }));
const pins = {
	route: '/research/c/c/', correctionCommit: 'x', historical: historical.map(([path, b]) => ({ path, sha256: sha256(b) })),
	candidate: { pdfPath: 'research/c/c/c.pdf', sha256: sha256(pdf('cand')) },
	inventory: { digest: inventoryDigest(inventory) }, hostedExcludedFromDownloadChecks: ['_headers'], hostedRobotsHeader: 'noindex, nofollow',
};
const ROUTE = pins.route;
const PDF = `/${pins.candidate.pdfPath}`;

/** An Access-like origin: no/invalid cookie -> 302 to the login origin; cookie GOOD -> serves `files`. */
function accessOrigin({ files = tree, loginOrigin, robots = 'noindex, nofollow', leakRange = false, seen = [] }) {
	return serve((req, res) => {
		seen.push(req.url);
		const good = (req.headers.cookie ?? '').includes('CF_Authorization=GOOD');
		if (!good) {
			if (leakRange && req.headers.range) {
				res.writeHead(206, { 'content-type': 'application/pdf', 'content-range': 'bytes 0-15/100' });
				return res.end(pdf('cand'));
			}
			res.writeHead(302, { location: `${loginOrigin}/cdn-cgi/access/login/host?kid=1` });
			return res.end();
		}
		const path = req.url.split('?')[0];
		const key = path === '/' ? 'index.html' : path.endsWith('/') ? `${path.slice(1)}index.html` : path.slice(1);
		const body = files.get(key);
		if (!body || key === '_headers') {
			res.writeHead(404, { 'content-type': 'text/html' });
			return res.end('not found');
		}
		res.writeHead(200, { 'content-type': key.endsWith('.pdf') ? 'application/pdf' : key.endsWith('.html') ? 'text/html' : 'text/plain', 'x-robots-tag': robots });
		res.end(body);
	});
}
const loginServer = (body = '<html>Access login</html>', type = 'text/html') => serve((req, res) => { res.writeHead(200, { 'content-type': type }); res.end(body); });
const publicServer = (bad = false) => serve((req, res) => {
	if (bad) { res.writeHead(404); return res.end('nope'); }
	if (req.url.endsWith('.pdf')) { res.writeHead(req.headers.range ? 206 : 200, { 'content-type': 'application/pdf' }); return res.end(pdf('public')); }
	res.writeHead(200, { 'content-type': 'text/html' }); res.end('<html>public</html>');
});
const notServed = (serveIt = false) => serve((req, res) => {
	if (serveIt && req.url.endsWith('.pdf')) { res.writeHead(200, { 'content-type': 'application/pdf' }); return res.end(pdf('cand')); }
	res.writeHead(404, { 'content-type': 'text/html' }); res.end('Nothing is here yet');
});
const ctx = (o, extra = {}) => ({ protectedOrigins: [o.protectedOrigin], notServed: [o.notServedOrigin], route: ROUTE, pdf: PDF, controlHtml: `${o.controlOrigin}/page`, controlPdf: `${o.controlOrigin}/doc.pdf`, markers: ['Candidate specimen', 'T29.4 canary'], accessSuffix: '127.0.0.1', allowHttp: true, ...extra });

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
		assert.ok(r.records.filter((x) => x.role === 'protected').every((x) => x.verdict === 'DENIED_REDIRECT' && x.login.ok));
		assert.equal(r.records.filter((x) => x.role === 'protected').length, 5);
		assert.equal(r.records.filter((x) => x.role === 'protected' && x.request === 'pdf Range').length, 1);
	});
	await test('denial: the first response is judged; the redirect is not followed implicitly', async () => {
		const r = await denial(ctx(o));
		assert.ok(r.records.filter((x) => x.role === 'protected').every((x) => x.status === 302));
	});
	await test('denial: an Access redirect to a non-Access host fails', async () => {
		const r = await denial(ctx(o, { accessSuffix: 'access.test' }));
		assert.ok(r.failures.some((f) => f.includes('non-Access destination')));
	});
	await test('denial: a public control that is NOT exposed marks the check untrustworthy', async () => {
		const badControl = await publicServer(true);
		const r = await denial(ctx({ ...o, controlOrigin: badControl.origin }));
		assert.equal(r.controlFailed, true);
		await badControl.close();
	});
	await test('denial: a production host serving the PDF fails', async () => {
		const leaky = await notServed(true);
		const r = await denial(ctx({ ...o, notServedOrigin: leaky.origin }));
		assert.ok(r.failures.some((f) => f.includes('expected 404')));
		await leaky.close();
	});
	await test('denial: a host that leaks the PDF to an anonymous Range request fails', async () => {
		const leak = await accessOrigin({ loginOrigin: login.origin, leakRange: true });
		const r = await denial(ctx({ ...o, protectedOrigin: leak.origin }));
		assert.ok(r.failures.some((f) => f.includes('pdf Range') && f.includes('EXPOSED')));
		await leak.close();
	});
	await test('denial: a public (unprotected) origin is reported EXPOSED on article and PDF', async () => {
		const open = await publicServer();
		const r = await denial(ctx({ ...o, protectedOrigin: open.origin }, { route: '/page', pdf: '/doc.pdf' }));
		assert.ok(r.failures.length >= 5 && r.failures.every((f) => f.includes('EXPOSED')));
		await open.close();
	});
	await test('denial: a login destination that serves PDF bytes fails the separate login validation', async () => {
		const evil = await loginServer(pdf('cand'), 'application/pdf');
		const leak = await accessOrigin({ loginOrigin: evil.origin });
		const r = await denial(ctx({ ...o, protectedOrigin: leak.origin }));
		assert.ok(r.failures.some((f) => f.includes('login validation failed')));
		await evil.close(); await leak.close();
	});
	await test('denial: 403 first responses pass, with a leak in the body they fail', async () => {
		const forbid = await serve((req, res) => { res.writeHead(403, { 'content-type': 'text/html' }); res.end('denied'); });
		const leakier = await serve((req, res) => { res.writeHead(403, { 'content-type': 'text/html' }); res.end('Candidate specimen'); });
		try {
			assert.deepEqual((await denial(ctx({ ...o, protectedOrigin: forbid.origin }))).failures, []);
			// HEAD responses carry no body, so only the three GET requests can show the leak.
			assert.equal((await denial(ctx({ ...o, protectedOrigin: leakier.origin }))).failures.length, 3);
		} finally {
			await forbid.close(); await leakier.close();
		}
	});
	for (const s of [login, prot, control, ns]) await s.close();
}

// ---- authenticated hosted verification ------------------------------------------------------------
{
	const login = await loginServer();
	const seen = [];
	const good = await accessOrigin({ loginOrigin: login.origin, seen });
	const base = { origin: good.origin, alias: good.origin, token: 'GOOD', pins, inventory };
	await test('hosted: exact tree passes, seven PDFs match, _headers is never requested', async () => {
		const r = await verifyHosted(base);
		assert.deepEqual(r.failures, []);
		assert.equal(r.sevenPdfs.length, 7);
		assert.ok(r.sevenPdfs.every((s) => s.match));
		assert.deepEqual(r.xRobotsTagValues, ['noindex, nofollow']);
		assert.ok(!seen.some((u) => u.includes('_headers')));
		assert.equal(r.aliasPdfs.length, 7);
	});
	await test('hosted: an invalid or expired session (302) fails', async () => {
		const r = await verifyHosted({ ...base, token: 'BAD' });
		assert.ok(r.failures.some((f) => f.includes('not valid')));
	});
	for (const [label, mutate, expect] of [
		['one changed PDF byte', (m) => m.set(pins.candidate.pdfPath, Buffer.concat([pdf('cand'), Buffer.from('x')])), 'pinned PDF mismatch'],
		['a missing asset', (m) => m.delete('_astro/site.css'), 'HTTP 404'],
		['a changed non-HTML asset', (m) => m.set('robots.txt', Buffer.from('User-agent: *\nAllow: /\n')), 'differs from the inventory'],
		['an article page missing the candidate label', (m) => m.set('research/c/c/index.html', Buffer.from('<meta name="robots" content="noindex, nofollow"><a href="./c.pdf">Download candidate PDF</a>')), 'required text'],
		['an article page with a canonical tag', (m) => m.set('research/c/c/index.html', Buffer.from('<meta name="robots" content="noindex, nofollow">Candidate specimen Download candidate PDF <link rel="canonical" href="x">')), 'forbidden text'],
	]) {
		await test(`hosted: ${label} fails`, async () => {
			const m = new Map(tree); mutate(m);
			const s = await accessOrigin({ files: m, loginOrigin: login.origin });
			const r = await verifyHosted({ ...base, origin: s.origin, alias: undefined });
			assert.ok(r.failures.some((f) => f.includes(expect)), r.failures.join('|'));
			await s.close();
		});
	}
	await test('hosted: the shorter default X-Robots-Tag "noindex" fails (the _headers rule did not apply)', async () => {
		const s = await accessOrigin({ loginOrigin: login.origin, robots: 'noindex' });
		const r = await verifyHosted({ ...base, origin: s.origin, alias: undefined });
		assert.ok(r.failures.some((f) => f.includes('X-Robots-Tag')));
		await s.close();
	});
	await good.close(); await login.close();
}

// ---- capture index -----------------------------------------------------------------------------------
const png = (w, h) => { const b = Buffer.alloc(33); Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b); b.writeUInt32BE(13, 8); b.write('IHDR', 12, 'latin1'); b.writeUInt32BE(w, 16); b.writeUInt32BE(h, 20); return b; };
const ORIGIN = 'https://abcd1234.cybernetics-mbp-preview.pages.dev';
function captureDir({ desktop = [1440, 900, 3], mobile = [390, 844, 3], height = 2400, urlOf = `${ORIGIN}${pins.route}` } = {}) {
	const dir = mkdtempSync(join(tmpdir(), 'cap-'));
	for (const [kind, [w, h, n]] of [['desktop', desktop], ['mobile', mobile]]) {
		writeFileSync(join(dir, `page-metrics-${kind}.json`), JSON.stringify({ url: urlOf, innerWidth: w, innerHeight: h, scrollHeight: height, devicePixelRatio: 1 }));
		for (let i = 1; i <= n; i++) writeFileSync(join(dir, `${kind}-${String(i).padStart(3, '0')}.png`), png(w, h));
	}
	return dir;
}
await test('captures: contiguous ordered full-height captures tied to the immutable URL pass', async () => {
	const dir = captureDir({ desktop: [1440, 900, 3], mobile: [390, 844, 3], height: 2400 });
	const { problems, index } = buildCaptureIndex({ dir, origin: ORIGIN, pins, reportSha256: 'ab'.repeat(32) });
	assert.deepEqual(problems, []);
	assert.equal(index.candidatePdfSha256, pins.candidate.sha256);
	assert.equal(index.articleUrl, `${ORIGIN}${pins.route}`);
	rmSync(dir, { recursive: true });
});
for (const [label, opts, expect] of [
	['too few segments for the page height', { height: 9000 }, 'less than the page height'],
	['a capture of the alias URL instead of the immutable URL', { urlOf: `https://t29-4-paper-c-preview.cybernetics-mbp-preview.pages.dev${pins.route}` }, 'is not the immutable article URL'],
	['a mobile set at a desktop width', { mobile: [1200, 900, 3] }, 'not a mobile width'],
	['a desktop set at a phone width', { desktop: [390, 844, 3] }, 'not a desktop width'],
]) {
	await test(`captures: ${label} fails`, async () => {
		const dir = captureDir(opts);
		const { problems } = buildCaptureIndex({ dir, origin: ORIGIN, pins });
		assert.ok(problems.some((p) => p.includes(expect)), problems.join('|'));
		rmSync(dir, { recursive: true });
	});
}
await test('captures: a numbering gap and a non-PNG file fail', async () => {
	const dir = captureDir({});
	rmSync(join(dir, 'desktop-002.png'));
	writeFileSync(join(dir, 'mobile-002.png'), 'not a png');
	const { problems } = buildCaptureIndex({ dir, origin: ORIGIN, pins });
	assert.ok(problems.some((p) => p.includes('contiguous')) && problems.some((p) => p.includes('not a PNG')));
	rmSync(dir, { recursive: true });
});

// ---- upload directory verifier (CLI) -------------------------------------------------------------------
{
	const dir = mkdtempSync(join(tmpdir(), 'upl-'));
	const write = (m) => { for (const [p, b] of m) { mkdirSync(dirname(join(dir, p)), { recursive: true }); writeFileSync(join(dir, p), b); } };
	const tsv = join(dir, '..', `inv-${process.pid}.tsv`);
	writeFileSync(tsv, 'path\tbytes\tsha256\n' + inventory.map((r) => `${r.path}\t${r.bytes}\t${r.sha256}`).join('\n') + '\n');
	const pinsFile = join(dir, '..', `pins-${process.pid}.json`);
	writeFileSync(pinsFile, JSON.stringify(pins));
	const check = () => spawnSync(process.execPath, [join(HERE, 'verify-upload-dir.mjs'), dir, '--inventory', tsv, '--pins', pinsFile], { encoding: 'utf8' });
	write(tree);
	await test('upload dir: the exact tree passes', () => { const r = check(); assert.equal(r.status, 0, r.stdout + r.stderr); });
	await test('upload dir: an extra file fails', () => { writeFileSync(join(dir, 'extra.txt'), 'x'); assert.equal(check().status, 1); rmSync(join(dir, 'extra.txt')); });
	await test('upload dir: a changed byte in a PDF fails', () => { writeFileSync(join(dir, pins.candidate.pdfPath), pdf('other')); assert.equal(check().status, 1); writeFileSync(join(dir, pins.candidate.pdfPath), pdf('cand')); });
	await test('upload dir: a missing file fails', () => { rmSync(join(dir, 'robots.txt')); assert.equal(check().status, 1); writeFileSync(join(dir, 'robots.txt'), tree.get('robots.txt')); });
	await test('upload dir: a symlink fails', () => { symlinkSync(join(dir, 'robots.txt'), join(dir, 'link')); assert.equal(check().status, 1); rmSync(join(dir, 'link')); });
	await test('digest: independent of record order and sorted by path, not by hash', () => {
		assert.equal(inventoryDigest([...inventory].reverse()), inventoryDigest(inventory));
		const byHash = [...inventory].sort((a, b) => (a.sha256 < b.sha256 ? -1 : 1));
		assert.notEqual(inventoryDigest(inventory), sha256(Buffer.from(byHash.map((r) => `${r.sha256}  ${r.path}\n`).join(''))));
	});
	rmSync(dir, { recursive: true }); rmSync(tsv); rmSync(pinsFile);
}

console.log(results.join('\n'));
console.log(`\nT29.4 kit: ${count} cases passed${process.exitCode ? ', FAILURES PRESENT' : ''}`);
process.exit(process.exitCode ?? 0);

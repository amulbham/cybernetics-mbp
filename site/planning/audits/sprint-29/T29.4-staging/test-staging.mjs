// T29.4 (staging) kit tests: local servers only (127.0.0.1); no network, no credentials, no Cloudflare.
// Usage: node test-staging.mjs   (first verifies the COMMITTED SHA256SUMS; make-sums.mjs is for authoring only)
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { crc32 } from 'node:zlib';
import { HERE, inventoryDigest, kitIntegrity, pngInfo, sha256 } from './kit-common.mjs';
import { serveDir } from './local-pages-server.mjs';
import { buildCaptureIndex, parseRedirects, rollbackCheck, urlPathFor, verifyHost, verifyProduction } from './verify-staging.mjs';

let count = 0;
async function test(name, fn) {
	try { await fn(); count++; console.log(`PASS ${name}`); } catch (err) { console.log(`FAIL ${name}: ${err.message}`); process.exitCode = 1; }
}
const tmp = () => mkdtempSync(join(tmpdir(), 't294s-'));
const pdf = (n) => Buffer.from(`%PDF-1.4\nsynthetic ${n}\n`);
const ARTICLE = Buffer.from('<html><meta name="robots" content="noindex, nofollow"><p>Candidate specimen</p><p>Intended concept DOI (public verification pending): x</p><a href="./c.pdf">Download candidate PDF</a></html>');
const REDIRECTS = '/old /new 301\n/old/ /new/ 301\n/x.png /y.png 301\n';
const files = new Map([
	['index.html', Buffer.from('<html>home</html>')], ['404.html', Buffer.from('<html>missing</html>')],
	['robots.txt', Buffer.from('User-agent: *\nDisallow: /\n')], ['sitemap-0.xml', Buffer.from('<urlset><url><loc>https://amulbham.com/a/</loc></url></urlset>')],
	['_headers', Buffer.from('/*\n  X-Robots-Tag: noindex, nofollow\n')], ['_redirects', Buffer.from(REDIRECTS)],
	['_astro/site.css', Buffer.from('body{}')], ['pagefind/pagefind-entry.json', Buffer.from('{}')],
	['research/c/c/index.html', ARTICLE], ['research/c/c/c.pdf', pdf('cand')],
	...['a', 'b', 'd', 'e', 'f', 'g'].map((k) => [`research/${k}/${k}/${k}.pdf`, pdf(k)]),
]);
const inventory = [...files].map(([path, b]) => ({ path, bytes: b.length, sha256: sha256(b) }));
const pins = {
	project: 'cybernetics-mbp-site', route: '/research/c/c/', correctionCommit: 'x',
	candidate: { pdfPath: 'research/c/c/c.pdf', sha256: sha256(pdf('cand')), routeHtmlSha256: sha256(ARTICLE) },
	historical: ['a', 'b', 'd', 'e', 'f', 'g'].map((k) => ({ path: `research/${k}/${k}/${k}.pdf`, sha256: sha256(pdf(k)) })),
	inventory: { digest: inventoryDigest(inventory) }, controlFiles: ['_headers', '_redirects'], robotsHeader: 'noindex, nofollow',
	articleMarkers: { required: ['<meta name="robots" content="noindex, nofollow">', 'Candidate specimen', 'public verification pending', 'Download candidate PDF'], forbidden: ['rel="canonical"', 'application/ld+json', 'name="citation_'] },
	productionSitemapUrlCount: 1, captureMinScrollHeight: 1000,
};
const redirects = parseRedirects(REDIRECTS);
const write = (root, m) => { for (const [p, b] of m) { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), b); } };
async function host(mutate = () => {}, opts = {}) {
	const root = tmp();
	const m = new Map(files); mutate(m);
	write(root, m);
	const s = await serveDir(root, opts);
	return { ...s, close: async () => { await s.close(); rmSync(root, { recursive: true }); } };
}
const verify = (origin) => verifyHost({ origin, pins, inventory, redirects });

await test('kit integrity: the committed SHA256SUMS matches; tampering is detected; a CRLF checkout verifies identically', () => {
	assert.equal(kitIntegrity().ok, true, kitIntegrity().problems.join('|'));
	const d = tmp(); cpSync(HERE, d, { recursive: true });
	writeFileSync(join(d, 'verify-staging.mjs'), readFileSync(join(d, 'verify-staging.mjs'), 'utf8') + '\n// tampered\n');
	assert.equal(kitIntegrity(d).ok, false);
	rmSync(d, { recursive: true });
	const c = tmp(); cpSync(HERE, c, { recursive: true });
	for (const f of ['SHA256SUMS', 'kit-common.mjs', 'verify-upload-dir.mjs', 'verify-staging.mjs', 'capture-staging.mjs', 'assemble-staging-tree.mjs', 'local-pages-server.mjs', 'test-staging.mjs', 'pins.json', 'T29.4-staging-upload-inventory.tsv', 'T29.4-staging-redirects.txt', 'T29.4-staging-pre-upload-state.tsv']) writeFileSync(join(c, f), readFileSync(join(c, f), 'utf8').replace(/\n/g, '\r\n'));
	assert.equal(kitIntegrity(c).ok, true);
	assert.equal(kitIntegrity(c).digest, kitIntegrity().digest);
	rmSync(c, { recursive: true });
});
await test('urlPathFor maps inventory HTML to the served URL', () => {
	assert.deepEqual([urlPathFor('index.html'), urlPathFor('research/c/c/index.html'), urlPathFor('404.html'), urlPathFor('_astro/a.css')], ['/', '/research/c/c/', '/404', '/_astro/a.css']);
});
await test('host: the exact tree passes — seven PDFs, headers, redirects, closed indexing, control files not served', async () => {
	const h = await host();
	try {
		const r = await verify(h.origin);
		assert.deepEqual(r.failures, []);
		assert.equal(r.sevenPdfs.length, 7);
		assert.ok(r.sevenPdfs.every((s) => s.match));
		assert.deepEqual(r.xRobotsTagValues, ['noindex, nofollow']);
		assert.equal(r.redirectResults.length, 3);
		assert.deepEqual(r.controlServed, { _headers: 404, _redirects: 404 });
	} finally { await h.close(); }
});
for (const [label, mutate, expect] of [
	['one changed PDF byte', (m) => m.set(pins.candidate.pdfPath, Buffer.concat([pdf('cand'), Buffer.from('x')])), 'pinned PDF mismatch'],
	['a historical PDF replaced by a different PDF', (m) => m.set('research/a/a/a.pdf', pdf('regenerated')), 'pinned PDF mismatch'],
	['a missing search asset', (m) => m.delete('pagefind/pagefind-entry.json'), 'HTTP 404'],
	['a changed non-HTML asset', (m) => m.set('_astro/site.css', Buffer.from('body{color:red}')), 'differs from the inventory'],
	['an injected script in the article', (m) => m.set('research/c/c/index.html', Buffer.concat([ARTICLE, Buffer.from('<script>x()</script>')])), 'article page SHA-256'],
	['a canonical tag in the article', (m) => m.set('research/c/c/index.html', Buffer.from('<meta name="robots" content="noindex, nofollow">Candidate specimen Download candidate PDF <link rel="canonical" href="x">')), 'forbidden text'],
	['the pending-DOI label missing from the article', (m) => m.set('research/c/c/index.html', Buffer.from('<meta name="robots" content="noindex, nofollow">Candidate specimen Download candidate PDF')), 'lacks required text'],
	['a redirect to another host with the same path', (m) => m.set('_redirects', Buffer.from('/old https://evil.example/new 301\n/old/ /new/ 301\n/x.png /y.png 301\n')), 'redirect /old'],
	['a redirect with an added query string', (m) => m.set('_redirects', Buffer.from('/old /new?x=1 301\n/old/ /new/ 301\n/x.png /y.png 301\n')), 'redirect /old'],
	['the Paper C route in the sitemap', (m) => m.set('sitemap-0.xml', Buffer.from('<urlset><url><loc>https://amulbham.com/research/c/c/</loc></url></urlset>')), 'lists the Paper C route'],
	['robots.txt allowing crawling', (m) => m.set('robots.txt', Buffer.from('User-agent: *\nAllow: /\n')), 'Disallow'],
	['a redirect rule answering 302', (m) => m.set('_redirects', Buffer.from('/old /new 302\n/old/ /new/ 301\n/x.png /y.png 301\n')), 'redirect /old'],
	['a redirect rule with the wrong target', (m) => m.set('_redirects', Buffer.from('/old /wrong 301\n/old/ /new/ 301\n/x.png /y.png 301\n')), 'redirect /old'],
]) {
	await test(`host: ${label} fails`, async () => {
		const h = await host(mutate);
		try { assert.ok((await verify(h.origin)).failures.some((f) => f.includes(expect)), 'expected a failure containing: ' + expect); } finally { await h.close(); }
	});
}
await test('host: a modified OTHER html page is counted but does not fail', async () => {
	const h = await host((m) => m.set('index.html', Buffer.from('<html>rewritten by the host</html>')));
	try { const r = await verify(h.origin); assert.deepEqual(r.failures, []); assert.ok(r.htmlMismatches >= 1); } finally { await h.close(); }
});
for (const robots of ['noindex', 'noindex,nofollow']) {
	await test(`host: X-Robots-Tag "${robots}" fails (the _headers rule did not apply)`, async () => {
		const h = await host(() => {}, { robots });
		try { assert.ok((await verify(h.origin)).failures.some((f) => f.includes('X-Robots-Tag'))); } finally { await h.close(); }
	});
}
await test('host: a PDF served with the wrong content type fails', async () => {
	const h = await host(() => {}, { overrides: new Map([[`/${pins.candidate.pdfPath}`, { body: pdf('cand'), type: 'text/plain' }]]) });
	try { assert.ok((await verify(h.origin)).failures.some((f) => f.includes('content-type'))); } finally { await h.close(); }
});
await test('host: a served _headers file is recorded (informational), not a failure', async () => {
	const h = await host(() => {}, { overrides: new Map([['/_headers', { body: 'x', type: 'text/plain' }]]) });
	try { const r = await verify(h.origin); assert.equal(r.controlServed._headers, 200); assert.deepEqual(r.failures, []); } finally { await h.close(); }
});

// ---- production and rollback ------------------------------------------------------------------------------------
const prodFiles = (m) => { for (const [p] of m) if (p.startsWith('research/c/c/')) m.delete(p); };
await test('production: no Paper C route or PDF, six PDFs byte-exact, expected sitemap -> pass', async () => {
	const h = await host(prodFiles);
	try { const r = await verifyProduction({ hosts: [h.origin], pins }); assert.deepEqual(r.failures, []); } finally { await h.close(); }
});
await test('production: serving the candidate PDF, a changed historical PDF or a wrong sitemap count fails', async () => {
	const a = await host(() => {}); const b = await host((m) => { prodFiles(m); m.set('research/a/a/a.pdf', pdf('x')); }); const c = await host((m) => { prodFiles(m); m.set('sitemap-0.xml', Buffer.from('<urlset><url><loc>a</loc></url><url><loc>b</loc></url></urlset>')); });
	try {
		assert.ok((await verifyProduction({ hosts: [a.origin], pins })).failures.some((f) => f.includes('expected 404')));
		assert.ok((await verifyProduction({ hosts: [b.origin], pins })).failures.some((f) => f.includes('production PDF differs')));
		assert.ok((await verifyProduction({ hosts: [c.origin], pins })).failures.some((f) => f.includes('sitemap lists')));
	} finally { await a.close(); await b.close(); await c.close(); }
});
await test('rollback check: pages equal the recorded state pass; a changed page fails; PDFs are informational', async () => {
	const h = await host();
	try {
		const paths = ['/', '/research/c/c/', '/robots.txt', '/research/a/a/a.pdf'];
		const get = async (p) => sha256(Buffer.from(await (await fetch(new URL(p, h.origin))).arrayBuffer()));
		const good = 'path\tstatus\tsha256_alias\tsha256_old\n' + (await Promise.all(paths.map(async (p) => `${p}\t200\t${await get(p)}\t-`))).join('\n') + '\n';
		assert.deepEqual((await rollbackCheck({ alias: h.origin, stateText: good })).failures, []);
		const bad = good.replace(/^(\/\t200\t)[0-9a-f]{64}/m, `$1${'0'.repeat(64)}`).replace(/^(\/research\/a\/a\/a\.pdf\t200\t)[0-9a-f]{64}/m, `$1${'1'.repeat(64)}`);
		const r = await rollbackCheck({ alias: h.origin, stateText: bad });
		assert.equal(r.failures.length, 1);
		assert.equal(r.pdfDiffs.length, 1);
	} finally { await h.close(); }
});

// ---- capture index ----------------------------------------------------------------------------------------------
const png = (w, h, seed, size = 5000) => {
	const chunk = (type, data) => { const b = Buffer.alloc(12 + data.length); b.writeUInt32BE(data.length, 0); b.write(type, 4, 'latin1'); data.copy(b, 8); b.writeUInt32BE(crc32(b.subarray(4, 8 + data.length)), 8 + data.length); return b; };
	const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
	const idat = Buffer.alloc(size); idat.writeUInt32BE(seed, 0);
	return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
};
const ORIGIN = 'https://abcd1234.cybernetics-mbp-site.pages.dev';
let seed = 1;
function captureSet({ desktop = [1440, 900, 3], mobile = [390, 844, 3], height = 2400, url = `${ORIGIN}${pins.route}`, routeHash = pins.candidate.routeHtmlSha256, report = { origin: ORIGIN, failures: [], immutable: { sevenPdfs: [{ observed: pins.candidate.sha256 }] } } } = {}) {
	const dir = tmp();
	for (const [kind, [w, h, n]] of [['desktop', desktop], ['mobile', mobile]]) {
		writeFileSync(join(dir, `page-metrics-${kind}.json`), JSON.stringify({ url, innerWidth: w, innerHeight: h, scrollHeight: height, devicePixelRatio: 1, routeHtmlSha256: routeHash }));
		for (let i = 1; i <= n; i++) writeFileSync(join(dir, `${kind}-${String(i).padStart(3, '0')}.png`), png(w, h, seed++));
	}
	if (report) writeFileSync(join(dir, 'report.json'), JSON.stringify(report));
	return dir;
}
const build = (dir, origin = ORIGIN) => buildCaptureIndex({ dir, origin, pins, reportPath: join(dir, 'report.json') });
await test('captures: ordered captures from a PASSING report tied to the immutable URL pass', () => {
	const d = captureSet({}); const { problems, index } = build(d);
	assert.deepEqual(problems, []); assert.equal(index.reportPassed, true); assert.equal(index.candidatePdfSha256Pinned, pins.candidate.sha256);
	rmSync(d, { recursive: true });
});
for (const [label, opts, expect, origin] of [
	['too few segments', { height: 9000 }, 'less than the page height'],
	['the staging alias URL instead of the immutable URL', { url: `https://staging.cybernetics-mbp-site.pages.dev${pins.route}` }, 'not exactly the immutable article URL'],
	['the alias passed as the origin', {}, 'not an immutable deployment URL', 'https://staging.cybernetics-mbp-site.pages.dev'],
	['a query string in the metrics URL', { url: `${ORIGIN}${pins.route}?x=1` }, 'not exactly'],
	['a mobile set at 480 px', { mobile: [480, 900, 3] }, 'is not 390'],
	['a desktop set at 1200 px', { desktop: [1200, 900, 3] }, 'is not 1440'],
	['a fetched-HTML hash that is not the pinned article hash', { routeHash: 'ab'.repeat(32) }, 'fetched article HTML'],
	['a missing report', { report: null }, 'report is missing'],
	['a failed report', { report: { origin: ORIGIN, failures: ['x'], immutable: { sevenPdfs: [{ observed: pins.candidate.sha256 }] } } }, 'did not pass'],
	['a report that did not observe the candidate PDF', { report: { origin: ORIGIN, failures: [], immutable: { sevenPdfs: [{ observed: 'cd'.repeat(32) }] } } }, 'did not observe'],
]) {
	await test(`captures: ${label} fails`, () => { const d = captureSet(opts); assert.ok(build(d, origin).problems.some((p) => p.includes(expect)), expect); rmSync(d, { recursive: true }); });
}
await test('captures: a numbering gap, a fabricated PNG and duplicate images fail; scrollHeight floor applies', () => {
	const d = captureSet({});
	rmSync(join(d, 'desktop-002.png'));
	writeFileSync(join(d, 'mobile-002.png'), Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(25)]));
	writeFileSync(join(d, 'mobile-003.png'), readFileSync(join(d, 'mobile-001.png')));
	const p = build(d).problems.join('|');
	assert.ok(p.includes('contiguous') && p.includes('not a valid PNG') && p.includes('identical bytes'), p);
	assert.deepEqual(pngInfo(png(10, 20, 9)), { width: 10, height: 20 });
	const s = captureSet({ height: 100 });
	assert.ok(buildCaptureIndex({ dir: s, origin: ORIGIN, pins: { ...pins, captureMinScrollHeight: undefined }, reportPath: join(s, 'report.json') }).problems.some((q) => q.includes('implausibly small')));
	rmSync(d, { recursive: true }); rmSync(s, { recursive: true });
});

// ---- upload directory verifier and CLIs ---------------------------------------------------------------------------
{
	const dir = tmp(); const side = tmp();
	write(dir, files);
	const tsv = join(side, 'inv.tsv'); writeFileSync(tsv, 'path\tbytes\tsha256\n' + inventory.map((r) => `${r.path}\t${r.bytes}\t${r.sha256}`).join('\n') + '\n');
	const pinsFile = join(side, 'pins.json');
	writeFileSync(pinsFile, JSON.stringify({ ...pins, redirectsSha256: sha256(files.get('_redirects')) }));
	const check = () => spawnSync(process.execPath, [join(HERE, 'verify-upload-dir.mjs'), dir, '--inventory', tsv, '--pins', pinsFile], { encoding: 'utf8' });
	await test('upload dir: the exact tree passes and prints the digest to compare', () => { const r = check(); assert.equal(r.status, 0, r.stdout + r.stderr); assert.match(r.stdout, /directory digest [0-9a-f]{64}/); });
	await test('upload dir: an extra file, a changed PDF, a missing file, a missing search index and a symlink each fail', () => {
		writeFileSync(join(dir, 'extra.txt'), 'x'); assert.equal(check().status, 1); rmSync(join(dir, 'extra.txt'));
		writeFileSync(join(dir, pins.candidate.pdfPath), pdf('other')); assert.equal(check().status, 1); writeFileSync(join(dir, pins.candidate.pdfPath), pdf('cand'));
		rmSync(join(dir, 'robots.txt')); assert.equal(check().status, 1); writeFileSync(join(dir, 'robots.txt'), files.get('robots.txt'));
		rmSync(join(dir, 'pagefind/pagefind-entry.json')); assert.equal(check().status, 1); writeFileSync(join(dir, 'pagefind/pagefind-entry.json'), files.get('pagefind/pagefind-entry.json'));
		symlinkSync(join(dir, 'robots.txt'), join(dir, 'link')); assert.equal(check().status, 1); rmSync(join(dir, 'link'));
		assert.equal(check().status, 0);
	});
	await test('digest: independent of record order and sorted by path, not by hash', () => {
		assert.equal(inventoryDigest([...inventory].reverse()), inventoryDigest(inventory));
		const byHash = [...inventory].sort((a, b) => (a.sha256 < b.sha256 ? -1 : 1));
		assert.notEqual(inventoryDigest(inventory), sha256(Buffer.from(byHash.map((r) => `${r.sha256}  ${r.path}\n`).join(''))));
	});
	const srv = await serveDir(dir);
	const cli = (args) => new Promise((resolve) => { const c = spawn(process.execPath, [join(HERE, 'verify-staging.mjs'), ...args]); let o = ''; c.stdout.on('data', (d) => { o += d; }); c.stderr.on('data', (d) => { o += d; }); c.on('close', (status) => resolve({ status, o })); });
	await test('CLI: verify-staging refuses an alias or non-deployment origin and a tampered inventory', async () => {
		assert.equal((await cli(['--origin', 'https://staging.cybernetics-mbp-site.pages.dev'])).status, 2);
		assert.equal((await cli(['--origin', 'https://example.com'])).status, 2);
		assert.equal((await cli(['--origin', srv.origin])).status, 2);
	});
	await srv.close(); rmSync(dir, { recursive: true }); rmSync(side, { recursive: true });
}
console.log(`\nT29.4 staging kit: ${count} cases passed${process.exitCode ? ', FAILURES PRESENT' : ''}`);
process.exit(process.exitCode ?? 0);

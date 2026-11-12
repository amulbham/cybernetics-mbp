// T29.4 (staging) — a local static server that imitates the Cloudflare Pages behaviors the checks rely on:
// `_headers` (X-Robots-Tag) and `_redirects` are applied and never served, `/x.html` redirects (308) to `/x`,
// `/dir` redirects to `/dir/`, `/dir/` serves dir/index.html, missing paths serve 404.html with status 404.
// Used only by test-staging.mjs and by the kit's own dry run on the real upload tree; it is not a Pages replica.
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, normalize, extname } from 'node:path';

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.wasm': 'application/wasm', '.pagefind': 'application/octet-stream', '.pf_meta': 'application/octet-stream', '.pf_index': 'application/octet-stream', '.pf_fragment': 'application/octet-stream', '.pf_filter': 'application/octet-stream', '.xsl': 'text/xsl' };

export function serveDir(root, { robots = 'noindex, nofollow', overrides = new Map() } = {}) {
	const redirects = new Map();
	const rpath = join(root, '_redirects');
	if (existsSync(rpath)) for (const l of readFileSync(rpath, 'utf8').split('\n').filter(Boolean)) { const [from, to, status] = l.trim().split(/\s+/); redirects.set(from, { to, status: Number(status) }); }
	const isFile = (p) => existsSync(p) && statSync(p).isFile();
	const server = createServer((req, res) => {
		const url = new URL(req.url, 'http://x');
		const path = decodeURIComponent(url.pathname);
		const send = (status, body, type = 'text/html', extra = {}) => { res.writeHead(status, { 'content-type': type, 'x-robots-tag': robots, ...extra }); res.end(req.method === 'HEAD' ? undefined : body); };
		if (overrides.has(path)) { const o = overrides.get(path); return send(o.status ?? 200, o.body, o.type, o.headers); }
		if (redirects.has(path)) { const r = redirects.get(path); res.writeHead(r.status, { location: r.to, 'x-robots-tag': robots }); return res.end(); }
		const rel = normalize(path).replace(/^\/+/, '');
		if (rel.startsWith('..') || ['_headers', '_redirects'].includes(rel)) return send(404, readFileSync(join(root, '404.html')));
		// Like Pages, an existing HTML file redirects from its `.html` URL to the extension-less URL; a missing one is a plain 404.
		if ((path.endsWith('/index.html') || path === '/index.html') && isFile(join(root, rel))) { res.writeHead(308, { location: path.slice(0, -'index.html'.length), 'x-robots-tag': robots }); return res.end(); }
		if (/\.html$/.test(path) && isFile(join(root, rel))) { res.writeHead(308, { location: path.slice(0, -5), 'x-robots-tag': robots }); return res.end(); }
		const asFile = join(root, rel);
		if (path.endsWith('/')) { const idx = join(asFile, 'index.html'); return isFile(idx) ? send(200, readFileSync(idx)) : send(404, readFileSync(join(root, '404.html'))); }
		if (isFile(asFile)) return send(200, readFileSync(asFile), TYPES[extname(asFile)] ?? 'application/octet-stream');
		if (existsSync(asFile) && statSync(asFile).isDirectory() && isFile(join(asFile, 'index.html'))) { res.writeHead(308, { location: `${path}/`, 'x-robots-tag': robots }); return res.end(); }
		if (isFile(`${asFile}.html`)) return send(200, readFileSync(`${asFile}.html`));
		return send(404, existsSync(join(root, '404.html')) ? readFileSync(join(root, '404.html')) : 'not found');
	});
	return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((r) => { server.close(r); server.closeAllConnections(); }) })));
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
	const s = await serveDir(process.argv[2]);
	console.log(s.origin);
	process.on('SIGTERM', () => s.close().then(() => process.exit(0)));
}

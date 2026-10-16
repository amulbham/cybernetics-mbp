#!/usr/bin/env node
// T22.0 — indexing-consistency validator (`npm run build` runs it after `astro build`).
//
// Reads built dist/ and checks that the page-level robots meta, robots.txt and
// the sitemap all agree with the one switch (SITE_INDEXING, src/lib/indexing.mjs):
//   closed (default): every page `noindex, nofollow`; robots.txt `Disallow: /`.
//   open:             only the pages that must stay out
//                     (404, search, tag pages, empty landing pages) are noindex;
//                     robots.txt allows crawling and names the sitemap; the
//                     sitemap lists every indexable page and nothing noindex.
// Either way `dist/_headers` must still carry the *.pages.dev X-Robots-Tag rules.
// It checks consistency, not intent — the intent (open only on production) lives in the
// workflow and is verified against the deployed hosts by the release matrix in T22.0.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { indexingOpen, populatedCategories, staysOut } from '../src/lib/indexing.mjs';

const DIST = process.argv[2] ?? 'dist';
const open = indexingOpen();
let fails = 0;
const fail = (scope, msg) => {
	fails++;
	console.error(`validate-indexing: [${scope}] ${msg}`);
};

if (!existsSync(DIST)) {
	console.error('validate-indexing: dist/ does not exist — run `astro build` first.');
	process.exit(1);
}

const pages = [];
(function walk(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (relative(DIST, path).split(sep)[0] === 'pagefind') continue;
			walk(path);
		} else if (entry.name.endsWith('.html')) pages.push(path);
	}
})(DIST);
const routeOf = (file) => '/' + relative(DIST, file).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '');
const robotsMeta = (html) => (/<meta name="robots" content="([^"]*)"/.exec(html)?.[1] ?? '').toLowerCase();
const isNoindex = (html) => /noindex/.test(robotsMeta(html));

const populated = populatedCategories(join(DIST, '..', 'src', 'content', 'research'));
const mustStayOut = (route) => staysOut(route, populated);

for (const file of pages) {
	const route = routeOf(file);
	const html = readFileSync(file, 'utf8');
	if (!open) {
		if (!/noindex/.test(robotsMeta(html)) || !/nofollow/.test(robotsMeta(html))) fail('closed', `${route} is not noindex, nofollow`);
	} else if (mustStayOut(route)) {
		if (!isNoindex(html)) fail('open', `${route} must stay noindex but is indexable`);
	} else if (isNoindex(html)) {
		fail('open', `${route} is noindex but should be indexable`);
	}
}

const robotsPath = join(DIST, 'robots.txt');
const robots = existsSync(robotsPath) ? readFileSync(robotsPath, 'utf8') : null;
if (robots === null) fail('robots', 'dist/robots.txt missing');
else if (!open && robots !== 'User-agent: *\nDisallow: /\n') fail('robots', `closed build must be exactly "User-agent: *\\nDisallow: /" — got ${JSON.stringify(robots)}`);
else if (open && (!/^Allow: \/$/m.test(robots) || /^Disallow:/m.test(robots) || !/^Sitemap: https:\/\/amulbham\.com\/sitemap-index\.xml$/m.test(robots))) {
	fail('robots', `open build must Allow: / and name the production sitemap — got ${JSON.stringify(robots)}`);
}

if (open) {
	const indexPath = join(DIST, 'sitemap-index.xml');
	const sitemapPath = join(DIST, 'sitemap-0.xml');
	if (!existsSync(indexPath) || !existsSync(sitemapPath)) fail('sitemap', 'sitemap-index.xml / sitemap-0.xml missing');
	else {
		const urls = [...readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
		const built = new Set(pages.map(routeOf));
		for (const path of urls) {
			if (mustStayOut(path)) fail('sitemap', `${path} is listed but must stay out of the sitemap`);
			if (!built.has(path)) fail('sitemap', `${path} is listed but no built page exists there`);
		}
		for (const route of built) {
			if (!mustStayOut(route) && route !== '/404' && !urls.includes(route)) fail('sitemap', `indexable page ${route} is missing from the sitemap`);
		}
		if (new Set(urls).size !== urls.length) fail('sitemap', 'duplicate URLs');
		if (!urls.includes('/') || !urls.includes('/about/') || !urls.includes('/research/')) fail('sitemap', 'home, about or research index missing');
	}
}

const headersPath = join(DIST, '_headers');
const headers = existsSync(headersPath) ? readFileSync(headersPath, 'utf8') : '';
if (!/^https:\/\/:project\.pages\.dev\/\*\s*\n\s+X-Robots-Tag: noindex/m.test(headers) || !/^https:\/\/:version\.:project\.pages\.dev\/\*\s*\n\s+X-Robots-Tag: noindex/m.test(headers)) {
	fail('headers', 'dist/_headers must send X-Robots-Tag: noindex on https://:project.pages.dev/* and https://:version.:project.pages.dev/*');
}
if (/amulbham\.com/.test(headers.replace(/^#.*$/gm, ''))) fail('headers', 'dist/_headers must not match the production custom domain');

console.log(`validate-indexing: ${pages.length} pages, mode ${open ? 'OPEN (production build)' : 'CLOSED'}, ${fails} issue(s).`);
process.exit(fails ? 1 : 0);

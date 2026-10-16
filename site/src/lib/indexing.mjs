/**
 * The one place that decides whether this build may be indexed (T22.0).
 *
 * Fail-closed: a build is indexable ONLY when the build environment sets
 * `SITE_INDEXING=open` — any other value, or none, keeps every page
 * `noindex, nofollow` and `robots.txt` at `Disallow: /`. The Actions workflow
 * (`.github/workflows/deploy-pages.yml`) sets it to `open` only for a push to
 * `main` AND only when the repository variable `SITE_INDEXING` is `open`;
 * every `staging` build, preview and manual run from another ref is closed.
 * `public/_headers` additionally sends `X-Robots-Tag: noindex` on every
 * Cloudflare-owned hostname (`*.pages.dev`), so a staging alias or preview can
 * never be indexed even if a build flag were wrong.
 *
 * Plain Node (no `astro:` imports): loaded by `astro.config.mjs`, `.astro`
 * pages, the `robots.txt` endpoint and tsx-run validators.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export function indexingOpen(env = process.env) {
	return env.SITE_INDEXING === 'open';
}

/** Category segments (from `category:` frontmatter) that have at least one research entry. */
export function populatedCategories(contentDir) {
	const populated = new Set();
	if (!existsSync(contentDir)) return populated;
	for (const dir of readdirSync(contentDir, { withFileTypes: true })) {
		if (!dir.isDirectory()) continue;
		for (const file of ['index.md', 'index.mdx']) {
			const path = join(contentDir, dir.name, file);
			if (!existsSync(path)) continue;
			const match = /^category:\s*['"]?([a-z0-9-]+)['"]?\s*$/m.exec(readFileSync(path, 'utf8'));
			if (match) populated.add(match[1]);
		}
	}
	return populated;
}

/**
 * Pages that must stay `noindex` and out of the sitemap even when the site is
 * open: internal search, the 404 page, every tag page (launch policy, T22.0 —
 * navigable, not indexed), and any `/research/{segment}/` landing page with no
 * entries (today `ai-systems`, and the route-only `memos`), which renders an
 * empty state until an entry exists. Each such page sets `noindex` itself;
 * `scripts/validate-indexing.mjs` checks the built HTML against this rule.
 */
export function staysOut(pathname, populated) {
	if (pathname === '/search/' || pathname === '/404/' || pathname === '/404') return true;
	if (pathname.startsWith('/tags/')) return true;
	const landing = /^\/research\/([a-z0-9-]+)\/$/.exec(pathname);
	return !!landing && !populated.has(landing[1]);
}

/** Sitemap membership for a built page URL: everything that does not stay out. */
export function inSitemap(pageUrl, populated) {
	return !staysOut(new URL(pageUrl).pathname, populated);
}

import { indexingOpen } from '../lib/indexing.mjs';

// robots.txt is generated so it can never disagree with the page-level robots
// meta (both read lib/indexing.mjs). Closed — the default — is byte-identical
// to the old static public/robots.txt.
export function GET(context) {
	const body = indexingOpen()
		? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', context.site)}\n`
		: 'User-agent: *\nDisallow: /\n';
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

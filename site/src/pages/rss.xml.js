import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { canonicalPath } from '../lib/research-routing';

export async function GET(context) {
	const entries = await getCollection('research');

	const items = entries
		.map((entry) => ({
			title: entry.data.title,
			description: entry.data.excerpt,
			pubDate: entry.data.pubDate,
			link: canonicalPath(entry),
			categories: entry.data.tags,
		}))
		.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items,
	});
}

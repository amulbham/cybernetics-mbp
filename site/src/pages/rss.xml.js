import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const [posts, papers] = await Promise.all([getCollection('blog'), getCollection('papers')]);

	const items = [
		...posts.map((post) => ({
			title: post.data.title,
			description: post.data.excerpt,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
			categories: post.data.tags,
		})),
		...papers.map((paper) => ({
			title: paper.data.title,
			description: paper.data.excerpt,
			pubDate: paper.data.pubDate,
			link: `/research-hub/${paper.data.pillar}/${paper.id}/`,
			categories: paper.data.tags,
		})),
	].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items,
	});
}

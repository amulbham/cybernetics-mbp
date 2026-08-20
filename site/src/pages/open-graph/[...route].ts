import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

// RGB mirrors of the dark-theme design tokens in global.css (astro-og-canvas
// needs raw [r,g,b] tuples, not CSS custom properties).
const DARK_BG: [number, number, number] = [11, 13, 18];
const TEXT_PRIMARY: [number, number, number] = [243, 244, 247];
const TEXT_SECONDARY: [number, number, number] = [154, 163, 184];
const PILLAR_RGB: Record<string, [number, number, number]> = {
	'ai-systems': [35, 55, 255],
	'seo-architecture': [14, 159, 110],
	'systems-architecture': [124, 58, 237],
	'policy-systems': [180, 83, 9],
};
// Mirrors --accent's dark-theme value in global.css — blog posts have no
// pillar to derive a border color from, so they get the plain accent instead.
const ACCENT_RGB: [number, number, number] = [91, 107, 255];

// `description` frontmatter is the full abstract — too long for the image
// canvas. Truncate to a short blurb at a word boundary.
function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

const [papers, posts] = await Promise.all([getCollection('papers'), getCollection('blog')]);
const pages = {
	...Object.fromEntries(papers.map((paper) => [`${paper.data.pillar}/${paper.id}`, paper.data])),
	// Namespaced under `blog/` (papers are namespaced under their pillar) so
	// the two id spaces can never collide.
	...Object.fromEntries(posts.map((post) => [`blog/${post.id}`, post.data])),
};

export const { getStaticPaths, GET } = await OGImageRoute({
	pages,
	getImageOptions: (_path, page) => ({
		title: page.title,
		description: truncate(page.description, 180),
		bgGradient: [DARK_BG],
		border: {
			color: 'pillar' in page ? (PILLAR_RGB[page.pillar] ?? TEXT_SECONDARY) : ACCENT_RGB,
			width: 8,
			side: 'block-start',
		},
		font: {
			title: { color: TEXT_PRIMARY, size: 64 },
			description: { color: TEXT_SECONDARY, size: 32 },
		},
		padding: 80,
	}),
});

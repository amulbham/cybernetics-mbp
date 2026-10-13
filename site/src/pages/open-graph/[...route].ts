import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { categorySegment } from '../../lib/research-routing';

// RGB mirrors of the dark-theme design tokens in global.css (astro-og-canvas
// needs raw [r,g,b] tuples, not CSS custom properties).
const DARK_BG: [number, number, number] = [11, 13, 18];
const TEXT_PRIMARY: [number, number, number] = [243, 244, 247];
const TEXT_SECONDARY: [number, number, number] = [154, 163, 184];
// One border color per category, mirroring the dark-theme `--pillar-{category}`
// tokens in global.css (T19.0 decision 16) — every entry has a category, so
// there is no accent-only fallback any more.
const CATEGORY_RGB: Record<string, [number, number, number]> = {
	cybernetics: [196, 168, 184], // #c4a8b8
	'knowledge-work': [160, 168, 180], // #a0a8b4
	'ai-systems': [143, 168, 196], // #8fa8c4
	essays: [196, 164, 138], // #c4a48a
};

// `description` frontmatter is the full abstract — too long for the image
// canvas. Truncate to a short blurb at a word boundary.
function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

const entries = await getCollection('research');
const pages = Object.fromEntries(entries.map((entry) => [`${categorySegment(entry)}/${entry.id}`, entry.data]));

export const { getStaticPaths, GET } = await OGImageRoute({
	pages,
	getImageOptions: (_path, page) => ({
		title: page.title,
		description: truncate(page.description, 180),
		bgGradient: [DARK_BG],
		border: {
			color: CATEGORY_RGB[page.category] ?? TEXT_SECONDARY,
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

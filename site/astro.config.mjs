// @ts-check

import mdx from '@astrojs/mdx';
import { unified, rehypeHeadingIds } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { remarkAlert } from 'remark-github-blockquote-alert';
import { defineConfig, fontProviders } from 'astro/config';
import { rehypeCitationLinks } from './src/lib/rehype-citation-links.mjs';
import { rehypeFigures } from './src/lib/rehype-figures.mjs';
import { rehypeKeyFindings } from './src/lib/rehype-key-findings.mjs';
import { rehypePullQuote } from './src/lib/rehype-pull-quote.mjs';
import { rehypeReferences } from './src/lib/rehype-references.mjs';
import { rehypeResearchLinks } from './src/lib/rehype-research-links.mjs';
import { rehypeResearchPrimitive } from './src/lib/rehype-research-primitive.mjs';
import { rehypeTableWrap } from './src/lib/rehype-table-wrap.mjs';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://amulbham.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		processor: unified({
			remarkPlugins: [remarkReadingTime, remarkAlert],
			rehypePlugins: [
				rehypeReferences,
				rehypeTableWrap,
				rehypeFigures,
				rehypeKeyFindings,
				rehypePullQuote,
				// Must run after rehypePullQuote (see rehype-research-primitive.mjs
				// for why that ordering is what actually prevents a collision) and
				// before rehypeCitationLinks (Evidence/Implication bodies can
				// contain (Author, Year) citations that still need linking).
				rehypeResearchPrimitive,
				// Must run after rehypeReferences — depends on id="ref-N" already
				// being assigned to build its reference lookup table.
				rehypeCitationLinks,
				// Astro's own default heading-id assignment always runs *after*
				// every plugin in this array (it's appended once, unconditionally,
				// at the very end of the real pipeline this `unified()` config
				// wrapper builds — see @astrojs/markdown-remark's own
				// createMarkdownProcessor). rehypeResearchLinks needs heading ids
				// to already exist when it runs, so rehypeHeadingIds is included
				// here explicitly, positioned right before it — Astro's automatic
				// pass still runs again afterward, harmlessly (it only assigns an
				// id when one isn't already set).
				rehypeHeadingIds,
				// Must run after rehypeCitationLinks (never contests the same text)
				// and after the rehypeHeadingIds above (needs `near` to resolve
				// against a real heading id).
				rehypeResearchLinks,
			],
		}),
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			// We control light/dark via our own [data-theme] attribute, not Shiki's
			// default media-query switch — see the dual-theme rules in global.css.
			defaultColor: false,
		},
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
		{
			provider: fontProviders.google(),
			name: 'IBM Plex Mono',
			cssVariable: '--font-mono',
			weights: [400],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['monospace'],
		},
	],
});

// @ts-check

import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { remarkAlert } from 'remark-github-blockquote-alert';
import { defineConfig, fontProviders } from 'astro/config';
import { rehypeCitationLinks } from './src/lib/rehype-citation-links.mjs';
import { rehypeFigures } from './src/lib/rehype-figures.mjs';
import { rehypeKeyFindings } from './src/lib/rehype-key-findings.mjs';
import { rehypeReferences } from './src/lib/rehype-references.mjs';
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
				// Must run after rehypeReferences — depends on id="ref-N" already
				// being assigned to build its reference lookup table.
				rehypeCitationLinks,
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

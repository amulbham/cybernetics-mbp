import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Everything published — papers, essays, memos — lives in one collection,
// distinguished by `format`, not split across separate collections. Unified
// 2026-08-20: previously `papers` (pillar-based, ScholarlyArticle JSON-LD)
// and `blog` (no pillar, BlogPosting JSON-LD) were separate collections with
// separate schemas/layouts/routes — see AGENTS.md for why that got merged.
const research = defineCollection({
	// Load Markdown and MDX files in the `src/content/research/` directory.
	loader: glob({ base: './src/content/research', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z
			.object({
				title: z.string(),
					// Optional subheading, rendered directly under the <h1> by
					// ArticleShell.astro — deliberately a frontmatter field, not a
					// `##` heading in the body: a subtitle written as a heading gets
					// picked up by the TOC transform as a real section. See AGENTS.md.
					subtitle: z.string().optional(),
				// 'paper': rigorous, protocol-driven research (requires `pillar`).
				// 'essay': long-form analytical prose, no pillar.
				// 'memo': shorter, more casual notes, no pillar.
				format: z.enum(['paper', 'essay', 'memo']),
				pillar: z.string().optional(),
				pubDate: z.coerce.date(),
				dateModified: z.coerce.date().optional(),
				// Full abstract — shown as the JSON-LD `description` (schema.org has no
				// length concern) and rendered on the page itself. NOT used for the
				// <meta name="description"> tag or any card/listing blurb — that's
				// `excerpt`, kept short on purpose. See AGENTS.md.
				description: z.string(),
				// Short (~155-160 char target for SEO) summary — the <meta
				// name="description"> tag and every card/listing blurb (research hub
				// index, category pages, tag pages, related-research, homepage, RSS).
				excerpt: z.string().max(200),
				tags: z.array(z.string()).default([]),
					// Rendered by ArticleMasthead.astro alongside the universal
					// correspondence details when present — not every entry has one.
					doi: z.url().optional(),
				// Optional 1020x510 (2:1) banner — see AGENTS.md for the full image
				// spec. Alt text is required whenever an image is provided (enforced
				// below), since a real hero isn't decorative.
				heroImage: z.optional(image()),
				heroImageAlt: z.string().optional(),
			})
			.refine((data) => data.format !== 'paper' || !!data.pillar, {
				message: 'pillar is required when format is "paper"',
				path: ['pillar'],
			})
			.refine((data) => !data.heroImage || !!data.heroImageAlt, {
				message: 'heroImageAlt is required whenever heroImage is set',
				path: ['heroImageAlt'],
			}),
});

export const collections = { research };

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const papers = defineCollection({
	// Load Markdown and MDX files in the `src/content/papers/` directory.
	loader: glob({ base: './src/content/papers', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z
			.object({
				title: z.string(),
				pillar: z.string(),
				pubDate: z.coerce.date(),
				dateModified: z.coerce.date().optional(),
				// Full abstract — shown as the JSON-LD `description` (schema.org has no
				// length concern) and rendered on the paper page itself. NOT used for
				// the <meta name="description"> tag or any card/listing blurb — that's
				// `excerpt`, kept short on purpose. See AGENTS.md.
				description: z.string(),
				// Short (~155-160 char target for SEO) summary — the <meta
				// name="description"> tag and every card/listing blurb (research hub
				// index, pillar pages, tag pages, related papers, homepage, RSS). Kept
				// separate from `description` specifically so a full-length abstract
				// never gets truncated mid-sentence in a search snippet or bloats a
				// listing card.
				excerpt: z.string().max(200),
				tags: z.array(z.string()),
				pdfUrl: z.url().optional(),
				// Optional 1020x510 (2:1) banner, same spec as the blog collection's
				// heroImage — see AGENTS.md for the full image spec. Unlike the blog
				// placeholders, a real paper hero isn't decorative, so alt text is
				// required whenever an image is provided (enforced below).
				heroImage: z.optional(image()),
				heroImageAlt: z.string().optional(),
			})
			.refine((data) => !data.heroImage || !!data.heroImageAlt, {
				message: 'heroImageAlt is required whenever heroImage is set',
				path: ['heroImageAlt'],
			}),
});

export const collections = { blog, papers };

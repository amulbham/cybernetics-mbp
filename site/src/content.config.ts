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
	schema: z.object({
		title: z.string(),
		pillar: z.string(),
		pubDate: z.coerce.date(),
		dateModified: z.coerce.date().optional(),
		description: z.string(),
		canonicalURL: z.url(),
		tags: z.array(z.string()),
		pdfUrl: z.url().optional(),
	}),
});

export const collections = { blog, papers };

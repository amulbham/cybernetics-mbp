// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Amul Bham';
export const SITE_DESCRIPTION =
	'Applied research on AI systems, SEO architecture, systems design, and policy systems.';

// Single source of truth for the site owner's social profiles — used by
// SocialLinks.astro (footer) and PaperLayout.astro (author.sameAs in
// JSON-LD). Don't duplicate these elsewhere; that's exactly how canonicalURL
// drifted out of sync in an earlier phase.
export const SOCIAL_LINKS = {
	linkedin: 'https://www.linkedin.com/in/amul-bham/',
	substack: 'https://amulbham.substack.com/',
	github: 'https://github.com/amulbham',
} as const;

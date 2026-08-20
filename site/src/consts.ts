// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Amul Bham';
export const SITE_DESCRIPTION =
	'Applied research on AI systems, SEO architecture, systems design, and policy systems.';

// Single source of truth for the site owner's identity/social profiles —
// used by SocialLinks.astro (footer icons: linkedin/substack/github only),
// ResearchLayout.astro (author.sameAs in ScholarlyArticle/Article JSON-LD), and
// index.astro (Person.sameAs in the homepage entity graph). Don't duplicate
// these elsewhere; that's exactly how canonicalURL drifted out of sync in an
// earlier phase. `orcid` is deliberately not rendered as a footer icon (no
// icon in SocialLinks.astro's local list) — it's an identity credential for
// structured data, not a social channel.
export const SOCIAL_LINKS = {
	linkedin: 'https://www.linkedin.com/in/amul-bham/',
	substack: 'https://amulbham.substack.com/',
	github: 'https://github.com/amulbham',
	orcid: 'https://orcid.org/0009-0009-7660-4031',
} as const;

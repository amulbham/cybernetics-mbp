// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Amul Bham';
export const SITE_DESCRIPTION =
	'Applied research on AI systems, SEO architecture, systems design, and policy systems.';

// Single source of truth for the site owner's identity/social profiles —
// used by SocialLinks.astro (footer chips: linkedin/substack/github/orcid),
// ResearchLayout.astro (author.sameAs in ScholarlyArticle/Article JSON-LD), and
// index.astro (Person.sameAs in the homepage entity graph). Don't duplicate
// these elsewhere; that's exactly how canonicalURL drifted out of sync in an
// earlier phase. `orcid` is both JSON-LD *and* footer chrome (added to
// SocialLinks.astro's chip row Sprint 6.2) — it's an identity credential
// for structured data first, but that doesn't mean it's hidden from readers.
export const SOCIAL_LINKS = {
	linkedin: 'https://www.linkedin.com/in/amul-bham/',
	substack: 'https://amulbham.substack.com/',
	github: 'https://github.com/amulbham',
	orcid: 'https://orcid.org/0009-0009-7660-4031',
} as const;

// Byline/correspondence details for ArticleMasthead.astro — the same on
// every research entry, so this is a constant, not per-entry frontmatter.
export const AUTHOR = {
	name: 'Amul Bham',
	affiliation: 'Independent Researcher',
	location: 'Corona, CA, USA',
	email: 'amul.bham@gmail.com',
} as const;

// Sitewide content license — shown in ArticleMasthead.astro, the footer, and
// each entry's JSON-LD `license` field. Single source of truth so these
// three can't drift out of sync with each other.
export const LICENSE = {
	label: 'CC BY-NC 4.0',
	url: 'https://creativecommons.org/licenses/by-nc/4.0/',
} as const;

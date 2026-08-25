const LABEL_OVERRIDES: Record<string, string> = {
	ai: 'AI',
	seo: 'SEO',
};

export function formatPillarLabel(pillar: string): string {
	return pillar
		.split('-')
		.map((word) => LABEL_OVERRIDES[word.toLowerCase()] ?? word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export const PILLAR_DESCRIPTIONS: Record<string, string> = {
	'ai-systems':
		'Applied research on production AI systems — agent architectures, retrieval, and the operational tradeoffs of running language models at scale.',
	'seo-architecture':
		'Technical SEO treated as systems architecture: structured data, crawlability, and the infrastructure decisions that determine how content gets found.',
	'systems-architecture':
		'Distributed systems and engineering architecture — the structural properties, like idempotency and failure modes, that hold production systems together.',
	'policy-systems':
		'Institutional and financial systems modeled as rules engines — where published policy, incentive design, and rational-actor behavior collide.',
	cybernetics:
		'Feedback, control, and self-organization — the structural conditions under which systems, biological, computational, or social, maintain order without external coordination. Includes the Cognitive Physics framework developed here.',
};

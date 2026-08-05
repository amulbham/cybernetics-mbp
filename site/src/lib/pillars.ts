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

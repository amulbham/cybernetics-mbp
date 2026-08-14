/** URL-safe slug for a tag (e.g. 'Dependency Paradox' -> 'dependency-paradox'). */
export function slugifyTag(tag: string): string {
	return tag
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

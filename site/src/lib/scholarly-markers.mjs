// Astro invokes its configured rehype plugins before rehype-raw.
export function scholarlyComment(node) {
	if (node?.type === 'comment') return node.value.trim();
	if (node?.type !== 'raw') return undefined;
	return /^<!--\s*([\s\S]*?)\s*-->$/.exec(node.value.trim())?.[1];
}

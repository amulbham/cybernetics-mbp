const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function getText(node) {
	if (node.type === 'text') return node.value;
	if (Array.isArray(node.children)) return node.children.map(getText).join('');
	return '';
}

function isWhitespaceText(node) {
	return node.type === 'text' && !node.value.trim();
}

/**
 * Rehype plugin: wraps a "References" heading and the numbered list that
 * follows it in <section class="references">, so it can be styled distinctly
 * from body prose without relying on fragile heading-text-adjacent-sibling
 * CSS (which doesn't exist). No-op when a paper has no References section —
 * only restructures, never rewrites citation content (including entries with
 * no link).
 *
 * Also gives each <li> a stable id="ref-N" (1-based document order), so a
 * citation can be linked with a plain `[Bennett, 1987](#ref-1)` in body
 * Markdown. Automatically detecting and linking existing inline citations
 * (e.g. "(Bennett, 1987)") to these anchors is a separate, harder problem —
 * deliberately not attempted here, see ROADMAP.md.
 *
 * Note: the heading and list are *not* strictly adjacent in the hast tree —
 * there's a whitespace-only text node between them (a literal "\n" from the
 * blank line separating them in the source Markdown) — so this skips
 * whitespace text nodes when looking for the list, rather than assuming
 * `children[i + 1]` is the list.
 */
export function rehypeReferences() {
	return (tree) => {
		const children = tree.children;
		let i = 0;
		while (i < children.length) {
			const node = children[i];
			const isReferencesHeading =
				node.type === 'element' &&
				HEADING_TAGS.has(node.tagName) &&
				getText(node).trim().toLowerCase() === 'references';

			if (isReferencesHeading) {
				let j = i + 1;
				while (j < children.length && isWhitespaceText(children[j])) j++;
				const next = children[j];

				if (next && next.type === 'element' && next.tagName === 'ol') {
					node.properties = {
						...node.properties,
						className: [...(node.properties?.className ?? []), 'references-heading'],
					};
					next.properties = {
						...next.properties,
						className: [...(next.properties?.className ?? []), 'references-list'],
					};
					let refNumber = 0;
					for (const item of next.children) {
						if (item.type === 'element' && item.tagName === 'li') {
							refNumber++;
							item.properties = { ...item.properties, id: `ref-${refNumber}` };
						}
					}
					const section = {
						type: 'element',
						tagName: 'section',
						properties: { className: ['references'] },
						children: [node, next],
					};
					children.splice(i, j - i + 1, section);
				}
			}
			i++;
		}
	};
}

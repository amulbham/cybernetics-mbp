function isWhitespaceText(node) {
	return node.type === 'text' && !node.value.trim();
}

/**
 * Rehype plugin: promotes a <p> whose only meaningful child is an <img> into
 * <figure><img/><figcaption>{alt}</figcaption></figure>, styled by the
 * figure/figcaption rules in global.css. Standard Markdown `![alt](src)`
 * always produces a solitary <img> inside its own <p> (confirmed against
 * Astro's actual built-in markdown image optimization output, not assumed) —
 * this is what turns that into a captioned figure.
 *
 * Skips the <figcaption> entirely when alt text is empty, so an image with no
 * caption doesn't get an empty caption box — this is what makes captions
 * "dynamic if you do or don't provide" one, with no separate on/off switch.
 *
 * Walks the whole tree (not just top-level children, like rehype-table-wrap)
 * since images can appear inside list items, not just at the document root.
 */
export function rehypeFigures() {
	return (tree) => {
		promote(tree);
	};
}

function promote(node) {
	if (!node.children) return;
	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i];
		if (child.type === 'element' && child.tagName === 'p') {
			const meaningful = child.children.filter((c) => !isWhitespaceText(c));
			if (meaningful.length === 1 && meaningful[0].type === 'element' && meaningful[0].tagName === 'img') {
				const img = meaningful[0];
				const alt = typeof img.properties?.alt === 'string' ? img.properties.alt.trim() : '';
				const figureChildren = [img];
				if (alt) {
					figureChildren.push({
						type: 'element',
						tagName: 'figcaption',
						properties: {},
						children: [{ type: 'text', value: alt }],
					});
				}
				node.children[i] = {
					type: 'element',
					tagName: 'figure',
					properties: {},
					children: figureChildren,
				};
				continue;
			}
		}
		promote(child);
	}
}

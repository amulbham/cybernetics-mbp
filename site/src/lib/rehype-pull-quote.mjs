function meaningfulChildren(node) {
	return node.children.filter((child) => !(child.type === 'text' && !child.value.trim()));
}

/**
 * Promotes a <blockquote> whose entire content is a single bolded line
 * (`> **Not a score. A dependency.**`) into a large-type, centered "pull
 * quote" — a restated key line from the piece itself, for visual rhythm in
 * long-form text. Distinct from:
 *  - GFM alerts (`> [!NOTE]` etc.) — those are consumed by remarkAlert in the
 *    **remark** phase (mdast), before this rehype plugin ever runs, so by
 *    the time this walks the hast tree they're already
 *    `<div class="markdown-alert...">` elements, not blockquotes. No
 *    collision possible.
 *  - Ordinary citation blockquotes — their paragraph content isn't a single
 *    element that is itself one whole-line `<strong>`, so the shape check
 *    below naturally excludes them.
 *
 * Walks the whole tree (not just top-level children), since a blockquote can
 * appear anywhere in the document, not just at the root.
 */
export function rehypePullQuote() {
	return (tree) => {
		promote(tree);
	};
}

function promote(node) {
	if (!node.children) return;
	for (const child of node.children) {
		if (child.type === 'element' && child.tagName === 'blockquote') {
			const quoteChildren = meaningfulChildren(child);
			if (quoteChildren.length === 1 && quoteChildren[0].tagName === 'p') {
				const paragraphChildren = meaningfulChildren(quoteChildren[0]);
				if (paragraphChildren.length === 1 && paragraphChildren[0].tagName === 'strong') {
					child.properties = {
						...child.properties,
						className: [...(child.properties?.className ?? []), 'pull-quote'],
					};
				}
			}
		}
		promote(child);
	}
}

/**
 * Rehype plugin: wraps every <table> in a scrollable <div class="table-container"
 * tabindex="0">, so wide data tables (comparison matrices, protocol tables) can
 * scroll horizontally on narrow viewports instead of breaking
 * --content-width-prose. `tabindex="0"` makes the scroll container itself
 * keyboard-focusable/scrollable, since a <table> has no native scroll affordance.
 *
 * Walks the whole tree (not just top-level children, unlike rehype-references)
 * because tables can appear inside list items or blockquotes, not just at the
 * document root.
 */
export function rehypeTableWrap() {
	return (tree) => {
		wrap(tree);
	};
}

function wrap(node) {
	if (!node.children) return;
	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i];
		if (child.type === 'element' && child.tagName === 'table') {
			node.children[i] = {
				type: 'element',
				tagName: 'div',
				properties: { className: ['table-container'], tabIndex: 0 },
				children: [child],
			};
		} else {
			wrap(child);
		}
	}
}

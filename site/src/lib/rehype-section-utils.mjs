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
 * Shared factory behind rehype-references.mjs and rehype-key-findings.mjs:
 * finds a top-level heading whose text matches `headingText`
 * (case-insensitive) followed by a list, and wraps both in
 * <section class={sectionClass}>, adding `${sectionClass}-heading` /
 * `${sectionClass}-list` classes to the heading/list for global.css to
 * style. No-op when a paper has no matching heading.
 *
 * `listTags` (default ['ol', 'ul']) restricts which list tag is accepted as
 * "the following list" — rehype-references.mjs passes just 'ol' since a
 * numbered reference list is the whole point of its ref-N anchor IDs.
 *
 * `onWrap(headingNode, listNode)`, if given, runs after the section is
 * assembled, for section-specific extras (rehype-references.mjs uses it to
 * assign ref-N ids to each <li>).
 *
 * Note: the heading and list are *not* strictly adjacent siblings in the
 * hast tree — there's a whitespace-only text node (a literal "\n") between
 * them from the blank line in the source Markdown — so this skips
 * whitespace text nodes when looking for "the next real sibling," not
 * assume `children[i + 1]` is it. (Gotcha hit once building the References
 * transform — kept here so it isn't rediscovered per section type.)
 */
export function createHeadingSectionWrapper({ headingText, sectionClass, listTags = ['ol', 'ul'], onWrap }) {
	const target = headingText.trim().toLowerCase();
	const allowedListTags = new Set(Array.isArray(listTags) ? listTags : [listTags]);

	return () => (tree) => {
		const children = tree.children;
		let i = 0;
		while (i < children.length) {
			const node = children[i];
			const isMatch =
				node.type === 'element' && HEADING_TAGS.has(node.tagName) && getText(node).trim().toLowerCase() === target;

			if (isMatch) {
				let j = i + 1;
				while (j < children.length && isWhitespaceText(children[j])) j++;
				const next = children[j];

				if (next && next.type === 'element' && allowedListTags.has(next.tagName)) {
					node.properties = {
						...node.properties,
						className: [...(node.properties?.className ?? []), `${sectionClass}-heading`],
					};
					next.properties = {
						...next.properties,
						className: [...(next.properties?.className ?? []), `${sectionClass}-list`],
					};
					onWrap?.(node, next);
					const section = {
						type: 'element',
						tagName: 'section',
						properties: { className: [sectionClass] },
						children: [node, next],
					};
					children.splice(i, j - i + 1, section);
				}
			}
			i++;
		}
	};
}

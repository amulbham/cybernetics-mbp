const LABELS = new Map([
	['definition', { kind: 'definition', label: 'Definition' }],
	['key idea', { kind: 'key-idea', label: 'Key idea' }],
	['evidence', { kind: 'evidence', label: 'Evidence' }],
	['counterpoint', { kind: 'counterpoint', label: 'Counterpoint' }],
	['implication', { kind: 'implication', label: 'Implication' }],
]);

function getText(node) {
	if (node.type === 'text') return node.value;
	if (Array.isArray(node.children)) return node.children.map(getText).join('');
	return '';
}

function meaningfulChildren(node) {
	return node.children.filter((child) => !(child.type === 'text' && !child.value.trim()));
}

/**
 * Promotes a <blockquote> whose first paragraph starts with a bolded label
 * from the five research primitives (Definition / Key idea / Evidence /
 * Counterpoint / Implication) into a Signal-styled <aside>:
 *
 *   > **Definition.** ASA Assumption — the compiler treats reported
 *   > household structure as ground truth.
 *
 * becomes
 *
 *   <aside class="research-primitive research-primitive--definition">
 *     <p class="research-primitive-label">Definition</p>
 *     <div class="research-primitive-body">ASA Assumption — ...</div>
 *   </aside>
 *
 * An optional `{#slug}` immediately after the label becomes the aside's id,
 * prefixed `primitive-` (not the bare slug) so it can't collide with a
 * heading's auto-generated id landing on the same string:
 *
 *   > **Definition.** {#asa-assumption}
 *   > ASA Assumption — the compiler treats reported household structure as
 *   > ground truth.
 *
 * → `id="primitive-asa-assumption"`. Unused by any UI this sprint — reserved
 * for future concept cross-links.
 *
 * Uses <aside> (complementary content, not a new document section) so this
 * never changes the heading outline or the table-of-contents section count.
 *
 * Registered after rehypePullQuote, which is what actually prevents a
 * collision: pull-quote's shape check requires the *entire* blockquote to be
 * a single paragraph containing *only* a `<strong>` (see
 * rehype-pull-quote.mjs) — a well-formed primitive always has body content
 * after its label, so that check already fails for it and pull-quote leaves
 * it as a real `<blockquote>` for this plugin to see. The only way the two
 * could actually collide is a malformed label-only blockquote with no body
 * at all (`> **Definition.**` and nothing else) — in that degenerate case
 * pull-quote runs first and wins, which is a reasonable default (an
 * unlabeled pull-quote is still coherent output; a labelled aside with an
 * empty body is not).
 *
 * Must run before rehypeCitationLinks — Evidence/Implication bodies
 * routinely contain `(Author, Year)` citations that still need linking.
 */
export function rehypeResearchPrimitive() {
	return (tree) => {
		transform(tree);
	};
}

function transform(node) {
	if (!node.children) return;
	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i];
		if (child.type === 'element' && child.tagName === 'blockquote') {
			const aside = tryConvert(child);
			if (aside) {
				node.children[i] = aside;
				continue; // the replacement has no blockquote left to recurse into
			}
		}
		transform(child);
	}
}

function tryConvert(blockquote) {
	const blocks = meaningfulChildren(blockquote);
	const firstPara = blocks[0];
	if (!firstPara || firstPara.tagName !== 'p') return null;

	const paraKids = firstPara.children;
	let idx = 0;
	while (idx < paraKids.length && paraKids[idx].type === 'text' && !paraKids[idx].value.trim()) idx++;
	const strongNode = paraKids[idx];
	if (!strongNode || strongNode.type !== 'element' || strongNode.tagName !== 'strong') return null;

	const rawLabel = getText(strongNode).trim();
	const key = rawLabel.replace(/\.\s*$/, '').toLowerCase();
	const match = LABELS.get(key);
	if (!match) return null;

	let id;
	let restStart = idx + 1;
	let leftoverText = null;
	const next = paraKids[restStart];
	if (next && next.type === 'text') {
		const slugMatch = next.value.match(/^\s*\{#([a-z0-9-]+)\}\s*/i);
		if (slugMatch) {
			id = `primitive-${slugMatch[1].toLowerCase()}`;
			leftoverText = next.value.slice(slugMatch[0].length);
			restStart++;
		}
	}

	const bodyFirstParaChildren = [];
	if (leftoverText) bodyFirstParaChildren.push({ type: 'text', value: leftoverText });
	bodyFirstParaChildren.push(...paraKids.slice(restStart));

	const bodyChildren = [];
	if (bodyFirstParaChildren.some((n) => !(n.type === 'text' && !n.value.trim()))) {
		bodyChildren.push({ type: 'element', tagName: 'p', properties: {}, children: bodyFirstParaChildren });
	}
	bodyChildren.push(...blocks.slice(1));

	return {
		type: 'element',
		tagName: 'aside',
		properties: {
			className: ['research-primitive', `research-primitive--${match.kind}`],
			...(id ? { id } : {}),
		},
		children: [
			{
				type: 'element',
				tagName: 'p',
				properties: { className: ['research-primitive-label'] },
				children: [{ type: 'text', value: match.label }],
			},
			{
				type: 'element',
				tagName: 'div',
				properties: { className: ['research-primitive-body'] },
				children: bodyChildren,
			},
		],
	};
}

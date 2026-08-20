import { createHeadingSectionWrapper } from './rehype-section-utils.mjs';

/**
 * Wraps a "References" heading and the numbered list that follows it in
 * <section class="references">, so it can be styled distinctly from body
 * prose without relying on fragile heading-text-adjacent-sibling CSS (which
 * doesn't exist). No-op when a paper has no References section — only
 * restructures, never rewrites citation content (including entries with no
 * link).
 *
 * Restricted to `listTags: ['ol']` (unlike rehype-key-findings.mjs, which
 * also accepts a bullet list) since the ref-N ids assigned below assume a
 * numbered reference list.
 *
 * Also gives each <li> a stable id="ref-N" (1-based document order), so a
 * citation can be linked with a plain `[Bennett, 1987](#ref-1)` in body
 * Markdown. Automatically detecting and linking existing inline citations
 * (e.g. "(Bennett, 1987)") to these anchors is a separate, harder problem —
 * deliberately not attempted here, see ROADMAP.md.
 */
export const rehypeReferences = createHeadingSectionWrapper({
	headingText: 'references',
	sectionClass: 'references',
	listTags: ['ol'],
	onWrap: (_headingNode, listNode) => {
		let refNumber = 0;
		for (const item of listNode.children) {
			if (item.type === 'element' && item.tagName === 'li') {
				refNumber++;
				item.properties = { ...item.properties, id: `ref-${refNumber}` };
			}
		}
	},
});

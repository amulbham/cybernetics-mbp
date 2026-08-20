import { createHeadingSectionWrapper } from './rehype-section-utils.mjs';

/**
 * Wraps a "Key Findings" heading and the list that follows it in
 * <section class="key-findings">, styled as a highlighted callout box
 * (global.css, reusing the .pillar-card visual language already live on
 * /about) instead of body prose. Entirely opt-in: a paper without that
 * heading renders nothing extra.
 *
 * Accepts both an ordered and unordered list (unlike rehype-references.mjs,
 * which is numbered-reference-specific) since findings are naturally a
 * bullet list, but a numbered one is fine too.
 */
export const rehypeKeyFindings = createHeadingSectionWrapper({
	headingText: 'key findings',
	sectionClass: 'key-findings',
});

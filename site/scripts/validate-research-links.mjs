#!/usr/bin/env node
// Runs before `astro build` (see package.json). Necessary, not decorative:
// Astro's own content-layer glob loader (node_modules/astro/dist/content/
// loaders/glob.js) catches a markdown render error per-entry, logs it, and
// *continues* — the overall `astro build` process still exits 0, and the
// affected page silently ships with missing/corrupted content instead of
// failing the build. Confirmed by a real test (a deliberately broken
// `near` value in research-relations.json produced a build that exited 0
// but rendered Three SOS with its Introduction section entirely missing).
// rehypeResearchLinks throwing on an unsafe accepted row is therefore not
// enough on its own — this script runs the *exact* same markdown pipeline
// (same createMarkdownProcessor, same plugin list and order as
// astro.config.mjs) directly against every research entry, outside
// Astro's glob loader, so a thrown error here is a real uncaught
// exception with a non-zero exit code — not a logged-and-swallowed one.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { createMarkdownProcessor, rehypeHeadingIds } from '@astrojs/markdown-remark';
import { remarkAlert } from 'remark-github-blockquote-alert';
import { rehypeCitationLinks } from '../src/lib/rehype-citation-links.mjs';
import { rehypeFigures } from '../src/lib/rehype-figures.mjs';
import { rehypeKeyFindings } from '../src/lib/rehype-key-findings.mjs';
import { rehypePullQuote } from '../src/lib/rehype-pull-quote.mjs';
import { rehypeReferences } from '../src/lib/rehype-references.mjs';
import { rehypeResearchLinks } from '../src/lib/rehype-research-links.mjs';
import { rehypeResearchPrimitive } from '../src/lib/rehype-research-primitive.mjs';
import { rehypeTableWrap } from '../src/lib/rehype-table-wrap.mjs';
import { remarkReadingTime } from '../src/lib/remark-reading-time.mjs';

const researchDir = new URL('../src/content/research/', import.meta.url);

const processor = await createMarkdownProcessor({
	remarkPlugins: [remarkReadingTime, remarkAlert],
	// Same list, same order as astro.config.mjs — this script exists purely
	// to make a rehypeResearchLinks failure fatal; it isn't a second,
	// independently-maintained pipeline definition, so if this ever drifts
	// from astro.config.mjs, fix astro.config.mjs to match this comment's
	// intent (single source of truth is the config file; this list is
	// duplicated here only because createMarkdownProcessor needs a real
	// array, not a re-import of Astro's internal config).
	rehypePlugins: [
		rehypeReferences,
		rehypeTableWrap,
		rehypeFigures,
		rehypeKeyFindings,
		rehypePullQuote,
		rehypeResearchPrimitive,
		rehypeCitationLinks,
		rehypeHeadingIds,
		rehypeResearchLinks,
	],
});

const entries = readdirSync(researchDir, { withFileTypes: true }).filter((d) => d.isDirectory());
let checked = 0;
for (const dir of entries) {
	const mdPath = new URL(`${dir.name}/index.md`, researchDir);
	const mdxPath = new URL(`${dir.name}/index.mdx`, researchDir);
	const filePath = existsSync(mdPath) ? mdPath : existsSync(mdxPath) ? mdxPath : null;
	if (!filePath) continue;
	const content = readFileSync(filePath, 'utf8');
	// No try/catch here — an unsafe accepted row must surface as a real
	// uncaught rejection, not a logged-and-continued warning.
	await processor.render(content, { fileURL: filePath });
	checked++;
}

console.log(`validate-research-links: ${checked} research entries checked, all accepted relation rows apply safely.`);

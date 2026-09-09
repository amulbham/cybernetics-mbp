// Sprint 11.7 — a tiny shared built-HTML extraction module, earned once a
// second real consumer needed the exact primitives validate-research-pdfs.mjs
// (Sprint 8.6) already had: decodeEntities, extractJsonLdBlocks,
// extractCitationMeta, and an Article-like locator. validate-research-semantics.mjs
// is that second consumer. Deliberately narrow — targeted regex/attribute
// extraction against Astro's own deterministic output, plus JSON.parse, the
// same posture the PDF validator already established, not a general DOM
// query engine this project has no other use for.
//
// PDF-specific extraction (the .pdf-link href, #ref-N reachability,
// data-relation link harvesting, and all real PDF parsing) stays local to
// validate-research-pdfs.mjs — nothing here becomes a second consumer of
// those, so nothing here moves them. Second real consumer -> earned;
// single consumer -> stays local.

export function decodeEntities(s) {
	return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

/** { citation_title: ['x'], citation_author: ['y'], ... } — counts, so duplicates are visible, not silently overwritten. */
export function extractCitationMeta(html) {
	const re = /<meta name="(citation_[a-z_]+)" content="([^"]*)"/g;
	const byName = new Map();
	let m;
	while ((m = re.exec(html))) {
		const [, name, content] = m;
		if (!byName.has(name)) byName.set(name, []);
		byName.get(name).push(decodeEntities(content));
	}
	return byName;
}

/**
 * Every <script type="application/ld+json"> block in document order, as
 * { index, raw, parsed, error }. `parsed` is null and `error` is the
 * JSON.parse message when a block fails to parse — a caller that needs to
 * report malformed JSON-LD with a page + block index (validate-research-semantics.mjs,
 * per Sprint 11.7 §10) has what it needs; a caller that only ever looks for
 * one specific well-formed block (validate-research-pdfs.mjs) can keep
 * filtering to `.parsed` and ignoring nulls, exactly as before.
 */
export function extractJsonLdBlocks(html) {
	const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
	const blocks = [];
	let m;
	let index = 0;
	while ((m = re.exec(html))) {
		const raw = m[1];
		try {
			blocks.push({ index, raw, parsed: JSON.parse(raw), error: null });
		} catch (err) {
			blocks.push({ index, raw, parsed: null, error: err.message });
		}
		index++;
	}
	return blocks;
}

/**
 * Article-like discovery, generalized (Sprint 11.7 §7): matches an @type
 * containing "Article" OR "ScholarlyArticle" — string or array — not just
 * "Article" as the pre-11.7 findArticleJsonLd required. Schema.org's own
 * type hierarchy already makes ScholarlyArticle a kind of Article; the old
 * exact-string dependency was an accidental locator fragility (Sprint
 * 11.0's finding), not an intentional contract.
 *
 * This is deliberately just object discovery — it returns every match, in
 * document order, and asserts nothing about cardinality or about which
 * exact type shape is *intentional* for a given page. A caller that needs
 * "exactly one" (validate-research-semantics.mjs) or the fuller pre-11.7
 * behavior of "the first match, if any" (validate-research-pdfs.mjs, via
 * `matches[0]`) decides that itself. Finding the object is never the same
 * check as validating its type contract.
 *
 * `blocks` is a plain array of already-parsed JSON-LD values (nulls
 * skipped) — pass `extractJsonLdBlocks(html).filter(b => b.parsed).map(b => b.parsed)`.
 */
export function findArticleLikeJsonLd(blocks) {
	return blocks.filter((b) => {
		const t = b?.['@type'];
		if (t === 'Article' || t === 'ScholarlyArticle') return true;
		return Array.isArray(t) && (t.includes('Article') || t.includes('ScholarlyArticle'));
	});
}

/** Every <link rel="canonical" href="..."> in document order — a caller checks cardinality (one is the intentional contract) and compares values itself. */
export function extractCanonicalHrefs(html) {
	const re = /<link rel="canonical" href="([^"]*)"/g;
	const hrefs = [];
	let m;
	while ((m = re.exec(html))) hrefs.push(decodeEntities(m[1]));
	return hrefs;
}

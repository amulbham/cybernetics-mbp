const SKIP_TAGS = new Set(['a', 'code', 'pre']);

function getText(node) {
	if (node.type === 'text') return node.value;
	if (Array.isArray(node.children)) return node.children.map(getText).join('');
	return '';
}

function normalizeName(s) {
	return s
		.replace(/[’‘]/g, "'")
		.replace(/\.$/, '')
		.trim()
		.toLowerCase()
		.replace(/\s+/g, ' ');
}

function cleanCitationName(name) {
	return name.replace(/\bet al\.?$/i, '').trim();
}

/**
 * Parses a reference-list entry's text into a { nameKeys, year } signature
 * used to match inline citations against it (plural: one entry can be cited
 * multiple valid ways). Handles two entry shapes:
 *  - "Surname, F. M. (Year)..." / "Org Name. (Year)..." → primary nameKey is
 *    the first surname (before the first comma) for multi-author/initialed
 *    entries, or the whole name for single-name orgs. Surnames may contain
 *    an internal space ("Conway Morris", "Maynard Smith").
 *  - "Case Name v. Other Name, Reporter cite (Court Year)." → nameKey is the
 *    full "X v. Y" case name; year is read from inside that first
 *    parenthetical specifically (not the first 19xx/20xx digit anywhere in
 *    the entry, which could match a page/report number or an unrelated year
 *    mentioned in the title).
 *
 * A two-author entry ("Surname1, X. & Surname2, Y. (Year)") also registers
 * "Surname1 & Surname2" and "Surname1 and Surname2" as additional nameKeys —
 * standard academic style cites a two-author work with "&" in parentheses
 * but "and" in running prose (e.g. "(Maturana & Varela, 1974)" vs.
 * "Maturana and Varela (1974) established..."), and both need to resolve to
 * the same reference. Three-or-more-author entries stay first-surname-only,
 * matched against inline "et al." citations by the narrative regex below.
 */
function extractReferenceKey(refText) {
	const caseMatch = refText.match(/^([A-Z][\w.'’-]*(?:\s+v\.\s+[A-Z][\w.'’-]*))/);
	let nameKeys;
	let searchAfterIndex;
	if (caseMatch) {
		nameKeys = [normalizeName(caseMatch[1])];
		searchAfterIndex = caseMatch[0].length;
	} else {
		const parenIdx = refText.indexOf(' (');
		if (parenIdx === -1) return null;
		const namePart = refText.slice(0, parenIdx);
		const firstCommaIdx = namePart.indexOf(',');
		// \p{L} (any Unicode letter), not [a-zA-Z] — surnames like "Poincaré"
		// or "Szathmáry" have accented letters a plain ASCII class would
		// silently reject, breaking the match rather than erroring.
		if (firstCommaIdx !== -1 && /^\p{Lu}[\p{L}'’\- ]*,/u.test(namePart)) {
			const firstSurname = namePart.slice(0, firstCommaIdx);
			nameKeys = [normalizeName(firstSurname)];
			const twoAuthorMatch = namePart.match(/^\p{Lu}[\p{L}'’\- ]*,\s*[^&]*&\s*(\p{Lu}[\p{L}'’\- ]+),/u);
			if (twoAuthorMatch) {
				const secondSurname = twoAuthorMatch[1];
				nameKeys.push(normalizeName(`${firstSurname} & ${secondSurname}`));
				nameKeys.push(normalizeName(`${firstSurname} and ${secondSurname}`));
			}
		} else {
			nameKeys = [normalizeName(namePart)];
		}
		searchAfterIndex = parenIdx;
	}
	const firstParenOpen = refText.indexOf('(', searchAfterIndex);
	if (firstParenOpen === -1) return null;
	const firstParenClose = refText.indexOf(')', firstParenOpen);
	const parenContent = refText.slice(firstParenOpen + 1, firstParenClose === -1 ? undefined : firstParenClose);
	let year;
	if (/n\.d\./.test(parenContent)) {
		year = 'n.d.';
	} else {
		// (1[6-9]|20), not (19|20) — academic citations regularly predate
		// 1900 (this project's own content already cites 1850, 1865, 1890),
		// so excluding whole centuries by construction is a real bug, not a
		// reasonable bound. 1600 is generous rather than exact.
		const yearMatch = parenContent.match(/(1[6-9]|20)\d{2}/);
		year = yearMatch ? yearMatch[0] : null;
	}
	if (!year) return null;
	return { nameKeys, year };
}

/** Parses "Name, Year" / "Name et al., Year" / "Name, n.d." (one side of a
 * semicolon-split parenthetical citation group) into { name, year }. */
function parseNameYear(s) {
	const ndMatch = s.match(/^(.*?),\s*n\.d\.$/);
	if (ndMatch) return { name: cleanCitationName(ndMatch[1]), year: 'n.d.' };
	const yearMatch = s.match(/^(.*?),\s*((?:1[6-9]|20)\d{2}[a-z]?)$/);
	if (yearMatch) return { name: cleanCitationName(yearMatch[1]), year: yearMatch[2] };
	return null;
}

function escapeRegex(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildReferenceLookup(tree) {
	const lookup = new Map();
	const ambiguous = new Set();

	function visit(node) {
		if (node.type === 'element' && node.tagName === 'li' && /^ref-\d+$/.test(node.properties?.id ?? '')) {
			const refNumber = Number(node.properties.id.slice(4));
			const key = extractReferenceKey(getText(node));
			if (key) {
				for (const nameKey of key.nameKeys) {
					const mapKey = `${nameKey}|${key.year}`;
					if (lookup.has(mapKey)) {
						ambiguous.add(mapKey);
					} else {
						lookup.set(mapKey, refNumber);
					}
				}
			}
			return; // no need to recurse into a reference <li>'s own children
		}
		if (Array.isArray(node.children)) node.children.forEach(visit);
	}
	visit(tree);
	for (const key of ambiguous) lookup.delete(key);
	return lookup;
}

/**
 * Finds every confidently-matched citation substring in `text` and returns
 * their character ranges + target ref numbers, sorted and non-overlapping.
 * Two citation shapes, matched independently against the same source text
 * and then merged — see rehype-citation-links.mjs's design notes in
 * AGENTS.md for why each needs a different matching strategy:
 *
 *  - Shape A, parenthetical: "(Name, Year)", including semicolon-separated
 *    multi-source groups "(Name1, Y1; Name2, Y2)" — each sub-citation is
 *    linked individually, with the "(", "; ", and ")" left as plain text.
 *  - Shape B, narrative: "Name (Year)" — matched against the *known*
 *    reference names directly (not a generic capitalized-phrase pattern);
 *    a generic pattern's leftmost-match preference would capture whatever
 *    capitalized text starts the enclosing sentence, since (unlike Shape A)
 *    there's no literal "(" to bound where the name starts.
 *
 * Fails closed throughout: anything that doesn't resolve to exactly one
 * reference is left as plain text, never linked on a guess.
 */
function findCitationMatches(text, lookup) {
	const matches = [];
	// Astro's markdown pipeline smartypants-converts straight quotes to curly
	// ones (' → ’) before this plugin ever sees the text, so search against a
	// straight-quote copy — same length as `text`, so match indices stay
	// valid — while still slicing the final linked substrings from the
	// original `text` below, preserving the curly quotes actually rendered.
	const searchText = text.replace(/[’‘]/g, "'");

	const groupRe = /\(([^()]{1,300}?)\)/g;
	let m;
	while ((m = groupRe.exec(searchText))) {
		const inner = m[1];
		const innerStart = m.index + 1;
		let cursor = 0;
		for (const rawPart of inner.split(';')) {
			const partStart = innerStart + cursor;
			cursor += rawPart.length + 1;
			const trimmed = rawPart.trim();
			const leadingWs = rawPart.length - rawPart.trimStart().length;
			const start = partStart + leadingWs;
			const end = start + trimmed.length;
			const parsed = parseNameYear(trimmed);
			if (!parsed) continue;
			const refNumber = lookup.get(`${normalizeName(parsed.name)}|${parsed.year}`);
			if (refNumber) matches.push({ start, end, refNumber });
		}
	}

	const knownNames = [...new Set([...lookup.keys()].map((k) => k.split('|')[0]))].sort((a, b) => b.length - a.length);
	if (knownNames.length > 0) {
		const narrativeRe = new RegExp(
			`(${knownNames.map(escapeRegex).join('|')})(?:\\s+et al\\.?)?\\s*\\(((?:1[6-9]|20)\\d{2}[a-z]?|n\\.d\\.)\\)`,
			'gi'
		);
		while ((m = narrativeRe.exec(searchText))) {
			const start = m.index;
			const end = m.index + m[0].length;
			if (matches.some((x) => start < x.end && end > x.start)) continue; // already claimed by Shape A
			const refNumber = lookup.get(`${normalizeName(m[1])}|${m[2]}`);
			if (refNumber) matches.push({ start, end, refNumber });
		}
	}

	matches.sort((a, b) => a.start - b.start);
	const clean = [];
	let lastEnd = -1;
	for (const match of matches) {
		if (match.start >= lastEnd) {
			clean.push(match);
			lastEnd = match.end;
		}
	}
	return clean;
}

function splitTextNode(node, lookup) {
	const matches = findCitationMatches(node.value, lookup);
	if (matches.length === 0) return [node];

	const text = node.value;
	const out = [];
	let cursor = 0;
	for (const match of matches) {
		if (match.start > cursor) out.push({ type: 'text', value: text.slice(cursor, match.start) });
		out.push({
			type: 'element',
			tagName: 'a',
			properties: { href: `#ref-${match.refNumber}` },
			children: [{ type: 'text', value: text.slice(match.start, match.end) }],
		});
		cursor = match.end;
	}
	if (cursor < text.length) out.push({ type: 'text', value: text.slice(cursor) });
	return out;
}

function linkCitations(node, lookup) {
	if (!Array.isArray(node.children)) return;
	const next = [];
	for (const child of node.children) {
		if (child.type === 'element' && child.tagName === 'section' && child.properties?.className?.includes('references')) {
			next.push(child); // never link citations inside the References section itself
			continue;
		}
		if (child.type === 'text') {
			next.push(...splitTextNode(child, lookup));
			continue;
		}
		if (child.type === 'element' && !SKIP_TAGS.has(child.tagName)) {
			linkCitations(child, lookup);
		}
		next.push(child);
	}
	node.children = next;
}

export function rehypeCitationLinks() {
	return (tree) => {
		const lookup = buildReferenceLookup(tree);
		if (lookup.size === 0) return; // no References section — nothing to link against
		linkCitations(tree, lookup);
	};
}

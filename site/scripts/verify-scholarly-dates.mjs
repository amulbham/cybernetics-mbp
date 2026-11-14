// T29.3a (R5) — date-agreement check for a forward scholarly review page.
//
// final-form (the publication-form dry run): the visible date, <time datetime>, the
// Highwire citation_publication_date, the JSON-LD datePublished/dateModified and the
// Open Graph article:published_time must all describe the one fixture date
// (--date YYYY-MM-DD, UTC). The visible text is compared with an independent
// formatting of that UTC day, so a process-timezone shift ("Dec 31, 1999" beside
// 2000-01-01) fails.
// candidate: the page must carry NO publication date of any kind.
//
// The fixture date is a rehearsal value, never a publication decision. Reads the built
// HTML only; no network.
//
// Usage: node scripts/verify-scholarly-dates.mjs <index.html> --mode candidate|final-form [--date YYYY-MM-DD]
// Exit: 0 pass; 1 a check failed; 2 bad usage.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/** "2000-01-01" -> { iso: "2000-01-01T00:00:00.000Z", visible: "Jan 1, 2000", highwire: "2000/01/01" } */
export function expectedForms(date) {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date ?? '');
	if (!m || new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10) !== date) throw new Error(`Invalid fixture date: ${date}`);
	return { iso: `${date}T00:00:00.000Z`, visible: `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`, highwire: `${m[1]}/${m[2]}/${m[3]}` };
}

function metas(html, attr, name) {
	const out = [];
	for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
		const key = new RegExp(`\\b${attr}="${name}"`, 'i').test(tag);
		const content = /\bcontent="([^"]*)"/i.exec(tag);
		if (key && content) out.push(decode(content[1]));
	}
	return out;
}

function jsonLd(html) {
	return [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => JSON.parse(m[1]));
}

const articleLike = (items) => items.flatMap((i) => (Array.isArray(i['@graph']) ? i['@graph'] : [i])).find((i) => JSON.stringify(i['@type'] ?? '').includes('Article'));

/** Returns a list of failure strings (empty = pass). */
export function checkDates(html, { mode, date }) {
	const failures = [];
	const times = [...html.matchAll(/<time\b[^>]*\bdatetime="([^"]*)"[^>]*>([\s\S]*?)<\/time>/gi)].map((m) => ({ datetime: m[1], text: decode(m[2].replace(/<[^>]+>/g, '')).trim() }));
	const highwire = metas(html, 'name', 'citation_publication_date');
	const published = metas(html, 'property', 'article:published_time');
	const ld = jsonLd(html);
	if (mode === 'candidate') {
		if (times.length) failures.push(`candidate must omit every date, found <time> elements: ${JSON.stringify(times)}`);
		if (highwire.length) failures.push(`candidate must omit citation_publication_date, found ${JSON.stringify(highwire)}`);
		if (published.length) failures.push(`candidate must omit article:published_time, found ${JSON.stringify(published)}`);
		if (ld.length) failures.push('candidate must omit JSON-LD (it carries datePublished)');
		return failures;
	}
	if (mode !== 'final-form') throw new Error(`Unknown mode: ${mode}`);
	const want = expectedForms(date);
	if (times.length < 1) failures.push('final-form has no <time> element for the publication date');
	const first = times[0];
	if (first && first.datetime !== want.iso) failures.push(`<time datetime> is "${first.datetime}", expected "${want.iso}"`);
	if (first && first.text !== want.visible) failures.push(`visible date is "${first.text}", expected "${want.visible}" (UTC day of ${date})`);
	if (highwire.length !== 1 || highwire[0] !== want.highwire) failures.push(`citation_publication_date is ${JSON.stringify(highwire)}, expected ["${want.highwire}"]`);
	if (published.length && (published.length !== 1 || published[0] !== want.iso)) failures.push(`article:published_time is ${JSON.stringify(published)}, expected ["${want.iso}"]`);
	const article = articleLike(ld);
	if (!article) failures.push('final-form has no Article-like JSON-LD');
	else {
		if (article.datePublished !== want.iso) failures.push(`JSON-LD datePublished is "${article.datePublished}", expected "${want.iso}"`);
		if (article.dateModified !== want.iso) failures.push(`JSON-LD dateModified is "${article.dateModified}", expected "${want.iso}" (the fixture has no revision date)`);
	}
	return failures;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
	const args = process.argv.slice(2);
	const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
	const file = args.find((a, i) => !a.startsWith('--') && (i === 0 || !args[i - 1].startsWith('--')));
	const mode = option('--mode');
	if (!file || !['candidate', 'final-form'].includes(mode) || (mode === 'final-form' && !option('--date'))) {
		console.error('usage: node scripts/verify-scholarly-dates.mjs <index.html> --mode candidate|final-form [--date YYYY-MM-DD]');
		process.exit(2);
	}
	const failures = checkDates(readFileSync(file, 'utf8'), { mode, date: option('--date') });
	if (failures.length) {
		console.log(`verify-scholarly-dates: ${file} (${mode}) FAILED`);
		for (const f of failures) console.log(`  FAIL ${f}`);
		process.exit(1);
	}
	console.log(`verify-scholarly-dates: ${file} (${mode}) PASS${mode === 'final-form' ? ` — visible, <time datetime>, Highwire, JSON-LD and OG all describe ${option('--date')}` : ' — no publication date present'}`);
}

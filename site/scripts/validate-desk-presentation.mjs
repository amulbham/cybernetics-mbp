#!/usr/bin/env node
// T20.1 — focused Desk presentation validator. Opt-in (not wired into `npm run build`):
//
//   npm run build && npx tsx scripts/validate-desk-presentation.mjs [--source <index.md>] [--html <index.html>] [--dist <dir>]
//
// Checks the Desk's authored source and its built HTML for the T20.1 contract:
// five exact-text reading primitives (moved, never duplicated), bibliography
// inventory (80 entries / 62 linked / 64 hrefs / 18 approved unlinked,
// `doi.org/10…` labels), 92 canonical inline citations (counted by
// representation: generated mobile records are excluded), exactly three
// `responsive-records` opt-ins whose generated records mirror the canonical
// table, no duplicate ids, Pagefind ignore, and that no other page was opted in.
// T23.0.1 extends the allow-list to exactly two further pages — the Chisel article
// (2 opted + 2 plain tables) and its IWL (13 opted + 2 plain) — with pinned counts and
// the same record/label/cell, id, wrapper and Pagefind checks; every other research
// page must still carry zero opt-ins and only original wrappers.
// It never imports a production serializer — expectations are pinned here.
// Exit 1 on any failed check. Does not change shared validators.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import { parse } from 'parse5';

const DESK = 'the-desk-is-where-you-write-it-down';
const args = process.argv.slice(2);
const opt = (name, fallback) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : fallback;
};
const SOURCE = opt('--source', `src/content/research/${DESK}/index.md`);
const DIST = opt('--dist', 'dist');
const HTML = opt('--html', `${DIST}/research/knowledge-work/${DESK}/index.html`);

let fails = 0;
const ok = (cond, label, detail = '') => {
	if (!cond) fails++;
	console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`);
};

// ---- pinned expectations (T20.1 sealed rev 2) --------------------------------
const EVIDENCE =
	'Chen and colleagues then analyzed resting-state imaging and divergent-thinking performance across ten independent samples from Austria, Canada, China, Japan, and the United States (N = 2,433). More frequent DMN–ECN switching predicted divergent-thinking ability in their analysis, while the relationship with network balance followed an inverted-U pattern (Chen et al., 2025).';
const DEFINITION =
	'*Discovery* names the formation or recognition of a new possibility. *Capture* names the work that tests, records, refines, and communicates it so that someone can use it.';
const COUNTERPOINT =
	'The cited workplace research measures outcomes such as attendance, satisfaction, and retention, not whether incubation produced an insight. Improved matching between tasks and working conditions is therefore an institutional hypothesis, not an experimentally established creativity gain.';
const KEY_IDEA =
	'The practical question nevertheless changes: **which conditions does the work require, and who can recognize when those conditions should change?**';
const PULL = '**The desk is where you write it down. It should not be the only place that counts as work.**';

// ---- source ------------------------------------------------------------------
const src = readFileSync(SOURCE, 'utf8').replace(/\r\n/g, '\n');
const count = (hay, needle) => hay.split(needle).length - 1;
console.log('== Source');
ok(count(src, EVIDENCE) === 1, 'Evidence passage appears exactly once');
ok(count(src, `> **Evidence.** ${EVIDENCE}\n`) === 1, 'Evidence is a `> **Evidence.**` block');
ok(count(src, DEFINITION) === 1 && count(src, `> **Definition.** {#discovery-capture} ${DEFINITION}\n`) === 1, 'Definition appears once, as a block anchored {#discovery-capture}');
ok(count(src, COUNTERPOINT) === 1 && count(src, `> **Counterpoint.** ${COUNTERPOINT}\n`) === 1, 'Counterpoint appears once, both sentences together');
ok(count(src, KEY_IDEA) === 1 && count(src, `\n\n> **Key idea.** ${KEY_IDEA}\n`) === 1, 'Key idea appears once, as a block');
ok(src.indexOf(`> **Counterpoint.** ${COUNTERPOINT}\n\n> **Key idea.**`) > 0, 'Counterpoint immediately precedes Key idea (authored order)');
ok(count(src, PULL) === 1 && count(src, `\n> ${PULL}\n`) === 1, 'Pull quote appears once, as a blockquote');
ok(count(src, 'These are functions, not addresses.') === 1 && count(src, 'The answer cannot be given entirely') === 1, 'continuation sentences kept once');
// Every individual promoted sentence must occur exactly once in the whole source (moved, never duplicated).
const sentences = [EVIDENCE, DEFINITION, COUNTERPOINT, KEY_IDEA, PULL].flatMap((p) => p.split(/(?<=\.)\s+(?=[A-Z*])/));
const repeated = sentences.filter((s) => count(src, s) !== 1);
ok(sentences.length === 9 && repeated.length === 0, 'each promoted sentence occurs exactly once in the source', `${sentences.length} sentences, ${repeated.length} not once`);

const refA = src.indexOf('\n## References');
const refB = src.indexOf('\n## Appendix A');
const refLines = src.slice(refA, refB).split('\n').filter((l) => /^\d+\. /.test(l));
ok(refLines.length === 80 && refLines.every((l, i) => l.startsWith(`${i + 1}. `)), 'References: 80 entries, consecutive numbering');
const hrefs = [...src.slice(refA, refB).matchAll(/\]\((https?:[^)]+)\)/g)].map((m) => m[1]);
ok(refLines.filter((l) => /\]\(https?:/.test(l)).length === 62, 'References: 62 linked entries');
ok(hrefs.length === 64, 'References: 64 external href occurrences', String(hrefs.length));
ok(refLines.filter((l) => !/\]\(https?:/.test(l)).length === 18, 'References: 18 approved unlinked entries');
const labels = [...src.slice(refA, refB).matchAll(/\[([^\]]+)\]\((https?:[^)]+)\)/g)];
ok(!labels.some((m) => m[1] === 'DOI' || m[1] === 'Source'), 'no generic [DOI]/[Source] labels remain');
ok(labels.filter((m) => m[2].startsWith('https://doi.org/')).every((m) => m[1] === m[2].replace('https://', '')), 'every DOI label is the bare doi.org/10… path of its own href');
const refBlock = src.slice(src.indexOf('\n1. ', refA) + 1, refB).trimEnd();
ok(!/\n\n/.test(refBlock), 'no blank line inside the References list');

const markers = [...src.matchAll(/<!-- table-layout: responsive-records -->/g)].length;
ok(markers === 3, 'exactly three responsive-records markers in source', String(markers));
ok((src.match(/<!-- table-layout: responsive-records -->\n\n\|/g) || []).length === 3, 'each marker is followed by one blank line then a table');
ok((src.match(/^\|/gm) || []).length > 0 && src.split('\n').filter((l, i, a) => l.startsWith('|') && !(a[i - 1] || '').startsWith('|')).length === 3, 'Desk has exactly three GFM tables');

// ---- built HTML --------------------------------------------------------------
console.log('== Built HTML');
const html = readFileSync(HTML, 'utf8');
const doc = parse(html);
const attr = (n, name) => (n.attrs || []).find((a) => a.name === name)?.value;
const cls = (n) => (attr(n, 'class') || '').split(/\s+/).filter(Boolean);
const text = (n) => (n.nodeName === '#text' ? n.value : (n.childNodes || []).map(text).join(''));
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const all = [];
(function walk(n, ancestors) {
	if (n.nodeName && !n.nodeName.startsWith('#')) all.push({ n, ancestors });
	for (const c of n.childNodes || []) walk(c, n.nodeName && !n.nodeName.startsWith('#') ? [...ancestors, n] : ancestors);
})(doc, []);
const q = (pred) => all.filter(({ n, ancestors }) => pred(n, ancestors));
const inside = (ancestors, pred) => ancestors.some(pred);
const hasClass = (c) => (n) => cls(n).includes(c);

const primKinds = ['evidence', 'definition', 'counterpoint', 'key-idea'];
for (const kind of primKinds) {
	ok(q((n) => n.nodeName === 'aside' && cls(n).includes(`research-primitive--${kind}`)).length === 1, `one ${kind} primitive rendered`);
}
ok(q((n) => n.nodeName === 'aside' && cls(n).includes('research-primitive')).length === 4, 'exactly four research primitives on the page');
ok(q((n) => attr(n, 'id') === 'primitive-discovery-capture' && n.nodeName === 'aside').length === 1, 'definition anchor id="primitive-discovery-capture"');
ok(q((n) => n.nodeName === 'blockquote' && cls(n).includes('pull-quote')).length + q((n) => cls(n).includes('pull-quote')).length >= 1, 'pull quote rendered');
const evidenceText = norm(text(q((n) => n.nodeName === 'aside' && cls(n).includes('research-primitive--evidence'))[0].n));
ok(evidenceText.includes('Chen and colleagues then analyzed') && evidenceText.includes('(Chen et al., 2025)'), 'Evidence block carries its citation text');
ok(q((n, anc) => n.nodeName === 'a' && attr(n, 'href')?.startsWith('#ref-') && inside(anc, (a) => cls(a).includes('research-primitive--evidence'))).length === 1, 'citation inside Evidence stays linked');
const ids = q((n) => attr(n, 'id') !== undefined).map(({ n }) => attr(n, 'id'));
const dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);
ok(dupIds.length === 0, 'no duplicate id attributes in the document', dupIds.slice(0, 3).join(','));
ok(q((n) => n.nodeName === 'h2').length >= 15, 'h2 headings preserved', String(q((n) => n.nodeName === 'h2').length));

const refItems = q((n) => n.nodeName === 'li' && /^ref-\d+$/.test(attr(n, 'id') || ''));
ok(refItems.length === 80 && refItems.every(({ n }, i) => attr(n, 'id') === `ref-${i + 1}`), 'HTML: 80 ordered ref-N anchors');
const refHrefs = refItems.flatMap(({ n }) => q((m, anc) => m.nodeName === 'a' && /^https?:/.test(attr(m, 'href') || '') && anc.includes(n)).map(({ n: m }) => m));
ok(refHrefs.length === 64, 'HTML: 64 external bibliography href occurrences', String(refHrefs.length));
ok(refHrefs.every((a) => norm(text(a)) !== 'DOI' && norm(text(a)) !== 'Source'), 'HTML: no generic link labels');
const inRecords = (anc) => inside(anc, hasClass('table-records'));
const inRefs = (anc) => anc.some((a) => /^ref-\d+$/.test(attr(a, 'id') || ''));
const canonical = q((n, anc) => n.nodeName === 'a' && (attr(n, 'href') || '').startsWith('#ref-') && !inRecords(anc) && !inRefs(anc));
ok(canonical.length === 92, 'HTML: 92 canonical inline #ref-N links (generated records excluded)', String(canonical.length));
ok(canonical.every(({ n }) => ids.includes(attr(n, 'href').slice(1))), 'HTML: every canonical citation target exists');
ok(new Set(canonical.map(({ n }) => attr(n, 'href'))).size === 58, 'HTML: canonical citations cover 58 references');

console.log('== Responsive tables');
const containers = q((n) => cls(n).includes('table-container'));
const opted = containers.filter(({ n }) => attr(n, 'data-table-layout') === 'responsive-records');
ok(containers.length === 3 && opted.length === 3, 'three table containers, all responsive-records', `${containers.length}/${opted.length}`);
const dims = [];
const tableBodies = [];
opted.forEach(({ n }, k) => {
	const tables = (n.childNodes || []).filter((c) => c.nodeName === 'table');
	const lists = (n.childNodes || []).filter((c) => c.nodeName === 'ul' && cls(c).includes('table-records'));
	ok(tables.length === 1 && lists.length === 1, `table ${k + 1}: one canonical table and one generated record list`);
	if (tables.length !== 1 || lists.length !== 1) return;
	ok(attr(n, 'tabindex') === undefined, `table ${k + 1}: wrapper is not a sideways-scroll tab stop`);
	ok(attr(lists[0], 'data-pagefind-ignore') !== undefined, `table ${k + 1}: generated records are data-pagefind-ignore`);
	const flat = [];
	(function walk(x) { for (const c of x.childNodes || []) { if (c.nodeName === 'tr') flat.push(c); else walk(c); } })(tables[0]);
	const heads = flat[0].childNodes.filter((c) => c.nodeName === 'th').map((c) => norm(text(c)));
	const body = flat.slice(1).map((r) => r.childNodes.filter((c) => c.nodeName === 'td').map((c) => norm(text(c))));
	dims.push(`${body.length}x${heads.length}`);
	tableBodies.push(body);
	const recs = lists[0].childNodes.filter((c) => c.nodeName === 'li');
	ok(recs.length === body.length, `table ${k + 1}: one record per body row`, `${recs.length}/${body.length}`);
	let mismatch = 0;
	recs.forEach((rec, r) => {
		const dl = rec.childNodes.find((c) => c.nodeName === 'dl');
		const dts = dl.childNodes.filter((c) => c.nodeName === 'dt').map((c) => norm(text(c)));
		const dds = dl.childNodes.filter((c) => c.nodeName === 'dd').map((c) => norm(text(c)));
		if (JSON.stringify(dts) !== JSON.stringify(heads) || JSON.stringify(dds) !== JSON.stringify(body[r])) mismatch++;
	});
	ok(mismatch === 0, `table ${k + 1}: record labels equal the unique column headers and values equal the table cells`, `${mismatch} mismatched`);
	ok(new Set(heads.map((h) => h.toLowerCase())).size === heads.length, `table ${k + 1}: column headers unique`);
});
ok(JSON.stringify(dims) === JSON.stringify(['17x4', '4x5', '4x5']), 'canonical table dimensions (body rows x columns)', dims.join(' '));
ok(q((n, anc) => n.nodeName === 'table' && inRecords(anc)).length === 0 && q((n, anc) => attr(n, 'id') !== undefined && inRecords(anc)).length === 0, 'generated records contain no nested table and no id');

// CSS: generated records hidden by default (so never in print), revealed only under a screen media query.
const cssFiles = existsSync(join(DIST, '_astro')) ? readdirSync(join(DIST, '_astro')).filter((f) => f.endsWith('.css')) : [];
const css = cssFiles.map((f) => readFileSync(join(DIST, '_astro', f), 'utf8')).join('\n');
ok(/\.table-records\{[^}]*display:\s*none/.test(css), 'CSS: .table-records hidden by default (print-safe)');
ok(/@media screen and \((?:max-width:\s*|width<=)\d+px\)\{[^@]*\.table-container\[data-table-layout=responsive-records\] \.table-records\{display:block/.test(css.replace(/\n/g, '')), 'CSS: record layout revealed only under a screen media query');
// At the breakpoint exactly one projection may be visible: the same media block that reveals the records must hide the table.
const blocks = [...css.replace(/\n/g, '').matchAll(/@media screen and \((?:max-width:\s*|width<=)\d+px\)\{((?:[^{}]*\{[^{}]*\})*)\}/g)].map((m) => m[1]);
const revealing = blocks.filter((b) => /responsive-records\] \.table-records\{display:block/.test(b));
ok(revealing.length === 1 && /responsive-records\] table\{display:none/.test(revealing[0]), 'CSS: the block that reveals the records also hides the table (never both)');

// ---- T23.0.1: the two further allowed opt-in pages (pinned) ---------------------
console.log('== Chisel opt-ins (T23.0.1)');
const CHISEL = 'the-chisel-fallacy-what-pangram-actually-measures';
const CHISEL_PAGES = [
	{ label: 'Chisel article', rel: `research/knowledge-work/${CHISEL}/index.html`, opted: 2, plain: 2, frag: (u) => u.includes(CHISEL) && !u.includes('/iwl') && !u.includes('.pdf') },
	{ label: 'Chisel IWL', rel: `research/knowledge-work/${CHISEL}/iwl/index.html`, opted: 13, plain: 2, frag: (u) => u.includes(CHISEL) && u.includes('/iwl') },
];
const allowedRel = new Set(CHISEL_PAGES.map((p) => p.rel));
const chiselBodies = {};
for (const page of CHISEL_PAGES) {
	const file = join(DIST, page.rel);
	if (!existsSync(file)) { ok(false, `${page.label}: built page exists`, file); continue; }
	const d = parse(readFileSync(file, 'utf8'));
	const els = [];
	(function walk(n, anc) {
		if (n.nodeName && !n.nodeName.startsWith('#')) els.push({ n, anc });
		for (const c of n.childNodes || []) walk(c, n.nodeName && !n.nodeName.startsWith('#') ? [...anc, n] : anc);
	})(d, []);
	const qq = (pred) => els.filter(({ n, anc }) => pred(n, anc));
	const conts = qq((n) => cls(n).includes('table-container')).map(({ n }) => n);
	const opt = conts.filter((n) => attr(n, 'data-table-layout') === 'responsive-records');
	const plain = conts.filter((n) => attr(n, 'data-table-layout') === undefined);
	ok(conts.length === page.opted + page.plain && opt.length === page.opted && plain.length === page.plain, `${page.label}: ${page.opted} responsive-records + ${page.plain} original-wrapper containers`, `${opt.length}/${plain.length}/${conts.length}`);
	ok(qq((n) => attr(n, 'data-table-layout') !== undefined).length === page.opted, `${page.label}: no stray data-table-layout attribute`);
	ok(plain.every((n) => attr(n, 'tabindex') === '0' && (n.childNodes || []).filter((c) => c.nodeName === 'table').length === 1), `${page.label}: unmarked tables keep the original scroll wrapper`);
	const pids = qq((n) => attr(n, 'id') !== undefined).map(({ n }) => attr(n, 'id'));
	ok(pids.filter((v, i) => pids.indexOf(v) !== i).length === 0, `${page.label}: no duplicate id attributes`);
	let shapeBad = 0, labelBad = 0, cellsT = 0, cellsR = 0, tabStops = 0, noIgnore = 0, recIds = 0, nested = 0, dupHeads = 0;
	const bodies = [];
	for (const n of opt) {
		const tables = (n.childNodes || []).filter((c) => c.nodeName === 'table');
		const lists = (n.childNodes || []).filter((c) => c.nodeName === 'ul' && cls(c).includes('table-records'));
		if (tables.length !== 1 || lists.length !== 1) { shapeBad++; continue; }
		if (attr(n, 'tabindex') !== undefined) tabStops++;
		if (attr(lists[0], 'data-pagefind-ignore') === undefined) noIgnore++;
		const flat = [];
		(function walk(x) { for (const c of x.childNodes || []) { if (c.nodeName === 'tr') flat.push(c); else walk(c); } })(tables[0]);
		const heads = flat[0].childNodes.filter((c) => c.nodeName === 'th').map((c) => norm(text(c)));
		const body = flat.slice(1).map((r) => r.childNodes.filter((c) => c.nodeName === 'td').map((c) => norm(text(c))));
		bodies.push(body);
		if (new Set(heads.map((h) => h.toLowerCase())).size !== heads.length || heads.some((h) => !h)) dupHeads++;
		const recs = lists[0].childNodes.filter((c) => c.nodeName === 'li');
		if (recs.length !== body.length) labelBad++;
		recs.forEach((rec, r) => {
			const dl = rec.childNodes.find((c) => c.nodeName === 'dl');
			const dts = dl.childNodes.filter((c) => c.nodeName === 'dt').map((c) => norm(text(c)));
			const dds = dl.childNodes.filter((c) => c.nodeName === 'dd').map((c) => norm(text(c)));
			cellsT += (body[r] || []).length; cellsR += dds.length;
			if (JSON.stringify(dts) !== JSON.stringify(heads) || JSON.stringify(dds) !== JSON.stringify(body[r])) labelBad++;
		});
		const within = (x) => { let c = 0; (function w(y) { for (const k of y.childNodes || []) { if (k.nodeName && !k.nodeName.startsWith('#')) { if (attr(k, 'id') !== undefined) recIds++; if (k.nodeName === 'table') nested++; } w(k); } })(x); return c; };
		within(lists[0]);
	}
	ok(shapeBad === 0, `${page.label}: each opted container holds one canonical table and one generated record list`, `${shapeBad} bad`);
	ok(tabStops === 0, `${page.label}: opted wrappers are not sideways-scroll tab stops`);
	ok(noIgnore === 0, `${page.label}: generated records are data-pagefind-ignore`);
	ok(labelBad === 0 && cellsT === cellsR && cellsT > 0, `${page.label}: every record label equals its column header and every value its cell`, `${cellsR}/${cellsT} cells, ${labelBad} mismatched`);
	ok(dupHeads === 0, `${page.label}: column headers unique and non-empty`);
	ok(recIds === 0 && nested === 0, `${page.label}: generated records contain no id and no nested table`);
	chiselBodies[page.rel] = bodies;
	// Pagefind: the authored table is indexed once; generated records are not.
	const fragDir = join(DIST, 'pagefind', 'fragment');
	if (existsSync(fragDir)) {
		let found = null;
		for (const fn of readdirSync(fragDir)) {
			try {
				const raw = gunzipSync(readFileSync(join(fragDir, fn))).toString('utf8');
				const json = JSON.parse(raw.slice(raw.indexOf('{')));
				if (page.frag(json.url || '')) { found = json; break; }
			} catch { /* not a fragment we can read */ }
		}
		if (found) {
			const c = norm(found.content || '');
			const longest = bodies.flatMap((b) => b.map((row) => row.reduce((a, x) => (x.length > a.length ? x : a), '')));
			const notOnce = longest.filter((cell) => cell.length > 0 && count(c, cell) !== 1);
			ok(longest.length > 0 && notOnce.length === 0, `${page.label}: Pagefind indexes the longest cell of every opted row exactly once`, `${longest.length} rows, ${notOnce.length} not once`);
		} else ok(false, `${page.label}: Pagefind fragment found`);
	} else console.log(`SKIP  ${page.label}: Pagefind fragment directory not present`);
}

console.log('== Site-wide');
const research = join(DIST, 'research');
let otherOpt = 0, otherTables = 0, otherPlain = 0;
(function walk(d) {
	for (const e of readdirSync(d, { withFileTypes: true })) {
		const p = join(d, e.name);
		if (e.isDirectory()) walk(p);
		else if (e.name === 'index.html' && !p.replace(/\\/g, '/').includes(`/${DESK}/`) && ![...allowedRel].some((r) => p.replace(/\\/g, '/').endsWith(`/${r}`))) {
			const h = readFileSync(p, 'utf8');
			otherOpt += (h.match(/data-table-layout/g) || []).length;
			otherTables += (h.match(/<table/g) || []).length;
			otherPlain += (h.match(/<div class="table-container" tabindex="0">/g) || []).length;
		}
	}
})(research);
ok(otherOpt === 0, 'no other research page carries a responsive-records container (Desk and the two Chisel pages are checked above with pinned counts)', String(otherOpt));
ok(otherPlain === otherTables, 'every other table keeps the original wrapper', `${otherPlain}/${otherTables}`);

// Pagefind: the authored table is indexed once; generated records are not.
const frag = join(DIST, 'pagefind', 'fragment');
if (existsSync(frag)) {
	let found = null;
	for (const f of readdirSync(frag)) {
		const buf = readFileSync(join(frag, f));
		try {
			const raw = gunzipSync(buf).toString('utf8');
			const json = JSON.parse(raw.slice(raw.indexOf('{')));
			if ((json.url || '').includes(DESK) && !(json.url || '').includes('.pdf')) { found = json; break; }
		} catch { /* not a fragment we can read */ }
	}
	if (found) {
		const c = found.content || '';
		const longest = tableBodies.flatMap((b) => b.map((row) => row.reduce((a, c) => (c.length > a.length ? c : a), '')));
		const notOnce = longest.filter((cell) => count(norm(c), cell) !== 1);
		ok(longest.length === 25 && notOnce.length === 0, 'Pagefind: the longest cell of every table row is indexed exactly once (generated records ignored)', `${longest.length} rows, ${notOnce.length} not once`);
	} else ok(false, 'Pagefind: Desk fragment found');
} else console.log('SKIP  Pagefind fragment directory not present');

console.log(fails ? `\n${fails} FAILED` : '\nALL PASS');
process.exit(fails ? 1 : 0);

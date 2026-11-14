// T29.3a (R1) — running-head acceptance check for forward scholarly PDFs.
//
// Page 1 is the title block and carries no running head. Every later page carries
// the author's surname at the left, the article title at the right and the page
// number at the bottom. The surname is the identity string Scholar-style
// extractors read, so it must come out as ONE word, `Bham`, in every extractor we
// rely on:
//   - Poppler `pdftotext -layout` (cropped to the region),
//   - MuPDF (through PyMuPDF, scripts/mupdf-page-words.py),
//   - the lockfile-pinned pdfjs-dist that validate-research-pdfs.mjs uses.
// The legacy small-caps header with letter-spacing is extracted as `B ham`
// (Poppler) and `B | H | A | M` (pdfjs), so this check fails on it by design.
//
// Observed tokens are kept exactly as each extractor returned them: nothing here
// joins, lower-cases or otherwise repairs a split word, because a repair would
// hide the very defect being tested. Whitespace is the only separator.
//
// Usage: node scripts/verify-scholarly-header.mjs <pdf> [--json <file>] [--python <python3>]
// Exit: 0 every check passed; 1 a check failed; 2 a required tool is unavailable.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

// Regions in PDF points measured from the top-left of a US Letter page. The
// running head sits in the 1in top margin (about y 36-44); the page number sits in the
// bottom margin (about y 749-760) below the last body line (which can end near y 720).
export const REGIONS = {
	left: { x: 0, y: 24, w: 200, h: 28 },
	right: { x: 200, y: 24, w: 412, h: 28 },
	number: { x: 240, y: 740, w: 132, h: 40 },
};
export const SURNAME = 'Bham';
export const EXTRACTORS = ['poppler', 'mupdf', 'pdfjs'];

const inside = (r, x, y) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
// A box must lie wholly inside the region (MuPDF can return one tall box that spans the
// header band and the first body line; that is body text, not running-head text).
const within = (r, [x0, y0, x1, y1]) => x0 >= r.x && x1 <= r.x + r.w && y0 >= r.y && y1 <= r.y + r.h;
const words = (text) => text.split(/\s+/).filter(Boolean);

/**
 * Pure per-page evaluation. `observed[extractor]` = { left, right, number }, each an
 * array of raw tokens. Returns a list of failure strings (empty = pass).
 */
export function evaluatePage({ page, title }, observed) {
	const failures = [];
	for (const extractor of EXTRACTORS) {
		const got = observed[extractor];
		if (!got) {
			failures.push(`${extractor}: no observation for page ${page}`);
			continue;
		}
		if (page === 1) {
			if (got.left.length || got.right.length) {
				failures.push(`${extractor}: page 1 must have no running head, saw left ${JSON.stringify(got.left)} right ${JSON.stringify(got.right)}`);
			}
		} else {
			if (got.left.length !== 1 || got.left[0] !== SURNAME) {
				failures.push(`${extractor}: left running head must be exactly ["${SURNAME}"], saw ${JSON.stringify(got.left)}`);
			}
			if (got.right.join(' ') !== title) {
				failures.push(`${extractor}: right running head must read "${title}", saw ${JSON.stringify(got.right.join(' '))}`);
			}
		}
		if (got.number.join(' ') !== String(page)) {
			failures.push(`${extractor}: page number must read "${page}", saw ${JSON.stringify(got.number)}`);
		}
	}
	return failures;
}

function pdftotextRegion(pdf, page, region) {
	const run = spawnSync('pdftotext', ['-layout', '-f', String(page), '-l', String(page), '-r', '72',
		'-x', String(region.x), '-y', String(region.y), '-W', String(region.w), '-H', String(region.h), pdf, '-'], { encoding: 'utf8' });
	if (run.error || run.status !== 0) throw Object.assign(new Error(`pdftotext failed: ${run.error?.message ?? run.stderr}`), { unavailable: true });
	return words(run.stdout);
}

function popplerVersion() {
	const run = spawnSync('pdftotext', ['-v'], { encoding: 'utf8' });
	return `${run.stderr}${run.stdout}`.split('\n')[0].trim();
}

function mupdfPages(pdf, python) {
	const run = spawnSync(python, [join(HERE, 'mupdf-page-words.py'), pdf], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
	if (run.error || run.status !== 0) {
		throw Object.assign(new Error(`MuPDF extractor unavailable (${python}): ${(run.error?.message ?? run.stderr).trim()}`), { unavailable: true });
	}
	return JSON.parse(run.stdout);
}

async function pdfjsPages(pdf) {
	const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
	const doc = await getDocument({ data: new Uint8Array(readFileSync(pdf)), isEvalSupported: false, verbosity: 0 }).promise;
	try {
		const meta = await doc.getMetadata();
		const pages = [];
		for (let number = 1; number <= doc.numPages; number++) {
			const page = await doc.getPage(number);
			const height = page.view[3];
			const { items } = await page.getTextContent();
			pages.push({ page: number, items: items.filter((i) => i.str.trim()).map((i) => ({ x: i.transform[4], y: height - i.transform[5], str: i.str })) });
		}
		return { title: meta.info?.Title ?? '', pages };
	} finally {
		doc.cleanup();
	}
}

/** Run all three extractors over every page. Returns { pages, title, toolchain, failures }. */
export async function checkPdf(pdf, { python = process.env.SCHOLARLY_PYTHON || 'python3', title } = {}) {
	const mupdf = mupdfPages(pdf, python);
	const pdfjs = await pdfjsPages(pdf);
	const expectedTitle = title ?? pdfjs.title;
	if (!expectedTitle) throw new Error('The PDF has no Title metadata and no --title was given');
	const pages = [];
	const failures = [];
	for (let number = 1; number <= mupdf.pages.length; number++) {
		const m = mupdf.pages[number - 1];
		const j = pdfjs.pages[number - 1];
		const observed = { poppler: {}, mupdf: {}, pdfjs: {} };
		for (const [name, region] of Object.entries(REGIONS)) {
			observed.poppler[name] = pdftotextRegion(pdf, number, region);
			observed.mupdf[name] = m.words
				.filter((w) => within(region, w))
				.sort((a, b) => a[1] - b[1] || a[0] - b[0]).map((w) => w[4]);
			observed.pdfjs[name] = j.items.filter((i) => inside(region, i.x, i.y)).sort((a, b) => a.y - b.y || a.x - b.x).map((i) => i.str.trim());
		}
		const pageFailures = evaluatePage({ page: number, title: expectedTitle }, observed);
		failures.push(...pageFailures.map((f) => `page ${number}: ${f}`));
		pages.push({ page: number, observed, failures: pageFailures });
	}
	const pdfjsVersion = JSON.parse(readFileSync(new URL('../node_modules/pdfjs-dist/package.json', import.meta.url), 'utf8')).version;
	return {
		pdf, title: expectedTitle, pageCount: pages.length,
		toolchain: { node: process.version, poppler: popplerVersion(), mupdf: mupdf.mupdf, pymupdf: mupdf.pymupdf, 'pdfjs-dist': pdfjsVersion },
		pages, failures,
	};
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
	const args = process.argv.slice(2);
	const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
	const pdf = args.find((a, i) => !a.startsWith('--') && (i === 0 || !args[i - 1].startsWith('--')));
	if (!pdf) {
		console.error('usage: node scripts/verify-scholarly-header.mjs <pdf> [--json <file>] [--python <python3>] [--title <text>]');
		process.exit(2);
	}
	let result;
	try {
		result = await checkPdf(pdf, { python: option('--python') ?? process.env.SCHOLARLY_PYTHON ?? 'python3', title: option('--title') });
	} catch (err) {
		console.error(`verify-scholarly-header: ${err.message}`);
		process.exit(err.unavailable ? 2 : 1);
	}
	if (option('--json')) writeFileSync(option('--json'), JSON.stringify(result, null, 1) + '\n');
	const t = result.toolchain;
	console.log(`verify-scholarly-header: ${result.pdf}\n  ${result.pageCount} pages; poppler ${t.poppler}; MuPDF ${t.mupdf}; pdfjs-dist ${t['pdfjs-dist']}`);
	const perExtractor = Object.fromEntries(EXTRACTORS.map((e) => [e, result.failures.filter((f) => f.includes(`${e}: `)).length]));
	console.log(`  failures by extractor: ${JSON.stringify(perExtractor)}`);
	for (const failure of result.failures.slice(0, 12)) console.log(`  FAIL ${failure}`);
	if (result.failures.length > 12) console.log(`  ... ${result.failures.length - 12} more`);
	if (result.failures.length) {
		console.log(`verify-scholarly-header: FAILED (${result.failures.length})`);
		process.exit(1);
	}
	console.log(`verify-scholarly-header: PASS — every running-head page reads ["${SURNAME}"] in all three extractors; page 1 header-free`);
}

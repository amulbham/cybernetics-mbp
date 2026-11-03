#!/usr/bin/env node
// T27.2 — regression test for the PDF image fix in build-research-pdfs.mjs.
//
//   tsx scripts/test-pdf-images.mjs                                  # unit cases + typeset fixture, negative and positive
//   tsx scripts/test-pdf-images.mjs --check-pdf <file.pdf> [minWidthPx]
//                                                                    # exit 1 unless the PDF embeds a real image >= minWidthPx wide
//
// Background: Astro emits `srcset=""` on every Markdown image, and the headless Chromium Vivliostyle typesets
// with treats such an <img> as having no usable source, so the PDF shows a broken-image icon with the alt text
// instead of the picture (bisected on the real Paper B page; `loading="lazy"` is not the cause). The builder now
// removes an EMPTY srcset in its transient copy only. This test proves both halves against a real typeset:
//   negative  the same fixture typeset WITHOUT the transform has no embedded picture (the failure reproduces,
//             so the check really detects a broken-image/alt-only PDF);
//   positive  typeset WITH the transform embeds the full-size picture.
// It needs the pinned Vivliostyle CLI (node_modules) and a headless Chrome the CLI can start, as build:pdfs does.
// Run from site/. Not part of CI.

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import sirv from 'sirv';
import { getDocument, OPS } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { removeEmptySrcset, removeEmptySrcsetInTree } from './build-research-pdfs.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const VIVLIOSTYLE_CLI = join(ROOT, 'node_modules', '@vivliostyle', 'cli', 'dist', 'cli.js');
const PORT = 5329; // loopback only; build-research-pdfs.mjs uses 5327
const FIXTURE_WIDTH = 800;
const FIXTURE_HEIGHT = 600;

/** Sizes of every image painted in the PDF (width x height in source pixels), via pdfjs — not a byte grep. */
export async function embeddedImages(pdfPath) {
	const doc = await getDocument({ data: new Uint8Array(readFileSync(pdfPath)), isEvalSupported: false, verbosity: 0 }).promise;
	const found = [];
	for (let n = 1; n <= doc.numPages; n++) {
		const page = await doc.getPage(n);
		const { fnArray, argsArray } = await page.getOperatorList();
		for (let i = 0; i < fnArray.length; i++) {
			if (fnArray[i] === OPS.paintImageXObject) {
				const id = argsArray[i][0];
				const img = await new Promise((resolve) => page.objs.get(id, resolve));
				if (img?.width) found.push({ page: n, width: img.width, height: img.height });
			} else if (fnArray[i] === OPS.paintInlineImageXObject && argsArray[i][0]?.width) {
				found.push({ page: n, width: argsArray[i][0].width, height: argsArray[i][0].height });
			}
		}
	}
	return found;
}

function crc32(buf) {
	let c;
	let crc = 0xffffffff;
	for (let n = 0; n < buf.length; n++) {
		c = (crc ^ buf[n]) & 0xff;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		crc = (crc >>> 8) ^ c;
	}
	return (crc ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
	const body = Buffer.concat([Buffer.from(type), data]);
	const out = Buffer.alloc(12 + data.length);
	out.writeUInt32BE(data.length, 0);
	body.copy(out, 4);
	out.writeUInt32BE(crc32(body), 8 + data.length);
	return out;
}
/** A valid 8-bit RGB PNG with a visible gradient, built in-process (no image tooling needed). */
function makePng(w, h) {
	const raw = Buffer.alloc((w * 3 + 1) * h);
	for (let y = 0; y < h; y++) {
		const row = y * (w * 3 + 1);
		for (let x = 0; x < w; x++) {
			raw[row + 1 + x * 3] = (x * 255) / w;
			raw[row + 2 + x * 3] = (y * 255) / h;
			raw[row + 3 + x * 3] = 128;
		}
	}
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(w, 0);
	ihdr.writeUInt32BE(h, 4);
	ihdr[8] = 8; // bit depth
	ihdr[9] = 2; // RGB
	return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), pngChunk('IHDR', ihdr), pngChunk('IDAT', deflateSync(raw)), pngChunk('IEND', Buffer.alloc(0))]);
}

/** A page whose <img> has exactly the attributes Astro emits for a Markdown image, including the empty srcset. */
function fixtureHtml() {
	return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>image fixture</title></head><body>
<h1>Image fixture</h1>
<p>The picture below must be typeset into the PDF.</p>
<p><img loading="lazy" decoding="async" width="${FIXTURE_WIDTH}" height="${FIXTURE_HEIGHT}" src="fixture.png" srcset="" alt="fixture figure" style="max-width:100%;height:auto"></p>
</body></html>`;
}

function typeset(url, out) {
	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [VIVLIOSTYLE_CLI, 'build', url, '-o', out, '--timeout', '120'], { stdio: 'ignore' });
		child.on('error', reject);
		child.on('close', (code) => (code === 0 && existsSync(out) ? resolve() : reject(new Error(`vivliostyle exited ${code}`))));
	});
}

let passed = 0;
let failed = 0;
function check(name, condition, detail = '') {
	if (condition) {
		passed++;
		console.log(`PASS  ${name}`);
	} else {
		failed++;
		console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
	}
}

async function main() {
	const args = process.argv.slice(2);
	if (args[0] === '--check-pdf') {
		const [, pdf, min = '2000'] = args;
		const images = await embeddedImages(pdf);
		const big = images.filter((i) => i.width >= Number(min));
		console.log(`${pdf}: ${images.length} embedded image(s); ${big.length} at least ${min}px wide ${JSON.stringify(big)}`);
		process.exit(big.length ? 0 : 1);
	}

	// --- unit cases: only an EMPTY srcset on an <img> is removed ---------------------------------------------------
	const emitted = '<img alt="a b" loading="lazy" decoding="async" width="2" height="3" src="/x.webp" srcset="">';
	const expected = '<img alt="a b" loading="lazy" decoding="async" width="2" height="3" src="/x.webp">';
	check('an empty srcset is removed from an <img>', removeEmptySrcset(emitted) === expected);
	for (const attr of ['alt="a b"', 'loading="lazy"', 'decoding="async"', 'width="2"', 'height="3"', 'src="/x.webp"']) {
		check(`${attr} is untouched`, removeEmptySrcset(emitted).includes(attr));
	}
	check('an empty srcset in the middle of the tag is removed', removeEmptySrcset('<img src="/y" srcset="" alt="z">') === '<img src="/y" alt="z">');
	check('a single-quoted empty srcset is removed', removeEmptySrcset("<img src='/y' srcset='' alt='z'>") === "<img src='/y' alt='z'>");
	check('a REAL srcset is never removed', removeEmptySrcset('<img src="/y" srcset="/a.webp 1x, /b.webp 2x" alt="z">') === '<img src="/y" srcset="/a.webp 1x, /b.webp 2x" alt="z">');
	check('every <img> in a document is changed', (removeEmptySrcset(`${emitted}<p>t</p>${emitted}`).match(/srcset/g) ?? []).length === 0);
	check('an <img> without srcset is left alone', removeEmptySrcset('<img src="/y" alt="z">') === '<img src="/y" alt="z">');
	check('idempotent', removeEmptySrcset(removeEmptySrcset(emitted)) === expected);
	check('srcset="" on other elements is not touched', removeEmptySrcset('<source srcset="" type="image/webp">') === '<source srcset="" type="image/webp">');
	check('text that merely contains the words is not touched', removeEmptySrcset('<p>srcset="" in prose</p>') === '<p>srcset="" in prose</p>');

	const work = mkdtempSync(join(tmpdir(), 'pdf-images-test-'));
	let server;
	try {
		// --- tree helper: html files only, copy-only semantics are the caller's job ----------------------------
		const tree = join(work, 'tree');
		mkdirSync(join(tree, 'a'), { recursive: true });
		writeFileSync(join(tree, 'a', 'index.html'), emitted);
		writeFileSync(join(tree, 'a', 'note.txt'), emitted);
		const r = removeEmptySrcsetInTree(tree);
		check('tree helper rewrites .html and reports it', r.htmlFileCount === 1 && r.changedCount === 1 && !readFileSync(join(tree, 'a', 'index.html'), 'utf8').includes('srcset'));
		check('tree helper leaves non-HTML files alone', readFileSync(join(tree, 'a', 'note.txt'), 'utf8') === emitted);

		// --- typeset fixture: negative (as emitted) and positive (transformed) ------------------------------------
		const emittedDir = join(work, 'emitted');
		const fixedDir = join(work, 'fixed');
		for (const dir of [emittedDir, fixedDir]) {
			mkdirSync(dir, { recursive: true });
			writeFileSync(join(dir, 'fixture.png'), makePng(FIXTURE_WIDTH, FIXTURE_HEIGHT));
		}
		writeFileSync(join(emittedDir, 'index.html'), fixtureHtml());
		writeFileSync(join(fixedDir, 'index.html'), removeEmptySrcset(fixtureHtml()));
		check('the fixture really carries the empty srcset before the transform', fixtureHtml().includes('srcset=""') && !removeEmptySrcset(fixtureHtml()).includes('srcset'));

		const handlers = { '/emitted': sirv(emittedDir), '/fixed': sirv(fixedDir) };
		server = createServer((req, res) => {
			const prefix = req.url.startsWith('/fixed') ? '/fixed' : '/emitted';
			req.url = req.url.slice(prefix.length) || '/';
			handlers[prefix](req, res);
		});
		await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

		await typeset(`http://127.0.0.1:${PORT}/emitted/`, join(work, 'emitted.pdf'));
		const emittedImgs = await embeddedImages(join(work, 'emitted.pdf'));
		check('NEGATIVE: the fixture as Astro emits it typesets with no embedded picture (failure reproduces)', !emittedImgs.some((i) => i.width >= FIXTURE_WIDTH), `found ${JSON.stringify(emittedImgs)}`);

		await typeset(`http://127.0.0.1:${PORT}/fixed/`, join(work, 'fixed.pdf'));
		const fixedImgs = await embeddedImages(join(work, 'fixed.pdf'));
		check(`POSITIVE: the transformed fixture embeds the ${FIXTURE_WIDTH}x${FIXTURE_HEIGHT} picture`, fixedImgs.some((i) => i.width === FIXTURE_WIDTH && i.height === FIXTURE_HEIGHT), `found ${JSON.stringify(fixedImgs)}`);
	} finally {
		if (server) await new Promise((resolve) => server.close(resolve));
		rmSync(work, { recursive: true, force: true });
	}

	console.log(`\n${passed} passed, ${failed} failed`);
	process.exit(failed ? 1 : 0);
}

main().catch((err) => {
	console.error(err.stack || err.message || err);
	process.exit(1);
});

#!/usr/bin/env node
// Sprint 8.2 — the deterministic paper PDF builder.
//
// Run after `astro build` (see package.json's "build:pdfs"). For every
// `format: paper` entry, typesets the already-built HTML with
// print-research.css (Sprint 8.1) and writes paper.pdf next to that
// entry's index.html in the real dist/. Does not reimplement the print
// stylesheet or the anchor-canonicalization step — both are imported/used
// as-is.
//
// Algorithm (do not reorder without a reason — the whole-tree copy and
// absolutize pass happen exactly once, not once per paper):
//   real dist/
//     copy ONCE -> transient dist
//     absolutizePdfLinks ONCE on that tree
//     one loopback static server at the transient root
//     for each paper: vivliostyle build <served URL> --style print-research.css
//                      -> real dist/research/{pillar}/{slug}/paper.pdf
//     always: stop server, delete transient tree (try/finally)
//
// Any paper failure aborts the entire run (non-zero exit) — this script
// never lets a partial PDF corpus reach the "papers discovered === PDFs
// generated" check silently.
//
// Run with tsx (imports research-routing.ts, which has its own relative
// TS imports that don't resolve under Node's bare native loader).

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import sirv from 'sirv';
import { absolutizePdfLinks } from './absolutize-pdf-links.mjs';
import { discoverPapers } from './discover-research.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url)); // site/
const REAL_DIST = join(ROOT, 'dist');
const PRINT_STYLESHEET = join(ROOT, 'src', 'styles', 'print-research.css');
// Invoke the pinned CLI's own JS entry point directly with `node`.
const VIVLIOSTYLE_CLI = join(ROOT, 'node_modules', '@vivliostyle', 'cli', 'dist', 'cli.js');
const SERVER_PORT = 5327; // arbitrary, loopback-only, not the dev/preview ports
// A generous ceiling, not a tuned value — FAFSA (12 tables, 50 citations,
// 11 primitives, by far the largest paper) needs real wall-clock time to
// paginate. 900s was chosen defensively while debugging a real deadlock
// (see the child-process invocation below); once that was fixed, FAFSA
// typeset in well under this. Left high on purpose: cheap insurance against
// a future, larger paper, not a value to shrink casually.
const VIVLIOSTYLE_TIMEOUT_SECONDS = 900;

function startStaticServer(root, port) {
	// Uses sirv (the same static-file-serving package Astro's own `astro
	// preview` is built on — already a transitive dependency, pinned here
	// as a direct one) rather than a hand-rolled http.Server. A first,
	// hand-rolled version of this function genuinely could not typeset
	// FAFSA (by far the largest paper — 12 tables, 50 citations) within
	// Vivliostyle's 900s timeout, twice reproducibly, while the identical
	// document typeset correctly within minutes when served by `astro
	// preview` instead — confirmed by isolating the server as the one
	// variable and swapping in the same library `astro preview` itself
	// uses. `astro preview` can't be pointed at an arbitrary directory
	// (it only ever serves the project's own dist/), which is why this
	// still needs its own server rather than shelling out to it directly.
	const handler = sirv(root, { etag: true, maxAge: 31536000, immutable: true });
	const server = createServer(handler);
	return new Promise((resolve) => {
		server.listen(port, '127.0.0.1', () => resolve(server));
	});
}

function stopServer(server) {
	return new Promise((resolve) => server.close(() => resolve()));
}

/**
 * Runs the pinned Vivliostyle CLI asynchronously — never `execSync`/
 * `execFileSync`. Those block the whole Node event loop for as long as the
 * child process runs, which includes this same process's own static
 * server (Sprint 8.1's absolutized copy is served in-process, see
 * startStaticServer above) — a real, reproducible deadlock found and fixed
 * while building this: FAFSA (by far the largest paper) genuinely could
 * not typeset this way, timing out at whatever --timeout was configured no
 * matter how high, because the server could never answer its own requests
 * while frozen waiting for the child process it was blocking on. Smaller
 * papers sometimes got lucky (enough loaded before the freeze); FAFSA never
 * did. `spawn`, awaited via its `close` event, keeps the event loop free.
 */
function runVivliostyle(url, outputPdf, styleSheet, timeoutSeconds) {
	return new Promise((resolve, reject) => {
		const child = spawn(
			process.execPath,
			[VIVLIOSTYLE_CLI, 'build', url, '-o', outputPdf, '--style', styleSheet, '--timeout', String(timeoutSeconds)],
			{ stdio: 'inherit' },
		);
		child.on('error', reject);
		child.on('close', (code) => {
			if (code === 0) resolve();
			else reject(new Error(`vivliostyle exited with code ${code}`));
		});
	});
}

async function main() {
	if (!existsSync(REAL_DIST)) {
		console.error('build-research-pdfs: dist/ does not exist — run `astro build` first.');
		process.exit(1);
	}

	const papers = discoverPapers();
	console.log(`build-research-pdfs: ${papers.length} paper(s) discovered: ${papers.map((p) => p.id).join(', ') || '(none)'}`);

	const transientDist = mkdtempSync(join(tmpdir(), 'pdf-source-'));
	let server;
	let generated = 0;
	try {
		const { htmlFileCount, rewrittenCount } = absolutizePdfLinks(REAL_DIST, transientDist);
		console.log(`build-research-pdfs: whole-tree copy done (${htmlFileCount} HTML files, ${rewrittenCount} with rewritten anchors)`);

		server = await startStaticServer(transientDist, SERVER_PORT);
		console.log(`build-research-pdfs: serving transient copy at http://127.0.0.1:${SERVER_PORT}`);

		for (const paper of papers) {
			const sourceHtml = join(transientDist, paper.route, 'index.html');
			if (!existsSync(sourceHtml)) {
				throw new Error(
					`build-research-pdfs: no built index.html for paper "${paper.id}" at expected route "${paper.route}" — did astro build run first, and does this id resolve correctly via canonicalPath()?`,
				);
			}
			const outputPdf = join(REAL_DIST, paper.route, 'paper.pdf');
			const servedUrl = `http://127.0.0.1:${SERVER_PORT}${paper.route}`;
			console.log(`build-research-pdfs: typesetting "${paper.id}" -> ${outputPdf}`);
			try {
				await runVivliostyle(servedUrl, outputPdf, PRINT_STYLESHEET, VIVLIOSTYLE_TIMEOUT_SECONDS);
			} catch (err) {
				throw new Error(`build-research-pdfs: Vivliostyle failed on paper "${paper.id}": ${err.message}`);
			}
			if (!existsSync(outputPdf)) {
				throw new Error(`build-research-pdfs: Vivliostyle reported success but ${outputPdf} does not exist for "${paper.id}"`);
			}
			generated++;
		}
	} finally {
		if (server) await stopServer(server);
		rmSync(transientDist, { recursive: true, force: true });
	}

	console.log(`papers discovered: ${papers.length}`);
	console.log(`PDFs generated:    ${generated}`);
	if (generated !== papers.length) {
		console.error('build-research-pdfs: mismatch between papers discovered and PDFs generated — aborting, not deploying a partial corpus.');
		process.exit(1);
	}
}

main().catch((err) => {
	console.error(err.message || err);
	process.exit(1);
});

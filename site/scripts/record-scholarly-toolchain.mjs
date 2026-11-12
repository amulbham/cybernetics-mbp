// T29.3a (R2/R3) — print the toolchain and environment a scholarly review set was built with.
//
// PDF bytes and pagination depend on the renderer: the same inputs typeset to 43 pages with
// Chrome for Testing 133 and to 44 pages with Chromium 141. Record this next to every review
// set so an artifact is always judged (and reproduced) with the toolchain that made it.
//
// Usage: node scripts/record-scholarly-toolchain.mjs --browser <chrome binary> [--python <python3>] > toolchain.json
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, realpathSync } from 'node:fs';
import { arch, platform, release } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, '..');
const args = process.argv.slice(2);
const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const browser = option('--browser');
if (!browser) {
	console.error('usage: node scripts/record-scholarly-toolchain.mjs --browser <chrome binary> [--python <python3>]');
	process.exit(2);
}
const python = option('--python') ?? process.env.SCHOLARLY_PYTHON ?? 'python3';
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const first = (cmd, argv) => { const r = spawnSync(cmd, argv, { encoding: 'utf8' }); return `${r.stdout}${r.stderr}`.split('\n')[0].trim() || null; };
const pkg = (name) => JSON.parse(readFileSync(join(SITE, 'node_modules', name, 'package.json'), 'utf8')).version;
const lock = JSON.parse(readFileSync(join(SITE, 'package-lock.json'), 'utf8')).packages;
const locked = (name) => lock[`node_modules/${name}`]?.version;
const resolved = realpathSync(browser);
const fontDir = join(SITE, 'public', 'fonts', 'print');
const mupdf = spawnSync(python, ['-c', 'import pymupdf; print(pymupdf.__version__, pymupdf.mupdf_version)'], { encoding: 'utf8' });

console.log(JSON.stringify({
	recordedFor: 'forward scholarly review set',
	node: process.version, npm: first('npm', ['--version']),
	os: `${platform()} ${release()} ${arch()}`,
	environment: { TZ: process.env.TZ ?? null, LANG: process.env.LANG ?? null, LC_ALL: process.env.LC_ALL ?? null,
		note: 'build-scholarly-review.mjs forces TZ=UTC for the Astro child regardless of these' },
	packages: Object.fromEntries(['astro', '@vivliostyle/cli', 'pdfjs-dist'].map((n) => [n, { installed: pkg(n), lockfile: locked(n) }])),
	browser: { path: browser, resolved, version: first(resolved, ['--version']), sha256: sha256(resolved) },
	printFontsBundledInRepo: Object.fromEntries(readdirSync(fontDir).filter((f) => f.endsWith('.otf')).sort().map((f) => [f, sha256(join(fontDir, f))])),
	webFontNote: 'Astro downloads the site web fonts (IBM Plex Mono, Atkinson Hyperlegible) at build time; their cached file hash appears in the page <style> and can differ between a cold and a warm cache. Print PDFs use the bundled LM Roman fonts above.',
	extractors: {
		poppler: first('pdftotext', ['-v']),
		mupdf: mupdf.status === 0 ? mupdf.stdout.trim() : 'unavailable',
		'pdfjs-dist': pkg('pdfjs-dist'),
		poppler_and_mupdf_note: 'Poppler and PyMuPDF are system/venv tools, not locked by package-lock.json',
	},
}, null, 2));

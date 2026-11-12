import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { absolutizePdfLinks } from './absolutize-pdf-links.mjs';
import { removeEmptySrcsetInTree, runVivliostyle, startStaticServer, stopServer } from './build-research-pdfs.mjs';
import { projectInput, sha256, verifiedAssets } from './scholarly-input.mjs';

const site = fileURLToPath(new URL('..', import.meta.url));
const options = { input: {type: 'string'}, source: {type: 'string'}, output: {type: 'string'},
	mode: {type: 'string'}, browser: {type: 'string'}, 'test-date': {type: 'string'}, 'input-sha256': {type: 'string'} };
const { values: args } = parseArgs({ options });
const { input: inputPath, source: sourcePath, output, mode, browser } = args;
if (!args['input-sha256'] || !inputPath || !sourcePath || !output || !browser || !['candidate', 'final-form'].includes(mode) ||
	(mode === 'final-form') !== !!args['test-date']) {
	throw new Error('Supply --input --input-sha256 --source --output --browser and --mode candidate|final-form; final-form requires --test-date');
}
const out = resolve(output);
const parent = dirname(out);
const repo = resolve(site, '..');
const fromRepo = relative(repo, out);
if (!isAbsolute(output) || !fromRepo.startsWith('../') || out.split('/').includes('dist') ||
	out.split('/').includes('release-pdfs') || realpathSync(parent) !== parent || existsSync(out)) {
	throw new Error('Scholarly review output must be a new absolute directory outside the repository and release roots');
}
const inputBytes = readFileSync(inputPath);
if (sha256(inputBytes) !== args['input-sha256']) throw new Error('Scholarly input metadata differs from its independent pin');
const input = JSON.parse(inputBytes);
const source = realpathSync(sourcePath);
const markdown = projectInput(readFileSync(source), input, args['test-date'] ?? '2000-01-01');
const assets = verifiedAssets(source, input.source.assets);
const intake = join(site, 'src/content/scholarly-review');
const entry = join(intake, input.slug);
const htmlRoot = join(out, 'html');
const printRoot = join(out, 'print-source');
const route = `research/${input.category}/${input.slug}/`;
const artifact = `${input.slug}.pdf`;
let server;
let ownedIntake = false;

function run(command, argv, env) {
	return new Promise((done, fail) => {
		const child = spawn(command, argv, { cwd: site, env, stdio: 'inherit' });
		child.on('error', fail);
		child.on('close', (code) => code === 0 ? done() : fail(new Error(`Build exited ${code}`)));
	});
}

try {
	mkdirSync(out, {mode: 0o700});
	mkdirSync(intake, {mode: 0o700});
	ownedIntake = true;
	mkdirSync(entry);
	writeFileSync(join(entry, 'index.md'), markdown, {flag: 'wx'});
	for (const asset of assets) {
		const path = join(entry, asset.path);
		mkdirSync(dirname(path), {recursive: true});
		writeFileSync(path, asset.bytes, {flag: 'wx'});
	}
	await run(process.execPath, [join(site, 'node_modules/astro/bin/astro.mjs'), 'build', '--force', '--outDir', htmlRoot],
		{...process.env, TZ: 'UTC', SITE_INDEXING: 'closed', SCHOLARLY_REVIEW: mode, SCHOLARLY_REVIEW_ROUTE: '/' + route});
	absolutizePdfLinks(htmlRoot, printRoot);
	removeEmptySrcsetInTree(printRoot);
	const printPage = join(printRoot, route, 'index.html');
	const printHtml = readFileSync(printPage, 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
	writeFileSync(printPage, printHtml);
	server = await startStaticServer(printRoot, 0);
	const origin = `http://127.0.0.1:${server.address().port}`;
	const pdf = join(out, artifact);
	await runVivliostyle(`${origin}/${route}`, pdf, join(site, 'src/styles/print-research.css'), 180, realpathSync(browser));
	const bytes = readFileSync(pdf);
	if (!bytes.subarray(0, 5).equals(Buffer.from('%PDF-'))) throw new Error('Renderer did not produce a PDF');
	writeFileSync(join(out, 'manifest.json'), JSON.stringify({
		state: 'candidate', mode, route: '/' + route, artifact, sha256: sha256(bytes), bytes: bytes.length,
		htmlSha256: sha256(readFileSync(join(htmlRoot, route, 'index.html'))),
		inputSha256: sha256(inputBytes), source: input.source, doi: input.identity,
		previewDate: args['test-date'] ?? null, node: process.version, browserSha256: sha256(readFileSync(browser)),
		astro: JSON.parse(readFileSync(join(site, 'node_modules/astro/package.json'))).version,
		vivliostyle: JSON.parse(readFileSync(join(site, 'node_modules/@vivliostyle/cli/package.json'))).version,
	}, null, 2) + '\n');
} finally {
	if (server) await stopServer(server);
	if (ownedIntake) rmSync(intake, {recursive: true, force: true});
	rmSync(printRoot, {recursive: true, force: true});
}

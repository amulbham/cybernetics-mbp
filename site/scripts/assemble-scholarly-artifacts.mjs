import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { discoverResearch } from './discover-research.mjs';
import { redirectRules, renderRedirectLines } from '../src/lib/route-history.ts';
import { regularUnder, sha256 } from './scholarly-input.mjs';

const repo = fileURLToPath(new URL('../..', import.meta.url));
const baseline = fileURLToPath(new URL('./fixtures/approved-six-production-pdfs.sha256', import.meta.url));
const pdfPath = /^research\/[a-z0-9-]+\/([a-z0-9-]+)\/\1\.pdf$/;
const hash = /^[0-9a-f]{64}$/;

function entries(root, dir = root) {
	return readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return entries(root, path);
		if (!entry.isFile()) throw new Error(`Unsafe artifact tree entry: ${path}`);
		return [relative(root, path)];
	});
}

function loadProtected() {
	return readFileSync(baseline, 'utf8').trim().split('\n').map((line) => {
		const [sha, path] = line.split(/\s+/);
		return { path, sha256: sha };
	});
}

export function assembleArtifacts({ htmlRoot, legacyRoot, candidateRoot, approvalPath, output, mode }) {
	const approval = JSON.parse(readFileSync(approvalPath, 'utf8'));
	const manifestPath = regularUnder(candidateRoot, 'manifest.json');
	const manifestBytes = readFileSync(manifestPath);
	const candidate = JSON.parse(manifestBytes);
	const protectedRows = loadProtected();
	const destination = resolve(output);
	const parent = dirname(destination);
	const localOutput = relative(repo, destination).startsWith('../') && !destination.split('/').includes('dist') &&
		!destination.split('/').includes('release-pdfs');
	if (mode !== 'rehearsal' && mode !== 'approved') throw new Error('Explicit artifact assembly mode required');
	if (!isAbsolute(output) || !localOutput || realpathSync(parent) !== parent || existsSync(destination)) {
		throw new Error('Artifact assembly requires a fresh isolated destination outside the repository and release roots');
	}
	if (approval.state !== (mode === 'rehearsal' ? 'rehearsal-only' : 'approved-publication') ||
		(mode === 'approved' && (!approval.owner || !approval.reviewRecord))) {
		throw new Error('An independent matching artifact approval is required');
	}
	const path = candidate.route?.slice(1) + candidate.artifact;
	const [,, category, id] = candidate.route?.split('/') ?? [];
	const expectedMode = mode === 'rehearsal' ? 'final-form' : 'release-candidate';
	if (candidate.state !== 'candidate' || candidate.mode !== expectedMode || !pdfPath.test(path) ||
		!hash.test(candidate.sha256) || approval.path !== path || approval.sha256 !== candidate.sha256 ||
		approval.manifestSha256 !== sha256(manifestBytes) || (mode === 'approved' && (!/^\d{4}-\d{2}-\d{2}$/.test(approval.publicationDate) ||
			approval.publicationDate !== candidate.publicationDate || candidate.previewDate != null))) {
		throw new Error('Unapproved candidate or path/hash/metadata mismatch');
	}
	const allowed = new Set(protectedRows.map((row) => row.path));
	const inventory = entries(legacyRoot);
	if (allowed.size !== 6 || allowed.has(path) || inventory.length !== allowed.size || inventory.some((name) => !allowed.has(name))) {
		throw new Error('Protected PDF inventory differs from the exact six-path baseline');
	}
	if (entries(htmlRoot).some((name) => name.toLowerCase().endsWith('.pdf'))) throw new Error('HTML input already contains a PDF');
	const page = regularUnder(htmlRoot, candidate.route.slice(1) + 'index.html');
	if (sha256(readFileSync(page)) !== candidate.htmlSha256) throw new Error('Final-form HTML differs from the candidate manifest');
	const { papers, nonPapers } = discoverResearch();
	const current = [...papers, ...nonPapers];
	const existing = current.find((entry) => entry.id === id);
	if (existing && (existing.route !== candidate.route || existing.format !== 'paper')) throw new Error('Candidate collides with published routing');
	if (!existing) current.push({ id, category, format: 'paper' });
	const redirects = renderRedirectLines(redirectRules(current));
	const artifacts = [...protectedRows.map((row) => ({...row, root: legacyRoot, name: row.path})),
		{ path, sha256: candidate.sha256, root: candidateRoot, name: candidate.artifact }].map((row) => {
		const bytes = readFileSync(regularUnder(row.root, row.name));
		if (!bytes.subarray(0, 5).equals(Buffer.from('%PDF-')) || sha256(bytes) !== row.sha256 ||
			(row.path === path && bytes.length !== candidate.bytes)) throw new Error(`Approved PDF bytes mismatch: ${row.path}`);
		return { ...row, bytes };
	});

	// Publish the directory as a unit after validating all inputs and writing a
	// complete sibling tree. No renderer or upload entry point is reachable here.
	const temporary = mkdtempSync(join(parent, '.scholarly-assembly-'));
	try {
		cpSync(htmlRoot, temporary, {recursive: true});
		writeFileSync(join(temporary, '_redirects'), redirects.join('\n') + '\n');
		for (const row of artifacts) {
			const target = join(temporary, row.path);
			mkdirSync(dirname(target), {recursive: true});
			writeFileSync(target, row.bytes, {flag: 'wx'});
		}
		if (existsSync(destination)) throw new Error('Artifact output appeared during assembly');
		renameSync(temporary, destination);
	} finally {
		if (existsSync(temporary) && lstatSync(temporary).isDirectory()) rmSync(temporary, {recursive: true, force: true});
	}
	return artifacts.map(({path, sha256}) => ({path, sha256}));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const [config] = process.argv.slice(2);
	if (!config) throw new Error('Supply an assembly configuration file');
	console.log(JSON.stringify(assembleArtifacts(JSON.parse(readFileSync(config, 'utf8'))), null, 2));
}

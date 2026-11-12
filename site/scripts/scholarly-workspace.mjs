// T29.3a (R3) — the private test workspace for the scholarly contract suite.
//
// The unpublished manuscript, the candidate/final-form PDFs and the six protected PDFs
// are private inputs that never enter Git. scripts/test-scholarly-contract.mjs and
// scripts/prepare-scholarly-workspace.mjs share this module so the suite checks that
// every required input exists and matches its pin BEFORE it runs a single mutation test,
// and fails with a precise list rather than a stack trace from the first missing file.
//
// Workspace layout (paths inside rehearsal-config.json may be absolute or relative to the
// workspace, so the directory can be moved):
//   paper-c.json              the private input configuration (source pin, identity, projection)
//   rehearsal-config.json     { htmlRoot, legacyRoot, candidateRoot, approvalPath, output?, mode: "rehearsal" }
//   rehearsal-approval.json   synthetic approval of the final-form PDF (state: rehearsal-only)
//   assembly.log              JSON list of the seven { path, sha256 } rows an assembly returns
//   checked-candidate/        candidate manifest.json + PDF (the candidate-labelled artifact)
//   checked-final-form/       final-form manifest.json + PDF (the rehearsal artifact)
//   html-original/            the built site tree whose route page is the final-form HTML
//   legacy/                   the six protected PDFs at their baseline fixture paths
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, lstatSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const BASELINE_FIXTURE = join(HERE, 'fixtures', 'approved-six-production-pdfs.sha256');
export const sha256File = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const gitBlob = (bytes) => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');

export function baselineRows(fixture = BASELINE_FIXTURE) {
	return readFileSync(fixture, 'utf8').trim().split('\n').map((line) => {
		const [hash, path] = line.split(/\s+/);
		return { path, sha256: hash };
	});
}

const readJson = (path, problems, label) => {
	try {
		return JSON.parse(readFileSync(path, 'utf8'));
	} catch (err) {
		problems.push(`${label}: ${path} is missing or not valid JSON (${err.code ?? err.message})`);
		return undefined;
	}
};

const isFile = (path) => existsSync(path) && lstatSync(path).isFile();

/**
 * Check every required input. Returns { config, problems }. `config` is rehearsal-config.json
 * with its paths resolved against the workspace; `problems` is empty when the workspace is
 * complete and every pin matches.
 */
export function validateWorkspace(workspace, sourcePath, { fixture = BASELINE_FIXTURE } = {}) {
	const problems = [];
	const abs = (p) => (isAbsolute(p) ? p : resolve(workspace, p));
	const input = readJson(join(workspace, 'paper-c.json'), problems, 'private input configuration');
	const rawConfig = readJson(join(workspace, 'rehearsal-config.json'), problems, 'rehearsal configuration');
	const config = rawConfig && Object.fromEntries(Object.entries(rawConfig).map(([k, v]) =>
		[k, ['htmlRoot', 'legacyRoot', 'candidateRoot', 'approvalPath', 'output'].includes(k) && typeof v === 'string' ? abs(v) : v]));

	// 1. The pinned manuscript.
	if (!sourcePath || !isFile(sourcePath)) problems.push(`source manuscript: ${sourcePath ?? '(not given)'} is missing`);
	else if (input?.source) {
		const bytes = readFileSync(sourcePath);
		if (gitBlob(bytes) !== input.source.blob) problems.push(`source manuscript: git blob ${gitBlob(bytes)} differs from the pin ${input.source.blob}`);
		if (createHash('sha256').update(bytes).digest('hex') !== input.source.sha256) problems.push(`source manuscript: SHA-256 differs from the pin ${input.source.sha256}`);
	}

	// 2. The six protected PDFs, exactly, at their fixture paths (never rendered here).
	if (config) {
		if (config.mode !== 'rehearsal') problems.push(`rehearsal configuration: mode must be "rehearsal", found ${JSON.stringify(config.mode)}`);
		for (const key of ['htmlRoot', 'legacyRoot', 'candidateRoot', 'approvalPath']) {
			if (typeof config[key] !== 'string') problems.push(`rehearsal configuration: ${key} is missing`);
		}
		if (typeof config.legacyRoot === 'string') {
			for (const row of baselineRows(fixture)) {
				const file = join(config.legacyRoot, row.path);
				if (!isFile(file)) problems.push(`protected PDF missing: ${row.path}`);
				else if (sha256File(file) !== row.sha256) problems.push(`protected PDF differs from the pinned baseline: ${row.path}`);
			}
		}
	}

	// 3. Checked candidate (candidate-labelled; the installer must refuse it).
	const candidate = readJson(join(workspace, 'checked-candidate', 'manifest.json'), problems, 'checked candidate manifest');
	if (candidate) {
		if (candidate.mode !== 'candidate') problems.push(`checked candidate manifest: mode must be "candidate", found ${JSON.stringify(candidate.mode)}`);
		const pdf = join(workspace, 'checked-candidate', candidate.artifact ?? '');
		if (!isFile(pdf)) problems.push(`checked candidate PDF missing: ${pdf}`);
		else if (sha256File(pdf) !== candidate.sha256) problems.push('checked candidate PDF differs from its manifest SHA-256');
	}

	// 4. Final-form artifact, its approval and its HTML.
	if (config?.candidateRoot && config?.approvalPath) {
		const manifestPath = join(config.candidateRoot, 'manifest.json');
		const manifest = readJson(manifestPath, problems, 'final-form manifest');
		const approval = readJson(config.approvalPath, problems, 'rehearsal approval');
		if (manifest) {
			if (manifest.mode !== 'final-form') problems.push(`final-form manifest: mode must be "final-form", found ${JSON.stringify(manifest.mode)}`);
			const pdf = join(config.candidateRoot, manifest.artifact ?? '');
			if (!isFile(pdf)) problems.push(`final-form PDF missing: ${pdf}`);
			else if (sha256File(pdf) !== manifest.sha256) problems.push('final-form PDF differs from its manifest SHA-256');
			if (approval) {
				if (approval.state !== 'rehearsal-only') problems.push(`rehearsal approval: state must be "rehearsal-only", found ${JSON.stringify(approval.state)}`);
				if (approval.sha256 !== manifest.sha256) problems.push('rehearsal approval SHA-256 differs from the final-form manifest');
				if (approval.manifestSha256 !== sha256File(manifestPath)) problems.push('rehearsal approval manifestSha256 differs from the final-form manifest bytes');
				if (approval.path !== `${manifest.route?.slice(1)}${manifest.artifact}`) problems.push('rehearsal approval path differs from the final-form manifest route');
			}
			if (config.htmlRoot) {
				const page = join(config.htmlRoot, manifest.route?.slice(1) ?? '', 'index.html');
				if (!isFile(page)) problems.push(`selected-article HTML missing: ${page}`);
				else if (sha256File(page) !== manifest.htmlSha256) problems.push('selected-article HTML differs from the final-form manifest htmlSha256');
			}
		}
	}

	// 5. The assembly log names the seven rows; the suite reads its first protected path.
	const log = readJson(join(workspace, 'assembly.log'), problems, 'assembly log');
	if (log && (!Array.isArray(log) || log.length !== 7 || typeof log[0]?.path !== 'string')) problems.push('assembly log must be a JSON list of seven { path, sha256 } rows');

	return { config, problems };
}

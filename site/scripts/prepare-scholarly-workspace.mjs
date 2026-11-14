// T29.3a (R3) — build a relocatable private workspace for the scholarly contract suite.
//
// Everything it reads is private and stays out of Git: the unpublished manuscript, the
// candidate and final-form review sets, the six protected PDFs. It verifies each input
// against its pin first (see scholarly-workspace.mjs), copies them into a NEW workspace
// directory, writes a rehearsal-config.json with workspace-relative paths, and — unless
// told to reuse archived records — generates a fresh synthetic rehearsal approval and an
// assembly log by running the real (renderer-free) assembler once.
//
// Two ways to supply the review sets:
//   fresh build outputs    --candidate <dir> --final-form <dir>     each holds manifest.json,
//                          <slug>.pdf and html/ (the output of build-scholarly-review.mjs)
//   archived original set  --candidate <dir> --final-form <dir> --final-form-html <file>
//                          [--approval <file>] [--assembly-log <file>]  — the archive keeps the
//                          final-form page as one HTML file, which replaces the selected
//                          article page in a copy of the candidate's html/ tree.
//
// Usage (from the repository's site/ directory; tsx loader required):
//   node --import ./node_modules/tsx/dist/loader.mjs scripts/prepare-scholarly-workspace.mjs \
//     --input paper-c.json --source v4.6.md --legacy <dir of the six PDFs at their fixture paths> \
//     --candidate <dir> --final-form <dir> --workspace <new dir>
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { assembleArtifacts } from './assemble-scholarly-artifacts.mjs';
import { baselineRows, sha256File, validateWorkspace } from './scholarly-workspace.mjs';

const { values: args } = parseArgs({ options: {
	input: { type: 'string' }, source: { type: 'string' }, legacy: { type: 'string' }, candidate: { type: 'string' },
	'final-form': { type: 'string' }, 'final-form-html': { type: 'string' }, approval: { type: 'string' },
	'assembly-log': { type: 'string' }, workspace: { type: 'string' },
} });
for (const required of ['input', 'source', 'legacy', 'candidate', 'final-form', 'workspace']) {
	if (!args[required]) {
		console.error(`prepare-scholarly-workspace: --${required} is required`);
		process.exit(2);
	}
}
const workspace = resolve(args.workspace);
if (existsSync(workspace)) {
	console.error(`prepare-scholarly-workspace: ${workspace} already exists; supply a new directory`);
	process.exit(2);
}

const candidateDir = resolve(args.candidate);
const finalFormDir = resolve(args['final-form']);
const candidateManifest = JSON.parse(readFileSync(join(candidateDir, 'manifest.json'), 'utf8'));
const finalManifest = JSON.parse(readFileSync(join(finalFormDir, 'manifest.json'), 'utf8'));
const routePage = `${finalManifest.route.slice(1)}index.html`;

mkdirSync(workspace, { mode: 0o700 });
cpSync(resolve(args.input), join(workspace, 'paper-c.json'));
cpSync(resolve(args.legacy), join(workspace, 'legacy'), { recursive: true });
for (const [name, dir, manifest] of [['checked-candidate', candidateDir, candidateManifest], ['checked-final-form', finalFormDir, finalManifest]]) {
	mkdirSync(join(workspace, name));
	cpSync(join(dir, 'manifest.json'), join(workspace, name, 'manifest.json'));
	cpSync(join(dir, manifest.artifact), join(workspace, name, manifest.artifact));
}
if (args['final-form-html']) {
	cpSync(join(candidateDir, 'html'), join(workspace, 'html-original'), { recursive: true });
	cpSync(resolve(args['final-form-html']), join(workspace, 'html-original', routePage));
} else {
	cpSync(join(finalFormDir, 'html'), join(workspace, 'html-original'), { recursive: true });
}

const approvalPath = join(workspace, 'rehearsal-approval.json');
if (args.approval) cpSync(resolve(args.approval), approvalPath);
else {
	writeFileSync(approvalPath, JSON.stringify({
		state: 'rehearsal-only', path: `${finalManifest.route.slice(1)}${finalManifest.artifact}`,
		sha256: finalManifest.sha256, manifestSha256: sha256File(join(finalFormDir, 'manifest.json')),
	}, null, 2) + '\n');
}
writeFileSync(join(workspace, 'rehearsal-config.json'), JSON.stringify({
	htmlRoot: 'html-original', legacyRoot: 'legacy', candidateRoot: 'checked-final-form',
	approvalPath: 'rehearsal-approval.json', output: 'out-rehearsal-contract', mode: 'rehearsal',
}, null, 2) + '\n');

if (args['assembly-log']) cpSync(resolve(args['assembly-log']), join(workspace, 'assembly.log'));
else {
	// One real, renderer-free assembly: six protected PDFs plus the rehearsal artifact.
	const rows = assembleArtifacts({
		htmlRoot: join(workspace, 'html-original'), legacyRoot: join(workspace, 'legacy'), candidateRoot: join(workspace, 'checked-final-form'),
		approvalPath, output: join(workspace, 'assembled-rehearsal'), mode: 'rehearsal',
	});
	writeFileSync(join(workspace, 'assembly.log'), JSON.stringify(rows, null, 2) + '\n');
}

const { problems } = validateWorkspace(workspace, resolve(args.source));
if (problems.length) {
	console.error(`prepare-scholarly-workspace: workspace ${workspace} written but ${problems.length} input problem(s) remain:`);
	for (const problem of problems) console.error(`  - ${problem}`);
	process.exit(1);
}
console.log(`prepare-scholarly-workspace: ${workspace} is complete; ${baselineRows().length} protected PDFs and every pin verified.`);
console.log(`Run the suite from the repository root:\n  TZ=UTC node --import ./site/node_modules/tsx/dist/loader.mjs site/scripts/test-scholarly-contract.mjs ${workspace} ${resolve(args.source)}`);

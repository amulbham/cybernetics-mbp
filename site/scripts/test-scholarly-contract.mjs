import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { assembleArtifacts } from './assemble-scholarly-artifacts.mjs';
import { projectInput, sha256 } from './scholarly-input.mjs';
import { rehypeCitationLinks } from '../src/lib/rehype-citation-links.mjs';
import { rehypeScholarlyPrintTables } from '../src/lib/rehype-scholarly-print-tables.mjs';

const [workspace, sourcePath] = process.argv.slice(2).map((path) => resolve(path));
const source = readFileSync(sourcePath);
const input = JSON.parse(readFileSync(join(workspace, 'paper-c.json'), 'utf8'));
const config = JSON.parse(readFileSync(join(workspace, 'rehearsal-config.json'), 'utf8'));
let count = 0;
function passed(label, assertion) {
	assertion();
	console.log(`PASS ${label}`);
	count++;
}
function rejectInput(label, mutate, bytes = source) {
	passed(label, () => {
		const copy = structuredClone(input);
		mutate(copy);
		assert.throws(() => projectInput(bytes, copy, '2000-01-01'));
	});
}
assert.match(projectInput(source, input, '2000-01-01'), /scholarly-forward/);
for (const [label, from, to] of [
	['altered reference', '20531589', '20531580'],
	['missing table', input.projection.printTables[0].header, ''],
	['changed row', '| 1 | Ledger |', '| 1 | Altered |'],
	['duplicate author note', '## Appendix A', '## About the Author\n\n## Appendix A'],
	['altered findings', '## Key findings', '## Changed findings'],
]) {
	assert.ok(source.toString().includes(from));
	rejectInput(label, () => {}, Buffer.from(source.toString().replace(from, to)));
}
rejectInput('wrong source blob', (copy) => { copy.source.blob = '0'.repeat(40); });
rejectInput('missing source revision', (copy) => { delete copy.source.commit; });
rejectInput('missing DOI', (copy) => { delete copy.identity.conceptDoi; });
rejectInput('conflated DOI roles', (copy) => { copy.identity.conceptDoi = copy.identity.versionDoi; });
rejectInput('missing print note', (copy) => { delete copy.identity.printAuthorNote; });
rejectInput('missing projection boundary', (copy) => { copy.projection.start = 'Absent'; });
passed('missing publication test date', () => assert.throws(() => projectInput(source, input)));
passed('invalid publication test date', () => assert.throws(() => projectInput(source, input, '2026-02-30')));
passed('orphan print table marker', () => assert.throws(() =>
	rehypeScholarlyPrintTables()({children: [{type: 'raw', value: '<!-- scholarly-print-table: {} -->'}]})));

const el = (tagName, properties, children) => ({type: 'element', tagName, properties, children});
const string = (value) => ({type: 'text', value});
const paragraph = (value) => el('p', {}, [string(value)]);
passed('suffixed, loose-list, unsuffixed, missing and ambiguous citations', () => {
	const tree = {children: [{type: 'raw', value: '<!-- scholarly-forward -->'},
		paragraph('(Bham, 2026a; Bham, 2026b; Bham, 2026; Smith, 2001; Doe, 2020)'),
		paragraph('VanBham (2026a) and Bham (2026b).'),
		el('li', {id: 'ref-8'}, [paragraph('\n Bham, A. (2026a). First.')]),
		el('li', {id: 'ref-9'}, [paragraph('\n Bham, A. (2026b). Second.')]),
		el('li', {id: 'ref-10'}, [paragraph('Smith, A. (2001). Third.')]),
		el('li', {id: 'ref-11'}, [paragraph('Doe, A. (2020). Fourth.')]),
		el('li', {id: 'ref-12'}, [paragraph('Doe, B. (2020). Fifth.')]),
	]};
	rehypeCitationLinks()(tree);
	const urls = (node) => node.children.filter((child) => child.tagName === 'a').map((child) => child.properties.href);
	assert.deepEqual(urls(tree.children[1]), ['#ref-8', '#ref-9', '#ref-10']);
	assert.deepEqual(urls(tree.children[2]), ['#ref-9']);
});

const tmp = mkdtempSync(join(workspace, 'negative-'));
try {
	const approval = JSON.parse(readFileSync(config.approvalPath, 'utf8'));
	const approvalPath = join(tmp, 'approval.json');
	const output = join(tmp, 'output');
	writeFileSync(approvalPath, JSON.stringify(approval));
	const attempt = (overrides) => {
		assert.throws(() => assembleArtifacts({...config, output, approvalPath, ...overrides}));
		assert.ok(!existsSync(output), 'Failure must leave no installed output');
	};
	passed('rehearsal record cannot authorize publication', () => attempt({mode:'approved'}));
	writeFileSync(approvalPath, JSON.stringify({...approval, state:'approved-publication', owner:'Test owner',
		reviewRecord:'synthetic', publicationDate:'2000-01-01'}));
	passed('fixture-date dry run cannot enter approved installer', () => attempt({mode:'approved'}));
	for (const [label, mutation] of [
		['wrong approved path', {...approval, path:'research/x/y/y.pdf'}],
		['wrong approved hash', {...approval, sha256:'0'.repeat(64)}],
		['wrong approved manifest/metadata hash', {...approval, manifestSha256:'0'.repeat(64)}],
	]) {
		writeFileSync(approvalPath, JSON.stringify(mutation));
		passed(label, () => attempt({}));
	}
	writeFileSync(approvalPath, JSON.stringify(approval));
	passed('candidate-labeled PDF cannot install', () => attempt({candidateRoot: join(workspace,'checked-candidate')}));
	passed('unsafe output path', () => attempt({output: config.htmlRoot}));
	const legacy = join(tmp, 'legacy');
	cpSync(config.legacyRoot, legacy, {recursive:true});
	const sample = JSON.parse(readFileSync(join(workspace,'assembly.log'),'utf8'))[0].path;
	const file = join(legacy, sample);
	const original = readFileSync(file);
	writeFileSync(join(legacy,'unexpected.pdf'),original);
	passed('extra PDF', () => attempt({legacyRoot:legacy}));
	rmSync(join(legacy,'unexpected.pdf'));
	writeFileSync(file,'not a PDF');
	passed('substituted legacy bytes', () => attempt({legacyRoot:legacy}));
	rmSync(file);
	passed('missing approved bytes', () => attempt({legacyRoot:legacy}));
	symlinkSync(join(config.legacyRoot,sample),file);
	passed('symlink escape', () => attempt({legacyRoot:legacy}));
	const badHtml = join(tmp, 'html');
	cpSync(config.htmlRoot, badHtml, {recursive:true});
	mkdirSync(join(badHtml, approval.path));
	passed('mid-assembly failure leaves no partial output', () => attempt({htmlRoot:badHtml}));
	passed('isolated real assembly contains expected seventh hash', () => {
		const result = assembleArtifacts({...config, output, approvalPath});
		assert.equal(result.length, 7);
		assert.equal(sha256(readFileSync(join(output, approval.path))), approval.sha256);
	});
} finally {
	rmSync(tmp, {recursive:true, force:true});
}
console.log(`${count} scholarly contract cases passed`);

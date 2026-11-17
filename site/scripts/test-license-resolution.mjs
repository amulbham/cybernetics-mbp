// T30.8 — targeted tests for the per-work license resolution (src/lib/license.ts) and its source of truth.
//
// Run from site/ (no build needed):  npm run test:license
//
// 1. Resolution: new entry -> CC BY 4.0; supported override wins; scholarly -> CC BY 4.0; unsupported or
//    contradictory input throws instead of becoming another license.
// 2. Preservation: every content entry's effective license, resolved from its own frontmatter exactly as the build
//    does, must equal the license recorded for it in the independent facts fixture. An entry published before the
//    forward default therefore cannot lose its explicit override unnoticed, and a new entry cannot ship without a
//    reviewed fixture row.
// 3. Self-test: the preservation check is run against disposable in-memory copies with a legacy override removed,
//    an unsupported value injected and a contradiction injected; each must be reported. Nothing on disk is touched.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_LICENSE_ID, LICENSES, LICENSE_IDS, effectiveLicense, licenseInputsConflict } from '../src/lib/license.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, '..');
const CONTENT = join(SITE, 'src', 'content', 'research');
const fixture = JSON.parse(readFileSync(join(HERE, 'fixtures', 'publishing-facts.json'), 'utf8'));

const results = [];
const check = (id, name, ok, note = '') => results.push({ id, name, ok, note });
const throws = (fn) => {
	try {
		fn();
		return false;
	} catch {
		return true;
	}
};

// ---- 1. resolution -------------------------------------------------------------
check('R01', 'a new entry with no override resolves to CC BY 4.0', effectiveLicense({}).id === 'cc-by-4.0' && DEFAULT_LICENSE_ID === 'cc-by-4.0');
check('R02', 'a supported CC BY-NC override wins over the default', effectiveLicense({ license: 'cc-by-nc-4.0' }).id === 'cc-by-nc-4.0');
check('R03', 'an explicit CC BY override is accepted', effectiveLicense({ license: 'cc-by-4.0' }).id === 'cc-by-4.0');
check('R04', 'a scholarly paper with no override is CC BY 4.0', effectiveLicense({ scholarly: { printAuthorNote: 'x' } }).id === 'cc-by-4.0');
check('R05', 'a scholarly paper with an explicit CC BY override is accepted', effectiveLicense({ scholarly: {}, license: 'cc-by-4.0' }).id === 'cc-by-4.0');
check('R06', 'a scholarly paper with a CC BY-NC override is rejected, not coerced', throws(() => effectiveLicense({ scholarly: {}, license: 'cc-by-nc-4.0' })) && licenseInputsConflict({ scholarly: {}, license: 'cc-by-nc-4.0' }));
for (const bad of ['mit', 'CC BY 4.0', 'cc-by-sa-4.0', '', 'CC0']) check('R07', `unsupported value ${JSON.stringify(bad)} is rejected, not substituted`, throws(() => effectiveLicense({ license: bad })));
check('R08', 'the supported set is exactly CC BY 4.0 and CC BY-NC 4.0 (a new license needs a reviewed change here and in the fixture)', JSON.stringify([...LICENSE_IDS].sort()) === JSON.stringify(['cc-by-4.0', 'cc-by-nc-4.0']));
check('R09', 'license URLs and labels are the canonical Creative Commons ones', LICENSES['cc-by-4.0'].url === 'https://creativecommons.org/licenses/by/4.0/' && LICENSES['cc-by-4.0'].label === 'CC BY 4.0' && LICENSES['cc-by-nc-4.0'].url === 'https://creativecommons.org/licenses/by-nc/4.0/' && LICENSES['cc-by-nc-4.0'].label === 'CC BY-NC 4.0');
{
	const schema = readFileSync(join(SITE, 'src', 'content.config.ts'), 'utf8');
	check('R10', 'the content schema validates `license` against the supported set and rejects the scholarly contradiction', /license:\s*z\.enum\(LICENSE_IDS\)\.optional\(\)/.test(schema) && /licenseInputsConflict\(data\)/.test(schema));
}

// ---- 2. preservation against the independent fixture ---------------------------
/** Resolve the way the build does, from raw frontmatter text. Returns { license?: string, scholarly: boolean }. */
function frontmatterInputs(text) {
	const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
	if (!m) throw new Error('no frontmatter');
	const fm = m[1];
	const lic = /^license:\s*(.*?)\s*$/m.exec(fm);
	const unq = (s) => s.replace(/^['"]|['"]$/g, '');
	return { license: lic ? unq(lic[1]) : undefined, scholarly: /^scholarly:/m.test(fm) };
}
/** Compare every entry's resolved license with the fixture; returns a list of problems. */
function preservationProblems(entries /* Map id -> frontmatter text */, fx) {
	const problems = [];
	const expected = new Map(fx.entries.map((e) => [e.id, e.license]));
	for (const [id, text] of entries) {
		if (!expected.has(id)) {
			problems.push(`${id}: no reviewed fixture row`);
			continue;
		}
		let got;
		try {
			got = LICENSES[effectiveLicense(frontmatterInputs(text)).id].url;
		} catch (err) {
			problems.push(`${id}: ${err.message}`);
			continue;
		}
		if (got !== expected.get(id)) problems.push(`${id}: effective ${got} !== fixture ${expected.get(id)}`);
	}
	for (const id of expected.keys()) if (!entries.has(id)) problems.push(`${id}: fixture row without a content entry`);
	return problems;
}
const entries = new Map();
for (const d of readdirSync(CONTENT, { withFileTypes: true })) {
	const f = join(CONTENT, d.name, 'index.md');
	if (d.isDirectory() && existsSync(f)) entries.set(d.name, readFileSync(f, 'utf8'));
}
const real = preservationProblems(entries, fixture);
check('P01', `all ${entries.size} content entries resolve to the license recorded in the fixture`, real.length === 0, real.join('; '));
check('P02', 'every fixture entry license is a supported license URL', fixture.entries.every((e) => e.license in fixture.licenses && Object.values(LICENSES).some((l) => l.url === e.license)));
{
	const ncOnDisk = [...entries].filter(([, t]) => frontmatterInputs(t).license === 'cc-by-nc-4.0').map(([id]) => id);
	const ncInFixture = fixture.entries.filter((e) => e.license === LICENSES['cc-by-nc-4.0'].url).map((e) => e.id);
	check('P03', 'the entries carrying an explicit CC BY-NC override are exactly those the fixture records as CC BY-NC', JSON.stringify(ncOnDisk.sort()) === JSON.stringify(ncInFixture.sort()), `${ncOnDisk.length} vs ${ncInFixture.length}`);
}

// ---- 3. self-test: the preservation check must detect each regression ------------
const mutate = (id, fn) => new Map([...entries].map(([k, v]) => [k, k === id ? fn(v) : v]));
const legacyId = 'the-lab-bubble';
const dropLicense = (t) => t.replace(/^license:.*\r?\n/m, '');
check('M01', 'detects a legacy override removed from an NC-published entry', preservationProblems(mutate(legacyId, dropLicense), fixture).some((p) => p.startsWith(`${legacyId}: effective`)));
check('M02', 'detects an unsupported license value injected', preservationProblems(mutate(legacyId, (t) => t.replace(/^license:.*$/m, "license: 'cc-by-sa-4.0'")), fixture).some((p) => p.includes('Unsupported license')));
check('M03', 'detects a scholarly contradiction injected', preservationProblems(mutate('cybernetics-structural-science', (t) => t.replace(/^category:.*$/m, (m) => `${m}\nlicense: 'cc-by-nc-4.0'`)), fixture).some((p) => p.includes('contradicts')));
check('M04', 'detects a new entry with no reviewed fixture row', preservationProblems(new Map([...entries, ['zz-new-entry', '---\ntitle: x\n---\n']]), fixture).some((p) => p.startsWith('zz-new-entry')));
check('M05', 'a new fixture-recorded entry with no override resolves to CC BY 4.0 (default control)', preservationProblems(new Map([['the-latency-trap', entries.get('the-latency-trap')]]), { entries: fixture.entries.filter((e) => e.id === 'the-latency-trap') }).length === 0 && !/^license:/m.test(entries.get('the-latency-trap')));
check('M06', 'control: the unmutated sources pass the same check', preservationProblems(entries, fixture).length === 0);

// ---- report ------------------------------------------------------------------------
for (const r of results) console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.id.padEnd(4)} ${r.name}${r.note && !r.ok ? `  [${r.note}]` : ''}`);
const bad = results.filter((r) => !r.ok);
console.log(`\ntest-license-resolution: ${results.length} checks; ${bad.length} failed`);
process.exit(bad.length ? 1 : 0);

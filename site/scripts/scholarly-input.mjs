import { createHash } from 'node:crypto';
import { readFileSync, lstatSync, realpathSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const segment = (value) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const digest = /^[a-f0-9]{64}$/;
const gitHash = /^[a-f0-9]{40}$/;
const doiUrl = /^https:\/\/doi\.org\/10\.\d{4,}\/[^\s?#]+$/;

export function regularUnder(root, path) {
	const resolved = resolve(root, path);
	const rel = relative(root, resolved);
	if (!rel || rel.startsWith('..') || isAbsolute(rel) || realpathSync(resolved) !== resolved || !lstatSync(resolved).isFile()) {
		throw new Error(`Unsafe or missing regular file: ${path}`);
	}
	return resolved;
}

function indexOnce(text, value) {
	if (typeof value !== 'string' || !value || value.length > 2000) throw new Error('Missing or invalid projection boundary');
	const index = text.indexOf(value);
	if (index < 0 || text.indexOf(value, index + value.length) >= 0) throw new Error('Missing or ambiguous projection boundary');
	return index;
}

export function projectInput(bytes, input, date) {
	const { source, identity, projection, slug, category } = input;
	if (!source || !identity || !projection || !segment(slug) || !segment(category) ||
		!gitHash.test(source.commit) || !gitHash.test(source.blob) || !digest.test(source.sha256) ||
		typeof source.path !== 'string' || !source.path || typeof source.repository !== 'string' || !source.repository) {
		throw new Error('Incomplete scholarly input or source pin');
	}
	const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
	if (blob !== source.blob || sha256(bytes) !== source.sha256) throw new Error('Scholarly input bytes differ from source pin');
	if (!doiUrl.test(identity.conceptDoi) || !doiUrl.test(identity.versionDoi) || identity.conceptDoi === identity.versionDoi ||
		!identity.printAuthorNote?.trim()) throw new Error('Distinct DOI roles and print author note are required');
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error('Explicit valid publication test date required');
	const original = bytes.toString('utf8');
	const start = indexOnce(original, projection.start);
	const end = indexOnce(original, projection.end);
	if (start >= end || !original.endsWith(projection.footer)) throw new Error('Projection boundaries differ from the pinned source');
	let body = original.slice(start, end).trimEnd();
	if (/^##\s+About the Author\s*$/im.test(body)) throw new Error('Duplicate authored biography in scholarly projection');
	const headings = /^# (.+)\r?\n## \*(.+)\*\r?$/m.exec(original);
	const abstract = /^## Abstract\s*\n\s*([^\n]+)/m.exec(body);
	if (!headings || !abstract || !/^## Key findings\s*$/im.test(body)) throw new Error('Required manuscript structure missing');
	for (const { header, ...plan } of projection.printTables ?? []) {
		const table = indexOnce(body, header);
		if (table > 0 && body[table - 1] !== '\n') throw new Error('Expected start of table header');
		const marker = JSON.stringify(plan);
		if (marker.includes('--')) throw new Error('Invalid scholarly print table marker');
		body = body.slice(0, table) + `<!-- scholarly-print-table: ${marker} -->\n\n` + body.slice(table);
	}
	const metadata = {
		title: headings[1], subtitle: headings[2], format: 'paper', category,
		pubDate: date, description: abstract[1], excerpt: abstract[1].slice(0, 190),
		doi: identity.conceptDoi,
		scholarly: { versionDoi: identity.versionDoi, printAuthorNote: identity.printAuthorNote },
	};
	const frontmatter = Object.entries(metadata).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n');
	return `---\n${frontmatter}\n---\n\n<!-- scholarly-forward -->\n\n${body}\n`;
}

export function verifiedAssets(sourcePath, inputs = []) {
	const root = resolve(sourcePath, '..');
	const seen = new Set();
	return inputs.map(({ path, sha256: hash }) => {
		if (typeof path !== 'string' || !path || isAbsolute(path) || path.split('/').some((part) => !part || part === '.' || part === '..') ||
			seen.has(path) || !digest.test(hash)) throw new Error('Invalid scholarly asset entry');
		seen.add(path);
		const bytes = readFileSync(regularUnder(root, path));
		if (sha256(bytes) !== hash) throw new Error(`Scholarly asset digest mismatch: ${path}`);
		return { path, bytes };
	});
}

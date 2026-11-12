// T29.4 owner/Executor verification kit — shared helpers. node: built-ins only.
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const loadJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
export const loadPins = (path = join(HERE, 'pins.json')) => loadJson(path);

/** Parse the inventory TSV (header: path, bytes, sha256) into records. */
export function readInventory(path) {
	const [header, ...rows] = readFileSync(path, 'utf8').split('\n').filter(Boolean);
	if (header !== 'path\tbytes\tsha256') throw new Error(`Unexpected inventory header: ${header}`);
	return rows.map((row) => {
		const [p, bytes, hash] = row.split('\t');
		return { path: p, bytes: Number(bytes), sha256: hash };
	});
}

/** Bytewise (UTF-8) comparison of relative paths — never the hash, never locale order. */
export const byPath = (a, b) => Buffer.compare(Buffer.from(a.path, 'utf8'), Buffer.from(b.path, 'utf8'));

/**
 * Directory digest: sort the records by relative path (bytewise), render one
 * `<sha256><two spaces><relative path>\n` line per record in that order, and hash the text.
 */
export function inventoryDigest(records) {
	return sha256(Buffer.from([...records].sort(byPath).map((r) => `${r.sha256}  ${r.path}\n`).join(''), 'utf8'));
}

/** Every regular file under `root` (forward-slash relative paths); throws on symlinks and special files. */
export function walkFiles(root) {
	const out = [];
	const visit = (dir) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const abs = join(dir, entry.name);
			const st = lstatSync(abs);
			if (st.isSymbolicLink()) throw new Error(`symlink in tree: ${relative(root, abs)}`);
			if (st.isDirectory()) visit(abs);
			else if (st.isFile()) out.push({ path: relative(root, abs).split(sep).join('/'), abs, bytes: st.size });
			else throw new Error(`special file in tree: ${relative(root, abs)}`);
		}
	};
	visit(root);
	return out;
}

export const arg = (argv, name, fallback) => {
	const i = argv.indexOf(name);
	return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : fallback;
};

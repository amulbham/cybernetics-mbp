// T29.4 owner/Executor verification kit — shared helpers. node: built-ins only (Node 22 or later).
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32 } from 'node:zlib';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

/** Decode a text file that may carry a UTF-8 BOM or be UTF-16 (PowerShell 5.1 `Out-File` default). */
export function readTextLoose(path) {
	const b = readFileSync(path);
	if (b[0] === 0xff && b[1] === 0xfe) return b.subarray(2).toString('utf16le');
	if (b[0] === 0xfe && b[1] === 0xff) return Buffer.from(b.subarray(2)).swap16().toString('utf16le');
	return (b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf ? b.subarray(3) : b).toString('utf8');
}
export const loadJson = (path) => JSON.parse(readTextLoose(path));
export const loadPins = (path = join(HERE, 'pins.json')) => loadJson(path);

/** Parse the inventory TSV (header: path, bytes, sha256); tolerates CRLF checkouts. */
export function readInventory(path) {
	const [header, ...rows] = readTextLoose(path).split(/\r?\n/).filter(Boolean);
	if (header !== 'path\tbytes\tsha256') throw new Error(`Unexpected inventory header: ${JSON.stringify(header)}`);
	const seen = new Set();
	return rows.map((row) => {
		const [p, bytes, hash] = row.split('\t');
		if (!p || !/^[0-9a-f]{64}$/.test(hash ?? '') || seen.has(p)) throw new Error(`Bad or duplicate inventory row: ${JSON.stringify(row)}`);
		seen.add(p);
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

/**
 * The scripts that decide PASS are bound to the owner's GO by the digest of `SHA256SUMS`, which lists the
 * runtime files. Every CLI calls this first, prints the digest, and refuses to run if a listed file differs.
 */
/** Hash text files after CRLF -> LF so a Windows (autocrlf) checkout verifies exactly like the sealed LF files. */
const lf = (buf) => Buffer.from(buf.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
export const sha256Lf = (buf) => sha256(lf(buf));

export function kitIntegrity(dir = HERE) {
	const sums = join(dir, 'SHA256SUMS');
	if (!existsSync(sums)) return { ok: false, digest: null, problems: ['SHA256SUMS is missing'] };
	const text = lf(readFileSync(sums)).toString('latin1');
	const problems = [];
	for (const line of text.split('\n').filter(Boolean)) {
		const [hash, name] = [line.slice(0, 64), line.slice(66)];
		if (!existsSync(join(dir, name))) problems.push(`missing kit file ${name}`);
		else if (sha256Lf(readFileSync(join(dir, name))) !== hash) problems.push(`kit file differs from SHA256SUMS: ${name}`);
	}
	return { ok: problems.length === 0, digest: sha256(Buffer.from(text, 'latin1')), problems };
}
/** Node 22.2 or later (zlib.crc32); then the kit files must match SHA256SUMS. Prints the digest the GO pins. */
export function requireKitIntegrity(label) {
	const [major, minor] = process.versions.node.split('.').map(Number);
	if (major < 22 || (major === 22 && minor < 2)) {
		console.log(`${label}: Node ${process.versions.node} is too old; Node 22.2 or later is required`);
		process.exit(2);
	}
	const k = kitIntegrity();
	console.log(`${label}: kit digest (SHA256SUMS) ${k.digest ?? 'none'} — compare with the value in the GO`);
	if (!k.ok) {
		for (const p of k.problems) console.log(`  FAIL ${p}`);
		console.log(`${label}: the kit has been modified — stop`);
		process.exit(2);
	}
}

/** The TSV that a run trusts must be the pinned inventory: its path-sorted digest must equal the pin. */
export function requireInventoryMatchesPins(label, inventory, pins) {
	const d = inventoryDigest(inventory);
	if (d !== pins.inventory.digest) {
		console.log(`${label}: the inventory digest ${d} differs from the pinned ${pins.inventory.digest} — stop`);
		process.exit(2);
	}
}

/** Validate a PNG's chunk structure and CRCs (IHDR first, at least one IDAT, IEND last). */
export function pngInfo(bytes) {
	const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
	if (bytes.length < 57 || !bytes.subarray(0, 8).equals(SIG)) return null;
	let pos = 8;
	let info = null;
	let idat = 0;
	let ended = false;
	for (let i = 0; pos + 12 <= bytes.length; i++) {
		const len = bytes.readUInt32BE(pos);
		const type = bytes.subarray(pos + 4, pos + 8).toString('latin1');
		if (pos + 12 + len > bytes.length) return null;
		if (crc32(bytes.subarray(pos + 4, pos + 8 + len)) !== bytes.readUInt32BE(pos + 8 + len)) return null;
		if (i === 0) {
			if (type !== 'IHDR' || len !== 13) return null;
			info = { width: bytes.readUInt32BE(pos + 8), height: bytes.readUInt32BE(pos + 12) };
		}
		if (type === 'IDAT') idat++;
		pos += 12 + len;
		if (type === 'IEND') {
			ended = true;
			break;
		}
	}
	return info && idat > 0 && ended && pos === bytes.length ? info : null;
}

export const hostRes = (project) => ({
	immutable: new RegExp(`^https://[0-9a-f]{8}\\.${project.replace(/\./g, '\\.')}\\.pages\\.dev$`),
	alias: (label) => new RegExp(`^https://${label.replace(/\./g, '\\.')}\\.${project.replace(/\./g, '\\.')}\\.pages\\.dev$`),
	production: `https://${project}.pages.dev`,
});

// T29.4 — owner-run authenticated verification of a hosted preview, plus the capture index.
//
// Run by the owner on his own machine after signing in to the preview in his browser. The Access session
// cookie value is read from the environment variable CF_AUTHORIZATION and is never printed, logged or
// written; use a short session and never paste it into chat or a file.
//
// 1. Downloads EVERY inventory file from the immutable preview origin except the control files listed in
//    pins.hostedExcludedFromDownloadChecks (`_headers`, which Pages applies but does not serve), requires
//    HTTP 200 (a 3xx means the session is invalid), and compares:
//      - all 7 PDFs and every other non-HTML file BYTE-EXACT with the pinned SHA-256 (six historical pairs
//        and the candidate PDF are also checked by name against the pins, independent of the TSV);
//      - HTML files informationally (Cloudflare may rewrite markup such as e-mail obfuscation);
//      - the article page for required markers (noindex meta, candidate label, relative PDF link; no
//        canonical, JSON-LD or Highwire tags).
// 2. Checks the hosted effect of `_headers`: every response carries X-Robots-Tag exactly
//    "noindex, nofollow" (Cloudflare's own default is the shorter "noindex", so the exact value shows the
//    `_headers` rule applied).
// 3. Optionally repeats the seven PDF downloads on the branch alias (--alias).
// 4. With --captures <dir> builds capture-index.json that ties the owner's screenshots to the immutable
//    preview URL, the candidate PDF SHA-256 and this run's report.
//
// Usage: CF_AUTHORIZATION=<cookie value> node verify-hosted-preview.mjs --origin https://<hash>.<project>.pages.dev
//          [--alias https://<label>.<project>.pages.dev] [--out report.json] [--captures <dir>]
// Exit: 0 pass; 1 a check failed; 2 bad usage or no session.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { HERE, arg, loadPins, readInventory, sha256 } from './kit-common.mjs';

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

async function get(url, token) {
	const res = await fetch(url, { redirect: 'manual', cache: 'no-store', headers: { cookie: `CF_Authorization=${token}`, 'user-agent': 'T29.4-owner-verification', accept: '*/*' }, signal: AbortSignal.timeout(60000) });
	return { status: res.status, headers: res.headers, body: Buffer.from(await res.arrayBuffer()) };
}

export async function verifyHosted({ origin, alias, token, pins, inventory }) {
	const failures = [];
	const rows = [];
	const excluded = new Set(pins.hostedExcludedFromDownloadChecks);
	const robots = new Set();
	const historical = pins.historical ?? [];
	const pdfPaths = new Set([...historical.map((h) => h.path), pins.candidate.pdfPath]);
	const isHtml = (p) => /\.html?$/i.test(p);
	for (const rec of inventory) {
		if (excluded.has(rec.path)) {
			rows.push({ path: rec.path, kind: 'control-file', checked: false });
			continue;
		}
		// An HTML page is requested by its path; index.html is requested as its directory URL.
		const urlPath = rec.path === 'index.html' ? '/' : rec.path.endsWith('/index.html') ? `/${rec.path.slice(0, -'index.html'.length)}` : `/${rec.path}`;
		const kind = pdfPaths.has(rec.path) ? 'pdf' : isHtml(rec.path) ? 'html' : 'asset';
		let r;
		try {
			r = await get(new URL(urlPath, origin).toString(), token);
		} catch (err) {
			failures.push(`${rec.path}: request failed (${err.message})`);
			rows.push({ path: rec.path, kind, status: null });
			continue;
		}
		const row = { path: rec.path, kind, status: r.status, bytes: r.body.length, sha256: sha256(r.body), expectedSha256: rec.sha256, match: sha256(r.body) === rec.sha256 };
		rows.push(row);
		robots.add(r.headers.get('x-robots-tag') ?? '(none)');
		if (r.status >= 300 && r.status < 400) {
			failures.push(`${rec.path}: redirect ${r.status} — the Access session is not valid`);
			continue;
		}
		if (rec.path === '404.html') continue; // served as an error page; informational only
		if (r.status !== 200) {
			failures.push(`${rec.path}: HTTP ${r.status}`);
			continue;
		}
		if (kind === 'pdf') {
			if (!(r.headers.get('content-type') ?? '').includes('application/pdf')) failures.push(`${rec.path}: content-type ${r.headers.get('content-type')}`);
			if (!row.match) failures.push(`${rec.path}: SHA-256 ${row.sha256} != pinned ${rec.sha256}`);
		} else if (kind === 'asset' && !row.match) failures.push(`${rec.path}: SHA-256 differs from the inventory`);
		if (r.headers.get('x-robots-tag') !== pins.hostedRobotsHeader) failures.push(`${rec.path}: X-Robots-Tag is ${JSON.stringify(r.headers.get('x-robots-tag'))}, expected "${pins.hostedRobotsHeader}"`);
		if (rec.path === `${pins.route.slice(1)}index.html`) {
			const html = r.body.toString('utf8');
			const need = pins.hostedArticleMarkers?.required ?? ['<meta name="robots" content="noindex, nofollow">', 'Candidate specimen', 'Download candidate PDF'];
			const forbid = pins.hostedArticleMarkers?.forbidden ?? ['rel="canonical"', 'application/ld+json', 'name="citation_'];
			for (const s of need) if (!html.includes(s)) failures.push(`article page lacks required text: ${s}`);
			for (const s of forbid) if (html.includes(s)) failures.push(`article page contains forbidden text: ${s}`);
			row.markers = { required: need.map((s) => html.includes(s)), forbidden: forbid.map((s) => html.includes(s)) };
		}
	}
	// The seven PDFs by name, independent of the inventory file.
	const sevenPdfs = [...historical, { path: pins.candidate.pdfPath, sha256: pins.candidate.sha256 }].map((p) => {
		const row = rows.find((r) => r.path === p.path);
		return { path: p.path, expected: p.sha256, observed: row?.sha256 ?? null, match: row?.sha256 === p.sha256 };
	});
	for (const s of sevenPdfs) if (!s.match) failures.push(`pinned PDF mismatch: ${s.path}`);
	let aliasPdfs = null;
	if (alias) {
		aliasPdfs = [];
		for (const p of sevenPdfs) {
			try {
				const r = await get(new URL(`/${p.path}`, alias).toString(), token);
				const ok = r.status === 200 && sha256(r.body) === p.expected;
				aliasPdfs.push({ path: p.path, status: r.status, match: ok });
				if (!ok) failures.push(`alias PDF mismatch: ${p.path} (status ${r.status})`);
			} catch (err) {
				aliasPdfs.push({ path: p.path, status: null, match: false });
				failures.push(`alias PDF request failed: ${p.path} (${err.message})`);
			}
		}
	}
	return { origin, alias: alias ?? null, when: new Date().toISOString(), candidatePdfSha256: pins.candidate.sha256, inventoryDigest: pins.inventory.digest, files: rows.length, sevenPdfs, aliasPdfs, xRobotsTagValues: [...robots].sort(), failures, rows };
}

const pngSize = (bytes) => {
	if (bytes.length < 24 || !bytes.subarray(0, 8).equals(PNG) || bytes.subarray(12, 16).toString('latin1') !== 'IHDR') return null;
	return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
};

/** Build and validate the capture index (desktop-NNN.png / mobile-NNN.png plus page-metrics-*.json). */
export function buildCaptureIndex({ dir, origin, pins, reportSha256 }) {
	const problems = [];
	const kinds = {};
	const files = readdirSync(dir);
	for (const kind of ['desktop', 'mobile']) {
		let metrics;
		try {
			metrics = JSON.parse(readFileSync(join(dir, `page-metrics-${kind}.json`), 'utf8'));
		} catch {
			problems.push(`${kind}: page-metrics-${kind}.json is missing or not JSON`);
			continue;
		}
		const dpr = metrics.devicePixelRatio || 1;
		const url = new URL(metrics.url);
		if (url.origin !== new URL(origin).origin || url.pathname !== pins.route) problems.push(`${kind}: metrics URL ${metrics.url} is not the immutable article URL ${origin}${pins.route}`);
		if (kind === 'desktop' ? metrics.innerWidth < 1200 : metrics.innerWidth > 480) problems.push(`${kind}: viewport width ${metrics.innerWidth} is not a ${kind} width`);
		const names = files.filter((f) => new RegExp(`^${kind}-\\d{3}\\.png$`).test(f)).sort();
		names.forEach((n, i) => { if (n !== `${kind}-${String(i + 1).padStart(3, '0')}.png`) problems.push(`${kind}: numbering is not contiguous at ${n}`); });
		let total = 0;
		const list = names.map((n) => {
			const bytes = readFileSync(join(dir, n));
			const size = pngSize(bytes);
			if (!size) problems.push(`${n}: not a PNG`);
			else {
				if (size.width !== Math.round(metrics.innerWidth * dpr)) problems.push(`${n}: width ${size.width} != innerWidth*dpr ${Math.round(metrics.innerWidth * dpr)}`);
				if (size.height > 16384) problems.push(`${n}: height ${size.height} exceeds the 16384 px capture limit`);
				total += size.height;
			}
			return { file: n, sha256: sha256(bytes), bytes: bytes.length, ...(size ?? {}) };
		});
		const need = Math.ceil(metrics.scrollHeight * dpr * 0.99);
		if (!names.length) problems.push(`${kind}: no ${kind}-NNN.png captures`);
		else if (total < need) problems.push(`${kind}: captured height ${total}px is less than the page height ${metrics.scrollHeight * dpr}px (needs >= ${need})`);
		kinds[kind] = { metrics, capturedHeight: total, files: list };
	}
	return { problems, index: { origin, articleUrl: `${origin}${pins.route}`, candidatePdfSha256: pins.candidate.sha256, correctionCommit: pins.correctionCommit, inventoryDigest: pins.inventory.digest, verificationReportSha256: reportSha256 ?? null, builtAt: new Date().toISOString(), captures: kinds } };
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
	const argv = process.argv.slice(2);
	const origin = arg(argv, '--origin');
	const token = process.env.CF_AUTHORIZATION;
	if (!origin || (!token && !arg(argv, '--captures-only'))) {
		console.error('usage: CF_AUTHORIZATION=<cookie> node verify-hosted-preview.mjs --origin <immutable origin> [--alias <alias origin>] [--out report.json] [--captures <dir>]');
		process.exit(2);
	}
	const pins = loadPins(arg(argv, '--pins', join(HERE, 'pins.json')));
	const inventory = readInventory(resolve(arg(argv, '--inventory') ?? join(HERE, pins.inventory.file)));
	let reportSha256 = null;
	let failed = false;
	if (!arg(argv, '--captures-only')) {
		const report = await verifyHosted({ origin, alias: arg(argv, '--alias'), token, pins, inventory });
		const out = arg(argv, '--out', 'hosted-verification-report.json');
		const text = JSON.stringify(report, null, 1) + '\n';
		writeFileSync(out, text);
		reportSha256 = sha256(Buffer.from(text));
		console.log(`origin ${origin}: ${report.files} inventory files requested; X-Robots-Tag values: ${JSON.stringify(report.xRobotsTagValues)}`);
		for (const s of report.sevenPdfs) console.log(`${s.match ? 'MATCH' : 'DIFF '} ${s.observed ?? 'none'} ${s.path}`);
		for (const f of report.failures.slice(0, 25)) console.log(`FAIL ${f}`);
		console.log(`report ${out} sha256 ${reportSha256}`);
		failed = report.failures.length > 0;
	}
	if (arg(argv, '--captures')) {
		const { problems, index } = buildCaptureIndex({ dir: resolve(arg(argv, '--captures')), origin, pins, reportSha256 });
		const idx = join(resolve(arg(argv, '--captures')), 'capture-index.json');
		writeFileSync(idx, JSON.stringify(index, null, 1) + '\n');
		for (const p of problems) console.log(`CAPTURE FAIL ${p}`);
		console.log(`capture index ${idx}: desktop ${index.captures.desktop?.files.length ?? 0} files, mobile ${index.captures.mobile?.files.length ?? 0} files`);
		if (problems.length) failed = true;
	}
	console.log(failed ? 'verify-hosted-preview: FAILED' : 'verify-hosted-preview: PASS');
	process.exit(failed ? 1 : 0);
}

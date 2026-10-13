/**
 * Rehype plugin: wraps every <table> in a scrollable <div class="table-container"
 * tabindex="0">, so wide data tables (comparison matrices, protocol tables) can
 * scroll horizontally on narrow viewports instead of breaking
 * --content-width-prose. `tabindex="0"` makes the scroll container itself
 * keyboard-focusable/scrollable, since a <table> has no native scroll affordance.
 *
 * Walks the whole tree (not just top-level children, unlike rehype-references)
 * because tables can appear inside list items or blockquotes, not just at the
 * document root.
 *
 * Explicit author opt-in (T20.1): a standalone Markdown HTML comment
 *
 *   <!-- table-layout: responsive-records -->
 *
 * on the line before a table (one blank line between) switches *that table
 * only* to a responsive layout. The marker is consumed; the table keeps its
 * authored semantics and is wrapped in
 * `.table-container[data-table-layout="responsive-records"]` (no scroll
 * affordance — the layout wraps instead), followed inside the wrapper by a
 * generated `.table-records` list: one record per body row, every cell
 * labelled by its column header, built from the same table AST. CSS shows
 * exactly one of the two projections per breakpoint (`display: none` removes
 * the other from the accessibility tree); print always shows the table. The
 * generated records are `data-pagefind-ignore`, so search indexes the
 * authored table once. Unmarked tables take the original path unchanged.
 *
 * Fails closed (throws — `scripts/validate-research-links.mjs` runs this same
 * pipeline outside Astro's swallow-and-continue glob loader, so a throw fails
 * the build): an unknown layout value, a marker not immediately followed by a
 * table (orphan or duplicate), or an unsupported table shape (not exactly one
 * header row, empty or duplicate column headers, ragged rows, rowspan/colspan,
 * nested table).
 */
const MARKER_RE = /^<!--\s*table-layout:\s*([A-Za-z0-9-]*)\s*-->$/;
const LAYOUTS = new Set(['responsive-records']);

export function rehypeTableWrap() {
	return (tree) => {
		wrap(tree);
	};
}

function isWhitespaceText(node) {
	return node.type === 'text' && !node.value.trim();
}

/** Layout name if `node` is a table-layout marker comment, else null. Throws on an unknown layout. */
function markerLayout(node) {
	let source = null;
	if (node.type === 'raw' && typeof node.value === 'string') source = node.value.trim();
	else if (node.type === 'comment') source = `<!--${node.value}-->`.trim();
	if (source === null) return null;
	if (!/^<!--\s*table-layout:/.test(source)) return null;
	const match = MARKER_RE.exec(source);
	if (!match || !LAYOUTS.has(match[1])) {
		throw new Error(`rehype-table-wrap: unsupported table-layout marker ${JSON.stringify(source)}`);
	}
	return match[1];
}

function getText(node) {
	if (node.type === 'text') return node.value;
	if (Array.isArray(node.children)) return node.children.map(getText).join('');
	return '';
}

function elementChildren(node, tagName) {
	return (node.children ?? []).filter((c) => c.type === 'element' && (!tagName || c.tagName === tagName));
}

function hasTable(node) {
	return (node.children ?? []).some((c) => (c.type === 'element' && c.tagName === 'table') || hasTable(c));
}

function readShape(table) {
	const fail = (why) => {
		throw new Error(`rehype-table-wrap: responsive-records table is unsupported — ${why}`);
	};
	const heads = elementChildren(table, 'thead');
	const bodies = elementChildren(table, 'tbody');
	if (heads.length !== 1 || bodies.length !== 1) fail('needs exactly one <thead> and one <tbody>');
	const headRows = elementChildren(heads[0], 'tr');
	if (headRows.length !== 1) fail('needs exactly one header row');
	const headerCells = elementChildren(headRows[0]);
	if (!headerCells.length || headerCells.some((c) => c.tagName !== 'th')) fail('header row must contain only <th>');
	const labels = headerCells.map((c) => getText(c).replace(/\s+/g, ' ').trim());
	if (labels.some((l) => !l)) fail('empty column header');
	if (new Set(labels.map((l) => l.toLowerCase())).size !== labels.length) fail('duplicate column headers');
	const rows = elementChildren(bodies[0], 'tr');
	if (!rows.length) fail('no body rows');
	const cells = rows.map((row) => {
		const tds = elementChildren(row);
		if (tds.length !== labels.length || tds.some((c) => c.tagName !== 'td')) fail('ragged body row');
		return tds;
	});
	for (const cell of [...headerCells, ...cells.flat()]) {
		if (cell.properties && ('colSpan' in cell.properties || 'rowSpan' in cell.properties)) fail('rowspan/colspan');
		if (hasTable(cell)) fail('nested table');
	}
	return { labels, cells };
}

function clone(node) {
	if (node.type !== 'element') return { ...node };
	const properties = { ...(node.properties ?? {}) };
	delete properties.id; // the canonical table owns every id; generated records must never duplicate one
	return { ...node, properties, children: (node.children ?? []).map(clone) };
}

function el(tagName, properties, children) {
	return { type: 'element', tagName, properties: properties ?? {}, children: children ?? [] };
}

function buildRecords({ labels, cells }) {
	return el(
		'ul',
		{ className: ['table-records'], dataPagefindIgnore: '' },
		cells.map((row) =>
			el('li', { className: ['table-record'] }, [
				el(
					'dl',
					{},
					row.flatMap((cell, i) => [
						el('dt', {}, [{ type: 'text', value: labels[i] }]),
						el('dd', {}, cell.children.map(clone)),
					]),
				),
			]),
		),
	);
}

function wrap(node) {
	if (!node.children) return;
	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i];

		const layout = markerLayout(child);
		if (layout) {
			let j = i + 1;
			while (j < node.children.length && isWhitespaceText(node.children[j])) j++;
			const table = node.children[j];
			if (!table || table.type !== 'element' || table.tagName !== 'table') {
				throw new Error('rehype-table-wrap: a table-layout marker must be immediately followed by a table (orphan or duplicate marker)');
			}
			const shape = readShape(table);
			node.children.splice(i, j - i + 1, {
				type: 'element',
				tagName: 'div',
				properties: { className: ['table-container'], dataTableLayout: layout },
				children: [table, buildRecords(shape)],
			});
			continue;
		}

		if (child.type === 'element' && child.tagName === 'table') {
			node.children[i] = {
				type: 'element',
				tagName: 'div',
				properties: { className: ['table-container'], tabIndex: 0 },
				children: [child],
			};
		} else {
			wrap(child);
		}
	}
}

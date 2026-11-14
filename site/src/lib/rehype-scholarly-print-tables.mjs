import { scholarlyComment } from './scholarly-markers.mjs';

const prefix = 'scholarly-print-table:';
const element = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
const elements = (node, tag) => node.children.filter((child) => child.type === 'element' && child.tagName === tag);
const text = (node) => node.type === 'text' ? node.value : (node.children ?? []).map(text).join('');

function printPanels(table, plan) {
	const heads = elements(table, 'thead');
	const bodies = elements(table, 'tbody');
	const headerRows = heads.length === 1 ? elements(heads[0], 'tr') : [];
	const headers = headerRows.length === 1 ? elements(headerRows[0], 'th') : [];
	const rows = bodies.length === 1 ? elements(bodies[0], 'tr').map((row) => elements(row, 'td')) : [];
	if (!headers.length || !rows.length || rows.some((row) => row.length !== headers.length) ||
		JSON.stringify(headers.map(text)) !== JSON.stringify(plan.headers)) {
		throw new Error('Scholarly print table does not match its pinned columns');
	}
	const panels = plan.panels;
	const keys = plan.keys;
	const projected = panels.flatMap((panel) => panel.columns.filter((column) => !keys.includes(column)));
	const allColumns = [...keys, ...projected].sort((a, b) => a - b);
	if (panels.length < 2 || allColumns.length !== headers.length || allColumns.some((column, index) => column !== index)) {
		throw new Error('Scholarly print panels must preserve every source column once, except repeated keys');
	}
	return panels.map(({ caption, columns, widths }, index) => {
		if (!caption || keys.some((key) => !columns.includes(key)) || columns.length !== new Set(columns).size ||
			widths.length !== columns.length || widths.some((width) => !Number.isFinite(width) || width <= 0) ||
			widths.reduce((sum, width) => sum + width, 0) !== 100) {
			throw new Error('Invalid scholarly print panel');
		}
		const head = columns.map((column) => element('th', { scope: 'col' }, structuredClone(headers[column].children)));
		const body = rows.map((row) => element('tr', {}, columns.map((column) => structuredClone(row[column]))));
		return element('div', { className: ['table-container', 'scholarly-print-only', 'scholarly-print-panel'], dataPanel: index + 1 }, [
			element('table', {}, [
				element('caption', {}, [{ type: 'text', value: caption }]),
				element('colgroup', {}, widths.map((width) => element('col', { style: `width:${width}%` }, []))),
				element('thead', {}, [element('tr', {}, head)]),
				element('tbody', {}, body),
			]),
		]);
	});
}

export function rehypeScholarlyPrintTables() {
	return (tree) => {
		for (let i = 0; i < tree.children.length; i++) {
			const marker = tree.children[i];
			const comment = scholarlyComment(marker);
			if (!comment?.startsWith(prefix)) continue;
			const plan = JSON.parse(comment.slice(prefix.length));
			let next = i + 1;
			while (tree.children[next]?.type === 'text' && !tree.children[next].value.trim()) next++;
			const wrapper = tree.children[next];
			const table = wrapper?.properties?.className?.includes('table-container') && elements(wrapper, 'table')[0];
			if (!table) throw new Error('Scholarly print marker must precede a table');
			for (const header of elements(elements(table, 'thead')[0], 'tr').flatMap((row) => elements(row, 'th'))) header.properties.scope = 'col';
			wrapper.properties.className.push('scholarly-screen-table');
			const panels = printPanels(table, plan);
			tree.children.splice(next + 1, 0, ...panels);
			tree.children.splice(i, 1);
			i = next + panels.length - 1;
		}
		tree.children = tree.children.filter((node) => scholarlyComment(node) !== 'scholarly-forward');
	};
}

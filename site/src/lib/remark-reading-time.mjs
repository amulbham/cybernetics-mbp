function countWords(node) {
	let words = 0;
	if ((node.type === 'text' || node.type === 'inlineCode') && typeof node.value === 'string') {
		words += (node.value.match(/\S+/g) || []).length;
	}
	if (Array.isArray(node.children)) {
		for (const child of node.children) words += countWords(child);
	}
	return words;
}

const WORDS_PER_MINUTE = 200;

/** Remark plugin: sets wordCount/minutesRead on remarkPluginFrontmatter for every content collection entry. */
export function remarkReadingTime() {
	return (tree, file) => {
		const wordCount = countWords(tree);
		file.data.astro.frontmatter.wordCount = wordCount;
		file.data.astro.frontmatter.minutesRead = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
	};
}

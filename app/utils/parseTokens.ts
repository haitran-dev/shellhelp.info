export function parseToSimpleTokens(command: string) {
	const tokens: Token[] = [];

	const splits = command.match(/("(?:[^"\\]|\\.)*"|\S+)/g) ?? [];

	if (!splits.length) return [];

	let index = 0;
	for (const split of splits) {
		const token: Token = {
			indices: [index, index + split.length],
			value: split,
		};

		tokens.push(token);

		index += split.length + 1;
	}

	return tokens;
}

export function parseToSpecTokens({ spec, tokens }: { spec: any; tokens: Token[] }) {
	let specTokens: any[] = [];

	return specTokens;
}

import { InvalidTokenError } from './error';

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

/**
 * Parse simple tokens into detailed tokens with extra information from Fig's spec.
 *
 * @param spec Fig's spec
 * @param tokens Simple tokens from `parseToSimpleTokens`
 */

export function parseToSpecTokens({ spec, tokens }: { spec: Fig.Subcommand; tokens: Token[] }) {
	let specTokens: SpecToken[] = [];

	const command = tokens[0]; // cms is always first of Fig's spec

	specTokens.push({
		...spec,
		...command,
		type: 'subcommand',
	});

	for (let i = 1; i < tokens.length; i++) {
		const token: Token = tokens[i];

		if (token.value.indexOf('-') > -1) {
			// is option
			const option = spec.options?.find(({ name }) =>
				Array.isArray(name) ? name.indexOf(token.value) > -1 : name === token.value
			);

			if (!option) throw new InvalidTokenError(token, 'unknown option');

			specTokens.push({
				...option,
				...token,
				type: 'option',
			});
		} else if (token.value.indexOf('-') < 0) {
			// subcommand or argument
			const subcommand = spec.subcommands?.find((cmd) =>
				Array.isArray(cmd.name)
					? cmd.name.indexOf(token.value) > -1
					: cmd.name === token.value
			);

			if (subcommand) {
				specTokens.push(
					...parseToSpecTokens({ spec: subcommand, tokens: tokens.slice(i) })
				);
				i = tokens.length;
			} else {
				// argument
				specTokens.push({
					...spec.args,
					...token,
					type: 'argument',
				});
			}
		} else {
			throw new InvalidTokenError(token, 'is neither a valid subcommand, option');
		}
	}

	return specTokens;
}

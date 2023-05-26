import { SpecToken, Token } from 'types';
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
	console.log({ spec });

	const command = tokens[0]; // cms is always first of Fig's spec

	specTokens.push({
		...spec,
		...command,
		type: 'subcommand',
	});

	const restTokens: Token[] = tokens.slice(1);

	const parseArgs = (spec: any, tokens: Token[]) => {
		for (const token of tokens) {
			specTokens.push({
				...spec.args,
				...token,
				type: 'argument',
			});
		}
	};

	for (let i = 0; i < restTokens.length; i++) {
		const token: Token = restTokens[i];

		if (token.value.indexOf('-') > -1) {
			// is option
			const option = spec.options?.find(({ name }) =>
				Array.isArray(name) ? name.indexOf(token.value) > -1 : name === token.value
			);

			if (!option) {
				specTokens.push({
					error: new InvalidTokenError(token, `unknown option ar of ${command.value}`),
					...token,
					type: 'option',
				});
			} else {
				specTokens.push({
					...option,
					...token,
					type: 'option',
				});
				parseArgs(option, restTokens.slice(i + 1));
				i = restTokens.length;
			}
		} else if (token.value.indexOf('-') < 0) {
			// subcommand or argument
			const subcommand = spec.subcommands?.find((cmd) =>
				Array.isArray(cmd.name)
					? cmd.name.indexOf(token.value) > -1
					: cmd.name === token.value
			);
			if (subcommand) {
				specTokens.push(...parseToSpecTokens({ spec: subcommand, tokens: restTokens }));
				i = restTokens.length;
			} else {
				// argument
				parseArgs(spec, [token]);
			}
		} else {
			specTokens.push({
				...token,
				error: new InvalidTokenError(token, 'is neither a valid subcommand, or argument'),
				type: 'unknown',
			});
		}
	}

	return specTokens;
}

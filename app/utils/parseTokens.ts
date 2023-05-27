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

	const parseArgs = (
		spec: Fig.Subcommand,
		tokens: Token[],
		callback: (argsLength: number) => void
	) => {
		for (const token of tokens) {
			specTokens.push({
				...spec.args,
				...token,
				type: 'argument',
			});
		}
	};

	const parseOptions = (spec: Fig.Subcommand, tokens: Token[]) => {
		const [option, ...rest] = tokens;

		if (option.value.startsWith('--')) {
			// long form
		}

		// short form
		const tokenValue = option.value.substring(1); // -abc => abc
		for (let i = 0; i < tokenValue.length; i++) {
			const char = tokenValue[i];
			const optionName = '-' + char; // split option -abc => -a -b -c
			const subOption = spec.options?.find(({ name }) =>
				Array.isArray(name) ? name.indexOf(optionName) > -1 : name === optionName
			);

			if (subOption) {
				specTokens.push({
					...subOption,
					...option,
					type: 'option',
				});
			} else {
				specTokens.push({
					error: new InvalidTokenError(option, `unknown option ${optionName}`),
					...option,
					type: 'option',
				});
			}
		}

		return;
	};

	let needCheckRestArgs = true;

	for (let i = 0; i < restTokens.length; i++) {
		const token: Token = restTokens[i];

		console.log({ restToken: restTokens[i] });

		if (token.value.indexOf('-') > -1) {
			// is option
			const option = spec.options?.find(({ name }) =>
				Array.isArray(name) ? name.indexOf(token.value) > -1 : name === token.value
			);

			if (!option) {
				specTokens.push({
					error: new InvalidTokenError(token, `unknown option of ${command.value}`),
					...token,
					type: 'option',
				});
			} else {
				specTokens.push({
					...option,
					...token,
					type: 'option',
				});

				parseArgs(option, restTokens.slice(i + 1), (argsLength) => {
					i += 1 + argsLength; // check rest tokens excludes arguments
					needCheckRestArgs = false;
				});
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
				// argument(s) (single or plural) or not

				if (!spec.args) {
					specTokens.push({
						...token,
						error: new InvalidTokenError(
							token,
							'is neither a valid subcommand, or argument'
						),
						type: 'unknown',
					});
				}

				parseArgs(spec, restTokens.slice(i), (argsLength) => {
					i += argsLength;
					needCheckRestArgs = false;
				});
			}
		}
	}

	return specTokens;
}

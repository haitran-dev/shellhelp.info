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

export function parseToSpecTokens({
	spec,
	tokens,
}: {
	spec: Fig.Subcommand | undefined;
	tokens: Token[];
}) {
	let specTokens: SpecToken[] = [];

	if (!spec) return specTokens;

	const command = tokens[0]; // cms is always first of Fig's spec

	specTokens.push({
		...spec,
		...command,
		type: 'subcommand',
	});

	const restTokens: Token[] = tokens.slice(1);

	const pushUnknownToken = (token: Token) => {
		specTokens.push({
			...token,
			type: undefined,
			error: new InvalidTokenError(token, `is neither a valid subcommand, or argument`),
		});
	};

	let needCheckRestArgs = true;

	if (!restTokens.length) specTokens;

	for (let i = 0; i < restTokens.length; i++) {
		const token: Token = restTokens[i];

		if (token.value.startsWith('-')) {
			// is option
			const option = spec.options?.find(({ name }) =>
				Array.isArray(name) ? name.indexOf(token.value) > -1 : name === token.value
			);

			if (!option) {
				specTokens.push({
					...token,
					type: 'option',
					error: new InvalidTokenError(token, `unknown option`),
				});
			} else {
				specTokens.push({
					...option,
					...token,
					type: 'option',
				});

				if (!option.args) {
					// all rest tokens need to be option
					// const restTokensAfterOption = restTokens.slice(1);
					// for (const token of restTokensAfterOption) {
					// 	// is an another option
					// 	if (token.value.startsWith('-')) break;
					// 	pushUnknownToken(token);
					// 	i++;
					// }
				} else if (Array.isArray(option.args)) {
					const argsLength = option.args.length;

					for (let j = 0; j < argsLength; j++) {
						const token = restTokens[j].value;

						if (!token.startsWith('-')) {
							// is argument
							specTokens.push({
								...option.args[j],
								...restTokens[j],
								type: 'arg',
							});
							i += 1;
						}
					}
				} else {
					if (option.args.isVariadic) {
						// can have multiple args

						let count = 0; // count token
						for (let j = i + 1; j < restTokens.length; j++) {
							if (restTokens[j].value.startsWith('-')) break;

							count += 1;
							specTokens.push({
								...option.args,
								...restTokens[j],
								type: 'arg',
							});
						}

						i += 1 + count;
					} else {
						const nextToken = restTokens[i + 1];

						console.log({ nextToken });

						if (nextToken && !nextToken.value.startsWith('-')) {
							specTokens.push({
								...option.args,
								...nextToken,
								type: 'arg',
							});

							i = i + 1; // pass over argument
						}
					}
				}
			}
		} else {
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

				if (!spec.args || !needCheckRestArgs) {
					pushUnknownToken(token);
				} else if (Array.isArray(spec.args)) {
					const argsLength = spec.args.length;
					let count = 0;
					for (let j = 0; j < argsLength; j++) {
						const token = restTokens[j]?.value;

						if (token && !token.startsWith('-')) {
							// is an argument
							specTokens.push({
								...spec.args[j],
								...restTokens[j],
								type: 'arg',
							});

							count++;
						}
					}
					i += count - 1;
				} else {
					if (spec.args.isVariadic) {
						// can have multiple args

						let count = 0; // count token
						for (let j = i; j < restTokens.length; j++) {
							if (restTokens[j].value.startsWith('-')) break;

							count += 1;
							specTokens.push({
								...spec.args,
								...restTokens[j],
								type: 'arg',
							});
						}

						i += count - 1;
					} else {
						if (!token.value.startsWith('-')) {
							specTokens.push({
								...spec.args,
								...token,
								type: 'arg',
							});
						}

						needCheckRestArgs = false;
					}
				}
			}
		}
	}

	return specTokens;
}

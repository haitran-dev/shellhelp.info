'use client';

import React from 'react';
import AlertTriangle from 'static/icons/alert-triangle';
import SunSVG from 'static/icons/sun';
import { Icon } from './ui/icons';
import { ResizableTextarea } from './ui/textarea';
import { parseToSimpleTokens, parseToSpecTokens } from 'utils/parseTokens';
import { SpecToken, Token } from 'types';
import { InvalidTokenError } from 'utils/error';

export default function Terminal() {
	return (
		<div className='w-full max-w-[800px] h-[300px] sm:h-[450px] p-2 bg-gray-900/70 backdrop-blur-md rounded-lg shadow-xl text-white space-y-4'>
			<div className='flex h-5 justify-between items-center relative'>
				<div className='flex gap-2'>
					<span className='w-3 h-3 rounded-full bg-red-400' />
					<span className='w-3 h-3 rounded-full bg-yellow-400' />
					<span className='w-3 h-3 rounded-full bg-green-400' />
				</div>
				<div className='tracking-wider font-light absolute inset-0 flex items-center justify-center pointer-events-none select-none'>
					Terminal
				</div>
				<div className='flex gap-1'>
					<Icon isButton>
						<SunSVG />
					</Icon>
				</div>
			</div>
			<TerminalSpec />
		</div>
	);
}

function TerminalSpec() {
	const [tokens, setTokens] = React.useState<Token[]>([]);
	const [specTokens, setSpecTokens] = React.useState<SpecToken[]>([]);
	const [error, setError] = React.useState<string>('');

	async function getTokensFromCommand(command: string) {
		const tokens = parseToSimpleTokens(command);
		setTokens(tokens);

		if (!tokens?.length) return;

		const cmd = tokens[0].value;

		try {
			const response = await import(
				/* webpackIgnore: true */ `https://cdn.skypack.dev/@withfig/autocomplete/build/${cmd}.js`
			);

			if (!response?.default) {
				throw new Error();
			}

			if (response.default) {
				const specTokens = parseToSpecTokens({ spec: response.default, tokens });

				setSpecTokens(specTokens);
			}
		} catch (error) {
			setError(`Not explanation for command "${cmd}" yet ! 😿`);
		}
	}

	return (
		<div className='space-y-2'>
			<ResizableTextarea onSubmit={getTokensFromCommand} />
			{error ? (
				<Warning warning={error} />
			) : (
				<Explain tokens={tokens} specTokens={specTokens} />
			)}
		</div>
	);
}

function Warning({ warning }: { warning: string }) {
	return (
		<p className='flex gap-2 items-center'>
			<Icon>
				<AlertTriangle className='text-warn' />
			</Icon>
			{warning}
			<a
				href='https://fig.io/'
				target='_blank'
				rel='noopener noreferrer'
				className='underline'
			>
				Contribute now at Fig.io
			</a>
		</p>
	);
}

function Explain({ tokens, specTokens }: { tokens: Token[]; specTokens: SpecToken[] }) {
	return <div>Explain</div>;
}

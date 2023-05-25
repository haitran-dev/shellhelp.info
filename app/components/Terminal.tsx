'use client';

import React from 'react';
import SunSVG from 'static/icons/sun';
import { Icon } from './ui/icons';
import { ResizableTextarea } from './ui/textarea';
import { parseToSimpleTokens } from 'utils/parseTokens';

export default function Terminal() {
	return (
		<div className='w-full max-w-[800px] h-[300px] sm:h-[450px] p-2 bg-gray-900/50 backdrop-blur-md rounded-lg shadow-xl text-white space-y-4'>
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

	async function getTokensFromCommand(command: string) {
		const tokens = parseToSimpleTokens(command);
		setTokens(tokens);

		const cmd = tokens.length > 0 ? tokens[0].value : '';

		const response = await import(
			/* webpackIgnore: true */ `https://cdn.skypack.dev/@withfig/autocomplete/build/${cmd}.js`
		);

		console.log({ response });

		// setTokens
	}

	return (
		<div className='space-y-2'>
			<ResizableTextarea onSubmit={getTokensFromCommand} />
			{tokens.length > 0 ? <Explain tokens={tokens} /> : null}
		</div>
	);
}

function Explain({ tokens }: { tokens: Token[] }) {
	return <div>Eplain</div>;
}

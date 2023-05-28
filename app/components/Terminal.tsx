'use client';

import React from 'react';
import AlertTriangle from 'static/icons/alert-triangle';
import SunSVG from 'static/icons/sun';
import { SpecToken } from 'types';
import { parseToSimpleTokens, parseToSpecTokens } from 'utils/parseTokens';
import { Icon } from './ui/icons';
import { ResizableTextarea } from './ui/textarea';

export default function Terminal() {
	const cliAreaRef = React.useRef<HTMLDivElement>(null);
	const [commands, setCommands] = React.useState<string[]>([]);
	const [isShowInput, setShowInput] = React.useState<boolean>(true);

	const handleSubmitCommand = (command: string) => {
		setCommands([...commands, command]);
		setShowInput(false);

		if (cliAreaRef.current) {
			cliAreaRef.current.scrollTop = cliAreaRef.current?.scrollHeight;
		}
	};

	const handleUpdateTerminal = React.useCallback(() => {
		setShowInput(true);

		if (cliAreaRef.current) {
			cliAreaRef.current.scrollTop = cliAreaRef.current?.scrollHeight;
		}
	}, []);

	return (
		<div className='w-full flex flex-col gap-4 max-w-[800px] h-[300px] sm:h-[450px] p-2 bg-gray-900/70 backdrop-blur-md rounded-lg shadow-xl text-white'>
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
			<div ref={cliAreaRef} className='flex-1 space-y-2 overflow-auto'>
				{commands.map((cmd, index) => (
					<div key={index} className=''>
						<ResizableTextarea value={cmd} disabled key={crypto.randomUUID()} />

						<MemoExplainComp cmd={cmd} onFetchSuccess={handleUpdateTerminal} />
					</div>
				))}
				{isShowInput && (
					<ResizableTextarea
						key={crypto.randomUUID()}
						onSubmitSpec={handleSubmitCommand}
					/>
				)}
			</div>
		</div>
	);
}

const Explain = ({ cmd, onFetchSuccess }: { cmd: string; onFetchSuccess: () => void }) => {
	const [specInfo, setSpecInfo] = React.useState<Fig.Subcommand>();
	const [specError, setSpecError] = React.useState<string>('');
	const [isLoadingSpec, setLoadingSpec] = React.useState<boolean>(false);
	const tokens = React.useMemo(() => parseToSimpleTokens(cmd), [cmd]);
	const specTokens: SpecToken[] = React.useMemo(
		() => parseToSpecTokens({ spec: specInfo, tokens }),
		[specInfo, tokens]
	);

	const spec = tokens.length > 0 ? tokens[0].value : '';

	React.useEffect(() => {
		const getSpec = async () => {
			try {
				setLoadingSpec(true);
				const response = await import(
					/* webpackIgnore: true */ `https://cdn.skypack.dev/@withfig/autocomplete/build/${spec}.js`
				);

				if (response.default) {
					setSpecInfo(response.default);
					setSpecError('');
				}
			} catch (error) {
				setSpecError(`Not explanation for command "${spec}" yet ! 😿`);
			}
			setLoadingSpec(false);
			onFetchSuccess();
		};

		getSpec();
	}, [spec, onFetchSuccess]);

	if (isLoadingSpec) {
		return <p>Loading ...</p>;
	}

	if (specError) {
		return <Warning warning={specError} />;
	}

	console.log({ specTokens });

	return (
		<div>
			{specTokens.map((token, index) => {
				if (token.value === spec) {
					return <p key={index}>{token.value}</p>;
				}

				if (token.type === 'subcommand') {
					return <p key={index}>{token.value}</p>;
				}

				if (token.type === 'option') {
					return <p key={index}>{token.value}</p>;
				}

				if (token.type === 'argument') {
					return <p key={index}>{token.value}</p>;
				}
			})}
		</div>
	);
};

function Warning({ warning }: { warning: string }) {
	return (
		<p className='flex gap-2 items-center text-[#fff222]'>
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

const MemoExplainComp = React.memo(Explain);

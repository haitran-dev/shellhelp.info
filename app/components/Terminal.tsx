'use client';

import React from 'react';
import AlertTriangle from 'static/icons/alert-triangle';
import SunSVG from 'static/icons/sun';
import { SpecToken } from 'types';
import { parseToSimpleTokens, parseToSpecTokens } from 'utils/parseTokens';
import { ResizableTextarea } from './ui/textarea';
import { InvalidTokenError } from 'utils/error';

export default function Terminal() {
	const cliAreaRef = React.useRef<HTMLDivElement>(null);
	const [commands, setCommands] = React.useState<string[]>([]);
	const [commandsHistory, setCommandsHistory] = React.useState<string[]>([]);
	const [isShowInput, setShowInput] = React.useState<boolean>(true);

	const scrollToBottom = () => {
		if (cliAreaRef.current) {
			cliAreaRef.current.scrollTop = cliAreaRef.current?.scrollHeight;
		}
	};

	const handleSubmitCommand = (newCommand: string) => {
		const newCommands = [...commands, newCommand];

		setCommands(newCommands);
		setCommandsHistory(newCommands);
		setShowInput(false);
	};

	const handleUpdateTerminal = React.useCallback(() => {
		setShowInput(true);
	}, []);

	function clearTerminal() {
		setCommands([]);
	}

	console.log({ commands });

	return (
		<div className='w-full flex flex-col gap-4 max-w-[800px] h-[50rem] sm:h-[40rem] md:h-[35rem] p-2 bg-gray-900/70 backdrop-blur-md rounded-lg shadow-xl text-white'>
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
					<SunSVG className='w-6' />
				</div>
			</div>
			<div ref={cliAreaRef} className='flex-1 space-y-6 overflow-auto'>
				{commands.map((cmd, index) => (
					<div key={index}>
						<ResizableTextarea key={index} disabled value={cmd} />

						<MemoExplainComp
							cmd={cmd}
							onFetchSuccess={handleUpdateTerminal}
							updateScroll={scrollToBottom}
						/>
					</div>
				))}
				{isShowInput && <ResizableTextarea onSubmitSpec={handleSubmitCommand} />}
			</div>
		</div>
	);
}

const Explain = ({
	cmd,
	onFetchSuccess,
	updateScroll,
}: {
	cmd: string;
	onFetchSuccess: () => void;
	updateScroll: () => void;
}) => {
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

	React.useEffect(() => {
		updateScroll();
	});

	if (isLoadingSpec) {
		return <div className='w-2 h-4 bg-white animate-flash' />;
	}

	if (specError) {
		return <Warning warning={specError} />;
	}

	console.log({ specTokens });

	return (
		<div className='space-y-2'>
			{specTokens.map((token, index) => {
				return (
					<React.Fragment key={index}>
						{(function () {
							if (token.value === spec) {
								return (
									<TokenField
										className='border-cmd text-cmd'
										token={token}
										isCommand
									/>
								);
							}

							if (token.type === 'subcommand') {
								return (
									<TokenField
										className='border-sub-cmd text-sub-cmd'
										token={token}
									/>
								);
							}

							if (token.type === 'option') {
								if (token.error instanceof InvalidTokenError) {
									return (
										<TokenField
											className='border-option text-option'
											token={token}
											isError
										/>
									);
								}

								return (
									<TokenField
										className='border-option text-option'
										token={token}
									/>
								);
							}

							if (token.type === 'arg') {
								return (
									<TokenField className='border-args text-args' token={token} />
								);
							}

							return null;
						})()}
					</React.Fragment>
				);
			})}
		</div>
	);
};

function TokenField({
	className,
	token,
	isError,
	isCommand,
}: {
	className?: string;
	token: SpecToken;
	isError?: boolean;
	isCommand?: boolean;
}) {
	return (
		<fieldset
			className={`pt-0 px-4 pb-2 w-[95%] mx-auto border-[2px] border-solid rounded ${className}`}
		>
			<legend className='p-1 text-lg font-semibold'>
				{isCommand ? 'command' : token.type}
			</legend>
			<p className='text-lg text-white'>{token.value}</p>
			{isError ? (
				<p className='font-thin text-error'>{token.error?.message}</p>
			) : (
				<p className='font-light text-white'>{token.description || token.name}</p>
			)}
		</fieldset>
	);
}

function Warning({ warning }: { warning: string }) {
	return (
		<p className='flex gap-2 items-center text-[#fff222]'>
			<AlertTriangle className='text-warn w-4' />
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

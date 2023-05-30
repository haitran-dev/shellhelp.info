import React, { ForwardRefRenderFunction } from 'react';

type PropType = {
	onSubmitSpec?: (command: string) => void;
	defaultValue?: string;
} & React.ComponentProps<'textarea'>;

type ForwardRefType = {
	focus: () => void;
};

const ResizableTextarea: ForwardRefRenderFunction<ForwardRefType, PropType> = (
	{ onSubmitSpec, defaultValue, ...delegated },
	ref
) => {
	const textareaRef = React.useRef<HTMLTextAreaElement>(null);
	const [value, setValue] = React.useState<string | undefined>(defaultValue);

	React.useImperativeHandle(ref, () => ({
		focus: () => {
			if (textareaRef.current) textareaRef.current.focus();
		},
	}));

	React.useEffect(() => {
		setValue(defaultValue);
	}, [defaultValue]);

	const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value);
		const textarea = textareaRef.current;
		if (!textarea) return;

		textarea.style.height = '16px';
		textarea.style.height = `${textarea.scrollHeight}px`;
	};

	const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();

			if (typeof onSubmitSpec === 'function') {
				onSubmitSpec(value || '');
			}
		}
	};

	return (
		<div className='flex gap-2 items-start text-[1.25rem]'>
			<label className='select-none'>~</label>
			<textarea
				ref={textareaRef}
				autoFocus
				autoComplete='off'
				autoCorrect='off'
				spellCheck='false'
				value={value}
				onChange={handleChangeInput}
				onKeyDown={handleKeydown}
				className='h-[1.5em] bg-transparent outline-none resize-none w-full overflow-hidden break-words'
				{...delegated}
			/>
		</div>
	);
};

export default React.forwardRef<ForwardRefType, PropType>(ResizableTextarea);

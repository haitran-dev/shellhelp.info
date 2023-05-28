import React from 'react';

const ResizableTextarea: React.FC<
	{
		onSubmitSpec?: (command: string) => void;
	} & React.ComponentProps<'textarea'>
> = ({ onSubmitSpec, ...delegated }) => {
	const textareaRef = React.useRef<HTMLTextAreaElement>(null);

	const handleChangeInput = () => {
		const textarea = textareaRef.current;

		if (!textarea) return;

		textarea.style.height = '16px';
		textarea.style.height = `${textarea.scrollHeight}px`;
	};

	const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();

			if (typeof onSubmitSpec === 'function') {
				onSubmitSpec(textareaRef.current?.value?.trimStart() || '');
			}
		}
	};

	return (
		<div className='flex gap-2 items-start text-xl '>
			<label className='select-none'>~</label>
			<textarea
				ref={textareaRef}
				autoFocus
				autoComplete='off'
				autoCorrect='off'
				spellCheck='false'
				onChange={handleChangeInput}
				onKeyDown={handleKeydown}
				className='h-[1.5em] bg-transparent outline-none resize-none w-full overflow-hidden break-words'
				{...delegated}
			/>
		</div>
	);
};

export default ResizableTextarea;

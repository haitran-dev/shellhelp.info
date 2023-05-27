import React from 'react';

type IconProps = {
	w?: number;
	h?: number;
	isButton?: boolean;
	classNames?: string;
	children: React.ReactNode;
};

export default function Icon({ w = 20, h = w, isButton, children, classNames }: IconProps) {
	const Comp = isButton ? 'button' : 'span';

	return (
		<Comp
			style={{
				width: w + 'px',
				height: h + 'px',
			}}
			className={'flex items-center justify-center ' + classNames}
		>
			{children}
		</Comp>
	);
}

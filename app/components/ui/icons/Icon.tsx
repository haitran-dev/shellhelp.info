import React from 'react';

type IconProps = {
	classNames?: string;
	children: React.ReactNode;
	tooltip?: string;
	onClick?: () => void;
};

export default function Icon({ children, classNames = '', tooltip, onClick }: IconProps) {
	const Comp = onClick ? 'button' : 'div';

	return (
		<Comp
			onClick={onClick}
			data-tooltip-id='tooltip-icon'
			data-tooltip-content={tooltip}
			className={'flex items-center justify-center w-8 h-8' + classNames}
		>
			{children}
		</Comp>
	);
}

import React from 'react';

const Info = (props) => {
	return (
		<svg {...props} viewBox='0 0 24 24'>
			<g
				fill='none'
				stroke='currentColor'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2'
			>
				<path d='M12 9h.01M11 12h1v4h1'></path>
				<path d='M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9s-9-1.8-9-9s1.8-9 9-9z'></path>
			</g>
		</svg>
	);
};

export default Info;

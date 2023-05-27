import React from 'react';

const AlertTriangle = (props) => {
	return (
		<svg viewBox='0 0 24 24' {...props}>
			<g fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
				<path d='M0 0h24v24H0z' />
				<path
					fill='currentColor'
					d='M11.94 2a2.99 2.99 0 0 1 2.45 1.279l.108.164l8.431 14.074a2.989 2.989 0 0 1-2.366 4.474l-.2.009H3.507a2.99 2.99 0 0 1-2.648-4.308l.101-.189L9.385 3.438A2.989 2.989 0 0 1 11.94 2zm.07 14l-.127.007a1 1 0 0 0 0 1.986L12 18l.127-.007a1 1 0 0 0 0-1.986L12.01 16zM12 8a1 1 0 0 0-.993.883L11 9v4l.007.117a1 1 0 0 0 1.986 0L13 13V9l-.007-.117A1 1 0 0 0 12 8z'
				/>
			</g>
		</svg>
	);
};

export default AlertTriangle;

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			backgroundImage: {
				'gradient-logo': 'linear-gradient(to right, #7219E3, #1ADBB8)',
				'gradient-default': 'linear-gradient(135deg, #40e0a3, #ff8c00, #ff0055)',
			},
			colors: {
				warn: 'hsl(45, 100%, 50%)',
				error: 'hsl(0, 100%, 50%)',
				cmd: 'hsl(200, 100%, 70%)',
				'sub-cmd': 'hsl(150, 100%, 70%)',
				option: 'hsl(270, 100%, 70%)',
				args: 'hsl(360, 100%, 70%)',
			},
			animation: {
				flash: 'flash 1s infinite',
				shake: 'shake 0.2s',
			},
			keyframes: {
				flash: {
					'51%': { opacity: 1 },
					'1%, 50%': { opacity: 0 },
				},
				shake: {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'50%': { transform: 'rotate(10deg)' },
				},
			},
		},
	},
	plugins: [],
};

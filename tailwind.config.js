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
		},
	},
	plugins: [],
};

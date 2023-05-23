import './globals.css';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
	weight: ['300', '400', '500', '700', '900'],
	subsets: ['latin'],
});

export const metadata = {
	title: 'Shell Help',
	description: 'Explain shell commands with help of Fig autocompletion',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={roboto.className}>{children}</body>
		</html>
	);
}

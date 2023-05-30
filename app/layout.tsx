import { Roboto } from 'next/font/google';
import ThemeModeProvider from 'theme-provider';
import './globals.css';

const roboto = Roboto({
	weight: ['100', '300', '400', '500', '700', '900'],
	subsets: ['latin'],
});

export const metadata = {
	title: 'Shell Help',
	description: 'Explain shell commands with help of Fig autocompletion',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={roboto.className}>
				<ThemeModeProvider>{children}</ThemeModeProvider>
			</body>
		</html>
	);
}

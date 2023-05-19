import Link from 'next/link';
import Nav from './Nav';

export const metadata = {
	title: 'Projects',
	description: 'List all my projects',
};

const projects = [
	{
		name: 'Spell Book',
		description: 'Visual english dictionary chrome extension',
		slug: 'spell-book',
	},
	{
		name: 'Shell Help',
		description: 'Learn shell website',
		slug: 'shell-help',
	},
];

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
	return (
		<section>
			<Link href='/projects'>Projects</Link>
			<Nav projects={projects} />
			{children}
		</section>
	);
}

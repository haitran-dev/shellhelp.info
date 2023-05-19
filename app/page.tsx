import Link from 'next/link';

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col'>
			<div className='flex'>
				<Link href='./projects'>Projects</Link>
				<Link href='./contact'>Contact</Link>
			</div>
		</main>
	);
}

'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

export default function Nav({ projects }: { projects: any }) {
	const pathname = usePathname();
	return (
		<ul className='flex gap-2'>
			{projects.map((project: any) => {
				const isActive = pathname.indexOf(project.slug) > -1;

				return (
					<li key={project.name} className={`${isActive ? 'text-blue-600' : ''}`}>
						<Link href={`/projects/${project.slug}`}>{project.name}</Link>
					</li>
				);
			})}
		</ul>
	);
}

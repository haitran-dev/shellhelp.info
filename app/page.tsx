import SunSVG from './static/icons/sun.js';
import ShellSVG from './static/icons/shell.js';
import { Icon } from './components/ui/icons';
import Image from 'next/image';

export default function Home() {
	return (
		<main className='h-screen bg-gradient-default p-2 sm:p-4'>
			<div className='flex flex-col mx-auto items-center mt-[50px] sm:mt-[100px] gap-4'>
				<div className='flex gap-3 select-none items-center text-gray-800'>
					<Icon w={72} classNames='!w-[48px] sm:!w-[72px]'>
						<ShellSVG />
					</Icon>
					<span className='text-[32px] sm:text-[60px] font-black'>Help!</span>
				</div>
				<div className='w-full max-w-[800px] h-[300px] sm:h-[450px] p-2 bg-gray-900/50 backdrop-blur-md rounded-lg shadow-xl text-white'>
					<div className='flex h-5 justify-between items-center relative'>
						<div className='flex gap-2'>
							<span className='w-3 h-3 rounded-full bg-red-400' />
							<span className='w-3 h-3 rounded-full bg-yellow-400' />
							<span className='w-3 h-3 rounded-full bg-green-400' />
						</div>
						<div className='tracking-wider font-light absolute inset-0 flex items-center justify-center pointer-events-none select-none'>
							Terminal
						</div>
						<div className='flex gap-1'>
							<Icon isButton>
								<SunSVG />
							</Icon>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

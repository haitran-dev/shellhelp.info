import ShellSVG from 'static/icons/shell.js';
import { Icon } from 'components/ui/icons';
import Terminal from 'components/Terminal';
import { Tooltip } from 'react-tooltip';

export default function App() {
	return (
		<main className='h-screen bg-gradient-default p-2 sm:p-4 overflow-auto'>
			<div className='flex flex-col mx-auto items-center mt-[50px] sm:mt-[100px] mb-[30px] gap-4'>
				<Logo />
				<Terminal />
			</div>
			<Tooltip id='tooltip-icon' />
		</main>
	);
}

function Logo() {
	return (
		<div className='flex gap-3 select-none items-center text-gray-800'>
			<Icon classNames='!w-[48px] sm:!w-[72px]'>
				<ShellSVG />
			</Icon>
			<span className='text-[32px] sm:text-[60px] font-black'>Help!</span>
		</div>
	);
}

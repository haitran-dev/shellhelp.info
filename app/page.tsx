import ShellSVG from "static/icons/shell.js";
import { Icon } from "components/ui/icons";
import Terminal from "components/Terminal";
import { Tooltip } from "react-tooltip";

export default function App() {
  return (
    <main className="h-screen bg-gradient-logo p-2 sm:p-4 overflow-auto">
      <div className="flex flex-col mx-auto items-center mt-[50px] sm:mt-[100px] mb-[30px] gap-10">
        <Logo />
        <Terminal />
      </div>
      <Tooltip id="tooltip-icon" />
    </main>
  );
}

function Logo() {
  return (
    <>
      <div className="flex gap-4 select-none items-center backdrop-blur-md duration-300 text-slate-300 dark:text-gray-900">
        <Icon classNames="!w-[48px] sm:!w-[72px]">
          <ShellSVG />
        </Icon>
        <span className="text-[32px] sm:text-[60px] font-black">Help!</span>
      </div>
      <h1 className="text-5xl font-semibold text-white dark:text-black duration-300">
        Master shell commands with ShellHelp!
      </h1>
      <h2 className="text-xl text-white dark:text-black duration-300">
        Perfect for students and developers. Start learning today!
      </h2>
    </>
  );
}

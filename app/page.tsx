import ShellSVG from "static/icons/shell.js";
import { Icon } from "components/ui/icons";
import Terminal from "components/Terminal";
import { Tooltip } from "react-tooltip";

export default function App() {
  return (
    <main className="h-screen bg-gradient-logo p-2 sm:p-4 overflow-auto">
      <div className="flex flex-col mx-auto items-center sm:mt-[20px] gap-5">
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
        <Icon classNames="!w-[72px]">
          <ShellSVG />
        </Icon>
        <span className="text-[64px] font-black">Help!</span>
      </div>
      <div className="space-y-1 text-center">
        <h1 className="sm:text-xl text-white dark:text-black duration-300">
          CLI arguments explainer with Fig
        </h1>
      </div>
    </>
  );
}

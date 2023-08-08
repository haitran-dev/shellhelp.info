import React from "react";

const suggestCommands = [
  "npm run build",
  'git commit -m "Fix typo"',
  "rm -r -f code/javascript",
  "mkdir program",
];

const Suggestion = ({
  handleSubmitCommand,
}: {
  handleSubmitCommand: (command: string) => void;
}) => {
  return (
    <div className="w-full flex flex-col gap-4 min-w-[300px] max-w-[720px] space-y-1">
      <p className="text-left text-lg text-white dark:text-black duration-300">
        Examples
      </p>
      <div className="w-full gap-2 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        {suggestCommands.map((command) => (
          <button
            className="bg-slate-100/70 dark:bg-gray-900/70 duration-300 hover:bg-slate-400 dark:hover:bg-slate-500 backdrop-blur-md py-1 px-2 rounded bg-opacity-70"
            onClick={() => handleSubmitCommand(command)}
            key={command}
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Suggestion;

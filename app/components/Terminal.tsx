"use client";

import { useTheme } from "next-themes";
import React from "react";
import AlertTriangle from "static/icons/alert-triangle";
import EraserSVG from "static/icons/eraser";
import InfoSVG from "static/icons/info";
import SunSVG from "static/icons/sun";
import GitHubSVG from "static/icons/git-hub";
import { SpecToken } from "types";
import { InvalidTokenError } from "utils/error";
import { parseToSimpleTokens, parseToSpecTokens } from "utils/parseTokens";
import { Icon } from "./ui/icons";
import { ResizableTextarea } from "./ui/textarea";
import { Modal } from "./ui/modal";
import Suggestion from "./Suggestion";

export default function Terminal() {
  const { theme, setTheme } = useTheme();
  const cliAreaRef = React.useRef<HTMLDivElement>(null);
  const [commands, setCommands] = React.useState<string[]>([]);
  const [isShowInput, setShowInput] = React.useState<boolean>(true);
  const commandInputRef = React.useRef<HTMLTextAreaElement>(null);
  const [inputHistory, setInputHistory] = React.useState<string[]>([]);
  const [currentInputIndex, setCurrentInputIndex] = React.useState<number>(-1);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        clearTerminal();
        return;
      }

      if (inputHistory.length > 0) {
        if (e.key === "ArrowUp" && currentInputIndex !== 0) {
          e.preventDefault();
          currentInputIndex > 0
            ? setCurrentInputIndex((prev) => prev - 1)
            : setCurrentInputIndex(inputHistory.length - 1);
        }

        if (
          e.key === "ArrowDown" &&
          currentInputIndex !== inputHistory.length - 1
        ) {
          e.preventDefault();
          if (currentInputIndex < inputHistory.length - 1) {
            setCurrentInputIndex((prev) => prev + 1);
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentInputIndex, inputHistory]);

  const scrollToBottom = () => {
    if (cliAreaRef.current) {
      cliAreaRef.current.scrollTop = cliAreaRef.current?.scrollHeight;
    }
  };

  const handleSubmitCommand = (newCommand: string) => {
    if (!newCommand) return;

    const newCommands = [...commands, newCommand];

    setCommands(newCommands);
    setInputHistory((prev) => [...prev, newCommand]);

    // reset
    setShowInput(false);
    setCurrentInputIndex(-1);
  };

  const handleUpdateTerminal = React.useCallback(() => {
    setShowInput(true);
  }, []);

  function clearTerminal() {
    setCommands([]);

    commandInputRef.current?.focus();
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <>
      <div className="w-full flex flex-col gap-4 min-w-[300px] max-w-[720px] h-[30rem] sm:h-[28rem] p-2 duration-300 bg-slate-100/70 dark:bg-gray-900/70 backdrop-blur-md rounded-lg shadow-xl dark:text-white">
        <div className="flex h-5 justify-between items-center relative">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400" />
          </div>
          <div className="tracking-wider font-normal absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            Terminal
          </div>
          <div className="flex gap-1">
            <Icon tooltip="Clear (Ctrl + L)" onClick={clearTerminal}>
              <EraserSVG className="w-5 h-5" />
            </Icon>
            <Modal
              trigger={
                <Icon tooltip="Info">
                  <InfoSVG className="w-5 h-5" />
                </Icon>
              }
            >
              <div className="mt-4 text-sm !text-black flex flex-col gap-2 justify-center text-center">
                <p className="text-[1rem]">
                  I am your companion helps you understand shells
                </p>
                <a
                  className="flex items-center justify-center hover:bg-gradient-logo hover:bg-clip-text hover:text-transparent"
                  href="https://github.com/haitran-dev/shellhelp.info"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon tooltip="Github repo">
                    <GitHubSVG className="w-4 h-4 text-black" />
                  </Icon>
                  Find me here
                </a>
                <a
                  className="bg-gradient-long bg-[length:600%] bg-left hover:bg-right duration-[7200ms] ease-linear text-white py-3 rounded-md text-lg flex gap-4 items-center justify-center cursor-pointer"
                  href="https://twitter.com/intent/tweet?text=A great tool you can play with shells here ! Check it out https://www.shellhelp.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tweet about shellhelp.info
                  <picture>
                    <source
                      srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.webp"
                      type="image/webp"
                    />
                    <img
                      src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.gif"
                      alt="🚀"
                      width="28"
                      height="28"
                    />
                  </picture>
                </a>
              </div>
            </Modal>
            <Icon tooltip="Change theme" onClick={toggleTheme}>
              <SunSVG className="w-5 h-5" />
            </Icon>
          </div>
        </div>
        <div ref={cliAreaRef} className="flex-1 space-y-6 overflow-auto">
          {commands.map((cmd, index) => (
            <div key={index}>
              <ResizableTextarea key={index} disabled value={cmd} />
              <MemoExplainComp
                cmd={cmd}
                onFetchSuccess={handleUpdateTerminal}
                updateScroll={scrollToBottom}
              />
            </div>
          ))}
          {isShowInput && (
            <ResizableTextarea
              defaultValue={inputHistory[currentInputIndex] || ""}
              ref={commandInputRef}
              onSubmitSpec={handleSubmitCommand}
            />
          )}
        </div>
      </div>
      <Suggestion handleSubmitCommand={handleSubmitCommand} />
    </>
  );
}

const Explain = ({
  cmd,
  onFetchSuccess,
  updateScroll,
}: {
  cmd: string;
  onFetchSuccess: () => void;
  updateScroll: () => void;
}) => {
  const [specInfo, setSpecInfo] = React.useState<Fig.Subcommand>();
  const [specError, setSpecError] = React.useState<string>("");
  const [isLoadingSpec, setLoadingSpec] = React.useState<boolean>(false);
  const tokens = React.useMemo(() => parseToSimpleTokens(cmd), [cmd]);
  const specTokens: SpecToken[] = React.useMemo(
    () => parseToSpecTokens({ spec: specInfo, tokens }),
    [specInfo, tokens],
  );

  const spec = tokens.length > 0 ? tokens[0].value : "";

  React.useEffect(() => {
    const getSpec = async () => {
      try {
        setLoadingSpec(true);
        const response = await import(
          /* webpackIgnore: true */ `https://cdn.skypack.dev/@withfig/autocomplete/build/${spec}.js`
        );

        if (response.default) {
          setSpecInfo(response.default);
          setSpecError("");
        }
      } catch (error) {
        setSpecError(`Not explanation for command "${spec}" yet ! 😿`);
      }
      setLoadingSpec(false);
      onFetchSuccess();
    };

    getSpec();
  }, [spec, onFetchSuccess]);

  // auto scroll to bottom when change
  React.useEffect(() => {
    updateScroll();
  });

  // cursor loading
  if (isLoadingSpec) {
    return <div className="w-2 h-5 bg-black dark:bg-white animate-flash" />;
  }

  if (specError) {
    return <Warning warning={specError} />;
  }

  return (
    <div className="space-y-2">
      {specTokens.map((token, index) => {
        return (
          <React.Fragment key={index}>
            {(function () {
              if (token.value === spec) {
                return (
                  <TokenField
                    className="border-cmd-light dark:border-cmd text-cmd-light dark:text-cmd"
                    token={token}
                    isCommand
                  />
                );
              }

              if (token.type === "subcommand") {
                return (
                  <TokenField
                    className="border-sub-cmd-light dark:border-sub-cmd text-sub-cmd-light dark:text-sub-cmd"
                    token={token}
                  />
                );
              }

              if (token.type === "option") {
                if (token.error instanceof InvalidTokenError) {
                  return (
                    <TokenField
                      className="border-option-light dark:border-option text-option-light dark:text-option"
                      token={token}
                      isError
                    />
                  );
                }

                return (
                  <TokenField
                    className="border-option text-option"
                    token={token}
                  />
                );
              }

              if (token.type === "arg") {
                return (
                  <TokenField
                    className="border-args-light dark:border-args text-args-light dark:text-args"
                    token={token}
                  />
                );
              }

              return (
                <TokenField
                  className="border-error-light text-error-light dark:border-error dark:text-error"
                  token={token}
                  isError
                />
              );
            })()}
          </React.Fragment>
        );
      })}
    </div>
  );
};

function TokenField({
  className,
  token,
  isError,
  isCommand,
}: {
  className?: string;
  token: SpecToken;
  isError?: boolean;
  isCommand?: boolean;
}) {
  return (
    <fieldset
      className={`pt-0 px-4 pb-2 w-[95%] mx-auto border-[2px] border-solid rounded ${className}`}
    >
      <legend className="p-1 text-lg font-semibold">
        {isCommand ? "command" : isError ? "Unknown type" : token.type}
      </legend>
      <p className="text-lg font-medium text-black dark:text-white">
        {token.value}
      </p>
      {isError ? (
        <p className="text-error dark:text-white">{token.error?.message}</p>
      ) : (
        <p className="text-black dark:text-white">
          {token.description || token.name}
        </p>
      )}
    </fieldset>
  );
}

function Warning({ warning }: { warning: string }) {
  return (
    <p className="flex gap-2 w-[95%] mx-auto items-center text-warn-light dark:text-warn">
      <AlertTriangle className="text-warn-light dark:text-warn w-4" />
      {warning}
      <a
        href="https://fig.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Contribute now at Fig.io
      </a>
    </p>
  );
}

const MemoExplainComp = React.memo(Explain);

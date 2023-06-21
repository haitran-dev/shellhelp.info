import React from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({
  title,
  trigger,
  children,
}: {
  title?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>{trigger}</button>

      <Dialog open={isOpen} onClose={() => setOpen(false)}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-xl text-center font-medium leading-6 text-gray-900"
              >
                {title}
              </Dialog.Title>
              {children}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

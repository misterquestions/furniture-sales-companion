"use client";

import { Disclosure } from "@headlessui/react";
import type { PropsWithChildren } from "react";

import { cn } from "@/lib/classnames";

type AccordionProps = PropsWithChildren<{
  className?: string;
}>;

type AccordionItemProps = PropsWithChildren<{
  title: string;
  description?: string;
  defaultOpen?: boolean;
}>;

export function Accordion({ children, className }: AccordionProps) {
  return <div className={cn("space-y-3", className)}>{children}</div>;
}

export function AccordionItem({
  title,
  description,
  defaultOpen,
  children,
}: AccordionItemProps) {
  return (
    <Disclosure defaultOpen={defaultOpen} as="div">
      {({ open }) => (
        <div className="rounded-[28px] border border-white/60 bg-white/85 shadow-[0_12px_35px_rgba(15,118,110,0.08)]">
          <Disclosure.Button className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left">
            <div>
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              {description ? (
                <p className="text-xs text-gray-500">{description}</p>
              ) : null}
            </div>
            <span
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition",
                open && "rotate-45"
              )}
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 2v8M2 6h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Disclosure.Button>
          <Disclosure.Panel className="border-t border-gray-100 px-4 py-4">
            {children}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

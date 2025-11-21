"use client";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

import { cn } from "@/lib/classnames";

type SelectFieldProps = {
  label?: string;
  helperText?: string;
  placeholder?: string;
  value?: string;
  onChange: (value?: string) => void;
  options: { label: string; value: string }[];
  nullableOptionLabel?: string;
};

export function SelectField({
  label,
  helperText,
  placeholder = "Selecciona",
  value,
  onChange,
  options,
  nullableOptionLabel = "Todos",
}: SelectFieldProps) {
  const list = [{ label: nullableOptionLabel, value: "" }, ...options];
  const current = value ?? "";
  const selectedLabel = list.find((option) => option.value === current)?.label;

  return (
    <div className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
      {label}
      <Listbox
        value={current}
        onChange={(optionValue) => onChange(optionValue || undefined)}
      >
        <div className="relative">
          <Listbox.Button
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 outline-none transition",
              "focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-100"
            )}
          >
            <span className={cn(!selectedLabel && "text-gray-400 font-normal")}>
              {selectedLabel ?? placeholder}
            </span>
            <svg
              className="h-4 w-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-white/80 bg-white/95 p-1 text-sm shadow-[0_25px_55px_rgba(15,118,110,0.18)]">
              {list.map((option) => (
                <Listbox.Option
                  key={option.value ?? "all"}
                  value={option.value}
                  className={({ active, selected }) =>
                    cn(
                      "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2",
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-700",
                      selected && "font-semibold"
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <span>{option.label}</span>
                      {selected ? (
                        <svg
                          className="h-4 w-4 text-emerald-500"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 10l2 2 6-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <span className="text-[11px] font-normal normal-case text-gray-400">
        {helperText ?? "\u00A0"}
      </span>
    </div>
  );
}

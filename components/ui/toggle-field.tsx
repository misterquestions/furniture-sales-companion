"use client";

import { Switch } from "@headlessui/react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/classnames";

type ToggleFieldProps = {
  label: string;
  helperText?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  switchProps?: Omit<
    ComponentProps<typeof Switch>,
    "checked" | "onChange" | "className" | "children"
  >;
};

export function ToggleField({
  label,
  helperText,
  checked,
  onChange,
  className,
  switchProps,
}: ToggleFieldProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3",
        className
      )}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
          {label}
        </p>
        {helperText ? (
          <p className="text-[11px] text-gray-500">{helperText}</p>
        ) : null}
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        className={cn(
          checked ? "bg-emerald-600" : "bg-gray-300",
          "relative inline-flex h-6 w-11 items-center rounded-full transition"
        )}
        {...switchProps}
      >
        <span
          className={cn(
            checked ? "translate-x-6" : "translate-x-1",
            "inline-block h-4 w-4 transform rounded-full bg-white transition"
          )}
        />
      </Switch>
    </div>
  );
}

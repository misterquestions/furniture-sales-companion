import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/classnames";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string;
};

export const InputField = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-gray-800 outline-none transition",
            error ? "border-rose-300 ring-rose-200" : "border-gray-200 focus:border-emerald-400 ring-emerald-500/10",
            className
          )}
          {...props}
        />
        <span className="text-[11px] font-normal normal-case text-gray-400">
          {error ?? helperText ?? "\u00A0"}
        </span>
      </label>
    );
  }
);

InputField.displayName = "InputField";

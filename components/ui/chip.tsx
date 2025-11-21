import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/classnames";

type ChipVariant = "subtle" | "solid" | "outline";
type ChipTone = "gray" | "emerald" | "amber" | "rose";

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: ChipVariant;
  tone?: ChipTone;
  leadingIcon?: ReactNode;
};

const baseTone: Record<ChipTone, string> = {
  gray: "text-gray-700",
  emerald: "text-emerald-700",
  amber: "text-amber-700",
  rose: "text-rose-700",
};

const variantMap: Record<ChipVariant, Record<ChipTone, string>> = {
  subtle: {
    gray: "bg-gray-100 border-gray-200",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    rose: "bg-rose-50 border-rose-100 text-rose-700",
  },
  solid: {
    gray: "bg-gray-800 text-white border-transparent",
    emerald: "bg-emerald-600 text-white border-transparent",
    amber: "bg-amber-500 text-white border-transparent",
    rose: "bg-rose-500 text-white border-transparent",
  },
  outline: {
    gray: "border border-gray-300 text-gray-700",
    emerald: "border border-emerald-200 text-emerald-700",
    amber: "border border-amber-200 text-amber-700",
    rose: "border border-rose-200 text-rose-700",
  },
};

export function Chip({
  variant = "subtle",
  tone = "gray",
  leadingIcon,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        baseTone[tone],
        variantMap[variant][tone],
        className
      )}
      {...props}
    >
      {leadingIcon ? <span className="text-[10px]">{leadingIcon}</span> : null}
      {children}
    </span>
  );
}

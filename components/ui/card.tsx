import type { HTMLAttributes } from "react";

import { cn } from "@/lib/classnames";

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "surface" | "solid";
  padding?: keyof typeof paddingMap;
};

export function Card({
  variant = "surface",
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border transition-colors",
        variant === "surface"
          ? "border-white/60 bg-white/80 shadow-[0_12px_35px_rgba(15,118,110,0.08)]"
          : "border-emerald-100 bg-gradient-to-b from-emerald-50/80 to-white shadow-[0_18px_45px_rgba(15,118,110,0.18)]",
        paddingMap[padding],
        className
      )}
      {...props}
    />
  );
}

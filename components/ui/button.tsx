import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/classnames";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-600 text-white shadow-[0_12px_25px_rgba(16,185,129,0.35)] hover:bg-emerald-500",
  secondary:
    "bg-white text-emerald-700 border border-emerald-100 hover:bg-emerald-50",
  ghost: "bg-transparent text-emerald-700 hover:bg-emerald-50",
};

export function Button({
  variant = "primary",
  fullWidth,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55",
        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
}

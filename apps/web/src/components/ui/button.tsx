import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:   "bg-green-700 text-white hover:bg-green-800 shadow-warm",
  secondary: "border border-gray-300 bg-white text-ink hover:bg-gray-50 hover:border-green-400",
  danger:    "bg-red-600 text-white hover:bg-red-700",
  ghost:     "text-green-700 hover:bg-green-50",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs min-h-8",
  md: "px-4 py-2.5 text-sm min-h-10",
  lg: "px-6 py-3 text-base min-h-12",
};

export function Button({
  asChild,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

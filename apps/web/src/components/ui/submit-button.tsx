"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pendingLabel?: string;
  variant?: "primary" | "danger" | "ghost";
}

const variantStyles = {
  primary: "bg-green-700 text-white hover:bg-green-800 shadow-warm disabled:bg-green-400",
  danger:  "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400",
  ghost:   "border border-gray-300 bg-white text-ink hover:bg-gray-50 disabled:opacity-50",
};

export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      aria-disabled={pending || props.disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}

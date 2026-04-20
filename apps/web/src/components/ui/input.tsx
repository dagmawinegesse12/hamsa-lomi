import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("min-h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";

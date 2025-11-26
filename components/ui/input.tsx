import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base text-ink shadow-inner outline-none transition",
          "focus:border-sky-400 focus:ring-2 focus:ring-sky/30",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

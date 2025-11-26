import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base text-ink shadow-inner outline-none transition",
          "focus:border-sky-400 focus:ring-2 focus:ring-sky/30",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

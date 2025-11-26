import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ className, label, ...props }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full border border-ink/10 bg-white/70 shadow-inner transition",
          props.checked ? "bg-sky-200/80" : ""
        )}
      >
        <input type="checkbox" className="sr-only" {...props} />
        <span
          className={cn(
            "absolute left-1 h-4 w-4 rounded-full bg-ink transition",
            props.checked ? "translate-x-5 bg-ink" : ""
          )}
        />
      </span>
      {label ? <span className="text-sm text-ink/80">{label}</span> : null}
    </label>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label className={cn("text-sm font-semibold text-ink/80", className)} {...props}>
      {children}
    </label>
  );
}

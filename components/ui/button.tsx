import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-white shadow-soft hover:-translate-y-0.5 hover:shadow-lg focus:ring-2 focus:ring-sky/60",
  secondary: "bg-white text-ink border border-ink/10 hover:bg-butter",
  ghost: "bg-transparent text-ink hover:bg-butter/60"
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-5 py-3 text-lg"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-display transition duration-150",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

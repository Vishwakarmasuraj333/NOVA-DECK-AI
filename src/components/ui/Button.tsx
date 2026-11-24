import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "cyan" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none cursor-pointer";

    const variants = {
      primary:
        "bg-gradient-to-r from-nova-magenta to-nova-magentaHover text-white shadow-nova-glow hover:brightness-110",
      cyan:
        "bg-gradient-to-r from-nova-cyan to-nova-cyanHover text-nova-midnight font-bold shadow-cyan-glow hover:brightness-105",
      secondary:
        "bg-nova-surface hover:bg-nova-surfaceHover text-nova-softWhite border border-nova-border hover:border-nova-borderLight",
      outline:
        "border border-nova-border bg-transparent text-nova-softWhite hover:bg-nova-surface/50 hover:border-nova-magenta/40",
      ghost:
        "text-nova-muted hover:text-nova-softWhite hover:bg-nova-surface/40",
      danger:
        "bg-red-600/90 text-white hover:bg-red-500 shadow-sm",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../lib/cn.js";

const baseStyles =
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] border border-transparent font-medium tracking-[0.01em] transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

const sizeStyles = {
  xs: "h-8 px-3 text-xs",
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  xl: "h-12 px-6 text-base",
} as const;

const variantStyles = {
  primary:
    "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary/90",
  secondary:
    "bg-accent text-accent-foreground shadow-[var(--shadow-soft)] hover:bg-accent/90",
  outline:
    "border-border bg-surface text-foreground shadow-[var(--shadow-subtle)] hover:border-border/70 hover:bg-surface-strong",
  ghost:
    "bg-transparent text-muted hover:bg-surface-strong hover:text-foreground",
  danger:
    "bg-danger text-danger-foreground shadow-[var(--shadow-soft)] hover:bg-danger/90",
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /**
   * Visual styling for the button.
   * @default "primary"
   */
  variant?: ButtonVariant;
  /**
   * Button sizing preset.
   * @default "md"
   */
  size?: ButtonSize;
  /**
   * Optional icon rendered to the left of the text.
   */
  leadingIcon?: ReactNode;
  /**
   * Optional icon rendered to the right of the text.
   */
  trailingIcon?: ReactNode;
  /**
   * Render a spinner and place the button in a busy state.
   */
  loading?: boolean;
  children?: ReactNode;
}

const LoadingSpinner = () => (
  <span className="inline-flex h-4 w-4 items-center justify-center">
    <span className="block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-b-2 border-b-current" />
  </span>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      leadingIcon,
      trailingIcon,
      loading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const resolvedDisabled = disabled ?? loading;

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          loading && "cursor-progress",
          className
        )}
        disabled={resolvedDisabled}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            <span className="sr-only">Loading</span>
          </>
        ) : (
          <>
            {leadingIcon && (
              <span className="flex items-center">{leadingIcon}</span>
            )}
            {children && <span>{children}</span>}
            {trailingIcon && (
              <span className="flex items-center">{trailingIcon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

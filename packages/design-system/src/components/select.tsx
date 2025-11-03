import {
  forwardRef,
  type DetailedHTMLProps,
  type SelectHTMLAttributes,
} from "react";

import { cn } from "../lib/cn.js";

export interface SelectProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  invalid?: boolean;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      containerClassName,
      invalid = false,
      "aria-invalid": ariaInvalid,
      children,
      ...props
    },
    ref
  ) => (
    <div className={cn("relative w-full", containerClassName)}>
      <select
        ref={ref}
        className={cn(
          "h-10 w-full appearance-none rounded-sm border border-border/70 bg-surface px-3 pr-10 text-left text-sm text-foreground shadow-(--shadow-inner) transition focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60",
          (invalid || ariaInvalid === true || ariaInvalid === "true") &&
            "border-danger/60 focus-visible:ring-danger/30 focus-visible:ring-offset-danger/10",
          className
        )}
        aria-invalid={invalid || ariaInvalid === true || ariaInvalid === "true"}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 hidden items-center text-muted md:flex">
        <ChevronDownIcon />
      </span>
    </div>
  )
);

Select.displayName = "Select";

const ChevronDownIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    className="h-4 w-4"
  >
    <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

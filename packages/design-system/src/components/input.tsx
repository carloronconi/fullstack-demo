import {
  forwardRef,
  type InputHTMLAttributes,
  type DetailedHTMLProps,
} from "react";

import { cn } from "../lib/cn.js";

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      invalid = false,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref
  ) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-sm border border-border/70 bg-surface px-3 text-sm text-foreground placeholder:text-muted shadow-(--shadow-inner) transition focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60",
        (invalid || ariaInvalid === true || ariaInvalid === "true") &&
          "border-danger/60 focus-visible:ring-danger/30 focus-visible:ring-offset-danger/10",
        className
      )}
      aria-invalid={invalid || ariaInvalid === true || ariaInvalid === "true"}
      {...props}
    />
  )
);

Input.displayName = "Input";

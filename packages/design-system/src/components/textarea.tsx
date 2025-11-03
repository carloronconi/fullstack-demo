import {
  forwardRef,
  type DetailedHTMLProps,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "../lib/cn.js";

export interface TextareaProps
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      invalid = false,
      "aria-invalid": ariaInvalid,
      rows = 4,
      ...props
    },
    ref
  ) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full rounded-sm border border-border/70 bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted shadow-(--shadow-inner) transition focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60",
        (invalid || ariaInvalid === true || ariaInvalid === "true") &&
          "border-danger/60 focus-visible:ring-danger/30 focus-visible:ring-offset-danger/10",
        className
      )}
      aria-invalid={invalid || ariaInvalid === true || ariaInvalid === "true"}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";

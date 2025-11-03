import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "../lib/cn.js";
import { HelperText } from "./helper-text.js";
import { Label } from "./label.js";

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  labelFor?: string;
  description?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      className,
      label,
      labelFor,
      description,
      hint,
      error,
      required,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {(label || description) && (
        <div className="flex flex-col gap-1">
          {label && (
            <Label htmlFor={labelFor} className="text-sm font-semibold text-foreground">
              <span>{label}</span>
              {required && (
                <span className="ml-1 align-text-top text-xs text-danger">*</span>
              )}
            </Label>
          )}
          {description && (
            <p className="text-xs text-muted">{description}</p>
          )}
        </div>
      )}
      {children}
      {(hint || error) && (
        <div>
          {error ? (
            <HelperText tone="danger">{error}</HelperText>
          ) : (
            hint && <HelperText tone="muted">{hint}</HelperText>
          )}
        </div>
      )}
    </div>
  ),
);

Field.displayName = "Field";

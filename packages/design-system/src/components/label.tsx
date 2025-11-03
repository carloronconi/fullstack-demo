import {
  forwardRef,
  type DetailedHTMLProps,
  type LabelHTMLAttributes,
} from "react";

import { cn } from "../lib/cn.js";

export interface LabelProps
  extends DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-foreground",
        className,
      )}
      {...props}
    />
  ),
);

Label.displayName = "Label";

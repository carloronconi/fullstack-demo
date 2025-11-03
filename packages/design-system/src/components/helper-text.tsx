import {
  forwardRef,
  type DetailedHTMLProps,
  type HTMLAttributes,
} from "react";

import { cn } from "../lib/cn.js";

const toneStyles = {
  muted: "text-muted",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const;

export type HelperTone = keyof typeof toneStyles;

export interface HelperTextProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
  tone?: HelperTone;
}

export const HelperText = forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ tone = "muted", className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-xs font-medium uppercase tracking-[0.18em]",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  ),
);

HelperText.displayName = "HelperText";

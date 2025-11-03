import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../lib/cn.js";

const baseStyles =
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]";

const toneStyles = {
  neutral: {
    solid: "border-transparent bg-muted text-muted-foreground",
    soft: "border-muted/30 bg-muted/30 text-muted",
    outline: "border-muted/60 text-muted",
  },
  brand: {
    solid: "border-transparent bg-primary text-primary-foreground",
    soft: "border-primary/30 bg-primary/10 text-primary",
    outline: "border-primary/50 text-primary",
  },
  success: {
    solid: "border-transparent bg-success text-success-foreground",
    soft: "border-success/40 bg-success/15 text-success",
    outline: "border-success/70 text-success",
  },
  warning: {
    solid: "border-transparent bg-warning text-warning-foreground",
    soft: "border-warning/40 bg-warning/15 text-warning",
    outline: "border-warning/70 text-warning",
  },
  danger: {
    solid: "border-transparent bg-danger text-danger-foreground",
    soft: "border-danger/40 bg-danger/15 text-danger",
    outline: "border-danger/70 text-danger",
  },
} as const;

export type BadgeTone = keyof typeof toneStyles;
export type BadgeVariant = keyof (typeof toneStyles)[BadgeTone];

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  variant?: BadgeVariant;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ tone = "neutral", variant = "soft", className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(baseStyles, toneStyles[tone][variant], className)}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";

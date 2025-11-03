import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
} from "react";

import { cn } from "../lib/cn.js";

export type StatBoxTone = "neutral" | "danger";

export type StatBoxProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  label: ReactNode;
  value: ReactNode;
  tone?: StatBoxTone;
};

const toneClasses: Record<StatBoxTone, string> = {
  neutral: "bg-surface-soft text-foreground",
  danger: "bg-danger/10 text-danger",
};

export const StatBox = forwardRef<HTMLDivElement, StatBoxProps>(
  ({ label, value, tone = "neutral", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex min-w-40 flex-col gap-1 rounded-(--radius-sm) px-4 py-3",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      <span className="text-2xl font-semibold tracking-tight">{value}</span>
    </div>
  )
);

StatBox.displayName = "StatBox";

import { cn } from "../lib/cn.js";
import type { HTMLAttributes } from "react";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {}

export const Divider = ({ className, ...props }: DividerProps) => (
  <div
    className={cn("h-px w-full bg-border/60", className)}
    role="presentation"
    {...props}
  />
);

Divider.displayName = "Divider";

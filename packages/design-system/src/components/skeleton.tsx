import { cn } from "../lib/cn.js";
import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div
    className={cn(
      "animate-pulse rounded-sm bg-muted/40",
      className,
    )}
    {...props}
  />
);

Skeleton.displayName = "Skeleton";

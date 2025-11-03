import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../lib/cn.js";

const directionStyles = {
  column: "flex-col",
  row: "flex-row",
  "row-wrap": "flex-row flex-wrap",
} as const;

const gapStyles = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
} as const;

const alignStyles = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

const justifyStyles = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const;

export type StackDirection = keyof typeof directionStyles;
export type StackGap = keyof typeof gapStyles;
export type StackAlign = keyof typeof alignStyles;
export type StackJustify = keyof typeof justifyStyles;

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = "column",
      gap = "md",
      align = "stretch",
      justify = "start",
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex",
        directionStyles[direction],
        gapStyles[gap],
        alignStyles[align],
        justifyStyles[justify],
        className,
      )}
      {...props}
    />
  ),
);

Stack.displayName = "Stack";

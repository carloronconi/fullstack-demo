import { type HTMLAttributes, type DetailedHTMLProps, forwardRef } from "react";

import { cn } from "../lib/cn.js";

export type CardProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group/card overflow-hidden rounded-[var(--radius-lg)] border border-border/70 bg-surface shadow-[var(--shadow-card)] transition hover:border-border focus-within:border-primary/60",
        className,
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

export const CardHeader = forwardRef<
  HTMLDivElement,
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-3 border-b border-border/60 bg-surface-strong px-6 py-6 sm:flex-row sm:items-center sm:justify-between",
      className
    )}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold tracking-tight text-foreground sm:text-xl",
      className
    )}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted [&>strong]:text-foreground", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<
  HTMLDivElement,
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-6 px-6 py-6", className)}
    {...props}
  />
));

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
  HTMLDivElement,
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-4 border-t border-border/70 bg-surface px-6 py-5 sm:flex-row sm:items-center sm:justify-between",
      className
    )}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

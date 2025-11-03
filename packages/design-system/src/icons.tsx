import { type SVGProps } from "react";

import { cn } from "./lib/cn.js";

export type IconProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  size?: number | string;
};

const defaultClassName = "h-4 w-4";

const withSize = (size: IconProps["size"]) =>
  size === undefined ? undefined : size;

const svgProps = (
  className: string | undefined,
  size: IconProps["size"],
  strokeWidth: IconProps["strokeWidth"]
) => ({
  "aria-hidden": true,
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: cn(defaultClassName, className),
  width: withSize(size),
  height: withSize(size),
});

export const SparklesIcon = ({
  className,
  size,
  strokeWidth = 1.6,
  ...props
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    {...svgProps(className, size, strokeWidth)}
    {...props}
  >
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="m5 4-.5 1.5L3 6l1.5.5L5 8l.5-1.5L7 6l-1.5-.5L5 4z" />
    <path d="m19 16-.5 1.5L17 18l1.5.5L19 20l.5-1.5L21 18l-1.5-.5L19 16z" />
  </svg>
);

export const ArrowRightIcon = ({
  className,
  size,
  strokeWidth = 1.6,
  ...props
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    {...svgProps(className, size, strokeWidth)}
    {...props}
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const ArrowLeftIcon = ({
  className,
  size,
  strokeWidth = 1.6,
  ...props
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    {...svgProps(className, size, strokeWidth)}
    {...props}
  >
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
);

export const ArrowUpIcon = ({
  className,
  size,
  strokeWidth = 1.6,
  ...props
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    {...svgProps(className, size, strokeWidth)}
    {...props}
  >
    <path d="M12 19V5" />
    <path d="m6 11 6-6 6 6" />
  </svg>
);

export const ArrowDownIcon = ({
  className,
  size,
  strokeWidth = 1.6,
  ...props
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    {...svgProps(className, size, strokeWidth)}
    {...props}
  >
    <path d="M12 5v14" />
    <path d="m18 13-6 6-6-6" />
  </svg>
);

export const CheckIcon = ({
  className,
  size,
  strokeWidth = 1.6,
  ...props
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    {...svgProps(className, size, strokeWidth)}
    {...props}
  >
    <path d="m5 13 4 4 10-10" />
  </svg>
);

export const CloseIcon = ({
  className,
  size,
  strokeWidth = 1.6,
  ...props
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    {...svgProps(className, size, strokeWidth)}
    {...props}
  >
    <path d="M6 6l12 12" />
    <path d="M6 18 18 6" />
  </svg>
);

export const SearchIcon = ({
  className,
  size,
  strokeWidth = 1.6,
  ...props
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    {...svgProps(className, size, strokeWidth)}
    {...props}
  >
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const InfoCircleIcon = ({
  className,
  size,
  strokeWidth = 1.6,
  ...props
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    {...svgProps(className, size, strokeWidth)}
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 9h.01" />
    <path d="M11.5 12h1v4h-1" />
  </svg>
);

export const AlertTriangleIcon = ({
  className,
  size,
  strokeWidth = 1.6,
  ...props
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    {...svgProps(className, size, strokeWidth)}
    {...props}
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

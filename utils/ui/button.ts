import { cn } from "~/lib/utils";

const baseButtonClasses =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background";

const variantClasses = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
} as const;

const sizeClasses = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
} as const;

export type UiButtonVariant = keyof typeof variantClasses;
export type UiButtonSize = keyof typeof sizeClasses;

interface UiButtonClassOptions {
  variant?: UiButtonVariant;
  size?: UiButtonSize;
  className?: Parameters<typeof cn>[0];
}

export function uiButtonClass(options: UiButtonClassOptions = {}): string {
  const { variant = "default", size = "default", className } = options;

  return cn(baseButtonClasses, variantClasses[variant], sizeClasses[size], className);
}

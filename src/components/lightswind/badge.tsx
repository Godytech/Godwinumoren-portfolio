import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  size?: "default" | "sm" | "lg";
}

export function Badge({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<string, string> = {
    default: "bg-primary text-primary-foreground border-transparent",
    secondary: "bg-muted text-foreground border-transparent",
    destructive: "bg-red-500/10 text-red-500 border-red-500/20",
    outline: "text-foreground border-foreground/15 bg-background/50 backdrop-blur-md",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  const sizeStyles: Record<string, string> = {
    sm: "px-2 py-0.5 text-[10px]",
    default: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-semibold transition-colors shadow-xs",
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size] || sizeStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

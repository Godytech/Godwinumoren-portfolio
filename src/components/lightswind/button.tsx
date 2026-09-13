import * as React from "react";
import { cn } from "../../lib/utils";

const buttonStyles = {
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "border border-foreground/15 bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-muted text-foreground hover:bg-muted/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  },
  size: {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-12 rounded-xl px-8 text-base",
    icon: "h-10 w-10",
  },
};

export interface ButtonOptions {
  variant?: keyof typeof buttonStyles.variant;
  size?: keyof typeof buttonStyles.size;
  className?: string;
}

export function buttonVariants(options: ButtonOptions = {}) {
  const variantKey = options.variant || "default";
  const sizeKey = options.size || "default";
  const variantClass = buttonStyles.variant[variantKey] || buttonStyles.variant.default;
  const sizeClass = buttonStyles.size[sizeKey] || buttonStyles.size.default;

  return cn(
    `inline-flex items-center justify-center gap-2 whitespace-nowrap 
    rounded-xl font-semibold ring-offset-background cursor-pointer
    transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-ring focus-visible:ring-offset-2 
    disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none 
    [&_svg]:size-4 [&_svg]:shrink-0 active:scale-98`,
    variantClass,
    sizeClass,
    options.className
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonOptions {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };

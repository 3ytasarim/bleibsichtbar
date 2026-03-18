import * as React from "react";
import { motion } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const sharedBase =
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "disabled:pointer-events-none disabled:opacity-50 overflow-hidden";

const cssBase = sharedBase +
  " transition-all duration-200 hover:-translate-y-[2px] hover:scale-[1.03] active:scale-[0.97] active:translate-y-0";

const variantClass: Record<string, string> = {
  default:
    "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/20",
  accent:
    "text-white shadow-md hover:shadow-lg hover:shadow-accent/35 " +
    "[background:linear-gradient(135deg,#ff6b35_0%,#e8522a_100%)]",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md",
  outline:
    "border-2 border-input bg-background hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-md",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost:
    "hover:bg-accent/10 hover:text-accent",
  link:
    "text-primary underline-offset-4 hover:underline",
};

const sizeClass: Record<string, string> = {
  default: "h-11 px-6 py-2",
  sm: "h-9 rounded-xl px-4 text-xs",
  lg: "h-14 px-8 text-base",
  icon: "h-11 w-11",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {

    const varCls = variantClass[variant] ?? "";
    const sizCls = sizeClass[size] ?? "";

    /* ── asChild: render as child element (e.g. Link) with CSS transitions ── */
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(cssBase, varCls, sizCls, className)}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    /* ── Regular button: Framer Motion with shimmer ── */
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(sharedBase, varCls, sizCls, className)}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97, y: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {/* Shimmer sweep for accent/default */}
        {(variant === "accent" || variant === "default") && (
          <motion.span
            className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)" }}
            animate={{ x: ["-100%", "220%"] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
          />
        )}
        <span className="relative flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export { Button };

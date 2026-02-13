import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-white text-black hover:bg-white/90 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]",
                destructive:
                    "bg-red-500 text-white hover:bg-red-500/90 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]",
                outline:
                    "border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white backdrop-blur-sm",
                secondary:
                    "bg-blue-600 text-white hover:bg-blue-600/80 shadow-[0_0_20px_-5px_rgba(37,99,235,0.3)]",
                ghost: "hover:bg-white/10 hover:text-white",
                link: "text-white underline-offset-4 hover:underline",
                glow: "bg-blue-600/20 text-blue-400 border border-blue-500/50 hover:bg-blue-600/30 shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            // @ts-ignore - Radix Slot type issues
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };

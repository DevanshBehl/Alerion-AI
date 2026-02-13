import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-white text-black hover:bg-white/80",
                secondary:
                    "border-transparent bg-white/10 text-white hover:bg-white/20",
                destructive:
                    "border-transparent bg-red-500 text-white hover:bg-red-500/80 shadow-[0_0_10px_-3px_rgba(239,68,68,0.5)]",
                outline: "text-white border-white/20",
                success: "border-transparent bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]",
                warning: "border-transparent bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_-3px_rgba(245,158,11,0.3)]",
                info: "border-transparent bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_-3px_rgba(59,130,246,0.3)]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };

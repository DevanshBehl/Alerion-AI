import { cn } from '../../lib/utils';
import type { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-success-light text-success border-emerald-200',
    warning: 'bg-warning-light text-warning border-amber-200',
    destructive: 'bg-danger-light text-danger border-red-200',
    outline: 'bg-transparent text-text-secondary border-border',
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                variantStyles[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

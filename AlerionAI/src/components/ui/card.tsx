import { cn } from '../../lib/utils';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'bg-surface rounded-xl border border-border p-6',
                hover && 'transition-shadow duration-200 hover:shadow-md',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('mb-4', className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={cn('text-lg font-semibold text-text-primary', className)} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn(className)} {...props}>
            {children}
        </div>
    );
}

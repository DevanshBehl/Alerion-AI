import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlowButtonProps extends HTMLMotionProps<'button'> {
    children: ReactNode;
    variant?: 'primary' | 'danger' | 'ghost';
    isLoading?: boolean;
}

export const GlowButton = ({
    children,
    className = '',
    variant = 'primary',
    isLoading = false,
    ...props
}: GlowButtonProps) => {
    const baseStyles = 'relative px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center overflow-hidden';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_0px_rgba(59,130,246,0.7)]',
        danger: 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_0px_rgba(239,68,68,0.7)]',
        ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/10',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-inherit">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
            ) : null}
            <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{children}</span>

            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shine_1s_ease-in-out]" />
        </motion.button>
    );
};

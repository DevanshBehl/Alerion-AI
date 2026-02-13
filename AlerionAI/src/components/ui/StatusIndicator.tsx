import { motion } from 'framer-motion';

interface StatusIndicatorProps {
    status: 'normal' | 'warning' | 'critical' | 'info';
    label?: string;
    showLabel?: boolean;
}

export const StatusIndicator = ({ status, label, showLabel = true }: StatusIndicatorProps) => {
    const colors = {
        normal: 'bg-emerald-500 shadow-emerald-500/50',
        warning: 'bg-amber-500 shadow-amber-500/50',
        critical: 'bg-red-500 shadow-red-500/50',
        info: 'bg-blue-500 shadow-blue-500/50',
    };

    const pulseColors = {
        normal: 'bg-emerald-500',
        warning: 'bg-amber-500',
        critical: 'bg-red-500',
        info: 'bg-blue-500',
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
                <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColors[status]}`}
                />
                <span className={`relative inline-flex rounded-full h-3 w-3 shadow-[0_0_10px] ${colors[status]}`} />
            </div>
            {showLabel && label && (
                <span className={`text-sm font-medium ${status === 'normal' ? 'text-emerald-400' :
                        status === 'warning' ? 'text-amber-400' :
                            status === 'info' ? 'text-blue-400' : 'text-red-400'
                    }`}>
                    {label}
                </span>
            )}
        </div>
    );
};

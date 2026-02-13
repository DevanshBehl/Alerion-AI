import { motion } from 'framer-motion';
import { useMachineStats } from '../../hooks/useTelemetry';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { Activity, Server, AlertTriangle } from 'lucide-react';

export const MachineOverview = () => {
    const { total, active, alerts } = useMachineStats();

    const stats = [
        {
            label: 'Total Machines',
            value: total,
            icon: Server,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            label: 'Active Nodes',
            value: active,
            icon: Activity,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        {
            label: 'Active Alerts',
            value: alerts,
            icon: AlertTriangle,
            color: 'text-rose-400',
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative overflow-hidden bg-white/5 border ${stat.border} rounded-2xl p-6 backdrop-blur-md group hover:bg-white/[0.07] transition-colors`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        {/* Sparkline decoration */}
                        <div className="flex items-end gap-1 h-8 opacity-20">
                            {[40, 70, 50, 90, 60].map((h, i) => (
                                <div
                                    key={i}
                                    className={`w-1 rounded-t ${stat.color.replace('text-', 'bg-')}`}
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-1">
                            {stat.label}
                        </h3>
                        <div className={`text-4xl font-bold text-white font-mono tracking-tight flex items-baseline gap-2`}>
                            <AnimatedCounter value={stat.value} />
                            <span className={`text-sm font-medium ${stat.color} opacity-80`}>
                                {index === 0 ? 'Units' : index === 1 ? 'Online' : 'Critical'}
                            </span>
                        </div>
                    </div>

                    {/* Background Glow */}
                    <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.bg} rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity`} />
                </motion.div>
            ))}
        </div>
    );
};

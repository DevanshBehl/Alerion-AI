import { motion } from 'framer-motion';
import { useMachineStats } from '../../hooks/useTelemetry';
import { Server, Activity, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';

export const MachineOverview = () => {
    const { total, active, alerts } = useMachineStats();

    const stats = [
        {
            label: 'Total Machines',
            value: total,
            unit: 'Units',
            icon: Server,
            iconBg: 'bg-accent-light',
            iconColor: 'text-accent',
        },
        {
            label: 'Active Nodes',
            value: active,
            unit: 'Online',
            icon: Activity,
            iconBg: 'bg-success-light',
            iconColor: 'text-success',
        },
        {
            label: 'Active Alerts',
            value: alerts,
            unit: 'Critical',
            icon: AlertTriangle,
            iconBg: 'bg-danger-light',
            iconColor: 'text-danger',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                                <stat.icon size={18} className={stat.iconColor} />
                            </div>
                            <div>
                                <p className="text-sm text-text-muted">{stat.label}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-bold text-text-primary tabular-nums">
                                        {stat.value}
                                    </span>
                                    <span className="text-xs text-text-muted">{stat.unit}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};

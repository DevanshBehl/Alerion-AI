import { motion } from 'framer-motion';
import { useTelemetry } from '../../hooks/useTelemetry';
import { CheckCircle2, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

const statusConfig = {
    normal: {
        icon: CheckCircle2,
        variant: 'success' as const,
        label: 'Normal',
    },
    warning: {
        icon: AlertTriangle,
        variant: 'warning' as const,
        label: 'Warning',
    },
    critical: {
        icon: AlertCircle,
        variant: 'destructive' as const,
        label: 'Critical',
    },
};

export const MachineStatusCards = () => {
    const { machines, selectedMachineId, setSelectedMachine } = useTelemetry();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {machines.map((machine) => {
                const config = statusConfig[machine.status];
                const StatusIcon = config.icon;
                const isSelected = selectedMachineId === machine.id;

                return (
                    <motion.div
                        key={machine.id}
                        onClick={() => setSelectedMachine(isSelected ? null : machine.id)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.15 }}
                        className="cursor-pointer"
                    >
                        <Card
                            className={cn(
                                'h-full transition-all duration-200 border-l-4',
                                isSelected
                                    ? 'border-l-accent bg-accent-light/30 shadow-sm'
                                    : 'border-l-transparent hover:shadow-sm'
                            )}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-colors',
                                        isSelected
                                            ? 'bg-accent text-white'
                                            : 'bg-background text-text-muted'
                                    )}
                                >
                                    {machine.name.charAt(0)}
                                </div>
                                <Badge variant={config.variant}>
                                    <StatusIcon size={10} />
                                    {config.label}
                                </Badge>
                            </div>

                            <h4
                                className={cn(
                                    'font-semibold text-sm mb-0.5 truncate',
                                    isSelected ? 'text-accent' : 'text-text-primary'
                                )}
                            >
                                {machine.name}
                            </h4>
                            <p className="text-xs text-text-muted font-mono mb-3">{machine.id}</p>

                            <div className="flex items-center gap-1.5 text-xs text-text-muted bg-background rounded-md px-2.5 py-1.5">
                                <Clock size={11} />
                                <span className="font-mono">
                                    {new Date(machine.lastUpdate).toLocaleTimeString()}
                                </span>
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
};

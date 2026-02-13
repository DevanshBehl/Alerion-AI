import { motion } from 'framer-motion';
import { useTelemetry } from '../../hooks/useTelemetry';
import { CheckCircle2, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

const statusConfig = {
    normal: { icon: CheckCircle2, variant: 'success' as const },
    warning: { icon: AlertTriangle, variant: 'warning' as const },
    critical: { icon: AlertCircle, variant: 'destructive' as const },
};

export const MachineStatusCards = () => {
    const { machines, selectedMachineId, setSelectedMachine } = useTelemetry();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {machines.map((machine) => {
                const StatusIcon = statusConfig[machine.status].icon;
                const badgeVariant = statusConfig[machine.status].variant;

                return (
                    <motion.div
                        key={machine.id}
                        layoutId={`machine-${machine.id}`}
                        onClick={() => setSelectedMachine(machine.id === selectedMachineId ? null : machine.id)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: selectedMachineId === machine.id ? -5 : 0,
                        }}
                        whileHover={{ y: -5 }}
                        className="relative group"
                    >
                        <Card
                            className={cn(
                                "h-full p-5 transition-all duration-300 cursor-pointer overflow-hidden border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20",
                                selectedMachineId === machine.id && "border-blue-500/50 bg-blue-500/10 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
                            )}
                        >
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-gradient-to-br from-white/10 to-transparent transition-transform duration-300 group-hover:scale-110",
                                    selectedMachineId === machine.id && "from-blue-500/20 to-blue-600/5 border-blue-500/30"
                                )}>
                                    <span className="font-bold text-white/50 group-hover:text-white transition-colors">
                                        {machine.name.charAt(0)}
                                    </span>
                                </div>
                                <Badge variant={badgeVariant} className="gap-1.5 px-2.5 py-1">
                                    <StatusIcon size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                        {machine.status}
                                    </span>
                                </Badge>
                            </div>

                            <div className="relative z-10">
                                <h4 className={cn(
                                    "font-semibold text-white mb-0.5 truncate transition-colors",
                                    selectedMachineId === machine.id ? "text-blue-100" : "group-hover:text-blue-200"
                                )}>
                                    {machine.name}
                                </h4>
                                <p className="text-xs text-white/40 font-mono mb-4">{machine.id}</p>

                                <div className="flex items-center gap-2 text-xs text-white/30 bg-black/20 rounded-lg p-2 border border-white/5">
                                    <Clock size={12} />
                                    <span className="font-mono">
                                        {new Date(machine.lastUpdate).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>

                            {/* Gradient Textures */}
                            <div className={cn(
                                "absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[60px] opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-20 bg-white",
                                selectedMachineId === machine.id && "bg-blue-500 opacity-20"
                            )} />
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
};

import { motion, AnimatePresence } from 'framer-motion';
import { useLatestAlerts } from '../../hooks/useTelemetry';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';

export const AlertPanel = () => {
    const alerts = useLatestAlerts();

    return (
        <Card className="h-full min-h-[400px] flex flex-col border-none bg-transparent shadow-none">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        Active Alerts
                    </CardTitle>
                    <Badge variant="outline" className="font-mono text-[10px] bg-white/5 border-white/10 uppercase tracking-widest">
                        LIVE
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden relative">
                <ScrollArea className="h-full px-6 pb-6">
                    <div className="space-y-3 pt-2">
                        <AnimatePresence initial={false} mode="popLayout">
                            {alerts.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-[300px] flex flex-col items-center justify-center text-white/30 space-y-4"
                                >
                                    <CheckCircle size={48} className="text-emerald-500/20" />
                                    <p>System Normal. No anomalies.</p>
                                </motion.div>
                            ) : (
                                alerts.map((alert) => (
                                    <motion.div
                                        key={alert.id}
                                        layout
                                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    >
                                        <div className={cn(
                                            "p-4 rounded-xl border backdrop-blur-sm transition-all hover:bg-white/5",
                                            alert.severity === 'critical'
                                                ? 'bg-red-500/10 border-red-500/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]'
                                                : 'bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.1)]'
                                        )}>
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {alert.severity === 'critical' ? (
                                                            <AlertCircle size={14} className="text-red-400" />
                                                        ) : (
                                                            <AlertTriangle size={14} className="text-amber-400" />
                                                        )}
                                                        <span className={cn(
                                                            "text-xs font-bold uppercase tracking-wider",
                                                            alert.severity === 'critical' ? 'text-red-400' : 'text-amber-400'
                                                        )}>
                                                            {alert.severity}
                                                        </span>
                                                        {alert.failure_type && alert.failure_type !== 'No Failure' && (
                                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-white/10 text-white/50">
                                                                {alert.failure_type}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-white/90 font-medium leading-tight mb-2">
                                                        {alert.message}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-xs text-white/40">
                                                        <span>
                                                            Machine: <span className="text-white/60">{alert.machineName}</span>
                                                        </span>
                                                        {alert.confidence !== undefined && (
                                                            <span>
                                                                Confidence: <span className="text-white/60">{(alert.confidence * 100).toFixed(1)}%</span>
                                                            </span>
                                                        )}
                                                        {alert.anomalyScore !== undefined && (
                                                            <span>
                                                                Score: <span className="text-white/60">{alert.anomalyScore.toFixed(3)}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-mono text-white/30 whitespace-nowrap bg-black/20 px-1.5 py-0.5 rounded">
                                                    {new Date(alert.timestamp).toLocaleTimeString([], { hour12: false })}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </ScrollArea>

                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] pointer-events-none" />
            </CardContent>
        </Card>
    );
};

import { motion, AnimatePresence } from 'framer-motion';
import { useLatestAlerts } from '../../hooks/useTelemetry';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export const AlertPanel = () => {
    const alerts = useLatestAlerts();

    return (
        <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3 mb-0 border-b border-border-light">
                <CardTitle className="flex items-center gap-2 text-base">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-danger" />
                    </span>
                    Active Alerts
                </CardTitle>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                    Live
                </Badge>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto pt-4">
                <div className="space-y-3">
                    <AnimatePresence initial={false} mode="popLayout">
                        {alerts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-[300px] flex flex-col items-center justify-center text-text-muted space-y-3"
                            >
                                <CheckCircle size={40} className="text-success opacity-40" />
                                <p className="text-sm">All systems normal — no anomalies detected.</p>
                            </motion.div>
                        ) : (
                            alerts.map((alert) => (
                                <motion.div
                                    key={alert.id}
                                    layout
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div
                                        className={cn(
                                            'p-4 rounded-lg border-l-4 bg-surface-alt transition-colors hover:bg-gray-50',
                                            alert.severity === 'critical'
                                                ? 'border-l-danger'
                                                : 'border-l-warning'
                                        )}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {alert.severity === 'critical' ? (
                                                        <AlertCircle size={14} className="text-danger" />
                                                    ) : (
                                                        <AlertTriangle size={14} className="text-warning" />
                                                    )}
                                                    <span
                                                        className={cn(
                                                            'text-xs font-semibold uppercase tracking-wider',
                                                            alert.severity === 'critical'
                                                                ? 'text-danger'
                                                                : 'text-warning'
                                                        )}
                                                    >
                                                        {alert.severity}
                                                    </span>
                                                    {alert.failure_type &&
                                                        alert.failure_type !== 'No Failure' && (
                                                            <Badge variant="outline" className="text-[9px]">
                                                                {alert.failure_type}
                                                            </Badge>
                                                        )}
                                                </div>
                                                <p className="text-sm text-text-primary font-medium leading-snug mb-2">
                                                    {alert.message}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                                                    <span>
                                                        Machine:{' '}
                                                        <span className="text-text-secondary">
                                                            {alert.machineName}
                                                        </span>
                                                    </span>
                                                    {alert.confidence !== undefined && (
                                                        <span>
                                                            Confidence:{' '}
                                                            <span className="text-text-secondary">
                                                                {(alert.confidence * 100).toFixed(1)}%
                                                            </span>
                                                        </span>
                                                    )}
                                                    {alert.anomalyScore !== undefined && (
                                                        <span>
                                                            Score:{' '}
                                                            <span className="text-text-secondary">
                                                                {alert.anomalyScore.toFixed(3)}
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-mono text-text-muted whitespace-nowrap bg-background px-2 py-0.5 rounded">
                                                {new Date(alert.timestamp).toLocaleTimeString([], {
                                                    hour12: false,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
};

import { useEffect, useState } from 'react';
import { TelemetryService } from '../services/telemetryService';
import { Navbar } from '../components/layout/Navbar';
import { MachineOverview } from '../components/dashboard/MachineOverview';
import { TelemetryChart } from '../components/dashboard/TelemetryChart';
import { AlertPanel } from '../components/dashboard/AlertPanel';
import { MachineStatusCards } from '../components/dashboard/MachineStatusCards';
import { PageTransition } from '../components/layout/PageTransition';
import { useConnectionStatus } from '../hooks/useTelemetry';
import { Wifi, WifiOff, ShieldCheck, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const Dashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const isConnected = useConnectionStatus();

    useEffect(() => {
        TelemetryService.connect();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => {
            TelemetryService.disconnect();
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <PageTransition>
                <main className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                                    System Overview
                                </h1>
                                <Badge>Operator View</Badge>
                            </div>
                            <p className="text-text-muted text-sm">
                                Real-time telemetry monitoring and distributed anomaly detection.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-surface border border-border rounded-lg px-4 py-2.5">
                            <div className="flex items-center gap-2">
                                {isConnected ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                        <span className="text-xs font-medium text-success">LIVE — KAFKA STREAM</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-danger" />
                                        <span className="text-xs font-medium text-danger">DISCONNECTED</span>
                                    </>
                                )}
                            </div>
                            <div className="w-px h-4 bg-border" />
                            <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                {isConnected ? (
                                    <Wifi size={12} className="text-success" />
                                ) : (
                                    <WifiOff size={12} className="text-danger" />
                                )}
                                <span className={isConnected ? 'text-success' : 'text-danger'}>
                                    {isConnected ? 'WebSocket' : 'Reconnecting...'}
                                </span>
                            </div>
                            <div className="w-px h-4 bg-border" />
                            <span className="text-xs text-text-muted font-mono tabular-nums">
                                {currentTime.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <MachineOverview />

                    {/* Chart + Alerts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" style={{ height: '450px' }}>
                        <div className="lg:col-span-2 h-full overflow-hidden">
                            <TelemetryChart />
                        </div>
                        <div className="h-full overflow-hidden">
                            <AlertPanel />
                        </div>
                    </div>

                    {/* Machine Fleet */}
                    <motion.section
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="pt-4"
                    >
                        <div className="flex items-center gap-4 mb-5">
                            <div className="p-2 bg-accent-light rounded-lg">
                                <ShieldCheck size={16} className="text-accent" />
                            </div>
                            <h2 className="text-lg font-semibold text-text-primary">Machine Fleet Status</h2>
                            <div className="h-px flex-1 bg-border" />
                            <Button variant="secondary" size="sm">
                                <Terminal size={14} />
                                Export Log
                            </Button>
                        </div>
                        <MachineStatusCards />
                    </motion.section>
                </main>
            </PageTransition>
        </div>
    );
};

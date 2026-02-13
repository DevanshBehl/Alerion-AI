import { useEffect, useState } from 'react';
import { TelemetryService } from '../services/telemetryService';
import { Navbar } from '../components/layout/Navbar';
import { MachineOverview } from '../components/dashboard/MachineOverview';
import { TelemetryChart } from '../components/dashboard/TelemetryChart';
import { AlertPanel } from '../components/dashboard/AlertPanel';
import { MachineStatusCards } from '../components/dashboard/MachineStatusCards';
import { PageTransition } from '../components/layout/PageTransition';
import { ShieldCheck, Wifi, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { BentoGrid } from '../components/ui/bento-grid';
import { BackgroundGradient } from '../components/ui/background-gradient';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Spotlight } from '../components/ui/spotlight';

export const Dashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        TelemetryService.startTelemetrySimulation();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => {
            TelemetryService.stopTelemetrySimulation();
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans overflow-hidden">
            {/* Ambient Background Spotlight - Reuse from Landing for consistency */}
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 opacity-50" fill="white" />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
            </div>

            <Navbar />

            <PageTransition>
                <main className="relative z-10 pt-24 pb-12 px-6 max-w-[1600px] mx-auto space-y-8">

                    {/* Header with Ticker */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold tracking-tight text-white">System Overview</h1>
                                <Badge variant="secondary" className="uppercase tracking-widest text-[10px]">
                                    Operator View
                                </Badge>
                            </div>
                            <p className="text-white/40 text-sm max-w-lg">
                                Real-time telemetry monitoring and distributed anomaly detection.
                            </p>
                        </div>

                        <Card className="flex items-center gap-6 px-4 py-2 bg-black/40 backdrop-blur-md border-white/10">
                            <div className="flex items-center gap-2">
                                <span className="block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-mono text-white/60">SYSTEM ONLINE</span>
                            </div>
                            <div className="w-[1px] h-4 bg-white/10" />
                            <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                                <Wifi size={12} />
                                <span className="text-emerald-400">12ms LATENCY</span>
                            </div>
                            <div className="w-[1px] h-4 bg-white/10" />
                            <div className="text-xs text-white/40 font-mono">
                                {currentTime.toLocaleTimeString()}
                            </div>
                        </Card>
                    </div>

                    <MachineOverview />

                    <BentoGrid className="max-w-none md:auto-rows-[450px]">
                        <div className="md:col-span-2 row-span-1">
                            <BackgroundGradient containerClassName="h-full" className="h-full bg-black p-0 rounded-[22px] overflow-hidden">
                                <div className="h-full w-full p-1 bg-black rounded-[20px]">
                                    <TelemetryChart />
                                </div>
                            </BackgroundGradient>
                        </div>

                        <div className="md:col-span-1 row-span-1">
                            <BackgroundGradient containerClassName="h-full" className="h-full bg-black p-0 rounded-[22px] overflow-hidden">
                                <div className="h-full w-full p-1 bg-black rounded-[20px]">
                                    <AlertPanel />
                                </div>
                            </BackgroundGradient>
                        </div>
                    </BentoGrid>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="pt-6"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                <ShieldCheck size={16} className="text-blue-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Machine Fleet Status</h2>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                            <Button variant="outline" size="sm" className="gap-2">
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

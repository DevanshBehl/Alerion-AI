import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';
import { Spotlight, SpotlightCard } from '../components/ui/spotlight';
import { TextGenerateEffect } from '../components/ui/text-generate-effect';
import { BackgroundBeams } from '../components/ui/background-beams';
import { Activity, Cpu, Database, Zap, Shield, ArrowRight, Layers, BarChart3 } from 'lucide-react';

export const Landing = () => {
    return (
        <div className="relative overflow-hidden bg-black min-h-screen font-sans selection:bg-blue-500/30">

            {/* Ambient Background Spotlights */}
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm relative z-20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-white/70 uppercase tracking-widest">v1.0 Now Live</span>
                </div>

                <div className="relative z-20 mb-8">
                    <TextGenerateEffect
                        words="Real-Time Industrial Intelligence"
                        className="text-5xl md:text-7xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-tight"
                    />
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed relative z-20"
                >
                    A distributed anomaly detection platform built for the future of manufacturing.
                    Connect edge nodes, stream data via Kafka, and predict failures before they happen.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20"
                >
                    <Link to="/signup">
                        <HoverBorderGradient containerClassName="rounded-full" as="button" className="flex items-center space-x-2 bg-black text-white">
                            <span>Get Started</span>
                        </HoverBorderGradient>
                    </Link>
                    <Link to="/docs">
                        <button className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-white font-medium flex items-center gap-2">
                            View Documentation <ArrowRight size={16} />
                        </button>
                    </Link>
                </motion.div>

                {/* Interactive Background Beams */}
                <BackgroundBeams className="opacity-40" />
            </section>

            {/* Architecture Visualization Section */}
            <section className="py-24 px-6 border-y border-white/5 bg-white/[0.02] relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-white">Distributed Architecture</h2>
                        <p className="text-white/40 max-w-xl mx-auto">
                            Simulate an entire industrial IoT fleet right from your browser.
                            Built on event-driven principles for massive scalability.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center justify-items-center relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -z-10" />

                        {/* Nodes */}
                        {[
                            { icon: Cpu, label: 'Edge Nodes', desc: 'IoT Simulation' },
                            { icon: Layers, label: 'Kafka', desc: 'Event Streaming' },
                            { icon: Database, label: 'Fog Node', desc: 'Processing' },
                            { icon: Activity, label: 'ML Model', desc: 'Anomaly Detection' },
                            { icon: BarChart3, label: 'Dashboard', desc: 'Real-time UI' },
                        ].map((node, i) => (
                            <motion.div
                                key={node.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="w-full max-w-[200px]"
                            >
                                <SpotlightCard className="p-6 h-full flex-col text-center bg-black/50 backdrop-blur-md">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                                        <node.icon className="text-white/70 group-hover:text-blue-400" size={24} />
                                    </div>
                                    <h3 className="font-semibold mb-1 text-white">{node.label}</h3>
                                    <p className="text-xs text-white/40">{node.desc}</p>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid (Spotlight Cards) */}
            <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-4 text-white">Enterprise-Grade Features</h2>
                    <p className="text-white/40">Everything you need to monitor mission-critical infrastructure.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <SpotlightCard className="h-full p-8 items-start justify-start flex-col bg-transparent">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Activity size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                                    <Zap className="text-blue-400" size={20} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-white">Real-Time Streaming</h3>
                                <p className="text-white/50 max-w-md">
                                    Sub-millisecond latency updates from edge to dashboard.
                                    Visualized with high-performance charts capable of rendering thousands of data points without lag.
                                </p>
                            </div>
                        </SpotlightCard>
                    </div>

                    <SpotlightCard className="h-full p-8 items-start justify-start flex-col bg-transparent">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                            <Database className="text-emerald-400" size={20} />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">Distributed Edge</h3>
                        <p className="text-white/50 text-sm">
                            Simulated fog computing architecture that scales horizontally across regions.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="h-full p-8 items-start justify-start flex-col bg-transparent">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
                            <Cpu className="text-purple-400" size={20} />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">ML Prediction</h3>
                        <p className="text-white/50 text-sm">
                            Advanced statistical models to detect anomalies in vibration, temperature, and pressure patterns.
                        </p>
                    </SpotlightCard>

                    <div className="col-span-1 md:col-span-2">
                        <SpotlightCard className="h-full p-8 items-start justify-start flex-col bg-transparent">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-6">
                                <Shield className="text-amber-400" size={20} />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">Secure by Design</h3>
                            <p className="text-white/50 max-w-md">
                                Enterprise security standards including JWT authentication, role-based access control, and encrypted data streams.
                            </p>
                        </SpotlightCard>
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-24 px-6 border-t border-white/5 bg-black relative z-10">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12 text-white">Built for Industry</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Smart Factories', desc: 'Monitor assembly lines and predict equipment failure.' },
                            { title: 'Energy Sector', desc: 'Track turbine performance and grid stability in real-time.' },
                            { title: 'Heavy Machinery', desc: 'Preventative maintenance for mining and construction assets.' }
                        ].map((useCase) => (
                            <SpotlightCard key={useCase.title} className="p-6 h-full items-start justify-start flex-col bg-white/5 hover:bg-white/10 transition-colors text-left border-transparent">
                                <h3 className="text-lg font-semibold mb-2 text-white">{useCase.title}</h3>
                                <p className="text-white/40 text-sm">{useCase.desc}</p>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

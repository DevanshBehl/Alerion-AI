import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Activity, Cpu, Database, Zap, Shield, ArrowRight, Layers, BarChart3 } from 'lucide-react';

export const Landing = () => {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="pt-20 pb-24 px-6 max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-light border border-emerald-200 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        <span className="text-xs font-medium text-success uppercase tracking-wider">
                            v1.0 Now Live
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight mb-6">
                        Real-Time Industrial
                        <br />
                        <span className="text-accent">Intelligence</span>
                    </h1>

                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
                        A distributed anomaly detection platform built for the future of manufacturing.
                        Connect edge nodes, stream data via Kafka, and predict failures before they happen.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/signup">
                            <Button size="lg">
                                Get Started <ArrowRight size={16} />
                            </Button>
                        </Link>
                        <Link to="/docs">
                            <Button variant="secondary" size="lg">
                                View Documentation
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Architecture Flow */}
            <section className="py-20 px-6 border-y border-border bg-surface">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-2xl font-bold text-text-primary mb-3">Distributed Architecture</h2>
                        <p className="text-text-secondary max-w-xl mx-auto">
                            Simulate an entire industrial IoT fleet. Built on event-driven principles for massive scalability.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center justify-items-center relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-px bg-border z-0" />

                        {[
                            { icon: Cpu, label: 'Edge Nodes', desc: 'IoT Simulation' },
                            { icon: Layers, label: 'Kafka', desc: 'Event Streaming' },
                            { icon: Database, label: 'Fog Node', desc: 'Processing' },
                            { icon: Activity, label: 'ML Model', desc: 'Anomaly Detection' },
                            { icon: BarChart3, label: 'Dashboard', desc: 'Real-time UI' },
                        ].map((node, i) => (
                            <motion.div
                                key={node.label}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                viewport={{ once: true }}
                                className="w-full max-w-[170px] relative z-10"
                            >
                                <Card hover className="text-center py-6">
                                    <div className="w-11 h-11 rounded-lg bg-accent-light flex items-center justify-center mx-auto mb-3">
                                        <node.icon className="text-accent" size={20} />
                                    </div>
                                    <h3 className="font-semibold text-sm text-text-primary mb-0.5">{node.label}</h3>
                                    <p className="text-xs text-text-muted">{node.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 max-w-5xl mx-auto">
                <div className="mb-14">
                    <h2 className="text-2xl font-bold text-text-primary mb-3">Enterprise-Grade Features</h2>
                    <p className="text-text-secondary">Everything you need to monitor mission-critical infrastructure.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                        <Card hover className="h-full">
                            <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center mb-5">
                                <Zap className="text-accent" size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Real-Time Streaming</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Sub-millisecond latency updates from edge to dashboard. Visualized with high-performance charts capable of rendering thousands of data points without lag.
                            </p>
                        </Card>
                    </div>

                    <Card hover>
                        <div className="w-10 h-10 rounded-lg bg-success-light flex items-center justify-center mb-5">
                            <Database className="text-success" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Distributed Edge</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Simulated fog computing architecture that scales horizontally across regions.
                        </p>
                    </Card>

                    <Card hover>
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-5">
                            <Cpu className="text-purple-600" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">ML Prediction</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Advanced statistical models to detect anomalies across rotational speed, torque, tool wear, and temperature.
                        </p>
                    </Card>

                    <div className="md:col-span-2">
                        <Card hover className="h-full">
                            <div className="w-10 h-10 rounded-lg bg-warning-light flex items-center justify-center mb-5">
                                <Shield className="text-warning" size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Secure by Design</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Enterprise security standards including JWT authentication, role-based access control, and encrypted data streams.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 px-6 border-t border-border bg-surface">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-10">Built for Industry</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            { title: 'Smart Factories', desc: 'Monitor assembly lines and predict equipment failure in real-time.' },
                            { title: 'Energy Sector', desc: 'Track turbine performance and grid stability with continuous telemetry.' },
                            { title: 'Heavy Machinery', desc: 'Preventative maintenance for mining and construction assets at scale.' },
                        ].map((useCase) => (
                            <Card key={useCase.title} hover className="text-left">
                                <h3 className="text-base font-semibold text-text-primary mb-2">{useCase.title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">{useCase.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

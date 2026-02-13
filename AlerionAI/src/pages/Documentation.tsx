import { useState } from 'react';
import { CodeBlock } from '../components/ui/CodeBlock';
import { ChevronRight, Layers, FileJson, Server, Terminal } from 'lucide-react';
import { BackgroundBeams } from '../components/ui/background-beams';
import { SpotlightCard } from '../components/ui/spotlight';

const SECTIONS = [
    { id: 'introduction', label: 'Introduction', icon: Terminal },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'kafka-schemas', label: 'Kafka Schemas', icon: FileJson },
    { id: 'websocket-api', label: 'WebSocket API', icon: Server },
];

export const Documentation = () => {
    const [activeSection, setActiveSection] = useState('introduction');

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="relative min-h-screen bg-black font-sans selection:bg-blue-500/30">
            <BackgroundBeams className="opacity-40 fixed inset-0" />

            <div className="flex max-w-7xl mx-auto pt-20 px-6 relative z-10">
                {/* Sidebar Navigation */}
                <aside className="w-64 hidden lg:block sticky top-24 h-[calc(100vh-6rem)] border-r border-white/5 overflow-y-auto pr-6">
                    <nav className="space-y-1">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`flex items-center gap-3 w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors text-left ${activeSection === section.id
                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <section.icon size={16} />
                                {section.label}
                                {activeSection === section.id && (
                                    <ChevronRight size={14} className="ml-auto opacity-70" />
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:pl-12 pb-24 space-y-24">

                    {/* Introduction */}
                    <section id="introduction" className="scroll-mt-24">
                        <h1 className="text-4xl font-bold mb-6 text-white">Introduction</h1>
                        <p className="text-xl text-white/60 leading-relaxed mb-8">
                            AlerionAI is a distributed industrial monitoring platform designed for massive scale.
                            It leverages Kafka for event streaming and edge computing patterns to deliver real-time insights.
                        </p>
                        <SpotlightCard className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 h-auto">
                            <h4 className="font-semibold text-blue-400 mb-2">Key Capabilities</h4>
                            <ul className="list-disc list-inside space-y-2 text-sm text-white/70">
                                <li>Real-time telemetry ingestion at 1M+ events/sec</li>
                                <li>Distributed anomaly detection using statistical ML models</li>
                                <li>Fog computing architecture for edge processing</li>
                                <li>WebSocket-based live dashboard updates</li>
                            </ul>
                        </SpotlightCard>
                    </section>

                    {/* Architecture */}
                    <section id="architecture" className="scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
                            <Layers className="text-blue-500" /> System Architecture
                        </h2>
                        <p className="text-white/60 mb-8">
                            The platform follows an event-driven microservices architecture. Data flows from localized edge nodes to a central Kafka cluster, where it is consumed by analytic services.
                        </p>

                        <div className="bg-black/50 border border-white/10 rounded-xl p-8 mb-8 relative overflow-hidden backdrop-blur-sm">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-50" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 text-center text-sm font-mono">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-white">Edge Nodes</div>
                                <div className="text-white/30">→</div>
                                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-300">Kafka Cluster</div>
                                <div className="text-white/30">→</div>
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300">Fog Service</div>
                                <div className="text-white/30">→</div>
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300">Dashboard</div>
                            </div>
                        </div>
                    </section>

                    {/* Kafka Schemas */}
                    <section id="kafka-schemas" className="scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
                            <FileJson className="text-emerald-500" /> Kafka Schemas
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-3 text-white">Telemetry Packet</h3>
                                <p className="text-white/60 text-sm mb-4">Topic: <code>sensor-data</code></p>
                                <CodeBlock
                                    language="json"
                                    filename="telemetry-schema.json"
                                    code={`{
  "machineId": "string (uuid)",
  "timestamp": "number (epoch ms)",
  "metrics": {
    "temperature": "number (celsius)",
    "vibration": "number (Hz)",
    "pressure": "number (PSI)"
  },
  "status": "string ('running' | 'idle' | 'error')"
}`}
                                />
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-3 text-white">Anomaly Alert</h3>
                                <p className="text-white/60 text-sm mb-4">Topic: <code>anomaly-events</code></p>
                                <CodeBlock
                                    language="json"
                                    filename="alert-schema.json"
                                    code={`{
  "alertId": "string (uuid)",
  "machineId": "string (uuid)",
  "severity": "string ('warning' | 'critical')",
  "message": "string",
  "timestamp": "number",
  "meta": {
    "confidence": "number (0-1)",
    "modelId": "string"
  }
}`}
                                />
                            </div>
                        </div>
                    </section>

                    {/* WebSocket API */}
                    <section id="websocket-api" className="scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
                            <Server className="text-purple-500" /> WebSocket API
                        </h2>
                        <p className="text-white/60 mb-6">
                            The frontend connects to the WebSocket gateway at <code>wss://api.alerion.ai/v1/stream</code>.
                        </p>

                        <h3 className="text-lg font-semibold mb-3 text-white">Subscription Message</h3>
                        <CodeBlock
                            language="json"
                            code={`{
  "action": "subscribe",
  "channel": "telemetry",
  "filter": {
    "machineId": "all"
  }
}`}
                        />

                        <h3 className="text-lg font-semibold mb-3 mt-8 text-white">Heartbeat Protocol</h3>
                        <p className="text-white/60 text-sm mb-4">
                            Clients must send a ping frame every 30 seconds to maintain the connection.
                        </p>
                        <CodeBlock
                            language="javascript"
                            code={`// Client-side heartbeat
setInterval(() => {
  ws.send(JSON.stringify({ type: 'ping' }));
}, 30000);`}
                        />
                    </section>

                </main>
            </div>
        </div>
    );
};

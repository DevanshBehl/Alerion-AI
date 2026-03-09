import { useState } from 'react';
import { ChevronRight, Layers, FileJson, Server, Terminal, Copy, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';

const SECTIONS = [
    { id: 'introduction', label: 'Introduction', icon: Terminal },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'kafka-schemas', label: 'Kafka Schemas', icon: FileJson },
    { id: 'websocket-api', label: 'WebSocket API', icon: Server },
];

function CodeBlock({ code, filename }: { code: string; language?: string; filename?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl border border-border overflow-hidden">
            {filename && (
                <div className="flex items-center justify-between px-4 py-2 bg-surface-alt border-b border-border-light">
                    <span className="text-xs font-mono text-text-muted">{filename}</span>
                    <button
                        onClick={handleCopy}
                        className="text-text-muted hover:text-text-primary transition-colors p-1 rounded cursor-pointer"
                        title="Copy code"
                    >
                        {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    </button>
                </div>
            )}
            <pre className="p-4 bg-gray-50 overflow-x-auto">
                <code className="text-sm font-mono text-text-primary leading-relaxed">{code}</code>
            </pre>
        </div>
    );
}

export const Documentation = () => {
    const [activeSection, setActiveSection] = useState('introduction');

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="flex max-w-6xl mx-auto pt-8 px-6">
                {/* Sidebar */}
                <aside className="w-56 hidden lg:block sticky top-24 h-[calc(100vh-6rem)] border-r border-border pr-6">
                    <nav className="space-y-1">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left cursor-pointer ${activeSection === section.id
                                    ? 'bg-accent-light text-accent'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                                    }`}
                            >
                                <section.icon size={15} />
                                {section.label}
                                {activeSection === section.id && (
                                    <ChevronRight size={14} className="ml-auto opacity-60" />
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 lg:pl-10 pb-24 space-y-20">
                    {/* Introduction */}
                    <section id="introduction" className="scroll-mt-24">
                        <h1 className="text-3xl font-bold text-text-primary mb-4">Introduction</h1>
                        <p className="text-text-secondary leading-relaxed mb-6">
                            AlerionAI is a distributed industrial monitoring platform designed for massive scale.
                            It leverages Kafka for event streaming and edge computing patterns to deliver real-time insights.
                        </p>
                        <Card className="bg-accent-light/50 border-indigo-200">
                            <h4 className="font-semibold text-accent mb-2 text-sm">Key Capabilities</h4>
                            <ul className="list-disc list-inside space-y-1.5 text-sm text-text-secondary">
                                <li>Real-time telemetry ingestion at 1M+ events/sec</li>
                                <li>Distributed anomaly detection using statistical ML models</li>
                                <li>Fog computing architecture for edge processing</li>
                                <li>WebSocket-based live dashboard updates</li>
                            </ul>
                        </Card>
                    </section>

                    {/* Architecture */}
                    <section id="architecture" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary mb-4">
                            <Layers className="text-accent" size={22} /> System Architecture
                        </h2>
                        <p className="text-text-secondary mb-6">
                            The platform follows an event-driven microservices architecture. Data flows from localized edge nodes to a central Kafka cluster, where it is consumed by analytic services.
                        </p>

                        <Card className="mb-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center text-sm font-mono">
                                <div className="px-4 py-3 bg-background border border-border rounded-lg text-text-primary w-full md:w-auto">
                                    Edge Nodes
                                </div>
                                <span className="text-text-muted hidden md:block">→</span>
                                <div className="px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-700 w-full md:w-auto">
                                    Kafka Cluster
                                </div>
                                <span className="text-text-muted hidden md:block">→</span>
                                <div className="px-4 py-3 bg-success-light border border-emerald-200 rounded-lg text-success w-full md:w-auto">
                                    Fog Service
                                </div>
                                <span className="text-text-muted hidden md:block">→</span>
                                <div className="px-4 py-3 bg-accent-light border border-indigo-200 rounded-lg text-accent w-full md:w-auto">
                                    Dashboard
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* Kafka Schemas */}
                    <section id="kafka-schemas" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary mb-4">
                            <FileJson className="text-success" size={22} /> Kafka Schemas
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">Telemetry Submission</h3>
                                <p className="text-text-secondary text-sm mb-3">
                                    Topic: <code className="text-accent bg-accent-light px-1.5 py-0.5 rounded text-xs">machine-data</code>
                                </p>
                                <CodeBlock
                                    language="json"
                                    filename="machine-data-schema.json"
                                    code={`{
  "machine_id": "string",
  "machine_type": "string ('L' | 'M' | 'H')",
  "timestamp": "string (ISO-8601)",
  "air_temperature": "number (K)",
  "process_temperature": "number (K)",
  "rotational_speed": "number (rpm)",
  "torque": "number (Nm)",
  "tool_wear": "number (min)",
  "is_anomaly_injected": "boolean"
}`}
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">ML Inference Result</h3>
                                <p className="text-text-secondary text-sm mb-3">
                                    Topic: <code className="text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded text-xs">prediction-data</code>
                                </p>
                                <CodeBlock
                                    language="json"
                                    filename="prediction-data-schema.json"
                                    code={`{
  "machine_id": "string",
  "machine_type": "string ('L' | 'M' | 'H')",
  "air_temperature": "number",
  "process_temperature": "number",
  "rotational_speed": "number",
  "torque": "number",
  "tool_wear": "number",
  "prediction": "number (0 | 1)",
  "confidence": "number (0.0 - 1.0)",
  "anomalyScore": "number",
  "failure_type": "string",
  "processed_at": "string (ISO-8601)"
}`}
                                />
                            </div>
                        </div>
                    </section>

                    {/* WebSocket API */}
                    <section id="websocket-api" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary mb-4">
                            <Server className="text-purple-600" size={22} /> WebSocket API
                        </h2>
                        <p className="text-text-secondary mb-6">
                            The frontend connects to the WebSocket gateway at{' '}
                            <code className="text-accent bg-accent-light px-1.5 py-0.5 rounded text-xs">ws://localhost:8080</code>.
                        </p>

                        <h3 className="text-base font-semibold text-text-primary mb-3">Subscription Message</h3>
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

                        <h3 className="text-base font-semibold text-text-primary mb-3 mt-8">Heartbeat Protocol</h3>
                        <p className="text-text-secondary text-sm mb-3">
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


import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useTelemetry, useMachineTelemetry } from '../../hooks/useTelemetry';
import { CHART_COLORS } from '../../utils/constants';
import { motion } from 'framer-motion';
import { Thermometer, Activity, Zap } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/80 border border-white/20 p-3 rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-white/50 text-xs font-mono mb-1">
                    {new Date(label).toLocaleTimeString()}
                </p>
                <p className="text-white font-bold text-lg">
                    {payload[0].value}
                    <span className="text-sm font-normal text-white/50 ml-1">
                        {payload[0].name === 'temperature' ? '°C' : payload[0].name === 'pressure' ? 'PSI' : 'Hz'}
                    </span>
                </p>
            </div>
        );
    }
    return null;
};

export const TelemetryChart = () => {
    const { selectedMetric, setSelectedMetric, selectedMachineId } = useTelemetry();
    const data = useMachineTelemetry(selectedMachineId);

    const metrics = [
        { id: 'temperature', label: 'Temperature', icon: Thermometer, color: CHART_COLORS.temperature },
        { id: 'vibration', label: 'Vibration', icon: Activity, color: CHART_COLORS.vibration },
        { id: 'pressure', label: 'Pressure', icon: Zap, color: CHART_COLORS.pressure },
    ] as const;

    if (!selectedMachineId) {
        return (
            <div className="h-full min-h-[400px] flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <p className="text-white/30">Select a machine to view telemetry</p>
            </div>
        );
    }

    return (
        <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Live Telemetry</h3>
                    <p className="text-xs text-white/40 font-mono mt-1">
                        Machine ID: <span className="text-blue-400">{selectedMachineId}</span>
                    </p>
                </div>

                <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                    {metrics.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setSelectedMetric(m.id)}
                            className={`
                                relative px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2
                                ${selectedMetric === m.id ? 'text-white' : 'text-white/40 hover:text-white/70'}
                            `}
                        >
                            {selectedMetric === m.id && (
                                <motion.div
                                    layoutId="metric-tab"
                                    className="absolute inset-0 bg-white/10 rounded-md border border-white/10 shadow-sm"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <m.icon size={14} />
                                {m.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS[selectedMetric]} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={CHART_COLORS[selectedMetric]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(unix) => new Date(unix).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            stroke="rgba(255,255,255,0.2)"
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.2)"
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey={selectedMetric}
                            stroke={CHART_COLORS[selectedMetric]}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={300}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

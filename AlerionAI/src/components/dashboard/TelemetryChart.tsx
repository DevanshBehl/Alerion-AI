
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
import { CHART_COLORS, METRIC_UNITS } from '../../utils/constants';
import { motion } from 'framer-motion';
import { Thermometer, Gauge, RotateCcw, Hammer, Cog, Activity } from 'lucide-react';
import type { TelemetryMetric } from '../../types';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const metricName = payload[0].name as string;
        const unit = METRIC_UNITS[metricName] || '';
        return (
            <div className="bg-black/80 border border-white/20 p-3 rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-white/50 text-xs font-mono mb-1">
                    {new Date(label).toLocaleTimeString()}
                </p>
                <p className="text-white font-bold text-lg">
                    {typeof payload[0].value === 'number'
                        ? payload[0].value.toFixed(2)
                        : payload[0].value}
                    <span className="text-sm font-normal text-white/50 ml-1">{unit}</span>
                </p>
            </div>
        );
    }
    return null;
};

const metrics: { id: TelemetryMetric; label: string; icon: typeof Thermometer; color: string }[] = [
    { id: 'air_temperature', label: 'Air Temp', icon: Thermometer, color: CHART_COLORS.air_temperature },
    { id: 'process_temperature', label: 'Proc Temp', icon: Gauge, color: CHART_COLORS.process_temperature },
    { id: 'rotational_speed', label: 'RPM', icon: RotateCcw, color: CHART_COLORS.rotational_speed },
    { id: 'torque', label: 'Torque', icon: Hammer, color: CHART_COLORS.torque },
    { id: 'tool_wear', label: 'Tool Wear', icon: Cog, color: CHART_COLORS.tool_wear },
    { id: 'anomalyScore', label: 'Anomaly', icon: Activity, color: CHART_COLORS.anomalyScore },
];

export const TelemetryChart = () => {
    const { selectedMetric, setSelectedMetric, selectedMachineId } = useTelemetry();
    const data = useMachineTelemetry(selectedMachineId);

    const currentMetric = metrics.find(m => m.id === selectedMetric) || metrics[0];

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
                        {data.length > 0 && (
                            <span className="ml-3">
                                Points: <span className="text-emerald-400">{data.length}</span>
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 flex-wrap gap-0.5">
                    {metrics.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setSelectedMetric(m.id)}
                            className={`
                                relative px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5
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
                            <span className="relative z-10 flex items-center gap-1.5">
                                <m.icon size={12} />
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
                                <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0} />
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
                            stroke={currentMetric.color}
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

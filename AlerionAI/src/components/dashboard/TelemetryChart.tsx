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
import { Thermometer, Gauge, RotateCcw, Hammer, Cog, Activity } from 'lucide-react';
import { Card } from '../ui/Card';
import type { TelemetryMetric } from '../../types';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const metricName = payload[0].name as string;
        const unit = METRIC_UNITS[metricName] || '';
        return (
            <div className="bg-surface border border-border rounded-lg px-4 py-3 shadow-lg">
                <p className="text-xs text-text-muted mb-1">
                    {new Date(label).toLocaleTimeString()}
                </p>
                <p className="text-lg font-semibold text-text-primary">
                    {typeof payload[0].value === 'number'
                        ? payload[0].value.toFixed(2)
                        : payload[0].value}
                    <span className="text-sm font-normal text-text-muted ml-1">{unit}</span>
                </p>
            </div>
        );
    }
    return null;
};

const metrics: { id: TelemetryMetric; label: string; icon: typeof Thermometer }[] = [
    { id: 'air_temperature', label: 'Air Temp', icon: Thermometer },
    { id: 'process_temperature', label: 'Proc Temp', icon: Gauge },
    { id: 'rotational_speed', label: 'RPM', icon: RotateCcw },
    { id: 'torque', label: 'Torque', icon: Hammer },
    { id: 'tool_wear', label: 'Tool Wear', icon: Cog },
    { id: 'anomalyScore', label: 'Anomaly', icon: Activity },
];

export const TelemetryChart = () => {
    const { selectedMetric, setSelectedMetric, selectedMachineId } = useTelemetry();
    const data = useMachineTelemetry(selectedMachineId);

    const chartColor = CHART_COLORS[selectedMetric] || '#4F46E5';

    if (!selectedMachineId) {
        return (
            <Card className="h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <Activity size={32} className="text-text-muted mx-auto mb-3 opacity-40" />
                    <p className="text-text-muted text-sm">Select a machine to view telemetry</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <div className="flex flex-wrap items-center justify-between mb-5 gap-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">Live Telemetry</h3>
                    <p className="text-xs text-text-muted mt-0.5">
                        Machine: <span className="text-accent font-medium">{selectedMachineId}</span>
                        {data.length > 0 && (
                            <span className="ml-3">
                                Points: <span className="text-text-secondary font-medium">{data.length}</span>
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex bg-background p-1 rounded-lg border border-border-light flex-wrap gap-0.5">
                    {metrics.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setSelectedMetric(m.id)}
                            className={`
                                relative px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer
                                ${selectedMetric === m.id
                                    ? 'text-accent bg-surface shadow-sm border border-border'
                                    : 'text-text-muted hover:text-text-secondary'
                                }
                            `}
                        >
                            <m.icon size={12} />
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColor} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(unix) =>
                                new Date(unix).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                })
                            }
                            stroke="#E5E7EB"
                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#E5E7EB"
                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#D1D5DB', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey={selectedMetric}
                            stroke={chartColor}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={300}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

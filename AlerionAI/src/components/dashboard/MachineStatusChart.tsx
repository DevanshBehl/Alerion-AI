import { useTelemetryStore } from '../../store/telemetryStore';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Card } from '../ui/Card';
import { Activity, ShieldCheck, ShieldAlert, Zap } from 'lucide-react';
import { useMemo } from 'react';

const PIE_COLORS = ['#10B981', '#EF4444'];
const BAR_COLORS = ['#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444'];

export const MachineStatusChart = () => {
    const predictionStats = useTelemetryStore((s) => s.predictionStats);

    const categoryData = useMemo(() => {
        return Object.entries(predictionStats.failureBreakdown)
            .map(([name, value]) => ({
                name: name.replace(' Failure', ''),
                value,
            }))
            .sort((a, b) => b.value - a.value);
    }, [predictionStats.failureBreakdown]);

    const pieData = useMemo(() => [
        { name: 'Passed', value: predictionStats.passedCount },
        { name: 'Failed', value: predictionStats.failedCount },
    ], [predictionStats.passedCount, predictionStats.failedCount]);

    if (predictionStats.totalRequests === 0) {
        return (
            <Card className="h-full flex items-center justify-center overflow-hidden">
                <div className="text-center">
                    <Activity size={28} className="text-text-muted mx-auto mb-2 opacity-40 animate-pulse" />
                    <p className="text-text-muted text-sm">Waiting for predictions…</p>
                    <p className="text-text-muted text-xs mt-1">Start edge simulators to see data</p>
                </div>
            </Card>
        );
    }

    const passRate = predictionStats.totalRequests > 0
        ? ((predictionStats.passedCount / predictionStats.totalRequests) * 100).toFixed(1)
        : '0';

    return (
        <Card className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent-light rounded-lg">
                        <Activity size={16} className="text-accent" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-text-primary leading-tight">Prediction Analytics</h3>
                        <p className="text-[11px] text-text-muted">Cumulative results from all machines</p>
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-3 flex-shrink-0">
                <div className="bg-background rounded-lg px-3 py-2 text-center border border-border-light">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                        <Zap size={10} className="text-accent" />
                        <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">Total</span>
                    </div>
                    <span className="text-lg font-black text-text-primary tabular-nums">{predictionStats.totalRequests}</span>
                </div>
                <div className="bg-background rounded-lg px-3 py-2 text-center border border-border-light">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                        <ShieldCheck size={10} className="text-success" />
                        <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">Passed</span>
                    </div>
                    <span className="text-lg font-black text-success tabular-nums">{predictionStats.passedCount}</span>
                </div>
                <div className="bg-background rounded-lg px-3 py-2 text-center border border-border-light">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                        <ShieldAlert size={10} className="text-danger" />
                        <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">Failed</span>
                    </div>
                    <span className="text-lg font-black text-danger tabular-nums">{predictionStats.failedCount}</span>
                </div>
            </div>

            {/* Charts */}
            <div className="flex-1 flex flex-col md:flex-row gap-3 min-h-0">
                {/* Donut: Pass/Fail */}
                <div className="flex-1 flex flex-col min-h-0">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider text-center mb-1 flex-shrink-0">Pass Rate: {passRate}%</p>
                    <div className="flex-1 w-full relative min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="50%"
                                    outerRadius="78%"
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: 500 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="block text-xl font-black text-text-primary">{passRate}%</span>
                                <span className="block text-[8px] text-text-muted uppercase tracking-widest font-semibold">healthy</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bar: Failure Categories */}
                <div className="flex-1 flex flex-col min-h-0">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider text-center mb-1 flex-shrink-0">Failure Breakdown</p>
                    <div className="flex-1 w-full min-h-0">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={categoryData}
                                    layout="vertical"
                                    margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#F3F4F6" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={85}
                                        tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 500 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F9FAFB' }}
                                        contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: 500 }}
                                    />
                                    <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
                                        {categoryData.map((_, i) => (
                                            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center">
                                <ShieldCheck size={22} className="text-success opacity-50 mb-1" />
                                <p className="text-[10px] font-medium text-success uppercase tracking-wider">No Failures Yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CashFlowChartProps {
  monthlyInflows?: number[];
  monthlyOutflows?: number[];
  className?: string;
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  monthlyInflows = [115000, 122000, 118000, 124000, 119000, 121000],
  monthlyOutflows = [65000, 70000, 68000, 72000, 66000, 69000],
  className,
}) => {
  const months = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];

  const chartData = months.map((m, idx) => {
    const inflow = monthlyInflows[idx] || 0;
    const outflow = monthlyOutflows[idx] || 0;
    return {
      month: m,
      inflow,
      outflow,
      net: inflow - outflow,
    };
  });

  return (
    <div className={className}>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              formatter={(val: any, name: any) => [`₹${Number(val).toLocaleString('en-IN')}`, name === 'inflow' ? 'Monthly Inflow' : name === 'outflow' ? 'Monthly Outflow' : 'Net Cash Flow']}
            />
            <Area type="monotone" dataKey="inflow" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInflow)" />
            <Area type="monotone" dataKey="outflow" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorOutflow)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-3 text-xs font-semibold">
        <span className="flex items-center gap-2 text-emerald-600">
          <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Monthly Inflows
        </span>
        <span className="flex items-center gap-2 text-rose-600">
          <span className="w-3 h-3 rounded bg-rose-500 inline-block" /> Monthly Outflows
        </span>
      </div>
    </div>
  );
};

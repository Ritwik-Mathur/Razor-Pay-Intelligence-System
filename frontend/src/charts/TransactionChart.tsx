import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TransactionChartProps {
  data?: Array<{ time: string; volume: number; success: number; failed: number }>;
}

const defaultData = [
  { time: 'Mon', volume: 520000, success: 110, failed: 4 },
  { time: 'Tue', volume: 680000, success: 145, failed: 8 },
  { time: 'Wed', volume: 810000, success: 180, failed: 12 },
  { time: 'Thu', volume: 740000, success: 165, failed: 6 },
  { time: 'Fri', volume: 990000, success: 220, failed: 15 },
  { time: 'Sat', volume: 620000, success: 140, failed: 5 },
  { time: 'Sun', volume: 625000, success: 142, failed: 4 },
];

export const TransactionChart: React.FC<TransactionChartProps> = ({ data = defaultData }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            }}
            formatter={(value: any, name: any) => [
              name === 'Gross Volume (₹)' ? `₹${Number(value).toLocaleString('en-IN')}` : value,
              name,
            ]}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
          <Area
            type="monotone"
            dataKey="volume"
            name="Gross Volume (₹)"
            stroke="#2563EB"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorVolume)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

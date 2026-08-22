import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PaymentStatusChartProps {
  data?: Array<{ status: string; count: number; amount: number; color: string }>;
}

const defaultData = [
  { status: 'Successful', count: 1248, amount: 3942200, color: '#059669' },
  { status: 'Failed', count: 62, amount: 128000, color: '#E11D48' },
  { status: 'Refunded', count: 14, amount: 48500, color: '#2563EB' },
  { status: 'Held', count: 5, amount: 85000, color: '#D97706' },
  { status: 'Flagged', count: 9, amount: 142000, color: '#DC2626' },
];

export const PaymentStatusChart: React.FC<PaymentStatusChartProps> = ({ data = defaultData }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis dataKey="status" type="category" stroke="#475569" fontSize={11} tickLine={false} fontWeight={600} width={80} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(value: any, name: any, item: any) => [
              `${value} Txns (₹${item.payload.amount.toLocaleString('en-IN')})`,
              'Count',
            ]}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`status-cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

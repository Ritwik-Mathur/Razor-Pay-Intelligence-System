import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', gross: 420000, net: 412000 },
  { day: 'Tue', gross: 580000, net: 568000 },
  { day: 'Wed', gross: 710000, net: 695000 },
  { day: 'Thu', gross: 640000, net: 627000 },
  { day: 'Fri', gross: 890000, net: 872000 },
  { day: 'Sat', gross: 520000, net: 510000 },
  { day: 'Sun', gross: 525000, net: 515000 },
];

export const RevenueTrendChart: React.FC = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
          />
          <Bar dataKey="gross" name="Gross Processed" fill="#1e40af" radius={[4, 4, 0, 0]} />
          <Bar dataKey="net" name="Net Settled" fill="#059669" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

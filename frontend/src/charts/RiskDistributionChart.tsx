import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RiskDistributionChartProps {
  data?: Array<{ category: string; count: number; percentage: number; color: string }>;
}

const defaultData = [
  { category: 'Low Risk (<25)', count: 1173, percentage: 94, color: '#059669' },
  { category: 'Medium Risk (25-50)', count: 50, percentage: 4, color: '#2563EB' },
  { category: 'High Risk (50-75)', count: 6, percentage: 1.5, color: '#D97706' },
  { category: 'Critical Risk (>75)', count: 3, percentage: 0.5, color: '#DC2626' },
];

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ data = defaultData }) => {
  return (
    <div className="h-64 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="count"
            nameKey="category"
          >
            {data.map((entry, index) => (
              <Cell key={`risk-cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(value: any, name: any) => [`${value} Transactions`, name]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ChartSlice {
  name: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: ChartSlice[];
}

export default function DonutChart({ data }: DonutChartProps) {
  const defaultColors = ['#E53935', '#2563EB', '#EC4899', '#6B7280', '#F59E0B', '#10B981'];

  // Custom tooltips for nice styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-800 text-white p-2.5 rounded-lg shadow-md text-xs font-semibold">
          <p className="text-gray-400 mb-0.5">{payload[0].name}</p>
          <p className="text-sm font-bold">{payload[0].value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[260px] w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || defaultColors[index % defaultColors.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs font-medium text-gray-600 hover:text-gray-900">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

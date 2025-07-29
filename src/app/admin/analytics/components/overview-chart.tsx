
'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';

interface OverviewChartProps {
  data: { date: string; users: number; notes: number }[];
}

export function OverviewChart({ data }: OverviewChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
            content={<ChartTooltipContent indicator="dot" />}
            cursor={{ fill: 'hsl(var(--accent))' }}
        />
        <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="New Users" />
        <Bar dataKey="notes" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="New Notes" />
      </BarChart>
    </ResponsiveContainer>
  );
}

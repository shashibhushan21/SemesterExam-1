
'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface OverviewChartProps {
  data: { date: string; users: number; notes: number }[];
}

const chartConfig = {
  users: {
    label: "New Users",
    color: "hsl(var(--primary))",
  },
  notes: {
    label: "New Notes",
    color: "hsl(var(--secondary))",
  },
}

export function OverviewChart({ data }: OverviewChartProps) {
  return (
     <ChartContainer config={chartConfig} className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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
            <ChartTooltip
                content={<ChartTooltipContent indicator="dot" />}
                cursor={{ fill: 'hsl(var(--accent))' }}
            />
            <Bar dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} name="New Users" />
            <Bar dataKey="notes" fill="var(--color-notes)" radius={[4, 4, 0, 0]} name="New Notes" />
        </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
  );
}

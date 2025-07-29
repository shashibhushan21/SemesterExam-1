
'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useMemo } from 'react';

interface DistributionChartProps {
  data: { name: string; count: number }[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function SubjectDistributionChart({ data }: DistributionChartProps) {
    const chartData = useMemo(() => {
        return data.map((item, index) => ({
            name: item.name,
            value: item.count,
            fill: COLORS[index % COLORS.length]
        }));
    }, [data]);

    const chartConfig = useMemo(() => {
        const config: any = {};
        chartData.forEach(item => {
            config[item.name] = {
                label: item.name,
                color: item.fill
            }
        });
        return config;
    }, [chartData]);
    
  if (chartData.length === 0) {
    return (
        <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">
            No data to display.
        </div>
    )
  }

  return (
    <div className="h-[250px] min-w-[250px]">
       <ResponsiveContainer width="100%" height={250}>
        <ChartContainer config={chartConfig} className="w-full h-full">
            <PieChart>
                <Tooltip
                    content={<ChartTooltipContent nameKey="name" hideLabel />}
                    cursor={{ fill: 'hsl(var(--accent))' }}
                />
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        if (percent < 0.05) return null; // Don't render label for small slices

                        return (
                            <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
                                {`${chartData[index].name} (${(percent * 100).toFixed(0)}%)`}
                            </text>
                        );
                    }}
                />
            </PieChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}

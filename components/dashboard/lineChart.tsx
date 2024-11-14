'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
// const chartData = [
//     { month: 'January', desktop: 186, mobile: 80 },
//     { month: 'February', desktop: 305, mobile: 200 },
//     { month: 'March', desktop: 237, mobile: 120 },
//     { month: 'April', desktop: 73, mobile: 190 },
//     { month: 'May', desktop: 209, mobile: 130 },
//     { month: 'June', desktop: 214, mobile: 140 },
// ];

// const chartConfig = {
//     desktop: {
//         label: 'Desktop',
//         color: 'hsl(var(--chart-1))',
//     },
//     mobile: {
//         label: 'Mobile',
//         color: 'hsl(var(--chart-2))',
//     },
// } satisfies ChartConfig;

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

type LineChartProps = {
    chartConfig: ChartConfig;
    chartData: any[];
    title?: string;
    description?: string;
};

export function LineChartCom({ chartConfig, chartData, title, description }: LineChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
                {/* <CardDescription>
                    {startMonth} -{'>'} {endMonth} {year}
                </CardDescription> */}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="week" tickLine={false} axisLine tickMargin={8} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Line
                            dataKey="value"
                            type="stepAfter"
                            stroke="#88C273"
                            strokeWidth={2}
                            dot={{
                                fill: '#88C273',
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                            <LabelList position="top" offset={12} className="fill-foreground" fontSize={14} fontWeight={'bold'} />
                        </Line>
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

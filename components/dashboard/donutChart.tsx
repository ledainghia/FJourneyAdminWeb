'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, LabelList, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query';
import { managementAPI } from '@/config/axios/axios';
// const chartData = [
//     { name: 'totalDrivers', value: 100, fill: '#FC8F54' },
//     { name: 'totalVehicles', value: 100, fill: '#88C273' },
// ];

type DonutChartProps = {
    chartData: any[];
    total: number;
    chartConfig: ChartConfig;
};

export function DonutChart({ chartData, total, chartConfig }: DonutChartProps) {
    return (
        <Card className="mt-3 flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Tổng Số Người Dùng</CardTitle>
            </CardHeader>
            <CardContent className="mt-10 h-full flex-1 justify-center pb-0 align-middle">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="value" nameKey="name" label innerRadius={60} strokeWidth={5}>
                            <Label
                                content={({ viewBox }: any) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                    {total.toLocaleString()}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                    Users
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                            <LabelList dataKey="name" className="fill-background " stroke="none" fontSize={12} formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label} />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
            </CardFooter> */}
        </Card>
    );
}

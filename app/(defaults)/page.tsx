'use client';
import { DonutChart } from '@/components/dashboard/donutChart';
import { capitalizeFirstLetter, LineChartCom } from '@/components/dashboard/lineChart';
import { ChartConfig } from '@/components/ui/chart';
import { managementAPI } from '@/config/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const [chartDataUsers, setChartDataUsers] = useState<any[]>([]);
    const [chartDataNews, setChartDataNews] = useState<any[]>([]);

    const { data } = useQuery({
        queryKey: ['dashboard', 'users'],
        queryFn: () => {
            return managementAPI.getDataDashboard();
        },
    });

    const { data: userNew } = useQuery({
        queryKey: ['dashboard', 'usersNews'],
        queryFn: () => {
            return managementAPI.getStatistics();
        },
    });

    useEffect(() => {
        if (data && data.data.result) {
            const chartData = [
                { name: 'totalDrivers', value: data.data.result.totalDrivers, fill: '#FC8F54' },
                { name: 'totalPassengers', value: data.data.result.totalPassengers, fill: '#88C273' },
            ];
            setChartDataUsers(chartData);
        }
    }, [data]);

    useEffect(() => {
        if (userNew && userNew.data.weeklyData) {
            const chartData = userNew.data.weeklyData.map((item: any) => {
                return {
                    week: 'Tuần ' + item.week,
                    value: item.userCount,
                };
            });
            setChartDataNews(chartData);
        }
    }, [userNew]);

    const chartConfigUsers = {
        value: {
            label: 'Users',
        },
        totalDrivers: {
            label: 'Xế',
            color: '#FC8F54',
        },
        totalPassengers: {
            label: 'Ôm',
            color: '#88C273',
        },
    } satisfies ChartConfig;

    const chartConfigNew = {
        value: {
            label: 'Người Dùng Mới',
            color: 'hsl(var(--chart-1))',
        },
        week: {
            label: 'Tuần',
        },
    } satisfies ChartConfig;

    const today = new Date();
    const lastMonth = subMonths(today, 1);
    const startMonth = capitalizeFirstLetter(format(lastMonth, 'MMMM', { locale: vi }));
    const endMonth = capitalizeFirstLetter(format(today, 'MMMM', { locale: vi }));
    const year = format(today, 'yyyy');
    console.log(lastMonth);

    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
            </ul>
            <div className=" grid w-full grid-cols-3 gap-3">
                <DonutChart chartConfig={chartConfigUsers} chartData={chartDataUsers} total={data?.data.result.totalUsers} />
                <div className="col-span-2">
                    <LineChartCom title="Số Lượng Người Dùng Mới" chartData={chartDataNews} chartConfig={chartConfigNew} description={`${startMonth} -> ${endMonth} ${year}`} />
                </div>
            </div>
        </>
    );
};

export default Dashboard;

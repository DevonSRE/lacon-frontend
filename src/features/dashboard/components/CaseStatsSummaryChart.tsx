
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Card, CardContent } from '@/components/ui/card';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
    title: string;
    value: number;
    change: string;
    changeColor?: string;
    categories: string[];
    data: number[];
    barColor?: string;
    cardBg?: string;
    orientation?: 'horizontal' | 'vertical';
};

export default function CaseStatCard({
    title,
    value,
    change,
    changeColor = 'text-red-500',
    categories,
    data,
    barColor = '#BD2B12',
    cardBg = 'bg-white',
    orientation = 'horizontal',
}: Props) {
    const isHorizontal = orientation === 'horizontal';

    const chartOptions: ApexOptions = {
        colors: [barColor],
        chart: {
            type: 'bar',
            height: 250,
        },
        plotOptions: {
            bar: {
                horizontal: isHorizontal,
                barHeight: isHorizontal ? '50%' : undefined,
                columnWidth: !isHorizontal ? '50%' : undefined,
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories,
        },
    };

    return (
        <Card className={`${cardBg}`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h3 className="text-md font-medium">{title}</h3>
                        <p className="text-3xl font-bold">
                            {value}{' '}
                            <span className={`text-sm ${changeColor}`}>
                                {change}
                            </span>
                        </p>
                    </div>
                    <div className="text-gray-400 text-xl">⋯</div>
                </div>
                <ReactApexChart
                    options={chartOptions}
                    series={[{ data }]}
                    type="bar"
                    height={250}
                />
            </CardContent>
        </Card>
    );
}

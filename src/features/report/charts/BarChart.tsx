// components/BarChart.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from "apexcharts";


const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

type BarChartProps = {
    data: { month: string; percentage: number }[];
};

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const categories = data.map((item) => item.month);
    const seriesData = data.map((item) => item.percentage);

    const chartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                distributed: true,
                dataLabels: { position: 'top' },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return `${val}%`;
            },
            offsetY: 10,
            style: {
                fontSize: '12px',
                colors: ['#fff'],
            },
        },
        xaxis: {
            categories,
            position: 'bottom',
            labels: {
                style: {
                    fontSize: '12px',
                },
            },
        },
        yaxis: {
            labels: {
                formatter: (val: number) => `${val}%`,
            },
            max: 90,
        },
        fill: {
            opacity: 1,
            colors: ['#555'],
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val}%`,
            },
        },
    };

    return (
        <div>
            <ApexCharts options={chartOptions} series={[{ name: 'Performance', data: seriesData }]} type="bar" height={350} />
        </div>
    );
};

export default BarChart;

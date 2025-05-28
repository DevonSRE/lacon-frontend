// components/PieChart.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from "apexcharts";

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

type PieDataItem = {
    label: string;
    value: number;
    color: string;
};

type PieChartProps = {
    data: PieDataItem[];
};

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const labels = data.map((item) => item.label);
    const values = data.map((item) => item.value);
    const colors = data.map((item) => item.color);

    const chartOptions: ApexOptions = {
        labels,
        colors,
        legend: {
            show: false,
        },

        // legend: {
        //     position: 'bottom',
        //     labels: {
        //         useSeriesColors: false,
        //     },
        // },
        stroke: {
            show: true,
            width: 4, // Increase this value to make the white lines thicker
            colors: ['#ffffff'], // Set stroke color to white
        },

        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return `${Math.round(val)}%`;
            },
        },
    };

    return (
        <div>
            <ApexCharts
                options={chartOptions}
                series={values}
                type="pie"
                height={300}
            />
        </div>
    );
};

export default PieChart;

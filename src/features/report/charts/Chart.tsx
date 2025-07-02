import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});
type SeriesData = {
    name: string;
    data: number[];
};
type ChartProps = {
    categories: string[];
    series: SeriesData[];
    colors?: string[];
    columnWidth?: string;
};
const Chart: React.FC<ChartProps> = ({ categories, series, colors, columnWidth = "70%" }) => {
    const options: ApexOptions = {
        chart: {
            type: "bar" as "bar",
            stacked: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: columnWidth,
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: categories,
            labels: {
                rotate: 0, // Force vertical (upright) labels
                style: {
                    fontSize: '12px',
                },
            },
        },

        legend: {
            position: "top",
            markers: {
                size: 10,
                shape: "square",
            },
        },
        colors: colors, // Match your chart's palette
    };

    return (
        <div className="offence-cases-chart">
            <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
    );
};

export default Chart;

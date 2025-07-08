"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface CaseDistribution {
  title: string;
  count: number;
}

interface CaseDistributionChartProps {
  data?: {
    case_distributions?: CaseDistribution[];
  };
  isLoading?: boolean;
}

export default function CaseDistributionChart({ data, isLoading }: CaseDistributionChartProps) {
  // Process the API data
  const caseDistributions = data?.case_distributions || [];

  // Extract categories and data from API
  const categories = caseDistributions.map(item =>
    item.title.replace(" HEAD", "").replace(" DEPT.", " DEPT").replace(" UNIT", "")
  );

  const seriesData = caseDistributions.map(item => item.count);
  // Calculate max value for better chart scaling
  const maxValue = Math.max(...seriesData, 0);
  const chartMax = Math.ceil(maxValue * 1.2); // Add 20% padding

  const options: ApexOptions = {
    colors: ["#E299A0"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 200,
      toolbar: {
        show: false,
      },
    },
    annotations: {
      yaxis: [
        {
          y: 130,
          borderColor: "#FF4560",
          label: {
            borderColor: "#FF4560",
            style: {
              color: "#fff",
              background: "#FF4560",
            },
            text: "Target: 130",
          },
        },
      ],
      xaxis: [
        {
          x: "Criminal Justice",
          borderColor: "#008FFB",
          label: {
            style: {
              color: "#fff",
              background: "#008FFB",
            },
            text: "Criminal Justice",
          },
        },
      ],
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: "400",
        },
        rotate: -45,
        maxHeight: 80,
      },
    },
    legend: {
      show: false,
    },
    yaxis: {
      title: {
        text: undefined,
      },
      min: 0,
      max: chartMax || 10,
      tickAmount: 6,
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: "400",
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#f1f5f9",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (val: number) => `${val} cases`,
      },
    },
  };

  const series = [
    {
      name: "Cases",
      data: seriesData,
    },
  ];

  if (isLoading) {
    return (
      <div className="overflow-hidden pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Case Distribution
          </h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (!caseDistributions.length) {
    return (
      <div className="overflow-hidden pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Case Distribution By Unit
          </h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">No case distribution data available</div>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Case Distribution By Unit
        </h3>
      </div>
      <div className="overflow-x-auto custom-scrollbar bg-gray-100 max-w-5xl">
        <div className="pl-2 p-4">
          <ReactApexChart options={options} series={series} type="bar" height={400} />
        </div>
      </div>
    </div>
  );
}

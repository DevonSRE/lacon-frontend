"use client";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { ApexOptions } from "apexcharts";
import { EllipsisVertical } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Process the API data
  const caseDistributions = data?.case_distributions || [];

  // Extract categories and data from API
  const categories = caseDistributions.map(item => {
    // Clean up the title for display
    return item.title.replace(' HEAD', '').replace(' DEPT.', ' DEPT').replace(' UNIT', '');
  });

  const seriesData = caseDistributions.map(item => item.count);

  // Calculate max value for better chart scaling
  const maxValue = Math.max(...seriesData, 0);
  const chartMax = Math.ceil(maxValue * 1.2); // Add 20% padding

  const options: ApexOptions = {
    colors: ["#E299A0"], // Light coral/pink color to match the original design
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 280,
      toolbar: {
        show: false,
      },
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
        rotate: -45, // Rotate labels for better readability with longer names
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
            Case Distribution  By Unit
          </h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">No case distribution data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Case Distribution By Unit
        </h3>
        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <EllipsisVertical className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Export Data
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={380}
          />
        </div>
      </div>

      {/* Summary stats below chart */}
      {/* <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {caseDistributions.map((item, index) => (
            <div key={index} className="text-sm">
              <div className="font-medium text-gray-900 dark:text-white">{item.count}</div>
              <div className="text-xs text-gray-500 mt-1">
                {item.title.replace(' HEAD', '').replace(' DEPT.', '').replace(' UNIT', '')}
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import PieChart from '@/components/PieChart';
import { Icons } from '@/icons/icons';
import { DataTable } from '@/components/data-table';
import { demographicsTable } from './table_Column';
import { GetReportDemography } from '../server/reportAction'; // Assuming this is your API function
import { useAction } from '@/context/ActionContext';
import LawyerSkeleton from '@/components/skeleton/LawyerSkeleton';

// Type definitions for the API response
interface DemographicBreakdown {
    sex: string;
    marital_status: string;
    count: number;
    percent: number;
}

interface DemographicsData {
    department_case_breakdown: DemographicBreakdown[];
}

// API Response wrapper interface
interface ApiResponse {
    data: DemographicsData;
}

// Pie chart data interface
interface PieChartData {
    label: string;
    value: number;
    color: string;
}

// Color mapping for different demographic combinations
const colorMap: Record<string, string> = {
    'MALE-single': '#BD2B12',
    'MALE-married': '#6B788E',
    'MALE-divorced': '#8E44AD',
    'FEMALE-single': '#34B53A',
    'FEMALE-married': '#FBBC04',
    'FEMALE-divorced': '#E67E22'
};

// Transform API data to pie chart format
function transformToPieData(data: DemographicBreakdown[]): PieChartData[] {
    return data
        .filter(item => item.count > 0) // Only include categories with data
        .map(item => {
            const key = `${item.sex}-${item.marital_status}`;
            const label = `${item.sex.charAt(0) + item.sex.slice(1).toLowerCase()} - ${item.marital_status.charAt(0).toUpperCase() + item.marital_status.slice(1)
                }`;

            return {
                label,
                value: item.percent,
                color: colorMap[key] || '#95A5A6' // Default color if not found
            };
        });
}

// Generate legend items from API data
function generateLegendItems(data: DemographicBreakdown[]) {
    return data.map(item => {
        const key = `${item.sex}-${item.marital_status}`;
        const label = `${item.sex.charAt(0) + item.sex.slice(1).toLowerCase()} - ${item.marital_status.charAt(0).toUpperCase() + item.marital_status.slice(1)
            }`;

        return {
            color: colorMap[key] || '#95A5A6',
            label,
            count: item.count,
            percent: item.percent
        };
    });
}

export default function Demographics() {
    const { selectedZoneId, setSelectedZoneId, selectedDuration, setselectedDuration, selectedStateId, setSeletedStateId, selectedCentreId, setselectedCentreId } = useAction();
    const { data, isLoading, error } = useQuery({
        queryKey: ["getDemographicsReport", selectedZoneId, selectedStateId, selectedDuration, selectedCentreId],
        queryFn: async () => {
            const filters = {
                zone: selectedZoneId,
                state: selectedStateId,
                duration: selectedDuration,
                centre: selectedCentreId,
            };
            return await GetReportDemography(filters);
        },
        staleTime: 100000,
    });

    // Transform data for pie chart
    const pieData = data?.data?.department_case_breakdown
        ? transformToPieData(data.data.department_case_breakdown)
        : [];

    // Generate legend items
    const legendItems = data?.data?.department_case_breakdown
        ? generateLegendItems(data.data.department_case_breakdown)
        : [];

    // Handle loading state
    if (isLoading) {
        return <LawyerSkeleton />;
    }

    // Handle error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-600">Error loading demographics data</div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-3xl">
                <div className="flex justify-start gap-4 items-center mb-4">
                    {pieData.length > 0 ? (
                        <PieChart data={pieData} />
                    ) : (
                        <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded">
                            <span className="text-gray-500">No data available</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 w-lg">
                        {legendItems.map((item, index) => (
                            <div key={index} className="flex gap-4 items-center">
                                <span
                                    className="w-10 h-3"
                                    style={{ backgroundColor: item.color }}
                                ></span>
                                <div className="flex flex-col">
                                    <span className="text-xs">{item.label}</span>
                                    <span className="text-xs text-gray-500">
                                        {item.count} ({item.percent.toFixed(1)}%)
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="">
                    <div className="flex justify-between items-center py-4">
                        <h2 className="text-xl font-semibold">Demographics & Case Stats</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable
                        columns={demographicsTable}
                        loading={isLoading}
                        data={data?.data?.department_case_breakdown || []}
                    />
                </div>
            </div>
        </>
    );
}
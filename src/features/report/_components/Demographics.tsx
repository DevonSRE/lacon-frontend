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

/**
 * One colour per row, in a fixed order (T11).
 *
 * The map used to be keyed on the six buckets the API then counted; any other
 * combination fell through to grey, and several rows shared it. The palette is
 * walked in the order the rows arrive instead, so a slice and its legend swatch
 * always match and no two rows look alike until the palette runs out.
 */
const PALETTE = ['#BD2B12', '#6B788E', '#34B53A', '#FBBC04', '#8E44AD', '#E67E22', '#2980B9', '#16A085', '#7F8C8D'];

function sentence(value: string): string {
    const given = (value ?? '').trim();
    if (given === '') return 'Not recorded';
    return given.charAt(0).toUpperCase() + given.slice(1).toLowerCase();
}

/**
 * The rows the pie draws and the legend reads: the same list, the same
 * percentages. They used to be built twice — the pie from the rows with cases
 * in them and the legend from all of them — so the two disagreed.
 */
function readRows(data: DemographicBreakdown[]) {
    return data
        .filter(item => item.count > 0)
        .map((item, index) => ({
            label: `${sentence(item.sex)} - ${sentence(item.marital_status)}`,
            value: item.percent,
            count: item.count,
            percent: item.percent,
            color: PALETTE[index % PALETTE.length],
        }));
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
                center: selectedCentreId,
            };
            return await GetReportDemography(filters);
        },
        staleTime: 100000,
    });

    // One reading, shown twice: the pie and the legend cannot disagree.
    const rows = readRows(data?.data?.department_case_breakdown ?? []);
    const pieData: PieChartData[] = rows.map(({ label, value, color }) => ({ label, value, color }));
    const legendItems = rows;

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
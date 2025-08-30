import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetAllUnit } from '../server/reportAction';
import { DataTable } from '@/components/data-table';
import { CorrectionalVisitsTable, PDSSBailTable } from './table_Column';
import { Icons } from '@/icons/icons';
import LawyerSkeleton from '@/components/skeleton/LawyerSkeleton';
import Chart from '../charts/Chart';
import { useAction } from '@/context/ActionContext';

const getStatValue = (
    pdssUnitSummary: { title: string; count: number }[] | undefined,
    title: string
) => {
    const item = pdssUnitSummary?.find(item => item.title === title);
    return item ? item.count : 0;
};

type StatCardProps = {
    title: string;
    value: number;
    bgColor?: string;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, bgColor = "text-black" }: StatCardProps) => {
    return (
        <div className="border rounded-xs p-6 space-y-2 shadow-sm bg-gray-50">
            <div className={`text-lg font-medium ${bgColor}`}>{title}</div>
            <div className="text-4xl font-semibold text-black">{value}</div>
        </div>
    );
};

type PDSSBail = {
    station?: string;
    release_individuals: number;
    gender: string;
    offence: string;
};

interface ChartData {
    categories: string[];
    series: Array<{
        name: string;
        data: number[];
    }>;
}

const ErrorMessage = ({ error }: { error: any }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 ">
        <div className="text-red-800">Error loading data: {error.message}</div>
    </div>
);

function transformMonthlyOverviewData(data: any[]): ChartData {
    const categories = data.map(item => item.month);
    const casesReceived = data.map(item => item.cases_received || 0);
    const personsBailed = data.map(item => item.persons_bailed || 0);

    return {
        categories,
        series: [
            {
                name: "Cases Received",
                data: casesReceived
            },
            {
                name: "Persons Bailed",
                data: personsBailed
            }
        ]
    };
}

export default function PDSSReport() {
    const { selectedZoneId, setSelectedZoneId, selectedDuration, 
        setselectedDuration, selectedStateId, setSeletedStateId, 
        selectedCentreId, setselectedCentreId } = useAction();

    const { data, isLoading, error } = useQuery({
        queryKey: ["getPDSSREportOverview", selectedZoneId, selectedStateId, selectedDuration, selectedCentreId],
        queryFn: async () => {
            const filters = {
                unit: "pdss unit",
                zone: selectedZoneId,
                state: selectedStateId,
                duration: selectedDuration,
                centre: selectedCentreId,
            };
            return await GetAllUnit(filters);
        },
        staleTime: 100000,
    });

    if (isLoading) return <LawyerSkeleton />;
    if (error) return <ErrorMessage error={error} />;

    // Extract data from API response - updated to match JSON structure
    const pdssUnitSummary = data?.data?.pdss_unit_summary ?? [];
    const pdssOverview = data?.data?.pdss_overview ?? [];
    const pdssBail = data?.data?.pdss_bail ?? [];

    // Calculate total cases received from monthly overview
    const totalCasesReceived = pdssOverview.reduce((total: number, month: any) => {
        return total + (month.cases_received || 0);
    }, 0);

    // Calculate total persons bailed from monthly overview
    const totalPersonsBailed = pdssOverview.reduce((total: number, month: any) => {
        return total + (month.persons_bailed || 0);
    }, 0);

    // Transform monthly overview data for chart
    const chartData = pdssOverview.length > 0
        ? transformMonthlyOverviewData(pdssOverview)
        : null;

    return (
        <div className="">
            {/* Header Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <StatCard
                    title="Total PDSS Cases"
                    bgColor='text-red-500'
                    value={getStatValue(pdssUnitSummary, "Total PDSS Cases")}
                />
                <StatCard
                    title="Average Detention Days"
                    value={getStatValue(pdssUnitSummary, "Average Detention Days")}
                />
                <StatCard
                    title="Persons Bailed"
                    value={getStatValue(pdssUnitSummary, "Persons Bailed")}
                />
                <StatCard
                    title="Cases Completed"
                    value={getStatValue(pdssUnitSummary, "Cases Completed")}
                />
                <StatCard
                    title="Pending Actions"
                    value={getStatValue(pdssUnitSummary, "Pending Actions")}
                />
            </div>

            {/* Chart Section */}
            <div className="mt-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Monthly PDSS Cases Overview</h2>
                {chartData && (
                    <Chart
                        categories={chartData.categories}
                        series={chartData.series}
                        colors={["#BD2B12", "#2C3E50"]}
                        columnWidth="40%"
                    />
                )}
            </div>


            {/* PDSS Bail Section */}
            <div className="overflow-x-auto">
                <div className="">
                    <div className="flex justify-between items-center py-4">
                        <h2 className="text-xl font-semibold">PDSS Bail at Police Stations</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable
                        columns={PDSSBailTable}
                        loading={isLoading}
                        data={pdssBail || []}
                    />
                    <div className="bg-black text-white text-end text-sm pr-6 cursor-pointer hover:bg-gray-800">
                        view all
                    </div>
                </div>
            </div>

        </div>
    );
}
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetAllUnit } from '../server/reportAction';
import { DataTable } from '@/components/data-table';
import { DecongestionUnitColumn } from './table_Column';
import LawyerSkeleton from '@/components/skeleton/LawyerSkeleton';
import { useAction } from '@/context/ActionContext';

const getStatValue = (
    decongestionDistribution: { title: string; count: number }[] | undefined,
    title: string
) => {
    const item = decongestionDistribution?.find(item => item.title === title);
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
            <div className="text-2xl font-semibold text-black">{value}</div>
        </div>
    );
};

const ErrorMessage = ({ error }: { error: any }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">Error loading data: {error.message}</div>
    </div>
);

export default function DecongestionUnitReport() {
    const { selectedZoneId, selectedStateId, selectedDuration, selectedCentreId } = useAction();

    const { data, isLoading, error } = useQuery({
        queryKey: ["getDECONGESTIONReportOverview", selectedZoneId, selectedStateId, selectedDuration, selectedCentreId],
        queryFn: async () => {
            const filters = {
                unit: "decongestion",
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

    // Extract data from API response - matching the actual API structure
    const decongestionDistribution = data?.data?.decongestion_distribution ?? [];
    const decongestionCaseData = data?.data?.decongestion_case?.data ?? [];

    return (
        <div className="">
            {/* Header Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Cases"
                    bgColor='text-red-500'
                    value={getStatValue(decongestionDistribution, "Total  Cases")}
                />
                <StatCard
                    title="Pending Cases"
                    value={getStatValue(decongestionDistribution, "Pending Cases")}
                />
                <StatCard
                    title="Completed Cases"
                    value={getStatValue(decongestionDistribution, "Completed Cases")}
                />
                <StatCard
                    title="Percent Resolved"
                    value={getStatValue(decongestionDistribution, "Percent Resolved")}
                />
            </div>

            {/* Decongestion Cases Table */}
            <div className="overflow-x-auto">
                <DataTable
                    columns={DecongestionUnitColumn}
                    loading={isLoading}
                    data={decongestionCaseData}
                />
            </div>
        </div>
    );
}
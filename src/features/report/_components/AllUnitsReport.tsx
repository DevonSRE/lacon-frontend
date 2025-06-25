import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetAllUnit } from '../server/reportAction';
import { DataTable } from '@/components/data-table';
import { CorrectionalVisitsTable, AllUnitTable } from './table_Column';
import { Icons } from '@/icons/icons';
import LawyerSkeleton from '@/components/skeleton/LawyerSkeleton';
import { useAction } from '@/context/ActionContext';

const getStatValue = (
    adminSummary: { title: string; count: number }[] | undefined,
    title: string
) => {
    const item = adminSummary?.find(item => item.title === title);
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


type CorrectionalVisit = {
    center?: string;
    visits: number;
    inmate_assisted: number;
    legal_rep_provided?: string;
};



type PDSSBail = {
    station?: string;
    release_individuals: number;
    gender: string;
    offence: string;
};

const ErrorMessage = ({ error }: { error: any }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 ">
        <div className="text-red-800">Error loading data: {error.message}</div>
    </div>
);


export default function AllUnitsReport() {
    const { selectedZoneId, setSelectedZoneId, selectedDuration, setselectedDuration, selectedStateId, setSeletedStateId, selectedCentreId, setselectedCentreId } = useAction();

    const { data, isLoading, error } = useQuery({
        queryKey: ["getAllUnitReport", selectedZoneId, selectedStateId, selectedDuration, selectedCentreId],
        queryFn: async () => {
            const filters = {
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


    // Extract data from API response
    const adminSummary = data?.data?.admin_unit_summary ?? [];
    const correctionalVisits = data?.data?.correctional_visit ?? [];
    const pdssBail = data?.data?.pdss_bail ?? [];

    return (
        <div className="">
            {/* Header Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <StatCard
                    title="PDSS Cases"
                    bgColor='text-red-500'
                    value={getStatValue(adminSummary, "PDSS Cases")}
                />
                <StatCard
                    title="Oscar unit"
                    value={getStatValue(adminSummary, "Oscar unit")}
                />
                <StatCard
                    title="Correctional Visits"
                    value={getStatValue(adminSummary, "Correctional Visits")}
                />
                <StatCard
                    title="Mediations"
                    value={getStatValue(adminSummary, "Mediations")}
                />
            </div>


            <div className="overflow-x-auto">
                <div className="">
                    <div className="flex justify-between items-center py-4">
                        <h2 className="text-xl font-semibold">Correctional Centre Visits</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable
                        columns={CorrectionalVisitsTable}
                        loading={isLoading}
                        data={correctionalVisits || []}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <div className="">
                    <div className="flex justify-between items-center py-4">
                        <h2 className="text-xl font-semibold">PDSS Bail at Police Stations</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable
                        columns={AllUnitTable}
                        loading={isLoading}
                        data={pdssBail || []}
                    />
                    <div className="bg-black text-white text-end text-sm  pr-6 cursor-pointer hover:bg-gray-800">
                        view all
                    </div>
                </div>
            </div>

        </div>
    );
}


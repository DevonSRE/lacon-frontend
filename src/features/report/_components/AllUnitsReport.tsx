import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetAllUnit } from '../server/reportAction';

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

const StatCard = ({ title, value, bgColor = "bg-gray-100" }: StatCardProps) => (
    <div className={`${bgColor} p-4 rounded-lg shadow-sm`}>
        <div className="text-sm text-gray-600 mb-1">{title}</div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
);

type TableSectionProps = {
    title: string;
    children: React.ReactNode;
    showViewAll?: boolean;
};

const TableSection = ({ title, children, showViewAll = false }: TableSectionProps) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {showViewAll && (
                <button className="text-sm text-blue-600 hover:text-blue-800">
                    View All
                </button>
            )}
        </div>
        <div className="overflow-x-auto">
            {children}
        </div>
    </div>
);

type CorrectionalVisit = {
    center?: string;
    visits: number;
    inmate_assisted: number;
    legal_rep_provided?: string;
};

const CorrectionalVisitsTable = ({ data }: { data: CorrectionalVisit[] }) => (
    <table className="w-full">
        <thead className="bg-gray-50">
            <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Center</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Visits</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Inmates Assisted</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Legal Rep Provided</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center">
                            {index === data.length - 1 && (
                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-white text-xs">!</span>
                                </div>
                            )}
                            {item.center || "N/A"}
                        </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.visits}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.inmate_assisted}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.legal_rep_provided || "N/A"}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

type PDSSBail = {
    station?: string;
    release_individuals: number;
    gender: string;
    offence: string;
};

const PDSSBailTable = ({ data }: { data: PDSSBail[] }) => (
    <table className="w-full">
        <thead className="bg-gray-50">
            <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Station</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Released Individuals</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gender</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Offenses</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.station || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.release_individuals}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.gender}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.offence}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
);

const ErrorMessage = ({ error }: { error: any }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="text-red-800">Error loading data: {error.message}</div>
    </div>
);

export default function AllUnitsReport() {

    const { data, isLoading, error } = useQuery({
        queryKey: ["getAdminReportOverview"],
        queryFn: async () => {
            const filters = {
                // zone: selectedZoneId,
                // state: selectedStateId,
                // duration: selectedDuration,
                // centre: selectedCentreId,
            };
            return await GetAllUnit(filters);
        },
        staleTime: 100000,
    });

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;

    // Extract data from API response
    const adminSummary =
        (data && 'data' in data && data.data && 'admin_unit_summary' in data.data)
            ? data.data.admin_unit_summary
            : [];
    const correctionalVisits =
        (data && 'data' in data && data.data && 'correctional_visit' in data.data)
            ? data.data.correctional_visit
            : [];
    const pdssBail =
        (data && 'data' in data && data.data && 'pdss_bail' in data.data)
            ? data.data.pdss_bail
            : [];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="PDSS Cases"
                        value={getStatValue(adminSummary, "PDSS Cases")}
                        bgColor="bg-red-50"
                    />
                    <StatCard
                        title="Oscar unit"
                        value={getStatValue(adminSummary, "Oscar unit")}
                        bgColor="bg-blue-50"
                    />
                    <StatCard
                        title="Correctional Visits"
                        value={getStatValue(adminSummary, "Correctional Visits")}
                        bgColor="bg-green-50"
                    />
                    <StatCard
                        title="Mediations"
                        value={getStatValue(adminSummary, "Mediations")}
                        bgColor="bg-purple-50"
                    />
                </div>

                {/* Correctional Centre Visits Table */}
                <TableSection title="Correctional Centre Visits" showViewAll={true}>
                    <CorrectionalVisitsTable data={correctionalVisits} />
                </TableSection>

                {/* PDSS Bail at Police Stations Table */}
                <TableSection title="PDSS Bail at Police Stations" showViewAll={true}>
                    <PDSSBailTable data={pdssBail} />
                </TableSection>

                {/* Footer */}
                <div className="bg-black text-white p-4 rounded-lg mt-8">
                    <div className="flex justify-between items-center">
                        <div className="text-sm">Dashboard Data</div>
                        <div className="text-sm opacity-75">Last updated: {new Date().toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}


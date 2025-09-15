import React, { useState } from "react";
import Intro from "@/components/Intro";
import { DataTable } from "@/components/data-table";
import CaseDistributionChart from "./components/CaseDistributionChart";
import { mainColumns } from "./components/table-columns";
import { useQuery } from "@tanstack/react-query";
import { GetAdminReport, GetUnitheadReport } from "../report/server/reportAction";
import { CaseOverview } from "@/types/case";

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle: string;
    titleColor?: string;
}

interface CasesSummation {
    total: number | string;
    closed: number;
    pending: number;
    active: number;
}

interface CaseStatsData {
    Month: string;
    percent: number;
}

interface CaseStatsSummary {
    assigned: {
        Data: CaseStatsData[];
        total: number;
        percent: number;
    };
    unassigned: {
        Data: CaseStatsData[];
        total: number;
        percent: number;
    };
}

interface CaseDistribution {
    title: string;
    count: number;
}

interface ApiResponse {
    data: {
        department_case_summary: CasesSummation;
        case_stats_summary: CaseStatsSummary;
        case_distributions: CaseDistribution[];
    };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, titleColor = "text-gray-500" }) => {
    return (
        <div className="border rounded-xs p-6 space-y-2 shadow-sm bg-white">
            <div className={`text-sm font-medium ${titleColor}`}>{title}</div>
            <div className="text-2xl font-semibold text-black">{value}</div>
            <div className="text-sm text-gray-400">{subtitle}</div>
        </div>
    );
};

export default function StateCordinatorDashboard({ role }: { role: string }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["getStateCordintorAnalysis", currentPage, searchTerm],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                query: searchTerm,
            };
            return await GetUnitheadReport(filters);
        },
        staleTime: 100000,
    }) as { data?: ApiResponse; isLoading: boolean };

    if (!isLoading && data?.data) {
        console.log("Dashboard data:", data.data);
        console.log("Cases summation:", data.data.department_case_summary);
        console.log("Case distributions:", data.data.case_distributions);
    }

    // Safe data access with fallbacks using the actual API structure
    const casesSummation = data?.data?.department_case_summary || {
        total: 0,
        pending: 0,
        closed: 0,
        active: 0
    };
    
    const processCaseStatsData = (caseStats?: CaseStatsSummary) => {
        if (!caseStats) {
            return {
                assignedCases: { categories: [], data: [], total: 0 },
                unassignedCases: { categories: [], data: [], total: 0 }
            };
        }

        // Assigned Cases data
        const assignedData = caseStats.assigned || { Data: [], total: 0, percent: 0 };
        const assignedCategories = assignedData.Data.map(item => item.Month);
        const assignedValues = assignedData.Data.map(item => item.percent);

        // Unassigned Cases data
        const unassignedData = caseStats.unassigned || { Data: [], total: 0, percent: 0 };
        const unassignedCategories = unassignedData.Data.map(item => item.Month);
        const unassignedValues = unassignedData.Data.map(item => item.percent);

        return {
            assignedCases: {
                categories: assignedCategories,
                data: assignedValues,
                total: assignedData.total
            },
            unassignedCases: {
                categories: unassignedCategories,
                data: unassignedValues,
                total: unassignedData.total
            }
        };
    };

    const caseOverview = processCaseStatsData(data?.data?.case_stats_summary);
    const caseDistributions = data?.data?.case_distributions || [];

    // Convert total to number if it's a string
    const totalCases = typeof casesSummation.total === 'string' 
        ? parseInt(casesSummation.total, 10) 
        : casesSummation.total;

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-10">
                <div className="flex justify-between items-center mb-8">
                    <Intro user={role} />
                </div>

                {/* Main Stats Cards using actual API data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Cases"
                        value={totalCases}
                        subtitle="Across all departments"
                        titleColor="text-red-500"
                    />
                    <StatCard
                        title="Pending Cases"
                        value={casesSummation.pending}
                        subtitle="Awaiting assignment"
                    />
                    <StatCard
                        title="Assigned Cases"
                        value={caseOverview.assignedCases.total}
                        subtitle="Currently assigned"
                        titleColor="text-green-500"
                    />
                    <StatCard
                        title="Unassigned Cases"
                        value={caseOverview.unassignedCases.total}
                        subtitle="Awaiting assignment"
                        titleColor="text-orange-500"
                    />
                </div>

                {/* Chart Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Monthly Case Assignment Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-md font-medium text-gray-700 mb-2">Assigned Cases</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Total: {caseOverview.assignedCases.total} ({data?.data?.case_stats_summary?.assigned?.percent || 0}%)
                            </p>
                            {/* You can add a chart component here */}
                        </div>
                        <div>
                            <h4 className="text-md font-medium text-gray-700 mb-2">Unassigned Cases</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Total: {caseOverview.unassignedCases.total} ({data?.data?.case_stats_summary?.unassigned?.percent || 0}%)
                            </p>
                            {/* You can add a chart component here */}
                        </div>
                    </div>
                </div>

                {/* Case Distribution Chart */}
                <CaseDistributionChart data={data?.data} isLoading={isLoading} />
            </div>
        </div>
    );
}
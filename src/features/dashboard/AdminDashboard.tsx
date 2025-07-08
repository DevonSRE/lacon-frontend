import React, { useState } from "react";
import Intro from "@/components/Intro";
import { DataTable } from "@/components/data-table";
import CaseDistributionChart from "./components/CaseDistributionChart";
import { mainColumns } from "./components/table-columns";
import { useQuery } from "@tanstack/react-query";
import { GetAdminReport } from "../report/server/reportAction";
import { CaseOverview } from "@/types/case";

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle: string;
    titleColor?: string;
}

interface CasesSummation {
    totalCases: number;
    pendingAssignments: number;
    weeklyCivilAndCriminal: number;
    probonoApplications: number;
}


interface CaseDistribution {
    title: string;
    count: number;
}

interface ApiResponse {
    data: {
        cases_summation: CasesSummation;
        case_overview: CaseOverview[];
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

export default function AdminDashboard({ role }: { role: string }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["getAdminDashboardAnalysis", currentPage, searchTerm],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                query: searchTerm,
            };
            return await GetAdminReport(filters);
        },
        staleTime: 100000,
    }) as { data?: ApiResponse; isLoading: boolean };

    if (!isLoading && data?.data) {
        console.log("Dashboard data:", data.data);
        console.log("Cases summation:", data.data.cases_summation);
        console.log("Case distributions:", data.data.case_distributions);
    }

    // Safe data access with fallbacks using the actual API structure
    const casesSummation = data?.data?.cases_summation || {
        totalCases: 0,
        pendingAssignments: 0,
        weeklyCivilAndCriminal: 0,
        probonoApplications: 0
    };

    const caseOverview = data?.data?.case_overview || [];
    const caseDistributions = data?.data?.case_distributions || [];

    const getCaseTypeBreakdown = () => {
        const breakdown = { criminal: 0, civil: 0, pdss: 0 };
        caseOverview.forEach(case_item => {
            const type = case_item.case_type.toLowerCase();
            if (type.includes('criminal')) breakdown.criminal++;
            else if (type.includes('civil')) breakdown.civil++;
            else if (type.includes('pdss')) breakdown.pdss++;
        });
        return breakdown;
    };

    const getStateDistribution = () => {
        const states: { [key: string]: number } = {};
        caseOverview.forEach(case_item => {
            const state = case_item.state_of_origin;
            states[state] = (states[state] || 0) + 1;
        });
        return Object.entries(states)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
    };

    const caseTypeBreakdown = getCaseTypeBreakdown();
    const topStates = getStateDistribution();

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-10">
                <div className="flex justify-between items-center mb-8">
                    <Intro user={role} />
                </div>

                {/* Main Stats Cards using actual API data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatCard
                        title="Total Cases"
                        value={casesSummation.totalCases}
                        subtitle="Across all departments"
                        titleColor="text-red-500"
                    />
                    <StatCard
                        title="Pending Assignments"
                        value={casesSummation.pendingAssignments}
                        subtitle="Awaiting department routing"
                    />
                    <StatCard
                        title="Pro Bono Applications"
                        value={casesSummation.probonoApplications}
                        subtitle={casesSummation.probonoApplications > 0 ? "Review needed" : "None pending"}
                    />
                    <StatCard
                        title="Weekly Civil & Criminal"
                        value={casesSummation.weeklyCivilAndCriminal}
                        subtitle="New cases this week"
                    />
                </div>

                {/* Case Assignment Overview Table */}
                <div className="flex flex-1 flex-col gap-4 pt-0">
                    <div className="flex-1 bg-white md:min-h-min">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                            Case Assignment Overview
                        </h3>
                        <div className="flex flex-1 flex-col gap-4 pt-0">
                            <DataTable
                                columns={mainColumns}
                                loading={isLoading || loading}
                                data={caseOverview}
                            />
                        </div>
                    </div>
                </div>
                <CaseDistributionChart data={data?.data} isLoading={isLoading} />
            </div>
        </div>
    );
}
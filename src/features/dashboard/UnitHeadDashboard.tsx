import React, { useState } from "react";
import CaseStatCard from "./components/CaseStatsSummaryChart";
import Intro from "@/components/Intro";
import { AddLawyerSheet } from "./Lawyer/_components/addLawyer";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { ROLES } from "@/types/auth";
import { useAction } from "@/context/ActionContext";
import FileACaseComponent from "../component/FileACase";
import { useQuery } from "@tanstack/react-query";
import { GetUnitheadReport } from "../report/server/reportAction";
import AdminDashboardSkeleton from "@/components/skeleton/dashboard";
import UnitCaseQueues from "./components/UnitCaseQueues";

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle: string;
    titleColor?: string;
}

interface CaseStatsData {
    Month: string;
    percent: number;
}

interface CaseStatsSummary {
    Data: CaseStatsData[];
    total: number;
    percent: number;
}

interface DepartmentCaseSummary {
    total: string;
    closed: number;
    pending: number;
    active: number;
}

interface ApiResponse {
    data: {
        department_case_summary: DepartmentCaseSummary;
        // "unassigned" counts what the Pending card counts.
        case_stats_summary: { assigned?: CaseStatsSummary; unassigned?: CaseStatsSummary };
    };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, titleColor = "text-gray-500" }) => {
    return (
        <div className="border rounded-xs p-6 space-y-2 shadow-sm bg-white">
            <div className={`text-md font-semibold ${titleColor}`}>{title}</div>
            <div className="text-3xl font-semibold text-black">{value}</div>
            <div className="text-md text-green-400">{subtitle}</div>
        </div>
    );
};

export default function UnitHeadDashboard({ role }: { role: string }) {
    const { setIsOpen } = useAction();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["getDashboardAnalysis", currentPage, searchTerm],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                query: searchTerm,
            };
            return await GetUnitheadReport(filters);
        },
        staleTime: 100000,
    });

    if (isLoading) {
        return <AdminDashboardSkeleton />;
    }


    // The last six months of the head's cases, one bar per month.
    const toChart = (stats?: CaseStatsSummary) => ({
        categories: stats?.Data?.map(item => item.Month) ?? [],
        data: stats?.Data?.map(item => item.percent) ?? [],
        total: stats?.total ?? 0,
        percent: stats?.percent ?? 0,
    });
    const caseStats = (data?.data as ApiResponse["data"] | undefined)?.case_stats_summary;
    const processedData = {
        assignedCases: toChart(caseStats?.assigned),
        pendingCases: toChart(caseStats?.unassigned),
    };
    const change = (percent: number) => `${percent >= 0 ? "+" : ""}${percent}%`;

    const handleCaseSubmitted = () => {
    };

    // Safe data access with fallbacks
    const departmentSummary = data?.data?.department_case_summary || {
        total: "0",
        closed: 0,
        pending: 0,
        active: 0
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                        <Intro user={role} />
                        <div className="flex flex-wrap gap-4">
                            {role === ROLES.INTERNAL_PARALEGAL && (
                                <>
                                    {/* Bulk Upload stays hidden until the upload works (QA 2026-10-26, item 29). */}
                                    <FileACaseComponent
                                        userRole={role as ROLES}
                                        buttonText="File a Case"
                                        showIcon={true}
                                        buttonClassName="bg-red-600 hover:bg-red-700 text-white px-4 py-2  flex items-center gap-2 transition-colors h-11"
                                        onCaseSubmitted={handleCaseSubmitted}
                                    />
                                </>
                            )}

                            {(role === ROLES.CIVIL_JUSTICE_DEPT || role === ROLES.CRIMINAL_JUSTICE_DEPT) && (
                                <>
                                    <Button onClick={() => setIsOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2  flex items-center gap-2 transition-colors h-11">
                                        <CirclePlus size={20} />
                                        Add New Lawyer
                                    </Button>
                                    <AddLawyerSheet />
                                </>
                            )}
                            
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Cases"
                            value={departmentSummary.total || "0"}
                            subtitle=""
                        />
                        <StatCard
                            title="Active Cases"
                            value={departmentSummary.active || 0}
                            subtitle=""
                        />
                        <StatCard
                            title="Closed Cases"
                            value={departmentSummary.closed || 0}
                            subtitle=""
                        />
                        <StatCard
                            title="Pending Cases"
                            value={departmentSummary.pending || 0}
                            subtitle=""
                        />
                    </div>

                    <UnitCaseQueues />

                    <div className="">
                        <h2 className="text-lg font-semibold mb-4">Case Stats Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CaseStatCard
                                title="Assigned Cases"
                                value={processedData.assignedCases.total}
                                change={change(processedData.assignedCases.percent)}
                                categories={processedData.assignedCases.categories}
                                data={processedData.assignedCases.data}
                                orientation="horizontal"
                                cardBg="bg-black-50"
                                barColor="#000000"
                            />
                            <CaseStatCard
                                title="Pending Cases"
                                value={processedData.pendingCases.total}
                                change={change(processedData.pendingCases.percent)}
                                categories={processedData.pendingCases.categories}
                                data={processedData.pendingCases.data}
                                orientation="vertical"
                                cardBg="bg-black-50"
                                barColor="#000000"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

import React, { useState } from "react";
import CaseStatCard from "./components/CaseStatsSummaryChart";
import Intro from "@/components/Intro";
import { AddLawyerSheet } from "./Lawyer/_components/addLawyer";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { ROLES } from "@/types/auth";
import BulkCaseUploadDialog from "./components/BulkUpload";
import { useAction } from "@/context/ActionContext";
import FileACaseComponent from "../component/FileACase";
import { useQuery } from "@tanstack/react-query";
import { GetUnitheadReport } from "../report/server/reportAction";
import AdminDashboardSkeleton from "@/components/skeleton/dashboard";

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
        case_stats_summary: CaseStatsSummary[];
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

export default function UnitHeadDashboard() {
    const { data: user } = useAppSelector((state) => state.profile);
    const role = user?.role;
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

    if (!isLoading) {
        console.log(data?.data);
        console.log(data?.data?.length);
    }

    // Helper function to process case stats data
    const processCaseStatsData = (caseStats: CaseStatsSummary[]) => {
        if (!caseStats || caseStats.length === 0) {
            return {
                assignedCases: { categories: [], data: [], total: 0 },
                pendingCases: { categories: [], data: [], total: 0 }
            };
        }

        // First dataset (index 0) - Assigned Cases
        const assignedCasesData = caseStats[0] || { Data: [], total: 0, percent: 0 };
        const assignedCategories = assignedCasesData.Data.map(item => item.Month);
        const assignedData = assignedCasesData.Data.map(item => item.percent);

        // Second dataset (index 1) - Pending Cases  
        const pendingCasesData = caseStats[1] || { Data: [], total: 0, percent: 0 };
        // The second dataset has 24 months (2 years), so we'll take the first 12
        const pendingCategories = pendingCasesData.Data.slice(0, 12).map(item => item.Month);
        const pendingData = pendingCasesData.Data.slice(0, 12).map(item => item.percent);

        return {
            assignedCases: {
                categories: assignedCategories,
                data: assignedData,
                total: assignedCasesData.total
            },
            pendingCases: {
                categories: pendingCategories,
                data: pendingData,
                total: pendingCasesData.total
            }
        };
    };

    const processedData = processCaseStatsData(data?.data?.case_stats_summary || []);

    // Calculate percentage changes (placeholder logic - you can enhance this)
    const calculatePercentageChange = (current: number, previous: number = 0) => {
        if (previous === 0 && current === 0) return "+0%";
        if (previous === 0) return "+100%";
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    const handleCaseSubmitted = () => {
        console.log("Case submitted from dashboard, refreshing stats...");
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
                    <div className="flex justify-between items-center mb-8">
                        <Intro user={user?.first_name ?? "Admin"} />
                        <div className="flex gap-4">
                            {(role === ROLES.OSCAR_UNIT_HEAD || role === ROLES.PARALEGAL || role === ROLES.DECONGESTION_UNIT_HEAD || role === ROLES.PREROGATIVE_OF_MERCY_UNIT_HEAD) && (
                                <>
                                    <BulkCaseUploadDialog />
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
                            subtitle={calculatePercentageChange(parseInt(departmentSummary.total) || 0)}
                        />
                        <StatCard
                            title="Active Cases"
                            value={departmentSummary.active || 0}
                            subtitle={calculatePercentageChange(departmentSummary.active)}
                        />
                        <StatCard
                            title="Closed Cases"
                            value={departmentSummary.closed || 0}
                            subtitle={calculatePercentageChange(departmentSummary.closed)}
                        />
                        <StatCard
                            title="Pending Cases"
                            value={departmentSummary.pending || 0}
                            subtitle={calculatePercentageChange(departmentSummary.pending)}
                        />
                    </div>

                    <div className="">
                        <h2 className="text-lg font-semibold mb-4">Case Stats Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CaseStatCard
                                title="Assigned Cases"
                                value={processedData.assignedCases.total}
                                change={`+${processedData.assignedCases.total > 0 ? '1' : '0'}%`}
                                categories={processedData.assignedCases.categories.length > 0
                                    ? processedData.assignedCases.categories
                                    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                                }
                                data={processedData.assignedCases.data.length > 0
                                    ? processedData.assignedCases.data
                                    : [0, 0, 0, 0, 0, 0]
                                }
                                orientation="horizontal"
                                cardBg="bg-red-50"
                                barColor="#BD2B12"
                            />
                            <CaseStatCard
                                title="Pending Cases"
                                value={processedData.pendingCases.total}
                                change={`+${processedData.pendingCases.total > 0 ? '2' : '0'}%`}
                                categories={processedData.pendingCases.categories.length > 0
                                    ? processedData.pendingCases.categories
                                    : ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                                }
                                data={processedData.pendingCases.data.length > 0
                                    ? processedData.pendingCases.data
                                    : [0, 0, 0, 0, 0, 0]
                                }
                                orientation="vertical"
                                cardBg="bg-red-50"
                                barColor="#BD2B12"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
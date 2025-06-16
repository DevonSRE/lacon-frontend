import { useQuery } from "@tanstack/react-query";
import { GetReportAdminLawyer } from "../server/reportAction";
import { DataTable } from "@/components/data-table";
import Chart from "../charts/Chart";
import { Icons } from "@/icons/icons";
import { laconLawyerColumns, ProbunoLawyerColumns } from "./table_Column"; // Assuming these are imported from your columns file
import { useAction } from "@/context/ActionContext";

// Type definitions for the API response
interface MonthlyBreakdown {
    Month: string;
    percent: number;
}

interface LawyerPerformance {
    user_id: string;
    first_name: string;
    last_name: string;
    case_granted: number;
    completed: number;
    state_name: string;
    success_rate: number;
}

interface LawyerReportData {
    department_case_breakdown: MonthlyBreakdown[];
    lacon_lawyer_performance: LawyerPerformance[];
    probono_lawyer_performance: LawyerPerformance[];
}

// API Response wrapper interface
interface ApiResponse {
    data: LawyerReportData;
}

// Transform data for Chart component
interface ChartData {
    categories: string[];
    series: Array<{
        name: string;
        data: number[];
    }>;
}

function transformMonthlyData(data: MonthlyBreakdown[]): ChartData {
    const categories = data.map(item => item.Month);
    const percentData = data.map(item => item.percent);

    return {
        categories,
        series: [
            {
                name: "Completion Rate (%)",
                data: percentData
            }
        ]
    };
}

export default function LawyersReport() {
    const { selectedZoneId, setSelectedZoneId, selectedDuration, setselectedDuration, selectedStateId, setSeletedStateId, selectedCentreId, setselectedCentreId } = useAction();
    const { data, isLoading, error } = useQuery({
        queryKey: ["getAdminLawyersOverview", selectedZoneId, selectedStateId, selectedDuration, selectedCentreId],
        queryFn: async () => {
            const filters = {
                zone: selectedZoneId,
                state: selectedStateId,
                duration: selectedDuration,
                centre: selectedCentreId,
            };
            return await GetReportAdminLawyer(filters);
        },
        staleTime: 100000,
    });

    // Transform data for chart when available
    const biAnnualChartData = data?.data?.department_case_breakdown
        ? transformMonthlyData(data.data.department_case_breakdown)
        : null;

    // Handle loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    // Handle error state
    if (error || !data) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-600">Error loading data</div>
            </div>
        );
    }

    return (
        <>
            {/* Monthly Completion Chart */}
            <div className="mt-6">
                <h1 className="text-left font-semibold text-xl text-black">
                    Total Cases Completed per Month
                </h1>
                {biAnnualChartData && (
                    <Chart
                        categories={biAnnualChartData.categories}
                        series={biAnnualChartData.series}
                        colors={["#BD2B12", "#2C3E50"]}
                        columnWidth="20%"
                    />
                )}
            </div>

            {/* LACON Lawyers Performance Table */}
            <div className="overflow-x-auto">
                <div className="">
                    <div className="flex justify-between items-center py-4">
                        <h2 className="text-xl font-semibold">LACON Lawyers Performance</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable
                        columns={laconLawyerColumns}
                        loading={isLoading}
                        data={data?.data?.lacon_lawyer_performance || []}
                    />
                    <div className="bg-black text-white text-end text-sm pr-6 cursor-pointer hover:bg-gray-800">
                        view all
                    </div>
                </div>
            </div>

            {/* Pro Bono Lawyers Performance Table */}
            <div className="overflow-x-auto">
                <div className="">
                    <div className="flex justify-between items-center py-4">
                        <h2 className="text-xl font-semibold">Pro Bono Lawyers</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable
                        columns={ProbunoLawyerColumns}
                        loading={isLoading}
                        data={data?.data?.probono_lawyer_performance || []}
                    />
                    <div className="bg-black text-white text-end text-sm pr-6 cursor-pointer hover:bg-gray-800">
                        view all
                    </div>
                </div>
            </div>
        </>
    );
}
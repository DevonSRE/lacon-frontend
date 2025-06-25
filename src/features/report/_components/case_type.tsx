import { DataTable } from "@/components/data-table";
import Chart from "../charts/Chart";
import OffenceCasesChart from "../charts/OffenceCasesChart";
import { Icons } from "@/icons/icons";
import { BiAnnualStatistic, offenceComplain } from "./table_Column";
import { useQuery } from "@tanstack/react-query";
import { GetReportCaseType } from "../server/reportAction";
import { useAction } from "@/context/ActionContext";
import CaseTypeSkeleton from "@/components/skeleton/CaseType";

// Type definitions for the API response
interface DepartmentCaseBreakdown {
    department: string;
    criminal_cases: number;
    civil_cases: number;
    completion_rate: number;
}

interface DepartmentResolutionReport {
    department: string;
    total_cases: number;
    completed_cases: number;
    resolution_rate: number;
}

interface CivilVsCriminal {
    zone: string;
    criminal_cases: number;
    civil_cases: number;
    completion_rate: number;
}

interface CaseTypeReportData {
    department_case_breakdown: DepartmentCaseBreakdown[];
    department_resolution_report: DepartmentResolutionReport[];
    civil_vs_criminal: CivilVsCriminal[];
}

// API Response wrapper interface
interface ApiResponse {
    data: CaseTypeReportData;
}

// Transform data for Chart component
interface ChartData {
    categories: string[];
    series: Array<{
        name: string;
        data: number[];
    }>;
}

function transformCivilVsCriminalData(data: CivilVsCriminal[]): ChartData {
    const categories = data.map(item => item.zone);
    const criminalData = data.map(item => item.criminal_cases);
    const civilData = data.map(item => item.civil_cases);

    return {
        categories,
        series: [
            {
                name: "Criminal Cases",
                data: criminalData
            },
            {
                name: "Civil Cases",
                data: civilData
            }
        ]
    };
}

function transformDepartmentData(data: DepartmentCaseBreakdown[]): ChartData {
    const categories = data.map(item => item.department);
    const criminalData = data.map(item => item.criminal_cases);
    const civilData = data.map(item => item.civil_cases);

    return {
        categories,
        series: [
            {
                name: "Criminal Cases",
                data: criminalData
            },
            {
                name: "Civil Cases",
                data: civilData
            }
        ]
    };
}

export default function CaseTypeReports() {
    const { selectedZoneId, setSelectedZoneId, selectedDuration, setselectedDuration, selectedStateId, setSeletedStateId, selectedCentreId, setselectedCentreId } = useAction();

    const { data, isLoading, error } = useQuery({
        queryKey: ["getAdminCaseTypeOverview", selectedZoneId, selectedStateId, selectedDuration, selectedCentreId],
        queryFn: async () => {
            const filters = {
                zone: selectedZoneId,
                state: selectedStateId,
                duration: selectedDuration,
                centre: selectedCentreId,
            };

            return await GetReportCaseType(filters);
        },
        staleTime: 100000,
    });

    // Transform data for chart when available
    const chartData = data?.data?.civil_vs_criminal
        ? transformCivilVsCriminalData(data.data.civil_vs_criminal)
        : null;
    const departmentChartData = data?.data?.department_case_breakdown
        ? transformDepartmentData(data.data.department_case_breakdown)
        : null;

    if (isLoading) {
        return <CaseTypeSkeleton />;
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading data</div>;
    }

    return (
        <div className="text-center text-gray-500">
            {/* <OffenceCasesChart /> */}
            <div className="mt-6">
                <h1 className="text-left font-semibold text-xl text-black">
                    Case Across Departments
                </h1>
                {departmentChartData && (
                    <Chart
                        categories={departmentChartData.categories}
                        series={departmentChartData.series}
                        colors={["#6D7E9C", "#1D2B39"]}
                        columnWidth="40%"
                    />
                )}
            </div>

            <div className="overflow-x-auto">
                {/* Case Analysis Table */}
                <div className="">
                    <div className="flex justify-between items-center py-4">
                        <h2 className="text-xl font-semibold">Case Resolution Volume</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable
                        columns={offenceComplain}
                        loading={isLoading}
                        data={data?.data?.department_resolution_report || []}
                    />
                </div>
            </div>

            {/* Civil vs Criminal Cases Chart */}
            <div className="mt-6">
                <h1 className="text-left font-semibold text-xl text-black">
                    Civil Vs. Criminal Cases By Zone
                </h1>
                {chartData && (
                    <Chart
                        categories={chartData.categories}
                        series={chartData.series}
                        colors={["#BD2B12", "#2C3E50"]}
                        columnWidth="40%"
                    />
                )}
            </div>
        </div>
    );
}
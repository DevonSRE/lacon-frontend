import { Card, CardContent } from '@/components/ui/card'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts'

import { Icons } from '@/icons/icons'
import { DataTable } from '@/components/data-table'
import { BiAnnualStatistic, stateColumns } from './table_Column'
import Chart from '../charts/Chart'
import { GetReportOverView } from '../server/reportAction'
import { useQuery } from '@tanstack/react-query'
import { useAction } from '@/context/ActionContext'

// Type definitions for the API response
interface CaseReport {
    title: string;
    count: number;
}

interface CaseDistributionReport {
    title: string;
    count: number;
}

interface CaseDistribution {
    case_type: string;
    case_report: CaseDistributionReport[];
}

interface CaseBreakdown {
    state: string;
    accepted: number;
    completed: number;
    received: number;
    criminal: number;
    civil: number;
    active_paralegals: number;
}

interface BiAnnualReport {
    period: string;
    received: number;
    completed: number;
}

interface ApiResponse {
    case_reports: CaseReport[];
    case_distributions: CaseDistribution[];
    case_breakdowns: CaseBreakdown[];
    bi_annual_reports: BiAnnualReport[];
}

// Chart data transformation function
const transformChartData = (caseDistributions: CaseDistribution[]) => {
    const receivedData = caseDistributions.find(dist => dist.case_type === "Cases Received")?.case_report || [];
    const completedData = caseDistributions.find(dist => dist.case_type === "Cases Completed")?.case_report || [];

    return receivedData.map((month, index) => ({
        month: month.title.substring(0, 3), // Shorten month names
        received: month.count,
        completed: completedData[index]?.count || 0
    }));
};

// Chart data for Bi-Annual statistics
const transformBiAnnualChartData = (biAnnualReports: BiAnnualReport[]) => {
    return {
        categories: biAnnualReports.map(report => report.period),
        series: [
            {
                name: 'Cases Received',
                data: biAnnualReports.map(report => report.received)
            },
            {
                name: 'Cases Completed',
                data: biAnnualReports.map(report => report.completed)
            }
        ]
    };
};

export default function Overview() {

    const { selectedZoneId, setSelectedZoneId, selectedDuration, setselectedDuration, selectedStateId, setSeletedStateId, selectedCentreId, setselectedCentreId } = useAction();

    const { data, isLoading, error } = useQuery({
        queryKey: ["getAdminReportOverview", selectedZoneId, selectedStateId, selectedDuration, selectedCentreId],
        queryFn: async () => {
            const filters = {
                zone: selectedZoneId,
                state: selectedStateId,
                duration: selectedDuration,
                centre: selectedCentreId,
            };
            return await GetReportOverView(filters);
        },
        staleTime: 100000,
    });

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

    // Transform data for charts
    const chartData = transformChartData(data?.data?.case_distributions);
    const biAnnualChartData = transformBiAnnualChartData(data?.data?.bi_annual_reports);

    // Get stats from case_reports
    const getStatValue = (title: string): number => {
        return data.data.case_reports.find((report: CaseReport) => report.title === title)?.count || 0;
    };

    const stats = [
        { title: "Cases Received", value: getStatValue("Cases Received") },
        { title: "Cases Accepted", value: getStatValue("Cases Accepted") },
        { title: "Cases Completed", value: getStatValue("Cases Completed") },
        { title: "Criminal Cases", value: getStatValue("Criminal Cases") },
        { title: "Civil Cases", value: getStatValue("Civil Cases") }
    ];

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="bg-[#F4F4F4] rounded-sm border-2 border-[#D9D9D9]">
                        <CardContent className="px-4">
                            <div className="text-sm bg-white rounded-sm p-2 text-center text-green-600 font-medium mb-2">
                                National Data
                            </div>
                            <div className="font-semibold text-gray-600 mt-6">{stat.title}</div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {stat.value.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-600 rounded" />
                        <span className="text-sm text-gray-600">CASES RECEIVED</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-800 rounded" />
                        <span className="text-sm text-gray-600">CASES COMPLETED</span>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#666' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                            <Line
                                type="monotone"
                                dataKey="received"
                                stroke="#dc2626"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#dc2626' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="completed"
                                stroke="#374151"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#374151' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Case Breakdown Table */}
            <div className="overflow-x-auto">
                <div className="">
                    <div className="flex justify-between items-center py-4">
                        <h2 className="text-xl font-semibold">Case Breakdown by State</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable
                        columns={stateColumns}
                        loading={false}
                        data={data?.data?.case_breakdowns}
                    />
                    <div className="bg-black text-white text-end text-sm pr-6 cursor-pointer hover:bg-gray-800">
                        view all
                    </div>
                </div>
            </div>

            {/* Bi-Annual Statistics */}
            <div className="mt-6">
                <h1 className="text-left font-semibold text-xl text-black">Bi-Annual Statistic</h1>
                <Chart
                    categories={biAnnualChartData.categories}
                    series={biAnnualChartData.series}
                    colors={["#BD2B12", "#2C3E50"]}
                    columnWidth="20%"
                />
            </div>

            <div className="overflow-x-auto">
                <div className="">
                    <DataTable
                        columns={BiAnnualStatistic}
                        loading={false}
                        data={data?.data?.bi_annual_reports}
                    />
                </div>
            </div>
        </>
    );
}
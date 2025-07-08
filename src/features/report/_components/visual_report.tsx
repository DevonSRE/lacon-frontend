import { Card, CardContent } from "@/components/ui/card";
import { Router, TrendingUp } from "lucide-react";
import { Icons } from "@/icons/icons";
import { lawyerColumns, stateColumns } from "./table_Column";
import { VisualReportProps } from "./report_types";
import { DataTable } from "@/components/data-table";
import { useRouter } from "next/navigation";
import Link from "next/link";



export default function VisualReport({ stateData, lawyersData }: VisualReportProps) {
    const router = useRouter();

    const StatCard = ({ title, value, subtitle, isHighlighted, }: {
        title: string;
        value: string | number;
        subtitle?: string;
        isHighlighted?: boolean;
    }) => (
        <Card className="p-4 rounded-xs">
            <CardContent className="space-y-2 mt-6">
                <div className={`font-bold ${isHighlighted ? "text-red-500" : "text-black"}`}>
                    {title}
                </div>
                <div className="text-3xl font-bold text-gray-900">{value}</div>
                {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Cases Received" value="1,230" subtitle="Across all departments" isHighlighted />
                <StatCard title="Case Accepted" value="87" />
                <StatCard title="Cases Completed" value="87" />
                <StatCard title="PDSS Bailed Persons" value="54" />
            </div>

            {/* state Table */}
            <div className="">
                <div className="flex justify-between items-center  py-4">
                    <h2 className="text-xl font-semibold">Case Breakdown by State</h2>
                    <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                </div>
                <DataTable columns={stateColumns} loading={false} data={stateData} />
                <Link href="reports/case-break-down-by-state">
                    <div className="bg-black text-white text-end text-sm  pr-6  hover:bg-gray-800">
                        view all
                    </div>
                </Link>
            </div>

            {/* Lawyers Table */}
            <div className="">
                <div className="flex justify-between items-center  py-4 ">
                    <h2 className="text-lg font-semibold">Lawyers Performance</h2>
                    <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                </div>
                <DataTable columns={lawyerColumns} loading={false} data={lawyersData} />
                <div className="bg-black text-white text-end text-sm  pr-6 cursor-pointer hover:bg-gray-800">
                    view all
                </div>
            </div>
        </div>
    );
}

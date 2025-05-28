import { DataTable } from "@/components/data-table";
import Chart from "../charts/Chart";
import OffenceCasesChart from "../charts/OffenceCasesChart";
import { Icons } from "@/icons/icons";
import { BiAnnualStatistic, offenceComplain } from "./table_Column";

export default function CaseTypeReports() {
    const data = {
        categories: ["North", "South ", "East", "West"],
        series: [
            {
                name: "Criminal Cases",
                data: [240, 20, 10, 30],
            },
            {
                name: "Civil Cases",
                data: [40, 200, 30, 50],
            },

        ],
    };
    return (
        <div className="text-center text-gray-500">
            <OffenceCasesChart />
            <div className="overflow-x-auto" >
                {/* state Table */}
                <div className="">
                    <div className="flex justify-between items-center  py-4">
                        <h2 className="text-xl font-semibold">Case Analysis Offence/ComplainComplaint</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable columns={offenceComplain} loading={false} data={[]} />
                </div>
            </div >
            <div className="mt-6">
                <h1 className="text-left font-semibold text-xl text-black">Civil Vs. Criminal Cases By Zone</h1>
                <Chart categories={data.categories} series={data.series} colors={["#BD2B12", "#2C3E50"]} columnWidth="40%" />
            </div>
        </div>);
}
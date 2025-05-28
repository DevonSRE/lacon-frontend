import { DataTable } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/icons/icons";
import { CorrectionalCenterVisit, PdssBailatStation, stateColumns } from './table_Column'


export default function UnitsReports() {
    return (
        // <div className="text-center text-gray-500">  </div>
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                {[
                    { title: "PDSS Cases", value: "1,230", isHighlighted: true },
                    { title: "Oscar Assit", value: "87" },
                    { title: "Correctional Visits", value: "87" },
                    { title: "Mediations", value: "54" }
                ].map((stat, idx) => (
                    <Card key={idx} className="bg-[#F4F4F4] rounded-sm border-2 border-[#D9D9D9]">
                        <CardContent className="px-4 space-y-4">
                            <div className={`font-semibold ${stat.isHighlighted ? "text-red-500" : "text-black"}`}>
                                {stat.title}
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="overflow-x-auto" >
                {/* state Table */}
                <div className="">
                    <div className="flex justify-between items-center  py-4">
                        <h2 className="text-xl font-semibold">Case Breakdown by State</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable columns={CorrectionalCenterVisit} loading={false} data={[]} />
                    {/* <div className="bg-black text-white text-end text-sm  pr-6 cursor-pointer hover:bg-gray-800">
                        view all
                    </div> */}
                </div>
            </div >
            <div className="overflow-x-auto" >
                {/* state Table */}
                <div className="">
                    <div className="flex justify-between items-center  py-4">
                        <h2 className="text-xl font-semibold">Case Breakdown by State</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable columns={PdssBailatStation} loading={false} data={[]} />
                    {/* <div className="bg-black text-white text-end text-sm  pr-6 cursor-pointer hover:bg-gray-800">
                        view all
                    </div> */}
                </div>
            </div >

        </>
    );
}
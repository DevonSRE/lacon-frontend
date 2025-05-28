
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

export default function Overview({ stateData, chartData }: { stateData: any[], chartData: any[] }) {
    const data = {
        categories: ["January to June", "July to Decemeber"],
        series: [
            {
                name: "Cases Received",
                data: [240, 20]
            },
            {
                name: "Cases Completed",
                data: [40, 200],
            },
        ],
    };

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                {[
                    { title: "Cases Received", value: "1,230" },
                    { title: "Case Accepted", value: "87" },
                    { title: "Cases Completed", value: "87" },
                    { title: "Criminal Cases", value: "54" },
                    { title: "Civil Cases", value: "54" }
                ].map((stat, idx) => (
                    <Card key={idx} className="bg-[#F4F4F4] rounded-sm border-2 border-[#D9D9D9]">
                        <CardContent className="px-4">
                            <div className="text-sm bg-white rounded-sm p-2 text-center text-green-600 font-medium mb-2">National Data</div>
                            <div className="font-semibold text-gray-600 mt-6">{stat.title}</div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div >

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8" >
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
                            <Line type="monotone" dataKey="received" stroke="#dc2626" strokeWidth={2} dot={{ r: 4, fill: '#dc2626' }} />
                            <Line type="monotone" dataKey="completed" stroke="#374151" strokeWidth={2} dot={{ r: 4, fill: '#374151' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Case Breakdown Table */}

            <div className="overflow-x-auto" >
                {/* state Table */}
                <div className="">
                    <div className="flex justify-between items-center  py-4">
                        <h2 className="text-xl font-semibold">Case Breakdown by State</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable columns={stateColumns} loading={false} data={stateData} />
                    <div className="bg-black text-white text-end text-sm  pr-6 cursor-pointer hover:bg-gray-800">
                        view all
                    </div>
                </div>
            </div >
            <div className="mt-6">
                <h1 className="text-left font-semibold text-xl text-black">Bi-Annual Statistic</h1>
                <Chart categories={data.categories} series={data.series} colors={["#BD2B12", "#2C3E50"]} columnWidth="20%" />
            </div>


            <div className="overflow-x-auto" >
                {/* state Table */}
                <div className="">
                    <DataTable columns={BiAnnualStatistic} loading={false} data={[]} />
                </div>
            </div >


        </>
    );
}
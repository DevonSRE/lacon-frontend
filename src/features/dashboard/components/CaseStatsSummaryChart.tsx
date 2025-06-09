// 'use client';

// import React from 'react';
// import Chart from 'react-apexcharts';
// // import { Card, CardContent } from "@/components/ui/card";
// import dynamic from "next/dynamic";
// import { ApexOptions } from 'apexcharts';
// import { Card, CardContent } from '@/components/ui/card';

// // Dynamically import the ReactApexChart component
// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//     ssr: false,
// });

// export default function CaseStatsSummaryChart() {

//     const assignedCasesData: ApexOptions = {
//         colors: ["#BD2B12"],
//         series: [{
//             data: [10, 15, 18, 22, 20, 28],
//         }],
//         chart: {
//             type: 'bar',
//             height: 250,
//         },
//         plotOptions: {
//             bar: {
//                 horizontal: true,
//                 barHeight: '50%',
//                 columnWidth: "50%",
//             }
//         },

//         dataLabels: {
//             enabled: false
//         },
//         xaxis: {
//             categories: ['May', 'June', 'April', 'July', 'August', 'September'],
//         },
//     };

//     const pendingCasesData: ApexOptions = {
//         colors: ["#BD2B12"],
//         series: [{
//             data: [18, 13, 7, 5, 3, 1],
//         }],
//         chart: {
//             type: 'bar',
//             height: 250,
//         },
//         plotOptions: {
//             bar: {
//                 horizontal: false,
//                 columnWidth: '50%',
//             }
//         },
//         dataLabels: {
//             enabled: false
//         },
//         xaxis: {
//             categories: ['July', 'April', 'August', 'September', 'May', 'June'],
//         },
//     };


//     return (
//         <div className="p-6">
//             <h2 className="text-lg font-semibold mb-4">Case Stats Summary</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card className='bg-red-50'>
//                     <CardContent className="p-4 ">
//                         <div className="flex items-center justify-between mb-2">
//                             <div>
//                                 <h3 className="text-md font-medium">Assigned Cases</h3>
//                                 <p className="text-3xl font-bold">5 <span className="text-sm text-red-500">+1%</span></p>
//                             </div>
//                             <div className="text-gray-400 text-xl">⋯</div>
//                         </div>
//                         <ReactApexChart options={assignedCasesData} series={assignedCasesData.series} type="bar" height={250} />
//                     </CardContent>
//                 </Card>

//                 <Card className='bg-red-50'>
//                     <CardContent className="p-4">
//                         <div className="flex items-center justify-between mb-2">
//                             <div>
//                                 <h3 className="text-md font-medium">Pending Cases</h3>
//                                 <p className="text-3xl font-bold">15 <span className="text-sm text-red-500">+2%</span></p>
//                             </div>
//                             <div className="text-gray-400 text-xl">⋯</div>
//                         </div>
//                         <ReactApexChart options={pendingCasesData} series={pendingCasesData.series} type="bar" height={250} />
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// };




'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Card, CardContent } from '@/components/ui/card';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
    title: string;
    value: number;
    change: string;
    changeColor?: string;
    categories: string[];
    data: number[];
    barColor?: string;
    cardBg?: string;
    orientation?: 'horizontal' | 'vertical';
};

export default function CaseStatCard({
    title,
    value,
    change,
    changeColor = 'text-red-500',
    categories,
    data,
    barColor = '#BD2B12',
    cardBg = 'bg-white',
    orientation = 'horizontal',
}: Props) {
    const isHorizontal = orientation === 'horizontal';

    const chartOptions: ApexOptions = {
        colors: [barColor],
        chart: {
            type: 'bar',
            height: 250,
        },
        plotOptions: {
            bar: {
                horizontal: isHorizontal,
                barHeight: isHorizontal ? '50%' : undefined,
                columnWidth: !isHorizontal ? '50%' : undefined,
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories,
        },
    };

    return (
        <Card className={`${cardBg}`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h3 className="text-md font-medium">{title}</h3>
                        <p className="text-3xl font-bold">
                            {value}{' '}
                            <span className={`text-sm ${changeColor}`}>
                                {change}
                            </span>
                        </p>
                    </div>
                    <div className="text-gray-400 text-xl">⋯</div>
                </div>
                <ReactApexChart
                    options={chartOptions}
                    series={[{ data }]}
                    type="bar"
                    height={250}
                />
            </CardContent>
        </Card>
    );
}

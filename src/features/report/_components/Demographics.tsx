// pages/index.tsx
import React from 'react';
import PieChart from '@/components/PieChart';
import { Icons } from '@/icons/icons';
import { DataTable } from '@/components/data-table';
import { demographicsTable } from './table_Column';

const pieData = [
    { label: 'Male - Married', value: 35, color: '#c0392b' },
    { label: 'Male - Single', value: 20, color: '#7f8c8d' },
    { label: 'Female - Married', value: 25, color: '#27ae60' },
    { label: 'Female - Married', value: 20, color: '#f1c40f' }, // This may be a typo in your image: two same labels?
];

export default function Demographics() {
    return (
        <>
            <div className="max-w-3xl">
                <div className="flex justify-start gap-4 items-center mb-4">
                    <PieChart data={pieData} />
                    <div className="grid grid-cols-2 space-y-4 w-lg ">
                        <div className='flex  gap-4'>
                            <span className="bg-[#BD2B12] w-10 h-3"></span>
                            <span className='text-xs'>Male - Married</span>
                        </div>

                        <div className='flex  gap-4'>
                            <span className="bg-[#6B788E] w-10 h-3"></span>
                            <span className='text-xs'>Male - Single</span>

                        </div>

                        <div className='flex  gap-4'>
                            <span className="bg-[#34B53A] w-10 h-3"></span>
                            <span className='text-xs'>Female - Married</span>

                        </div>

                        <div className='flex  gap-4'>
                            <span className="bg-[#FBBC04] w-10 h-3"></span>
                            <span className='text-xs'>Female - Married</span>

                        </div>
                    </div>
                </div>
            </div>


            <div className="overflow-x-auto" >
                {/* state Table */}
                <div className="">
                    <div className="flex justify-between items-center  py-4">
                        <h2 className="text-xl font-semibold">Demographics & Case Stats</h2>
                        <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <DataTable columns={demographicsTable} loading={false} data={[]} />
                </div>
            </div >
        </>

    );
}

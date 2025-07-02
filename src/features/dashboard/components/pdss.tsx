'use client';
import { Button } from '@/components/ui/button';
import { AddCaseSheet } from '@/features/component/AddCaseSheet';
import { Icons } from '@/icons/icons';
import { ArrowLeft, ArrowRight, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function PdssDashboard() {
    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const [open, setOpen] = useState(false)
    return (
        <div className="bg-white px-6 space-y-10   flex flex-col py-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-semibold">Welcome</h1>
                    <p className="text-gray-600 ">Today, {today}</p>
                </div>
                <Button
                    onClick={() => setOpen(true)}
                    className="bg-[#C5402D] text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-[#a93823]">
                    <PlusCircle className="w-4 h-4" />
                    <span>File a Case</span>
                </Button>

                <AddCaseSheet open={open} setOpen={setOpen} />
            </div>

            {/* Banner */}
            <div className="flex justify-between bg-gradient-to-r from-[#5C3AFF] to-[#3C1D9C] text-white rounded-xl text-center mb-10 shadow ">
                <Icons.bigLeftFlower />

                <div className="justify-center items-center text-center flex flex-col space-y-2">
                    <h2 className="text-lg font-semibold mb-1">PDSS Officer Account</h2>
                    <p className="text-xs max-w-md text-center flex flex-col mx-auto">
                        As a PDSS Officer, you’re responsible for initiating and filing legal aid requests for individuals detained at police stations.
                    </p>
                </div>
                <Icons.bigRightFlower />

            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center text-center gap-6 mt-20">
                {/* <Trash2 className="w-12 h-12 text-gray-400 mb-4" /> */}
                <Icons.EmptyBin />
                <div className="">
                    <h3 className="text-md font-medium text-gray-700">Click The Button Below to File A New Case</h3>
                    <p className="text-sm text-gray-400 mt-1 mb-6">
                        Statistics Would be Available Once a case is filled
                    </p>
                </div>
                <Button variant='outline' onClick={() => setOpen(true)} className="bg-white px-5 py-2 rounded-md text-sm font-medium flex items-center space-x-2 hover:shadow-md shadow-lg transition-all duration-200 text-black border-0">
                    <ArrowRight className="w-4 h-4" />
                    <span>File A New Case</span>
                </Button>
            </div>

            {/* Pagination */}
            <div className="absolute bottom-0 max-w-(--breakpoint-xl)  w-full flex justify-center bg-white">
                <div className="flex justify-between items-center mt-20  w-full mx-auto">
                    <button className="flex items-center space-x-1 text-sm px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-2 text-sm">
                        {[1, 2, 3, '...', 8, 9, 10].map((item, idx) => (
                            <button
                                key={idx}
                                className={`px-3 py-1 rounded-md ${item === 1 ? 'bg-gray-200' : 'hover:bg-gray-100'} text-gray-700`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <button className="flex items-center space-x-1 text-sm px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100">
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

        </div>
    );
}

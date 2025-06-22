import {  Download } from 'lucide-react';
import SheetReport from './_components/sheet_report';
import { Button } from '@/components/ui/button';

export default function Report() {
    return (
        <div className="flex flex-1 flex-col gap-6 pt-0 lg:mx-0">
            <div className="flex justify-between items-center ">
                <h1 className="text-2xl font-bold text-gray-900">Report</h1>
                <div className="flex gap-3">
                    <Button className="flex items-center gap-2 px-4 py-2 H-11 bg-red-600 text-white  text-sm font-medium hover:bg-red-700">
                        <Download className="w-4 h-4" />
                        Export Report
                    </Button>
                </div>
            </div>
            <SheetReport />
        </div>
    );
};


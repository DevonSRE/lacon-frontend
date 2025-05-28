'use client';
import React, { useState } from 'react';
import { ChevronDown, Download, TrendingUp } from 'lucide-react';
import VisualReport from './_components/visual_report';
import SheetReport from './_components/sheet_report';
import { Icons } from '@/icons/icons';
import { Button } from '@/components/ui/button';

export default function Report() {

    const [currentView, setCurrentView] = useState('sheet'); // 'sheet' or 'visual'

    // Chart data for the line chart
    const chartData = [
        { month: 'January', received: 100, completed: 50 },
        { month: 'February', received: 150, completed: 100 },
        { month: 'March', received: 100, completed: 80 },
        { month: 'April', received: 250, completed: 50 },
        { month: 'May', received: 250, completed: 210 },
        { month: 'June', received: 200, completed: 150 },
        { month: 'July', received: 150, completed: 100 },
        { month: 'August', received: 150, completed: 100 },
        { month: 'September', received: 200, completed: 150 },
        { month: 'October', received: 280, completed: 200 },
        { month: 'November', received: 270, completed: 250 },
        { month: 'December', received: 250, completed: 200 }
    ];

    const stateData = [
        { state: 'Lagos', received: 234, accepted: 123, completed: 100, criminal: 100, civil: 100, activeParalegals: 34 },
        { state: 'Rivers', received: 236, accepted: 456, completed: 200, criminal: 456, civil: 200, activeParalegals: 78 },
        { state: 'Kano', received: 230, accepted: 789, completed: 150, criminal: 0, civil: 0, activeParalegals: 12 },
        { state: 'Oyo', received: 232, accepted: 654, completed: 175, criminal: 0, civil: 0, activeParalegals: 45 }
    ];

    const lawyersData = [
        { name: 'John Bosko', casesGranted: 234, completed: 123, roles: '100' },
        { name: 'John Bosko', casesGranted: 234, completed: 123, roles: '100' },
        { name: 'John Bosko', casesGranted: 234, completed: 123, roles: '100' },
        { name: 'John Bosko', casesGranted: 234, completed: 123, roles: '100' },
        { name: 'John Bosko', casesGranted: 234, completed: 123, roles: '100' },
    ];

    return (
        // <div className="max-w-7xl mx-auto">
        <div className="flex flex-1 flex-col gap-6 pt-0 mx-4 lg:mx-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Report</h1>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentView(currentView === 'sheet' ? 'visual' : 'sheet')}
                        className="flex items-center gap-2  border-0 font-medium text-gray-700 bg-gray-50">
                        <Icons.trendingIcon className="w-4 h-4" />
                        {currentView === 'sheet' ? 'Sheet Report' : 'Visual Report'}
                    </Button>
                    <Button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
                        <Download className="w-4 h-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {currentView === 'sheet' ? (
                <SheetReport stateData={stateData} chartData={chartData} />
            ) : (
                <VisualReport stateData={stateData} lawyersData={lawyersData} />
            )}
        </div>
    );
};


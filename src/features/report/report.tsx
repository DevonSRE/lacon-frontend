'use client';
import React, { useState } from 'react';
import { ChevronDown, Download, TrendingUp } from 'lucide-react';
import VisualReport from './_components/visual_report';
import SheetReport from './_components/sheet_report';
import { Icons } from '@/icons/icons';
import { Button } from '@/components/ui/button';


/**
 * A component that renders a report page, which
 * displays a table and charts of data.
 *
 * The component has two views: a sheet report and a
 * visual report. The sheet report displays a table
 * with some data, while the visual report displays
 * charts and other visualizations of the same data.
 *
 * The component also has a button that allows the
 * user to toggle between the two views.
 *
 * @returns {JSX.Element} The JSX element representing the Report component.
 */
export default function Report() {




    return (
        // <div className="max-w-7xl mx-auto">
        <div className="flex flex-1 flex-col gap-6 pt-0 mx-4 lg:mx-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Report</h1>
                <div className="flex gap-3">
                    {/* <Button variant="outline" onClick={() => setCurrentView(currentView === 'sheet' ? 'visual' : 'sheet')}
                        className="flex items-center gap-2  border-0 font-medium text-gray-700 bg-gray-50">
                        <Icons.trendingIcon className="w-4 h-4" />
                        {currentView === 'sheet' ? 'Sheet Report' : 'Visual Report'}
                    </Button> */}
                    <Button className="flex items-center gap-2 px-4 py-2 H-11 bg-red-600 text-white  text-sm font-medium hover:bg-red-700">
                        <Download className="w-4 h-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            <SheetReport />
            {/* {currentView === 'sheet' ? ( 
            // ) : (
            //     <VisualReport stateData={stateData} lawyersData={lawyersData} />
            // )}
            */}
        </div>
    );
};


// Client Component (SheetReport.jsx)
'use client';

import FilterBar from './filter_bar';
import { useState } from 'react';
import Overview from './overview';
import CaseTypeReports from './case_type';
import UnitsReports from './units';
import Demographics from './Demographics';
import LawyersReport from './LawyersReport';
import AllUnitsReport from './AllUnitsReport';
import OscarUnitsReport from './OscarUnitsReport';
import PerogativeMercyReport from './PerogativeMercyReport';
import DIOReport from './DIOReport';
import DecongestionUnitReport from './DecongestionUnitReport';
import PDSSReport from './PDSSReport';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ExportAdminOverview, ExportCaseType } from '../server/reportAction';

export default function SheetReport() {
    const [activeTab, setActiveTab] = useState('Overview');
    const [isDownloading, setIsDownloading] = useState(false);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <Overview />;
            case 'Case Types':
                return <CaseTypeReports />;
            case 'Lawyers':
                return <LawyersReport />;
            case 'Unit':
                return <UnitsReports />;
            case 'Demographics':
                return <Demographics />;
            case 'All Units':
                return <AllUnitsReport />;
            case 'PDSS':
                return <PDSSReport />;
            case 'Oscar unit':
                return <OscarUnitsReport />;
            case 'perogative of mercy':
                return <PerogativeMercyReport />;
            case 'Decongestion unit':
                return <DecongestionUnitReport />;
            case 'DIO':
                return <DIOReport />;
            default:
                return <div className="text-center text-gray-500">No data available for this tab.</div>;
        }
    };

    const downloadOverviewReportWithServerAction = async () => {
        try {
            setIsDownloading(true);
            let result;
                result = await ExportAdminOverview();
            if (activeTab === 'Case Types') {
                result = await ExportCaseType();
            }
            if (
                result.success &&
                typeof result.data === 'string' &&
                typeof (result as any).filename === 'string' &&
                typeof (result as any).contentType === 'string'
            ) {
                // Convert base64 back to blob
                const byteCharacters = atob(result.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: (result as any).contentType });

                // Create download
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = (result as any).filename;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center ">
                <h1 className="text-2xl font-bold text-gray-900">Report</h1>
                <div className="flex gap-3">
                    {(activeTab === 'Overview' || activeTab === 'Case Types') && (

                    <Button
                        onClick={downloadOverviewReportWithServerAction}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 H-11 bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {isDownloading ? 'Exporting...' : 'Export Report'}
                    </Button>
                    )}

                </div>
            </div>
            <FilterBar activeTab={activeTab} setActiveTab={setActiveTab} />
            {renderTabContent()}
        </>
    );
}


// {{baseUrl}}/export/admin-unit?unit=decongestion unit
// {{baseUrl}}/export/admin-overview
// {{baseUrl}}/export/casetypes


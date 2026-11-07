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
import { ExportAdminLawyer, ExportAdminOverview, ExportAdminUnit, ExportCaseType, ExportDemography } from '../server/reportAction';
import { Ipage } from '@/lib/constants';
import { NATIONAL_READERS } from '../readers';
import ManagementReportTab from './ManagementReport';
import { useAction } from '@/context/ActionContext';
import { toast } from 'sonner';
import { useAppSelector } from '@/hooks/redux';
import { ROLES } from '@/types/auth';

/**
 * Which export answers each tab (T11, criterion 3).
 *
 * The unit tabs share one endpoint, told apart by the unit they name; the rest
 * have their own. Anything unaccounted for falls back to the overview, which is
 * the whole report rather than nothing.
 */
const UNIT_EXPORTS: Record<string, string> = {
    'All Units': '',
    'PDSS': 'pdss unit',
    'Oscar unit': 'oscar unit',
    'perogative of mercy': 'perogative of mercy unit',
    'Decongestion unit': 'decongestion unit',
    'DIO': 'dio unit',
};

async function exportFor(tab: string, filters: Ipage) {
    if (tab === 'Case Types') return ExportCaseType(filters);
    if (tab === 'Lawyers') return ExportAdminLawyer(filters);
    if (tab === 'Demographics') return ExportDemography(filters);
    if (tab === 'Unit' || tab in UNIT_EXPORTS) {
        const unit = UNIT_EXPORTS[tab] ?? '';
        return ExportAdminUnit(unit ? { ...filters, unit } : filters);
    }
    return ExportAdminOverview(filters);
}

export default function SheetReport() {
    const [activeTab, setActiveTab] = useState('Management');
    const [isDownloading, setIsDownloading] = useState(false);
    const { selectedZoneId, selectedStateId, selectedDuration, selectedCentreId } = useAction();
    const { data: user } = useAppSelector((state) => state.profile);
    // Who the export API answers: the same readers as the report itself. It was
    // narrowed to two roles here, so Statistics — who may read the whole
    // country — was shown a page it could not take a copy of (T11).
    const canExport = NATIONAL_READERS.includes(user?.role ?? "");

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Management':
                return <ManagementReportTab />;
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
            // Same filters as the report on screen, so the file matches what the user sees.
            const filters = {
                zone: selectedZoneId,
                state: selectedStateId,
                duration: selectedDuration,
                center: selectedCentreId,
            };
            // Every tab exports what it shows (T11). Export Report used to appear
            // on Overview and Case Types alone, so nine tabs could be read and
            // not taken away.
            const result = await exportFor(activeTab, filters);
            if (
                result.success &&
                typeof result.data === 'string' &&
                'filename' in result && typeof result.filename === 'string' &&
                'contentType' in result && typeof result.contentType === 'string'
            ) {
                // Convert base64 back to blob
                const byteCharacters = atob(result.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: result.contentType });

                // Create download
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = result.filename;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                toast.error('Export failed', {
                    description: 'message' in result && result.message ? String(result.message) : 'The report could not be exported.',
                });
            }
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Export failed', { description: 'Please try again.' });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center ">
                {/* The Management tab carries its own title, period and area (T11). */}
                <h1 className="text-2xl font-bold text-gray-900">{activeTab === 'Management' ? '' : 'Report'}</h1>
                <div className="flex gap-3">
                    {canExport && activeTab !== 'Management' && (

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


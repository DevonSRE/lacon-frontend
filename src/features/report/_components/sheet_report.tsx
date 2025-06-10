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

export default function SheetReport() {
    const [activeTab, setActiveTab] = useState('Overview');


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
                return <AllUnitsReport />;
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

    return (
        <>
            <FilterBar activeTab={activeTab} setActiveTab={setActiveTab} />
            {renderTabContent()}
        </>
    );
}

import FilterBar from './filter_bar';
import { useState } from 'react';
import Overview from './overview';
import CaseTypeReports from './case_type';
import LawyersReport from './lawyers';
import UnitsReports from './units';
import Demographics from './Demographics';

export default function SheetReport({ stateData, chartData }: { stateData: any[]; chartData: any[] }) {
    const [activeTab, setActiveTab] = useState('Overview');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <Overview stateData={stateData} chartData={chartData} />;
            case 'Case Types':
                return <CaseTypeReports />;
            case 'Lawyers':
                return <LawyersReport />;
            case 'Unit':
                return <UnitsReports />;
            case 'Demographics':
                return <Demographics />;
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

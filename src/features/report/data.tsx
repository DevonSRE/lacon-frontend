'use client'
import { useParams } from "next/navigation";
import CaseBreakdown from "./_components/Tables/caseBreakDown";
import LaconLawyerTable from "./_components/Tables/LaconLawyerTable";
import ProbunLawyerTable from "./_components/Tables/ProbunLawyerTable";
import PDSSBAIL from "./_components/Tables/PDSSBail";

export default function ReportData() {
    const params = useParams();
    const tab = params.data;
    const renderTabContent = () => {
        switch (tab) {
            case 'case-break-down-by-state':
                return <CaseBreakdown />;
            case 'pro-buno-lawyers':
                return <ProbunLawyerTable />;
            case 'lacon-lawyers-performance':
                return <LaconLawyerTable />;
              case 'PDSS-bail-at-police-stations':
                return <PDSSBAIL />;
            //   case 'desination-letter':
            //     return <DesinationLetter />;
            default:
                return <>404 page </>;
        }
    };

    return (
        <div className="space-y-8 mb-20 pb-10 ">
            {renderTabContent()}
        </div>
    );
}
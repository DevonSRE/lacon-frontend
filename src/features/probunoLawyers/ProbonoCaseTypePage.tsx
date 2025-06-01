'use client'
import { useParams } from "next/navigation";
import CivilCaseForm from "./components/CivilCaseForm";
import CriminalCaseForm from "./components/CriminalCaseForm";
import PDSSCaseForm from "./components/PSDDCaseForm";

export default function ProbonoCaseTypePage() {
    const params = useParams();
    const tab = params.types;
    console.log(tab);
    const renderTabContent = () => {
        switch (tab) {
            case 'civil':
                return <CivilCaseForm />;
            case 'criminal':
                return <CriminalCaseForm />;
            case 'pdss-instation':
                return <PDSSCaseForm />;
            case 'PDSS-Organisation':
                return <PDSSCaseForm />;
            default:
                return <div className="text-center text-gray-500">No data available for this tab.</div>;
        }
    };

    return (
        <>
            {renderTabContent()}
        </>
    );
}
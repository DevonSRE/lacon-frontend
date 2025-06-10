'use client'
import { useParams, useRouter } from "next/navigation";
import CivilCaseForm from "./components/CivilCaseForm";
import CriminalCaseForm from "./components/CriminalCaseForm";
import PDSSCaseForm from "./components/PSDDCaseForm";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export default function ProbonoCaseTypePage() {
    const router = useRouter();
    const params = useParams();
    const tab = params.types;
    const [currentStep, setCurrentStep] = useState(1);

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        } else {
            router.back();
        }
    }

    const renderTabContent = () => {
        switch (tab) {
            case 'civil':
                return <CivilCaseForm currentStep={currentStep} setCurrentStep={setCurrentStep} />
            case 'criminal':
                return <CriminalCaseForm currentStep={currentStep} setCurrentStep={setCurrentStep} />;
            case 'pdss-instation':
                return <PDSSCaseForm currentStep={currentStep} setCurrentStep={setCurrentStep} />;
            case 'PDSS-Organisation':
                return <PDSSCaseForm />;
            default:
                return <div className="text-center text-gray-500">No data available for this tab.</div>;
        }
    };

    return (
        <div className="max-w-6xl  mx-auto p-10 space-y-8 mb-20 pb-10 ">
            <button className="p-2 hover:bg-gray-100" onClick={handleBack}>
                <ChevronLeft className="w-5 h-5" />
            </button>
            {renderTabContent()}
        </div>
    );
}
'use client'
import { useParams, useRouter } from "next/navigation";
import CivilCaseForm from "../cases/FileCasesTab/CivilCaseForm";
import CriminalCaseForm from "../cases/FileCasesTab/CriminalCaseForm";
import PDSSCaseForm from "../cases/FileCasesTab/PSDDCaseForm";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
                return <CivilCaseForm isPublic={true} currentStep={currentStep} setCurrentStep={setCurrentStep} />
            case 'criminal':
                return <CriminalCaseForm isPublic={true} currentStep={currentStep} setCurrentStep={setCurrentStep} />;
            case 'pdss-instation':
                return <PDSSCaseForm isPublic={true} currentStep={currentStep} setCurrentStep={setCurrentStep} type="pdss-instation" />;
            case 'pdss-organisation':
                return <PDSSCaseForm isPublic={true} currentStep={currentStep} setCurrentStep={setCurrentStep} type="pdss-organisation" />;
            default:
                return <div className="text-center text-gray-500">No data available for this tab.</div>;
        }
    };

    return (
        <div className="max-w-6xl  mx-auto p-10 space-y-8 mb-20 pb-10 ">
            <Button variant={"ghost"} className="bg-white rounded-full " onClick={handleBack}>
                <ArrowLeft className="h-5 text-black w-5" />
            </Button>
            {renderTabContent()}
        </div>
    );
}
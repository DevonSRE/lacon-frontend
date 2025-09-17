import React, { useState } from 'react';
import { CustomeSheet } from '@/components/CustomSheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ROLES } from '@/types/auth';
import CivilCaseForm from '../cases/FileCasesTab/CivilCaseForm';
import CriminalCaseForm from '../cases/FileCasesTab/CriminalCaseForm';
import PDSSCaseForm from '../cases/FileCasesTab/PSDDCaseForm';
import DecongestionForm from '../cases/FileCasesTab/DecongestionForm';
import MercyApplication from '../cases/FileCasesTab/MercyApplication';
import { useAppSelector } from '@/hooks/redux';

interface FileACaseComponentProps {
    userRole: ROLES;
    buttonText?: string;
    buttonClassName?: string;
    showIcon?: boolean;
    onCaseSubmitted?: () => void; // Callback for when a case is successfully submitted
}

export default function FileACaseComponent({ userRole, buttonText, buttonClassName, showIcon, onCaseSubmitted }: FileACaseComponentProps) {
    const [selectedCaseForm, setCaseForm] = useState('');
    const [openFileACase, setOpenFileACase] = useState(false);
    const [openCaseType, setCaseType] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        } else {
            setOpenFileACase(false);
        }
    }

    const { data: user } = useAppSelector((state) => state.profile);
    const state_id = user?.state_id;


    const handleCaseTypeSelection = () => {
        if (selectedCaseForm) {
            setCaseType(true);
            // setOpenFileACase(false);
            // handleCloseFileACase();
        }
    };

    const handleCloseFileACase = () => {
        setOpenFileACase(false);
        setCurrentStep(1);
        setCaseForm(''); // Reset form selection when closing
    };

    const handleCloseCaseType = () => {
        setCaseType(false);
        setCaseForm(''); // Reset form selection when closing
    };

 
    const canFileCase = [
        ROLES.OSCAR_UNIT_HEAD,
        ROLES.INTERNAL_PARALEGAL,
        ROLES.DECONGESTION_UNIT_HEAD,
        ROLES.PDSS,
        ROLES.PREROGATIVE_OF_MERCY_UNIT_HEAD
    ].includes(userRole);

    if (!canFileCase) {
        return null;
    }

    return (
        <>
            <Button
                onClick={() => { setCurrentStep(1); setOpenFileACase(true) }}
                className={buttonClassName}
            >
                {showIcon && <PlusCircle className="w-4 h-4" />}
                {buttonText}
            </Button>

            {/* Case Type Selection Sheet */}
            <CustomeSheet open={openFileACase} setOpen={handleCloseFileACase}>
                <div className="mt-6 space-y-6">
                    <h1 className="text-xl font-semibold">File A Case</h1>
                    <Select value={selectedCaseForm} onValueChange={setCaseForm}>
                        <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Case Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {(userRole === ROLES.OSCAR_UNIT_HEAD || userRole === ROLES.INTERNAL_PARALEGAL) && (
                                <>
                                    <SelectItem value="Civil">Civil</SelectItem>
                                    <SelectItem value="Criminal">Criminal</SelectItem>
                                    <SelectItem value="pdss-instation">PDSS(In Station)</SelectItem>
                                    {/* <SelectItem value="pdss-organisation">PDSS(In Organization)</SelectItem> */}
                                </>
                            )}
                            {userRole === ROLES.DECONGESTION_UNIT_HEAD && (
                                <SelectItem value="Decongestion">Decongestion</SelectItem>
                            )}
                            {userRole === ROLES.PREROGATIVE_OF_MERCY_UNIT_HEAD && (
                                <SelectItem value="MercyApplication">Mercy Application</SelectItem>
                            )}
                            {userRole === ROLES.PDSS && (
                                <SelectItem value="pdss-instation">PDSS</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={handleCaseTypeSelection}
                        disabled={!selectedCaseForm}
                        className={`w-full bg-red-500 h-11 ${selectedCaseForm ? 'bg-red-600 hover:bg-red-700' : ''}`}
                    >
                        Proceed
                    </Button>
                </div>
            </CustomeSheet>

            {/* Case Form Sheet */}
            <CustomeSheet open={openCaseType} backButton={false} setOpen={handleCloseCaseType} className="min-w-3xl">
                <div className="mt-6">
                    {selectedCaseForm === "Civil" && (
                        <CivilCaseForm handleCloseCaseType={handleCloseCaseType} isPublic={false} currentStep={currentStep} setCurrentStep={setCurrentStep} state_id={state_id} />
                    )}
                    {selectedCaseForm === "Criminal" && (
                        <CriminalCaseForm  handleCloseCaseType={handleCloseCaseType} isPublic={false} currentStep={currentStep} setCurrentStep={setCurrentStep} state_id={state_id} />
                    )}
                    {(selectedCaseForm === "pdss-instation" || selectedCaseForm === "pdss-organisation") && (
                        <PDSSCaseForm handleCloseCaseType={handleCloseCaseType} isPublic={false}
                            currentStep={currentStep} setCurrentStep={setCurrentStep} type={selectedCaseForm} state_id={state_id} />
                    )}
                    {selectedCaseForm === "Decongestion" && (
                        <DecongestionForm
                            openFileACase={setOpenFileACase}
                            setOpen={setCaseType}
                            currentStep={currentStep} setCurrentStep={setCurrentStep}
                        />
                    )}
                    {selectedCaseForm === "MercyApplication" && (
                        <MercyApplication openFileACase={setOpenFileACase}
                            setOpen={setCaseType}
                        />
                    )}
                </div>
            </CustomeSheet>
        </>
    );
};


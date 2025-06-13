import React, { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SelectField from '@/components/SelectField';
import { ReviewProbuno } from '@/features/probunoLawyers/server/probonoSchema';
import TextAreaField from '@/components/TextAreaField';
import { Button } from '@/components/ui/button';

interface ApplicationData {
    fullName: string;
    lawyerName: string;
    numLawyers: string;
    firmAddress: string;
    email: string;
    phone: string;
    altNumber: string;
    yearOfCall: string;
    nbaNumber: string;
    yearsExperience: string;
    capacity: string;
    preferredCourt: string;
    submissionDate: string;
}

interface DecisionData {
    decision: string;
    reason: string;
}

type CustomeDialigProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    children?: ReactNode;
    className?: string;

};

export default function ProBonoLawyerApplication({ open, setOpen }: CustomeDialigProps) {

    const applicationData: ApplicationData = {
        fullName: 'Jonathan Potter',
        lawyerName: 'Emmanuel Okoja',
        numLawyers: '5',
        firmAddress: '12 Garki Road, Abuja',
        email: 'emmanuel.okoja@firm.com',
        phone: '+234 801 234 5678',
        altNumber: '+234 801 234 5678',
        yearOfCall: '2018',
        nbaNumber: 'Abuja Branch',
        yearsExperience: '5-10 years',
        capacity: '3-5 cases at a time',
        preferredCourt: 'High Court, Magistrate Court',
        submissionDate: '2025-06-06'
    };
    const [errors, setErrors] = useState<Record<string, string>>({});


    const [decisionData, setDecisionData] = useState<DecisionData>({
        decision: '',
        reason: ''
    });

    const handleDecisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDecisionData(prev => ({
            ...prev,
            decision: e.target.value
        }));
    };

    const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDecisionData(prev => ({
            ...prev,
            reason: e.target.value
        }));
    };

    const handleSubmitDecision = () => {
        if (decisionData.decision) {
            console.log('Decision submitted:', decisionData.decision);
            console.log('Reason:', decisionData.reason);
            // Handle form submission logic here
        }
    };

    const handleCancel = () => {
        setDecisionData({
            decision: '',
            reason: ''
        });
        setOpen(false);
    };

    const InfoRow = ({ label, value }: { label: string; value: string }) => (
        <div className="flex justify-between items-start py-2 border-gray-200 last:border-b-0">
            <span className="text-xs font-medium text-gray-600 min-w-0 flex-shrink-0 mr-4">
                {label}:
            </span>
            <span className="text-xs text-gray-800 text-right">
                {value}
            </span>
        </div>
    );

    const handleSelectChange = (value: string, name: keyof ReviewProbuno) => {
        console.log('Select changed:', name, value); // Debug log
        setDecisionData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user selects
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="mx-auto mr-3 bg-white ">
            <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Review Pro Bono Lawyer Application
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Section 1: Personal Details and Office Info */}
                <div className="p-2 rounded-lg border-[1px] border-gray-200">
                    <h2 className="text-sm font-semibold mb-4 text-gray-700">
                        Section 1: Personal Details and Office Info
                    </h2>

                    <div className="space-y-1 bg-gray-50 p-4">
                        <InfoRow label="Full Name" value={applicationData.fullName} />
                        <InfoRow label="Lawyer's Name" value={applicationData.lawyerName} />
                        <InfoRow label="No. of Lawyers in Firm" value={applicationData.numLawyers} />
                        <InfoRow label="Firm Address" value={applicationData.firmAddress} />
                        <InfoRow label="Email" value={applicationData.email} />
                        <InfoRow label="Phone" value={applicationData.phone} />
                        <InfoRow label="Alt Number" value={applicationData.altNumber} />
                        <InfoRow label="Year of Call" value={applicationData.yearOfCall} />
                        <InfoRow label="NBA Branch" value={applicationData.nbaNumber} />
                    </div>
                </div>

                {/* Right Column Sections */}
                <div className="space-y-8">
                    {/* Section 2: Criminal Law Experience */}
                    <div className="p-2 rounded-lg border-[1px] border-gray-200">
                        <h2 className="text-sm font-semibold mb-4 text-gray-700">
                            Section 2: Criminal Law Experience
                        </h2>
                        <div className="space-y-1 bg-gray-50 p-4">
                            <InfoRow label="Years of Experience" value={applicationData.yearsExperience} />
                        </div>
                    </div>

                    {/* Section 3: Pro Bono Case Handling Capacity */}
                    <div className=" p-2 rounded-lg border-[1px] border-gray-200">
                        <h2 className="text-sm font-semibold mb-4 text-gray-700">
                            Section 3: Pro Bono Case Handling Capacity
                        </h2>

                        <div className="space-y-1 bg-gray-50 p-4">
                            <InfoRow label="Capacity" value={applicationData.capacity} />
                        </div>
                    </div>

                    {/* Section 4: Criminal Matters Preference */}
                    <div className="p-2 rounded-lg border-[1px] border-gray-200">
                        <h2 className="text-sm font-semibold mb-4 text-gray-700">
                            Section 4: Criminal Matters Preference
                        </h2>
                        <div className="space-y-1 bg-gray-50 p-4">
                            <InfoRow label="Preferred Court" value={applicationData.preferredCourt} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 5: Submission Data */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"></div> */}
            <div className="grid grid-cols-2 lg:grid-cols-2 mt-8 mr-3">
                <div className='rounded-lg border-[1px] border-gray-200 p-2'>
                    <h2 className="text-sm font-semibold mb-4 text-gray-700">
                        Section 5: Submission Data
                    </h2>
                    <div className="max-w-md space-y-1 bg-gray-50 p-4">
                        <InfoRow label="Date of Submission" value={applicationData.submissionDate} />
                    </div>
                </div>

                <div>

                </div>
            </div>

            {/* Decision Section */}
            <div className="mt-8 bg-white p-6 rounded-lg border-[1px] border-gray-200">
                <div className='mb-4'>
                    <SelectField
                        name="decision"
                        label="Decision: "
                        placeholder="Select decision"
                        options={[
                            { value: 'Accept', label: 'Accept' },
                            { value: 'Decline', label: 'Decline' }
                        ]}
                        required
                        value={decisionData.decision} // Add value prop
                        onValueChange={(value) => handleSelectChange(value, 'decision')}
                    // error={!!errors.decision}
                    // errorMessage={errors.decision}
                    />
                </div>


                <div className="mb-6">
                    <TextAreaField
                        name="reason"
                        label="Reason for Decision ( If Rejected ):"
                        required
                        placeholder="Enter your permanent address"
                        value={decisionData?.reason}
                        // onChange={(e) => updateField('reason', e.target.value)}
                        error={errors.reason}
                    />
                </div>

                <div className="flex gap-4 text-xs">
                    <Button
                        onClick={handleSubmitDecision}
                        disabled={!decisionData.decision}
                        className="flex-1 bg-black text-white h-11 py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Yes, Submit Decision
                    </Button>
                    <Button onClick={handleCancel} className="flex-1 bg-white text-gray-700 h-11 py-3 px-6 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition duration-200">
                        No, Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};
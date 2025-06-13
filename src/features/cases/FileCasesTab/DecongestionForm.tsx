
import React, { Dispatch, SetStateAction, useActionState, useEffect, useState } from 'react';
import { ChevronLeft, Upload, User, FileText, Scale, Router } from 'lucide-react';
import { caseDetailsSchema, FormDataDEcongestionCase, personalInfoSchema } from '../../probunoLawyers/server/probonoSchema';
import InputField from '@/components/form/input/InputField';
import { Label } from '@/components/ui/label';
import SelectField from '@/components/SelectField';
import TextAreaField from '@/components/TextAreaField';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { stateOptions } from '@/lib/types';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import { toast } from 'sonner';
import { submitPublicCaseForm } from '../../probunoLawyers/server/action';
import CaseIntakeDialog from '../../probunoLawyers/components/CaseIntakeDialog';
import { useAction } from '@/context/ActionContext';

interface DecongestionFormProps {
    currentStep?: number;
    setCurrentStep?: Dispatch<SetStateAction<number>>;
}

export default function DecongestionForm({ currentStep = 1, setCurrentStep = () => { } }: DecongestionFormProps) {

    const router = useRouter();
    // const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(submitPublicCaseForm, undefined);
    const { selectedStateId, setIsOpen } = useAction();
    useEffect(() => {
        if (selectedStateId === "") {
            setIsOpen(true);
        }
    }, [selectedStateId]);

    useEffectAfterMount(() => {
        if (state && CLIENT_ERROR_STATUS.includes(state?.status)) {
            toast.error(
                typeof state?.message === "string" ? state.message : "Something went wrong",
                {
                    description: typeof state?.errors === "string"
                        ? state.errors
                        : state?.errors
                            ? Object.values(state.errors).flat().join(", ")
                            : undefined,
                }
            );

        } else if (state && state.status === 200) {
            toast.success("Case Intake  Submitted successful");
            setOpen(true);
        }
    }, [state]);

    const [formData, setFormData] = useState<FormDataDEcongestionCase>({
        // Personal Info
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        permanent_address: '',
        age: 0,
        phone_number: '',
        marital_status: '',
        email: '',
        state_of_origin: '',
        occupation: '',
        disability_proof: null,
        disability_status: '',

        // Case Details
        case_name: '',
        name_of_defendant: '',
        offence_charged: '',
        charge_number: 0,
        court_of_trial: '',
        date_of_arrest_or_complaint: '',
        date_of_arraignment_or_commencement: '',
        date_of_remand: '',
        last_date_in_court: '',
        next_adjournment: '',
        bail_status: '',

        // Defendant Info
        sex: '',
        date_of_birth_or_age: '',
        name_of_relative: '',
        relative_phone_number: '',

        // Legal Service Info
        offence: '',
        arrest_date: '',
        client_location: '',
        last_court_date: '',
        remand_date: '',
        arraignment_date: '',
        days_in_detention: 0,
        counsel_paralegal: '',
        counsel_designation: '',
        name_of_counsel_or_firm_or_organisation_id: '',
        nature_of_legal_service_provided: '',
        case_status: '',
        date_trial_ended: '',
        case_outcome: ''
    });


    const handleSelectChange = (value: string, name: keyof FormDataDEcongestionCase) => {
        console.log('Select changed:', name, value); // Debug log
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user selects
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const updateField = (field: keyof FormDataDEcongestionCase, value: string | File | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            // toast.error(errors[field]);
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep = (step: number) => {
        try {
            if (step === 1) {
                personalInfoSchema.parse(formData);
            } else if (step === 2) {
                caseDetailsSchema.parse(formData);
            }
            setErrors({});
            return true;
        } catch (error: any) {
            console.log('Validation error:', error); // Dsle.log(error);
            setErrors(error.errors || {});
            return false;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep ?? "")) {
            if (currentStep < 2) {
                setCurrentStep(currentStep + 1);
            } else {
                console.log("selectedStateId " + selectedStateId);
                console.log('Form submitted:', formData);
                const fd = new FormData();
                fd.append("case_type", "Civil Case");
                fd.append("state_id", selectedStateId);
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        fd.append(key, value instanceof File ? value : String(value));
                    }
                });
                formAction(fd);
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        updateField('disability_proof', file);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        } else {
            router.back();
        }
    }

    return (
        <>
            <CaseIntakeDialog
                open={open}
                onOpenChange={setOpen}
                caseReference={state?.data?.reference ?? "LCN-XXXX-XXXX"}
            />
            <div className="min-h-screen">
                {/* Header */}
                <div className="w-full max-w-6xl  flex flex-col sm:flex-row sm:items-center">
                    <div className="flex items-center mb-4 sm:mb-0">

                        <h1 className="text-lg font-semibold text-gray-900">
                            Filing A Civil Case
                        </h1>
                    </div>
                    <div className="flex sm:ml-auto space-x-2 justify-start sm:justify-end">
                        <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm font-medium bg-black text-white  text-gray-600'}`}>
                            1
                        </div>
                        <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm ${currentStep === 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
                            2
                        </div>
                    </div>
                </div>
                <form action={handleNext}>
                    <input type="hidden" name="case_type" value="Civil Case" />
                    <div className="w-full mb-10">
                        {/* Step 1: Personal Information */}
                        {currentStep === 1 && (
                            <div className="bg-white  mt-5 ">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div>
                                        <InputField
                                            label="First Name"
                                            required
                                            name='first_name'
                                            type="text"
                                            placeholder="Enter First Name"
                                            value={formData.first_name}
                                            onChange={(e) => updateField('first_name', e.target.value)}
                                            className={` ${errors.first_name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                                    </div>

                                    <div>
                                        <InputField
                                            label="Middle Name"
                                            name="middle_name"
                                            type="text"
                                            placeholder="Enter Middle Name"
                                            value={formData.middle_name}
                                            onChange={(e) => updateField('middle_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <InputField
                                            label="Last Name"
                                            required
                                            name="last_name"
                                            type="text"
                                            placeholder="Enter Last Name"
                                            value={formData.last_name}
                                            onChange={(e) => updateField('last_name', e.target.value)}
                                            className={` ${errors.last_name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <SelectField
                                            name="gender"
                                            label="Gender"
                                            placeholder="Select Gender"
                                            options={[
                                                { value: 'Male', label: 'Male' },
                                                { value: 'Female', label: 'Female' }
                                            ]}
                                            required
                                            value={formData.gender} // Add value prop
                                            onValueChange={(value) => handleSelectChange(value, 'gender')}
                                            error={!!errors.gender}
                                            errorMessage={errors.gender}
                                        />
                                    </div>
                                    <div>
                                        <InputField
                                            type="number"
                                            label='Age'
                                            name='age'
                                            required
                                            placeholder="Enter Age"
                                            value={formData.age}
                                            onChange={(e) => updateField('age', e.target.value)}
                                            className={` ${errors.age ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <TextAreaField
                                        name="permanent_address" // Fixed: was "offence"
                                        label="Permanent Address"
                                        required
                                        placeholder="Enter your permanent address"
                                        value={formData.permanent_address}
                                        onChange={(e) => updateField('permanent_address', e.target.value)}
                                        error={errors.permanent_address} // Fixed: was errors.offence
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <InputField
                                            type="tel"
                                            label='Phone Number'
                                            name="phone_number"
                                            required
                                            placeholder="0800XXXXXXX"
                                            value={formData.phone_number}
                                            onChange={(e) => updateField('phone_number', e.target.value)}
                                            className={` ${errors.phone_number ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                                    </div>

                                    <div>
                                        <SelectField
                                            name="marital_status"
                                            label="Marital Status"
                                            placeholder="Marital Status"
                                            options={[
                                                { value: 'Single', label: 'Single' },
                                                { value: 'Married', label: 'Married' },
                                                { value: 'Divorced', label: 'Divorced' },
                                                { value: 'Widowed', label: 'Widowed' }
                                            ]}
                                            required
                                            value={formData.marital_status} // Add value prop
                                            onValueChange={(value) => handleSelectChange(value, 'marital_status')}
                                            error={!!errors.marital_status}
                                            errorMessage={errors.marital_status}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <InputField
                                        type="email"
                                        name="email"
                                        label=' Email Address (Optional)'
                                        placeholder="Enter Email Address"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />

                                    <SelectField
                                        name="state_of_origin"
                                        label="State Of Origin"
                                        placeholder="State of Origin"
                                        options={stateOptions}
                                        required
                                        value={formData.state_of_origin} // Add value prop
                                        onValueChange={(value: string) => handleSelectChange(value, 'state_of_origin')}
                                        error={!!errors.state_of_origin}
                                        errorMessage={errors.state_of_origin}
                                    />
                                </div>

                                <div className="mb-6">
                                    <InputField
                                        type="text"
                                        name="occupation"
                                        label='Occupation'
                                        required
                                        placeholder="Trader/Chef/Driver"
                                        value={formData.occupation}
                                        onChange={(e) => updateField('occupation', e.target.value)}
                                        className={` ${errors.occupation ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    />
                                    {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
                                </div>
                                <div className="mb-6">
                                    <SelectField
                                        name="disability_status"
                                        label="Disability (If any)"
                                        placeholder="If yes, upload picture proof)"
                                        options={[
                                            { value: 'yes', label: 'Yes' },
                                            { value: 'no', label: 'No' },
                                        ]}
                                        value={formData.disability_status}
                                        onValueChange={(value) => handleSelectChange(value, 'disability_status')}
                                        error={!!errors.disability_status}
                                        errorMessage={errors.disability_status}
                                    />
                                </div>
                                <div className="mb-6">
                                    <Label className="block  mb-2">
                                        Disability (if any)
                                    </Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500  text-sm mb-2">(If yes, upload picture proof)</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="disability-upload"
                                        />
                                        <label
                                            htmlFor="disability-upload"
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                                        >
                                            Choose File
                                        </label>
                                        {formData.disability_proof && (
                                            <p className="text-sm text-green-600 mt-2">{formData.disability_proof.name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Case Details */}
                        {currentStep === 2 && (
                            <div className="bg-white flex flex-col  mt-5 ">

                                <InputField
                                    label="Case Name"
                                    required
                                    name="case_name"
                                    type="text"
                                    placeholder="Enter Case Name"
                                    value={formData.case_name}
                                    onChange={(e) => updateField('case_name', e.target.value)}
                                    className={`${errors.case_name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />

                                <InputField
                                    label="Name of Defendant"
                                    required
                                    name="name_of_defendant"
                                    type="text"
                                    placeholder="Enter Defendant's Name"
                                    value={formData.name_of_defendant}
                                    onChange={(e) => updateField('name_of_defendant', e.target.value)}
                                    className={`${errors.name_of_defendant ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />

                                <InputField
                                    label="Offence charged"
                                    required
                                    name="offence_charged"
                                    type="text"
                                    placeholder="Type the Offence Here"
                                    value={formData.offence_charged}
                                    onChange={(e) => updateField('offence_charged', e.target.value)}
                                    className={`${errors.offence_charged ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />

                                <InputField
                                    label="Charge Number"
                                    name="charge_number"
                                    type="number"
                                    placeholder="0"
                                    value={formData.charge_number}
                                    onChange={(e) => updateField('charge_number', e.target.value)}
                                    className={`${errors.charge_number ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />

                                <InputField
                                    label="Court of Trial"
                                    required
                                    name="court_of_trial"
                                    type="text"
                                    placeholder="Enter Court"
                                    value={formData.court_of_trial}
                                    onChange={(e) => updateField('court_of_trial', e.target.value)}
                                    className={`${errors.court_of_trial ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />

                                <InputField
                                    label="Date of Arrest/Complaint"
                                    required
                                    name="arrest_date"
                                    type="date"
                                    value={formData.arrest_date}
                                    onChange={(e) => updateField('arrest_date', e.target.value)}
                                    className={`${errors.arrest_date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />

                                <InputField
                                    label="Date of Arraignment/Commencement"
                                    required
                                    name="arraignment_date"
                                    type="date"
                                    value={formData.arraignment_date}
                                    onChange={(e) => updateField('arraignment_date', e.target.value)}
                                    className={`${errors.arraignment_date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />

                                <InputField
                                    label="Date of Remand (if different)"
                                    name="remand_date"
                                    type="date"
                                    value={formData.remand_date}
                                    onChange={(e) => updateField('remand_date', e.target.value)}
                                    className={`${errors.remand_date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                <div>
                                    <SelectField
                                        name="gender"
                                        label="Gender"
                                        placeholder="Select Gender"
                                        options={[
                                            { value: 'Male', label: 'Male' },
                                            { value: 'Female', label: 'Female' }
                                        ]}
                                        required
                                        value={formData.gender} // Add value prop
                                        onValueChange={(value) => handleSelectChange(value, 'gender')}
                                        error={!!errors.gender}
                                        errorMessage={errors.gender}
                                    />
                                </div>


                                <div>
                                    <SelectField
                                        name="marital_status"
                                        label="Marital Status"
                                        placeholder="Marital Status"
                                        options={[
                                            { value: 'Single', label: 'Single' },
                                            { value: 'Married', label: 'Married' },
                                            { value: 'Divorced', label: 'Divorced' },
                                            { value: 'Widowed', label: 'Widowed' }
                                        ]}
                                        required
                                        value={formData.marital_status} // Add value prop
                                        onValueChange={(value) => handleSelectChange(value, 'marital_status')}
                                        error={!!errors.marital_status}
                                        errorMessage={errors.marital_status}
                                    />
                                </div>

                                <InputField
                                    label="Last Date in Court"
                                    name="last_court_date"
                                    type="date"
                                    value={formData.last_court_date}
                                    onChange={(e) => updateField('last_court_date', e.target.value)}
                                    className={`${errors.last_court_date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />

                                <InputField
                                    label="Next Adjournment"
                                    required
                                    name="next_adjournment"
                                    type="date"
                                    value={formData.next_adjournment}
                                    onChange={(e) => updateField('next_adjournment', e.target.value)}
                                    className={`${errors.next_adjournment ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />

                                <InputField
                                    label="Bail Status"
                                    required
                                    name="bail_status"
                                    type="text"
                                    placeholder="Granted, Denied, etc."
                                    value={formData.bail_status}
                                    onChange={(e) => updateField('bail_status', e.target.value)}
                                    className={`${errors.bail_status ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />

                            </div>
                        )}

                        {state?.errors && typeof state.errors === 'object' && (
                            <div className="text-red-500 bg-red-50 p-4 rounded">
                                <h3 className="font-semibold mb-2">Please fix the following errors:</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {Object.entries(state.errors).map(([key, val]) =>
                                        Array.isArray(val)
                                            ? val.map((msg, idx) => (
                                                <li key={`${key}-${idx}`}>{key.replace(/_/g, ' ')}: {msg}</li>
                                            ))
                                            : <li key={key}>{key.replace(/_/g, ' ')}: {String(val)}</li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="grid grid-cols-2  gap-4 mb-6">
                            {currentStep > 1 && (
                                <Button onClick={handleBack} className="h-11 w-full bg-black text-white hover:bg-gray-800 transition-colors font-medium">
                                    Back
                                </Button>
                            )}
                            <Button type="submit" disabled={isPending} className="h-11  w-full bg-red-600 text-white hover:bg-red-700 transition-colors font-medium">
                                {isPending ? 'Submitting...' : currentStep === 2 ? 'Submit Case' : 'Next'}
                            </Button>
                        </div>


                    </div>
                </form>

            </div>
        </>

    );
};

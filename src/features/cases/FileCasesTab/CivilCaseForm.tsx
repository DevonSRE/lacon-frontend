import React, { Dispatch, SetStateAction, useActionState, useEffect, useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { caseDetailsSchema, FormDataCivilCase, personalInfoSchema } from '../../probunoLawyers/server/probonoSchema';
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
import { GetState } from '@/components/get-state';

interface CivilCaseFormProps {
    currentStep?: number;
    setCurrentStep?: Dispatch<SetStateAction<number>>;
    handleCloseCaseType?: Dispatch<SetStateAction<boolean>>;
    isPublic: boolean;
    state_id?: string;
}

export default function CivilCaseForm({ currentStep = 1, isPublic, state_id, setCurrentStep = () => { }, handleCloseCaseType = (() => { }) }: CivilCaseFormProps) {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(submitPublicCaseForm, undefined);
    const { selectedStateId, setIsOpen } = useAction();
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedState, setSelectedState] = useState<string>("");
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
            setCurrentStep(1);
            setOpen(true);
        }
    }, [state]);

    const [formData, setFormData] = useState<FormDataCivilCase>({
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
        complaint: '',
        average_income: '',
        offence: '',
        legal_aid_reason: '',
        number_of_dependants: '',
        client_location: '',
        registration_number: '',
        case_number: '',
        court_of_hearing: '',
        case_status: '',
        defendant_name: '',
        defendant_address: '',
        defendant_phone_number: '',
        court_location: '',
        date_of_admission: '',
        bail_status: '',
        court_of_trial: '',
        prosecuting_agency: ''
    });

    const handleSelectChange = (value: string, name: keyof FormDataCivilCase) => {
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

    const updateField = (field: keyof FormDataCivilCase, value: string | File | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
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
            console.log('Validation error:', error);

            if (error.name === 'ZodError') {
                const formattedErrors: Record<string, string[]> = {};

                error.errors.forEach((err: any) => {
                    const path = err.path.join('.');
                    if (!formattedErrors[path]) {
                        formattedErrors[path] = [];
                    }
                    formattedErrors[path].push(err.message);
                });

                // Convert string[] to string for each error
                const singleStringErrors: Record<string, string> = {};
                Object.entries(formattedErrors).forEach(([key, messages]) => {
                    singleStringErrors[key] = messages.join(', ');
                });

                setErrors(singleStringErrors);
            } else {
                setErrors({});
            }

            return false;
        }
    };


    const handleNext = () => {
        if (validateStep(currentStep ?? 1)) {
            if (currentStep < 2) {
                if (currentStep === 1) {
                    console.log(formData.disability_status);
                    if (formData.disability_status === 'yes' && !formData.disability_proof) {
                        setErrors(prev => ({
                            ...prev,
                            disability_proof: 'Please upload proof of disability.'
                        }));
                        return;
                    }
                    setCurrentStep(currentStep + 1);
                }
            } else {
                const fd = new FormData();
                fd.append("case_type", "CIVIL CASE");
                if (isPublic) {
                    fd.append("state_id", selectedStateId);
                } else {
                    if (!isPublic && state_id != "") {
                        fd.append("state_id", state_id!);
                    } else {
                        fd.append("state_id", selectedState!);
                    }
                }
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        fd.append(key, value instanceof File ? value : String(value));
                    }
                });
                formAction(fd);
            }
        }
    };

    const [fileError, setFileError] = useState("");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (!file) {
            setFileError("No file selected.");
            updateField("disability_proof", null);
            return;
        }

        if (!file.type.startsWith("image/")) {
            setFileError("Please upload a valid image file.");
            updateField("disability_proof", null);
            return;
        }

        const maxSizeInBytes = 5 * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            setFileError("File size exceeds 5MB limit.");
            updateField("disability_proof", null);
            return;
        }

        // ✅ All good
        setFileError("");
        updateField("disability_proof", file);
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
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
                handleCloseCaseType={handleCloseCaseType}
                isHome={isPublic ? true : false}
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
                {/* <form onSubmit={handleNext}> */}
                {/* Changed form to use onSubmit instead of action */}
                <form action={handleNext}>
                    <input type="hidden" name="case_type" value="CIVIL CASE" />
                    <input type="hidden" name="isPublic" value={isPublic ? "true" : "false"} />
                    {(!isPublic && state_id != "") ? (
                        <input type="hidden" name="state_id" value={state_id} />
                    ) :
                        <input type="hidden" name="state_id" value={selectedState} />
                    }
                    <div className="w-full mb-10">
                        {/* Step 1: Personal Information */}
                        {currentStep === 1 && (
                            <div className="bg-white  mt-5 ">
                                {(!isPublic && state_id === "") && (
                                    <div className="space-y-6 my-4">
                                        <Label htmlFor="state-select">Where are you filing from?</Label>
                                        <GetState
                                            value={selectedState}
                                            onValueChange={(val: string) => setSelectedState(val)}
                                            placeholder="Select your state"
                                            onLoadingChange={(loading) => setLoading(loading)}
                                        />
                                    </div>
                                )}
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
                                            value={formData.gender}
                                            onValueChange={(value) => handleSelectChange(value, 'gender')}
                                            error={errors.gender !== undefined && errors.gender !== ''}
                                            errorMessage={errors.gender}
                                        />
                                    </div>
                                    <div>
                                        <InputField
                                            type="number"
                                            label='Age'
                                            min='0'
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
                                        name="permanent_address"
                                        label="Permanent Address"
                                        required
                                        placeholder="Enter your permanent address"
                                        value={formData.permanent_address}
                                        onChange={(e) => updateField('permanent_address', e.target.value)}
                                        error={errors.permanent_address}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                                    <InputField
                                        type="email"
                                        name="email"
                                        label=' Email Address (Optional)'
                                        placeholder="Enter Email Address"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                                        value={formData.marital_status}
                                        onValueChange={(value) => handleSelectChange(value, 'marital_status')}
                                        error={!!errors.marital_status}
                                        errorMessage={errors.marital_status}
                                    />
                                    <SelectField
                                        name="state_of_origin"
                                        label="State Of Origin"
                                        placeholder="State of Origin"
                                        options={stateOptions}
                                        required
                                        value={formData.state_of_origin}
                                        onValueChange={(value: string) => handleSelectChange(value, 'state_of_origin')}
                                        error={!!errors.state_of_origin}
                                        errorMessage={errors.state_of_origin}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                    <SelectField
                                        name="disability_status"
                                        label="Disability (If any)"
                                        placeholder="If yes, upload picture proof"
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

                                {formData.disability_status === "yes" && (
                                    <div className="mb-6">
                                        <Label className="block mb-2">Disability (if any)</Label>
                                        <div className={`rounded-lg p-6 text-center border-2 ${errors.disability_proof ? "border-red-500" : "border-gray-300"}`}>
                                            <CloudUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm mb-2">(If yes, upload picture proof)</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                name="disability_proof"
                                                id="disability-upload"
                                            />
                                            <label
                                                htmlFor="disability-upload"
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                                            >
                                                Choose File
                                            </label>

                                            {formData.disability_proof && !fileError && (
                                                <p className="text-sm text-green-600 mt-2">{formData.disability_proof.name}</p>
                                            )}

                                            {fileError && (
                                                <p className="text-sm text-red-500 mt-2">{fileError}</p>
                                            )}
                                        </div>
                                        {errors.disability_proof && (
                                            <p className={`mt-1.5 text-xs ${errors.disability_proof ? "text-red-500" : errors.disability_proof ? "text-success-500" : "text-gray-500"}`}>
                                                Please Upload Picture Proof of Disability
                                            </p>
                                        )}
                                    </div>
                                )}

                            </div>
                        )}

                        {/* Step 2: Case Details */}
                        {currentStep === 2 && (
                            <div className="bg-white flex flex-col  mt-5 ">

                                <div className="mb-6">
                                    <TextAreaField
                                        name="complaint"
                                        label="Complaint"
                                        placeholder="Type the Complaint Here"
                                        required
                                        value={formData.complaint}
                                        onChange={(e) => updateField('complaint', e.target.value)}
                                        error={errors.complaint}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <InputField
                                            label='Average Income '
                                            name="average_income"
                                            type="number"
                                            required
                                            placeholder="N 00,000,000.00"
                                            value={formData.average_income}
                                            onChange={(e) => updateField('average_income', e.target.value)}
                                            className={` ${errors.average_income ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.average_income && <p className="text-red-500 text-xs mt-1">{errors.average_income}</p>}
                                    </div>

                                    <div>
                                        <InputField
                                            label='Number of Dependants '
                                            type="number"
                                            name="number_of_dependants"
                                            required
                                            placeholder="0"
                                            value={formData.number_of_dependants}
                                            onChange={(e) => updateField('number_of_dependants', e.target.value)}
                                            className={` ${errors.number_of_dependants ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.number_of_dependants && <p className="text-red-500 text-xs mt-1">{errors.number_of_dependants}</p>}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <TextAreaField
                                        name="legal_aid_reason"
                                        label="Reasons for applying for legal aid"
                                        placeholder="Type the reasons for legal aid here"
                                        required
                                        value={formData.legal_aid_reason}
                                        onChange={(e) => updateField('legal_aid_reason', e.target.value)}
                                        error={errors.legal_aid_reason}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <InputField
                                            label='Case No'
                                            name="case_number"
                                            type="text"
                                            placeholder="000000000000"
                                            value={formData.case_number}
                                            onChange={(e) => updateField('case_number', e.target.value)}
                                            className={` ${errors.case_number ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.case_number && <p className="text-red-500 text-xs mt-1">{errors.case_number}</p>}
                                    </div>

                                    <div>
                                        <InputField
                                            label='Court of Hearing'
                                            type="text"
                                            name="court_of_hearing"
                                            placeholder="Enter Court Name"
                                            value={formData.court_of_hearing}
                                            onChange={(e) => updateField('court_of_hearing', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <div>
                                        <InputField
                                            type="text"
                                            name="defendant_name"
                                            label="Defendant's Name"
                                            required
                                            placeholder="Enter Name"
                                            value={formData.defendant_name}
                                            onChange={(e) => updateField('defendant_name', e.target.value)}
                                            className={` ${errors.defendant_name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.defendant_name && <p className="text-red-500 text-xs mt-1">{errors.defendant_name}</p>}
                                    </div>

                                    <div>
                                        <InputField
                                            type="email"
                                            name="defendant_address"
                                            label="Defendant's Address"
                                            required
                                            placeholder="Enter Address"
                                            value={formData.defendant_address}
                                            onChange={(e) => updateField('defendant_address', e.target.value)}
                                            className={` ${errors.defendant_address ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.defendant_address && <p className="text-red-500 text-xs mt-1">{errors.defendant_address}</p>}
                                    </div>

                                    <div>
                                        <InputField
                                            type="tel"
                                            name="defendant_phone_number"
                                            label=" Defendant's Phone number"
                                            required
                                            placeholder="080 0000 000"
                                            value={formData.defendant_phone_number}
                                            onChange={(e) => updateField('defendant_phone_number', e.target.value)}
                                            className={` ${errors.defendant_phone_number ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.defendant_phone_number && <p className="text-red-500 text-xs mt-1">{errors.defendant_phone_number}</p>}
                                    </div>
                                </div>
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
                        <div className="grid grid-cols-2 mt-5 gap-4 mb-6">
                            {currentStep > 1 && (
                                <Button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={isPending}
                                    className="h-11 w-full bg-black text-white hover:bg-gray-800 transition-colors font-medium">
                                    Back
                                </Button>
                            )}
                            <Button type="submit" disabled={isPending} className="h-11 w-full bg-red-600 text-white hover:bg-red-700 transition-colors font-medium" >
                                {isPending ? 'Submitting...' : currentStep === 2 ? 'Submit Case' : 'Next'}
                            </Button>
                        </div>
                    </div>
                </form >
            </div >
        </>
    );
};


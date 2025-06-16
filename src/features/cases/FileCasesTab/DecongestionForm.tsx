
import React, { Dispatch, SetStateAction, useActionState, useState } from 'react';
import { decongestionCaseDetails, FormDataDEcongestionCase, personalDecongestionInfoSchema, personalInfoSchema } from '../../probunoLawyers/server/probonoSchema';
import InputField from '@/components/form/input/InputField';
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
import { Label } from '@/components/ui/label';
import { GetState } from '@/components/get-state';
import CaseCreated from '../_components/CaseCreated';

type CustomeSheetProps = {
    openFileACase: Dispatch<SetStateAction<boolean>>;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function DecongestionForm({ openFileACase, setOpen }: CustomeSheetProps) {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedState, setSelectedState] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [state, formAction, isPending] = useActionState(submitPublicCaseForm, undefined);
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
            setCurrentStep(3);
        }
    }, [state]);
    const [formData, setFormData] = useState<FormDataDEcongestionCase>({
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        age: 35,
        last_address: '',
        marital_status: '',
        have_a_lawyer: '',
        need_legal_aid: '',
        custodial_visit: '',
        date_of_visit: '',

        // Step 2 - Case Details
        case_name: '',
        name_of_defendant: '',
        offence_charged_description: '',
        offence_charged: '',
        charge_number: '',
        court_of_trial: '',
        arrest_date: '',
        arraignment_date: '',
        remand_date: '',
        last_court_date: '',
        next_adjournment: '',
        bail_status: '',

        // Defendant Personal Info
        sex: '',
        date_of_birth_age: '',
        name_of_relative: '',
        relative_phone_number: '',
        state_of_origin: '',
        religion: '',
        average_monthly_income: '',
        stage_of_case: '',
        need_interpreter: '',
        disability_ailment: '',
        confessional_statement: '',
    });


    const handleSelectChange = (value: string, name: keyof FormDataDEcongestionCase) => {
        console.log('Select changed:', name, value);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
                personalDecongestionInfoSchema.parse(formData);
            } else if (step === 2) {
                decongestionCaseDetails.parse(formData);
            }
            setErrors({});
            return true;
        } catch (error: any) {
            console.log('Validation error:', error);
            setErrors(error.errors || {});
            return false;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep ?? "")) {
            if (currentStep < 2) {
                setCurrentStep(currentStep + 1);
                console.log(currentStep);
            } else {
                const fd = new FormData();
                fd.append("case_type", "Decongestion Case");
                fd.append("state_id", selectedState);
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        fd.append(
                            key,
                            typeof value === "object" && value instanceof File ? value : String(value)
                        );
                    }
                });
                formAction(fd);
            }
        }

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

            <div className="min-h-screen p-2">
                {/* Header */}
                {currentStep < 3 && (
                    <>

                        <div className="w-full max-w-6xl  flex flex-col sm:flex-row sm:items-center">
                            <div className="flex items-center mb-4 sm:mb-0">

                                <h1 className="text-lg font-semibold text-gray-900">
                                    Filing A Decongestion Case
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
                                    <div className="bg-white mt-5">
                                        <div className="space-y-6 my-4">
                                            <Label htmlFor="state-select">Case Type</Label>
                                            <div className="w-full bg-gray-300 text-white  items-center flex px-3 h-11  rounded-sm">Decongestion</div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div>
                                                <InputField
                                                    label="Name of Interviewer"
                                                    required
                                                    name='first_name'
                                                    type="text"
                                                    placeholder="John"
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
                                                    placeholder="Median"
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
                                                    placeholder="Doe"
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
                                                    placeholder="select Gender"
                                                    options={[
                                                        { value: 'Male', label: 'Male' },
                                                        { value: 'Female', label: 'Female' }
                                                    ]}
                                                    required
                                                    value={formData.gender}
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
                                                    placeholder="Input Current Age"
                                                    value={formData.age}
                                                    onChange={(e) => updateField('age', e.target.value)}
                                                    className={` ${errors.age ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                />
                                                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <TextAreaField
                                                name="last_address"
                                                label="Last Address"
                                                required
                                                placeholder="Input Current Address"
                                                value={formData.last_address}
                                                onChange={(e) => updateField('last_address', e.target.value)}
                                                error={errors.last_address}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <SelectField
                                                    name="marital_status"
                                                    label="Marital Status"
                                                    placeholder="Input Status Here"
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
                                            </div>
                                            <div>
                                                <SelectField
                                                    name="have_a_lawyer"
                                                    label="Do you have a lawyer?"
                                                    placeholder="Do you have a lawyer"
                                                    options={[
                                                        { value: 'yes', label: 'Yes' },
                                                        { value: 'no', label: 'No' }
                                                    ]}
                                                    required
                                                    value={formData.have_a_lawyer}
                                                    onValueChange={(value) => handleSelectChange(value, 'have_a_lawyer')}
                                                    error={!!errors.have_a_lawyer}
                                                    errorMessage={errors.have_a_lawyer}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <SelectField
                                                    name="need_legal_aid"
                                                    label="Do you wish to be represented by Legal Aid Council?"
                                                    placeholder="Do you wish to be represented by Legal Aid Council"
                                                    options={[
                                                        { value: 'yes', label: 'Yes' },
                                                        { value: 'no', label: 'No' }
                                                    ]}
                                                    required
                                                    value={formData.need_legal_aid}
                                                    onValueChange={(value) => handleSelectChange(value, 'need_legal_aid')}
                                                    error={!!errors.need_legal_aid}
                                                    errorMessage={errors.need_legal_aid}
                                                />
                                            </div>
                                            <div>
                                                <InputField
                                                    type="text"
                                                    name="custodial_visit"
                                                    label='Custodial legal Visited'
                                                    placeholder="custodial legal Visited"
                                                    value={formData.custodial_visit}
                                                    onChange={(e) => updateField('custodial_visit', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="mb-6">
                                                <InputField
                                                    type="date"
                                                    name="date_of_visit"
                                                    label='Custodial legal Visited'
                                                    placeholder="custodial legal Visited"
                                                    value={formData.date_of_visit}
                                                    onChange={(e) => updateField('date_of_visit', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                )}

                                {/* Step 2: Case Details */}
                                {currentStep === 2 && (
                                    <div className="bg-white flex flex-col mt-5">
                                        <div className="space-y-6 my-4">
                                            <Label htmlFor="state-select">Where are you filing from?</Label>
                                            <GetState
                                                value={selectedState}
                                                onValueChange={(val: string) => setSelectedState(val)}
                                                placeholder="Select your state"
                                                onLoadingChange={(loading) => setLoading(loading)}
                                            />
                                        </div>
                                        <div className="mb-6">
                                            <InputField
                                                label="Case Name"
                                                required
                                                name="case_name"
                                                type="text"
                                                placeholder="Case Name"
                                                value={formData.case_name}
                                                onChange={(e) => updateField('case_name', e.target.value)}
                                                className={`${errors.case_name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            />
                                            {errors.case_name && <p className="text-red-500 text-xs mt-1">{errors.case_name}</p>}
                                        </div>

                                        {/* Name of Defendant */}
                                        <div className="mb-6">
                                            <InputField
                                                label="Name of Defendant"
                                                required
                                                name="name_of_defendant"
                                                type="text"
                                                placeholder="Name of Defendant"
                                                value={formData.name_of_defendant}
                                                onChange={(e) => updateField('name_of_defendant', e.target.value)}
                                                className={`${errors.name_of_defendant ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            />
                                            {errors.name_of_defendant && <p className="text-red-500 text-xs mt-1">{errors.name_of_defendant}</p>}
                                        </div>

                                        {/* Offence charged - First one (textarea) */}
                                        <div className="mb-6">
                                            <TextAreaField
                                                name="offence_charged_description"
                                                label="Offence charged"
                                                required
                                                placeholder="Type the Offence Here"
                                                value={formData.offence_charged_description}
                                                onChange={(e) => updateField('offence_charged_description', e.target.value)}
                                                error={errors.offence_charged_description}
                                            />
                                        </div>

                                        {/* Offence charged - Second one (input) */}
                                        <div className="mb-6">
                                            <InputField
                                                label="Offence charged"
                                                required
                                                name="offence_charged"
                                                type="text"
                                                placeholder="Offence"
                                                value={formData.offence_charged}
                                                onChange={(e) => updateField('offence_charged', e.target.value)}
                                                className={`${errors.offence_charged ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            />
                                            {errors.offence_charged && <p className="text-red-500 text-xs mt-1">{errors.offence_charged}</p>}
                                        </div>

                                        {/* Charge Number and Court of Trial */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <InputField
                                                    label="Charge Number"
                                                    required
                                                    name="charge_number"
                                                    type="text"
                                                    placeholder="0"
                                                    value={formData.charge_number}
                                                    onChange={(e) => updateField('charge_number', e.target.value)}
                                                    className={`${errors.charge_number ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                />
                                                {errors.charge_number && <p className="text-red-500 text-xs mt-1">{errors.charge_number}</p>}
                                            </div>
                                            <div>
                                                <InputField
                                                    label="Court of Trial"
                                                    required
                                                    name="court_of_trial"
                                                    type="text"
                                                    placeholder="Court"
                                                    value={formData.court_of_trial}
                                                    onChange={(e) => updateField('court_of_trial', e.target.value)}
                                                    className={`${errors.court_of_trial ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                />
                                                {errors.court_of_trial && <p className="text-red-500 text-xs mt-1">{errors.court_of_trial}</p>}
                                            </div>
                                        </div>

                                        {/* Date of Arrest/Complaint and Date of Arraignment/Commencement */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <InputField
                                                    label="Date of Arrest/Complaint"
                                                    required
                                                    name="arrest_date"
                                                    type="date"
                                                    placeholder="Select Date"
                                                    value={formData.arrest_date}
                                                    onChange={(e) => updateField('arrest_date', e.target.value)}
                                                    className={`${errors.arrest_date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                />
                                                {errors.arrest_date && <p className="text-red-500 text-xs mt-1">{errors.arrest_date}</p>}
                                            </div>
                                            <div>
                                                <InputField
                                                    label="Date of Arraignment/Commencement"
                                                    required
                                                    name="arraignment_date"
                                                    type="date"
                                                    placeholder="Arraignment Date"
                                                    value={formData.arraignment_date}
                                                    onChange={(e) => updateField('arraignment_date', e.target.value)}
                                                    className={`${errors.arraignment_date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                />
                                                {errors.arraignment_date && <p className="text-red-500 text-xs mt-1">{errors.arraignment_date}</p>}
                                            </div>
                                        </div>

                                        {/* Date of Remand and Last Date in Court */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <InputField
                                                    label="Date of Remand(if different from commencement)"
                                                    name="remand_date"
                                                    type="date"
                                                    placeholder="Remand Date"
                                                    value={formData.remand_date}
                                                    onChange={(e) => updateField('remand_date', e.target.value)}
                                                    className={`${errors.remand_date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                />
                                            </div>
                                            <div>
                                                <InputField
                                                    label="Last Date in Court"
                                                    name="last_court_date"
                                                    type="date"
                                                    placeholder="Last Court Date"
                                                    value={formData.last_court_date}
                                                    onChange={(e) => updateField('last_court_date', e.target.value)}
                                                    className={`${errors.last_court_date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                />
                                            </div>
                                        </div>

                                        {/* Next Adjournment */}
                                        <div className="mb-6">
                                            <InputField
                                                label="Next Adjournment"
                                                required
                                                name="next_adjournment"
                                                type="date"
                                                placeholder="Next Adjournment"
                                                value={formData.next_adjournment}
                                                onChange={(e) => updateField('next_adjournment', e.target.value)}
                                                className={`${errors.next_adjournment ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            />
                                            {errors.next_adjournment && <p className="text-red-500 text-xs mt-1">{errors.next_adjournment}</p>}
                                        </div>

                                        {/* Bail Status */}
                                        <div className="mb-6">
                                            <InputField
                                                label="Bail Status(Granted, Denied, Not Perfected, Not Yet Considered)"
                                                required
                                                name="bail_status"
                                                type="text"
                                                placeholder="Bail Status"
                                                value={formData.bail_status}
                                                onChange={(e) => updateField('bail_status', e.target.value)}
                                                className={`${errors.bail_status ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            />
                                            {errors.bail_status && <p className="text-red-500 text-xs mt-1">{errors.bail_status}</p>}
                                        </div>

                                        {/* Sex */}
                                        <div className="mb-6">
                                            <SelectField name="sex"
                                                label="Sex" placeholder=""
                                                options={[
                                                    { value: 'Male', label: 'Male' },
                                                    { value: 'Female', label: 'Female' }
                                                ]} required
                                                value={formData.sex}
                                                onValueChange={(value) => handleSelectChange(value, 'sex')}
                                                error={!!errors.sex}
                                                errorMessage={errors.sex}
                                            />
                                        </div>

                                        {/* Date of Birth/Age */}
                                        <div className="mb-6">
                                            <SelectField
                                                name="date_of_birth_age"
                                                label="Date of Birth/Age"
                                                placeholder="Date of Birth/Age"
                                                options={[
                                                    { value: '18-25', label: '18-25' },
                                                    { value: '26-35', label: '26-35' },
                                                    { value: '36-45', label: '36-45' },
                                                    { value: '46-55', label: '46-55' },
                                                    { value: '56-65', label: '56-65' },
                                                    { value: '65+', label: '65+' }
                                                ]}
                                                required
                                                value={formData.date_of_birth_age}
                                                onValueChange={(value) => handleSelectChange(value, 'date_of_birth_age')}
                                                error={!!errors.date_of_birth_age}
                                                errorMessage={errors.date_of_birth_age}
                                            />
                                        </div>

                                        {/* Marital status */}
                                        <div className="mb-6">
                                            <SelectField
                                                name="marital_status"
                                                label="Marital status"
                                                placeholder=""
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
                                        </div>

                                        {/* Name of Relative */}
                                        <div className="mb-6">
                                            <SelectField
                                                name="name_of_relative"
                                                label="Name of Relative"
                                                placeholder=""
                                                options={[
                                                    { value: 'father', label: 'Father' },
                                                    { value: 'mother', label: 'Mother' },
                                                    { value: 'spouse', label: 'Spouse' },
                                                    { value: 'sibling', label: 'Sibling' },
                                                    { value: 'child', label: 'Child' },
                                                    { value: 'other', label: 'Other' }
                                                ]}
                                                required
                                                value={formData.name_of_relative}
                                                onValueChange={(value) => handleSelectChange(value, 'name_of_relative')}
                                                error={!!errors.name_of_relative}
                                                errorMessage={errors.name_of_relative}
                                            />
                                        </div>

                                        {/* Relative's Phone number */}
                                        <div className="mb-6">
                                            <SelectField
                                                name="relative_phone_number"
                                                label="Relative's Phone number"
                                                placeholder=""
                                                options={[
                                                    { value: 'available', label: 'Available' },
                                                    { value: 'not_available', label: 'Not Available' }
                                                ]}
                                                required
                                                value={formData.relative_phone_number}
                                                onValueChange={(value) => handleSelectChange(value, 'relative_phone_number')}
                                                error={!!errors.relative_phone_number}
                                                errorMessage={errors.relative_phone_number}
                                            />
                                        </div>

                                        {/* State of Origin */}
                                        <div className="mb-6">
                                            <SelectField
                                                name="state_of_origin"
                                                label="State of Origin"
                                                placeholder=""
                                                options={stateOptions}
                                                required
                                                value={formData.state_of_origin}
                                                onValueChange={(value) => handleSelectChange(value, 'state_of_origin')}
                                                error={!!errors.state_of_origin}
                                                errorMessage={errors.state_of_origin}
                                            />
                                        </div>

                                        {/* Religion */}
                                        <div className="mb-6">
                                            <SelectField
                                                name="religion"
                                                label="Religion"
                                                placeholder=""
                                                options={[
                                                    { value: 'Christianity', label: 'Christianity' },
                                                    { value: 'Islam', label: 'Islam' },
                                                    { value: 'Traditional', label: 'Traditional' },
                                                    { value: 'Other', label: 'Other' }
                                                ]}
                                                required
                                                value={formData.religion}
                                                onValueChange={(value) => handleSelectChange(value, 'religion')}
                                                error={!!errors.religion}
                                                errorMessage={errors.religion}
                                            />
                                        </div>

                                        {/* Average monthly Income */}
                                        <div className="mb-6">
                                            <SelectField
                                                name="average_monthly_income"
                                                label="Average monthly Income"
                                                placeholder="Average monthly Income"
                                                options={[
                                                    { value: 'below_18000', label: 'Below ₦18,000' },
                                                    { value: '18000_50000', label: '₦18,000 - ₦50,000' },
                                                    { value: '50000_100000', label: '₦50,000 - ₦100,000' },
                                                    { value: '100000_200000', label: '₦100,000 - ₦200,000' },
                                                    { value: 'above_200000', label: 'Above ₦200,000' }
                                                ]}
                                                required
                                                value={formData.average_monthly_income}
                                                onValueChange={(value) => handleSelectChange(value, 'average_monthly_income')}
                                                error={!!errors.average_monthly_income}
                                                errorMessage={errors.average_monthly_income}
                                            />
                                        </div>

                                        {/* Stage of case */}
                                        <div className="mb-6">
                                            <SelectField
                                                name="stage_of_case"
                                                label="Stage of case"
                                                placeholder="Stage of case"
                                                options={[
                                                    { value: 'arraignment', label: 'Arraignment' },
                                                    { value: 'trial', label: 'Trial' },
                                                    { value: 'judgment', label: 'Judgment' },
                                                    { value: 'appeal', label: 'Appeal' },
                                                    { value: 'other', label: 'Other' }
                                                ]}
                                                required
                                                value={formData.stage_of_case}
                                                onValueChange={(value) => handleSelectChange(value, 'stage_of_case')}
                                                error={!!errors.stage_of_case}
                                                errorMessage={errors.stage_of_case}
                                            />
                                        </div>


                                        {/* Need for Interpreter */}
                                        <div className="mb-6">
                                            <InputField
                                                label="Need for Interpreter(If Yes, Which language?)"
                                                required
                                                name="need_interpreter"
                                                type="text"
                                                placeholder=""
                                                value={formData.need_interpreter}
                                                onChange={(e) => updateField('need_interpreter', e.target.value)}
                                                className={`${errors.need_interpreter ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            />
                                            {errors.need_interpreter && <p className="text-red-500 text-xs mt-1">{errors.need_interpreter}</p>}
                                        </div>

                                        {/* Any Disability or Underlying ailment */}
                                        <div className="mb-6">
                                            <InputField
                                                label="Any Disability or Underlying ailment?"
                                                name="disability_ailment"
                                                type="text"
                                                placeholder=""
                                                value={formData.disability_ailment}
                                                onChange={(e) => updateField('disability_ailment', e.target.value)}
                                                className={`${errors.disability_ailment ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            />
                                        </div>

                                        {/* Any Confessional statement */}
                                        <div className="mb-6">
                                            <InputField
                                                label="Any Confessional statement(How Obtained/Circumstances Thereof)"
                                                name="confessional_statement"
                                                type="text"
                                                placeholder=""
                                                value={formData.confessional_statement}
                                                onChange={(e) => updateField('confessional_statement', e.target.value)}
                                                className={`${errors.confessional_statement ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            />
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
                    </>
                )}
                {currentStep === 3 && (
                    <CaseCreated setOpen={setOpen} openFileACase={openFileACase} />
                )}
            </div>
        </>

    );
};

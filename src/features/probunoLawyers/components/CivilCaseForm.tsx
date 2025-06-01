

import React, { useState } from 'react';
import { ChevronLeft, Upload, User, FileText, Scale, Router } from 'lucide-react';
import { caseDetailsSchema, FormDataCivilCase, personalInfoSchema } from '../server/probonoSchema';
import InputField from '@/components/form/input/InputField';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SelectField from '@/components/SelectField';
import TextAreaField from '@/components/TextAreaField';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


const CivilCaseForm = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<FormDataCivilCase>({
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        permanentAddress: '',
        age: '',
        phoneNumber: '',
        maritalStatus: '',
        emailAddress: '',
        stateOfOrigin: '',
        occupation: '',
        disabilityProof: null,
        disabilityDescription: '',
        complaint: '',
        averageIncome: '',
        reasonsForLegalAid: '',
        numberOfDependants: '',
        registrationNumber: '',
        caseNo: '',
        courtOfHearing: '',
        defendantName: '',
        defendantAddress: '',
        defendantPhone: ''
    });

    const handleSelectChange = (name: keyof FormDataCivilCase, value: string) => {
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
            setErrors(error.errors || {});
            return false;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < 2) {
                setCurrentStep(currentStep + 1);
            } else {
                // Submit form
                console.log('Form submitted:', formData);
                alert('Civil case filed successfully!');
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        updateField('disabilityProof', file);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        } else {
            router.back();
        }
    }



    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="w-full sm:max-w-5xl mt-10 flex">
                <button className="mr-4 p-2 hover:bg-gray-100" onClick={handleBack} >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-3">
                    <h1 className="text-lg font-semibold text-gray-900">Filing A Civil Case</h1>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                    <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center text-sm font-medium">
                        {currentStep}
                    </div>
                    <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded flex items-center justify-center text-sm">
                        2
                    </div>
                </div>
            </div>

            <div className="w-full sm:max-w-5xl mb-10">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                    <div className="bg-white  mt-5 ">
                        <div className="mb-6">
                            <SelectField
                                name="caseType"
                                label="Case Type"
                                placeholder="Select Case Type"
                                options={[
                                    { value: 'Civil Case', label: 'Civil Case' },
                                ]}
                                required
                                formData={formData}
                                handleSelectChange={handleSelectChange}
                                errors={errors}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <InputField
                                    label="First Name"
                                    required
                                    type="text"
                                    placeholder="Enter First Name"
                                    value={formData.firstName}
                                    onChange={(e) => updateField('firstName', e.target.value)}
                                    className={` ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>

                            <div>
                                <InputField
                                    label="Middle Name"
                                    name="first"
                                    type="text"
                                    placeholder="Enter Middle Name"
                                    value={formData.middleName}
                                    onChange={(e) => updateField('middleName', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <InputField
                                    label="Last Name"
                                    required
                                    name="first"
                                    type="text"
                                    placeholder="Enter Last Name"
                                    value={formData.lastName}
                                    onChange={(e) => updateField('lastName', e.target.value)}
                                    className={` ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
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
                                    formData={formData}
                                    handleSelectChange={handleSelectChange}
                                    errors={errors}
                                />
                            </div>
                            <div>
                                <InputField
                                    type="number"
                                    label='Age'
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
                                name="offence"
                                label="Permanent Address"
                                required
                                placeholder="Type the Offence Here"
                                value={formData.permanentAddress}
                                onChange={(e) => updateField('permanentAddress', e.target.value)}
                                error={errors.offence}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <InputField
                                    type="tel"
                                    label='Phone Number '
                                    required
                                    placeholder="0800XXXXXXX"
                                    value={formData.phoneNumber}
                                    onChange={(e) => updateField('phoneNumber', e.target.value)}
                                    className={` ${errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                            </div>

                            <div>
                                <SelectField
                                    name="maritalStatus"
                                    label="Marital Status"
                                    placeholder="Marital Status"
                                    options={[
                                        { value: 'Single', label: 'Single' },
                                        { value: 'Married', label: 'Married' },
                                        { value: 'Divorced', label: 'Divorced' },
                                        { value: 'Widowed', label: 'Widowed' }
                                    ]}
                                    required
                                    formData={formData}
                                    handleSelectChange={handleSelectChange}
                                    errors={errors}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <InputField
                                type="email"
                                label=' Email Address (Optional)'
                                placeholder="Enter Email Address"
                                value={formData.emailAddress}
                                onChange={(e) => updateField('emailAddress', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />

                            <SelectField
                                name="stateOfOrigin"
                                label="State Of Origin"
                                placeholder="State of Origin"
                                options={[
                                    { value: 'Lagos', label: 'Lagos' },
                                    { value: 'Abuja', label: 'Abuja' },
                                    { value: 'Kaduna', label: 'Kaduna' }
                                ]}
                                required
                                formData={formData}
                                handleSelectChange={handleSelectChange}
                                errors={errors}
                            />
                        </div>

                        <div className="mb-6">
                            <InputField
                                type="text"
                                label='Occupation'
                                placeholder="Trader/Chef/Driver"
                                value={formData.occupation}
                                onChange={(e) => updateField('occupation', e.target.value)}
                                className={` ${errors.occupation ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                            />
                            {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
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
                                {formData.disabilityProof && (
                                    <p className="text-sm text-green-600 mt-2">{formData.disabilityProof.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <TextAreaField
                                name="offence"
                                label="  Disability Description (if any)"
                                placeholder="Type the Offence Here"
                                value={formData.disabilityDescription}
                                onChange={(e) => updateField('disabilityDescription', e.target.value)}
                                error={errors.offence}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Case Details */}
                {currentStep === 2 && (
                    <div className="bg-white rounded-lg shadow-sm border ">
                        <div className="mb-6">
                            <TextAreaField
                                name="Complaint"
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
                                    type="text"
                                    required
                                    placeholder="N 00,000,000.00"
                                    value={formData.averageIncome}
                                    onChange={(e) => updateField('averageIncome', e.target.value)}
                                    className={` ${errors.averageIncome ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.averageIncome && <p className="text-red-500 text-xs mt-1">{errors.averageIncome}</p>}
                            </div>

                            <div>
                                <InputField
                                    label='Number of Dependants '
                                    type="number"
                                    required
                                    placeholder="0"
                                    value={formData.numberOfDependants}
                                    onChange={(e) => updateField('numberOfDependants', e.target.value)}
                                    className={` ${errors.numberOfDependants ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.numberOfDependants && <p className="text-red-500 text-xs mt-1">{errors.numberOfDependants}</p>}
                            </div>
                        </div>

                        <div className="mb-6">
                            <TextAreaField
                                name="reasonsForLegalAid"
                                label="Reasons for applying for legal aid"
                                placeholder="Type the reasonsForLegalAid Here"
                                required
                                value={formData.reasonsForLegalAid}
                                onChange={(e) => updateField('reasonsForLegalAid', e.target.value)}
                                error={errors.reasonsForLegalAid}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <InputField
                                    type="text"
                                    required
                                    label=' Registration Number'
                                    placeholder="000000000000000"
                                    value={formData.registrationNumber}
                                    onChange={(e) => updateField('registrationNumber', e.target.value)}
                                    className={` ${errors.registrationNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
                            </div>

                            <div>
                                <InputField
                                    label='Case No'
                                    type="text"
                                    placeholder="000000000000"
                                    value={formData.caseNo}
                                    onChange={(e) => updateField('caseNo', e.target.value)}
                                    className={` ${errors.caseNo ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.caseNo && <p className="text-red-500 text-xs mt-1">{errors.caseNo}</p>}
                            </div>

                            <div>
                                <InputField
                                    label='Court of Hearing'
                                    type="text"
                                    placeholder="Enter Court Name"
                                    value={formData.courtOfHearing}
                                    onChange={(e) => updateField('courtOfHearing', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div>
                                <InputField
                                    type="text"
                                    label="Defendant's Name"
                                    required
                                    placeholder="Enter Name"
                                    value={formData.defendantName}
                                    onChange={(e) => updateField('defendantName', e.target.value)}
                                    className={` ${errors.defendantName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.defendantName && <p className="text-red-500 text-xs mt-1">{errors.defendantName}</p>}
                            </div>

                            <div>
                                <InputField
                                    type="text"
                                    label="Defendant's Address"
                                    required
                                    placeholder="Enter Address"
                                    value={formData.defendantAddress}
                                    onChange={(e) => updateField('defendantAddress', e.target.value)}
                                    className={` ${errors.defendantAddress ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.defendantAddress && <p className="text-red-500 text-xs mt-1">{errors.defendantAddress}</p>}
                            </div>

                            <div>

                                <InputField
                                    type="tel"
                                    label=" Defendant's Phone number"
                                    placeholder="080 0000 000"
                                    value={formData.defendantPhone}
                                    onChange={(e) => updateField('defendantPhone', e.target.value)}
                                    className={` ${errors.defendantPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.defendantPhone && <p className="text-red-500 text-xs mt-1">{errors.defendantPhone}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between  pb-24 ">
                    {currentStep > 1 && (
                        <Button
                            onClick={handleBack}
                            className="px-8 py-3 bg-black text-white  hover:bg-gray-800 transition-colors font-medium"
                        >
                            Back
                        </Button>
                    )}

                    <Button
                        onClick={handleNext}
                        className={`px-8 py-3 bg-red-600 w-full text-white  hover:bg-red-700 transition-colors font-medium ${currentStep === 1 ? 'ml-auto' : ''
                            }`}
                    >
                        {currentStep === 2 ? 'Submit Case' : 'Next'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CivilCaseForm;
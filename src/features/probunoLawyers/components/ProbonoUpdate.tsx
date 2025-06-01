'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { submitLawyersForm } from '../server/action';

// Types
interface ProBonoCase {
    id: string;
    clientName: string;
    sex: string;
    dateYearTookCase: string;
    natureOfServices: string;
    theOfferingCharge: string;
    suitNumber: string;
    statusOfCase: string;
    lastDateOfAppearance: string;
    isClientInCustody: string;
}

interface FormData {
    lawyerName: string;
    contactAddress: string;
    contactPhoneNumber: string;
    proBonoCases: ProBonoCase[];
}

interface FormState {
    success: boolean;
    message: string;
    errors?: Record<string, string>;
}

export default function LawyersAnnualCasesReviewForm() {
    const [formState, formAction] = useFormState(submitLawyersForm, {
        success: false,
        message: ''
    });

    const [formData, setFormData] = useState<FormData>({
        lawyerName: '',
        contactAddress: '',
        contactPhoneNumber: '',
        proBonoCases: [{
            id: '1',
            clientName: '',
            sex: '',
            dateYearTookCase: '',
            natureOfServices: '',
            theOfferingCharge: '',
            suitNumber: '',
            statusOfCase: '',
            lastDateOfAppearance: '',
            isClientInCustody: ''
        }]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const addProBonoCase = () => {
        const newCase: ProBonoCase = {
            id: Date.now().toString(),
            clientName: '',
            sex: '',
            dateYearTookCase: '',
            natureOfServices: '',
            theOfferingCharge: '',
            suitNumber: '',
            statusOfCase: '',
            lastDateOfAppearance: '',
            isClientInCustody: ''
        };

        setFormData(prev => ({
            ...prev,
            proBonoCases: [...prev.proBonoCases, newCase]
        }));
    };

    const removeProBonoCase = (id: string) => {
        if (formData.proBonoCases.length > 1) {
            setFormData(prev => ({
                ...prev,
                proBonoCases: prev.proBonoCases.filter(case_ => case_.id !== id)
            }));
        }
    };

    const updateProBonoCase = (id: string, field: keyof ProBonoCase, value: string) => {
        setFormData(prev => ({
            ...prev,
            proBonoCases: prev.proBonoCases.map(case_ =>
                case_.id === id ? { ...case_, [field]: value } : case_
            )
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            // Create FormData object for the server action
            const formDataToSubmit = new FormData();

            // Add basic form fields
            formDataToSubmit.append('lawyerName', formData.lawyerName);
            formDataToSubmit.append('contactAddress', formData.contactAddress);
            formDataToSubmit.append('contactPhoneNumber', formData.contactPhoneNumber);

            // Add pro bono cases as JSON string
            formDataToSubmit.append('proBonoCases', JSON.stringify(formData.proBonoCases));

            // await formAction(formDataToSubmit);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFieldError = (fieldName: string) => {
        return formState.errors?.[fieldName];
    };

    return (
        <div className="mx-auto p-6 pb-20 bg-white">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Lawyers Annual Cases Review Form List Of Cases
                </h1>
                <p className="text-center text-sm text-gray-600">
                    *This information would be treated as confidential in line with the SRA Guide/Rules
                </p>
            </div>

            {formState.message && (
                <div className={`mb-6 p-4 rounded-md ${formState.success
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                    {formState.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Personal Details and Office Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-6 text-gray-800">
                        SECTION 1: Personal Details and Office Info
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lawyer's Name *
                            </label>
                            <input
                                type="text"
                                value={formData.lawyerName}
                                onChange={(e) => setFormData(prev => ({ ...prev, lawyerName: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('lawyerName') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter Email Address"
                            />
                            {getFieldError('lawyerName') && (
                                <p className="mt-1 text-sm text-red-600">{getFieldError('lawyerName')}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Address *
                            </label>
                            <input
                                type="text"
                                value={formData.contactAddress}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactAddress: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('contactAddress') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter Address"
                            />
                            {getFieldError('contactAddress') && (
                                <p className="mt-1 text-sm text-red-600">{getFieldError('contactAddress')}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Phone Number *
                            </label>
                            <input
                                type="tel"
                                value={formData.contactPhoneNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactPhoneNumber: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError('contactPhoneNumber') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter Email Address"
                            />
                            {getFieldError('contactPhoneNumber') && (
                                <p className="mt-1 text-sm text-red-600">{getFieldError('contactPhoneNumber')}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section 2: Pro Bono Cases */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-6 text-gray-800">
                        SECTION 2: List of all ProBono Cases You are Currently handling
                    </h2>

                    {getFieldError('proBonoCases') && (
                        <p className="mb-4 text-sm text-red-600">{getFieldError('proBonoCases')}</p>
                    )}

                    {formData.proBonoCases.map((case_, index) => (
                        <div key={case_.id} className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-medium text-gray-700">Case {index + 1}</h3>
                                {formData.proBonoCases.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeProBonoCase(case_.id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Remove Case
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Client Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={case_.clientName}
                                        onChange={(e) => updateProBonoCase(case_.id, 'clientName', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError(`case_${index}_clientName`) ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter here"
                                    />
                                    {getFieldError(`case_${index}_clientName`) && (
                                        <p className="mt-1 text-xs text-red-600">{getFieldError(`case_${index}_clientName`)}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sex *
                                    </label>
                                    <select
                                        value={case_.sex}
                                        onChange={(e) => updateProBonoCase(case_.id, 'sex', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError(`case_${index}_sex`) ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">male or female</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {getFieldError(`case_${index}_sex`) && (
                                        <p className="mt-1 text-xs text-red-600">{getFieldError(`case_${index}_sex`)}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date/Year you took the case *
                                    </label>
                                    <input
                                        type="date"
                                        value={case_.dateYearTookCase}
                                        onChange={(e) => updateProBonoCase(case_.id, 'dateYearTookCase', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError(`case_${index}_dateYearTookCase`) ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="MM/DD/YYYY"
                                    />
                                    {getFieldError(`case_${index}_dateYearTookCase`) && (
                                        <p className="mt-1 text-xs text-red-600">{getFieldError(`case_${index}_dateYearTookCase`)}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nature of Services being provided *
                                    </label>
                                    <input
                                        type="text"
                                        value={case_.natureOfServices}
                                        onChange={(e) => updateProBonoCase(case_.id, 'natureOfServices', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldError(`case_${index}_natureOfServices`) ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter here"
                                    />
                                    {getFieldError(`case_${index}_natureOfServices`) && (
                                        <p className="mt-1 text-xs text-red-600">{getFieldError(`case_${index}_natureOfServices`)}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        The Offering/Charge *
                                    </label>
                                    <input
                                        type="text"
                                        value={case_.theOfferingCharge}
                                        onChange={(e) => updateProBonoCase(case_.id, 'theOfferingCharge', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter here"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Suit Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={case_.suitNumber}
                                        onChange={(e) => updateProBonoCase(case_.id, 'suitNumber', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="XX/XXXX/XX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status of the case *
                                    </label>
                                    <input
                                        type="text"
                                        value={case_.statusOfCase}
                                        onChange={(e) => updateProBonoCase(case_.id, 'statusOfCase', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter here"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Date of Appearance *
                                    </label>
                                    <input
                                        type="date"
                                        value={case_.lastDateOfAppearance}
                                        onChange={(e) => updateProBonoCase(case_.id, 'lastDateOfAppearance', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter here"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Is Client in Custody or not *
                                    </label>
                                    <select
                                        value={case_.isClientInCustody}
                                        onChange={(e) => updateProBonoCase(case_.id, 'isClientInCustody', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Yes or No</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addProBonoCase}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                        <span>+</span>
                        Add Another Section
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit and Wait for Approval'}
                        <span>→</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
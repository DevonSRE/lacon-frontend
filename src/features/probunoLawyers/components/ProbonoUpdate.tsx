'use client';

import { useActionState, useState } from 'react';
import { useFormState } from 'react-dom';
import { submitLawyersForm } from '../server/action';
import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { isFieldErrorObject } from '@/types/auth';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import InputField from '@/components/form/input/InputField';
import SelectField from '@/components/SelectField';
import { FormDataProbunoUpdate, FormErrors, ProBonoCase } from '../server/probunoTypes';
import CaseIntakeDialog from './CaseIntakeDialog';

export default function LawyersAnnualCasesReviewForm() {
    const [state, formAction, isPending] = useActionState(submitLawyersForm, undefined);
    const [errors, setErrors] = useState<FormErrors>({})
    const [open, setOpen] = useState(false)

    useEffectAfterMount(() => {
        if (state && CLIENT_ERROR_STATUS.includes(state?.status)) {
            toast.error(state?.message, {
                description: typeof state?.errors === "string"
                    ? state.errors
                    : state?.errors
                        ? Object.values(state.errors).flat().join(", ")
                        : undefined,
            });
        } else if (state && state.status === 200) {
            // toast.success("Case Intake  Submitted successful");
            setOpen(true)
        }
    }, [state]);

    const [formData, setFormData] = useState<FormDataProbunoUpdate>({
        first_name: '',
        last_name: '',
        contact_address: '',
        email: '',
        phone_number: '',
        cases: [{
            id: '1',
            client_name: '',
            sex: '',
            date_case_taken: '',
            nature_of_service: '',
            offering_charge: '',
            suit_number: '',
            status_of_case: '',
            last_date_of_appearance: '',
            is_client_in_custody: false
        }]
    });

    const handleCaseSelectChange = (caseId: string, field: keyof ProBonoCase, value: string) => {
        updateProBonoCase(caseId, field, value);
    };

    const addProBonoCase = () => {
        const newCase: ProBonoCase = {
            id: Date.now().toString(),
            client_name: '',
            sex: '',
            date_case_taken: '',
            nature_of_service: '',
            offering_charge: '',
            suit_number: '',
            status_of_case: '',
            last_date_of_appearance: '',
            is_client_in_custody: false
        };

        setFormData(prev => ({
            ...prev,
            cases: [...prev.cases, newCase]
        }));
    };

    const removeProBonoCase = (id: string) => {
        if (formData.cases.length > 1) {
            setFormData(prev => ({
                ...prev,
                cases: prev.cases.filter(case_ => case_.id !== id)
            }));
        }
    };

    const updateProBonoCase = (id: string, field: keyof ProBonoCase, value: string) => {
        setFormData(prev => ({
            ...prev,
            cases: prev.cases.map(case_ =>
                case_.id === id ? { ...case_, [field]: value } : case_
            )
        }));
    };

    // Custom form submission handler
    const handleSubmit = (formData: FormData) => {
        // Add cases data to FormData
        formData.set('cases', JSON.stringify(formData));
        console.log(formData);
        // Call the original form action
        formAction(formData);
    };

    return (
        <>
            <CaseIntakeDialog
                open={open}
                onOpenChange={setOpen}
            />
            <div className="mx-auto p-6 pb-20 bg-white">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Lawyers Annual Cases Review Form List Of Cases
                    </h1>
                    <p className="text-center text-sm text-gray-600">
                        *This information would be treated as confidential in line with the SRA Guide/Rules
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-8">
                    {/* Hidden input to serialize cases data */}
                    <input type="hidden" name="cases_data" value={JSON.stringify(formData.cases)} />

                    {/* Section 1: Personal Details and Office Info */}
                    <div className="p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-6 text-gray-800">
                            SECTION 1: Personal Details and Office Info
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="First Name"
                                    required
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                                    placeholder="First Name"
                                    error={!!errors.first_name}
                                />
                                <InputField
                                    label="Last Name"
                                    required
                                    name='last_name'
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                                    placeholder="Last Name"
                                    error={!!errors.last_name}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Email"
                                    required
                                    name='email'
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="Email Address"
                                    error={!!errors.email}
                                />
                                <InputField
                                    label="Contact Phone Number"
                                    name='phone_number'
                                    required
                                    type="tel"
                                    value={formData.phone_number}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                                    placeholder="Enter Phone Number"
                                    error={!!errors.phone_number}
                                />
                            </div>

                            <InputField
                                label="Contact Address"
                                required
                                name='contact_address'
                                type="text"
                                value={formData.contact_address}
                                onChange={(e) => setFormData(prev => ({ ...prev, contact_address: e.target.value }))}
                                placeholder="Contact Address"
                                error={!!errors.contact_address}
                            />

                        </div>
                    </div>

                    {/* Section 2: Pro Bono Cases */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-6 text-gray-800">
                            SECTION 2: List of all ProBono Cases You are Currently handling
                        </h2>

                        {formData.cases.map((case_, index) => (
                            <div key={case_.id} className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-md font-medium text-gray-700">Case {index + 1}</h3>
                                    {(formData.cases.length > 1 && (index + 1) > 1) && (
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
                                    <InputField
                                        type="text"
                                        label="Client Name"
                                        name={`cases[${index}].client_name`}
                                        value={case_.client_name}
                                        onChange={(e) => updateProBonoCase(case_.id, 'client_name', e.target.value)}
                                        placeholder="Enter here"
                                        required
                                    />

                                    <SelectField
                                        name={`cases[${index}].sex`}
                                        label="Sex"
                                        placeholder="Select Gender"
                                        options={[
                                            { value: 'male', label: 'Male' },
                                            { value: 'female', label: 'Female' },
                                        ]}
                                        required
                                        value={case_.sex}
                                        onValueChange={(value) => handleCaseSelectChange(case_.id, 'sex', value)}
                                    />

                                    <InputField
                                        label="Date/Year you took the case"
                                        required
                                        name={`cases[${index}].date_case_taken`}
                                        type="date"
                                        value={case_.date_case_taken}
                                        onChange={(e) => updateProBonoCase(case_.id, 'date_case_taken', e.target.value)}
                                        placeholder="MM/DD/YYYY"
                                    />

                                    <InputField
                                        label="Nature of Services being provided"
                                        required
                                        name={`cases[${index}].nature_of_service`}
                                        type="text"
                                        value={case_.nature_of_service}
                                        onChange={(e) => updateProBonoCase(case_.id, 'nature_of_service', e.target.value)}
                                        placeholder="Enter here"
                                    />

                                    <InputField
                                        label="The Offering/Charge"
                                        required
                                        name={`cases[${index}].offering_charge`}
                                        type="text"
                                        value={case_.offering_charge}
                                        onChange={(e) => updateProBonoCase(case_.id, 'offering_charge', e.target.value)}
                                        placeholder="Enter here"
                                    />

                                    <InputField
                                        label="Suit Number"
                                        type="text"
                                        required
                                        name={`cases[${index}].suit_number`}
                                        value={case_.suit_number}
                                        onChange={(e) => updateProBonoCase(case_.id, 'suit_number', e.target.value)}
                                        placeholder="XX/XXXX/XX"
                                    />

                                    <InputField
                                        type="text"
                                        label="Status of the case"
                                        required
                                        name={`cases[${index}].status_of_case`}
                                        value={case_.status_of_case}
                                        onChange={(e) => updateProBonoCase(case_.id, 'status_of_case', e.target.value)}
                                        placeholder="Enter here"
                                    />

                                    <InputField
                                        label="Last Date of Appearance"
                                        type="date"
                                        required
                                        name={`cases[${index}].last_date_of_appearance`}
                                        value={case_.last_date_of_appearance}
                                        onChange={(e) => updateProBonoCase(case_.id, 'last_date_of_appearance', e.target.value)}
                                        placeholder="Enter here"
                                    />

                                    <SelectField
                                        name={`cases[${index}].is_client_in_custody`}
                                        label="Is Client in Custody or not"
                                        placeholder="Select Option"
                                        options={[
                                            { value: 'true', label: 'Yes' },
                                            { value: 'false', label: 'No' },
                                        ]}
                                        required
                                        value={case_.is_client_in_custody ? 'true' : 'false'}
                                        onValueChange={(value) =>
                                            handleCaseSelectChange(
                                                case_.id,
                                                'is_client_in_custody',
                                                value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ))}


                    </div>
                    <Button
                        type="button"
                        onClick={addProBonoCase}
                        className="flex w-full items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-xs hover:bg-gray-800 transition-colors text-left"
                    >
                        <span className="text-xl">+</span>
                        <span className="flex-1 text-left">Add Another Section</span>
                    </Button>


                    {state?.errors && (
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

                    {/* Submit Button */}
                    <SubmitButton
                        value="Submit and Wait for Approval"
                        loading={isPending}
                        pendingValue="Processing..."
                        className="w-2/3 h-12 bg-red-500 hover:bg-red-600 text-white font-xs py-3 rounded-none transition-colors duration-200 flex items-center justify-center"
                    />
                </form>
            </div>
        </>

    );
}
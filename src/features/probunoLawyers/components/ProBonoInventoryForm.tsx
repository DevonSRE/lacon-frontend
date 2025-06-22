'use client';
import React, { useActionState, useState } from 'react';

import { submitProBonoCaseForm } from '../server/action';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { toast } from 'sonner';
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import { CheckboxField, ProbunoInventoryFormData } from '../server/probunoTypes';
import { SubmitButton } from '@/components/submit-button';
import InputField from '@/components/form/input/InputField';
import { Label } from '@/components/ui/label';
import { GetState } from '@/components/get-state';
import SuccessDialog from '@/components/successDialog';

interface FormData {
    first_name: string;
    last_name: string;
    phone_number: string;
    alternate_number: string;
    email: string;
    lawyers_count_in_firm: string;
    year_of_call: string;
    law_firm_address: string;
    experience_in_criminal_law: string;
    pro_bono_capacity: string;
    preferred_courts: string[];
    areas_covered: string;
    client_types: string[];
    referral_sources: string[];
}

export default function ProBonoInventoryForm() {
    const [state, formAction, isPending] = useActionState(submitProBonoCaseForm, undefined);
    const [selectedState, setSelectedState] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [agreement, setAgreementChange] = useState(false);

    // Form state management
    const [formData, setFormData] = useState<FormData>({
        first_name: '',
        last_name: '',
        phone_number: '',
        alternate_number: '',
        email: '',
        lawyers_count_in_firm: '',
        year_of_call: '',
        law_firm_address: '',
        experience_in_criminal_law: '',
        pro_bono_capacity: '',
        preferred_courts: [],
        areas_covered: '',
        client_types: [],
        referral_sources: []
    });

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked
                ? [...(prev[name as keyof FormData] as string[]), value]
                : (prev[name as keyof FormData] as string[]).filter(item => item !== value)
        }));
    };

    const handleRadioChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            phone_number: '',
            alternate_number: '',
            email: '',
            lawyers_count_in_firm: '',
            year_of_call: '',
            law_firm_address: '',
            experience_in_criminal_law: '',
            pro_bono_capacity: '',
            preferred_courts: [],
            areas_covered: '',
            client_types: [],
            referral_sources: []
        });
        setSelectedState("");
        setAgreementChange(false);
    };

    useEffectAfterMount(() => {
        if (!state) return;

        if (CLIENT_ERROR_STATUS.includes(state.status)) {
            let errorMessage = "An error occurred.";
            try {
                if (typeof state.errors === "string") {
                    errorMessage = state.errors;
                } else if (state.errors && typeof state.errors === "object") {
                    errorMessage = Object.entries(state.errors)
                        .map(([key, value]) =>
                            Array.isArray(value)
                                ? `${key}: ${value.join(", ")}`
                                : `${key}: ${String(value)}`
                        )
                        .join(" | ");
                }
            } catch (err) {
                console.warn("Error formatting toast message", err);
                errorMessage = "Failed to parse error message.";
            }

            toast.error(state.message ?? "An error occurred", {
                description: errorMessage,
            });
            // Don't reset form on error - keep user data
        } else if (state.status === 200 || state.status === 201) {
            toast.success("PRO BONO LAWYERS INVENTORY FORM Submitted successfully!");
            setOpen(true);
            resetForm(); // Only reset on success
        }
    }, [state]);

    return (
        <>
            <SuccessDialog
                open={open}
                onOpenChange={setOpen}
                title={"Success"}
                details={"PRO BONO LAWYERS INVENTORY FORM submitted successfully"}
            />
            <div className="pb-32 space-y-10">
                <div className="mx-auto ">
                    <div className="flex flex-col items-center px-6 space-y-2 py-4 border-b">
                        <h1 className="text-2xl font-semibold text-gray-900">PRO BONO LAWYERS INVENTORY FORM</h1>
                        <p className="text-sm text-gray-500 mt-1">(For Those Currently Providing Free Legal Services)</p>
                    </div>
                </div>
                <div className=" space-y-10">
                    <form action={formAction} className="w-full space-y-6">
                        {/* Section 1: Personal Details and Office Info */}
                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-6">SECTION 1: Personal Details and Office Info</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        type="text"
                                        label="First Name"
                                        required
                                        name='first_name'
                                        value={formData.first_name}
                                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                                    />
                                    <InputField
                                        type="text"
                                        label="Last Name"
                                        name='last_name'
                                        required
                                        value={formData.last_name}
                                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        type="tel"
                                        label='Mobile Phone Number'
                                        required
                                        name='phone_number'
                                        placeholder="Phone Number"
                                        value={formData.phone_number}
                                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                    />
                                    <InputField
                                        type="tel"
                                        label='Alternate Number'
                                        name='alternate_number'
                                        placeholder="Alternate Number"
                                        value={formData.alternate_number}
                                        onChange={(e) => handleInputChange('alternate_number', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        type="email"
                                        label='Email Address'
                                        required
                                        name='email'
                                        placeholder="Enter Email Address"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                    <div className="space-y-6">
                                        <Label htmlFor="state-select">State</Label>
                                        <GetState
                                            value={selectedState}
                                            onValueChange={(val: string) => setSelectedState(val)}
                                            placeholder="Select your state"
                                        />
                                        {/* Hidden input to submit state value */}
                                        <input type="hidden" name="state_id" value={selectedState} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        type="number"
                                        name='lawyers_count_in_firm'
                                        label="Number of Lawyers in Firm/ Organization"
                                        required
                                        value={formData.lawyers_count_in_firm}
                                        onChange={(e) => handleInputChange('lawyers_count_in_firm', e.target.value)}
                                    />
                                    <InputField
                                        type="text"
                                        name='year_of_call'
                                        label='Year of Call to Bar / Call No'
                                        placeholder="Year of Call to Bar / Call No"
                                        value={formData.year_of_call}
                                        onChange={(e) => handleInputChange('year_of_call', e.target.value)}
                                    />
                                </div>
                                <InputField
                                    type="text"
                                    label='Law Firm/Organization Address'
                                    required
                                    name="law_firm_address"
                                    placeholder="Enter Address"
                                    value={formData.law_firm_address}
                                    onChange={(e) => handleInputChange('law_firm_address', e.target.value)}
                                />
                            </div>
                        </section>

                        {/* Section 2: Experience in Criminal Law Practice */}
                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-6">SECTION 2: Experience in Criminal Law Practice</h2>

                            <div>
                                <p className="text-sm text-gray-700 mb-4">How many years of experience do you have?</p>
                                <div className="space-y-3">
                                    {['Below 2 years', '3-5 years', '6-10 years', 'Above 10 years'].map((option) => (
                                        <label key={option} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="experience_in_criminal_law"
                                                value={option}
                                                checked={formData.experience_in_criminal_law === option}
                                                onChange={(e) => handleRadioChange('experience_in_criminal_law', e.target.value)}
                                                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                            />
                                            <span className="ml-3 text-sm text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Pro Bono Case Handling Capacity */}
                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-6">SECTION 3: Pro Bono Case Handling Capacity</h2>

                            <div>
                                <p className="text-sm text-gray-700 mb-4">How many pro-bono cases can you handle at a time?</p>
                                <div className="space-y-3">
                                    {[
                                        '1 case at a time',
                                        '2 cases at a time',
                                        '3-5 cases at a time',
                                        '6 or more cases at a time'
                                    ].map((option) => (
                                        <label key={option} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="pro_bono_capacity"
                                                value={option}
                                                checked={formData.pro_bono_capacity === option}
                                                onChange={(e) => handleRadioChange('pro_bono_capacity', e.target.value)}
                                                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                            />
                                            <span className="ml-3 text-sm text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Section 4: Criminal Matters Preference */}
                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-6">SECTION 4: Criminal Matters Preference</h2>

                            <div>
                                <p className="text-sm text-gray-700 mb-4">Which courts do you prefer handling criminal matters in?</p>
                                <div className="space-y-3">
                                    {[
                                        'Appellate Courts',
                                        'High Courts',
                                        'Magistrate Courts',
                                        'Customary Court',
                                        'Sharia Court',
                                        'Area Court'
                                    ].map((court) => (
                                        <label key={court} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="preferred_courts"
                                                value={court}
                                                checked={formData.preferred_courts.includes(court)}
                                                onChange={(e) => handleCheckboxChange('preferred_courts', court, e.target.checked)}
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                            />
                                            <span className="ml-3 text-sm text-gray-700">{court}</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-4">List the Scope Coverage Area/Location of Service</p>
                                <InputField
                                    type="text"
                                    name="areas_covered"
                                    placeholder="e.g Kaduna, Lagos, Kano, Anambra"
                                    className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    value={formData.areas_covered}
                                    onChange={(e) => handleInputChange('areas_covered', e.target.value)}
                                />
                            </div>
                        </section>

                        {/* Section 5: Describe Who your Clients are */}
                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-6">SECTION 5: Describe Who your Clients are (Select as applicable)</h2>

                            <div className="space-y-3">
                                {[
                                    'Children',
                                    'Women',
                                    'Men',
                                    'Police Detainees',
                                    'Awaiting Trial Officers and Prisoners in Custody',
                                    'Prison On-SAR',
                                    'Others(State)',
                                    'All Categories'
                                ].map((client) => (
                                    <label key={client} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="client_types"
                                            value={client}
                                            checked={formData.client_types.includes(client)}
                                            onChange={(e) => handleCheckboxChange('client_types', client, e.target.checked)}
                                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                        />
                                        <span className="ml-3 text-sm text-gray-700">{client}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Section 6: How Do You Source your Clients */}
                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-6">SECTION 6: How Do You Source your Clients</h2>

                            <div className="space-y-3">
                                {[
                                    'Walk-in referrals',
                                    'Referrals by the Police',
                                    'Referrals by the Prison',
                                    'Referrals by the Court',
                                    'Referrals by/SGO',
                                    'Referrals by faith-based Organizations',
                                    'Others(State)',
                                    'All Categories'
                                ].map((source) => (
                                    <label key={source} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="referral_sources"
                                            value={source}
                                            checked={formData.referral_sources.includes(source)}
                                            onChange={(e) => handleCheckboxChange('referral_sources', source, e.target.checked)}
                                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                        />
                                        <span className="ml-3 text-sm text-gray-700">{source}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Agreement Checkbox */}
                        <div className="pt-6 border-t">
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="agree"
                                    checked={agreement}
                                    onChange={e => setAgreementChange(e.target.checked)}
                                    value="true"
                                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
                                />
                                <span className="ml-3 text-sm text-gray-700">I Agree</span>
                            </label>
                        </div>

                        {state?.errors && (
                            <div className="text-red-500 bg-red-50 p-4 rounded">
                                <h3 className="font-semibold mb-2">Please fix the following errors:</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {typeof state.errors === 'string' ? (
                                        <li>{state.errors}</li>
                                    ) : (
                                        Object.entries(state.errors).map(([key, val]) => {
                                            const messages = Array.isArray(val) ? val : [String(val)];
                                            return messages.map((msg, idx) => (
                                                <li key={`${key}-${idx}`}>
                                                    {key.replace(/_/g, ' ')}: {msg}
                                                </li>
                                            ));
                                        })
                                    )}
                                </ul>
                            </div>
                        )}

                        <SubmitButton
                            value="Submit and Wait for Approval"
                            pendingValue="Processing..."
                            loading={isPending}
                            disabled={!agreement}
                            className="w-2/3 h-12 bg-red-500 hover:bg-red-600 text-white font-xs py-3 rounded-none transition-colors duration-200 flex items-center justify-center"
                        />
                    </form>
                </div>
            </div>
        </>
    );
}
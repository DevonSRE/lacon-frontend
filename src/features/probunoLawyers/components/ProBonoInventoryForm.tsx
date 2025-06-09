'use client';
import React, { useActionState, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Input from '@/components/form/input/InputField';
import { Button } from '@/components/ui/button';
import { useFormState } from 'react-dom';
import { submitProBonoCaseForm } from '../server/action';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { isFieldErrorObject } from '@/types/auth';
import { toast } from 'sonner';
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import { CheckboxField, ProbunoInventoryFormData } from '../server/probunoTypes';
import { SubmitButton } from '@/components/submit-button';
import InputField from '@/components/form/input/InputField';
import { Label } from '@/components/ui/label';
import { GetState } from '@/components/get-state';


export default function ProBonoInventoryForm() {
    const [state, dispatch, isPending] = useActionState(submitProBonoCaseForm, undefined);
    const [formData, setFormData] = useState<ProbunoInventoryFormData>({
        first_name: '',
        last_name: '',
        principal_name: '',
        lawyers_count_in_firm: 0,
        law_firm_address: '',
        email: '',
        phone_number: '',
        alternate_number: '',
        year_of_call: '',
        nba_branch: '',
        experience_in_criminal_law: '',
        pro_bono_capacity: '',
        criminal_courts_preference: [],
        areas_covered: '',
        client_base: '',
        source_of_clients: '',
        preferredCourts: [],
        clientTypes: [],
        referralSources: [],
        agree: false
    });
    const [selectedState, setSelectedState] = useState<string>("");


    const handleInputChange = (field: keyof ProbunoInventoryFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleNumberInputChange = (field: keyof ProbunoInventoryFormData, value: number) => {
        const parsed = value;
        setFormData(prev => ({ ...prev, [field]: isNaN(parsed) ? 0 : parsed }));
    };


    const handleCheckboxChange = (field: CheckboxField, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter((item) => item !== value)
                : [...prev[field], value]
        }));
    };

    useEffectAfterMount(() => {
        console.log(state);
        if (state && CLIENT_ERROR_STATUS.includes(state?.status)) {
            toast.error(state?.message, {
                description: typeof state?.errors === "string"
                    ? state.errors
                    : state?.errors
                        ? Object.values(state.errors).flat().join(", ")
                        : undefined,
            });
        }
        else if (state?.status === 200 || state?.status === 201) {
            toast.success("Inventory Form Submitted successfully!");
        }
    }, [state]);

    return (
        <div className="pb-32 space-y-10">
            <div className="mx-auto ">
                <div className="flex flex-col items-center px-6 space-y-2 py-4 border-b">
                    <h1 className="text-2xl font-semibold text-gray-900">PRO BONO LAWYERS INVENTORY FORM</h1>
                    <p className="text-sm text-gray-500 mt-1">(For Those Currently Providing Free Legal Services)</p>
                </div>
            </div>
            <div className=" space-y-10">
                <form action={dispatch} className="w-full space-y-6">
                    {/* Section 1: Personal Details and Office Info */}
                    <section>
                        <h2 className="text-base font-semibold text-gray-900 mb-6">SECTION 1: Personal Details and Office Info</h2>
                        <div className="space-y-4">
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

                            <div className="space-y-6">
                                <Label htmlFor="state-select">State</Label>
                                <GetState
                                    value={selectedState}
                                    onValueChange={(val: string) => setSelectedState(val)}
                                    placeholder="Select your state"
                                />
                            </div>

                            <InputField
                                type="number"
                                name='lawyers_count_in_firm'
                                label="Number of Lawyers in Firm/ Organization"
                                required
                                value={Number(formData.lawyers_count_in_firm)}
                                onChange={(e) => handleNumberInputChange('lawyers_count_in_firm', Number(e.target.value))}
                            />

                            {/* 
                       <InputField
                            type="text"
                            label='Type of Organization'
                            value={formData.}
                            onChange={(e) => handleInputChange('orgType', e.target.value)}
                            className=""
                        />
                            */}

                            <InputField
                                type="text"
                                label='Law Firm/Organization Address'
                                required
                                name="law_firm_address"
                                placeholder="Enter Email Address"
                                value={formData.law_firm_address}
                                onChange={(e) => handleInputChange('law_firm_address', e.target.value)}
                                className=""
                            />

                            <InputField
                                type="email"
                                label='Email Address'
                                required
                                name='email'
                                placeholder="Enter Email Address"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className=""
                            />

                            <InputField
                                type="tel"
                                label='Mobile Phone Number'
                                required
                                name='phone_number'
                                placeholder="Phone Number"
                                value={formData.phone_number}
                                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />

                            <InputField
                                type="tel"
                                label='Alternate Number'
                                name='alternate_number'
                                placeholder="Alternate Number"
                                value={formData.alternate_number}
                                onChange={(e) => handleInputChange('alternate_number', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />

                            <InputField
                                type="text"
                                name='year_of_call'
                                label='Year of Call to Bar / Call No'
                                placeholder="Year of Call to Bar / Call No"
                                value={formData.year_of_call}
                                onChange={(e) => handleInputChange('year_of_call', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />


                        </div>
                    </section>

                    {/* Section 2: experience_in_criminal_law in Criminal Law Practice */}
                    <section>
                        <h2 className="text-base font-semibold text-gray-900 mb-6">SECTION 2: experience in Criminal Law Practice</h2>

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
                                            onChange={(e) => handleInputChange('experience_in_criminal_law', e.target.value)}
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
                                            onChange={(e) => handleInputChange('pro_bono_capacity', e.target.value)}
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
                                            checked={formData.preferredCourts.includes(court)}
                                            onChange={() => handleCheckboxChange('preferredCourts', court)}
                                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                        />
                                        <span className="ml-3 text-sm text-gray-700">{court}</span>
                                    </label>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-4">List the Scope Coverage Area/Location of Service</p>
                            <InputField
                                type="text"
                                placeholder="e.g Kaduna, Lagos, Kano, Anambra"
                                className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                                'Others(Specify)',
                                'All Categories'
                            ].map((client) => (
                                <label key={client} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.clientTypes.includes(client)}
                                        onChange={() => handleCheckboxChange('clientTypes', client)}
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
                                'Others(Specify)',
                                'All Categories'
                            ].map((source) => (
                                <label key={source} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.referralSources.includes(source)}
                                        onChange={() => handleCheckboxChange('referralSources', source)}
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
                                checked={formData.agree}
                                onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
                            />
                            <span className="ml-3 text-sm text-gray-700">I Agree</span>
                        </label>
                    </div>

                    {/* Error Display */}
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
                    {/* <Button type='submit'
                        
                        <span className="ml-2">→</span>
                    </Button> */}


                    <SubmitButton
                        value="Submit and Wait for Approval"
                        pendingValue="Processing..."
                        disabled={!formData.agree}
                        loading={isPending}
                        className="w-2/3 h-12 bg-red-500 hover:bg-red-600 text-white font-xs py-3  rounded-none transition-colors duration-200 flex items-center justify-center"
                    />
                </form>


            </div>
        </div>
    );
}
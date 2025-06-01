'use client';
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Input from '@/components/form/input/InputField';
import { Button } from '@/components/ui/button';


type FormData = {
    lawyerName: string;
    principalName: string;
    numLawyers: string;
    orgType: string;
    firmAddress: string;
    email: string;
    mobilePhone: string;
    alternateNumber: string;
    yearOfCall: string;
    nbaNumber: string;
    experience: string;
    caseCapacity: string;
    preferredCourts: string[];
    clientTypes: string[];
    referralSources: string[];
};

const checkboxFields = [
    'preferredCourts',
    'clientTypes',
    'referralSources'
] as const;

type CheckboxField = typeof checkboxFields[number];

export default function ProBonoInventoryForm() {
    const [formData, setFormData] = useState<FormData>({
        lawyerName: '',
        principalName: '',
        numLawyers: '',
        orgType: '',
        firmAddress: '',
        email: '',
        mobilePhone: '',
        alternateNumber: '',
        yearOfCall: '',
        nbaNumber: '',
        experience: '',
        caseCapacity: '',
        preferredCourts: [],
        clientTypes: [],
        referralSources: []
    });

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (field: CheckboxField, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter((item) => item !== value)
                : [...prev[field], value]
        }));
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert('Form submitted successfully!');
    };

    return (
        <div className="pb-32 space-y-10">
            <div className="mx-auto ">
                <div className="flex flex-col items-center px-6 space-y-2 py-4 border-b">
                    <h1 className="text-2xl font-semibold text-gray-900">PRO BONO LAWYERS INVENTORY FORM</h1>
                    <p className="text-sm text-gray-500 mt-1">(For Those Currently Providing Free Legal Services)</p>
                </div>
            </div>
            <div className=" space-y-10">
                {/* Section 1: Personal Details and Office Info */}
                <section>
                    <h2 className="text-base font-semibold text-gray-900 mb-6">SECTION 1: Personal Details and Office Info</h2>

                    <div className="space-y-4">

                        <Input
                            type="text"
                            label='Lawyer’s Name'
                            required
                            placeholder="John Doe Morrison"
                            value={formData.lawyerName}
                            onChange={(e) => handleInputChange('lawyerName', e.target.value)}
                            className="w-full"
                        />



                        <Input
                            type="text"
                            label='Name of Principal'
                            required
                            placeholder="Input name here"
                            value={formData.principalName}
                            onChange={(e) => handleInputChange('principalName', e.target.value)}
                            className=""
                        />



                        <Input
                            type="text"
                            label='No. of Lawyers'
                            required
                            value={formData.numLawyers}
                            onChange={(e) => handleInputChange('numLawyers', e.target.value)}
                            className=""
                        />



                        <Input
                            type="text"
                            label='Type of Organization'
                            value={formData.orgType}
                            onChange={(e) => handleInputChange('orgType', e.target.value)}
                            className=""
                        />

                        <Input
                            type="text"
                            label='Law Firm/Organization Address'
                            required
                            placeholder="Enter Email Address"
                            value={formData.firmAddress}
                            onChange={(e) => handleInputChange('firmAddress', e.target.value)}
                            className=""
                        />

                        <Input
                            type="email"
                            label='Email Address'
                            required
                            placeholder="Enter Email Address"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className=""
                        />

                        <Input
                            type="tel"
                            label='Mobile Phone Number'
                            required
                            placeholder="Enter Email Address"
                            value={formData.mobilePhone}
                            onChange={(e) => handleInputChange('mobilePhone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />

                        <Input
                            type="tel"
                            label='Alternate Number'
                            placeholder="Enter Email Address"
                            value={formData.alternateNumber}
                            onChange={(e) => handleInputChange('alternateNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />

                        <Input
                            type="text"
                            label='Year of Call to Bar / Call No'
                            placeholder="Enter Email Address"
                            value={formData.yearOfCall}
                            onChange={(e) => handleInputChange('yearOfCall', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />

                        <Input
                            type="text"
                            label='NBA Branch Membership'
                            placeholder="Enter Email Address"
                            value={formData.nbaNumber}
                            onChange={(e) => handleInputChange('nbaNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                                        name="experience"
                                        value={option}
                                        checked={formData.experience === option}
                                        onChange={(e) => handleInputChange('experience', e.target.value)}
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
                                        name="caseCapacity"
                                        value={option}
                                        checked={formData.caseCapacity === option}
                                        onChange={(e) => handleInputChange('caseCapacity', e.target.value)}
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
                        <input
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
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
                        />
                        <span className="ml-3 text-sm text-gray-700">I Agree</span>
                    </label>
                </div>

                {/* Submit Button */}
                <Button onClick={handleSubmit} className="w-2/3 h-12 bg-red-500 hover:bg-red-600 text-white font-xs py-3  rounded-none transition-colors duration-200 flex items-center justify-center">
                    Submit and Wait for Approval
                    <span className="ml-2">→</span>
                </Button>
            </div>
        </div>
    );
}
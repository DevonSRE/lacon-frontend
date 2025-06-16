"use client";
import InputField from "@/components/form/input/InputField";
import { useState } from "react";

export default function MercyApplication() {
    const [recommendationImage, setRecommendationImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setRecommendationImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setRecommendationImage(null);
            setImagePreview(null);
        }
    };

    return (
        <div className="mx-auto">
            {/* <h2 className="font-bold text-xl mb-2">Filing A Mercy Application</h2> */}
            <div className="w-full max-w-6xl  flex flex-col sm:flex-row sm:items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                    <h1 className="text-lg font-semibold text-gray-900">
                        Filing A Mercy Application
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
            <div className="mb-4">
                <label className="font-medium text-sm">Case Type</label>
                <div className="bg-gray-100 p-2 rounded mt-1 text-gray-700">Mercy Application</div>
            </div>
            <form>
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <div className="flex-1">
                        <InputField label="Inmate First Name" type="email" placeholder="Enter Email Address" required className="w-full p-2 mt-1 rounded border border-gray-300" />
                    </div>
                    <div className="flex-1">
                        <InputField label="Inmate Middle Name" type="email" placeholder="Enter Email Address" className="w-full p-2 mt-1 rounded border border-gray-300" />
                    </div>
                    <div className="flex-1">
                        <InputField label="Inmate Last Name" type="email" placeholder="Enter Email Address" required className="w-full p-2 mt-1 rounded border border-gray-300" />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Gender</label>
                    <select required className="w-full p-2 mt-1 rounded border border-gray-300">
                        <option value="">select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="mb-4">
                    <InputField label="Age" type="number" placeholder="InputField Current Age" required className="w-full p-2 mt-1 rounded border border-gray-300" />
                </div>
                <div className="mb-4">
                    <InputField label="Correctional Facility Name" type="text" placeholder="InputField Current Address" required className="w-full p-2 mt-1 rounded border border-gray-300" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Offense Committed<span className="text-red-500">*</span></label>
                    <textarea placeholder="Describe the Offense" required className="w-full p-2 mt-1 rounded border border-gray-300 min-h-[60px]" />
                </div>
                <div className="mb-4">
                    <InputField label="Sentence Passed" type="text" placeholder="e.g 10 years imprisonment" className="w-full p-2 mt-1 rounded border border-gray-300" />
                </div>
                <div className="mb-4">
                    <InputField label="Date of Sentence" type="date" placeholder="dd/mm/yy" className="w-full p-2 mt-1 rounded border border-gray-300" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Is there a Confessional Statement?<span className="text-red-500">*</span></label>
                    <select required className="w-full p-2 mt-1 rounded border border-gray-300">
                        <option value="">yes or No</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div className="mb-4">
                    <InputField label="Reason for Clemency / Humanitarian Consideration" type="text" placeholder="Explain Reason for mercy application here" className="w-full p-2 mt-1 rounded border border-gray-300" />
                </div>
                <div className="mb-4">
                    <InputField label="Any Disability or Serious Health Condition?" type="text" placeholder="Trader/Chef/Driver" className="w-full p-2 mt-1 rounded border border-gray-200 bg-gray-100" disabled />
                </div>
                <div className="mb-4">
                    <input
                        //   label="Recommendation from Prison Authority (If Available)"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 mt-1 rounded border border-gray-200 bg-gray-100"
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <img src={imagePreview} alt="Recommendation Preview" className="max-w-full max-h-40 rounded border border-gray-300" />
                        </div>
                    )}
                </div>
                <div className="bg-gray-700 p-4 rounded text-right">
                    <button type="submit" className="bg-red-600 text-white rounded px-8 py-2 text-base font-medium">Next</button>
                </div>
            </form>
        </div>
    );
}
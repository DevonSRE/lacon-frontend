import { ILawyerManagement } from '@/types/case';
import React, { Dispatch, SetStateAction, useState } from 'react';


interface LawyerDetailsProps {
    lawyer?: ILawyerManagement | null;
    sheetType?: "view" | "edit" | "suspend" | "delete" | null;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SuspensionForm({ lawyer : lawyerInfo, setOpen: OpenSheet, sheetType }: LawyerDetailsProps) {


    // const SuspensionForm: React.FC = () => {
    const [reason, setReason] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            alert('Please provide a reason for suspension');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Suspension submitted:', { reason, lawyer: lawyerInfo });
            alert('Suspension request submitted successfully');
            setReason('');
        } catch (error) {
            alert('Error submitting suspension request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setReason('');
        // In a real app, you might navigate back or close a modal
        console.log('Suspension request cancelled');
    };

    return (
        <div className="bg-white overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900">
                    Reason For Suspension
                </h1>
            </div>

            {/* Lawyer Information Section */}
            <div className="bg-gray-50 px-6 py-4">
                <h2 className="text-sm font-medium text-gray-700 mb-4">
                    Lawyer Information
                </h2>

                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Full Name:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {lawyerInfo?.first_name} {lawyerInfo?.last_name}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">LACON Email Address:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {lawyerInfo?.email}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Phone Number:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {lawyerInfo?.phone_number}
                            </span>
                        </div>
             
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Role:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {lawyerInfo?.user_type ?? "-"}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Status:</span>
                            <span className="text-sm font-medium text-green-600">
                                {lawyerInfo?.status}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Max. Case Load:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {lawyerInfo?.max_case_load ?? "-"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="px-6 py-6">
                <div className="mb-6">
                    <label
                        htmlFor="reason"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Reason For Suspension <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="reason"
                        name="reason"
                        rows={6}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Type the Reason for This Action Here"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        required
                    />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Yes, Submit Now'}
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        className="w-full bg-white text-gray-700 py-3 px-4 rounded-md font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                    >
                        No, Cancel Request
                    </button>
                </div>
            </form>
        </div>
    );
};

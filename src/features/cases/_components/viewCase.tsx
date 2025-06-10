import React from 'react';
import { ICase } from './table-columns';
import { ScrollArea } from '@/components/ui/scroll-area';


export default function ViewCase(details: { details: ICase | null }) {

    return (
        <div className="h-screen">
            {/* Header Section */}
            <div className="border-b h-1/12 border-gray-200 pb-4 mb-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            CASE ID: {details.details?.id.slice(0, 10) ?? "-"}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Filed On {details.details?.filed_date ?? "-"}
                        </p>
                    </div>
                </div>
                <div className="flex justify-between gap-4">
                    <div className="inline-block bg-red-50 text-red-500 p-3 w-full  text-sm font-medium mb-2 text-center items-center">
                        {details.details?.case_type ?? "-"}
                    </div>
                    <div className="inline-block bg-red-50 text-red-500 p-3 w-full  text-sm font-medium mb-2 text-center items-center">
                        {details.details?.location ?? "state"}
                    </div>
                </div>
            </div>
            <ScrollArea className="h-9/12 w-full pr-4 mt-10">
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                        Client Information
                    </h2>
                    <div className="grid grid-cols-1  text-xs gap-4">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Name of Client:</span>
                                <span className="text-gray-900 font-semibold">{details?.details?.name ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Sex:</span>
                                <span className="text-gray-900">{details?.details?.sex ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Age:</span>
                                <span className="text-gray-900">{details?.details?.age ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Marital Status:</span>
                                <span className="text-gray-900">{details?.details?.marital_status ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Disability:</span>
                                <span className="text-gray-900">{details?.details?.disability ?? "-"}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Phone Number:</span>
                                <span className="text-gray-900">{details?.details?.phone_number ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Email Address:</span>
                                <span className="text-gray-900 break-all">{details?.details?.email ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Occupation:</span>
                                <span className="text-gray-900">{details?.details?.occupation ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">State of Origin:</span>
                                <span className="text-gray-900">{details?.details?.state_of_origin ?? "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Case Information Section */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                        Case Information
                    </h2>
                    <div className="grid grid-cols-1  gap-4 text-xs">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Offenses:</span>
                                <span className="text-gray-900 font-semibold">{details?.details?.offenses ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Date Case Opened:</span>
                                <span className="text-gray-900">{details?.details?.date_case_opened ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Client Location:</span>
                                <span className="text-gray-900">{details?.details?.client_location ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Date of Admission:</span>
                                <span className="text-gray-900">{details?.details?.date_of_admission ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Average Monthly Income:</span>
                                <span className="text-gray-900">{details?.details?.average_monthly_income ?? "-"}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Reason for Legal Aid:</span>
                                <span className="text-gray-900">{details?.details?.reason_for_legal_aid ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Legal Aid Application Status:</span>
                                <span className="text-green-700 font-semibold">{details?.details?.legal_aid_application_status ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Date Legal Aid Granted:</span>
                                <span className="text-gray-900">{details?.details?.date_legal_aid_granted ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Counsel Assigned:</span>
                                <span className="text-gray-900">{details?.details?.counsel_assigned ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Counsel Designation:</span>
                                <span className="text-gray-900">{details?.details?.counsel_designation ?? "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-sm font-semibold mt-6 text-gray-800 mb-4 border-b border-gray-100 pb-2">
                        Judicial Information
                    </h2>
                    <div className="grid grid-cols-1  gap-4 text-xs">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Court Suit/Case No:</span>
                                <span className="text-gray-900 font-semibold">{details?.details?.offenses ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Bail Status:</span>
                                <span className="text-gray-900">{details?.details?.date_case_opened ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Court of Trial:</span>
                                <span className="text-gray-900">{details?.details?.client_location ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Prosecuting Agency::</span>
                                <span className="text-gray-900">{details?.details?.date_of_admission ?? "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Current Case Status:</span>
                                <span className="text-gray-900">{details?.details?.average_monthly_income ?? "-"}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};
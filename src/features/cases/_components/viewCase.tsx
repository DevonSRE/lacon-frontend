import React from 'react';
import { ICase } from './table-columns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';


export default function ViewCase(details: { details: ICase | null }) {

    return (
        <div className="h-screen w-full">
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
                <div className="flex justify-between gap-4 text-xs">
                    <div className="inline-block bg-red-50 text-red-500 p-3 w-full font-medium mb-2 text-center items-center">
                        {details.details?.case_type ?? "-"}
                    </div>
                    <div className="inline-block bg-red-50 text-red-500 p-3 w-full font-medium mb-2 text-center items-center">
                        {details.details?.location ?? "state"}
                    </div>
                </div>
            </div>
            <ScrollArea className="h-9/12 w-full  mt-10">
                <div className="pr-4">
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                            Client Information
                        </h2>
                        <div className="grid grid-cols-1  text-xs gap-4">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Name of Client:</span>
                                    <span className="text-gray-900 font-semibold">{details?.details?.first_name ?? "-"} {details?.details?.last_name ?? "-"}</span>
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
                            {details.details?.case_type === "PDSS ORGANIZATION" && (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Offenses:</span>
                                        <span className="text-gray-900 font-semibold">{details?.details?.pdss?.offence ?? "-"}</span>
                                    </div>
                                    {/* <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Date Case Opened:</span>
                                    <span className="text-gray-900">{details?.details?.pdss?.date_case_opened ?? "-"}</span>
                                </div> */}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Client Location:</span>
                                        <span className="text-gray-900">{details?.details?.pdss?.client_location ?? "-"}</span>
                                    </div>
                                    {/* <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Date of Admission:</span>
                                    <span className="text-gray-900">{details?.details?.pdss?.date_of_admission ?? "-"}</span>
                                </div> */}


                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Days in Detention:</span>
                                        <span className="text-gray-900">{details?.details?.pdss?.days_in_detention ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Counsel or Paralegal:</span>
                                        <span className="text-green-700 font-semibold">{details?.details?.pdss?.counsel_or_paralegal ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Counsel Designation:</span>
                                        <span className="text-gray-900">{details?.details?.pdss?.counsel_designation ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Counsel Firm or Org ID:</span>
                                        <span className="text-gray-900">{details?.details?.pdss?.counsel_firm_or_org_id ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Nature of Legal Service:</span>
                                        <span className="text-gray-900">{details?.details?.pdss?.nature_of_legal_service ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Case Status:</span>
                                        <span className="text-gray-900">{details?.details?.pdss?.case_status ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Bail Status:</span>
                                        <span className="text-gray-900">{details?.details?.pdss?.bail_status ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Date Trial Ended:</span>
                                        <span className="text-gray-900">{details?.details?.pdss?.date_trial_ended ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Case Outcome:</span>
                                        <span className="text-gray-900">{details?.details?.pdss?.case_outcome ?? "-"}</span>
                                    </div>
                                </div>
                            )}

                            {details.details?.case_type === "CIVIL CASE" && (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Casefile ID:</span>
                                        <span className="text-gray-900">{details?.details?.civil_case?.casefile_id ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Complaint:</span>
                                        <span className="text-gray-900">{details?.details?.civil_case?.complaint ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Average Income:</span>
                                        <span className="text-gray-900">{details?.details?.civil_case?.average_income ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Legal Aid Reason:</span>
                                        <span className="text-gray-900">{details?.details?.civil_case?.legal_aid_reason ?? "-"}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Number of Dependants:</span>
                                        <span className="text-gray-900">{details?.details?.civil_case?.number_of_dependants ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Registration Number:</span>
                                        <span className="text-green-700 font-semibold">{details?.details?.civil_case?.registration_number ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Case Number:</span>
                                        <span className="text-gray-900">{details?.details?.civil_case?.case_number ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Court of Hearing:</span>
                                        <span className="text-gray-900">{details?.details?.civil_case?.court_of_hearing ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Defendant Name:</span>
                                        <span className="text-gray-900">{details?.details?.civil_case?.defendant_name ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Defendant Address:</span>
                                        <span className="text-gray-900">{details?.details?.civil_case?.defendant_address ?? "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Defendant Phone Number:</span>
                                        <span className="text-gray-900">{details?.details?.civil_case?.defendant_phone_number ?? "-"}</span>
                                    </div>
                                </div>
                            )}
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
                                    <span className="text-gray-900 font-semibold">{details?.details?.judiciary?.case_number ?? "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Bail Status:</span>
                                    <span className="text-gray-900">{details?.details?.judiciary?.bail_status ?? "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Court of Trial:</span>
                                    <span className="text-gray-900">{details?.details?.judiciary?.trial_of_court ?? "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Prosecuting Agency::</span>
                                    <span className="text-gray-900">{details?.details?.judiciary?.prosecuting_agency ?? "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Current Case Status:</span>
                                    <span className="text-gray-900">{details?.details?.judiciary?.current_case_status ?? "-"}</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-10 justify-between">
                    <Button className='h-11 w-full'>Assign Case</Button>
                    <Button variant={"outline"} className='h-11 w-full'>Transfer to Department</Button>
                </div>
            </ScrollArea>
        </div>
    );
};
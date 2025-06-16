import React from 'react';
import Image from "next/image";


const DesinationLetter = () => {
    return (
        <div className="max-w-4xl mx-auto bg-gray-100 p-8 ">
            {/* Header */}

            <h1 className="text-3xl text-center font-bold text-black mb-2" style={{ fontFamily: 'Old English Text MT, serif' }}>
                Legal Aid Council
            </h1>
            <div className=" pb-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="text-left">
                        <div className="text-sm">P.M.B. 398, Garki</div>
                        <div className="text-sm text-red-600">Email:</div>
                        <div className="text-sm">info@legalaidcouncil.gov.ng</div>
                        <div className="text-sm text-red-600">Website:</div>
                        <div className="text-sm">www.legalaidcouncil.gov.ng</div>
                    </div>

                    <div className="text-center flex-1">
                        <div className="w-16 h-16 mx-auto  rounded-full flex items-center justify-center">
                            <Image
                                width={50}
                                height={32}
                                className="dark:hidden"
                                src="/logo.png"
                                alt="Logo"
                            />
                            {/* <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                <span className="text-blue-500 font-bold text-xs">COAT</span>
                            </div> */}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-sm text-blue-500">Headquarters</div>
                        <div className="text-sm">No. 20, Port-Harcourt</div>
                        <div className="text-sm">Crescent Off Gimbiya Street,</div>
                        <div className="text-sm">Area 11, Garki, Abuja.</div>
                        <div className="text-sm">1st June, 2025.</div>
                    </div>
                </div>
            </div>

            {/* Lawyer Information Section */}
            <div className="mb-8">
                <div className="text-center mb-4">
                    <span className="text-red-600  px-4 py-1 text-sm font-bold">
                        LAWYER INFORMATION
                    </span>
                </div>

                <div className="grid grid-cols-2 bg-white p-4 gap-8">
                    <div className="space-y-2">
                        <div className="text-sm">
                            <span className="font-medium">Full Name:</span>
                        </div>
                        <div className="text-sm">
                            <span className="font-medium">Firm:</span>
                        </div>
                        <div className="text-sm">
                            <span className="font-medium">Year of Practice:</span>
                        </div>
                        <div className="text-sm">
                            <span className="font-medium">Preferred Courts:</span>
                        </div>
                        <div className="text-sm">
                            <span className="font-medium">Max. Case Load:</span>
                        </div>
                    </div>

                    <div className="space-y-2 text-right">
                        <div className="text-sm">Matthew Paulson & Jonathan Potter</div>
                        <div className="text-sm">PPDC</div>
                        <div className="text-sm">7 Years</div>
                        <div className="text-sm">Magistrate, High Court</div>
                        <div className="text-sm">10</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                <div className="text-center mb-6">
                    <h2 className="text-lg font-bold">
                        DESIGNATION AS PRO BONO LEGAL AID SERVICES PROVIDER
                    </h2>
                </div>

                <div className="space-y-4 text-sm leading-relaxed">
                    <p><strong>Sir,</strong></p>

                    <p>
                        We write to bring to your attention, that your request to be registered as a Pro Bono Legal
                        service provider under the Legal Aid Scheme of the Legal Aid Council has been granted.
                        Consequent up you are by this letter, designated as a Pro-Bono Legal Services Provider
                        Pursuant to PART IV of the Legal Aid Act, 2011.
                    </p>

                    <p>Your designation is as on the following terms:</p>

                    <div className="ml-4 space-y-5">
                        <p>
                            <strong>1.</strong> Assignment of cases is subject to availability of cases from the Detention Centre's
                            of the Nigerian correctional Services or any other place of detention earmarked by
                            the Legal Aid Council.
                        </p>

                        <p>
                            <strong>2.</strong> Cases are assigned within the State jurisdiction and location of Counsel's legal
                            practice.
                        </p>

                        <p>
                            <strong>3.</strong> Counsel is free to take on cases on Pro Bono within State jurisdiction of legal
                            practice, and such cases shall be deemed assigned to Counsel. For Counsel to be
                            entitled to the benefits accruing from the Council for prosecution of such cases,
                            Counsel shall:
                        </p>

                        <div className="ml-8 space-y-2">
                            <p>i. Register the case with the Legal Aid Council at the Custodial Centre Deconvention
                                Unit;</p>
                            <p>ii. Show evidence of registration;</p>
                            <p>iii. Show proof of up to date financial standing with the Nigerian Bar Association
                                (NBA) at the time of registering the case(s) with the Council.</p>
                        </div>

                        <p>
                            <strong>4.</strong> Counsel shall undertake visitation to clients (where cases are assigned to them)
                            who are in custody to interview them and take their brief in preparation for their
                            defence, while the Counsel shall where the need arises, have the responsibility of
                            notifying the authorities of the Custodial/Detention Centre, (as the case may be),
                            to accord Counsel all necessary assistance needed during such visits.
                        </p>

                        <p>
                            <strong>5.</strong> In cases assigned under this scheme, Counsel shall always announce appearance in
                            Courts as appearing for the indigent client under the Pro Bono Scheme of the Legal
                            Aid Council.
                        </p>

                        <p>
                            <strong>6.</strong> There is no fund for witness expenses under any hearing or nomenclature however
                            described, from which may trigger has been met, is being paid or is to be paid or
                            reimbursed for any Pro Bono Legal Services on behalf of the Council, neither is
                            there any drawn up case of remuneration to lawyers exerting for the present or in
                            the future under this scheme.
                        </p>

                        <p>
                            <strong>7.</strong> Counsel shall render a half yearly report to the Council, on the progress of cases
                            assigned or cases deemed assigned to them. This is to enable the Council monitor
                            the progression of the cases and ensure due diligence.
                        </p>

                        <p>
                            <strong>8.</strong> At the Conclusion of the trial in each case assigned or deemed assigned, Counsel
                            shall forward a final report on the case, accompanied by a Certified True Copy (CTC)
                            of the Judgment to the Legal Aid Council.
                        </p>

                        <p>
                            <strong>9.</strong> Pursuant to Paragraph 8 above, an acknowledgment of successful completion of
                            case(s) shall be issued to Counsel by the Legal Aid Council.
                        </p>
                    </div>

                    <p>
                        The Legal Aid Council looks forward to working with you in order for Pro Bono on
                        behalf of the Legal Aid Council.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DesinationLetter;
import React, { useState } from "react";
import CaseStatCard from "./components/CaseStatsSummaryChart";
import Intro from "@/components/Intro";
import { AddLawyerSheet } from "./Lawyer/_components/addLawyer";
import { CirclePlus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { ROLES } from "@/types/auth";
import BulkCaseUploadDialog from "./components/BulkUpload";
import { useAction } from "@/context/ActionContext";
import { CustomeSheet } from "@/components/CustomSheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CivilCaseForm from "../cases/FileCasesTab/CivilCaseForm";
import CriminalCaseForm from "../cases/FileCasesTab/CriminalCaseForm";
import PDSSCaseForm from "../cases/FileCasesTab/PSDDCaseForm";
import DecongestionForm from "../cases/FileCasesTab/DecongestionForm";
import MercyApplication from "../cases/FileCasesTab/MercyApplication";

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle: string;
    titleColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, titleColor = "text-gray-500" }) => {
    return (
        <div className="border rounded-xs p-6 space-y-2 shadow-sm bg-white">
            <div className={`text-md font-semibold ${titleColor}`}>{title}</div>
            <div className="text-3xl font-semibold text-black">{value}</div>
            <div className="text-md text-green-400">{subtitle}</div>
        </div>
    );
};

export default function CivilCriminalDashboard() {
    const { data: user } = useAppSelector((state) => state.profile);

    const role = user?.role;
    const { setIsOpen } = useAction();
    const [openFileACase, setOpenFileACase] = useState(false);
    const [openCaseType, setCaseType] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [caseTypeFilter, setCaseTypeFilter] = useState('');
    const handleCaseTypez = () => {
        console.log(caseTypeFilter);
        setCaseType(true);
    }
    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6">
                    <div className="flex justify-between items-center mb-8">
                        <Intro user={user?.first_name ?? "Admin"} />
                        <div className="flex gap-4">
                            {(role === ROLES.OSCAR_UNIT_HEAD || role === ROLES.PARALEGAL || role === ROLES.DECONGESTION_UNIT_HEAD) && (
                                <>
                                    <BulkCaseUploadDialog />
                                    <Button onClick={() => setOpenFileACase(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2  flex items-center gap-2 transition-colors h-11">
                                        <PlusCircle className="w-4 h-4" />
                                        File a Case
                                    </Button>
                                </>
                            )}

                            {(role === ROLES.CIVIL_JUSTICE_DEPT || role === ROLES.CRIMINAL_JUSTICE_DEPT) && (
                                <>
                                    <Button onClick={() => setIsOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2  flex items-center gap-2 transition-colors h-11">
                                        <CirclePlus size={20} />
                                        Add New Lawyer
                                    </Button>
                                    <AddLawyerSheet />
                                </>
                            )}

                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Cases" value="0" subtitle="+23% " />
                        <StatCard title="Active Cases" value="0" subtitle="+16%" />
                        <StatCard title="Closed Cases" value="0" subtitle="+16%" />
                        <StatCard title="Pending Cases" value="0" subtitle="+16%" />
                    </div>

                    <div className="">
                        <h2 className="text-lg font-semibold mb-4">Case Stats Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CaseStatCard
                                title="Assigned Cases"
                                value={5}
                                change="+1%"
                                categories={['May', 'June', 'April', 'July', 'August', 'September']}
                                data={[10, 15, 18, 22, 20, 28]}
                                orientation="horizontal"
                                cardBg="bg-red-50"
                                barColor="#BD2B12"
                            />
                            <CaseStatCard
                                title="Pending Cases"
                                value={15}
                                change="+2%"
                                categories={['July', 'April', 'August', 'September', 'May', 'June']}
                                data={[18, 13, 7, 5, 3, 1]}
                                orientation="vertical"
                                cardBg="bg-red-50"
                                barColor="#BD2B12"
                            />
                        </div>
                    </div>
                </div>

                {/* Add a Lawyer Component shee */}
                <CustomeSheet open={openFileACase} setOpen={setOpenFileACase} >
                    <div className="mt-6 space-y-6">
                        <h1 className="text-xl font-semibold">File A Case</h1>
                        <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
                            <SelectTrigger className="w-full h-11">
                                <SelectValue placeholder="Case Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {(role === ROLES.OSCAR_UNIT_HEAD || role === ROLES.PARALEGAL) && (
                                    <>
                                        <SelectItem value="Civil">Civil</SelectItem>
                                        <SelectItem value="Criminal">Criminal</SelectItem>
                                        <SelectItem value="PDSS1">PDSS(In Station)</SelectItem>
                                        <SelectItem value="PDSS2">PDSS(In Organanization)</SelectItem>
                                    </>
                                )}
                                {(role === ROLES.DECONGESTION_UNIT_HEAD) && (
                                    <SelectItem value="Decongestion">Decongestion</SelectItem>
                                )}
                                {(role === ROLES.PREROGATIVE_OF_MERCY_UNIT_HEAD) && (
                                    <SelectItem value="MercyApplication">Mercy Application</SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={handleCaseTypez}
                            disabled={!caseTypeFilter}
                            className={`w-full bg-red-500 h-11 ${caseTypeFilter ? 'bg-red-600 hover:bg-red-700' : ''}`}>
                            Proceed
                        </Button>
                    </div>
                </CustomeSheet>

                <CustomeSheet open={openCaseType} setOpen={setCaseType} className="min-w-3xl " >
                    <div className="mt-6">
                        {caseTypeFilter === "Civil" && <CivilCaseForm />}
                        {caseTypeFilter === "Criminal" && <CriminalCaseForm />}
                        {caseTypeFilter === "PDSS1" && <PDSSCaseForm />}
                        {caseTypeFilter === "PDSS2" && <PDSSCaseForm />}
                        {caseTypeFilter === "Decongestion" && <DecongestionForm />}
                        {caseTypeFilter === "MercyApplication" && <MercyApplication />}
                    </div>
                </CustomeSheet>
            </div >
        </>
    );
};


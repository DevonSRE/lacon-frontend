import { CustomeSheet } from "@/components/CustomSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import UploadCaseDocument from "./sheet/uploadCaseDocument";
import CaseProgressUpdate from "./sheet/caseProgressUpdate";
import UpdateCaseDetails from "./sheet/updateCase";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ICase } from "./types";

export default function LawyersReportGrid({ caseData }: { caseData: any[] }) {
    const [openCaseDocumentUpload, setOpenCaseDocumentUpload] = useState(false);
    const [openCaseProgressUpdate, setOpenCaseProgressUpdate] = useState(false);
    const [openUpdateCaseDetails, setOpenUpdateCaseDetails] = useState(false);
    const [caseDetails, setCaseDetails] = useState<ICase | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {caseData.map((item, idx) => {
                const assignDateRaw = item.assignment?.assign_date ?? "";
                const assignDateOnly = assignDateRaw.split(" ")[0] || "N/A";
                return (
                    <div key={idx} className="p-4 w-full bg-gray-100">
                        <div className="flex justify-between">
                            <span className="text-xs h-auto text-red-500 bg-red-100 p-2">
                                {item.status}
                            </span>

                            <DropdownMenu >
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreVertical size={16} className="text-black" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="space-y-2 border-[1px] border-black bg-gray-50 ">
                                    <DropdownMenuItem onClick={() => { setCaseDetails(item); setOpenCaseProgressUpdate(true); }}>
                                        Edit Case
                                    </DropdownMenuItem>
                                    <DropdownMenuItem >
                                        Escalate Case
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setCaseDetails(item); setOpenUpdateCaseDetails(true) }}>
                                        View Case
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>

                        <div className="space-y-4">

                            <div className="text-xs mt-4 text-gray-400">{item?.id}</div>
                            <h4 className="font-semibold leading-tight text-base">
                                {item.case_title ?? "-"}
                            </h4>
                            <p className="text-xs text-blue-500">{item.case_type ?? "-"}</p>
                            <div className="flex flex-row text-xs gap-4 justify-between">
                                <Badge className="p-2 w-24 bg-[#07ACA11A] text-[#07ACA1] rounded-none">
                                    {item.case_type ?? "-"}
                                </Badge>
                                <Badge className="p-2 flex-grow text-black bg-[#4545450D] rounded-none">
                                    Assigned on {assignDateOnly}
                                </Badge>
                            </div>

                            <Button onClick={() => setOpenCaseDocumentUpload(true)} className="w-full rounded-0 bg-black text-white hover:bg-gray-900 flex justify-start">
                                <span>Upload</span>
                            </Button>
                        </div>
                    </div>
                );
            })}
            <CustomeSheet open={openCaseDocumentUpload} setOpen={setOpenCaseDocumentUpload}>
                <UploadCaseDocument />
            </CustomeSheet>
            <CustomeSheet open={openCaseProgressUpdate} setOpen={setOpenCaseProgressUpdate}>
                <CaseProgressUpdate />
            </CustomeSheet>
            <CustomeSheet open={openUpdateCaseDetails} setOpen={setOpenUpdateCaseDetails}>
                <UpdateCaseDetails caseDetails={caseDetails} />
            </CustomeSheet>
        </div>
    );
}

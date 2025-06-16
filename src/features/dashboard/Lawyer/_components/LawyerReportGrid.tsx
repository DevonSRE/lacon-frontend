import { CustomeSheet } from "@/components/CustomSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import UploadCaseDocument from "./sheet/uploadCaseDocument";
import CaseProgressUpdate from "./sheet/caseProgressUpdate";
import UpdateCaseDetails from "./sheet/updateCase";

export default function LawyersReportGrid({ caseData }: { caseData: any[] }) {
    const [openCaseDocumentUpload, setOpenCaseDocumentUpload] = useState(false);
    const [openCaseProgressUpdate, setOpenCaseProgressUpdate] = useState(false);
    const [openUpdateCaseDetails, setOpenUpdateCaseDetails] = useState(false);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {caseData.map((item, idx) => (
                <Card key={idx} className="relative border-0 w-full">
                    <div className="absolute top-2 right-2 p-4 text-gray-400 cursor-pointer">
                        <MoreVertical size={16} />
                    </div>
                    <CardContent className="space-y-2">
                        <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                            {item.status}
                        </span>
                        <p className="text-sm text-gray-400">{item?.id}</p>
                        <h4 className="font-semibold leading-tight text-base">
                            {item.case_title ?? ""}
                        </h4>
                        <p className="text-xs text-blue-500">{item.case_type ?? "-"}</p>

                        <div className="flex flex-row text-xs gap-4 justify-between">
                            <Badge className="p-2 w-24 bg-[#07ACA11A] text-[#07ACA1] rounded-none">
                                {item.case_type ?? "-"}
                            </Badge>
                            <Badge className="p-2 flex-grow text-black bg-[#4545450D] rounded-none">
                                Assigned on{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                }).format(new Date(item.assignment.assign_date))}
                            </Badge>
                        </div>

                        <Button
                            onClick={() => setOpenCaseDocumentUpload(true)}
                            className="w-full bg-black text-white hover:bg-gray-900 flex justify-start rounded"
                        >
                            <span>Upload</span>
                        </Button>
                    </CardContent>
                </Card>
            ))}

            <CustomeSheet open={openCaseDocumentUpload} setOpen={setOpenCaseDocumentUpload}>
                <UploadCaseDocument />
            </CustomeSheet>

            <CustomeSheet open={openCaseProgressUpdate} setOpen={setOpenCaseProgressUpdate}>
                <CaseProgressUpdate />
            </CustomeSheet>

            <CustomeSheet open={openUpdateCaseDetails} setOpen={setOpenUpdateCaseDetails}>
                <UpdateCaseDetails />
            </CustomeSheet>
        </div>
    );
}

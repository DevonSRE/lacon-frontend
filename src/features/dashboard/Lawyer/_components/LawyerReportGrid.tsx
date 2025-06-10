import { CustomeSheet } from "@/components/CustomSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { SetStateAction, useState } from "react";
import UploadCaseDocument from "./sheet/uploadCaseDocument";
import CaseProgressUpdate from "./sheet/caseProgressUpdate";
import UpdateCaseDetails from "./sheet/updateCase";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function LawyersReportGrid({ caseData }: { caseData: { id: string; title: string; category: string; status: string; assignedDate: string }[] }) {
    const [openCaseDocumentUpload, setOpenCaseDocumentUpload] = useState(false);
    const [openCaseProgressUpdate, setOpenCaseProgressUpdate] = useState(false);
    const [openUpdateCaseDetails, setOpenUpdateCaseDetails] = useState(false);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 ">
            {caseData.map((item, idx) => (
                <Card key={idx} className="relative border-0 w-full">
                    <div className="absolute top-2 p-4 right-2 text-gray-400 cursor-pointer">
                        <MoreVertical size={16} />
                    </div>
                    <CardContent className="space-y-2">
                        <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                            {item.status}
                        </span>
                        <p className="text-sm text-gray-400">{item.id}</p>
                        <h4 className="font-semibold leading-tight text-base">
                            {item.title}
                        </h4>
                        <p className="text-xs text-blue-500">{item.category}</p>
                        <div className="flex flex-row text-xs gap-4 justify-between">
                            <Badge className="p-2 w-24 bg-[#07ACA11A] text-[#07ACA1] rounded-none">
                                PDSS
                            </Badge>
                            <Badge rounded-none className="p-2 flex-grow text-black bg-[#4545450D]  rounded-none">
                                Assigned on {item.assignedDate}
                            </Badge>
                        </div>
                        <Button onClick={() => setOpenCaseDocumentUpload(true)} className="w-full bg-black rounded-xs text-white hover:bg-gray-900 flex justify-start ">
                            <span>
                                Uplaod
                            </span>
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

            {/* <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">Open popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="leading-none font-medium">Dimensions</h4>
                            <p className="text-muted-foreground text-sm">
                                Set the dimensions for the layer.
                            </p>
                        </div>
                        <div className="grid gap-2">

                        </div>
                    </div>
                </PopoverContent>
            </Popover> */}

        </div>
    );
}   
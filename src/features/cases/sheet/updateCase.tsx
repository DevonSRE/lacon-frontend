import { Button } from "@/components/ui/button";
import { ICase } from "../../dashboard/Lawyer/_components/types";


interface DEtails {
    caseDetails: ICase | null;
    onUpdateProgress?: () => void;
    onUploadDocument?: () => void;
}

export default function UpdateCaseDetails({ caseDetails, onUpdateProgress, onUploadDocument }: DEtails) {
    const clientName = [caseDetails?.first_name, caseDetails?.middle_name, caseDetails?.last_name]
        .filter(Boolean)
        .join(" ");
    const decongestion = caseDetails?.decongestion_unit;
    const mercy = caseDetails?.perogative_of_mercy;
    const description =
        decongestion?.offence_charged_description ||
        decongestion?.offence_charged ||
        mercy?.reason_for_clemency ||
        mercy?.sentence_passed;

    return (
        <div className="max-w-md mx-auto mt-10   space-y-6">
            <div>
                <h2 className="text-lg font-semibold">CASE ID: {caseDetails?.id ?? "-"}</h2>
                <p className="text-sm text-gray-500">Filed On {caseDetails?.filed_date ?? ""}</p>
            </div>

            <div className="flex gap-2">
                <span className="bg-red-100 text-red-700 px-4 py-1 rounded text-sm font-medium">{caseDetails?.case_type ?? ""}</span>
                <span className="bg-red-100 text-red-700 px-4 py-1 rounded text-sm font-medium">{caseDetails?.location ?? ""}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Button onClick={onUploadDocument} className="bg-black w-full text-white px-4 py-2 rounded h-11">Upload Document</Button>
                <Button onClick={onUpdateProgress} className="bg-red-600 w-full text-white px-4 py-2 rounded h-11">Update Progress</Button>
            </div>

            <hr />

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Client Information</h3>
                <p><span className="font-medium">Name:</span> {clientName || "-"}</p>
                <p><span className="font-medium">Number:</span> {caseDetails?.phone_number || "-"}</p>
                <p><span className="font-medium">Remanded:</span> {decongestion?.remand_date || "-"}</p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Case Description</h3>
                <p className="text-sm text-gray-700">
                    {description || "-"}
                </p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Next Hearing</h3>
                <p className="text-sm text-gray-700">{decongestion?.next_adjournment || "-"}</p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Assigned Lawyer</h3>
                <p className="text-sm text-gray-700">{caseDetails?.assignment?.assignee ?? "-"}</p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Supporting Document</h3>
                <div className="space-y-2">
                    -
                </div>
            </div>
        </div>
    );
};

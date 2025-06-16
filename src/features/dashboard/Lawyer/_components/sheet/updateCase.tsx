import { Button } from "@/components/ui/button";
import { ICase } from "../types";


interface DEtails {
    caseDetails: ICase | null;
}

export default function UpdateCaseDetails({ caseDetails }: DEtails) {
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
                <Button className="bg-black w-full text-white px-4 py-2 rounded h-11">✎ Edit</Button>
                <Button className="bg-red-600 w-full text-white px-4 py-2 rounded h-11">Update Progress</Button>
            </div>

            <hr />

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Client Information</h3>
                <p><span className="font-medium">Name:</span> -</p>
                <p><span className="font-medium">Number:</span> -</p>
                <p><span className="font-medium">Remanded:</span>-</p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Case Description</h3>
                <p className="text-sm text-gray-700">
                    -
                </p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Next Hearing</h3>
                <p className="text-sm text-gray-700">-</p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Assigned Lawyer</h3>
                <p className="text-sm text-gray-700">{caseDetails?.assignment?.assignee ?? "-"}</p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Supporting Document</h3>
                <div className="space-y-2">
                    -
                    {/* {["Police Report.pdf", "Client Statement.docx"].map((doc, i) => (
                        <div key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                            <span className="text-sm">{doc}</span>
                            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Download</button>
                        </div>
                    ))} */}
                </div>
            </div>
        </div>
    );
};
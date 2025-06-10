
export default function UpdateCaseDetails() {
    return (
        <div className="max-w-md mx-auto mt-10   space-y-6">
            <div>
                <h2 className="text-lg font-semibold">CASE ID: LCN-cr-0098726</h2>
                <p className="text-sm text-gray-500">Filed On April 6th, 2025</p>
            </div>

            <div className="flex gap-2">
                <span className="bg-red-100 text-red-700 px-4 py-1 rounded text-sm font-medium">Criminal Case</span>
                <span className="bg-red-100 text-red-700 px-4 py-1 rounded text-sm font-medium">Lagos</span>
            </div>

            <div className="flex gap-2">
                <button className="bg-black text-white px-4 py-2 rounded">✎ Edit</button>
                <button className="bg-red-600 text-white px-4 py-2 rounded">Update Progress</button>
            </div>

            <hr />

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Client Information</h3>
                <p><span className="font-medium">Name:</span> Jonathan Potter</p>
                <p><span className="font-medium">Number:</span> 08000000000</p>
                <p><span className="font-medium">Remanded:</span> November 6th, 2025</p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Case Description</h3>
                <p className="text-sm text-gray-700">
                    Client alleges wrongfully remanded for over 3 years. requesting legal aid representation.
                    Claims Offence was minor and bail never granted.
                </p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Next Hearing</h3>
                <p className="text-sm text-gray-700">June 10, 2025 - Magistrate Court, Lagos</p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Assigned Lawyer</h3>
                <p className="text-sm text-gray-700">Barr. Jane Smith</p>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Supporting Document</h3>
                <div className="space-y-2">
                    {["Police Report.pdf", "Client Statement.docx"].map((doc, i) => (
                        <div key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                            <span className="text-sm">{doc}</span>
                            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Download</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
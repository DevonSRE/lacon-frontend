import React, { useState } from "react";

const UploadCaseDocument = () => {
  const [documentTitle, setDocumentTitle] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic
    console.log({ documentTitle, updateType, documentType, file });
  };

  return (
    <div className="max-w-md mx-auto ">
      <h2 className="text-xl font-semibold mb-6">Upload Case Document</h2>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <label className="block text-sm font-medium mb-1">Document Title</label>
          <input
            type="text"
            placeholder="E.g. Hearing Notes, Court Order"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type of Update</label>
          <select
            value={updateType}
            onChange={(e) => setUpdateType(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select update type</option>
            <option value="new">New</option>
            <option value="amendment">Amendment</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Document Type</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Document Type</option>
            <option value="pleadings">Pleadings</option>
            <option value="evidence">Evidence</option>
            <option value="motions">Motions</option>
            <option value="court-orders">Court Orders</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Common types: Pleadings, Evidence, Motions, Court Orders
          </p>
        </div>
        <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <p className="font-medium mb-2">Supporting Documents</p>
          <p className="text-sm text-gray-500 mb-4">Upload the relevant documents</p>
          <input
            type="file"
            accept=".png,.pdf,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-block px-4 py-2 bg-white border rounded hover:bg-gray-100"
          >
            → Browse File
          </label>
          <p className="text-xs text-gray-400 mt-2">PNG, PDF, JPG, JPEG - Up to 100MB</p>
          {file && <p className="text-sm mt-2 text-green-600">Selected: {file.name}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-rose-300 text-white py-2 rounded disabled:opacity-50"
          disabled={!documentTitle || !updateType || !documentType || !file}
        >
          Upload Document
        </button>
      </form>
    </div>
  );
};

export default UploadCaseDocument;

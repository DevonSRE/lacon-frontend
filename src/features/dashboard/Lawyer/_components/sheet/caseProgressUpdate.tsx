import { useState } from 'react';
import { NextPage } from 'next';

const CaseProgressUpdate: NextPage = () => {
  const [status, setStatus] = useState('In Progress');

  return (
    <div className="max-w-md mx-auto mt-10 ">
      <h1 className="text-xl font-semibold mb-4">Submit Case Progress Update</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium">Case ID</label>
        <input
          type="text"
          value="LCN-2025-0007"
          readOnly
          className="w-full mt-1 p-2 border rounded-md bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Date of Last Update</label>
        <input
          type="text"
          value="24/04/2025"
          readOnly
          className="w-full mt-1 p-2 border rounded-md bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Court Progress Summary</label>
        <textarea
          placeholder="Describe Progress made in court……………."
          className="w-full mt-1 p-2 border rounded-md"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Next Steps / Adjournment Date</label>
        <textarea
          placeholder="Mention Next Steps or Upcoming Hearing…………"
          className="w-full mt-1 p-2 border rounded-md"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Current Case Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option>In Progress</option>
          <option>Completed</option>
          <option>On Hold</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Supporting Documents</label>
        <div className="border border-dashed p-6 text-center rounded-md bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">Upload the relevant documents</p>
          <p className="text-xs text-gray-400 mb-4">PNG, PDF, JPG, JPEG - Up to 100MB</p>
          <input type="file" multiple className="hidden" id="fileUpload" />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer inline-block bg-white border px-4 py-2 text-sm rounded hover:bg-gray-100"
          >
            Browse File
          </label>
        </div>
      </div>

      <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold">
        Update
      </button>
    </div>
  );
};

export default CaseProgressUpdate;

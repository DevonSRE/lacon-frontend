import InputField from "@/components/form/input/InputField";
import SelectField from "@/components/SelectField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useState, useActionState } from "react";

// Define the form data type
interface FormData {
  documentTitle: string;
  updateType: string;
  documentType: string;
}

// Mock submit function - replace with your actual server action
const submiteUpdate = async (prevState: any, formData: FormData) => {
  // Your server action logic here
  console.log('Submitting:', formData);
  return { success: true, message: 'Document uploaded successfully' };
};

const UploadCaseDocument = () => {
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    documentTitle: "",
    updateType: "",
    documentType: ""
  });

  // File state
  const [file, setFile] = useState<File | null>(null);

  // Server action state
  const [state, formAction, isPending] = useActionState(submiteUpdate, undefined);

  // Generic input change handler
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Select change handler
  const handleSelectChange = (value: string, name: keyof FormData) => {
    console.log('Select changed:', name, value); // Debug log
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData object for file upload
    const submitData = new FormData();
    submitData.append('documentTitle', formData.documentTitle);
    submitData.append('updateType', formData.updateType);
    submitData.append('documentType', formData.documentType);
    if (file) {
      submitData.append('file', file);
    }

    // Call the form action
    formAction(formData);

    console.log({ ...formData, file });
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-6">Upload Case Document</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Document Title"
          name="documentTitle"
          type="text"
          placeholder="Enter document title"
          required={true}
          value={formData.documentTitle}
          onChange={(e) => handleInputChange('documentTitle', e.target.value)}
        />
        <SelectField
          name="updateType"
          label="Type of Update"
          placeholder="Select Update"
          options={[
            { value: 'new', label: 'New' },
            { value: 'amendment', label: 'Amendment' }
          ]}
          required
          value={formData.updateType}
          onValueChange={(value) => handleSelectChange(value, 'updateType')}
        />
        <SelectField
          name="documentType"
          label="Document Type"
          placeholder="Select Document Type"
          options={[
            { value: 'pleadings', label: 'Pleadings' },
            { value: 'evidence', label: 'Evidence' },
            { value: 'motions', label: 'Motions' },
            { value: 'court-orders', label: 'Court Orders' }
          ]}
          required
          value={formData.documentType}
          onValueChange={(value) => handleSelectChange(value, 'documentType')}
        />
        <p className="text-xs text-gray-500 mt-1">
          Common types: Pleadings, Evidence, Motions, Court Orders
        </p>

        <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 space-y-10 text-center bg-gray-50">
          <p className="font-medium mb-2">Supporting Documents</p>
          <p className="text-sm text-gray-500 mb-4">Upload the relevant documents</p>
          <input
            type="file"
            accept=".png,.pdf,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            required
          />
          <Label
            htmlFor="file-upload"
            className="cursor-pointer inline-block px-4 py-2 bg-white border rounded hover:bg-gray-100"
          >
            → Browse File
          </Label>
          <p className="text-xs text-gray-400 mt-2">PNG, PDF, JPG, JPEG - Up to 100MB</p>
          {file && <p className="text-sm mt-2 text-green-600">Selected: {file.name}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-rose-300 text-white py-2 rounded disabled:opacity-50"
          disabled={!formData.documentTitle || !formData.updateType || !formData.documentType || !file || isPending}
        >
          {isPending ? 'Uploading...' : 'Upload Document'}
        </Button>

        {state?.message && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadCaseDocument;
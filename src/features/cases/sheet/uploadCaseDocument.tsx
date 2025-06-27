import InputField from "@/components/form/input/InputField";
import SelectField from "@/components/SelectField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useState, useActionState, SetStateAction, Dispatch, useEffect } from "react";
import { UploadCaseDocumentAction } from "../server/caseAction";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";
import { toast } from "sonner";
import { CLIENT_ERROR_STATUS } from "@/lib/constants";
import { ICase } from "@/features/dashboard/Lawyer/_components/types";
import { NextPage } from 'next';
import { Input } from "@/components/ui/input";

// Define the form data type
interface FormData {
  document_title: string;
  update_type: string;
  document_type: string;
  casefile_id: string;
  document_path: File | null;
}

interface FormErrors {
  document_title: string;
  update_type: string;
  document_type: string;
  casefile_id: string;
  document_path: string;
}

type CaseProgressUpdateProps = {
  caseDetails: ICase | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const UploadCaseDocument: NextPage<CaseProgressUpdateProps> = ({ caseDetails, setIsOpen }) => {
  const [formData, setFormData] = useState<FormData>({
    document_title: "",
    update_type: "",
    document_type: "",
    casefile_id: "",
    document_path: null
  });

  const [state, formAction, isPending] = useActionState(UploadCaseDocumentAction, undefined);
  const [errors, setErrors] = useState<FormErrors>({
    document_title: "",
    update_type: "",
    document_type: "",
    casefile_id: "",
    document_path: ""
  });
  const [fileError, setFileError] = useState("");

  // Set casefile_id when caseDetails is available
  useEffect(() => {
    if (caseDetails?.id) {
      setFormData(prev => ({
        ...prev,
        casefile_id: caseDetails.id
      }));
    }
  }, [caseDetails]);

  useEffectAfterMount(() => {
    if (state && CLIENT_ERROR_STATUS.includes(state?.status)) {
      toast.error(state?.message, {
        description: typeof state?.errors === "string"
          ? state.errors
          : state?.errors
            ? Object.values(state.errors).flat().join(", ")
            : undefined,
      });
    } else if (state?.status === 200 || state?.status === 201) {
      toast.success("File uploaded successfully!");
      setIsOpen(false);
    }
  }, [state, setIsOpen]);

  // Generic input change handler
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Select change handler
  const handleSelectChange = (value: string, name: keyof FormData) => {
    console.log('Select changed:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    // Basic validation
    const newErrors: FormErrors = {
      document_title: !formData.document_title ? "Document title is required" : "",
      update_type: !formData.update_type ? "Update type is required" : "",
      document_type: !formData.document_type ? "Document type is required" : "",
      casefile_id: !formData.casefile_id ? "Case ID is required" : "",
      document_path: !formData.document_path ? "Document file is required" : ""
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) {
      toast.error("Please fill in all required fields");
      return;
    }

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        fd.append(key, value instanceof File ? value : String(value));
      }
    });

    console.log("Submitting form data:", Object.fromEntries(fd.entries()));
    formAction(fd);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setFileError("No file selected.");
      setFormData(prev => ({ ...prev, document_path: null }));
      return;
    }

    // Updated file validation to accept PDFs and images
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Please upload a valid file (PNG, JPG, JPEG, or PDF).");
      setFormData(prev => ({ ...prev, document_path: null }));
      return;
    }

    // Updated size limit to 100MB as mentioned in UI
    const maxSizeInBytes = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSizeInBytes) {
      setFileError("File size exceeds 100MB limit.");
      setFormData(prev => ({ ...prev, document_path: null }));
      return;
    }

    // All good
    setFileError("");
    setFormData(prev => ({ ...prev, document_path: file }));
    // Clear document_path error if it exists
    if (errors.document_path) {
      setErrors(prev => ({ ...prev, document_path: '' }));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-6">Upload Case Document</h2>
      <form action={handleSubmit} className="space-y-6">
        <InputField
          label="Document Title"
          name="document_title"
          type="text"
          placeholder="Enter document title"
          required={true}
          value={formData.document_title}
          onChange={(e) => handleInputChange('document_title', e.target.value)}
        />

        <SelectField
          name="update_type"
          label="Type of Update"
          placeholder="Select Update"
          options={[
            { value: 'new', label: 'New' },
            { value: 'amendment', label: 'Amendment' }
          ]}
          required
          value={formData.update_type}
          onValueChange={(value) => handleSelectChange(value, 'update_type')}
        />

        <div>
          <SelectField
            name="document_type"
            label="Document Type"
            placeholder="Select Document Type"
            options={[
              { value: 'pleadings', label: 'Pleadings' },
              { value: 'evidence', label: 'Evidence' },
              { value: 'motions', label: 'Motions' },
              { value: 'court-orders', label: 'Court Orders' }
            ]}
            required
            value={formData.document_type}
            onValueChange={(value) => handleSelectChange(value, 'document_type')}
          />
          <span className="text-xs text-gray-500">
            Common types: Pleadings, Evidence, Motions, Court Orders
          </span>
        </div>

        <div className="mb-6 mt-4">
          <Label className="mb-1">Upload Case Document</Label>
          <div className={`border border-dashed p-6 text-center rounded-md bg-gray-50 ${errors.document_path || fileError ? 'border-red-500' : 'border-gray-300'
            }`}>
            <p className="text-sm text-gray-600 mb-2">Upload the relevant documents</p>
            <p className="text-xs text-gray-400 mb-4">PNG, PDF, JPG, JPEG - Up to 100MB per file</p>
            <Input
              type="file"
              className="hidden"
              id="fileUpload"
              accept=".png,.pdf,.jpg,.jpeg"
              onChange={handleFileChange}
            />
            <Label
              htmlFor="fileUpload"
              className="cursor-pointer inline-block bg-white border px-4 py-2 text-sm rounded hover:bg-gray-100"
            >
              Browse Files
            </Label>
            {formData.document_path && !fileError && (
              <p className="text-sm text-green-600 mt-2">{formData.document_path.name}</p>
            )}
          </div>
          {(errors.document_path || fileError) && (
            <p className="text-red-500 text-sm mt-1">{errors.document_path || fileError}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded disabled:opacity-50 h-11"
          disabled={isPending}
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
import { useState, useEffect, useActionState, SetStateAction, Dispatch } from 'react';
import { NextPage } from 'next';
import { Input } from '@/components/ui/input';
import InputField from '@/components/form/input/InputField';
import { ICase } from '../../dashboard/Lawyer/_components/types';
import TextAreaField from '@/components/TextAreaField';
import SelectField from '@/components/SelectField';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import { toast } from 'sonner';
import { CaseUpdate } from '../server/caseAction';

// Extended interface for form data with additional fields
interface CaseProgressFormData extends Partial<ICase> {
  casefile_id?: string;
  next_step?: string;
  current_status?: string;
  court_progress?: string;
  supporting_documents?: File | null;
}

// Error state interface
interface FormErrors {
  casefile_id?: string;
  next_step?: string;
  current_status?: string;
  court_progress?: string;
  supporting_documents?: string;
}

type CaseProgressUpdateProps = {
  caseDetails: ICase | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const CaseProgressUpdate: NextPage<CaseProgressUpdateProps> = ({ caseDetails, setIsOpen }) => {
  const [formData, setFormData] = useState<CaseProgressFormData>({
    id: '',
    case_id: '',
    name: '',
    first_name: '',
    last_name: '',
    status: '',
    filed_date: '',
    casefile_id: '',
    next_step: '',
    current_status: 'In Progress',
    court_progress: '',
    supporting_documents: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [state, dispatch, isPending] = useActionState(CaseUpdate, undefined);

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
      toast.success("Case File Updated successfully!");
      setIsOpen(false);
    }
  }, [state]);

  // Initialize form data with case details when available
  useEffect(() => {
    if (caseDetails) {
      setFormData(prev => ({
        ...prev,
        id: caseDetails.id,
        case_id: caseDetails.case_id || '',
        casefile_id: caseDetails.case_id || '',
        name: caseDetails.name || '',
        first_name: caseDetails.first_name || '',
        last_name: caseDetails.last_name || '',
        status: caseDetails.status || '',
        current_status: caseDetails.status || 'In Progress',
      }));
    }
  }, [caseDetails]);

  const updateField = (field: keyof CaseProgressFormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSelectChange = (value: string, name: keyof CaseProgressFormData) => {
    console.log('Select changed:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user selects
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const [fileError, setFileError] = useState("");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setFileError("No file selected.");
      updateField("supporting_documents", null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Please upload a valid image file.");
      updateField("supporting_documents", null);
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setFileError("File size exceeds 5MB limit.");
      updateField("supporting_documents", null);
      return;
    }
    // ✅ All good
    setFileError("");
    updateField("supporting_documents", file);
  };


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.casefile_id?.trim()) {
      newErrors.casefile_id = 'Court ID is required';
    }

    if (!formData.next_step?.trim()) {
      newErrors.next_step = 'Next Steps / Adjournment Date is required';
    }

    if (!formData.current_status) {
      newErrors.current_status = 'Current Case Status is required';
    }

    if (!formData.court_progress?.trim()) {
      newErrors.court_progress = 'Court Progress Summary is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    } else {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          fd.append(key, value instanceof File ? value : String(value));
        }
      });
      dispatch(fd)
    }

  };

  const getLastUpdated = (): string => {
    if (!caseDetails?.updated_by || caseDetails.updated_by.length === 0) {
      return 'N/A';
    }

    // Get the most recent update
    const lastUpdate = caseDetails.updated_by[caseDetails.updated_by.length - 1];
    return new Date(lastUpdate.time).toLocaleDateString();
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Submit Case Progress Update</h1>
      <form action={handleSubmit}>
        <input type="hidden" value={caseDetails?.id} name="id" />
        <div className="mb-4">
          <InputField
            name='casefile_id'
            label="Court ID"
            type="text"
            value={formData.casefile_id || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField('casefile_id', e.target.value)
            }
            className={` ${errors.casefile_id ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          />
        </div>

        <div className="mb-4">
          <InputField
            label="Date of Last Update"
            type="text"
            readOnly
            value={getLastUpdated()}
            className="border-gray-300 bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <TextAreaField
            name="court_progress"
            label="Court Progress Summary"
            required
            placeholder="Describe Progress made in court……………"
            value={formData.court_progress || ''}
            onChange={(e) => updateField('court_progress', e.target.value)}
            error={errors.court_progress}
          />

          {errors.court_progress && (
            <p className="text-red-500 text-sm mt-1">{errors.court_progress}</p>
          )}
        </div>

        <div className="mb-4">
          <TextAreaField
            name="next_step"
            label="Next Steps / Adjournment Date"
            required
            placeholder="Enter your Next Steps / Adjournment Date"
            value={formData.next_step || ''}
            onChange={(e) => updateField('next_step', e.target.value)}
            error={errors.next_step}
          />
        </div>

        <div className="mb-4">
          <SelectField
            name="current_status"
            label="Current Case Status"
            placeholder="Current Case Status"
            options={[
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
              { value: 'On Hold', label: 'On Hold' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Dismissed', label: 'Dismissed' },
            ]}
            required
            value={formData.current_status || ''}
            onValueChange={(value) => handleSelectChange(value, 'current_status')}
            error={!!errors.current_status}
            errorMessage={errors.current_status}
          />
        </div>

        <div className="mb-6">
          <Label className="mb-1">Supporting Documents</Label>
          <div className={`border border-dashed p-6 text-center rounded-md bg-gray-50 ${errors.supporting_documents ? 'border-red-500' : 'border-gray-300'
            }`}>
            <p className="text-sm text-gray-600 mb-2">Upload the relevant documents</p>
            <p className="text-xs text-gray-400 mb-4">PNG, PDF, JPG, JPEG - Up to 100MB per file</p>
            <Input
              type="file"
              multiple
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
            {formData.supporting_documents && !fileError && (
              <p className="text-sm text-green-600 mt-2">{formData.supporting_documents.name}</p>
            )}
          </div>
          {errors.supporting_documents && (
            <p className="text-red-500 text-sm mt-1">{errors.supporting_documents}</p>
          )}
        </div>

        {state?.errors && typeof state.errors === 'object' && (
          <div className="text-red-500 bg-red-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Please fix the following errors:</h3>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(state.errors).map(([key, val]) =>
                Array.isArray(val)
                  ? val.map((msg, idx) => (
                    <li key={`${key}-${idx}`}>{key.replace(/_/g, ' ')}: {msg}</li>
                  ))
                  : <li key={key}>{key.replace(/_/g, ' ')}: {String(val)}</li>
              )}
            </ul>
          </div>
        )}


        <Button type="submit" disabled={isPending} className={`w-full py-2 rounded-md font-semibold ${isPending
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-red-600 hover:bg-red-700'
          } text-white`}>
          {isPending ? 'Updating...' : 'Update'}
        </Button>
      </form>
    </div>
  );
};

export default CaseProgressUpdate;
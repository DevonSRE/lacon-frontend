'use client'
import { useState, useRef, useActionState, useEffect, SetStateAction, Dispatch } from 'react';
import { Label } from '@/components/ui/label';
import { submitProBonoForm } from '@/features/probunoLawyers/server/action';
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import { toast } from "sonner";
import InputField from '@/components/form/input/InputField';
import TextAreaField from '@/components/TextAreaField';
import { GetState } from '@/components/get-state';
import { SubmitButton } from '@/components/submit-button';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import SuccessDialog from '@/components/successDialog';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  alternate_number: string;
  state_bar_membership: string;
  name_of_law_firm_organization: string;
  law_firm_organization_address: string;
  most_contactable_call_no: string;
  experience_in_criminal_law: string;
  pro_bono_capacity: string;
  criminal_courts_preference: string[];
}
type ProBonoFormProps = {
  isPublic?: boolean;
  setDialogOpen?: Dispatch<SetStateAction<boolean>>;
};

export default function ProBonoForm({ isPublic = false, setDialogOpen = () => { } }: ProBonoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [state, formAction, isPending] = useActionState(submitProBonoForm, undefined);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [agreement, setAgreementChange] = useState(false);

  // Form state management
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    alternate_number: '',
    state_bar_membership: '',
    name_of_law_firm_organization: '',
    law_firm_organization_address: '',
    most_contactable_call_no: '',
    experience_in_criminal_law: '',
    pro_bono_capacity: '',
    criminal_courts_preference: []
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      criminal_courts_preference: checked
        ? [...prev.criminal_courts_preference, value]
        : prev.criminal_courts_preference.filter(item => item !== value)
    }));
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      alternate_number: '',
      state_bar_membership: '',
      name_of_law_firm_organization: '',
      law_firm_organization_address: '',
      most_contactable_call_no: '',
      experience_in_criminal_law: '',
      pro_bono_capacity: '',
      criminal_courts_preference: []
    });
    setSelectedState("");
    setAgreementChange(false);
  };

  useEffectAfterMount(() => {
    if (!state) return;

    if (CLIENT_ERROR_STATUS.includes(state.status)) {
      let errorMessage = "An error occurred.";
      try {
        if (typeof state.errors === "string") {
          errorMessage = state.errors;
        } else if (state.errors && typeof state.errors === "object") {
          errorMessage = Object.entries(state.errors)
            .map(([key, value]) =>
              Array.isArray(value)
                ? `${key}: ${value.join(", ")}`
                : `${key}: ${String(value)}`
            )
            .join(" | ");
        }
      } catch (err) {
        console.warn("Error formatting toast message", err);
        errorMessage = "Failed to parse error message.";
      }

      toast.error(state.message ?? "An error occurred", {
        description: errorMessage,
      });

      // Don't reset form on error - keep user data
    } else if (state.status === 200 || state.status === 201) {
      setOpenSuccess(true);
      setTimeout(() => {
        setDialogOpen(false);
      }, 3000);
      resetForm();
    }
  }, [state]);

  const personalFields = [
    { label: 'First Name', name: 'first_name', type: 'input', required: true },
    { label: 'Last Name', name: 'last_name', type: 'input', required: true },
    { label: 'Email Address', name: 'email', type: 'input', required: true },
    { label: 'Mobile Phone Number', name: 'phone_number', type: 'input', required: true },
    { label: 'Alternate Number', name: 'alternate_number', type: 'input', required: false },
    { label: 'State Bar Membership', name: 'state_bar_membership', type: 'input', required: true },
    { label: 'Name of Law Firm/Organization', name: 'name_of_law_firm_organization', type: 'textarea', required: true },
    { label: 'Law Firm/Organization Address', name: 'law_firm_organization_address', type: 'textarea', required: true },
    { label: 'Most Contactable Call No', name: 'most_contactable_call_no', type: 'input', required: true }
  ];

  const experienceOptions = ['Below 2 years', '2-5 years', '5-10 years', 'Above 10 years'];
  const capacityOptions = ['1 case at a time', '2 cases at a time', '3-4 cases at a time', '5 or more cases at a time'];
  const courtOptions = ['Appellate Courts', 'High Courts', 'Magistrate Courts', 'Customary Court', 'Sharia Court', 'Area Court'];

  return (
    <>
      <SuccessDialog
        open={openSuccess}
        isPublic={isPublic}
        onOpenChange={setOpenSuccess}
        title={"Success"}
        details={"Registration submitted successfully"}
      />
      <div className='pb-32 space-y-10'>
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold text-center">Online Pro Bono Lawyer Registration Form</h1>
        </div>
        <hr />

        <form ref={formRef} action={formAction} className='pb-32 space-y-12'>
          {/* SECTION 1: Personal Details */}
          <input type="hidden" name="isPublic" value={isPublic ? "true" : "false"} />
          <section className="space-y-4">
            <h2 className="font-semibold text-lg">SECTION 1: Personal Details and Office Info</h2>

            <div className="grid grid-cols-2 gap-4">
              {personalFields.map(field => (
                <div key={field.name}>
                  {field.type === 'input' ? (
                    <InputField
                      label={field.label}
                      name={field.name}
                      required={field.required}
                      value={formData[field.name as keyof FormData] as string}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  ) : (
                    <TextAreaField
                      label={field.label}
                      name={field.name}
                      required={field.required}
                      value={formData[field.name as keyof FormData] as string}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}

              <div className="space-y-6">
                <Label htmlFor="state-select">State of Practice</Label>
                <GetState
                  value={selectedState}
                  onValueChange={setSelectedState}
                  placeholder="Select state"
                />
              </div>
            </div>
            <input type="hidden" name="state_of_practice" value={selectedState} />
          </section>

          {/* SECTION 2: Experience */}
          <section className="space-y-4">
            <h2 className="font-semibold text-lg">SECTION 2: Experience in Criminal Law Practice</h2>
            <p className="text-sm text-gray-700 mb-4">How many years of experience do you have?</p>
            <div className="space-y-3">
              {experienceOptions.map(option => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="experience_in_criminal_law"
                    value={option}
                    required
                    checked={formData.experience_in_criminal_law === option}
                    onChange={(e) => handleInputChange('experience_in_criminal_law', e.target.value)}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </section>

          {/* SECTION 3: Case Capacity */}
          <section className="space-y-4">
            <h2 className="font-semibold text-lg">SECTION 3: Pro Bono Case Handling Capacity</h2>
            <p className="text-sm text-gray-700 mb-4">How many pro-bono cases can you handle at a time?</p>
            <div className="space-y-3">
              {capacityOptions.map(option => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="pro_bono_capacity"
                    value={option}
                    checked={formData.pro_bono_capacity === option}
                    onChange={(e) => handleInputChange('pro_bono_capacity', e.target.value)}
                    required
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </section>

          {/* SECTION 4: Court Preference */}
          <section className="space-y-4">
            <h2 className="font-semibold text-lg">SECTION 4: Criminal Matters Preference</h2>
            <p className="text-sm text-gray-700 mb-4">Which courts do you prefer handling criminal matters in?</p>
            <div className="space-y-3">
              {courtOptions.map(option => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="criminal_courts_preference"
                    value={option}
                    checked={formData.criminal_courts_preference.includes(option)}
                    onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </section>

          {/* SECTION 5: Agreement */}
          <section className="space-y-4">
            <h2 className="font-semibold text-lg">SECTION 5: Acknowledgement & Undertaking</h2>
            <p className="text-md text-gray-700 max-w-5xl">
              By submitting this form, I certify that the information provided is true and accurate. I undertake to render free legal services with the same professional standards as paid services, and understand that LACOM may withdraw my assigned cases if I fail to diligently perform my duties.
            </p>
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="agree"
                checked={agreement}
                onChange={e => setAgreementChange(e.target.checked)}
                value="true"
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
              />
              <span className="text-sm text-gray-700">I agree</span>
            </label>
          </section>

          {/* Error Display */}
          {state?.errors && (
            <div className="text-red-500 bg-red-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Please fix the following errors:</h3>
              <ul className="list-disc list-inside space-y-1">
                {typeof state.errors === 'string' ? (
                  <li>{state.errors}</li>
                ) : (
                  Object.entries(state.errors).map(([key, val]) => {
                    const messages = Array.isArray(val) ? val : [String(val)];
                    return messages.map((msg, idx) => (
                      <li key={`${key}-${idx}`}>
                        {key.replace(/_/g, ' ')}: {msg}
                      </li>
                    ));
                  })
                )}
              </ul>
            </div>
          )}

          <SubmitButton
            value="Submit Form"
            loading={isPending}
            disabled={!agreement}
            pendingValue="Processing..."
            className="w-2/3 h-12 bg-red-500 hover:bg-red-600 text-white font-xs py-3 rounded-none transition-colors duration-200 flex items-center justify-center"
          />
        </form>
      </div>
    </>
  );
}

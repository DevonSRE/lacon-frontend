'use client'
import { useState, useRef, useActionState, useEffect } from 'react';
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

export default function ProBonoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [state, formAction, isPending] = useActionState(submitProBonoForm, undefined);
  const [open, setOpen] = useState(false);

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
    } else if (state.status === 200 || state.status === 201) {
      toast.success("Registeration Submitted successfully!");
      setOpen(true);
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

  const experienceOptions = ['Below 2 years', '2-5f years', '5-10 years', 'Above 10 years'];
  const capacityOptions = ['1 case at a time', '2 cases at a time', '3-4 cases at a time', '5 or more cases at a time'];
  const courtOptions = ['Appellate Courts', 'High Courts', 'Magistrate Courts', 'Customary Court', 'Sharia Court', 'Area Court'];

  return (
    <>
      <SuccessDialog
        open={open}
        onOpenChange={setOpen}
        title={"Success"}
        details={"Registeration submitted successfully"}
      />
      <div className='pb-32 space-y-10'>
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold text-center">Online Pro Bono Lawyer Registration Form</h1>
        </div>
        <hr />

        <form ref={formRef} action={formAction} className='pb-32 space-y-12'>
          {/* SECTION 1: Personal Details */}
          <section className="space-y-4">
            <h2 className="font-semibold text-lg">SECTION 1: Personal Details and Office Info</h2>

            {personalFields.map(field => (
              <div key={field.name}>
                {field.type === 'input' ? (
                  <InputField
                    label={field.label}
                    name={field.name}
                    required={field.required}
                  />
                ) : (
                  <TextAreaField
                    label={field.label}
                    name={field.name}
                    required={field.required}
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
              {/* Hidden input to submit state value */}
              <input type="hidden" name="state_of_practice" value={selectedState} />
            </div>
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
            pendingValue="Processing..."
            className="w-2/3 h-12 bg-red-500 hover:bg-red-600 text-white font-xs py-3 rounded-none transition-colors duration-200 flex items-center justify-center"
          />
        </form>
      </div>
    </>

  );
}

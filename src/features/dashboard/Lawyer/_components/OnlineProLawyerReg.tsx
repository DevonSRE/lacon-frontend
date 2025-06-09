'use client'
import { useState, useRef, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Input from '@/components/form/input/InputField';
import { useFormState } from 'react-dom';
import { submitProBonoForm } from '@/features/probunoLawyers/server/action';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import { toast } from "sonner";
import InputField from '@/components/form/input/InputField';
import TextAreaField from '@/components/TextAreaField';
import { GetState } from '@/components/get-state';
import { ProBonoFormData, ProBonoFormDataMain } from '@/features/probunoLawyers/server/probunoTypes';
import { SubmitButton } from '@/components/submit-button';

export default function ProBonoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<ProBonoFormData>({
    first_name: '',
    last_name: '',
    state_of_practice: '',
    email: '',
    phone_number: '',
    alternate_number: '',
    state_bar_membership: '',
    name_of_law_firm_organization: '',
    law_firm_organization_address: '',
    most_contactable_call_no: '',
    experience_in_criminal_law: '',
    pro_bono_capacity: '',
    criminal_courts_preference: [],
    agree: false
  });
  const [selectedState, setSelectedState] = useState<string>("");

  const [state, formAction, isPending] = useActionState(submitProBonoForm, undefined);

  // Handle errors without clearing form
  useEffectAfterMount(() => {
    if (state && CLIENT_ERROR_STATUS.includes(state?.status)) {
      toast.error(state?.message, {
        description: typeof state?.errors === "string"
          ? state.errors
          : state?.errors
            ? Object.values(state.errors).flat().join(", ")
            : undefined,
      });

      if (state.formData) {
        setFormData(prev => ({
          ...prev,
          ...state.formData
        }));

        if (state.formData.state_of_practice) {
          setSelectedState(state.formData.state_of_practice);
        }
      }

    } else if (state?.success) {
      // Only reset form on successful submission
      setFormData({
        first_name: '',
        last_name: '',
        state_of_practice: '',
        email: '',
        phone_number: '',
        alternate_number: '',
        state_bar_membership: '',
        name_of_law_firm_organization: '',
        law_firm_organization_address: '',
        most_contactable_call_no: '',
        experience_in_criminal_law: '',
        pro_bono_capacity: '',
        criminal_courts_preference: [],
        agree: false
      });
      formRef.current?.reset();
    }
  }, [state]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && name === 'criminal_courts_preference') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        criminal_courts_preference: checked
          ? [...prev.criminal_courts_preference, value]
          : prev.criminal_courts_preference.filter(item => item !== value)
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const personalFields: { label: string; name: keyof ProBonoFormDataMain; type: 'input' | 'textarea' }[] = [
    { label: 'First Name', name: 'first_name', type: 'input' },
    { label: 'Last Name', name: 'last_name', type: 'input' },
    // { label: 'State of Practice', name: 'state_of_practice', type: 'input' },
    { label: 'Email Address', name: 'email', type: 'input' },
    { label: 'Mobile Phone Number', name: 'phone_number', type: 'input' },
    { label: 'Alternate Number', name: 'alternate_number', type: 'input' },
    { label: 'State Bar Membership', name: 'state_bar_membership', type: 'input' },
    { label: 'Name of Law Firm/Organization', name: 'name_of_law_firm_organization', type: 'textarea' },
    { label: 'Law Firm/Organization Address', name: 'law_firm_organization_address', type: 'textarea' },
    { label: 'Most Contactable Call No', name: 'most_contactable_call_no', type: 'input' }
  ];

  const experience_in_criminal_lawOptions = ['Below 2 years', '2-5 years', '5-10 years', 'Above 10 years'];
  const capacityOptions = ['1 case at a time', '2 cases at a time', '3-4 cases at a time', '5 or more cases at a time'];
  const courtOptions = ['Appellate Courts', 'High Courts', 'Magistrate Courts', 'Customary Court', 'Sharia Court', 'Area Court'];

  return (
    <div className='pb-32 space-y-10'>
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold text-center">Online Pro Bono Lawyer Registration Form</h1>
      </div>
      <hr />

      <form ref={formRef} action={formAction} className='pb-32 space-y-10'>
        {/* SECTION 1: Personal Details */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">SECTION 1: Personal Details and Office Info</h2>
          {personalFields.map(field => (
            <div key={field.name}>
              {field.type === 'input' ? (
                <InputField
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <>
                  <TextAreaField
                    label={field.label}
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={handleInputChange}
                    required
                  />
                </>
              )}
            </div>
          ))}

          <div className="space-y-6">
            <Label htmlFor="state-select">State of Practice</Label>
            <GetState
              value={selectedState}
              onValueChange={(val: string) => {
                setSelectedState(val);
                setFormData(prev => ({
                  ...prev,
                  state_of_practice: val
                }));
              }}
              placeholder="Select state"
            />
          </div>
        </section>

        {/* SECTION 2: experience_in_criminal_law */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">SECTION 2: experience_in_criminal_law in Criminal Law Practice</h2>
          {experience_in_criminal_lawOptions.map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="experience_in_criminal_law"
                value={option}
                checked={formData.experience_in_criminal_law === option}
                onChange={handleInputChange}
              />
              <span>{option}</span>
            </label>
          ))}
        </section>



        {/* SECTION 3: Case Capacity */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">SECTION 3: Pro Bono Case Handling Capacity</h2>
          {capacityOptions.map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="pro_bono_capacity"
                value={option}
                required
                checked={formData.pro_bono_capacity === option}
                onChange={handleInputChange}
              />
              <span>{option}</span>
            </label>
          ))}
        </section>

        {/* SECTION 4: Court Preference */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">SECTION 4: Criminal Matters Preference</h2>
          {courtOptions.map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="criminal_courts_preference"
                value={option}
                checked={formData.criminal_courts_preference.includes(option)}
                onChange={handleInputChange}
              />
              <span>{option}</span>
            </label>
          ))}
        </section>

        {/* SECTION 5: Agreement */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">SECTION 5: Acknowledgement & Undertaking</h2>
          <p className="text-sm">
            By submitting this form, I certify that the information provided is true and accurate. I undertake to render free legal services with the same professional standards as paid services, and understand that LACOM may withdraw my assigned cases if I fail to diligently perform my duties.
          </p>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleInputChange}
            />
            <span>I agree</span>
          </label>
        </section>

        {/* Error Display */}
        {state?.errors && (
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

        <SubmitButton
          value=" Submit Form"
          disabled={!formData.agree}
          loading={isPending}
          pendingValue="Processing..."
          className="w-2/3 h-12 bg-red-500 hover:bg-red-600 text-white font-xs py-3  rounded-none transition-colors duration-200 flex items-center justify-center"
        />
        {/* 
        <Button
          type="submit"
          variant="default"
          disabled={!formData.agree}
          className='w-full h-11 bg-[#EB4335]'
        >
         
        </Button> */}
      </form>
    </div>
  );
}
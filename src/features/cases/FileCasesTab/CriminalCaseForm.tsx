'use client'

import React, { Dispatch, SetStateAction, useActionState, useEffect, useState } from 'react'
import { ChevronLeft, CloudUpload, Upload } from 'lucide-react'
import SelectField from '@/components/SelectField'
import InputField from '@/components/form/input/InputField'
import TextAreaField from '@/components/TextAreaField'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { stateOptions } from '@/lib/types'
import useEffectAfterMount from '@/hooks/use-effect-after-mount'
import { caseDetailsSchema, FormDataCivilCase, legalAidFormSchema, personalInfoSchema } from '../../probunoLawyers/server/probonoSchema'
import { CLIENT_ERROR_STATUS } from '@/lib/constants'
import { toast } from 'sonner'
import { submitPublicCaseForm } from '../../probunoLawyers/server/action'
import CaseIntakeDialog from '../../probunoLawyers/components/CaseIntakeDialog'
import { useAction } from '@/context/ActionContext'
import { Label } from '@/components/ui/label'
import { GetState } from '@/components/get-state'

interface CivilCaseFormProps {
  currentStep?: number;
  setCurrentStep?: Dispatch<SetStateAction<number>>;
  handleCloseCaseType?: Dispatch<SetStateAction<boolean>>;
  isPublic: boolean;
  state_id?: string;

}

export default function CriminalCaseForm({ currentStep = 1, state_id, isPublic, setCurrentStep = () => { }, handleCloseCaseType = () => { } }: CivilCaseFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(submitPublicCaseForm, undefined);
  const { selectedStateId, setIsOpen } = useAction();
  const [selectedState, setSelectedState] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (selectedStateId === "") {
      setIsOpen(true);
    }
  }, [selectedStateId]);
  useEffectAfterMount(() => {
    if (state && CLIENT_ERROR_STATUS.includes(state?.status)) {
      toast.error(
        typeof state?.message === "string" ? state.message : "Something went wrong",
        {
          description: typeof state?.errors === "string"
            ? state.errors
            : state?.errors
              ? Object.values(state.errors).flat().join(", ")
              : undefined,
        }
      );

    } else if (state && state.status === 200) {
      setCurrentStep(1);
      setOpen(true);
    }
  }, [state]);


  const [formData, setFormData] = useState<FormDataCivilCase>({
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    permanent_address: '',
    age: 0,
    phone_number: '',
    marital_status: '',
    email: '',
    state_of_origin: '',
    occupation: '',
    disability_proof: null,
    disability_status: '',
    complaint: '',
    average_income: '',
    offence: '',
    legal_aid_reason: '',
    number_of_dependants: '',
    client_location: '',
    registration_number: '',
    case_number: '',
    court_of_hearing: '',
    case_status: '',
    defendant_name: '',
    defendant_address: '',
    defendant_phone_number: '',
    court_location: '',
    date_of_admission: '',
    bail_status: '',
    court_of_trial: '',
    prosecuting_agency: ''
  })

  const handleSelectChange = (value: string, name: keyof FormDataCivilCase) => {
    console.log('Select changed:', name, value); // Debug log
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  const updateField = (field: keyof FormDataCivilCase, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      // toast.error(errors[field]);
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number) => {
    try {
      if (step === 1) {
        personalInfoSchema.parse(formData);
      } else if (step === 2) {
        legalAidFormSchema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error: any) {
      console.log('Validation error:', error);

      if (error.name === 'ZodError') {
        const formattedErrors: Record<string, string[]> = {};

        error.errors.forEach((err: any) => {
          const path = err.path.join('.');
          if (!formattedErrors[path]) {
            formattedErrors[path] = [];
          }
          formattedErrors[path].push(err.message);
        });

        // Convert string[] to string for each error
        const singleStringErrors: Record<string, string> = {};
        Object.entries(formattedErrors).forEach(([key, messages]) => {
          singleStringErrors[key] = messages.join(', ');
        });

        setErrors(singleStringErrors);
      } else {
        setErrors({});
      }

      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 2) {
        if (currentStep === 1) {
          console.log(formData.disability_status);
          if (formData.disability_status === 'yes' && !formData.disability_proof) {
            setErrors(prev => ({
              ...prev,
              disability_proof: 'Please upload proof of disability.'
            }));
            return;
          }
          setCurrentStep(currentStep + 1);
        }
        setCurrentStep(currentStep + 1);
      } else {
        const fd = new FormData();
        fd.append("case_type", "CRIMINAL CASE");
        if (isPublic) {
          fd.append("state_id", selectedStateId);
        } else {
          if (!isPublic && state_id != "") {
            fd.append("state_id", state_id!);
          } else {
            fd.append("state_id", selectedState!);
          }
        }
        fd.append("isPublic", isPublic ? "true" : "false");
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            fd.append(key, value instanceof File ? value : String(value));
          }
        });
        formAction(fd);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setFileError("No file selected.");
      updateField("disability_proof", null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Please upload a valid image file.");
      updateField("disability_proof", null);
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setFileError("File size exceeds 5MB limit.");
      updateField("disability_proof", null);
      return;
    }

    // ✅ All good
    setFileError("");
    updateField("disability_proof", file);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back();
    }
  }


  return (
    <>
      <CaseIntakeDialog
        open={open}
        onOpenChange={setOpen}
        handleCloseCaseType={handleCloseCaseType}
        isHome={isPublic ? true : false}
      />
      <div className="mx-auto  bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">Filing A Criminal Case</h1>
          </div>
          <div className="flex sm:ml-auto space-x-2 justify-start sm:justify-end">
            <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm font-medium bg-black text-white  text-gray-600'}`}>
              1
            </div>
            <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm ${currentStep === 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
          </div>
        </div>
        <form action={handleNext}>
          <input type="hidden" name="case_type" value="CRIMINAL CASE" />
          <input type="hidden" name="isPublic" value={isPublic ? "true" : "false"} />
          {(!isPublic && state_id != "") ? (
            <input type="hidden" name="state_id" value={state_id} />
          ) :
            <input type="hidden" name="state_id" value={selectedState} />
          }

          {/* Form Content */}
          <div className="mb-10">
            <div className="space-y-6">
              {currentStep === 1 && (
                <>
                  {(!isPublic && state_id === "") && (
                    <div className="space-y-6 my-4 mt-5">
                      <Label htmlFor="state-select">Where are you filing from?</Label>
                      <GetState
                        value={selectedState}
                        onValueChange={(val: string) => setSelectedState(val)}
                        placeholder="Select your state"
                        onLoadingChange={(loading) => setLoading(loading)}
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <InputField
                        label="First Name"
                        required
                        name='first_name'
                        type="text"
                        placeholder="Enter First Name"
                        value={formData.first_name}
                        onChange={(e) => updateField('first_name', e.target.value)}
                        className={` ${errors.first_name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      />
                      {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                    </div>

                    <div>
                      <InputField
                        label="Middle Name"
                        name="middle_name"
                        type="text"
                        placeholder="Enter Middle Name"
                        value={formData.middle_name}
                        onChange={(e) => updateField('middle_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <InputField
                        label="Last Name"
                        required
                        name="last_name"
                        type="text"
                        placeholder="Enter Last Name"
                        value={formData.last_name}
                        onChange={(e) => updateField('last_name', e.target.value)}
                        className={` ${errors.last_name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      />
                      {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <InputField
                      type="email"
                      name="email"
                      label=' Email Address (Optional)'
                      placeholder="Enter Email Address"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />


                    <div>
                      <InputField
                        type="number"
                        label='Age'
                        name='age'
                        min='0'
                        required
                        placeholder="Enter Age"
                        value={formData.age}
                        onChange={(e) => updateField('age', e.target.value)}
                        className={` ${errors.age ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      />
                      {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                    </div>

                    <div>
                      <InputField
                        type="tel"
                        label='Phone Number'
                        name="phone_number"
                        required
                        placeholder="0800XXXXXXX"
                        value={formData.phone_number}
                        onChange={(e) => updateField('phone_number', e.target.value)}
                        className={` ${errors.phone_number ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      />
                      {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField
                      name="gender"
                      label="Gender"
                      placeholder="Select Gender"
                      options={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' }
                      ]}
                      required
                      value={formData.gender} // Add value prop
                      onValueChange={(value) => handleSelectChange(value, 'gender')}
                      error={!!errors.gender}
                      errorMessage={errors.gender}
                    />

                    <SelectField
                      name="marital_status"
                      label="Marital Status"
                      placeholder="Marital Status"
                      options={[
                        { value: 'Single', label: 'Single' },
                        { value: 'Married', label: 'Married' },
                        { value: 'Divorced', label: 'Divorced' },
                        { value: 'Widowed', label: 'Widowed' }
                      ]}
                      required
                      value={formData.marital_status} // Add value prop
                      onValueChange={(value) => handleSelectChange(value, 'marital_status')}
                      error={!!errors.marital_status}
                      errorMessage={errors.marital_status}
                    />

                    <SelectField
                      name="state_of_origin"
                      label="State Of Origin"
                      placeholder="State of Origin"
                      options={stateOptions}
                      required
                      value={formData.state_of_origin} // Add value prop
                      onValueChange={(value: string) => handleSelectChange(value, 'state_of_origin')}
                      error={!!errors.state_of_origin}
                      errorMessage={errors.state_of_origin}
                    />

                  </div>


                  <div className="mb-6">
                    <TextAreaField
                      name="permanent_address" // Fixed: was "offence"
                      label="Permanent Address"
                      required
                      placeholder="Enter your permanent address"
                      value={formData.permanent_address}
                      onChange={(e) => updateField('permanent_address', e.target.value)}
                      error={errors.permanent_address} // Fixed: was errors.offence
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="mb-6">
                      <InputField
                        type="text"
                        name="occupation"
                        label='Occupation'
                        required
                        placeholder="Trader/Chef/Driver"
                        value={formData.occupation}
                        onChange={(e) => updateField('occupation', e.target.value)}
                        className={` ${errors.occupation ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      />
                      {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
                    </div>

                    <SelectField
                      name="disability_status"
                      label="Disability (If any)"
                      placeholder="If yes, upload picture proof"
                      options={[
                        { value: 'yes', label: 'Yes' },
                        { value: 'no', label: 'No' },
                      ]}
                      value={formData.disability_status}
                      onValueChange={(value) => handleSelectChange(value, 'disability_status')}
                      error={!!errors.disability_status}
                      errorMessage={errors.disability_status}
                    />
                  </div>


                  {formData.disability_status === "yes" && (
                    <div className="mb-6">
                      <Label className="block mb-2">Disability (if any)</Label>
                      <div className={`rounded-lg p-6 text-center border-2 ${errors.disability_proof ? "border-red-500" : "border-gray-300"}`}>
                        <CloudUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm mb-2">(If yes, upload picture proof)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          name="disability_proof"
                          id="disability-upload"
                        />
                        <label
                          htmlFor="disability-upload"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                        >
                          Choose File
                        </label>

                        {formData.disability_proof && !fileError && (
                          <p className="text-sm text-green-600 mt-2">{formData.disability_proof.name}</p>
                        )}

                        {fileError && (
                          <p className="text-sm text-red-500 mt-2">{fileError}</p>
                        )}
                      </div>
                      {errors.disability_proof && (
                        <p className={`mt-1.5 text-xs ${errors.disability_proof ? "text-red-500" : errors.disability_proof ? "text-success-500" : "text-gray-500"}`}>
                          Please Upload Picture Proof of Disability
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
              {currentStep === 2 && (
                <div className="mt-4 space-y-6">
                  <TextAreaField
                    name="offence"
                    label="Offence"
                    required
                    placeholder="Type the Offence Here"
                    value={formData.offence}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('offence', e.target.value)}
                    error={errors.offence}
                  />

                  <InputField
                    label="Client Location"
                    required
                    type="text"
                    placeholder="Type Location Here"
                    value={formData.client_location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('client_location', e.target.value)}
                    className={`${errors.client_location ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Date of Admission in custody"
                      type="date"
                      value={formData.date_of_admission}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('date_of_admission', e.target.value)}
                      className="border-gray-300"
                    />

                    <InputField
                      label="Average income per month"
                      type="number"
                      value={formData.average_income}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('average_income', e.target.value)}
                      className="border-gray-300"
                    />
                  </div>

                  <TextAreaField
                    name="legal_aid_reason"
                    label="Reasons for applying for legal aid"
                    required
                    placeholder="Type reason here"
                    value={formData.legal_aid_reason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('legal_aid_reason', e.target.value)}
                    error={errors?.legal_aid_reason}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                    <InputField
                      label="Case Status"
                      type="text"
                      value={formData.case_status}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('case_status', e.target.value)}
                      className="border-gray-300"
                    />

                    <InputField
                      label="Court /Case No (If this exist, add it)"
                      type="text"
                      value={formData.court_location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('court_location', e.target.value)}
                      className="border-gray-300"
                    />

                    <InputField
                      label="Bail status, (If this exist, add it)"
                      type="text"
                      value={formData.bail_status}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('bail_status', e.target.value)}
                      className="border-gray-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Court of Trial (If this exist, add it)"
                      type="text"
                      value={formData.court_of_trial}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('court_of_trial', e.target.value)}
                      className="border-gray-300"
                    />

                    <InputField
                      label="Prosecuting Agency"
                      required
                      type="text"
                      value={formData.prosecuting_agency}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('prosecuting_agency', e.target.value)}
                      className={`${errors.prosecuting_agency ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    />
                  </div>
                </div>
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

            {/* {errors && Object.keys(errors).length > 0 && (
              <div className="text-red-500 bg-red-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Please fix the following errors:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([key, val]) => (
                    <li key={key}>
                      {key.replace(/_/g, ' ')}: {val}
                    </li>
                  ))}
                </ul>
              </div>
            )} */}

            {/* Navigation Buttons */}
            {/* Navigation Buttons */}
            <div className="grid grid-cols-2 mt-6 justify-end  gap-4 mb-6">
              {currentStep > 1 && (
                <Button onClick={handleBack} className="h-11  w-full bg-black text-white hover:bg-gray-800 transition-colors font-medium">
                  Back
                </Button>
              )}
              <Button type="submit" disabled={isPending} className="h-11   w-full bg-red-600 text-white hover:bg-red-700 transition-colors font-medium">
                {isPending ? 'Submitting...' : currentStep === 2 ? 'Submit Case' : 'Next'}
              </Button>
            </div>


          </div>
        </form>

      </div>
    </>

  )
}
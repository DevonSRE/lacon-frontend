'use client'

import React, { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import SelectField from '@/components/SelectField'
import InputField from '@/components/form/input/InputField'
import TextAreaField from '@/components/TextAreaField'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'


interface FormData {
  // Page 1 fields
  caseType: string
  firstName: string
  middleName: string
  lastName: string
  gender: string
  permanentAddress: string
  age: string
  phoneNumber: string
  maritalStatus: string
  emailAddress: string
  stateOfOrigin: string
  occupation: string
  disability: string

  // Page 2 fields
  offence: string
  clientLocation: string
  dateOfAdmission: string
  averageIncomePerMonth: string
  reasonForLegalAid: string
  caseStatus: string
  courtLocation: string
  bailStatus: string
  courtOfTrial: string
  prosecutingAgency: string
}

interface FormErrors {
  [key: string]: string
}

export default function CriminalCaseForm() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    caseType: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    permanentAddress: '',
    age: '',
    phoneNumber: '',
    maritalStatus: '',
    emailAddress: '',
    stateOfOrigin: '',
    occupation: '',
    disability: '',
    offence: '',
    clientLocation: '',
    dateOfAdmission: '',
    averageIncomePerMonth: '',
    reasonForLegalAid: '',
    caseStatus: '',
    courtLocation: '',
    bailStatus: '',
    courtOfTrial: '',
    prosecutingAgency: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    updateField(name as keyof FormData, value)
  }

  const validateStep1 = () => {
    const newErrors: FormErrors = {}

    if (!formData.caseType) newErrors.caseType = 'Case type is required'
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.permanentAddress) newErrors.permanentAddress = 'Permanent address is required'
    if (!formData.age) newErrors.age = 'Age is required'
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required'
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required'
    if (!formData.stateOfOrigin) newErrors.stateOfOrigin = 'State of origin is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: FormErrors = {}

    if (!formData.offence) newErrors.offence = 'Offence description is required'
    if (!formData.clientLocation) newErrors.clientLocation = 'Client location is required'
    if (!formData.reasonForLegalAid) newErrors.reasonForLegalAid = 'Reason for legal aid is required'
    if (!formData.prosecutingAgency) newErrors.prosecutingAgency = 'Prosecuting agency is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      // Handle form submission
      console.log('Form submitted:', formData)
      alert('Form submitted successfully!')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back();
    }
  }



  return (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="p-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Filing A Criminal Case</h1>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center text-sm font-medium">
            {currentStep}
          </div>
          <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded flex items-center justify-center text-sm">
            2
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="mb-10">
        <div className="p-6 space-y-6">
          {currentStep === 1 && (
            <>
              <SelectField
                name="caseType"
                label="Case Type"
                placeholder="Select Case Type"
                options={[
                  { value: 'Criminal Case', label: 'Criminal Case' },
                  // { value: 'Civil Case', label: 'Civil Case' },
                  // { value: 'Family Case', label: 'Family Case' }
                ]}
                required
                formData={formData}
                handleSelectChange={handleSelectChange}
                errors={errors}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Name of client"
                  required
                  type="text"
                  placeholder="Enter Email Address"
                  value={formData.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('firstName', e.target.value)}
                  className={`${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />

                <InputField
                  label="Middle Name"
                  type="text"
                  placeholder="Enter Email Address"
                  value={formData.middleName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('middleName', e.target.value)}
                  className="border-gray-300"
                />

                <InputField
                  label="Last Name"
                  required
                  type="text"
                  placeholder="Enter Email Address"
                  value={formData.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('lastName', e.target.value)}
                  className={`${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
              </div>

              <SelectField
                name="gender"
                label="Gender"
                placeholder="Select Gender"
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' }
                ]}
                required
                formData={formData}
                handleSelectChange={handleSelectChange}
                errors={errors}
              />

              <TextAreaField
                name="permanentAddress"
                label="Permanent Address"
                required
                placeholder="Input Current Address"
                value={formData.permanentAddress}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('permanentAddress', e.target.value)}
                error={errors.permanentAddress}
              />

              <InputField
                label="Age"
                required
                type="number"
                placeholder="Input Current Age"
                value={formData.age}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('age', e.target.value)}
                className={`${errors.age ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              />

              <InputField
                label="Phone Number"
                required
                type="tel"
                placeholder="08XXXXXXXXX"
                value={formData.phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('phoneNumber', e.target.value)}
                className={`${errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              />

              <SelectField
                name="maritalStatus"
                label="Marital Status"
                placeholder="Input Status Here"
                options={[
                  { value: 'Single', label: 'Single' },
                  { value: 'Married', label: 'Married' },
                  { value: 'Divorced', label: 'Divorced' },
                  { value: 'Widowed', label: 'Widowed' }
                ]}
                required
                formData={formData}
                handleSelectChange={handleSelectChange}
                errors={errors}
              />

              <InputField
                label="Email Address(Optional)"
                type="email"
                placeholder="Input Status Here"
                value={formData.emailAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('emailAddress', e.target.value)}
                className="border-gray-300"
              />

              <SelectField
                name="stateOfOrigin"
                label="State of Origin"
                placeholder="Input Status Here"
                options={[
                  { value: 'Abia', label: 'Abia' },
                  { value: 'Adamawa', label: 'Adamawa' },
                  { value: 'Akwa Ibom', label: 'Akwa Ibom' },
                  { value: 'Anambra', label: 'Anambra' },
                  { value: 'Bauchi', label: 'Bauchi' },
                  { value: 'Bayelsa', label: 'Bayelsa' },
                  { value: 'Benue', label: 'Benue' },
                  { value: 'Borno', label: 'Borno' },
                  { value: 'Cross River', label: 'Cross River' },
                  { value: 'Delta', label: 'Delta' },
                  { value: 'Ebonyi', label: 'Ebonyi' },
                  { value: 'Edo', label: 'Edo' },
                  { value: 'Ekiti', label: 'Ekiti' },
                  { value: 'Enugu', label: 'Enugu' },
                  { value: 'FCT', label: 'Federal Capital Territory' },
                  { value: 'Gombe', label: 'Gombe' },
                  { value: 'Imo', label: 'Imo' },
                  { value: 'Jigawa', label: 'Jigawa' },
                  { value: 'Kaduna', label: 'Kaduna' },
                  { value: 'Kano', label: 'Kano' },
                  { value: 'Katsina', label: 'Katsina' },
                  { value: 'Kebbi', label: 'Kebbi' },
                  { value: 'Kogi', label: 'Kogi' },
                  { value: 'Kwara', label: 'Kwara' },
                  { value: 'Lagos', label: 'Lagos' },
                  { value: 'Nasarawa', label: 'Nasarawa' },
                  { value: 'Niger', label: 'Niger' },
                  { value: 'Ogun', label: 'Ogun' },
                  { value: 'Ondo', label: 'Ondo' },
                  { value: 'Osun', label: 'Osun' },
                  { value: 'Oyo', label: 'Oyo' },
                  { value: 'Plateau', label: 'Plateau' },
                  { value: 'Rivers', label: 'Rivers' },
                  { value: 'Sokoto', label: 'Sokoto' },
                  { value: 'Taraba', label: 'Taraba' },
                  { value: 'Yobe', label: 'Yobe' },
                  { value: 'Zamfara', label: 'Zamfara' }
                ]}
                required
                formData={formData}
                handleSelectChange={handleSelectChange}
                errors={errors}
              />

              <InputField
                label="Occupation"
                type="text"
                placeholder="State Occupation"
                value={formData.occupation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('occupation', e.target.value)}
                className="border-gray-300"
              />

              <SelectField
                name="disability"
                label="Disability (If any)"
                placeholder="If yes, upload picture proof)"
                options={[
                  { value: 'None', label: 'None' },
                  { value: 'Physical', label: 'Physical Disability' },
                  { value: 'Visual', label: 'Visual Impairment' },
                  { value: 'Hearing', label: 'Hearing Impairment' },
                  { value: 'Intellectual', label: 'Intellectual Disability' },
                  { value: 'Other', label: 'Other' }
                ]}
                formData={formData}
                handleSelectChange={handleSelectChange}
                errors={errors}
              />

              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">(If yes, upload picture here)</p>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
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
                value={formData.clientLocation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('clientLocation', e.target.value)}
                className={`${errors.clientLocation ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Date of Admission in custody"
                  type="date"
                  value={formData.dateOfAdmission}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('dateOfAdmission', e.target.value)}
                  className="border-gray-300"
                />

                <InputField
                  label="Average income per month"
                  type="number"
                  value={formData.averageIncomePerMonth}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('averageIncomePerMonth', e.target.value)}
                  className="border-gray-300"
                />
              </div>

              <TextAreaField
                name="reasonForLegalAid"
                label="Reasons for applying for legal aid"
                required
                placeholder="Type reason here"
                value={formData.reasonForLegalAid}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('reasonForLegalAid', e.target.value)}
                error={errors.reasonForLegalAid}
              />

              <InputField
                label="Case Status"
                type="text"
                value={formData.caseStatus}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('caseStatus', e.target.value)}
                className="border-gray-300"
              />

              <InputField
                label="Court and/Case No (If this exist, add it)"
                type="text"
                value={formData.courtLocation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('courtLocation', e.target.value)}
                className="border-gray-300"
              />

              <InputField
                label="Bail status, (If this exist, add it)"
                type="text"
                value={formData.bailStatus}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('bailStatus', e.target.value)}
                className="border-gray-300"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Court of Trial (If this exist, add it)"
                  type="text"
                  value={formData.courtOfTrial}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('courtOfTrial', e.target.value)}
                  className="border-gray-300"
                />

                <InputField
                  label="Prosecuting Agency"
                  required
                  type="text"
                  value={formData.prosecutingAgency}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('prosecutingAgency', e.target.value)}
                  className={`${errors.prosecutingAgency ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t pb-24">
          <div className="flex space-x-4">
            {currentStep > 1 && (
              <Button
                onClick={handleBack}
                className="flex-1 py-3 bg-black text-white  hover:bg-gray-800 transition-colors"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 py-3 bg-red-600 text-white  hover:bg-red-700 transition-colors"
            >
              {currentStep === 2 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
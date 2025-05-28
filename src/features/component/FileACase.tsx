
import React, { useState, ChangeEvent } from 'react';
import { ChevronLeft, UploadCloud } from 'lucide-react';
import InputField from '@/components/form/input/InputField';

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area";
import Input from "@/components/form/input/InputField";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


interface FormData {
    // Step 1 fields
    caseType: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    permanentAddress: string;
    age: string;
    phoneNumber: string;
    maritalStatus: string;
    email: string;
    stateOfOrigin: string;
    occupation: string;
    disability: string;
    disabilityProof: File | null;

    // Step 2 fields
    offence: string;
    clientLocation: string;
    daysInDetention: string;
    counsel: string;
    counselDesignation: string;
    counselFirm: string;
    legalService: string;
    caseStatus: string;
    bailStatus: string;
    dateTrialEnded: string;
    caseOutcome: string;
}

interface SelectOption {
    value: string;
    label: string;
}

interface InputFieldProps {
    name: keyof FormData;
    label: string;
    placeholder: string;
    required?: boolean;
    type?: string;
    [key: string]: any;
}

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps {
    name: keyof FormData;
    label: string;
    placeholder: string;
    options: Option[];
    required?: boolean;
    formData: FormData;
    handleSelectChange: (name: keyof FormData, value: string) => void;
    errors: Record<string, string>;
}

interface TextAreaFieldProps {
    name: keyof FormData;
    label: string;
    placeholder: string;
    required?: boolean;
}

const SheetDemo: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        // Step 1 fields
        caseType: 'PDSS',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        permanentAddress: '',
        age: '',
        phoneNumber: '',
        maritalStatus: '',
        email: '',
        stateOfOrigin: '',
        occupation: '',
        disability: '',
        disabilityProof: null,

        // Step 2 fields
        offence: '',
        clientLocation: '',
        daysInDetention: '',
        counsel: '',
        counselDesignation: '',
        counselFirm: '',
        legalService: '',
        caseStatus: '',
        bailStatus: '',
        dateTrialEnded: '',
        caseOutcome: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' && e.target instanceof HTMLInputElement ? e.target.files?.[0] : value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (name: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user selects
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep1 = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        const requiredFields: (keyof FormData)[] = [
            'firstName', 'lastName', 'gender', 'permanentAddress',
            'age', 'phoneNumber', 'maritalStatus', 'stateOfOrigin', 'disability'
        ];

        requiredFields.forEach(field => {
            if (!formData[field] || (formData[field] as string).trim() === '') {
                newErrors[field] = 'This field is required';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            const fields = Object.keys(newErrors).join(', ');
            toast.error(`Please fill in the following field(s): ${fields}.`);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const validateStep2 = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        const requiredFields: (keyof FormData)[] = [
            'offence', 'clientLocation', 'daysInDetention',
            'counsel', 'counselDesignation', 'bailStatus', 'dateTrialEnded'
        ];

        requiredFields.forEach(field => {
            if (!formData[field] || (formData[field] as string).trim() === '') {
                newErrors[field] = 'This field is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (validateStep1()) {
                setCurrentStep(2);
            }
        } else if (currentStep === 2) {
            if (validateStep2()) {
                handleSubmit();
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert('PDSS Case filed successfully!');
    };


    const SelectField: React.FC<SelectFieldProps> = ({
        name,
        label,
        placeholder,
        options,
        required = false,
        formData,
        handleSelectChange,
        errors,
    }) => (
        <div className="space-y-1">
            <Label>
                {label} {required && <span className="text-red-500 text-xs">*</span>}
            </Label>
            <Select
                value={typeof formData[name] === "string" ? formData[name] : ""}
                onValueChange={(value) => handleSelectChange(name, value)}
            >
                <SelectTrigger className={`w-full h-11 ${errors[name] ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors[name] && <p className="text-red-500 text-xs">{errors[name]}</p>}
        </div>
    );
    const TextAreaField: React.FC<TextAreaFieldProps> = ({ name, label, placeholder, required = false }) => (
        <div className="space-y-1">
            <Label className="">
                {label} {required && <span className="text-red-500 text-xs">*</span>}
            </Label>
            <textarea
                name={name}
                placeholder={placeholder}
                value={formData[name] as string || ''}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
            />
            {errors[name] && <p className="text-red-500 text-xs">{errors[name]}</p>}
        </div>
    );

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Open</Button>
            </SheetTrigger>
            <SheetContent className="min-w-2xl max-w-full">
                <ScrollArea className="h-screen w-full rounded-md border p-4">
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => currentStep > 1 ? handleBack() : null}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h2 className="text-xl font-bold">Filing A PDSS Case</h2>
                            </div>
                            <div className="flex gap-2">
                                <div className={`p-1 w-6 text-center text-xs rounded-sm ${currentStep === 1 ? 'bg-black text-white' : 'bg-white text-black border border-black'
                                    }`}>1</div>
                                <div className={`p-1 w-6 text-center text-xs rounded-sm ${currentStep === 2 ? 'bg-black text-white' : 'bg-white text-black border border-black'
                                    }`}>2</div>
                            </div>
                        </div>

                        {/* Step 1 */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <SelectField
                                    name="caseType"
                                    label="Case Type"
                                    placeholder="PDSS"
                                    options={[{ value: 'PDSS', label: 'PDSS' }]}
                                    formData={formData}
                                    handleSelectChange={handleSelectChange}
                                    errors={errors}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <InputField name="firstName" label="First Name" placeholder="First Name" value={formData.firstName || ""}
                                        onChange={handleChange}
                                        required
                                        error={!!errors.firstName}
                                        hint={errors.firstName} />

                                    <InputField name="middleName" label="Middle Name" placeholder="Middle Name" value={formData.middleName || ""}
                                        onChange={handleChange}
                                        required
                                        error={!!errors.middleName}
                                        hint={errors.middleName} />
                                    <InputField name="lastName" label="Last Name" placeholder="Last Name" required value={formData.lastName || ""}
                                        onChange={handleChange}
                                        error={!!errors.lastName}
                                        hint={errors.lastName} />
                                </div>

                                <SelectField
                                    name="gender"
                                    label="Gender"
                                    placeholder="Select Gender"
                                    options={[
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' }
                                    ]}
                                    required
                                    formData={formData}
                                    handleSelectChange={handleSelectChange}
                                    errors={errors}
                                />

                                <InputField name="permanentAddress" label="Permanent Address" placeholder="Permanent Address"
                                    required
                                    value={formData.permanentAddress || ""}
                                    onChange={handleChange}
                                    error={!!errors.permanentAddress}
                                    hint={errors.permanentAddress} />
                                <InputField name="age" label="Age" placeholder="Age"
                                    required
                                    value={formData.age || ""}
                                    onChange={handleChange}
                                    error={!!errors.age}
                                    hint={errors.age} />
                                <InputField name="phoneNumber" label="Phone Number" placeholder="080XXXXXXXX"
                                    required
                                    value={formData.phoneNumber || ""}
                                    onChange={handleChange}
                                    error={!!errors.phoneNumber}
                                    hint={errors.phoneNumber} />

                                <SelectField
                                    name="maritalStatus"
                                    label="Marital Status"
                                    placeholder="Marital Status"
                                    options={[
                                        { value: 'Single', label: 'Single' },
                                        { value: 'Married', label: 'Married' }
                                    ]}
                                    required
                                    formData={formData}
                                    handleSelectChange={handleSelectChange}
                                    errors={errors}
                                />

                                <InputField name="email" label="Email Address (optional)" placeholder="Email Address (Optional)" type="email"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    hint={errors.email} />

                                <SelectField
                                    name="stateOfOrigin"
                                    label="State Of Origin"
                                    placeholder="State of Origin"
                                    options={[
                                        { value: 'Lagos', label: 'Lagos' },
                                        { value: 'Abuja', label: 'Abuja' },
                                        { value: 'Kaduna', label: 'Kaduna' }
                                    ]}
                                    required
                                    formData={formData}
                                    handleSelectChange={handleSelectChange}
                                    errors={errors}

                                />

                                <InputField name="occupation" label="Occupation" placeholder="Occupation (e.g., Trader/Chef/Driver)"
                                    value={formData.occupation || ""}
                                    onChange={handleChange}
                                    error={!!errors.occupation}
                                    hint={errors.occupation} />

                                <SelectField
                                    name="disability"
                                    label="Disability"
                                    placeholder="Disability (If any)"
                                    options={[
                                        { value: 'Yes', label: 'Yes' },
                                        { value: 'No', label: 'No' }
                                    ]}
                                    required
                                    formData={formData}
                                    handleSelectChange={handleSelectChange}
                                    errors={errors}
                                />

                                {formData.disability === 'Yes' && (
                                    <div className="border-2 border-dashed border-gray-300 p-4 flex flex-col items-center space-y-2">
                                        <UploadCloud className="w-8 h-8 text-gray-500" />
                                        <p className="text-gray-500 text-sm">(If yes, upload picture here)</p>
                                        <input
                                            type="file"
                                            name="disabilityProof"
                                            onChange={handleChange}
                                            className="text-sm"
                                            accept="image/*"
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2 */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <TextAreaField
                                    name="offence"
                                    label="Offence"
                                    placeholder="Type the Offence Here"
                                    required
                                />

                                <InputField
                                    name="clientLocation"
                                    label="Client Location"
                                    placeholder="type location here"
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        name="daysInDetention"
                                        label="Days in Detention"
                                        placeholder="0"
                                        type="number"
                                        required
                                    />
                                    <InputField
                                        name="counsel"
                                        label="Counsel/Paralegal"
                                        placeholder="----------------------"
                                        required
                                    />
                                </div>

                                <InputField
                                    name="counselDesignation"
                                    label="Counsel Designation"
                                    placeholder="type designation here"
                                    required
                                />

                                <InputField
                                    name="counselFirm"
                                    label="Name of Counsel/Paralegal Office or Firm, Organisation ID"
                                    placeholder="----------------------"
                                />

                                <InputField
                                    name="legalService"
                                    label="Nature of legal service provided"
                                    placeholder="----------------------"
                                />

                                <InputField
                                    name="caseStatus"
                                    label="Case status"
                                    placeholder="----------------------"
                                />

                                <div className="grid grid-cols-3 gap-4">
                                    <InputField
                                        name="bailStatus"
                                        label="Bail status"
                                        placeholder="----------------------"
                                        required
                                    />
                                    <InputField
                                        name="dateTrialEnded"
                                        label="Date trial ended"
                                        placeholder="----------------------"
                                        type="date"
                                        required
                                    />
                                    <InputField
                                        name="caseOutcome"
                                        label="Case Outcome"
                                        placeholder="----------------------"
                                    />
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button
                                        onClick={handleBack}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default SheetDemo;

// import { Button } from "@/components/ui/button"
// import React, { useState } from 'react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { UploadCloud } from 'lucide-react';
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { ScrollArea } from "@/components/ui/scroll-area";
// import Input from "@/components/form/input/InputField";
// import { Label } from "@/components/ui/label";

// export function SheetDemo() {
//     const [formData, setFormData] = useState({});

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSelectChange = (name: string, value: string) => {
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = () => {
//         console.log(formData);
//     };
//     return (
//         <Sheet>
//             <SheetTrigger asChild>
//                 <Button variant="outline">Open</Button>
//             </SheetTrigger>
//             <SheetContent className="min-w-2xl max-w-full">
//                 <ScrollArea className="h-screen w-full rounded-md border p-4">
//                     <div className="max-w-2xl mx-auto p-4 pt-10 space-y-4">
//                         <div className="flex justify-between">
//                             <h2 className="text-xl font-bold">Filing A PDSS Case</h2>
//                             <div className="flex gap-2">
//                                 <div className="bg-black text-white p-1 w-6 text-center text-xs rounded-sm">1</div>
//                                 <div className="bg-white text-black p-1 w-6 text-center text-xs rounded-sm border border-black">2</div>
//                             </div>
//                         </div>
//                         <div className="">
//                             <Label>Case Type</Label>
//                             <div className="relative">
//                                 <Select onValueChange={(value) => handleSelectChange('caseType', value)}>
//                                     <SelectTrigger className="w-full">
//                                         <SelectValue placeholder="PDSS" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="PDSS">PDSS</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <Input name="firstName" label="First Name" placeholder="First Name" required onChange={handleChange} />
//                             <Input name="middleName" label="Middle Name" placeholder="Middle Name" onChange={handleChange} />
//                             <Input name="lastName" label="Last Name" placeholder="Last Name" required onChange={handleChange} />
//                         </div>

//                         <div className="">
//                             <Label>Gender <span className="text-red-500 text-xs">*</span></Label>
//                             <div className="relative">
//                                 <Select onValueChange={(value) => handleSelectChange('gender', value)}>
//                                     <SelectTrigger className="w-full">
//                                         <SelectValue placeholder="Select Gender" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="Male">Male</SelectItem>
//                                         <SelectItem value="Female">Female</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>

//                         <Input name="permanentAddress" label="Permanent Address" placeholder="Permanent Address" required onChange={handleChange} />
//                         <Input name="age" placeholder="Age" label="Age" required onChange={handleChange} />
//                         <Input name="phoneNumber" placeholder="080XXXXXXXX" label="Phone Number" required onChange={handleChange} />

//                         <div className="">
//                             <Label>Marital Status<span className="text-red-500 text-xs">*</span></Label>
//                             <div className="relative">
//                                 <Select onValueChange={(value) => handleSelectChange('maritalStatus', value)}>
//                                     <SelectTrigger className="w-full">
//                                         <SelectValue placeholder="Marital Status" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="Single">Single</SelectItem>
//                                         <SelectItem value="Married">Married</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>

//                         <Input name="email" label="Email Address (optional)" placeholder="Email Address (Optional)" onChange={handleChange} />

//                         <div className="">
//                             <Label>State Of Origin<span className="text-red-500 text-xs">*</span></Label>
//                             <div className="relative">
//                                 <Select onValueChange={(value) => handleSelectChange('stateOfOrigin', value)}>
//                                     <SelectTrigger className="w-full">
//                                         <SelectValue placeholder="State of Origin" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="Lagos">Lagos</SelectItem>
//                                         <SelectItem value="Abuja">Abuja</SelectItem>
//                                         <SelectItem value="Kaduna">Kaduna</SelectItem>
//                                         {/* Add more states as needed */}
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>

//                         <Input name="occupation" label="Occupation" placeholder="Occupation (e.g., Trader/Chef/Driver)" onChange={handleChange} />


//                         <div className="">
//                             <Label>Disability<span className="text-red-500 text-xs">*</span></Label>
//                             <div className="relative">
//                                 <Select onValueChange={(value) => handleSelectChange('disability', value)}>
//                                     <SelectTrigger className="w-full">
//                                         <SelectValue placeholder="Disability (If any)" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="Yes">Yes</SelectItem>
//                                         <SelectItem value="No">No</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>

//                         <div className="border-2 border-dashed border-gray-300 p-4 flex flex-col items-center">
//                             <UploadCloud className="w-8 h-8 text-gray-500" />
//                             <p className="text-gray-500">(If yes, upload picture here)</p>
//                             <Input type="file" name="disabilityProof" onChange={handleChange} />
//                         </div>

//                         <div className="flex justify-end">
//                             <Button className="w-1/3  bg-red-600 hover:bg-red-700" onClick={handleSubmit}>Next</Button>
//                         </div>
//                     </div>
//                 </ScrollArea>
//             </SheetContent>
//         </Sheet>
//     )
// }

import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, X } from 'lucide-react';

type ProBonoFormProps = {
    isPublic?: boolean;
    setDialogOpen?: Dispatch<SetStateAction<boolean>>;
};

interface FormData {
    clientFullName: string;
    clientPhoneNumber: string;
    clientEmailAddress: string;
    opposingPartyName: string;
    relationshipToClient: string;
    opposingPartyEmail: string;
    typeOfMediation: string;
    brieflyDescribeTheCase: string;
    currentStatus: string;
    previousAttempts: string;
    supportingDocuments: File[];
}

interface InputFieldProps {
    label: string;
    name: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
}

interface TextAreaFieldProps {
    label: string;
    name: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    required = false,
    value,
    onChange,
    type = "text",
    placeholder
}) => (
    <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
            id={name}
            name={name}
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full"
        />
    </div>
);

const TextAreaField: React.FC<TextAreaFieldProps> = ({
    label,
    name,
    required = false,
    value,
    onChange,
    placeholder
}) => (
    <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Textarea
            id={name}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full min-h-[100px]"
        />
    </div>
);

// export default function MediationCaseForm() {
export default function MediationCaseForm({ isPublic = false, setDialogOpen = () => { } }: ProBonoFormProps) {

    const [formData, setFormData] = useState<FormData>({
        clientFullName: '',
        clientPhoneNumber: '',
        clientEmailAddress: '',
        opposingPartyName: '',
        relationshipToClient: '',
        opposingPartyEmail: '',
        typeOfMediation: '',
        brieflyDescribeTheCase: '',
        currentStatus: '',
        previousAttempts: '',
        supportingDocuments: []
    });

    const [agreed, setAgreed] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (files: FileList | null) => {
        if (files) {
            const newFiles = Array.from(files).filter(file => {
                const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
            });

            setFormData(prev => ({
                ...prev,
                supportingDocuments: [...prev.supportingDocuments, ...newFiles]
            }));
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            supportingDocuments: prev.supportingDocuments.filter((_, i) => i !== index)
        }));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFileUpload(e.dataTransfer.files);
    };

    const handleSubmit = () => {
        if (!agreed) {
            alert('Please agree to the terms before submitting.');
            return;
        }
        console.log('Form submitted:', formData);
        alert('Form submitted successfully!');
    };

    const clientFields = [
        { name: 'clientFullName', label: 'Client Full Name', required: true, placeholder: 'Enter your full name' },
        { name: 'clientPhoneNumber', label: 'Client Phone Number', required: true, placeholder: 'Enter your phone number' },
        { name: 'clientEmailAddress', label: 'Client Email Address', required: true, type: 'email', placeholder: 'Enter your email address' }
    ];

    const opposingPartyFields = [
        { name: 'opposingPartyName', label: 'Opposing Party Name', required: true, placeholder: 'Enter full name' },
        { name: 'relationshipToClient', label: 'Relationship to Client', required: true, placeholder: 'e.g., Ex-spouse, Business Partner, etc.' },
        { name: 'opposingPartyEmail', label: 'Opposing Party Email', required: false, type: 'email', placeholder: 'Phone Number or Email' }
    ];

    const caseDetailFields = [
        { name: 'brieflyDescribeTheCase', label: 'Briefly describe the case', required: true, placeholder: 'Provide a brief description of the dispute' },
        { name: 'currentStatus', label: 'Current Status', required: true, placeholder: 'What is the current status of the dispute?' },
        { name: 'previousAttempts', label: 'Describe any previous attempts to resolve this issue', required: false, placeholder: 'Have there been any previous attempts to resolve this matter?' }
    ];

    return (
        <div className='bg-white'>
            <div className="mb-2 text-center">
                <h1 className="text-lg font-bold text-gray-900 mb-2">Filing a Mediation Case</h1>
            </div>
            <div className="space-y-8 mt-10">
                {/* Section 1: Client Information */}
                <div className='border-0 border-none'>
                    <div>
                        <div className="text-lg mb-2 font-semibold text-gray-800">SECTION 1: Client Information</div>
                    </div>
                    <div className="space-y-6">
                        {clientFields.map((field) => (
                            <InputField
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                required={field.required}
                                type={field.type || 'text'}
                                value={formData[field.name as keyof FormData] as string}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                            />
                        ))}
                    </div>
                </div>

                {/* Section 2: Opposing Party Information */}
                <div>
                    <div>
                        <div className="text-lg mb-2 font-semibold text-gray-800">SECTION 2: Opposing Party Information</div>
                    </div>
                    <div className="space-y-6">
                        {opposingPartyFields.map((field) => (
                            <InputField
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                required={field.required}
                                type={field.type || 'text'}
                                value={formData[field.name as keyof FormData] as string}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                            />
                        ))}
                    </div>
                </div>

                {/* Section 3: Case Details */}
                <div>
                    <div>
                        <div className="text-lg mb-2 font-semibold text-gray-800">SECTION 3: Case Details</div>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="typeOfMediation" className="text-sm font-medium text-gray-700">
                                Type of Mediation <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.typeOfMediation} onValueChange={(value) => handleInputChange('typeOfMediation', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="family">Family Mediation</SelectItem>
                                    <SelectItem value="business">Business Mediation</SelectItem>
                                    <SelectItem value="property">Property Dispute</SelectItem>
                                    <SelectItem value="employment">Employment Dispute</SelectItem>
                                    <SelectItem value="contract">Contract Dispute</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {caseDetailFields.map((field) => (
                            <TextAreaField
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                required={field.required}
                                value={formData[field.name as keyof FormData] as string}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                            />
                        ))}
                    </div>
                </div>

                {/* Supporting Documents */}
                <div>
                    <div>
                        <div className="text-lg mb-2 font-semibold text-gray-800">Supporting Documents</div>
                        <p className="text-sm text-gray-600">Upload the relevant documents</p>
                    </div>
                    <div>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-lg font-medium text-gray-700 mb-2">
                                Choose files or drag and drop it here.
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                PDF, PNG, JPG, JPEG up to 10MB each
                            </p>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                onChange={(e) => handleFileUpload(e.target.files)}
                                className="hidden"
                                id="file-upload"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                Browse File
                            </Button>
                        </div>

                        {formData.supportingDocuments.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {formData.supportingDocuments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="text-blue-500" size={20} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(index)}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border">
                    <Checkbox
                        id="agreement"
                        checked={agreed}
                        onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    />
                    <div className="flex-1">
                        <Label htmlFor="agreement" className="text-sm text-gray-700 cursor-pointer">
                            I have read and agreed to this mediation request. I understand
                            that false information may result in the rejection of this
                            request.
                        </Label>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold"
                    disabled={!agreed}
                >
                    Submit Form
                </Button>
            </div>
        </div>
    );
}
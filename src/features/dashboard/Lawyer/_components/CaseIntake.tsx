'use client'
import { useState, useRef, useActionState, useEffect, SetStateAction, Dispatch } from 'react';
import { Label } from '@/components/ui/label';
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import { toast } from "sonner";
import InputField from '@/components/form/input/InputField';
import TextAreaField from '@/components/TextAreaField';
import { GetState } from '@/components/get-state';
import { SubmitButton } from '@/components/submit-button';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import SuccessDialog from '@/components/successDialog';
import { submitCaseIntake } from '../server/caseIntak';

interface FormData {
    lawyer_name: string;
    principal_name: string;
    number_of_lawyers: string;
    email: string;
    phone_number: string;
    alternate_number: string;
    nba_member_ship: string;
    year_of_call: string;
    law_firm_organization_address: string;
    experience: string;
    pro_bono_cases: string;
    criminal_matter_preference: string;
}
type ProBonoFormProps = {
    isPublic?: boolean;
    setDialogOpen?: Dispatch<SetStateAction<boolean>>;
};

export default function CaseIntakeForm({ isPublic = false, setDialogOpen = () => { } }: ProBonoFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedState, setSelectedState] = useState<string>("");
    const [state, formAction, isPending] = useActionState(submitCaseIntake, undefined);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [agreement, setAgreementChange] = useState(false);

    // Form state management
    const [formData, setFormData] = useState<FormData>({
        lawyer_name: '',
        principal_name: '',
        number_of_lawyers: '',
        email: '',
        phone_number: '',
        alternate_number: '',
        nba_member_ship: '',
        law_firm_organization_address: '',
        year_of_call: '',
        experience: '',
        pro_bono_cases: '',
        criminal_matter_preference: '',
    });

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // const handleCheckboxChange = (value: string, checked: boolean) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         criminal_matter_preference: checked
    //             ? [...prev.criminal_matter_preference, value]
    //             : prev.criminal_matter_preference.filter(item => item !== value)
    //     }));
    // };

    const resetForm = () => {
        setFormData({
            lawyer_name: '',
            principal_name: '',
            number_of_lawyers: '',
            email: '',
            phone_number: '',
            alternate_number: '',
            nba_member_ship: '',
            year_of_call: '',
            law_firm_organization_address: '',
            experience: '',
            pro_bono_cases: '',
            criminal_matter_preference: '',
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
        { label: 'Lawyer Name', name: 'lawyer_name', type: 'input', required: true },
        { label: 'Principal Name', name: 'principal_name', type: 'input', required: true },
        { label: 'No. Law Firm/Organization', name: 'number_of_lawyers', type: 'input', required: true },
        { label: 'Law Firm/Organization Address', name: 'law_firm_organization_address', type: 'textarea', required: true },
        { label: 'Email Address', name: 'email', type: 'input', required: true },
        { label: 'Mobile Phone Number', name: 'phone_number', type: 'input', required: true },
        { label: 'Alternate Number', name: 'alternate_number', type: 'input', required: false },
        { label: 'Year of Call to Bar / Call No', name: 'year_of_call', type: 'input', required: true },
        { label: 'NBA Branch Membership', name: 'nba_member_ship', type: 'input', required: true },
    ];

    const experienceOptions = ['Below 2 years', '2-5 years', '5-10 years', 'Above 10 years'];
    const capacityOptions = ['1', '2', '3', '4', '5'];
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
            <div className='max-w-2xl mx-auto p-6 bg-white'>
                <div className="text-center mb-8">
                    <h1 className="text-lg font-semibold">Online Pro Bono Lawyer Registration Form</h1>
                </div>

                <form ref={formRef} action={formAction} className='space-y-8'>
                    {/* SECTION 1: Personal Details */}
                    <input type="hidden" name="isPublic" value={isPublic ? "true" : "false"} />
                    <section className="space-y-4">
                        <h2 className="font-semibold text-sm bg-gray-100 p-2 rounded">SECTION 1: Personal Details and Office Info</h2>

                        <div className="space-y-4">
                            {personalFields.map(field => (
                                <div key={field.name} className="space-y-1">
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

                            <div className="space-y-1">
                                <Label htmlFor="state-select" className="text-sm font-medium">State of Practice</Label>
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
                        <h2 className="font-semibold text-sm bg-gray-100 p-2 rounded">SECTION 2: Experience in Criminal Law Practice</h2>
                        <p className="text-sm text-gray-700">How many years of experience do you have?</p>
                        <div className="space-y-2">
                            {experienceOptions.map(option => (
                                <label key={option} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="experience"
                                        value={option}
                                        required
                                        checked={formData.experience === option}
                                        onChange={(e) => handleInputChange('experience', e.target.value)}
                                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                    />
                                    <span className="text-sm text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 3: Case Capacity */}
                    <section className="space-y-4">
                        <h2 className="font-semibold text-sm bg-gray-100 p-2 rounded">SECTION 3: Pro Bono Case Handling Capacity</h2>
                        <p className="text-sm text-gray-700">How many pro-bono cases can you handle at a time?</p>
                        <div className="space-y-2">
                            {capacityOptions.map(option => (
                                <label key={option} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="pro_bono_cases"
                                        value={option}
                                        checked={formData.pro_bono_cases === option}
                                        onChange={(e) => handleInputChange('pro_bono_cases', e.target.value)}
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
                        <h2 className="font-semibold text-sm bg-gray-100 p-2 rounded">SECTION 4: Criminal Matters Preference</h2>
                        <p className="text-sm text-gray-700">Which courts do you prefer handling criminal matters in?</p>
                        <div className="space-y-2">
                            {courtOptions.map(option => (
                                <label key={option} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="criminal_matter_preference"
                                        value={option}
                                        checked={formData.criminal_matter_preference === option}
                                        onChange={(e) => handleInputChange('criminal_matter_preference', e.target.value)}
                                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                    <span className="text-sm text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 5: Agreement */}
                    <section className="space-y-4">
                        <h2 className="font-semibold text-sm bg-gray-100 p-2 rounded">SECTION 5: Acknowledgement & Undertaking</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
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
                        <div className="text-red-500 bg-red-50 p-4 rounded border border-red-200">
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

                    <div className="flex justify-center pt-6">
                        <SubmitButton
                            value="Submit"
                            loading={isPending}
                            disabled={!agreement}
                            pendingValue="Processing..."
                            className="px-12 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors duration-200"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}
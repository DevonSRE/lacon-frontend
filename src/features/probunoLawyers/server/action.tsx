
'use server';

import { ErrorResponse } from '@/lib/auth';
import { caseUpdateSchema, proBonoSchema } from '@/features/probunoLawyers/server/probonoSchema';
import { z } from 'zod';
import ProbunoService from './service';

// Define the structure of the form data
export type LawyersFormData = {
    lawyerName: string;
    contactAddress: string;
    contactPhoneNumber: string;
    proBonoCases: ProBonoCase[];
};

// Types
export interface ProBonoCase {
    id: string;
    clientName: string;
    sex: string;
    dateYearTookCase: string;
    natureOfServices: string;
    theOfferingCharge: string;
    suitNumber: string;
    statusOfCase: string;
    lastDateOfAppearance: string;
    isClientInCustody: string;
}

export interface FormDataProbunu {
    lawyerName: string;
    contactAddress: string;
    contactPhoneNumber: string;
    proBonoCases: ProBonoCase[];
}

export interface FormState {
    success: boolean;
    message: string;
    errors?: Record<string, string>;
}


// Server Action (this would typically be in a separate server file)
export async function submitLawyersForm(prevState: FormState, formData: FormData): Promise<FormState> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Extract form data
    const lawyerName = formData.get('lawyerName') as string || '';
    const contactAddress = formData.get('contactAddress') as string || '';
    const contactPhoneNumber = formData.get('contactPhoneNumber') as string || '';
    const proBonoCasesJson = formData.get('proBonoCases') as string || '[]';

    let proBonoCases: ProBonoCase[] = [];
    try {
        proBonoCases = JSON.parse(proBonoCasesJson);
    } catch (error) {
        console.error('Error parsing pro bono cases:', error);
    }

    // Basic validation
    const errors: Record<string, string> = {};

    if (!lawyerName.trim()) {
        errors.lawyerName = 'Lawyer name is required';
    }

    if (!contactAddress.trim()) {
        errors.contactAddress = 'Contact address is required';
    }

    if (!contactPhoneNumber.trim()) {
        errors.contactPhoneNumber = 'Contact phone number is required';
    }

    if (proBonoCases.length === 0) {
        errors.proBonoCases = 'At least one pro bono case is required';
    }

    // Validate each pro bono case
    proBonoCases.forEach((case_, index) => {
        if (!case_.clientName.trim()) {
            errors[`case_${index}_clientName`] = `Client name is required for case ${index + 1}`;
        }
        if (!case_.sex) {
            errors[`case_${index}_sex`] = `Sex is required for case ${index + 1}`;
        }
        if (!case_.dateYearTookCase.trim()) {
            errors[`case_${index}_dateYearTookCase`] = `Date/Year is required for case ${index + 1}`;
        }
        if (!case_.natureOfServices.trim()) {
            errors[`case_${index}_natureOfServices`] = `Nature of services is required for case ${index + 1}`;
        }
    });

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: 'Please fix the validation errors',
            errors
        };
    }

    // Simulate successful submission
    const submissionData = {
        lawyerName,
        contactAddress,
        contactPhoneNumber,
        proBonoCases
    };

    console.log('Form submitted successfully:', submissionData);

    return {
        success: true,
        message: 'Form submitted successfully! Your annual cases review has been recorded.'
    };
}


type SchemaType = typeof proBonoSchema | typeof caseUpdateSchema;
type ServiceMethod = (data: any) => Promise<any>;

async function handleFormSubmission(
    formData: FormData,
    schema: SchemaType,
    serviceMethod: ServiceMethod
) {
    const data = Object.fromEntries(formData);
    const result = schema.safeParse(data);

    if (!result.success) {
        return {
            status: 400,
            errors: result.error.flatten().fieldErrors,
            message: "An Error Occurred",
            success: false,
        };
    }

    try {
        const response = await serviceMethod(result.data);
        console.log("Form submission data:", result.data);
        return {
            status: 200,
            message: "Success",
            success: true,
            data: response,
        };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        console.log("Error response:", error);

        if (error?.response) {
            return {
                status: error.response.status,
                message: error.response.data.message,
                errors: error.response.data.data,
                success: false,
            };
        } else if (error?.request) {
            return {
                status: 504,
                message: "Something went wrong. Please try again.",
                errors: "Unable to process request.",
                success: false,
            };
        } else if (error?.message) {
            return {
                status: 500,
                message: error.message,
                errors: error.message,
                success: false,
            };
        } else {
            return {
                status: 500,
                message: "An unexpected error occurred.",
                errors: "Unknown error.",
                success: false,
            };
        }
    }
}



export async function submitProBonoForm(_prevState: unknown, formData: FormData) {
    return handleFormSubmission(formData, proBonoSchema, ProbunoService.registration);
}

export async function submitProBonoCaseForm(_prevState: unknown, formData: FormData) {
    return handleFormSubmission(formData, proBonoSchema, ProbunoService.cases);
}

export async function submitProBonoCaseUpdateForm(_prevState: unknown, formData: FormData) {
    return handleFormSubmission(formData, caseUpdateSchema, ProbunoService.casesUpdate);
}

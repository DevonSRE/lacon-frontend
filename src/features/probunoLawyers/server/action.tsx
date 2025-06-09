
'use server';

import { ErrorResponse } from '@/lib/auth';
import { caseUpdateSchema, PDSSCaseFullSchema, proBonoSchema, probunoInventoryCaseformSchema, probunoUpdateForm, PublicCivilCaseSchema, PublicCriminalCaseSchema } from '@/features/probunoLawyers/server/probonoSchema';
import { z } from 'zod';
import ProbunoService from './service';
import { handleApiError } from '@/lib/utils';

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


export async function submitLawyersForm(prevState: unknown, formData: FormData) {
    console.log(formData);

    // Extract form data
    const data = Object.fromEntries(formData);
    console.log("Raw form data:", data);

    try {
        // Parse the cases data from JSON
        const casesData = data.cases_data ? JSON.parse(data.cases_data as string) : [];

        // Prepare data for validation
        const validationData = {
            first_name: data.first_name,
            last_name: data.last_name,
            contact_address: data.contact_address,
            email: data.email,
            phone_number: data.phone_number,
            cases: casesData
        };

        console.log("Structured data for validation:", validationData);

        // Validate the structured data
        const result = probunoUpdateForm.safeParse(validationData);
        console.log("Validation result:", result);

        if (!result.success) {
            console.log("Validation errors:", result.error.flatten().fieldErrors);
            return {
                status: 400,
                errors: result.error.flatten().fieldErrors,
                message: "Please Fill all Forms",
            };
        }

        const submissionData = {
            first_name: result.data.first_name,
            last_name: result.data.last_name,
            // contact_address: result.data.contact_address,
            email: result.data.email,
            phone_number: result.data.phone_number,
            cases: result.data.cases,
        };
        console.log(submissionData);

        const response = await ProbunoService.casesUpdate(submissionData);
        console.log(JSON.stringify(response.data));

        return {
            status: 200,
            message: response.data.message,
            success: true,
            data: response.data?.data,
        };

    } catch (err) {
        if (err instanceof SyntaxError) {
            console.log("JSON Parse error:", err);
            return {
                status: 400,
                errors: { cases: ["Invalid cases data format"] },
                message: "Invalid form data",
            };
        } else {
            const error = err as ErrorResponse;
            console.log("Error response:", error);
            return handleApiError(error);
        }
    }
}
type SchemaType = typeof proBonoSchema | typeof caseUpdateSchema | typeof probunoInventoryCaseformSchema;
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

export async function submitProBonoCaseForm(_prevState: unknown, formData: FormData) {
    return handleFormSubmission(formData, probunoInventoryCaseformSchema, ProbunoService.cases);
}

export async function submitProBonoCaseUpdateForm(_prevState: unknown, formData: FormData) {
    return handleFormSubmission(formData, caseUpdateSchema, ProbunoService.casesUpdate);
}


export async function submitProBonoForm(_prevState: unknown, formData: FormData) {
    const data: Record<string, any> = {};

    // Fields that can have multiple values (like checkboxes)
    const multiValueFields = ['criminal_courts_preference'];

    for (const [key, value] of formData.entries()) {
        if (multiValueFields.includes(key)) {
            if (!data[key]) {
                data[key] = [];
            }
            data[key].push(value);
        } else if (!data.hasOwnProperty(key)) {
            data[key] = value;
        }
    }

    const result = proBonoSchema.safeParse(data);

    if (!result.success) {
        return {
            status: 400,
            errors: result.error.flatten().fieldErrors,
            message: "An Error Occurred",
            success: false,
            formData: { ...data }
        };
    }

    try {
        const response = await ProbunoService.registration(result.data);
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
                formData: { ...data }
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

// 

export async function submitPublicCaseForm(prevState: unknown, formData: FormData) {
    const data = Object.fromEntries(formData);
    console.log("Raw form data:", data);

    try {
        let result;
        if (data.case_type === "Civil Case") {
            result = PublicCivilCaseSchema.safeParse(data);
        } else if (data.case_type === "Criminal Case") {
            result = PublicCriminalCaseSchema.safeParse(data);
        } else {
            result = PDSSCaseFullSchema.safeParse(data);
        }
        if (!result.success) {
            return {
                status: 400,
                errors: result.error.flatten().fieldErrors,
                message: "Invalid field found",
            };
        }

        const response = await ProbunoService.casesPublicCase(result.data);
        console.log(JSON.stringify(response.data));

        return {
            status: 200,
            message: response.data.message,
            success: true,
            data: response.data?.data,
        };

    } catch (err) {
        if (err instanceof SyntaxError) {
            console.log("JSON Parse error:", err);
            return {
                status: 400,
                errors: { cases: ["Invalid cases data format"] },
                message: "Invalid form data",
            };
        } else {
            const error = err as ErrorResponse;
            console.log("Error response:", error);
            return handleApiError(error);
        }
    }
}
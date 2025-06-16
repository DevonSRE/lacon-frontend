
'use server';

import { ErrorResponse } from '@/lib/auth';
import { caseUpdateSchema, DecongestionCaseFullSchema, PDSSCaseFullSchema, proBonoSchema, probunoInventoryCaseformSchema, probunoUpdateForm, PublicCivilCaseSchema, PublicCriminalCaseSchema } from '@/features/probunoLawyers/server/probonoSchema';
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


export async function submitProBonoCaseUpdateForm(_prevState: unknown, formData: FormData) {
    return handleFormSubmission(formData, caseUpdateSchema, ProbunoService.casesUpdate);
}


function ensureArray(value: unknown): string[] {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch {
            console.warn('Failed to parse array string:', value);
            return [];
        }
    }
    return [];
}

export async function submitProBonoCaseForm(_prevState: unknown, formData: FormData) {
    // Safely extract raw data from form
    const rawData = Object.fromEntries(formData.entries());

    // Use getAll for multi-select fields (always returns an array)
    const parsedData = {
        ...rawData,
        lawyers_count_in_firm: Number(rawData.lawyers_count_in_firm),
        preferred_courts: formData.getAll('preferred_courts'),
        client_types: formData.getAll('client_types'),
        referral_sources: formData.getAll('referral_sources'),
    };

    const result = probunoInventoryCaseformSchema.safeParse(parsedData);

    if (!result.success) {
        const safeErrors = JSON.parse(JSON.stringify(result.error.flatten().fieldErrors));
        console.log(safeErrors);
        return {
            status: 400,
            errors: safeErrors,
            message: "Validation Failed",
            success: false,
        };
    }
    console.log("result.data" + JSON.stringify(result.data));
    try {
        const response = await ProbunoService.cases(result.data);
        // console.log(JSON.stringify(response));
        return {
            status: 200,
            message: "Success",
            success: true,
        };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        // Safely handle known and unknown server errors
        if (error?.response) {
            return {
                status: error.response.status,
                message: error.response.data?.message || "Request failed.",
                errors: error.response.data?.data || null,
                success: false,
            };
        } else if (error?.request) {
            return {
                status: 504,
                message: "No response received. Please try again.",
                errors: "Network error.",
                success: false,
            };
        } else if (error?.message) {
            return {
                status: 500,
                message: error.message,
                errors: error.message,
                success: false,
            };
        }
        return {
            status: 500,
            message: "Unexpected server error.",
            errors: "Unknown failure.",
            success: false,
        };
    }
}


export async function submitProBonoForm(_prevState: unknown, formData: FormData) {
    const data: Record<string, any> = {};

    // Fields that can have multiple values (like checkboxes)
    const multiValueFields = ['criminal_courts_preference'];

    // Process form data more safely
    try {
        for (const [key, value] of formData.entries()) {
            if (multiValueFields.includes(key)) {
                if (!data[key]) {
                    data[key] = [];
                }
                data[key].push(value);
            } else if (!Object.prototype.hasOwnProperty.call(data, key)) {
                data[key] = value;
            }
        }

        console.log('Form data:', JSON.stringify(data, null, 2));

        const result = proBonoSchema.safeParse(data);

        if (!result.success) {
            // Create a clean error object to prevent circular references
            const fieldErrors = result.error.flatten().fieldErrors;
            const safeErrors: Record<string, string[]> = {};

            for (const [key, messages] of Object.entries(fieldErrors)) {
                safeErrors[key] = Array.isArray(messages) ? messages : [String(messages)];
            }

            return {
                status: 400,
                errors: safeErrors,
                message: "Validation failed",
                success: false,
            };
        }

        await ProbunoService.registration(result.data);

        return {
            status: 200,
            message: "Registration successful",
            success: true,
        };

    } catch (err: unknown) {
        console.error('Server action error:', err);

        const error = err as ErrorResponse;

        if (error?.response) {
            return {
                status: error.response.status || 500,
                message: error.response.data?.message || "Server error occurred",
                errors: error.response.data?.data || "Unknown server error",
                success: false,
            };
        }

        if (error?.request) {
            return {
                status: 504,
                message: "Network error. Please try again.",
                errors: "Unable to connect to server",
                success: false,
            };
        }

        if (error?.message) {
            return {
                status: 500,
                message: "An error occurred",
                errors: error.message,
                success: false,
            };
        }

        return {
            status: 500,
            message: "An unexpected error occurred",
            errors: "Unknown error occurred",
            success: false,
        };
    }
}


export async function submitPublicCaseForm(prevState: unknown, formData: FormData) {
    const data = Object.fromEntries(formData);
    console.log("Raw form data:", data);

    try {
        let result;
        if (data.case_type === "Civil Case") {
            result = PublicCivilCaseSchema.safeParse(data);
        } else if (data.case_type === "Criminal Case") {
            result = PublicCriminalCaseSchema.safeParse(data);
        }
        else if (data.case_type === "Decongestion Case") {
            result = DecongestionCaseFullSchema.safeParse(data);
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
        console.log(result.data);
        let response;
        if (data.case_type === "Decongestion Case") {
            response = await ProbunoService.casesDecongestionCase(result.data);
        }
        else if (data.case_type === "PDSS") {
            response = await ProbunoService.casesPDSSCase(result.data);
        }
        else if (data.case_type === "Perogative Case") {
            response = await ProbunoService.casesPerogativeCase(result.data);
        } else {
            response = await ProbunoService.casesPublicCase(result.data);
        }

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
export async function submitDecongestionForm(prevState: unknown, formData: FormData) {
    const data = Object.fromEntries(formData);
    console.log("Raw form data:", data);

    try {
        const result = DecongestionCaseFullSchema.safeParse(data);

        if (!result.success) {
            return {
                status: 400,
                errors: result.error.flatten().fieldErrors,
                message: "Invalid field found",
            };
        }
        console.log(result.data);
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
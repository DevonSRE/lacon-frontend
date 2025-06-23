
'use server';

import { ErrorResponse } from '@/lib/auth';
import { caseUpdateSchema, DecongestionCaseFullSchema, MercyApplicationCaseFullSchema, PDSSCaseFullSchema, proBonoSchema, probunoInventoryCaseformSchema, probunoUpdateForm, PublicCivilCaseSchema, PublicCriminalCaseSchema } from '@/features/probunoLawyers/server/probonoSchema';
import { z } from 'zod';
import ProbunoService from './service';
import { handleApiError } from '@/lib/utils';
import { NEXT_BASE_URL } from '@/lib/constants';

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
    const multiValueFields = ['criminal_courts_preference'];
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
        console.log("result.data => " + result.data);
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

export async function submitDecongestionForm(prevState: unknown, formData: FormData) {
    const data = Object.fromEntries(formData);
    console.log("Raw form data:", data);

    try {
        // const result = DecongestionCaseFullSchema.safeParse(data);
        // if (!result.success) {
        //     return {
        //         status: 400,
        //         errors: result.error.flatten().fieldErrors,
        //         message: "Invalid field found",
        //     };
        // }
        const data = {
            case_type: formData.get('case_type') as string,
            state_id: formData.get('state_id') as string,
            first_name: formData.get('first_name') as string,
            middle_name: formData.get('middle_name') as string,
            last_name: formData.get('last_name') as string,
            gender: formData.get('gender') as string,
            age: parseInt(formData.get('age') as string),
            correctional_facility: formData.get('correctional_facility') as string,
            offence: formData.get('offence') as string,
            decongestion_unit: {
                have_a_lawyer: formData.get('have_a_lawyer') === "yes" ? true : false,
                need_legal_aid: formData.get('need_legal_aid') === "yes" ? true : false,
                custodial_visit: formData.get('custodial_visit') as string || undefined,
                date_of_visit: formData.get('date_of_visit') as string || undefined,
                case_name: formData.get('case_name') as string,
                state_id: formData.get('state_id') as string,
                name_of_defendant: formData.get('name_of_defendant') as string,
                offence_charged_description: formData.get('offence_charged_description') as string,
                offence_charged: formData.get('offence_charged') as string,
                charge_number: formData.get('charge_number') as string,
                court_of_trial: formData.get('court_of_trial') as string,
                arrest_date: formData.get('arrest_date') as string,
                arraignment_date: formData.get('arraignment_date') as string,
                remand_date: formData.get('remand_date') as string,
                last_court_date: formData.get('last_court_date') as string || undefined,
                next_adjournment: formData.get('next_adjournment') as string,
                bail_status: formData.get('bail_status') as string,
                sex: formData.get('sex') as string,
                date_of_birth: formData.get('date_of_birth') as string,
                name_of_relative: formData.get('name_of_relative') as string,
                relative_phone_number: formData.get('relative_phone_number') as string,
                state_of_origin: formData.get('state_of_origin') as string,
                religion: formData.get('religion') as string,
                average_monthly_income: formData.get('average_monthly_income') as string,
                stage_of_case: formData.get('stage_of_case') as string,
                need_interpreter: formData.get('need_interpreter') === "yes" ? true : false,
                disability_ailment: formData.get('disability_ailment') === "yes" ? true : false,
                confessional_statement: formData.get('confessional_statement') as string || undefined,
            }
        };
        const response = await ProbunoService.casesDecongestionCase(data);
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
export async function submitMercyApplicationForm(prevState: unknown, formData: FormData) {
    const data = Object.fromEntries(formData);
    console.log("Raw form data:", data);

    try {
        const data = {
            case_type: formData.get('case_type') as string,
            state_id: formData.get('state_id') as string,
            first_name: formData.get('first_name') as string,
            middle_name: formData.get('middle_name') as string,
            last_name: formData.get('last_name') as string,
            gender: formData.get('gender') as string,
            age: parseInt(formData.get('age') as string),
            correctional_facility: formData.get('correctional_facility') as string,
            offence: formData.get('offence') as string,
            // Reconstruct the nested object from flat fields
            perogative_of_mercy: {
                sentence_passed: formData.get('perogative_sentence_passed') as string || undefined,
                date_of_sentence: formData.get('perogative_date_of_sentence') as string || undefined,
                perogative_of_mercy: parseInt(formData.get('perogative_mercy_number') as string) || 0,
                reason_for_clemency: formData.get('perogative_reason_for_clemency') as string || undefined,
                health_condition: formData.get('perogative_health_condition') as string || undefined,
                recommendations: formData.get('perogative_recommendations') as string || undefined,
            }
        };
        const result = MercyApplicationCaseFullSchema.safeParse(data);

        if (!result.success) {
            return {
                status: 400,
                errors: result.error.flatten().fieldErrors,
                message: "Invalid field found",
            };
        }
        console.log(result.data);
        const response = await ProbunoService.casesPerogativeCase(result.data);
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














































// Public case submission functions

export async function submitPublicCaseForm(prevState: unknown, formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    console.log("Raw form data:", data);

    try {
        if (!data.case_type) {
            return {
                status: 400,
                errors: { case_type: ["Case type is required"] },
                message: "Case type missing",
            };
        }

        let result;
        if (data.case_type === "CIVIL CASE") {
            result = PublicCivilCaseSchema.safeParse(data);
        } else if (data.case_type === "CRIMINAL CASE") {
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

        // Handle disability proof upload
        let disabilityProof;
        const hasDisability = formData.get('disability_status') === "yes";
        const file = formData.get('disability_proof');
        console.log("about to loaid");
        if (hasDisability && file instanceof Blob) {
            const fileFormData = new FormData();
            fileFormData.append('file', file);

            const uploadFile = await fetch(`${NEXT_BASE_URL}/media?category=casefile`, {
                method: "POST",
                body: fileFormData,
            });

            if (!uploadFile.ok) {
                let errorData;
                try {
                    errorData = await uploadFile.json();
                } catch {
                    errorData = { message: "Unknown error uploading file" };
                }
                console.error("Upload file error:", errorData);
                throw {
                    response: {
                        status: uploadFile.status,
                        data: errorData,
                    },
                };
            }

            const uploadResult = await uploadFile.json();
            disabilityProof = uploadResult?.data;
            console.log("File uploaded successfully:", disabilityProof);
        }

        // Prepare data for API call
        let uploadData = { ...result.data };
        if (disabilityProof != null) {
            uploadData.disability_proof = disabilityProof;
        }

        let response;
        const isPublic = data.isPublic === "true";

        if (data.case_type === "CIVIL CASE" || data.case_type === "CRIMINAL CASE") {
            response = isPublic
                ? await ProbunoService.casesPublicCase(uploadData)
                : await ProbunoService.casesCase(uploadData);
        } else {
            response = isPublic
                ? await ProbunoService.casesPublicPDSSCase(uploadData)
                : await ProbunoService.casesPDSSCase(uploadData);
        }

        console.log("API response:", response.data);

        return {
            status: 200,
            message: response.data.message,
            success: true,
            data: response.data?.data,
        };

    } catch (err) {
        console.log("Error caught:", err);
        if (err instanceof SyntaxError) {
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

'use server'

import { ErrorResponse } from "@/lib/auth";
import { Ipage } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import CaseIntakeServices from "./service";
import { caseIntakeSchema } from "./caseIntakeSchema";

export async function GetCaseInTake(params: Ipage) {
    try {
        const response = await CaseIntakeServices.getCaseIntake(params);
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }

}


export async function submitCaseIntake(_prevState: unknown, formData: FormData) {
    const data: Record<string, any> = {};
    // const multiValueFields = ['criminal_matter_preference'];
    try {
        for (const [key, value] of formData.entries()) {
            if (!Object.prototype.hasOwnProperty.call(data, key)) {
                data[key] = value;
            }
        }
        console.log('Form data:', JSON.stringify(data, null, 2));

        const result = caseIntakeSchema.safeParse(data);

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
        await CaseIntakeServices.createCaseIntake(result.data);

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

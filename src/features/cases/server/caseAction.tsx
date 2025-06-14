'use server'

import { ErrorResponse } from "@/lib/auth";
import { Ipage } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import casesServices from "./caseService";
import z from "zod";

const assigncase = z.object({
    casefile_id: z.string().min(1, { message: "Please select case file" }),
    assignee_id: z.string().min(1, { message: "Please select assignee" }),
    is_reassigned: z.coerce.boolean(),
});


export async function GetCaseAction(params: Ipage) {
    try {
        const response = await casesServices.getCases(params);
        console.log("response cases  =>" + JSON.stringify(response.data.data));
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}

// export async function AssignCaseAction() {
export async function AssignCaseAction(_prevState: unknown, formData: FormData) {
    const result = assigncase.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        return {
            status: 400,
            errors: result.error.flatten().fieldErrors,
            message: "Select Assignee",
        };
    }
    try {
        const response = await casesServices.AssignCases(result.data);
        console.log("response cases  =>" + JSON.stringify(response.data.data));
        return { status: 200, data: response.data?.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
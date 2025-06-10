'use server'

import { ErrorResponse } from "@/lib/auth";
import { Ipage } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import casesServices from "./caseService";
import z from "zod";

const assigncase = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password field must not be empty." }),
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
    const data = Object.fromEntries(formData);
    const result = assigncase.safeParse(data);
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
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
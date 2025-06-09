'use server'

import { ErrorResponse } from "@/lib/auth";
import { Ipage } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import casesServices from "./caseService";

export async function GetCaseAction(params: Ipage) {
    try {
        const response = await casesServices.getCases(params);
        console.log("response state  =>" + JSON.stringify(response.data.data));
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
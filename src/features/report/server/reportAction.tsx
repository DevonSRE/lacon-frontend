'use server'

import { ErrorResponse } from "@/lib/auth";
import { Ipage } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import reportServices from "./reportService";

export async function GetReportOverView(filters: Ipage) {
    try {
        const response = await reportServices.getOverview(filters);
        console.log("response state  =>" + JSON.stringify(response.data));
        return { data: response?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetReportCaseType(filters: Ipage) {
    try {
        const response = await reportServices.getReportCaseType(filters);
        console.log("response state  =>" + JSON.stringify(response.data));
        return { data: response?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetReportAdminLawyer(filters: Ipage) {
    try {
        const response = await reportServices.getReportAdminLawyer(filters);
        console.log("response state  =>" + JSON.stringify(response.data));
        return { data: response?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetReportDemography(filters: Ipage) {
    try {
        const response = await reportServices.getReportDemography(filters);
        console.log("response state  =>" + JSON.stringify(response.data));
        return { data: response?.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
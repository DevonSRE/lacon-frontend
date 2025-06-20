'use server'

import { ErrorResponse } from "@/lib/auth";
import { Ipage } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import reportServices from "./reportService";

export async function GetReportOverView(filters: Ipage) {
    try {
        const response = await reportServices.getOverview(filters);
        return { data: response?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetReportCaseType(filters: Ipage) {
    try {
        const response = await reportServices.getReportCaseType(filters);
        return { data: response?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetReportAdminLawyer(filters: Ipage) {
    try {
        const response = await reportServices.getReportAdminLawyer(filters);
        return { data: response?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetReportDemography(filters: Ipage) {
    try {
        const response = await reportServices.getReportDemography(filters);
        return { data: response?.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetUnitheadReport(filters: Ipage) {
    try {
        const response = await reportServices.getunitheadReport(filters);
        return { data: response?.data.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetAdminReport(filters: Ipage) {
    try {
        const response = await reportServices.getAdminReport(filters);
        return { data: response?.data.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
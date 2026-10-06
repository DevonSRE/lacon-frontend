'use server'

import { ErrorResponse } from "@/lib/auth";
import { Ipage } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import reportServices from "./reportService";
import { AxiosResponse } from "axios";

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
        return { data: response?.data.data, success: true };

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
export async function GetAllUnit(filters: Ipage) {
    try {
        const response = await reportServices.getAllUnit(filters);
        return { data: response?.data.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetLACONLAWYER(filters: Ipage) {
    try {
        const response = await reportServices.getLaconLAwyer(filters);
        return { data: response?.data.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}


const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Turns an export response into something a client component can save.
// The API answers errors with a JSON envelope, so a JSON body is never a file.
function toDownload(response: { data: ArrayBuffer; headers: Record<string, unknown> }, fallbackName: string) {
    const contentType = String(response.headers['content-type'] ?? XLSX_TYPE);
    const buffer = Buffer.from(response.data);
    if (contentType.includes('application/json')) {
        let message = 'The report could not be exported.';
        try {
            message = JSON.parse(buffer.toString('utf8'))?.message || message;
        } catch { }
        return { success: false as const, status: 500, message };
    }
    const disposition = String(response.headers['content-disposition'] ?? '');
    const filename = /filename="?([^";]+)"?/i.exec(disposition)?.[1] ?? fallbackName;
    return {
        success: true as const,
        data: buffer.toString('base64'),
        filename,
        contentType,
    };
}

export async function ExportAdminOverview(filters: Ipage) {
    try {
        return toDownload(await reportServices.exportAdminOverview(filters), 'admin-overview-report.xlsx');
    } catch (err) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function ExportCaseType(filters: Ipage) {
    try {
        return toDownload(await reportServices.exportCaseType(filters), 'case-type-report.xlsx');
    } catch (err) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function ExportAdminUnit(filters: Ipage) {
    try {
        return toDownload(await reportServices.exportAdminUnit(filters), 'unit-report.xlsx');
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
'use server'

import { ErrorResponse } from "@/lib/auth";
import { Ipage } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import reportServices from "./reportService";
import { toDownload } from "./to-download";
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
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
        console.log(response);
        return { data: response?.data.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetLACONLAWYER(filters: Ipage) {
    try {
        const response = await reportServices.getLaconLAwyer(filters);
        console.log(response);
        return { data: response?.data.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}


export async function ExportAdminOverview() {
    try {
        const response = await reportServices.exportAdminOverview();
        const base64Data = Buffer.from(response.data).toString('base64');
        return { 
            success: true, 
            data: base64Data,
            filename: 'admin-overview-report.xlsx',
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
    } catch (err) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function ExportCaseType() {
    try {
        const response = await reportServices.exportCaseType();
        const base64Data = Buffer.from(response.data).toString('base64');
        return { 
            success: true, 
            data: base64Data,
            filename: 'case-type-report.xlsx',
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
    } catch (err) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}


// export async function ExportCaseType() {
//     try {
//         const response = await reportServices.exportCaseType();
//         console.log(response);
//         return { data: response?.data.data, success: true };
//     } catch (err: unknown) {
//         const error = err as ErrorResponse;
//         return handleApiError(error);
//     }
// }
export async function ExportAdminUnit(filters: Ipage) {
    try {
        const response = await reportServices.exportAdminUnit(filters);
        console.log(response);
        return { data: response?.data.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
'use server'

import { readApplication } from "@/lib/probono-application";
import { ErrorResponse } from "@/lib/auth";
import { Ipage } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import usersServices from "./userRoleService";

export async function GetUserAction(params: Ipage) {
    try {
        const response = await usersServices.getUsers(params);
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetLawyersManagementAction(params: Ipage) {
    try {
        const response = await usersServices.getLawyers(params);
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetLawyerRequestAction(params: Ipage) {
    try {
        const response = await usersServices.getLawyersRequest(params);
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetProbunoLawyerRequestAction(params: Ipage) {
    try {
        const response = await usersServices.getProbunoLawyersRequest(params);
        const page = response.data?.data;
        const data = page?.data?.map(readApplication);
        return { data: { ...page, data }, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function getProbunoLawyersRequestSingleAction(id: string) {
    try {
        const response = await usersServices.getProbunoLawyersRequestSingle(id);
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}

/**
 * One application as the review dialog reads it. The list leaves out the cases
 * the lawyer declared, so the dialog fetches the application itself
 * (QA 2026-11-01 run 4, 13 Nov, row 36).
 */
export async function getProbonoApplicationAction(id: string) {
    try {
        const response = await usersServices.getProbunoLawyersRequestSingle(id);
        const raw = response.data?.data;
        if (!raw) return { data: undefined, success: false as const };
        return { data: readApplication(raw as Record<string, unknown>), success: true as const };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetUserByTypes(params: Ipage) {
    try {
        const response = await usersServices.getUserType(params);
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}

export async function GetDocumentHistory(params: Ipage, id: string) {
    try {
        const response = await usersServices.GetDocumentHistory(params, id);
        return { data: response?.data?.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}

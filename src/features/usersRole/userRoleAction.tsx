'use server'

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
        return { data: response.data?.data, success: true };

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
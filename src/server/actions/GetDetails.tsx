'use server'
import { ErrorResponse } from "@/lib/auth";
import { Ipage } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import detailsServices from "../getDetails";

export async function GetStates(params: Ipage) {
    try {
        const response = await detailsServices.getState(params);
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetInactiveStates(params: Ipage) {
    try {
        const response = await detailsServices.getInactiveState(params);
        return { data: response?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}

export async function GetZones(params: Ipage) {
    try {
        const response = await detailsServices.getZone(params);
        return { data: response.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}

export async function GetActiveUsers(params: Ipage) {
    try {
        const response = await detailsServices.getActiveUser(params);
        return { data: response.data?.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}


export async function GetInActiveUsers(params: Ipage) {
    try {
        const response = await detailsServices.getInActiveUser(params);
        return { data: response.data?.data, success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}

export type RoleSeat = { role: string; holder: { id: string; name: string } | null };

export async function GetRoleSeats() {
    try {
        const response = await detailsServices.getRoleSeats();
        return { data: (response.data?.data ?? []) as RoleSeat[], success: true };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}

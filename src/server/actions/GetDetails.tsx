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

export async function GetZones(params: Ipage) {
    try {
        const response = await detailsServices.getZone(params);
        console.log("response inveontory  =>" + JSON.stringify(response.data?.data));
        return { data: response.data?.data, success: true };
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

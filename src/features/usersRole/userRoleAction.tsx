'use server'

import { ErrorResponse } from "@/lib/auth";
import { Ipage } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import usersServices from "./userRoleService";

export async function GetUserAction(params: Ipage) {
    try {
        const response = await usersServices.getUsers(params);
        console.log("response state  =>" + JSON.stringify(response.data.data));
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetLawyersManagementAction(params: Ipage) {
    try {
        const response = await usersServices.getLawyers(params);
        console.log("response state  =>" + JSON.stringify(response.data.data));
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
export async function GetLawyerRequestAction(params: Ipage) {
    try {
        const response = await usersServices.getLawyersRequest(params);
        console.log("response state  =>" + JSON.stringify(response.data.data));
        return { data: response.data?.data, success: true };

    } catch (err: unknown) {
        const error = err as ErrorResponse;
        return handleApiError(error);
    }
}
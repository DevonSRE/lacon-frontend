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
        const page = response.data?.data;
        const data = page?.data?.map((application: Record<string, unknown>) => ({
            ...application,
            ID: application.user_id,
            ApplicationID: application.id,
            FirstName: application.first_name,
            LastName: application.last_name,
            Email: application.email,
            PhoneNumber: application.phone_number,
            AltNumber: application.alternate_number,
            YearOfCall: application.year_of_call,
            NBANumber: application.nba_branch,
            Experience: application.experience_in_criminal_law,
            MaxLoad: application.pro_bono_capacity,
            PreferredCourt: Array.isArray(application.criminal_courts_preference)
                ? application.criminal_courts_preference.join(", ")
                : application.criminal_courts_preference,
            Status: String(application.status ?? "").toUpperCase(),
            CreatedAt: application.created_at,
            LawFirmName: application.law_firm_name,
            LawFirmAddress: application.law_firm_address,
            StateBarMembership: application.state_bar_membership,
            MostContactableNumber: application.most_contactable_number,
            StateOfPractice: application.state_of_practice,
            DecisionReason: application.decision_reason,
            DecidedBy: application.decided_by,
            DecidedAt: application.decided_at,
        }));
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

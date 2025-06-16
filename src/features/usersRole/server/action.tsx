'use server'
import { ErrorResponse } from "@/lib/auth";
import UService from "./service";


export async function AcceptRejectProbunoRequest(_prevState: unknown, formData: FormData) {
    const data = Object.fromEntries(formData);
    console.log(data);
    try {
        const response = await UService.acceptReject(data, typeof data?.lawyer_id === "string" ? data.lawyer_id : "");
        console.log(response.data);
        return {
            status: 200,
            message: "Success",
            success: true,
            type: data?.type,
            data: response.data,
        };
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        console.log("Error response:", error);
        if (error?.response) {
            return {
                status: error.response.status,
                message: error.response.data.message,
                errors: error.response.data.data,
                success: false,
            };
        } else if (error?.request) {
            return {
                status: 504,
                message: "Something went wrong. Please try again.",
                errors: "Unable to process request.",
                success: false,
            };
        } else if (error?.message) {
            return {
                status: 500,
                message: error.message,
                errors: error.message,
                success: false,
            };
        } else {
            return {
                status: 500,
                message: "An unexpected error occurred.",
                errors: "Unknown error.",
                success: false,
            };
        }
    }

}
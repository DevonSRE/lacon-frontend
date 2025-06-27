'use server'
import { ErrorResponse } from "@/lib/auth";
import UserService from "./service";
import { createLawyerSchema, createUserSchema } from "./type";


export async function InviteUser(_prevState: unknown, formData: FormData) {
    const data = Object.fromEntries(formData);
    console.log(data);
    
    const result = createUserSchema.safeParse(data);
    if (!result.success) {
        return {
            status: 400,
            errors: result.error.flatten().fieldErrors,
            message: "Invalid field found",
        };
    }

    try {
        const response = await UserService.inviteUser(result.data);
        console.log(response.data);
        return {
            status: 200,
            message: "Success",
            success: true,
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
export async function InviteLawyer(_prevState: unknown, formData: FormData) {
    const data = Object.fromEntries(formData);
    const result = createLawyerSchema.safeParse(data);
    if (!result.success) {
        return {
            status: 400,
            errors: result.error.flatten().fieldErrors,
            message: "Invalid field found",
        };
    }
    console.log(result.data);
    try {
        const response = await UserService.inviteUser(result.data);
        console.log(response.data);
        return {
            status: 200,
            message: "Success",
            success: true,
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
export async function UpdateLawyer(_prevState: unknown, formData: FormData) {
    const data = Object.fromEntries(formData);
    const result = createLawyerSchema.safeParse(data);
    if (!result.success) {
        return {
            status: 400,
            errors: result.error.flatten().fieldErrors,
            message: "Invalid field found",
        };
    }
    console.log(result.data);
    try {
        if (!result.data?.id || typeof result.data.id !== "string") {
            return {
                status: 400,
                message: "Lawyer ID is required and must be a string.",
                errors: { id: ["Lawyer ID is missing or invalid."] },
                success: false,
            };
        }
        const response = await UserService.updateLawyers(result.data, result.data.id);
        console.log(response.data);
        return {
            status: 200,
            message: "Success",
            success: true,
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
export async function DeleteUser(_prevState: unknown, formData: FormData) {
    const data = Object.fromEntries(formData);
    console.log(data);
    try {
        let response;
        if (data?.type === "delete") {
            response = await UserService.deleteUser(typeof data?.id === "string" ? data.id : "");
        } else {
            response = await UserService.suspendUser(typeof data?.id === "string" ? data.id : "");
        }
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
export async function ApproveRejectLawyerRequest(_prevState: unknown, formData: FormData) {
    const data = Object.fromEntries(formData);
    console.log(data);
    try {
        let response;
        const id = typeof data?.id === "string" ? data.id : "";
        console.log(id);
        if (data?.type == "approve") {
            response = await UserService.apporveUser(data, id);
        } else {
            response = await UserService.rejectUser(data, id);
        }
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






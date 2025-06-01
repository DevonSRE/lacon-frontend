"use server";

import { ROLES } from "@/types/auth";
import { createSession, LoginResponseData } from "@/server/auth";
import { ErrorResponse } from "@/lib/auth";
import AuthService, { LoginFormSchema } from "./service";
import { redirect } from "next/navigation";
import { defaultLoginRedirect } from "@/routes";

export async function SignInAction(_prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData);

  const result = LoginFormSchema.safeParse(data);
  if (!result.success) {
    return {
      status: 400,
      errors: result.error.flatten().fieldErrors,
      message: "Invalid Email Address",
    };
  }
  let role: ROLES;
  try {
    const res = await AuthService.loginUser(result.data);
    const data = res.data as LoginResponseData; //Cast to the expected type
    console.log("Login response data:", data);
    const sessionData = {
      user: {
        id: data.ID,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        role: data.role as ROLES,
      },
      token: data.token,
    };
    role = sessionData.user.role;
    await createSession(sessionData);
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
  redirect(defaultLoginRedirect(role));
}



export async function SignUp() { }

export async function ResetPassword() { }

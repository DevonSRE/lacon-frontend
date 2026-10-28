"use server";

import { ROLES } from "@/types/auth";
import { createSession, deleteSession, LoginResponseData } from "@/server/auth";
import { ErrorResponse } from "@/lib/auth";
import AuthService, { EMailFormSchema, InvitationFormSchema, LoginFormSchema, OTPFormSchema, ResetPasswordScheme } from "./service";
import { redirect } from "next/navigation";
import { defaultLoginRedirect } from "@/routes";
import { cookies } from "next/headers";
import { NEXT_BASE_URL } from "@/lib/constants";
import { handleApiError } from "@/lib/utils";
import z from "zod";

const temporaryInviteCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 15 * 60,
};

const clearTemporaryInviteCookies = async () => {
  const cookieStore = await cookies();
  for (const name of ["TempToken", "TempID", "TempRole", "TempEmail"]) {
    cookieStore.delete(name);
  }
};

export async function validateInvitationAction(email: string, otp: string) {
  const parsed = z.object({
    email: z.string().trim().email(),
    otp: z.string().regex(/^\d{6}$/),
  }).safeParse({ email, otp });

  if (!parsed.success) {
    return { status: 400, success: false, message: "This invitation is invalid or has expired." };
  }

  const cookieStore = await cookies();
  const existingToken = cookieStore.get("TempToken")?.value;
  const existingEmail = cookieStore.get("TempEmail")?.value;
  if (existingToken && existingEmail === parsed.data.email) {
    return { status: 200, success: true, message: "Invitation verified.", role: cookieStore.get("TempRole")?.value ?? "" };
  }

  await clearTemporaryInviteCookies();
  try {
    const response = await AuthService.acceptInvite(parsed.data);
    const responseData = response.data as { token: string; id: string; role: ROLES };
    cookieStore.set("TempToken", responseData.token, temporaryInviteCookieOptions);
    cookieStore.set("TempID", responseData.id, temporaryInviteCookieOptions);
    cookieStore.set("TempRole", responseData.role, temporaryInviteCookieOptions);
    cookieStore.set("TempEmail", parsed.data.email, temporaryInviteCookieOptions);
    return { status: 200, success: true, message: "Invitation verified.", role: String(responseData.role ?? "") };
  } catch {
    return {
      status: 400,
      success: false,
      message: "This invitation is invalid or has expired. Ask an administrator for a new invitation.",
    };
  }
}

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
    const sessionData = {
      user: {
        id: data.ID,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        id_image: data.id_image,
        state_id: (data.state_id != "00000000-0000-0000-0000-000000000000") ? data.state_id : "",
        state_name: data.state_name,
        zone_id: data.zone_id,
        zone_name: data.zone_name,
        department_name: data.department_name ?? "",
        role: data.role as ROLES,
      },
      token: data.token,
    };
    role = sessionData.user.role;
    await createSession(sessionData);
  } catch (err: unknown) {
    const error = err as ErrorResponse;
    console.error("Login failed:", error?.response?.status);
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

export async function invitationAction(_prevState: unknown, formData: FormData) {
  // Extract form data
  const data = Object.fromEntries(formData.entries());

  const result = InvitationFormSchema.safeParse(data);
  if (!result.success) {
    console.error("Validation errors:", result.error.flatten().fieldErrors);
    return {
      status: 400,
      errors: result.error.flatten().fieldErrors,
      message: "Validation failed, please check input fields",
    };
  }

  let token = (await cookies()).get("TempToken")?.value;
  let id = (await cookies()).get("TempID")?.value;
  let role = (await cookies()).get("TempRole")?.value as ROLES | undefined;
  const tempEmail = (await cookies()).get("TempEmail")?.value;

  if (tempEmail !== data.email) {
    await clearTemporaryInviteCookies();
    token = undefined;
    id = undefined;
    role = undefined;
  }

  if (!token || !id || !role) {
    try {
      const response = await AuthService.acceptInvite({
        otp: data.otp as string,
        email: data.email as string,
      });

      const responseData = response.data as { token: string; id: string; role: ROLES };
      (await cookies()).set("TempToken", responseData.token, temporaryInviteCookieOptions);
      (await cookies()).set("TempID", responseData.id, temporaryInviteCookieOptions);
      (await cookies()).set("TempRole", responseData.role, temporaryInviteCookieOptions);
      (await cookies()).set("TempEmail", data.email as string, temporaryInviteCookieOptions);
      token = responseData.token;
      id = responseData.id;
      role = responseData.role;
    } catch (err) {
      console.error("Error updating user:", err);
      return handleApiError(err);
    }
  }

  try {
    const url = `${NEXT_BASE_URL}/users/${id}`;
    const datax = {
      password: data.password as string,
      confirm_password: data.confirm_password as string,
    };
    const signupResponse = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(datax),
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!signupResponse.ok) {
      const errorData = await signupResponse.json();
      console.error("Signup error:", errorData);
      throw {
        response: {
          status: signupResponse.status,
          data: errorData,
        },
      };
    } else {
      const loginResponse = await AuthService.loginUser({
        email: data.email as string,
        password: result.data.password,
      });
      const loginData = loginResponse.data as LoginResponseData;
      const sessionData = {
        user: {
          id: loginData.ID,
          email: loginData.email,
          first_name: loginData.first_name,
          last_name: loginData.last_name,
          phone_number: loginData.phone_number,
          state_id: loginData.state_id !== "00000000-0000-0000-0000-000000000000" ? loginData.state_id : "",
          id_image: loginData.id_image ?? "",
          state_name: loginData.state_name ?? "",
          zone_id: loginData.zone_id ?? "",
          zone_name: loginData.zone_name ?? "",
          department_name: loginData.department_name ?? "",
          role: loginData.role as ROLES,
        },
        token: loginData.token,
      };
      await createSession(sessionData);
      role = loginData.role as ROLES;
      await clearTemporaryInviteCookies();
    }
  } catch (err) {
    console.error("Error updating user:", err);
    return handleApiError(err);
  }
  redirect(defaultLoginRedirect(role as ROLES));
}



export async function ForgotPasswordAction(
  _prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData);
  const result = EMailFormSchema.safeParse(data);
  if (!result.success) {
    return {
      status: 400,
      errors: result.error.flatten().fieldErrors,
      message: "",
      success: false,
    };
  }
  try {
    await AuthService.forgotPassword(result.data);
    (await cookies()).set("otpEmail", result.data.email);
  } catch (err: unknown) {
    const error = err as ErrorResponse;
    if (error?.response) {
      return {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.data?.error ?? error.response.data.error,
        success: false,
      };
    } else if (error.request) {
      return {
        status: 504,
        message: "Something went wrong. Please try again.",
        errors: "Unable to process request.",
        success: false,
      };
    } else {
      return {
        status: 500,
        message: error.message,
        errors: error.message,
        success: false,
      };
    }
  }
  // return { redirectUrl: "/password-otp" };
  redirect("/password/password-otp");
}

export async function logoutAction() {
  deleteSession();

  redirect("/signin");
}

export async function verifyOTP(_prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData);
  const result = OTPFormSchema.safeParse(data);
  if (!result.success) {
    return {
      status: 400,
      errors: result.error.flatten
        ().fieldErrors,
      message: "",
    };
  }
  try {
    const email = (await cookies()).get("otpEmail")?.value; // Ensure correct cookie handling
    if (!email) {
      return {
        status: 400,
        message: "Email not found in session. Please restart the process.",
        errors: "Missing email.",
      };
    }
    // api
    const res = await AuthService.verifyOtp({
      otp: result.data.otp,
      email: email,
    });

    const data = res.data as LoginResponseData;
    (await cookies()).set("TempToken", data.token);
  } catch (err: unknown) {
    const error = err as ErrorResponse;
    return {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to verify OTP.",
      errors: error?.response?.data?.errors || "An unknown error occurred.",
    };
  }
  redirect("/password/reset-password");
}

export async function changePassword(_prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData);
  const result = z.object({
    oldPassword: z.string()
      .min(1, { message: "Password field must not be empty." }),
    newPassword: z.string().min(1, { message: "Password field must not be empty." }),
  })
    .safeParse(data);

  if (!result.success) {
    return {
      status: 400,
      errors: result.error.flatten().fieldErrors,
      message: "",
    };
  }

  try {
    const email = (await cookies()).get("otpEmail")?.value;
    if (!email) {
      return {
        status: 400,
        message: "Email not found in session. Please restart the process.",
        errors: "Missing email.",
      };
    }
    await AuthService.changePassword({
      old_password: result.data.oldPassword,
      new_password: result.data.newPassword,
      email: email,
    });
    // If OTP is correct, clear the session/cookie
    (await
      // If OTP is correct, clear the session/cookie
      cookies()).delete("otpEmail");
  } catch (err: unknown) {
    const error = err as ErrorResponse;
    console.error("Failed to verify OTP:", error);
    return {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to verify OTP.",
      errors: error?.response?.data?.errors || "An unknown error occurred.",
    };
  }
  redirect("/password/reset-password");
}

export async function resetPassword(_prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData);
  const result = ResetPasswordScheme.safeParse(data);
  if (!result.success) {
    return {
      status: 400,
      errors: result.error.flatten().fieldErrors,
      message: "",
      success: false,
    };
  }
  try {
    const email = (await cookies()).get("otpEmail")?.value;
    if (!email) {
      return {
        status: 400,
        message: "Email not found in session. Please restart the process.",
        errors: "Missing email.",
        success: false,
      };
    }
    await AuthService.resetPassword({
      new_password: result.data.newPassword,
      confirm_password: result.data.confirmPassword,
      email: email,
    });
    // cookies().delete("otpEmail");
    // cookies().delete("TempToken");
    return {
      status: 200,
      message: "Password has been successfuly changed, Please Login.",
      success: true,
    };
  } catch (err: unknown) {
    const error = err as ErrorResponse;
    console.error("Failed to reset password:", error);
    return {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to reset password.",
      errors: error?.response?.data?.errors || "An unknown error occurred.",
      success: false,
    };
  }
  redirect("/signin");
}



export async function reSendOtpAction(_prevState: unknown, formData: FormData) {
  try {
    const email = (await cookies()).get("otpEmail")?.value;
    if (!email) {
      return {
        status: 400,
        message: "Email not found in session. Please restart the process.",
        errors: "Missing email.",
        success: false,  // Ensure success is always included
      };
    }
    const res = await AuthService.resendOtp({ email });
    return {
      status: 200,
      message: "Email sent successfully.",
      success: true,  // Ensure success is always included
    };

  } catch (err: unknown) {
    return handleApiError(err);  // handleError now always includes `success`
  }
}

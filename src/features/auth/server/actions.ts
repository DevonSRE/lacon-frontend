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
        id_image: data.id_image,
        state_id: (data.state_id != "00000000-0000-0000-0000-000000000000") ? data.state_id : "",
        state_name: data.state_name,
        zone_id: data.zone_id,
        zone_name: data.zone_name,
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

export async function invitationAction(_prevState: unknown, formData: FormData) {
  // Extract form data
  const data = Object.fromEntries(formData.entries());
  console.log(JSON.stringify(data));

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
  let role = (await cookies()).get("TempRole")?.value as ROLES;

  if (!token || !id || !role) {
    try {
      const response = await AuthService.acceptInvite({
        otp: data.otp as string,
        email: data.email as string,
      });
      console.log(response);

      const responseData = response.data as { token: string; id: string; role: ROLES };
      console.log(responseData.token);
      console.log(responseData.id);
      console.log(responseData.role);
      (await cookies()).set("TempToken", responseData.token);
      (await cookies()).set("TempID", responseData.id);
      (await cookies()).set("TempRole", responseData.role);
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
    console.log("Updating user with ID:", url);
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
      const data = await signupResponse.json();
      const sessionData = {
        user: {
          id: data.data.id,
          email: data.data.email,
          first_name: data.data.first_name,
          last_name: data.data.last_name,
          phone_number: data.data.phone_number,
          state_id: data.state_id ?? "",
          id_image: data.id_image ?? "",
          state_name: data.state_name ?? "",
          zone_id: data.zone_id ?? "",
          zone_name: data.zone_name ?? "",
          role: data.data.user_type as ROLES,
        },
        token: token,
      };
      console.log(sessionData);
      await createSession(sessionData);
      (await cookies()).delete("TempToken");
    }
  } catch (err) {
    console.error("Error updating user:", err);
    return handleApiError(err);
  }
  redirect(defaultLoginRedirect(role));
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
  console.log(result.data);
  try {
    const response = await AuthService.forgotPassword(result.data);
    console.log(response);
    (await cookies()).set("otpEmail", result.data.email);
  } catch (err: any) {
    if (err?.response) {
      return {
        status: err.response.status,
        message: err.response.data.message,
        errors: err.response.data.data['error'],
        success: false,
      };
    } else if (err.request) {
      return {
        status: 504,
        message: "Something went wrong. Please try again.",
        errors: "Unable to process request.",
        success: false,
      };
    } else {
      return {
        status: 500,
        message: err.message,
        errors: err.message,
        success: false,
      };
    }
  }
  // return { redirectUrl: "/password-otp" };
  redirect("/password/password-otp");
}

export async function logoutAction() {
  deleteSession();
  redirect("/login");
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
    console.log(res);

    const data = res.data as LoginResponseData;
    (await cookies()).set("TempToken", data.token);
  } catch (err: any) {
    return {
      status: err?.response?.status || 500,
      message: err?.response?.data?.message || "Failed to verify OTP.",
      errors: err?.response?.data?.errors || "An unknown error occurred.",
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
  } catch (err: any) {
    console.error("Failed to verify OTP:", err);
    return {
      status: err?.response?.status || 500,
      message: err?.response?.data?.message || "Failed to verify OTP.",
      errors: err?.response?.data?.errors || "An unknown error occurred.",
    };
  }
  redirect("/reset-password");
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
    const token = (await cookies()).get("TempToken")?.value;
    console.log("my temp toke" + token);

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
  } catch (err: any) {
    console.error("Failed to reset password:", err);
    return {
      status: err?.response?.status || 500,
      message: err?.response?.data?.message || "Failed to reset password.",
      errors: err?.response?.data?.errors || "An unknown error occurred.",
      success: false,
    };
  }
  redirect("/login");
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

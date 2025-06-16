import { authConfig, authTemp,  } from "@/lib/_api/auth-config";
import z from "zod";


export const LoginFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password field must not be empty." }),
});

export type TLoginFormPayload = z.infer<typeof LoginFormSchema>;

export const EMailFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
});

export type TForogotPayload = z.infer<typeof EMailFormSchema>;

export const OTPFormSchema = z.object({
    otp: z.string().min(6, { message: "Min of 6 digit." }).trim(),
});

export const ResetPasswordScheme = z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirm_password"],
    });



export const InvitationFormSchema = z.object({
    password: z
        .string()
        .min(8, { message: "Passwword Must contain at least 8 characters long" })
        .regex(/[a-zA-Z]/, { message: "Passwword Must contain  at least one letter." })
        .regex(/[0-9]/, { message: "Passwword Must contain  at least one number." })
        .trim(),
    confirm_password: z.string().trim(),
})
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"],
    });


const AuthService = {
    async loginUser(payload: TLoginFormPayload) {
        return await authConfig.post("/auth/login", payload);
    },
    async acceptInvite(payload: { email: string, otp: string }) {
        return await authConfig.get(`/users/accept-invite/${payload.email}/${payload.otp}`);
    },



    async forgotPassword(payload: TForogotPayload) {
        return await authConfig.post("/auth/forgot-password", payload);
    },

    async logout(payload: { refresh: string }) {
        return await authConfig.post("/auth/blacklist", payload);
    },
    async verifyOtp(payload: { otp: string; email: string }) {
        return await authConfig.post("/auth/verify-otp", payload);
    },
    async resendOtp(payload: { email: string }) {
        return await authConfig.post("/auth/resend-otp", payload);
    },


    async resetPassword(payload: {email: string;new_password: string;confirm_password: string;}) {
        return await authTemp.post("/auth/reset-password", payload);
    },

    async changePassword(payload: {
        old_password: string;
        new_password: string;
        email: string;
    }) {
        return await authConfig.post("/auth/change-password", payload);
    },


}

export default AuthService;

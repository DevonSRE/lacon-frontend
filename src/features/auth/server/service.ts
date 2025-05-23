import { authConfig } from "@/lib/_api/auth-config";
import z from "zod";


export const LoginFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password field must not be empty." }),
});

export type TLoginFormPayload = z.infer<typeof LoginFormSchema>;

const AuthService = {
    async loginUser(payload: TLoginFormPayload) {
        return await authConfig.post("/auth/login", payload);
    },
}

export default AuthService;

'use client'
import { useFormState } from "react-dom";
import { toast } from "sonner"
import { redirect } from "next/navigation";
import { LoginPasswordField } from "@/components/passwordField";
import { resetPassword } from "./server/actions";
import { SubmitButton } from "@/components/submit-button";
import { useActionState } from "react";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";

const ResetPaswordComponent = () => {
    const [state, dispatch, isPending] = useActionState(resetPassword, undefined);
    useEffectAfterMount(() => {
        if (state?.success) {
            toast.success(state.message);
            redirect("/login");
        }
        if (state?.message && !state.success) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <>
            <div className="heading">
                <p className="font-bold text-3xl text-app-primary text-center">Recover Your Account</p>
                <p className="text-center text-xs space-x-2 mt-3">
                    <span className="text-muted text-center text-sm text-bold text-gray-400">Enter Your New Password.</span>
                </p>
            </div>

            <form className="w-full space-y-6" action={dispatch}>
                <LoginPasswordField label="NEW PASSWORD" name="newPassword" id="newPassword" placeholder="Enter Password" showStrength={true} />
                <LoginPasswordField label="CONFIRM PASSWORD" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" />
                <p className="text-xs text-red-500 h-2 text-center">
                    {state && state?.message}
                </p>
                <SubmitButton loading={isPending} value="SUBMIT" pendingValue="Processing..." className="w-full bg-app-primary hover:bg-app-secondary/90 text-white h-12 rounded mt-2" />
            </form>
        </>
    );
};

export { ResetPaswordComponent };

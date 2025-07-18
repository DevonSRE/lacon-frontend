'use client'
import { toast } from "sonner"
import { redirect } from "next/navigation";
import { LoginPasswordField } from "@/components/passwordField";
import { resetPassword } from "./server/actions";
import { SubmitButton } from "@/components/submit-button";
import { useActionState } from "react";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";
import Image from 'next/image';
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";



const ResetPaswordComponent = () => {
    const router = useRouter();

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
        <div className="flex h-screen bg-white">
            {/* Left side with logo */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 m-8 rounded-xl items-center justify-center">
                <Image src="/logo.png" alt="Logo" width={150} height={150} />
            </div>
            {/* Right side with form */}
            <div className="flex flex-col items-center lg:w-1/2 w-full justify-center px-4">
                <div className="flex justify-end w-full lg:w-1/2 lg:m-8  top-10">
                    <button
                        onClick={() => router.back()}
                        className=" top-6 left-6 text-white  hover:text-black bg-red-100 p-4 rounded-full mb-4">
                        <ArrowLeft size={28} className="text-red-500" />
                    </button>
                </div>
                <div className="flex flex-col w-full lg:w-1/2 lg:m-8 justify-center gap-8">
                    <div className="heading">
                        {/* <p className="font-bold text-3xl text-app-primary text-center"> */}
                        <p className="font-bold text-2xl text-app-primary text-center">
                            Recover Your Account
                        </p>
                        <p className="text-center text-xs space-x-2 mt-3">
                            <span className="text-center text-sm text-bold text-gray-400">Enter Your New Password.</span>
                        </p>
                    </div>
                    <form className="w-full space-y-6" action={dispatch}>
                        <LoginPasswordField label="NEW PASSWORD" name="newPassword" id="newPassword" placeholder="Enter Password" showStrength={true} />
                        <LoginPasswordField label="CONFIRM PASSWORD" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" />
                        <p className="text-xs text-red-500 h-2 text-center">
                            {state && state?.message}
                        </p>
                        <SubmitButton loading={isPending} value="SUBMIT" pendingValue="Processing..." className="w-full  bg-red-500 hover:bg-red-600 text-white h-12 rounded mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export { ResetPaswordComponent };

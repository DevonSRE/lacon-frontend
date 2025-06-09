"use client";
import { SubmitButton } from "@/components/submit-button";
import { useFormState } from "react-dom";
import { toast } from "sonner"
import InputField from "@/components/form/input/InputField";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";
import { ForgotPasswordAction } from "./server/actions";
import Image from 'next/image';
import { useActionState } from "react";


const FORGOT = () => {
    const [state, dispatch, isPending] = useActionState(ForgotPasswordAction, undefined);
    useEffectAfterMount(() => {
        if (state?.message && !state.success) {
            toast.error(state.errors);
        }
    }, [state]);
    return (
        <div className="flex h-screen bg-white">
            {/* Left side with logo */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 m-8 rounded-xl items-center justify-center">
                <Image src="/logo.png" alt="Logo" width={150} height={150} />
            </div>
            {/* Right side with form */}
            <div className="flex items-center lg:w-1/2 w-full justify-center px-4">
                <div className="flex flex-col w-full lg:w-1/2 lg:m-8 justify-center gap-8">
                    <div className="heading">
                        <p className="font-bold text-3xl text-app-primary text-center">
                            FORGOT PASSWORD
                        </p>
                        <p className="text-center text-xs space-x-2 mt-3">
                            <span className="text-center text-sm text-bold text-gray-400">
                                Enter your account&apos;s email and we&apos;ll send you an email to
                                reset your password
                            </span>
                        </p>
                    </div>
                    <form action={dispatch} className="w-full space-y-8">
                        <InputField
                            id="email"
                            type="email"
                            name="email"
                            placeholder="name@gmail.com"
                            required
                            className={`mt-1 block w-full rounded-md px-3 shadow-sm focus:outline-none sm:text-sm  "border-gray-300"}`}
                            label="Email"
                        />
                        <SubmitButton
                            value="SEND EMAIL"
                            loading={isPending}
                            pendingValue="Processing..."
                            className="w-full  bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-2"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FORGOT;

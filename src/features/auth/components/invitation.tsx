'use client'
import { useActionState, useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import Input from '@/components/form/input/InputField';
import { useFormState } from 'react-dom';
import { invitationAction } from '../server/actions';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import { toast } from "sonner";
import { SubmitButton } from '@/components/submit-button';
import { Checkbox } from '@/components/ui/checkbox';
import PasswordValidation from '@/components/PasswordValidation';
import InputField from '@/components/form/input/InputField';

export default function InvitationForm() {
    const searchParams = useSearchParams();
    const otp = searchParams.get("otp") ?? ""; // Provide a default value if otp is null
    const email = searchParams.get("email") ?? "";
    const encodedEmail = email.replace(/ /g, "+");
    const [submitFailed, setSubmitFailed] = useState(false);
    const [state, dispatch, isPending] = useActionState(invitationAction, undefined);
    const [acceptTerms, setAcceptTerms] = useState(false);


    useEffectAfterMount(() => {
        if (state && CLIENT_ERROR_STATUS.includes(state?.status)) {
            toast.error(state?.message, {
                description: typeof state?.errors === "string"
                    ? state.errors
                    : state?.errors
                        ? Object.values(state.errors).flat().join(", ")
                        : undefined,
            });
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
                <div className="flex flex-col w-full lg:w-1/2 lg:m-8 justify-center gap-6">
                    <h2 className="text-2xl font-semibold mb-2">Welcome </h2>
                    <p className="text-gray-600 mb-6 text-md">
                        Enter your credentials to access the admin dashboard.
                    </p>
                    {/* <form className="space-y-4"> */}
                    <form action={dispatch} className="w-full space-y-8">
                        <input type='hidden' value={otp} name="otp" />
                        <div>
                            <Label className="">Email Address</Label>
                            <InputField
                                type="email"
                                name='email'
                                value={email}
                                className="w-full px-4 py-2"
                                placeholder="example@email.com"
                                readOnly
                            />
                        </div>
                        <div className='space-y-8'>
                            <PasswordValidation resetValidation={submitFailed} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="terms"
                                checked={acceptTerms}
                                onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                            />

                            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                Accept terms and conditions
                            </label>
                        </div>

                        <SubmitButton
                            value="SIGN IN"
                            loading={isPending}
                            pendingValue="Processing..."
                            disabled={!acceptTerms}
                            className="w-full h-12  bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-2"
                        />

                    </form>
                </div>
            </div>
        </div>
    );
}


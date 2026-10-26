'use client'
import { useActionState, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { invitationAction, validateInvitationAction } from '../server/actions';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { toast } from "sonner";
import { SubmitButton } from '@/components/submit-button';
import { Checkbox } from '@/components/ui/checkbox';
import PasswordValidation from '@/components/PasswordValidation';
import InputField from '@/components/form/input/InputField';
import { submitWithoutReset } from '@/lib/submit-without-reset';

export default function InvitationForm() {
    const searchParams = useSearchParams();
    const otp = searchParams.get("otp") ?? searchParams.get("code") ?? "";
    const email = searchParams.get("email") ?? "";
    const [state, dispatch, isPending] = useActionState(invitationAction, undefined);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [inviteStatus, setInviteStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
    const [inviteMessage, setInviteMessage] = useState('Checking your invitation…');
    const validationKey = useRef<string | null>(null);

    useEffect(() => {
        const key = `${email}:${otp}`;
        if (validationKey.current === key) return;
        validationKey.current = key;

        validateInvitationAction(email, otp).then((result) => {
            if (validationKey.current !== key) return;
            setInviteStatus(result.success ? 'valid' : 'invalid');
            setInviteMessage(result.message);
        });
    }, [email, otp]);


    useEffectAfterMount(() => {
        if (state && state.status >= 400) {
            toast.error(state?.message, {
                description: typeof state?.errors === "string"
                    ? state.errors
                    : state?.errors
                        ? Object.values(state.errors).flat().join(", ")
                        : undefined,
            });
        }
    }, [state]);

    if (inviteStatus !== 'valid') return (
        <div className="flex h-screen bg-white">
            <div className="hidden lg:flex w-1/2 bg-gray-900 m-8 rounded-xl items-center justify-center">
                <Link href="/" aria-label="Go to home page">
                    <Image src="/logo.png" alt="Logo" width={150} height={150} />
                </Link>
            </div>
            <div className="flex items-center lg:w-1/2 w-full justify-center px-4">
                <div role={inviteStatus === 'invalid' ? 'alert' : 'status'} className="w-full max-w-md rounded-lg border p-6 text-center">
                    <h1 className="text-xl font-semibold">
                        {inviteStatus === 'checking' ? 'Checking invitation' : 'Invitation unavailable'}
                    </h1>
                    <p className="mt-3 text-sm text-gray-600">{inviteMessage}</p>
                    {inviteStatus === 'invalid' && (
                        <Link href="/signin" className="mt-6 inline-flex rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                            Go to Sign In
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-white">
            {/* Left side with logo */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 m-8 rounded-xl items-center justify-center">
                <Link href="/" aria-label="Go to home page">
                    <Image src="/logo.png" alt="Logo" width={150} height={150} />
                </Link>
            </div>
            {/* Right side with form */}
            <div className="flex items-center lg:w-1/2 w-full justify-center px-4">
                <div className="flex flex-col w-full lg:w-1/2 lg:m-8 justify-center gap-6">
                    <h2 className="text-2xl font-semibold mb-2">Welcome </h2>
                    <p className="text-gray-600 mb-6 text-md">
                        Enter your credentials to access the admin dashboard.
                    </p>
                    {/* <form className="space-y-4"> */}
                    <form onSubmit={submitWithoutReset(dispatch)} className="w-full space-y-8">
                        <input type='hidden' value={otp} name="otp" />
                        {!isPending && state && state.status >= 400 && (
                            <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                <p>{state.message || "Account setup could not be completed."}</p>
                                {state.errors && (
                                    <p>
                                        {typeof state.errors === "string"
                                            ? state.errors
                                            : Object.values(state.errors).flat().join(". ")}
                                    </p>
                                )}
                                {state.status >= 500 && <p>Please wait a moment and try again.</p>}
                            </div>
                        )}
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
                            <PasswordValidation />
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


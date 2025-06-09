'use client';

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";
import { reSendOtpAction, verifyOTP } from "./server/actions";
import { CLIENT_ERROR_STATUS } from "@/lib/constants";
import { SubmitButton } from "@/components/submit-button";
import CustomOtpInput from "@/components/CustomOtpInput";



export default function PASSWORDOTPCOMPONENT({ email }: { email: string }) {
    const [state, dispatch] = useFormState(verifyOTP, undefined);
    const [timeLeft, setTimeLeft] = useState(60 * 5);
    const [otpState, dispatchOTP] = useFormState(reSendOtpAction, undefined);
    const [isResending, setIsResending] = useState(false);
    const [otp, setOtp] = useState('');


    useEffectAfterMount(() => {
        if (state && CLIENT_ERROR_STATUS.includes(state?.status)) {
            toast.error(state?.message);
        }
    }, [state]);

    useEffect(() => {
        if (otpState && 'success' in otpState) {
            if (otpState.success) {
                toast.success(otpState.message);
                setTimeLeft(60 * 5);
            } else {
                toast.error(otpState.message);
            }
            setIsResending(false);
        }
    }, [otpState]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleResendOTP = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsResending(true);
        const formData = new FormData();
        dispatchOTP(formData);
    };

    return (

        <div className="flex flex-col text-center justify-center items-center space-y-6">
            <p className="text-app-primary text-2xl sm:text-3xl font-bold">
                Check your email for a code
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
                We&apos;ve sent a 6-character code to <b>{email}</b>. <br />
                The code expires shortly, so please enter it soon.
            </p>
            <form action={dispatch} className="space-y-6">
                <input type="hidden" name="otp" value={otp} />
                <CustomOtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    shouldAutoFocus
                />

                <SubmitButton value="PROCEED" pendingValue="Processing..." className="w-full bg-app-primary hover:bg-app-secondary/90 text-white h-12 rounded mt-2" />
            </form>

            <div className="space-y-2 mt-6">
                <p className="text-xs sm:text-sm text-gray-500">
                    Didn&apos;t get the code?
                </p>
                <p className="text-xl font-bold text-gray-500">{formatTime(timeLeft)}</p>
                <div className="flex items-center justify-center">
                    <div className="items-center text-app-primary group relative">
                        <form onSubmit={handleResendOTP}>
                            <input type="hidden" name="otp" />
                            <button
                                type="submit"
                                className={`text-xs text-center font-bold mt-3 z-10 cursor-pointer ${timeLeft > 0 || isResending ? 'text-gray-400 cursor-not-allowed' : 'text-app-primary'}`}
                                disabled={timeLeft > 0 || isResending}
                            >
                                {isResending ? 'Resending...' : 'Resend Code'}
                            </button>
                        </form>
                        <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-app-primary transform -translate-x-1/2 transition-all duration-300 group-hover:w-32 group-hover:bg-app-secondary"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { PASSWORDOTPCOMPONENT };


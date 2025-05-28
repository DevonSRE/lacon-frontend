
'use client'
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Icons } from '@/icons/icons';
import Button from '@/components/ui/button/Button';
import { Label } from '@/components/ui/label';
import Input from '@/components/form/input/InputField';
import { useFormState } from 'react-dom';
import { SignInAction } from '../server/actions';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import { toast } from "sonner";
import { isFieldErrorObject } from '@/types/auth';
import { LoginPasswordField } from '@/components/passwordField';
import { SubmitButton } from '@/components/submit-button';
import { Checkbox } from '@/components/ui/checkbox';
import PasswordValidation from '@/components/PasswordValidation';

export default function InvitationForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [state, dispatch] = useFormState(SignInAction, undefined);
    const [formDisabled, setFormDisabled] = useState(false);
    const [email, setEmail] = useState("");
    const router = useRouter();
    const errors = isFieldErrorObject(state?.errors)
        ? state.errors
        : {} as Record<string, string[]>;

    useEffect(() => {
        router.refresh(); // Forces Next.js to refresh the page
    }, []);
    // Handle errors
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

    // Reset form when logging out
    useEffect(() => {
        if (!state) {
            setFormDisabled(false);
        }
    }, [state]);

    useEffect(() => {
        setEmail((prev) => prev.trimStart().replace(/\s+/g, ""));
    }, [email]); // Runs every time `email` updates

    return (
        <div className="flex h-screen bg-white">
            {/* Left side with logo */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 m-8 rounded-xl items-center justify-center">
                <Image src="/logo.png" alt="Logo" width={150} height={150} />
            </div>
            {/* Right side with form */}
            <div className="flex items-center lg:w-1/2 w-full justify-center px-4">
                <div className="flex flex-col w-full lg:w-1/2 lg:m-8 justify-center gap-6">
                    <h2 className="text-2xl font-semibold mb-2">Welcome David 👋</h2>
                    <p className="text-gray-600 mb-6 text-md">
                        Enter your credentials to access the admin dashboard.
                    </p>
                    {/* <form className="space-y-4"> */}
                    <form action={dispatch} className="w-full space-y-8">
                        <div>
                            <Label className="">Full Name</Label>
                            <Input
                                type="text"
                                name='fullName'
                                className="w-full px-4 py-2"
                                placeholder="Prime Tech"
                            />
                        </div>
                        <div>
                            <Label className="">Email Address</Label>
                            <Input
                                type="email"
                                name='email'
                                className="w-full px-4 py-2"
                                placeholder="example@email.com"
                            />
                        </div>
                        <div className='space-y-8'>
                            <PasswordValidation />
                            {/* <LoginPasswordField error={errors.password?.[0]} label="Create Password" placeholder='at Lease 8 Characters' showStrength={true} /> */}
                            {/* <LoginPasswordField error={errors.password?.[0]} label="Confirm Password" placeholder='at Lease 8 Characters' /> */}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Accept terms and conditions
                            </label>
                        </div>

                        <SubmitButton
                            value="SIGN IN"
                            pendingValue="Processing..."
                            className="w-full h-12  bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-2"
                        />


                    </form>
                </div>
            </div>
        </div>
    );
}

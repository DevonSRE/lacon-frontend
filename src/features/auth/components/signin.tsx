
'use client'
import { useActionState, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Icons } from '@/icons/icons';
import Button from '@/components/ui/button/Button';
import { SignInAction } from '../server/actions';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import { toast } from "sonner";
import { isFieldErrorObject, ROLES } from '@/types/auth';
import { LoginPasswordField } from '@/components/passwordField';
import { SubmitButton } from '@/components/submit-button';
import InputField from '@/components/form/input/InputField';
import Link from 'next/link';


export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, dispatch, isPending] = useActionState(SignInAction, undefined);
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

  // useEffect(() => {
  //   setEmail((prev) => prev.trimStart().replace(/\s+/g, ""));
  // }, [email]);

  return (
    <div className="flex h-screen bg-white">
      {/* Left side with logo */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 m-8 rounded-xl items-center justify-center">
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
      </div>
      {/* Right side with form */}
      <div className="flex items-center lg:w-1/2 w-full justify-center px-4">
        <div className="flex flex-col w-full lg:w-1/2 lg:m-8 justify-center gap-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome Admin 👋</h2>
          <p className="text-gray-600 mb-6 text-md">
            Enter your credentials to access the admin dashboard.
          </p>
          {/* <form className="space-y-4"> */}
          <form action={dispatch} className="w-full space-y-6">
            <InputField
              type="email"
              name='email'
              label='Email Address'
              className="w-full px-4 py-2"
              placeholder="example@email.com"
            />
            <div>
              <LoginPasswordField error={errors.password?.[0]} />
              <div className="text-right text-xs text-red-500 mt-1 cursor-pointer">
                <Link href="/password/forgot">
                  Forgot Password?
                </Link>
              </div>
            </div>


            <SubmitButton
              value="LOG IN"
              loading={isPending}
              pendingValue="Processing..."
              className="w-full  bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-2"
            />

            {/* <Button // type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md">Sign in</Button> */}

            <div className="flex items-center justify-center my-2 text-sm text-gray-500">
              <div className="border-t w-1/4" /> <span className="mx-2">Or</span>
              <div className="border-t w-1/4" />
            </div>

            {/* <Button variant="outline" className="w-full flex items-center gap-4 justify-center border py-2 rounded-md font-semibold " >
              <Icons.GogleIcon />
              Sign in with Google
            </Button> */}

            <div className="text-center text-sm mt-4">
              Request An Account Creation?{' '}
              <span className="text-red-600 font-semibold cursor-pointer">
                Send request!!
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

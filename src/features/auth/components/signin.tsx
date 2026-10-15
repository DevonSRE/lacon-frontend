
'use client'
import { useActionState } from 'react';
import Image from 'next/image';
import { SignInAction } from '../server/actions';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { toast } from "sonner";
import { isFieldErrorObject } from '@/types/auth';
import { LoginPasswordField } from '@/components/passwordField';
import { SubmitButton } from '@/components/submit-button';
import InputField from '@/components/form/input/InputField';
import Link from 'next/link';
import { submitWithoutReset } from '@/lib/submit-without-reset';


export default function SigninForm() {
  const [state, dispatch, isPending] = useActionState(SignInAction, undefined);

  const errors = isFieldErrorObject(state?.errors)
    ? state.errors
    : {} as Record<string, string[]>;

  // Handle errors
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

  // useEffect(() => {
  //   setEmail((prev) => prev.trimStart().replace(/\s+/g, ""));
  // }, [email]);

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
        <div className="flex flex-col w-full lg:w-1/2 lg:m-8 justify-center ">
          <h2 className="text-2xl font-semibold mb-2">Welcome</h2>
          <p className="text-gray-600 mb-6 text-md">
            Enter your credentials to access your dashboard.
          </p>
          {/* <form className="space-y-4"> */}
          <form onSubmit={submitWithoutReset(dispatch)} className="w-full space-y-6">
            {!isPending && state && state.status >= 400 && <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <p>{state.message}</p>
              {state.errors && <p>{typeof state.errors === "string" ? state.errors : Object.values(state.errors).flat().join(". ")}</p>}
            </div>}
            <InputField
              type="email"
              name='email'
              label='Email Address'
              required
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


import { PASSWORDOTPCOMPONENT } from "@/features/auth/passwordOtp";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PASSWORDOTP() {
  const cookieStore = cookies();
  const emailCookie = (await cookieStore).get("otpEmail");
  if (!emailCookie?.value) {
    redirect("/password/forgot");
  }

  return <PASSWORDOTPCOMPONENT email={emailCookie?.value ?? ""} />;

}

'use server'
import { cookies } from "next/headers";

export async function getOtpEmail() {
  const cookieStore = cookies();
  return (await cookieStore).get("otpEmail")?.value;
}

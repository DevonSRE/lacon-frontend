"use server";

import { SignJWT, jwtVerify } from "jose";
import { ALGORITHM, SECRET } from "@/lib/constants";
import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { redirect } from "next/navigation";
import { decodeToken } from "@/lib/utils";
import { ROLES, TSessionData } from "@/types/auth";

const key = new TextEncoder().encode(SECRET);
export interface LoginResponseData {
  sub_division: any;
  ID: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  court_type: string;
  court_division_id: string;
  court_divison: string;
  role: ROLES;
  token: string;
  state_id: string;
  state_name: string;
  zone_id: string;
  zone_name: string;
}



type TCookieHelper = {
  name: string;
  options: Partial<ResponseCookie>;
  duration: number;
};

const cookieHelper: TCookieHelper = {
  name: "session",
  options: {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  },
  duration: 24 * 60 * 60 * 1000,
};

// ✅ Exporting async functions individually
export async function encrypt(payload: any) {
  return new SignJWT(payload).setProtectedHeader({ alg: ALGORITHM }).sign(key);
}

export async function decrypt(session: any) {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: [ALGORITHM],
    });
    return payload;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

export async function verifySession() {
  const cookie = (await cookies()).get(cookieHelper.name)?.value;
  const session = await decrypt(cookie);
  return session as TSessionData | null;
}

export async function createSession(userData: TSessionData) {
  const decryptedToken = decodeToken(userData.token);
  const expires = decryptedToken.exp
    ? decryptedToken.exp * 1000
    : new Date(Date.now() + cookieHelper.duration);
  const session = await encrypt({ ...userData, expires });
  (await cookies()).set(cookieHelper.name, session, {
    ...cookieHelper.options,
    expires,
  });
}

export async function deleteSession() {
  (await cookies()).delete(cookieHelper.name);
  redirect("/signin");
}

export async function getUser() {
  const session = await verifySession();
  return session?.user?.id;
}

export async function getToken() {
  const session = await verifySession();
  return session?.token;
}

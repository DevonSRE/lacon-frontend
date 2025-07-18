"use server";

import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ALGORITHM, SECRET } from "@/lib/constants";
import { decodeToken } from "@/lib/utils";
import { ROLES, type TSessionData } from "@/types/auth";

const key = new TextEncoder().encode(SECRET);

export interface LoginResponseData {
  sub_division: unknown;
  ID: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  id_image: string;
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

const cookieConfig = {
  name: "session",
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  },
  maxAge: 24 * 60 * 60, // 24 hours in seconds
};

export async function encrypt(payload: TSessionData): Promise<string> {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: ALGORITHM })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(key);
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt session data");
  }
}

export async function decrypt(session: string | undefined): Promise<TSessionData | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: [ALGORITHM],
    });
    return payload as TSessionData;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

export async function verifySession(): Promise<TSessionData | null> {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get(cookieConfig.name)?.value;

  if (!sessionCookie) return null;

  const session = await decrypt(sessionCookie);
  if (!session) return null;

  // Validate expiration
  if (session.expires && new Date(session.expires) < new Date()) {
    await deleteSession();
    return null;
  }

  return session;
}

export async function createSession(userData: TSessionData): Promise<void> {
  try {
    const decryptedToken = decodeToken(userData.token);
    const expiresAt = decryptedToken.exp ? new Date(decryptedToken.exp * 1000) : new Date(Date.now() + cookieConfig.maxAge * 1000);

    const sessionToken = await encrypt({
      ...userData,
      expires: expiresAt.getTime(),
    });

    (await cookies()).set({
      ...cookieConfig.options,
      name: cookieConfig.name,
      value: sessionToken,
      expires: expiresAt,
    });
  } catch (error) {
    console.error("Session creation failed:", error);
    throw new Error("Failed to create session");
  }
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(cookieConfig.name);
  redirect("/signin");
}

export async function getUser(): Promise<string | undefined> {
  const session = await verifySession();
  return session?.user?.id;
}

export async function getToken(): Promise<string | undefined> {
  const session = await verifySession();
  return session?.token;
}

// "use server";
// import { SignJWT, jwtVerify } from "jose";
// import { ALGORITHM, SECRET } from "@/lib/constants";
// import { cookies } from "next/headers";
// import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
// import { redirect } from "next/navigation";
// import { decodeToken } from "@/lib/utils";
// import { ROLES, TSessionData } from "@/types/auth";

// const key = new TextEncoder().encode(SECRET);
// export interface LoginResponseData {
//   sub_division: any;
//   ID: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   phone_number: string;
//   court_type: string;
//   court_division_id: string;
//   court_divison: string;
//   role: ROLES;
//   token: string;
//   state_id: string;
//   state_name: string;
//   zone_id: string;
//   zone_name: string;
// }

// type TCookieHelper = {
//   name: string;
//   options: Partial<ResponseCookie>;
//   duration: number;
// };

// const cookieHelper: TCookieHelper = {
//   name: "session",
//   options: {
//     httpOnly: true,
//     secure: true,
//     sameSite: "strict",
//     path: "/",
//   },
//   duration: 24 * 60 * 60 * 1000,
// };

// // ✅ Exporting async functions individually
// export async function encrypt(payload: any) {
//   return new SignJWT(payload).setProtectedHeader({ alg: ALGORITHM }).sign(key);
// }

// export async function decrypt(session: any) {
//   try {
//     const { payload } = await jwtVerify(session, key, {
//       algorithms: [ALGORITHM],
//     });
//     return payload;
//   } catch (error) {
//     console.error("Decryption error:", error);
//     return null;
//   }
// }

// export async function verifySession() {
//   const cookie = (await cookies()).get(cookieHelper.name)?.value;
//   const session = await decrypt(cookie);
//   return session as TSessionData | null;
// }

// export async function createSession(userData: TSessionData) {
//   const decryptedToken = decodeToken(userData.token);
//   const expires = decryptedToken.exp
//     ? decryptedToken.exp * 1000
//     : new Date(Date.now() + cookieHelper.duration);
//   const session = await encrypt({ ...userData, expires });
//   (await cookies()).set(cookieHelper.name, session, {
//     ...cookieHelper.options,
//     expires,
//   });
// }

// export async function deleteSession() {
//   (await cookies()).delete(cookieHelper.name);
//   redirect("/signin");
// }

// export async function getUser() {
//   const session = await verifySession();
//   return session?.user?.id;
// }

// export async function getToken() {
//   const session = await verifySession();
//   return session?.token;
// }

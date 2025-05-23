"use server";
import { verifySession } from "./auth";

 // This marks the function as server-side only

export async function getSession() {
  const session = await verifySession();
  return session?.user ?? null;
}

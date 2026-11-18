"use server";

import { axiosInstance } from "@/lib/_api/axios-config";
import { isAxiosError } from "axios";
import { verifySession } from "@/server/auth";

/**
 * A lawyer changing their own maximum case load (QA 2026-11-16, row 72).
 *
 * The account's own id comes from the session, not from the screen: the API
 * allows this change on your own account only, and sending an id the caller
 * typed would be refused anyway.
 */
export async function setMyCaseLoad(
  maxLoad: string
): Promise<{ success: true } | { success: false; message: string }> {
  const session = await verifySession();
  const id = session?.user?.id;
  if (!id) {
    return { success: false, message: "Sign in again and try once more." };
  }
  try {
    await axiosInstance.patch(`/users/${id}`, { id, max_load: maxLoad.trim() });
    return { success: true };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const body = error.response?.data as
        | { message?: string; data?: { error?: string } }
        | undefined;
      return {
        success: false,
        message: body?.data?.error || body?.message || "Your case load could not be changed.",
      };
    }
    return { success: false, message: "Your case load could not be changed." };
  }
}

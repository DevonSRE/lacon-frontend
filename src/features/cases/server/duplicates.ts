"use server";

import { isAxiosError } from "axios";
import { axiosInstance } from "@/lib/_api/axios-config";
import type { DuplicateMatch } from "@/lib/duplicates";

/**
 * The earlier cases a filing may be repeating (T10).
 *
 * Asked before the case is created, so the filer sees the match while they can
 * still stop. A failure here never blocks a filing: the check is a warning,
 * not a gate, and a client who cannot be warned must still be able to file.
 */
export async function possibleDuplicates(
  email: string,
  phone: string,
): Promise<DuplicateMatch[]> {
  const params: Record<string, string> = {};
  if (email.trim() !== "") params.email = email.trim();
  if (phone.trim() !== "") params.phone = phone.trim();
  if (Object.keys(params).length === 0) return [];
  try {
    const response = await axiosInstance.get<{ data: DuplicateMatch[] | null }>(
      "/casefile/possible-duplicates",
      { params },
    );
    return response.data?.data ?? [];
  } catch (error) {
    if (!isAxiosError(error)) console.error("Duplicate check failed:", error);
    return [];
  }
}

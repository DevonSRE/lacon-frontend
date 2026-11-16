"use server";

import { axiosInstance } from "@/lib/_api/axios-config";
import { isAxiosError } from "axios";
import { z } from "zod";

/**
 * A pro bono lawyer's periodic case review (QA 2026-11-01 run 4, 13 Nov,
 * row 32).
 *
 * The form saved the cases and nothing else: Decongestion and the Director
 * General had nowhere to see that a review had arrived, and the lawyer was
 * given no reference. The API now records the review itself, and these are the
 * calls the screens make.
 */
export type ProbonoReviewCase = {
  id: string;
  client_name?: string;
  sex?: string;
  date_case_taken?: string | null;
  nature_of_service?: string;
  offering_charge?: string;
  suit_number?: string;
  status_of_case?: string;
  last_date_of_appearance?: string;
  is_client_in_custody?: boolean;
};

export type ProbonoReview = {
  id: string;
  reference: string;
  lawyer_name?: string;
  lawyer_email?: string;
  contact_address?: string;
  case_count?: number;
  status: string;
  decision_reason?: string;
  decided_by?: { name?: string; role?: string } | null;
  decided_at?: string | null;
  submitted_at?: string;
  cases?: ProbonoReviewCase[];
};

type Answer<T> = { success: true; data: T } | { success: false; message: string };

function said(error: unknown, fallback: string): { success: false; message: string } {
  if (isAxiosError(error)) {
    const body = error.response?.data as { message?: string; data?: { error?: string } } | undefined;
    return { success: false, message: body?.data?.error || body?.message || fallback };
  }
  return { success: false, message: fallback };
}

export async function listProbonoReviews(params: {
  page?: number;
  size?: number;
  status?: string;
  keyword?: string;
}): Promise<Answer<{ data: ProbonoReview[]; total_rows: number; total_pages: number; page: number }>> {
  try {
    const response = await axiosInstance.get("/users/probono-reviews", { params });
    const page = response.data?.data;
    return {
      success: true,
      data: {
        data: Array.isArray(page?.data) ? page.data : [],
        total_rows: page?.total_rows ?? 0,
        total_pages: page?.total_pages ?? 1,
        page: page?.page ?? 1,
      },
    };
  } catch (error) {
    return said(error, "The case reviews could not be loaded.");
  }
}

export async function getProbonoReview(id: string): Promise<Answer<ProbonoReview>> {
  if (!z.uuid().safeParse(id).success) return { success: false, message: "That is not a case review." };
  try {
    const response = await axiosInstance.get(`/users/probono-reviews/${id}`);
    return { success: true, data: response.data?.data };
  } catch (error) {
    return said(error, "The case review could not be loaded.");
  }
}

export async function decideProbonoReview(
  id: string,
  decision: "accepted" | "rejected",
  reason: string
): Promise<Answer<string>> {
  if (!z.uuid().safeParse(id).success) return { success: false, message: "That is not a case review." };
  if (decision === "rejected" && !reason.trim()) {
    return { success: false, message: "Enter a reason for rejecting this review." };
  }
  try {
    await axiosInstance.post(`/users/probono-reviews/${id}/decide`, { decision, reason: reason.trim() });
    return {
      success: true,
      data: decision === "accepted" ? "Case review accepted." : "Case review rejected.",
    };
  } catch (error) {
    return said(error, "The decision could not be saved.");
  }
}

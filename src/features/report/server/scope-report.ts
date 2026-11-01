"use server";

import { isAxiosError } from "axios";
import { axiosInstance } from "@/lib/_api/axios-config";

/**
 * The role-scoped report (`GET /analytics/summary`, RPT-01 to RPT-05).
 *
 * The API decides what the caller may see from their role and their place: a
 * State Coordinator gets their own state and the centres under it, a Zonal
 * Director their zone and its states, a unit head their department. The
 * request cannot widen that, so there is nothing to scope on this side.
 *
 * The admin Reports page reads `/analytics/admin-*` instead, which only the
 * Director General and the admins may call — which is why a coordinator had no
 * Reports at all (QA 2026-11-01, item 25).
 */
export type SummaryRow = { id: string; title: string; count: number; completed: number };
export type ScopeSummary = {
  scope: { level: string; name: string };
  totals: { total: number; pending: number; assigned: number; resolved: number; rejected: number };
  by_status: SummaryRow[];
  by_case_type: SummaryRow[];
  by_centre?: SummaryRow[];
  by_state?: SummaryRow[];
  by_lawyer?: SummaryRow[];
};
export type SummaryFilters = { from?: string; to?: string; state?: string; center?: string; zone?: string };
type Result<T> = { success: true; data: T } | { success: false; message: string };

export async function getScopeSummary(filters: SummaryFilters = {}): Promise<Result<ScopeSummary>> {
  try {
    // The handler answers with the report itself, not the usual { data } envelope.
    const response = await axiosInstance.get<ScopeSummary>("/analytics/summary", { params: filters });
    return { success: true, data: response.data };
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 504;
      if (status === 401) return { success: false, message: "Your session has expired. Please sign in again." };
      if (status === 403) return { success: false, message: "Your account has no reports. Ask the Director General to set your state, zone or centre." };
      const body = error.response?.data as { message?: string; error?: unknown } | undefined;
      const detail = Array.isArray(body?.error) ? body.error.join(". ") : "";
      return { success: false, message: detail || body?.message || "The report could not be loaded." };
    }
    return { success: false, message: "The report could not be loaded." };
  }
}

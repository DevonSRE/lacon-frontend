"use server";

import { isAxiosError } from "axios";
import { axiosInstance } from "@/lib/_api/axios-config";
import { toDownload, type Download, type DownloadFailure } from "./to-download";

/**
 * The management report (`GET /analytics/management-report`, T11).
 *
 * The API builds the whole report — the figures, what they were last period,
 * and the sections behind them — so the page draws numbers rather than working
 * them out. The PDF is printed from the same report, which is what keeps the
 * two from disagreeing.
 *
 * The caller's role fixes the area; the request can narrow it, never widen it.
 */
export type ManagementFigure = {
  key: string;
  label: string;
  definition: string;
  value: number;
  previous: number;
  change_percent: number | null;
  unit?: string;
};

export type ManagementRow = { title: string; count: number; extra: number; note?: string };

export type ManagementSection = {
  key: string;
  title: string;
  columns: [string, string, string];
  rows: ManagementRow[] | null;
  note?: string;
  caveat?: string;
  empty: string;
};

export type ManagementReport = {
  title: string;
  area: string;
  period: string;
  generated_at: string;
  from: string;
  to: string;
  previous_period: string;
  previous_from: string;
  previous_to: string;
  summary: string;
  figures: ManagementFigure[];
  sections: ManagementSection[];
};

/** Which period and area the report covers. */
export type ManagementFilters = {
  quarter?: number;
  year?: number;
  from?: string;
  to?: string;
  zone?: string;
  state?: string;
  center?: string;
};

type Result<T> = { success: true; data: T } | { success: false; message: string };

function failed(error: unknown): { success: false; message: string } {
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

export async function getManagementReport(filters: ManagementFilters = {}): Promise<Result<ManagementReport>> {
  try {
    // The handler answers with the report itself, not the usual { data } envelope.
    const response = await axiosInstance.get<ManagementReport>("/analytics/management-report", { params: filters });
    return { success: true, data: response.data };
  } catch (error) {
    return failed(error);
  }
}

/**
 * The same report, printed for a reader who will not open the system.
 *
 * 'arraybuffer' is required: in a server action the default response type
 * decodes the bytes as UTF-8 text and corrupts the file.
 */
export async function downloadManagementReport(filters: ManagementFilters = {}): Promise<Download | DownloadFailure> {
  try {
    const response = await axiosInstance.get<ArrayBuffer>("/analytics/management-report/pdf", {
      params: filters,
      responseType: "arraybuffer",
    });
    return toDownload(
      { data: response.data, headers: response.headers as Record<string, unknown> },
      "LACON-management-report.pdf",
    );
  } catch (error) {
    return { success: false, status: 500, message: failed(error).message };
  }
}

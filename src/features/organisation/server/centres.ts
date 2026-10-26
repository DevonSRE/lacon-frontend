"use server";

import { isAxiosError } from "axios";
import { z } from "zod";
import { axiosInstance } from "@/lib/_api/axios-config";
import type { Centre, CentrePage, StateOption } from "../domain";

type Result<T> = { success: true; data: T } | { success: false; status: number; message: string };
type Envelope<T> = { data: T; success?: boolean; message?: string };

const idSchema = z.uuid();
const titleSchema = z.string().trim().min(2, "A centre name needs at least 2 characters").max(120, "That centre name is too long");

function failure(error: unknown): { success: false; status: number; message: string } {
  if (error instanceof z.ZodError) return { success: false, status: 400, message: error.issues.map(i => i.message).join(". ") };
  if (isAxiosError(error) || (typeof error === "object" && error !== null && "response" in error)) {
    const e = error as { response?: { status: number; data?: { message?: string; error?: unknown; data?: unknown } } };
    const status = e.response?.status ?? 504;
    if (status === 401) return { success: false, status, message: "Your session has expired. Please sign in again." };
    if (status === 403) return { success: false, status, message: "Only a platform administrator can change centres." };
    const body = e.response?.data;
    const details = body?.error ?? body?.data;
    const detail = typeof details === "string" ? details
      : Array.isArray(details) ? details.join(". ")
      : details && typeof details === "object" ? Object.values(details).flat().join(". ") : "";
    return { success: false, status, message: detail || body?.message || "The request could not be completed. Please try again." };
  }
  return { success: false, status: 500, message: "The request could not be completed. Please try again." };
}

export async function listCentres(params: { page?: number; size?: number; search?: string; state?: string } = {}): Promise<Result<CentrePage>> {
  try {
    const response = await axiosInstance.get<Envelope<CentrePage>>("/centers", {
      params: {
        page: params.page ?? 1,
        size: params.size ?? 20,
        // The API treats "all" as no filter for both.
        search: params.search?.trim() || "all",
        state: params.state || "all",
      },
    });
    if (response.data.success === false) return { success: false, status: 400, message: response.data.message || "Could not load centres." };
    return { success: true, data: response.data.data };
  } catch (error) { return failure(error); }
}

export async function listStateOptions(): Promise<Result<StateOption[]>> {
  try {
    const response = await axiosInstance.get<Envelope<{ data: StateOption[] }>>("/states", { params: { page: 1, size: 60 } });
    return { success: true, data: response.data.data?.data ?? [] };
  } catch (error) { return failure(error); }
}

export async function createCentre(input: { title: string; state_id: string }): Promise<Result<Centre>> {
  try {
    const body = z.object({ title: titleSchema, state_id: idSchema }).parse(input);
    const response = await axiosInstance.post<Envelope<Centre>>("/admin/centers", body);
    return { success: true, data: response.data.data };
  } catch (error) { return failure(error); }
}

export async function renameCentre(id: string, title: string): Promise<Result<Centre>> {
  try {
    const body = z.object({ id: idSchema, title: titleSchema }).parse({ id, title });
    const response = await axiosInstance.patch<Envelope<Centre>>(`/admin/centers/${body.id}`, { title: body.title });
    return { success: true, data: response.data.data };
  } catch (error) { return failure(error); }
}

/**
 * Deactivating a centre removes it from the pickers so no new coordinator, lawyer
 * or case can be attached to it. Cases already filed there keep their history.
 */
export async function deactivateCentre(id: string): Promise<Result<null>> {
  try {
    const centreID = idSchema.parse(id);
    await axiosInstance.delete(`/admin/centers/${centreID}`);
    return { success: true, data: null };
  } catch (error) { return failure(error); }
}

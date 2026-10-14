"use server";

import { isAxiosError } from "axios";
import { z } from "zod";
import { axiosInstance } from "@/lib/_api/axios-config";
import { CASE_UPDATE_TYPES } from "@/lib/form-options";
import { normalizeCase, type CaseRecord, type CaseFilters, type CaseMovement, type CaseDocument, type DirectoryUser, type PageResult, type MovementCommand } from "../domain";

type Result<T> = { success: true; data: T } | { success: false; status: number; message: string };
type Envelope<T> = { data: T; success?: boolean; message?: string };
const idSchema = z.uuid();

function failure(error: unknown): { success: false; status: number; message: string } {
  if (error instanceof z.ZodError) return { success: false, status: 400, message: error.issues.map(i => i.message).join(". ") };
  if (isAxiosError(error) || (typeof error === "object" && error !== null && "response" in error)) {
    const e = error as { response?: { status: number; data?: { message?: string; error?: unknown; data?: unknown } } };
    const status = e.response?.status ?? 504;
    if (status === 401) return { success: false, status, message: "Your session has expired. Please sign in again." };
    if (status === 404) return { success: false, status, message: "This case is unavailable or you no longer have access to it." };
    const body = e.response?.data;
    const details = body?.error ?? body?.data;
    const detail = typeof details === "string" ? details : Array.isArray(details) ? details.join(". ") : details && typeof details === "object" ? Object.values(details).flat().join(". ") : "";
    return { success: false, status, message: detail || body?.message || "The request could not be completed. Please try again." };
  }
  return { success: false, status: 500, message: "The request could not be completed. Please try again." };
}

async function read<T>(path: string, params?: object): Promise<Result<T>> {
  try {
    const response = await axiosInstance.get<Envelope<T>>(path, { params });
    if (response.data.success === false) return { success: false, status: 400, message: response.data.message || "Could not load records." };
    return { success: true, data: response.data.data };
  } catch (error) { return failure(error); }
}

export async function listCases(filters: CaseFilters): Promise<Result<PageResult<CaseRecord>>> {
  const result = await read<PageResult<CaseRecord>>("/casefile", filters);
  return result.success ? { success: true, data: { ...result.data, data: result.data.data.map(normalizeCase) } } : result;
}
export async function getCase(id: string): Promise<Result<CaseRecord>> {
  if (!idSchema.safeParse(id).success) return { success: false, status: 400, message: "Invalid case reference." };
  const result = await read<CaseRecord>(`/casefile/${id}`);
  return result.success ? { success: true, data: normalizeCase(result.data) } : result;
}
export async function getCaseHistory(id: string, page = 1): Promise<Result<PageResult<CaseMovement>>> {
  if (!idSchema.safeParse(id).success) return { success: false, status: 400, message: "Invalid case reference." };
  return read(`/casefile/${id}/history`, { page, size: 20 });
}
export async function getCaseDocuments(id: string, page = 1): Promise<Result<PageResult<CaseDocument>>> {
  if (!idSchema.safeParse(id).success) return { success: false, status: 400, message: "Invalid case reference." };
  return read(`/casefile/${id}/document-history`, { page, size: 20 });
}
export async function getAssignees(id: string, page = 1, keyword = ""): Promise<Result<PageResult<DirectoryUser>>> {
  if (!idSchema.safeParse(id).success) return { success: false, status: 400, message: "Invalid case reference." };
  return read("/users/assignable-lawyers", { case_id: id, page, size: 20, keyword });
}
export async function getRouteTargets(role: string, page = 1, keyword = ""): Promise<Result<PageResult<DirectoryUser>>> {
  return read("/users", { user_type: role, status: "ACTIVE", page, size: 20, keyword: keyword || "all" });
}
export async function moveCase(id: string, command: MovementCommand): Promise<Result<CaseRecord | null>> {
  try {
    idSchema.parse(id);
    const request = z.object({
      action: z.enum(["route", "assign", "escalate", "lawyer-reject", "accept", "reject", "request-revision", "status"]),
      target_user_id: z.uuid().optional(), assignee_id: z.uuid().optional(), reason: z.string().trim().optional(),
      status: z.enum(["INPROGRESS", "COMPLETED", "CLOSED"]).optional(),
    }).parse(command);
    const { action, ...body } = request;
    if (["escalate", "lawyer-reject", "reject", "request-revision"].includes(action) && !body.reason) {
      return { success: false, status: 400, message: "Please enter a reason." };
    }
    if (action === "route" && !body.target_user_id) return { success: false, status: 400, message: "Choose a recipient." };
    if (action === "assign" && !body.assignee_id) return { success: false, status: 400, message: "Choose a lawyer." };
    if (action === "status" && !body.status) return { success: false, status: 400, message: "Choose a status." };
    const response = action === "assign"
      ? await axiosInstance.patch<Envelope<CaseRecord>>("/admin/casefile/case-assignment", { casefile_id: id, assignee_id: body.assignee_id, reason: body.reason })
      : await axiosInstance.post<Envelope<CaseRecord | null>>(action === "status" ? `/admin/casefile/${id}/case-status-update` : `/casefile/${id}/${action}`, body);
    if (response.data.success === false) return { success: false, status: 400, message: response.data.message || "The case could not be updated." };
    return { success: true, data: response.data.data ? normalizeCase(response.data.data) : null };
  } catch (error) { return failure(error); }
}

async function upload(file: FormDataEntryValue | null): Promise<string | undefined> {
  if (!(file instanceof Blob) || file.size === 0) return undefined;
  if (file.size > 10 * 1024 * 1024) throw new Error("File too large");
  const payload = new FormData(); payload.append("file", file);
  const response = await axiosInstance.post<Envelope<string>>("/media?category=documents", payload);
  return response.data.data;
}
export async function postCaseProgress(id: string, formData: FormData): Promise<Result<CaseRecord>> {
  try {
    idSchema.parse(id);
    const payload = z.object({ court_progress: z.string().trim().min(1, "Enter a progress summary"), next_step: z.string().trim().min(1, "Enter the next step"),
      current_status: z.string().trim().min(1, "Select the court stage"), case_update_type: z.enum(CASE_UPDATE_TYPES) }).parse(Object.fromEntries(formData));
    const supporting_documents = await upload(formData.get("file"));
    const response = await axiosInstance.post<Envelope<CaseRecord>>(`/admin/casefile/${id}/case-update`, { ...payload, casefile_id: id, supporting_documents });
    return { success: true, data: normalizeCase(response.data.data) };
  } catch (error) { return failure(error); }
}
export async function postCaseDocument(id: string, formData: FormData): Promise<Result<null>> {
  try {
    idSchema.parse(id);
    const payload = z.object({ document_title: z.string().trim().min(1, "Enter a document title"), document_type: z.string().trim().min(1, "Enter a document type") }).parse(Object.fromEntries(formData));
    const document_path = await upload(formData.get("file"));
    if (!document_path) return { success: false, status: 400, message: "Choose a file to upload." };
    await axiosInstance.post(`/casefile/${id}/document-upload`, { ...payload, document_path, casefile_id: id });
    return { success: true, data: null };
  } catch (error) { return failure(error); }
}

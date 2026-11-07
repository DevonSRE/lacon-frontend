"use server";

import { isAxiosError } from "axios";
import { z } from "zod";
import { axiosInstance } from "@/lib/_api/axios-config";
import { toDownload } from "@/features/report/server/to-download";
import { CASE_UPDATE_TYPES, courtStageLabel } from "@/lib/form-options";
import { normalizeCase, type CaseRecord, type CaseFiler, type CaseFilters, type CaseMovement, type CaseDocument, type DirectoryUser, type PageResult, type MovementCommand } from "../domain";

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
/**
 * The people who have filed a case the caller can see, for the "Filed by"
 * filter (T4). The API reads them off the cases rather than the user
 * directory, so it names only people who have actually filed something, and
 * only within what the caller may already see.
 */
export async function getCaseFilers(keyword = ""): Promise<Result<CaseFiler[]>> {
  const result = await read<CaseFiler[]>("/casefile/filers", { keyword });
  return result.success ? { success: true, data: result.data ?? [] } : result;
}

/**
 * The case record as a PDF (T7). Anyone who can open the case can take a copy;
 * the API refuses it otherwise and records who took it, because the record
 * carries the client's details.
 *
 * 'arraybuffer' is required: in a server action the default response type
 * decodes the bytes as UTF-8 text and corrupts the file.
 */
export async function downloadCase(id: string): Promise<
  { success: true; data: string; filename: string; contentType: string } | { success: false; message: string }
> {
  if (!idSchema.safeParse(id).success) return { success: false, message: "Invalid case reference." };
  try {
    const response = await axiosInstance.get<ArrayBuffer>(`/casefile/${id}/pdf`, { responseType: "arraybuffer" });
    const result = toDownload(
      { data: response.data, headers: response.headers as Record<string, unknown> },
      "case.pdf",
    );
    return result.success ? result : { success: false, message: result.message };
  } catch (error) {
    const failed = failure(error);
    return { success: false, message: failed.message };
  }
}

/**
 * The stamped copy the client keeps and shows in court (T8).
 *
 * It is not the case record: it says an application was received and nothing
 * about what LACON has done with it since. The API decides who may print one.
 */
export async function downloadAcknowledgement(id: string): Promise<
  { success: true; data: string; filename: string; contentType: string } | { success: false; message: string }
> {
  if (!idSchema.safeParse(id).success) return { success: false, message: "Invalid case reference." };
  try {
    const response = await axiosInstance.get<ArrayBuffer>(`/casefile/${id}/acknowledgement`, { responseType: "arraybuffer" });
    const result = toDownload(
      { data: response.data, headers: response.headers as Record<string, unknown> },
      "acknowledgement.pdf",
    );
    return result.success ? result : { success: false, message: result.message };
  } catch (error) {
    return { success: false, message: failure(error).message };
  }
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
export async function getAssignees(id: string, page = 1, keyword = "", state = ""): Promise<Result<PageResult<DirectoryUser>>> {
  if (!idSchema.safeParse(id).success) return { success: false, status: 400, message: "Invalid case reference." };
  // state narrows the pool to one state, so a unit head can pick a lawyer near
  // the client or the custodial centre; "all" is every state.
  return read("/users/assignable-lawyers", { case_id: id, page, size: 20, keyword, state: state || "all" });
}
export async function getRouteTargets(role: string, page = 1, keyword = ""): Promise<Result<PageResult<DirectoryUser>>> {
  return read("/users", { user_type: role, status: "ACTIVE", page, size: 20, keyword });
}
export async function moveCase(id: string, command: MovementCommand): Promise<Result<CaseRecord | null>> {
  try {
    idSchema.parse(id);
    const request = z.object({
      action: z.enum(["route", "assign", "escalate", "lawyer-reject", "accept", "reject", "request-revision", "status", "refer", "transfer"]),
      target_user_id: z.uuid().optional(), assignee_id: z.uuid().optional(), reason: z.string().trim().optional(),
      status: z.enum(["INPROGRESS", "COMPLETED", "CLOSED"]).optional(),
      destination: z.string().trim().optional(),
      outcome: z.string().trim().optional(), resolution_report: z.string().trim().optional(),
    }).parse(command);
    const { action, ...body } = request;
    if (["escalate", "lawyer-reject", "reject", "request-revision"].includes(action) && !body.reason) {
      return { success: false, status: 400, message: "Please enter a reason." };
    }
    if (action === "route" && !body.target_user_id) return { success: false, status: 400, message: "Choose a recipient." };
    if (action === "assign" && !body.assignee_id) return { success: false, status: 400, message: "Choose a lawyer." };
    if (action === "status" && !body.status) return { success: false, status: 400, message: "Choose a status." };
    if ((action === "refer" || action === "transfer") && !body.destination) {
      return { success: false, status: 400, message: action === "refer" ? "Name the organisation the case goes to." : "Name the LACON office the case goes to." };
    }
    if (body.status === "COMPLETED" && (!body.outcome || !body.resolution_report)) {
      return { success: false, status: 400, message: "An outcome and a resolution report are required to complete a case." };
    }
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
    // A case type with court proceedings sends the stage code the API validates
    // against its own catalog; the others send a free-text status. current_status
    // is required either way, so a stage code supplies its own label for it
    // (QA 2026-11-01, item 17).
    const { case_type, ...fields } = z.object({
      court_progress: z.string().trim().min(1, "Enter a progress summary"),
      next_step: z.string().trim().min(1, "Enter the next step"),
      case_type: z.string().trim().optional(),
      next_court_date: z.string().optional(),
      court_stage: z.string().trim().optional(),
      current_status: z.string().trim().optional(),
      case_update_type: z.enum(CASE_UPDATE_TYPES),
    }).parse(Object.fromEntries(formData));
    const current_status = fields.current_status
      || (fields.court_stage ? courtStageLabel(case_type, fields.court_stage) : "");
    if (!current_status) return { success: false, status: 400, message: "Select the court stage." };
    const supporting_documents = await upload(formData.get("file"));
    const next_court_date = fields.next_court_date ? new Date(`${fields.next_court_date}T12:00:00+01:00`).toISOString() : undefined;
    const response = await axiosInstance.post<Envelope<CaseRecord>>(`/admin/casefile/${id}/case-update`, { ...fields, next_court_date, current_status, casefile_id: id, supporting_documents });
    return { success: true, data: normalizeCase(response.data.data) };
  } catch (error) { return failure(error); }
}
/** One row the API refused, with the line of the file it came from. */
export type BulkRowError = { row: string; error: string };
export type BulkUploadResult = { created: number; references: string[]; errors: BulkRowError[] };

/**
 * Files every case in a CSV. The API answers 200 with both lists — the cases it
 * created and the rows it refused — so a part-successful upload is normal and
 * the caller shows both.
 */
export async function postBulkCases(formData: FormData): Promise<Result<BulkUploadResult>> {
  try {
    const file = formData.get("file");
    if (!(file instanceof Blob) || file.size === 0) {
      return { success: false, status: 400, message: "Choose a CSV file to upload." };
    }
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, status: 400, message: "That file is larger than 10 MB. Split it and upload again." };
    }
    const payload = new FormData();
    payload.append("file", file);
    const response = await axiosInstance.post<{ created?: CaseRecord[]; errors?: BulkRowError[] }>(
      "/casefile/create-bulk-case",
      payload,
    );
    const created = response.data?.created ?? [];
    return {
      success: true,
      data: {
        created: created.length,
        references: created.map(c => c.case_id || c.id).filter(Boolean),
        errors: response.data?.errors ?? [],
      },
    };
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

export async function getLawyerWorkSummary(): Promise<Result<{counts:Record<string,number>;needs_action:CaseRecord[];overdue:CaseRecord[];stale_after_days:number}>> {return read("/casefile/work-summary");}

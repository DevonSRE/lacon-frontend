export const CASE_STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Pending review", UNASSIGNED: "Unassigned", ROUTED: "Assigned to department",
  ASSIGNED: "Assigned to lawyer", INPROGRESS: "In progress", REVISION_REQUESTED: "Revision requested",
  RETURNED: "Returned", COMPLETED: "Completed", RESOLVED: "Completed", CLOSED: "Closed", DENIED: "Rejected",
};

export type Actor = { id: string; name: string; email: string; role: string };
export type CaseRecord = {
  id: string; case_id: string; first_name: string; middle_name?: string; last_name: string;
  case_type: string; status: string; created_at?: string; filed_date?: string;
  court_stage?: string;
  state_id?: string; state_name?: string; zone_name?: string; center_name?: string;
  state_of_origin?: string; permanent_address?: string; gender?: string; age?: number;
  marital_status?: string; phone_number?: string; email?: string; occupation?: string;
  department_name?: string; origin_channel?: string; filed_level?: string;
  filing_actor?: Actor | null; current_holder?: Actor | null; assigned_by?: string; forwarded_by?: string;
  assignment?: { assignee_id?: string; assignor_id?: string; assignee?: string; assignor?: string; assign_date?: string } | null;
  possible_duplicate_of?: string[];
  civil_case?: Record<string, unknown>; criminal_case?: Record<string, unknown>; pdss?: Record<string, unknown>;
  decongestion_unit?: Record<string, unknown>; perogative_of_mercy?: Record<string, unknown>;
  updated_by?: Array<Actor & { time?: string; action: string }>;
};
export type CaseMovement = {
  id: string; casefile_id: string; action: string; from_holder: Actor | null;
  to_holder: Actor | null; reason: string; actor: Actor | null; created_at: string;
};
export type DirectoryUser = {
  id: string; first_name: string; last_name: string; user_type: string; status: string;
  state?: string; zone_name?: string; max_load?: number; open_cases?: number;
  // department_name is the department or unit the lawyer belongs to: it is what
  // puts them in that unit head's assignable pool.
  department_name?: string;
};
export type CaseDocument = { id: string; document_title: string; document_type: string; document_url?: string; document_path?: string; created_at?: string; created_by?: Actor | null };
export type PageResult<T> = { data: T[]; total_rows: number; total_pages: number; page: number; size: number };
export type CaseFilters = { page?: number; size?: number; search?: string; state?: string; case_type?: string; status?: string; queue?: string };
export type MovementCommand = {
  action: "route" | "assign" | "escalate" | "lawyer-reject" | "accept" | "reject" | "request-revision" | "status";
  target_user_id?: string; assignee_id?: string; reason?: string; status?: string;
  // Both are required when status is COMPLETED; the API refuses the move without them.
  outcome?: string; resolution_report?: string;
};
export const HEAD_ROLES = ["CIVIL JUSTICE DEPT. HEAD", "CRIMINAL JUSTICE DEPT. HEAD", "DECONGESTION UNIT HEAD", "PREROGATIVE OF MERCY UNIT HEAD", "OSCAR UNIT HEAD", "PDSS UNIT HEAD", "DIO UNIT HEAD"];
export const COORDINATOR_ROLES = ["ZONAL DIRECTOR", "STATE COORDINATOR", "CENTRE COORDINATOR"];
export function routeRoles(role: string): string[] {
  if (role === "DIRECTOR GENERAL") return [...HEAD_ROLES, ...COORDINATOR_ROLES];
  if (HEAD_ROLES.includes(role)) return [...HEAD_ROLES, "ZONAL DIRECTOR", "STATE COORDINATOR"];
  if (role === "ZONAL DIRECTOR") return ["STATE COORDINATOR"];
  if (role === "STATE COORDINATOR") return ["CENTRE COORDINATOR"];
  return [];
}
const FCT_NAMES = ["FCT", "FEDERAL CAPITAL TERRITORY", "ABUJA"];
const FCT_HEADS: Record<string, string> = { "CIVIL CASE": "CIVIL JUSTICE DEPT. HEAD", "CRIMINAL CASE": "CRIMINAL JUSTICE DEPT. HEAD" };
/** Who accepts or rejects an online case (the backend's policy.CanAcceptReject). The FCT has no State
 * Coordinator: its civil and criminal cases are reviewed by the HQ Civil and Criminal Justice heads. */
export function reviewerRole(c: Pick<CaseRecord, "case_type" | "state_name">): string | undefined {
  if (FCT_NAMES.includes((c.state_name ?? "").trim().toUpperCase()) && FCT_HEADS[c.case_type]) return FCT_HEADS[c.case_type];
  if (c.case_type === "PDSS ORGANIZATION") return "PDSS UNIT HEAD";
  if (["CIVIL CASE", "CRIMINAL CASE"].includes(c.case_type)) return "STATE COORDINATOR";
  return undefined;
}
export function casePermissions(c: CaseRecord, user: { id: string; role: string } | undefined) {
  const role = user?.role ?? "";
  const holder = !!user && (!c.current_holder || c.current_holder.id === user.id || c.assignment?.assignor_id === user.id);
  const assigner = HEAD_ROLES.includes(role) || COORDINATOR_ROLES.includes(role);
  const assigned = !!user && c.assignment?.assignee_id === user.id;
  const open = !["CLOSED", "DENIED"].includes(c.status);
  const waitingReview = c.status === "SUBMITTED";
  const reviewRole = !!role && role === reviewerRole(c);
  // The DG may pick up a case nobody holds (no coordinator existed for it): review it or send it on.
  const pickup = role === "DIRECTOR GENERAL" && !c.current_holder;
  return {
    route: open && holder && (!waitingReview || pickup) && routeRoles(role).length > 0,
    assign: open && holder && !waitingReview && assigner,
    escalate: open && holder && !waitingReview && assigner,
    acceptReject: waitingReview && holder && (reviewRole || pickup),
    lawyerReject: open && assigned,
    start: assigned && ["ASSIGNED", "REVISION_REQUESTED"].includes(c.status),
    complete: assigned && ["ASSIGNED", "INPROGRESS", "REVISION_REQUESTED"].includes(c.status),
    close: holder && assigner && ["COMPLETED", "RESOLVED"].includes(c.status),
    revision: assigner && c.assignment?.assignor_id === user?.id && ["ASSIGNED", "INPROGRESS", "REVISION_REQUESTED"].includes(c.status),
    update: assigned && open,
    upload: open && !!user && (assigned || c.current_holder?.id === user.id || c.assignment?.assignor_id === user.id || c.filing_actor?.id === user.id || ["DIRECTOR GENERAL", "PLATFORM ADMIN", "SUPER ADMIN"].includes(role)),
  };
}
export function caseReference(c: { id: string; case_id?: string }) { return c.case_id || c.id; }
export function statusLabel(status: string) { return CASE_STATUS_LABELS[status] ?? status; }

// Dashboard rows return the model; case endpoints return a DTO.
export function normalizeCase(raw: CaseRecord & { pdss_station?: Record<string, unknown>; perogative?: Record<string, unknown> }): CaseRecord {
  return { ...raw, case_id: raw.case_id || "", pdss: raw.pdss ?? raw.pdss_station,
    perogative_of_mercy: raw.perogative_of_mercy ?? raw.perogative };
}

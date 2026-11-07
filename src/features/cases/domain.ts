export const CASE_STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Pending review", UNASSIGNED: "Unassigned", ROUTED: "Assigned to department",
  ASSIGNED: "Assigned to lawyer", INPROGRESS: "In progress", REVISION_REQUESTED: "Revision requested",
  RETURNED: "Returned", COMPLETED: "Completed", RESOLVED: "Completed", CLOSED: "Closed", DENIED: "Rejected",
  // A case that left Legal Aid, or moved to another LACON office. Both end it
  // here as surely as closing it (T6).
  REFERRED: "Referred out", TRANSFERRED: "Transferred",
};

export type Actor = { id: string; name: string; email: string; role: string };
export type CaseRecord = {
  id: string; case_id: string; first_name: string; middle_name?: string; last_name: string;
  case_type: string; status: string; created_at?: string; filed_date?: string;
  court_stage?: string; next_court_date?: string; holder_unavailable?: boolean; routing_warning?: string;
  // Written when a lawyer completes the case; both are required to do so.
  outcome?: string; resolution_report?: string; completed_by?: Actor; completed_at?: string;
  // Where the case went when it left: the organisation it was referred to, or
  // the LACON office it was transferred to (T6).
  referred_to?: string; transferred_to?: string;
  state_id?: string; state_name?: string; zone_name?: string; center_name?: string;
  state_of_origin?: string; permanent_address?: string; gender?: string; age?: number;
  marital_status?: string; phone_number?: string; email?: string; occupation?: string;
  department_name?: string; origin_channel?: string; filed_level?: string;
  // Where the case was filed from, in words: "Lagos State Office", "Ikeja
  // centre", "Online · Lagos". Empty on cases filed before it was recorded.
  filing_office?: string;
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
export type CaseFilters = { page?: number; size?: number; search?: string; state?: string; case_type?: string; status?: string; queue?: string; filed_by?: string };
/** One person who has filed a case, for the "Filed by" filter (T4). */
export type CaseFiler = { id: string; name: string; role: string; office: string };
export type MovementCommand = {
  action: "route" | "assign" | "escalate" | "lawyer-reject" | "accept" | "reject" | "request-revision" | "status" | "refer" | "transfer";
  target_user_id?: string; assignee_id?: string; reason?: string; status?: string;
  // Where a referred or transferred case is going (T6).
  destination?: string;
  // Both are required when status is COMPLETED; the API refuses the move without them.
  outcome?: string; resolution_report?: string; completed_by?: Actor; completed_at?: string;
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
  const holder = !!user && ((role === "DIRECTOR GENERAL" && c.holder_unavailable) || !c.current_holder || c.current_holder.id === user.id || c.assignment?.assignor_id === user.id);
  const assigner = HEAD_ROLES.includes(role) || COORDINATOR_ROLES.includes(role);
  const assigned = !!user && c.assignment?.assignee_id === user.id;
  // A referred or transferred case is finished here, like a closed one (T6).
  const open = !["CLOSED", "DENIED", "REFERRED", "TRANSFERRED"].includes(c.status);
  const waitingReview = c.status === "SUBMITTED";
  const reviewRole = !!role && role === reviewerRole(c);
  // The DG may pick up a case nobody holds (no coordinator existed for it): review it or send it on.
  const pickup = role === "DIRECTOR GENERAL" && (!c.current_holder || !!c.holder_unavailable);
  // The DG may also send any open case on, whoever holds it and whatever stage
  // it has reached (T15). Until now a case a coordinator or head had started
  // work on could be moved by nobody but them.
  const reroute = role === "DIRECTOR GENERAL" && open;
  return {
    route: open && (reroute || (holder && (!waitingReview || pickup))) && routeRoles(role).length > 0,
    assign: open && holder && !waitingReview && assigner,
    escalate: open && holder && !waitingReview && assigner,
    acceptReject: waitingReview && holder && (reviewRole || pickup),
    lawyerReject: open && assigned,
    start: assigned && ["ASSIGNED", "REVISION_REQUESTED"].includes(c.status),
    complete: assigned && ["ASSIGNED", "INPROGRESS", "REVISION_REQUESTED"].includes(c.status),
    close: holder && assigner && ["COMPLETED", "RESOLVED"].includes(c.status),
    // Referring out or transferring is the holder's, at any stage — unlike
    // closing, which waits for the lawyer to finish (T6).
    endCase: open && holder && assigner,
    revision: assigner && c.assignment?.assignor_id === user?.id && ["ASSIGNED", "INPROGRESS", "REVISION_REQUESTED", "COMPLETED", "RESOLVED"].includes(c.status),
    update: assigned && open,
    upload: open && !!user && (assigned || c.current_holder?.id === user.id || c.assignment?.assignor_id === user.id || c.filing_actor?.id === user.id || ["DIRECTOR GENERAL", "PLATFORM ADMIN", "SUPER ADMIN"].includes(role)),
  };
}
/**
 * Where a case was filed from, for a reader.
 *
 * The screens printed the channel beside the level code — "INTERNAL · HQ" — so
 * a case filed by a Lagos state paralegal read as Headquarters (T20). The API
 * records the office at filing time; this is only the fallback for cases filed
 * before it did, which say so rather than guess.
 */
export function filedFrom(c: Pick<CaseRecord, "filing_office" | "origin_channel" | "state_name">): string {
  const office = (c.filing_office ?? "").trim();
  if (office) return office;
  if ((c.origin_channel ?? "").toUpperCase() === "ONLINE") {
    return c.state_name ? `Online · ${c.state_name}` : "Online";
  }
  return "Not recorded (filed before this was kept)";
}

export function caseReference(c: { id: string; case_id?: string }) { return c.case_id || c.id; }
export function statusLabel(status: string) { return CASE_STATUS_LABELS[status] ?? status; }

// movementReason reads a movement's reason the way people speak. A status change
// used to be stored as "ASSIGNED -> INPROGRESS: their reason"; the backend now
// writes the labels itself, but case_movements is append-only, so every row
// written before that keeps the codes (QA 2026-11-01, item 18).
const LEGACY_STATUS_CHANGE = /^([A-Z_]+)\s*->\s*([A-Z_]+)([\s\S]*)$/;

// recordedUpdate does the same for the stored "X changed the status to
// INPROGRESS" lines, which are kept on the case rather than in the movement
// history and are just as frozen.
export function recordedUpdate(action?: string) {
  return (action ?? "").replace(/[A-Z_]{4,}/g, token => CASE_STATUS_LABELS[token] ?? token);
}
export function movementReason(reason?: string) {
  const value = (reason ?? "").trim();
  const match = LEGACY_STATUS_CHANGE.exec(value);
  if (!match) return value;
  const [, from, to, rest] = match;
  if (!CASE_STATUS_LABELS[from] || !CASE_STATUS_LABELS[to]) return value;
  return `${statusLabel(from)} \u2192 ${statusLabel(to)}${rest}`;
}

// Dashboard rows return the model; case endpoints return a DTO.
export function normalizeCase(raw: CaseRecord & { pdss_station?: Record<string, unknown>; perogative?: Record<string, unknown> }): CaseRecord {
  return { ...raw, case_id: raw.case_id || "", pdss: raw.pdss ?? raw.pdss_station,
    perogative_of_mercy: raw.perogative_of_mercy ?? raw.perogative };
}

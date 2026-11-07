/**
 * Where a case really came from, and who brought it (T17).
 *
 * The system recorded only how a case was entered — online or in an office —
 * which is a different question. A client walking into a state office and a
 * Decongestion lawyer collecting cases on a custodial visit both filed
 * "internally", so neither record said where the case began.
 *
 * This mirrors `CaseSource` in `src/custom_types/provenance.go`; the two are
 * meant to agree.
 */
export const CASE_SOURCES = [
  { value: "WALK_IN", label: "Walk-in at LACON office" },
  { value: "CUSTODIAL_VISIT", label: "Detention / custodial centre visit" },
  { value: "COURT_REFERRAL", label: "Referred by court or magistrate" },
  { value: "ORGANISATION_REFERRAL", label: "Referred by another organisation" },
  { value: "OTHER", label: "Other" },
] as const;

/** Set by the system for a public filing, never chosen by a filer. */
export const ONLINE_SOURCE = { value: "ONLINE", label: "Online (public website)" };

/** The source in words, including the cases filed before it was asked. */
export function caseSourceLabel(source?: string | null): string {
  const given = (source ?? "").trim().toUpperCase();
  if (given === "") return "Not recorded (filed before this change)";
  if (given === ONLINE_SOURCE.value) return ONLINE_SOURCE.label;
  return CASE_SOURCES.find(s => s.value === given)?.label ?? given;
}

/**
 * Who handed the case over. A walk-in client brought themselves, so nobody is
 * named; every other source has a person, and naming them is the point.
 */
export function needsBroughtBy(source?: string | null): boolean {
  const given = (source ?? "").trim().toUpperCase();
  return given !== "" && given !== "WALK_IN" && given !== ONLINE_SOURCE.value;
}

/** Only a custodial visit is placed: a visit nobody can place is not a record. */
export function needsVisitDetails(source?: string | null): boolean {
  return (source ?? "").trim().toUpperCase() === "CUSTODIAL_VISIT";
}

/**
 * What is missing from the source the filer gave, or nothing when the answer is
 * complete. The API checks the same rules; this is so the filer is told before
 * the case is sent rather than after.
 */
export function caseSourceProblem(fields: {
  case_source?: string;
  brought_by?: string;
  facility_name?: string;
  visit_date?: string;
}): Partial<Record<"case_source" | "brought_by" | "facility_name" | "visit_date", string>> {
  const source = (fields.case_source ?? "").trim();
  if (source === "") return { case_source: "Say where this case came from." };
  const problems: Record<string, string> = {};
  if (needsBroughtBy(source) && (fields.brought_by ?? "").trim() === "") {
    problems.brought_by = "Name the person or organisation who brought the case.";
  }
  if (needsVisitDetails(source)) {
    if ((fields.facility_name ?? "").trim() === "") problems.facility_name = "Name the facility visited.";
    if ((fields.visit_date ?? "").trim() === "") problems.visit_date = "Give the date of the visit.";
  }
  return problems;
}

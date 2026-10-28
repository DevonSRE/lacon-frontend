export function uniqueRoleOptions(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((value): value is string => typeof value === "string")
    .map(value => value.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

// An Internal Paralegal in a unit belongs to that unit (department_name), and files to its head.
export const PARALEGAL_UNITS: Record<string, string> = {
  "PDSS Unit": "PDSS UNIT HEAD",
  "OSCAR Unit": "OSCAR UNIT HEAD",
  "DIO Unit": "DIO UNIT HEAD",
  "Decongestion Unit": "DECONGESTION UNIT HEAD",
  "Prerogative of Mercy Unit": "PREROGATIVE OF MERCY UNIT HEAD",
};
export const PARALEGAL_OFFICES = ["Head Office", "Zonal Office", "State Office", "Centre Office", ...Object.keys(PARALEGAL_UNITS)];

/** The department_name to send for a paralegal designation ("" for an office that is a place). */
export function paralegalDepartment(role: string, designation = ""): string {
  return role === "INTERNAL PARALEGAL" ? PARALEGAL_UNITS[designation] ?? "" : "";
}

export function invitationScope(role: string, designation = "") {
  const lawyer = ["LACON LAWYER", "PRO BONO LAWYER"].includes(role);
  const paralegal = role === "INTERNAL PARALEGAL";
  return {
    designation: lawyer || paralegal,
    state: lawyer || ["STATE COORDINATOR", "CENTRE COORDINATOR"].includes(role) ||
      (paralegal && (designation === "State Office" || designation === "Centre Office")),
    zone: role === "ZONAL DIRECTOR" || (paralegal && designation === "Zonal Office"),
    center: role === "CENTRE COORDINATOR" || (lawyer && designation === "Centre Lawyer") || (paralegal && designation === "Centre Office"),
  };
}

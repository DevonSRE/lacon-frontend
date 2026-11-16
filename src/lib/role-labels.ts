/**
 * Each office in the words people read.
 *
 * The API stores roles as upper-case constants — "DIO UNIT HEAD" — and shows
 * them that way in every list, so the screens shouted and, worse, called two
 * departments units. LACON confirmed that DIO and Prerogative of Mercy are
 * departments and Decongestion is a unit (QA 2026-11-01, item 22).
 *
 * Only the reading changes. The constants stay as they are: they are written
 * on every account, on each case's department_name and inside pending
 * requests, and routing matches on them. This mirrors `roleLabels` in
 * `src/custom_types/role.go`; the two are meant to agree.
 */
const ROLE_LABELS: Record<string, string> = {
  "DIRECTOR GENERAL": "Director General",
  "CIVIL JUSTICE DEPT. HEAD": "Civil Justice Department Head",
  "CRIMINAL JUSTICE DEPT. HEAD": "Criminal Justice Department Head",
  "INTERNAL PARALEGAL": "Internal Paralegal",
  "EXTERNAL PARALEGAL": "External Paralegal",
  "PRO BONO LAWYER": "Pro Bono Lawyer",
  "CENTRE COORDINATOR": "Centre Coordinator",
  "ZONAL DIRECTOR": "Zonal Director",
  "STATE COORDINATOR": "State Coordinator",
  "DECONGESTION UNIT HEAD": "Decongestion Unit Head",
  "PREROGATIVE OF MERCY UNIT HEAD": "Prerogative of Mercy Department Head",
  "OSCAR UNIT HEAD": "OSCAR Unit Head",
  "PDSS UNIT HEAD": "PDSS Unit Head",
  "DIO UNIT HEAD": "DIO Department Head",
  "LACON LAWYER": "LACON Lawyer",
  "PLATFORM ADMIN": "Platform Administrator",
  "SUPER ADMIN": "Super Administrator",
  STATISTICS: "Statistics",
};

/** The office as a reader sees it, falling back to whatever was stored. */
export function roleLabel(role?: string | null): string {
  const stored = (role ?? "").trim();
  return ROLE_LABELS[stored.toUpperCase()] ?? stored;
}

/**
 * The office rather than the person holding it: "Civil Justice Department"
 * where roleLabel gives "Civil Justice Department Head".
 *
 * A case is routed to an office and belongs to an office, so the route picker
 * and the case's Department read as offices; they showed the role constant
 * instead (QA 2026-11-01 run 4, 13 Nov, row 49). Mirrors OfficeLabel in
 * `src/custom_types/role.go`.
 *
 * Whether each one is a Unit or a Department follows LACON's own answer (QA
 * 2026-11-01, item 22): DIO and Prerogative of Mercy are departments,
 * Decongestion and OSCAR are units.
 */
export function officeLabel(role?: string | null): string {
  const label = roleLabel(role);
  return label.endsWith(" Head") ? label.slice(0, -" Head".length) : label;
}

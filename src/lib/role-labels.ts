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

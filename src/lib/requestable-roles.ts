/**
 * The accounts a field office may ask the Director General for (QA 2026-11-01
 * run 4, 13 Nov, row 31).
 *
 * The Role list offered every role the platform has, including Pro bono Lawyer
 * and NYSC Lawyer, and the server then refused them with a message naming
 * roles the list did not show. Offering only what can be asked for means the
 * refusal never has to be read.
 *
 * Mirrors `policy.RequestableRoles()` in `src/policy/policy.go`; coordinators,
 * heads and admins are the DG's own appointments and are not requestable.
 */
const REQUESTABLE = ["LACON LAWYER", "INTERNAL PARALEGAL", "EXTERNAL PARALEGAL"];

/** The offices that raise requests rather than creating accounts outright. */
const FIELD_OFFICES = [
  "ZONAL DIRECTOR", "STATE COORDINATOR", "CENTRE COORDINATOR",
  "CIVIL JUSTICE DEPT. HEAD", "CRIMINAL JUSTICE DEPT. HEAD", "DECONGESTION UNIT HEAD",
  "PREROGATIVE OF MERCY UNIT HEAD", "OSCAR UNIT HEAD", "PDSS UNIT HEAD", "DIO UNIT HEAD",
];

/**
 * The roles this account may choose from, or null where every role is open to
 * them — the Director General and the admins create accounts outright.
 */
export function requestableRolesFor(role?: string | null): string[] | null {
  const mine = (role ?? "").trim().toUpperCase();
  return FIELD_OFFICES.includes(mine) ? [...REQUESTABLE] : null;
}

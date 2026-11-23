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

/**
 * The offices that raise requests rather than creating accounts outright.
 *
 * Mirrors `policy.CanRequestUserMgmt`: the five unit heads, plus the zonal,
 * state and centre offices. The two department heads (Civil and Criminal
 * Justice) are not unit heads and do not request, though an earlier copy of
 * this list had them.
 */
const FIELD_OFFICES = [
  "ZONAL DIRECTOR", "STATE COORDINATOR", "CENTRE COORDINATOR",
  "DECONGESTION UNIT HEAD", "PREROGATIVE OF MERCY UNIT HEAD",
  "OSCAR UNIT HEAD", "PDSS UNIT HEAD", "DIO UNIT HEAD",
];

/**
 * The administrator offices only another administrator may create.
 *
 * Mirrors `policy.CanCreateUserDirect`: an admin creates any account, while the
 * Director General is allowed every role *except* these two — the same rule
 * that stops the DG managing or deleting a platform administrator. More than
 * one Platform Administrator may hold the office at a time, so it stays on the
 * list once it is filled; it just is not the DG's appointment to make.
 */
const ADMIN_ROLES = ["PLATFORM ADMIN", "SUPER ADMIN"];

/** Whether this office asks the Director General instead of creating accounts. */
export function isRequesterOffice(role?: string | null): boolean {
  return FIELD_OFFICES.includes((role ?? "").trim().toUpperCase());
}

/**
 * The roles this account must not be offered at all, whatever the API lists.
 *
 * Without this the Director General was shown Platform Admin and the server
 * then refused it — the complaint behind row 31, in the one place
 * `requestableRolesFor` does not cover, because the DG may create everything
 * else.
 */
export function rolesWithheldFrom(role?: string | null): string[] {
  const mine = (role ?? "").trim().toUpperCase();
  return ADMIN_ROLES.includes(mine) ? [] : [...ADMIN_ROLES];
}

/**
 * The roles this account may choose from, or null where every role is open to
 * them — the Director General and the admins create accounts outright.
 */
export function requestableRolesFor(role?: string | null): string[] | null {
  const mine = (role ?? "").trim().toUpperCase();
  return FIELD_OFFICES.includes(mine) ? [...REQUESTABLE] : null;
}

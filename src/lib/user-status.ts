/**
 * How an account's standing is shown in the user lists.
 *
 * A declined pro bono applicant is deactivated so they cannot sign in, which is
 * right, but it also made them read as "Inactive" in All Users and Lawyer
 * Management — identical to a lawyer who was approved and later suspended
 * (QA 2026-11-01, item 5). The API now reports how the latest application was
 * decided, so the two can be told apart.
 *
 * Three copies of this map had grown up; they now all come here.
 */
export type StatusBadge = { label: string; color: string };

const STATUSES: Record<string, StatusBadge> = {
  ACTIVE: { label: "Active", color: "text-green-700 bg-green-50" },
  PENDING: { label: "Pending", color: "text-blue-600 bg-blue-50" },
  INACTIVE: { label: "Inactive", color: "text-red-800 bg-red-100" },
  SUSPEND: { label: "Suspended", color: "text-amber-800 bg-amber-100" },
};

const DECLINED: StatusBadge = { label: "Declined", color: "text-red-800 bg-red-100" };

/**
 * An account can read "Active" while a suspension for it is already waiting on
 * the Director General, which is how a coordinator came to raise the same
 * request twice (QA 2026-11-01, item 25). This is said alongside the status,
 * not instead of it: the account really is still active until the DG decides.
 */
const PENDING_CHANGES: Record<string, string> = {
  DEACTIVATE: "Suspension requested",
  REACTIVATE: "Reactivation requested",
};

export function pendingChangeNote(pendingChange?: string): string | undefined {
  return PENDING_CHANGES[(pendingChange ?? "").toUpperCase()];
}

export function userStatusBadge(status?: string, probonoDecision?: string): StatusBadge {
  const value = (status ?? "").toUpperCase();
  // A declined application explains an inactive account; a suspension does not,
  // and the API only reports a decision that was actually made.
  if (value === "INACTIVE" && (probonoDecision ?? "").toUpperCase() === "DECLINED") {
    return DECLINED;
  }
  return STATUSES[value] ?? { label: value, color: "bg-gray-100 text-gray-800" };
}

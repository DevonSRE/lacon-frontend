/**
 * What the recipient picker says when it has nobody to offer.
 *
 * Two different silences, which used to read the same. An empty list because
 * nobody is eligible needs to say what to do about it; an empty list because
 * the search matched nothing needs to say so, and not be mistaken for "there
 * are no lawyers" — a search for "zzz" left the dropdown empty with no message
 * at all (QA 2026-11-16, row 68).
 */
export function pickerEmptyMessage(
  action: "assign" | "route" | "escalate" | string,
  role: string,
  query: string,
  viewerRole = ""
): string {
  if (query.trim() !== "") {
    return action === "assign"
      ? "No lawyer matches that search."
      : "No recipient matches that search.";
  }
  return emptyPoolMessage(action, role, viewerRole);
}

/**
 * Roles that create accounts themselves, so telling them to ask someone else
 * to do it is no advice at all.
 */
const CAN_CREATE_USERS = ["DIRECTOR GENERAL", "PLATFORM ADMIN", "SUPER ADMIN"];

/**
 * Why nobody is eligible, and what to do about it, instead of leaving the
 * person at "No eligible recipients found".
 */
export function emptyPoolMessage(action: string, role: string, viewerRole = ""): string {
  if (action === "assign") {
    return "No lawyer is available for this case. Add one under Lawyers > Add New Lawyer, linking them to your department or unit, or widen the state filter.";
  }
  if (role) {
    // The Director General cannot assign lawyers and cannot ask themselves for
    // an account, which is what the one message used to tell them to do
    // (QA 2026-11-19, row 79).
    if (CAN_CREATE_USERS.includes(viewerRole.trim().toUpperCase())) {
      return `No active ${role.toLowerCase()} is available for this case. Create one under Users Role > New User, or route the case to another office.`;
    }
    return `No active ${role.toLowerCase()} is available for this case. Assign a lawyer instead, or ask the Director General to create one.`;
  }
  return "No eligible recipients found.";
}

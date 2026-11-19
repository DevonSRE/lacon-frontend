// Rejecting something needs a reason, and the person has to be told so.
//
// The Director General's Reject dialog disabled its own button while the note
// was empty and said nothing, so clicking "Confirm, Rejection" looked broken
// (QA 2026-11-16, row 55). A disabled control has to carry its reason next to
// it, or it reads as a fault in the system.
//
// The wording is QA's own. It matches "Enter a reason for rejecting this
// review." in probono-reviews.ts, which is the same rule in another screen.
export function rejectReasonProblem(reason: string): string | undefined {
  if (reason.trim() === "") {
    return "Enter a reason to reject this request.";
  }
  return undefined;
}

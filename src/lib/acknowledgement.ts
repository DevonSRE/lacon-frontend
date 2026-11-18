/**
 * Who is offered the client's acknowledgement (T8).
 *
 * It is the receipt the paralegal prints and hands to the client across the
 * desk the case was filed at. It was offered to everyone who could open the
 * case — pro bono lawyers, the Decongestion head, coordinators, the Director
 * General — none of whom has a client in front of them (QA 2026-11-16, row 43).
 *
 * This mirrors the rule the API now enforces, so the button is not shown to
 * someone the server would refuse. The filing actor is the member of staff who
 * filed the case; `created_by` is the client, so it is the wrong field to ask.
 */
export function canPrintAcknowledgement(
  filingActorId?: string | null,
  viewerId?: string | null
): boolean {
  const filer = (filingActorId ?? "").trim().toLowerCase();
  const viewer = (viewerId ?? "").trim().toLowerCase();
  if (filer === "" || viewer === "") {
    return false;
  }
  return filer === viewer;
}

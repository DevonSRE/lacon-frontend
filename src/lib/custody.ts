/**
 * Whether the client is being held, and what that makes required.
 *
 * The criminal form asked for "Bail status" as free text, so nothing could
 * tell a detained client from one on bail — and "Date of admission into
 * custody" was asked of everyone, including people who were never in custody.
 * It blocked nobody, so it read as required and answered nothing (T19).
 */
export const CUSTODY_STATUSES = [
  { value: "UNBAILED", label: "In custody" },
  { value: "BAILED", label: "On bail / not detained" },
] as const;

export function isInCustody(bailStatus?: string): boolean {
  return (bailStatus ?? "").toUpperCase() === "UNBAILED";
}

/**
 * The message when a held client has no admission date, or undefined when
 * there is nothing to say. A client who is not held is never asked.
 */
export function custodyDateMissing(bailStatus?: string, dateOfAdmission?: string): string | undefined {
  if (!isInCustody(bailStatus)) return undefined;
  if (String(dateOfAdmission ?? "").trim()) return undefined;
  return "Enter the date the client was admitted into custody.";
}

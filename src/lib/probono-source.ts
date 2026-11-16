/**
 * Which pro bono form an application came in on (QA 2026-11-01 run 4, 13 Nov,
 * rows 36 and 37).
 *
 * Registration and Inventory applications sat in one list with nothing to tell
 * them apart, and the review screen left out the fields only the Inventory
 * form asks for. The stored values come from `registerProbono` in
 * `src/service/user.go`.
 */
export const PROBONO_SOURCES: Record<string, string> = {
  NEW_APPLICATION: "Registration",
  EXISTING_CASES: "Inventory",
  DIRECT_ONBOARDING: "Onboarded by LACON",
};

/** The source as a reader should see it, or "-" where none was recorded. */
export function applicationSourceLabel(source?: string | null): string {
  const key = (source ?? "").trim().toUpperCase();
  if (!key) return "-";
  return PROBONO_SOURCES[key] ?? key;
}

/** True for the Inventory form, which asks for the firm and the lawyer's current cases. */
export function isInventoryApplication(source?: string | null): boolean {
  return (source ?? "").trim().toUpperCase() === "EXISTING_CASES";
}

/**
 * The status filter on the pro bono applications list (QA 2026-11-01, item 6).
 *
 * The list used to open filtered to Pending with nothing on screen saying so,
 * and the dropdown offered only the three states — so an accepted or declined
 * application looked deleted rather than filtered out, and there was no way
 * back to the whole list once a state was picked.
 *
 * A declined application is stored as INACTIVE, which is also what a suspended
 * lawyer is; the label says Declined because that is what it means here.
 */
export const APPLICATION_FILTERS = [
  { value: "all", label: "All applications" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Declined" },
] as const;

/** The default: everything, so nothing is hidden by a filter nobody chose. */
export const DEFAULT_APPLICATION_FILTER = "all";

/**
 * What the Filter button reads. It names the filter in force rather than the
 * word "Filter", so an empty list reads as narrowed rather than broken.
 */
export function applicationFilterLabel(value: string | undefined): string {
  return APPLICATION_FILTERS.find(f => f.value === value)?.label ?? "All applications";
}

/**
 * What the API is asked for. "all" means no status filter; the server treats
 * any other value as one, so an empty string would match nothing.
 */
export function applicationStatusParam(value: string | undefined): string {
  const given = (value ?? "").trim();
  return given === "" ? "all" : given;
}

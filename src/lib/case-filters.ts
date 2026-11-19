/**
 * What the Cases list is currently narrowed to (QA 2026-11-16, row 64).
 *
 * Ten filters sat in one grid, all the same size and all equally prominent, so
 * the row was crowded and hard to read and there was no way to tell at a glance
 * that anything was applied — an empty list looked broken rather than narrowed.
 *
 * Keeping the "what is active" rule here, apart from the component, means the
 * count on the button and the Clear button can be tested without rendering
 * anything.
 */
export type CaseFilterState = {
  search: string;
  status: string;
  caseType: string;
  state: string;
  caseSource: string;
  offences: string[];
  ageBracket: string;
  sex: string;
  workedOn: string;
  filedBy: string;
};

/** Nothing applied. "all" is how the API is told not to narrow. */
export const EMPTY_CASE_FILTERS: CaseFilterState = {
  search: "",
  status: "all",
  caseType: "all",
  state: "all",
  caseSource: "all",
  offences: [],
  ageBracket: "",
  sex: "",
  workedOn: "",
  filedBy: "all",
};

/** The filters shown in the first row; the rest live under More filters. */
export const PRIMARY_CASE_FILTERS = ["search", "status", "caseType", "state"] as const;

/**
 * Which filters are narrowing the list, by name, in a stable order. The names
 * are what a reader would call them.
 */
export function activeCaseFilters(filters: Partial<CaseFilterState>): string[] {
  const active: string[] = [];
  const differs = (key: keyof CaseFilterState, label: string) => {
    const value = filters[key];
    const empty = EMPTY_CASE_FILTERS[key];
    if (Array.isArray(value)) {
      if (value.length > 0) active.push(label);
      return;
    }
    if (typeof value !== "string") return;
    if (value.trim() !== "" && value.trim() !== empty) active.push(label);
  };
  differs("search", "Search");
  differs("status", "Status");
  differs("caseType", "Case type");
  differs("state", "Filing state");
  differs("caseSource", "Case source");
  differs("offences", "Offence");
  differs("ageBracket", "Age");
  differs("sex", "Sex");
  differs("workedOn", "Worked on by");
  differs("filedBy", "Filed by");
  return active;
}

/** How many filters are narrowing the list. */
export function activeCaseFilterCount(filters: Partial<CaseFilterState>): number {
  return activeCaseFilters(filters).length;
}

/**
 * True when anything under More filters is applied, so the panel can open
 * itself rather than hiding a filter that is changing what the reader sees.
 */
export function hasAdvancedCaseFilters(filters: Partial<CaseFilterState>): boolean {
  const primary = new Set<string>(["Search", "Status", "Case type", "Filing state"]);
  return activeCaseFilters(filters).some(name => !primary.has(name));
}

/**
 * How a dropdown's list is narrowed and ordered.
 *
 * The filter dropdowns opened the browser's own list: another font, no search,
 * and no order. "Worked on by" was the worst of them, 27 bare names today and
 * hundreds once LACON is live (QA 2026-11-16, row 65).
 *
 * The rules live here, apart from the control that draws them, so they can be
 * read on their own: a name is found by what is written next to it as well as
 * by itself, and a list of people reads in name order.
 */

export type Narrowable = { label: string; detail?: string };

/**
 * Whether an option answers a search. The detail counts too: a person is
 * looked for by their office as readily as by their name, and two people
 * called QA Decon are told apart only by it.
 */
export function matchesOption(option: Narrowable, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle === "") return true;
  return `${option.label} ${option.detail ?? ""}`.toLowerCase().includes(needle);
}

/** The options that answer a search, in the order they were given. */
export function narrowOptions<T extends Narrowable>(options: T[], query: string): T[] {
  return options.filter(option => matchesOption(option, query));
}

/**
 * A to Z, by what is written on the option.
 *
 * The first option of a filter is the one that clears it ("Worked on by
 * anyone"), which belongs at the top rather than in the alphabet, so the
 * screens sort the names and put that one in front.
 */
export function byLabel(a: Narrowable, b: Narrowable): number {
  return a.label.localeCompare(b.label);
}

/** "3 cases", "1 case": how many cases an offence filter would leave. */
export function caseCount(count: number): string {
  return `${count} case${count === 1 ? "" : "s"}`;
}

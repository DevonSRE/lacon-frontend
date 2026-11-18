/**
 * A lawyer's maximum case load, as they read and type it.
 *
 * The limit was fixed when the account was made, so a lawyer who could take
 * more read as full to every head looking for someone to assign
 * (QA 2026-11-16, row 72). These are the rules the API enforces, said here so
 * the lawyer is told before the change is sent.
 */

/** As many cases as one lawyer may declare: a guard against a typed nought too many. */
export const MAX_CASE_LOAD = 500;

/** What is wrong with a typed case load, or nothing. */
export function caseLoadProblem(typed: string): string {
  const given = typed.trim();
  if (given === "") return "Give the number of cases you can carry at once.";
  if (!/^\d+$/.test(given)) return "The case load must be a whole number.";
  const load = Number(given);
  if (load > MAX_CASE_LOAD) return `The case load cannot be more than ${MAX_CASE_LOAD}.`;
  return "";
}

/**
 * A case load in words. Nought is not "0 cases": it is how a LACON lawyer's
 * account is set up, meaning nobody has capped them.
 */
export function caseLoadLabel(load: number): string {
  if (!Number.isFinite(load) || load <= 0) return "No set limit";
  return `${load} case${load === 1 ? "" : "s"} at a time`;
}

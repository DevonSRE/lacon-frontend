/**
 * The duplicate check a filer sees before a case is created (T10).
 *
 * The same client often walks into two offices, or a paralegal re-files a case
 * they already filed, and nothing in the form said so — the second case was
 * created and only turned up later as two records of one matter. The API
 * answers with the earlier cases that share the client's email or phone; this
 * is the reading rule the dialog uses.
 *
 * Kept out of the component on purpose: the rule is a plain function so it can
 * be tested without a browser.
 */

export type DuplicateMatch = {
  reference: string;
  client_name: string;
  filed_at: string;
  filing_office: string;
  status: string;
  filed_by_name: string;
  filed_by_role: string;
};

/** How many matches the dialog shows. More than this is noise, not evidence. */
export const MAX_SHOWN = 5;

/**
 * The matches worth showing: newest first, capped. Newest first because the
 * most recent filing is the one most likely to be the same matter, and the one
 * the filer can still recognise.
 */
export function topMatches(matches: DuplicateMatch[]): DuplicateMatch[] {
  return [...matches]
    .sort((a, b) => Date.parse(b.filed_at) - Date.parse(a.filed_at))
    .slice(0, MAX_SHOWN);
}

/** Whether the check has anything to warn about. */
export function hasDuplicates(matches: DuplicateMatch[] | undefined): boolean {
  return Array.isArray(matches) && matches.length > 0;
}

/**
 * Whether a filer may go ahead. Continuing past a warning needs a reason in
 * words — that reason is what a reviewer later reads to tell a genuine second
 * case from a mistake, so an empty or token answer is refused.
 */
export const MIN_REASON = 10;

export function reasonProblem(reason: string): string | undefined {
  const given = reason.trim();
  if (given === "") return "Say why this is not the same case.";
  if (given.length < MIN_REASON) return "Please give a little more detail.";
  return undefined;
}

/**
 * Who may open the Duplicates view (T5). The flag already shows on each case;
 * this is the one place to review them together, and it is review only, so it
 * belongs to the platform admins and Statistics, who keep the national picture.
 * This mirrors `CanViewDuplicates` in `src/policy/policy.go`.
 */
const DUPLICATE_REVIEWERS = ["PLATFORM ADMIN", "SUPER ADMIN", "STATISTICS"];

export function canReviewDuplicates(role?: string | null): boolean {
  return DUPLICATE_REVIEWERS.includes((role ?? "").toUpperCase());
}

/** One flagged pair: the case it matched, and what the two share. */
export type DuplicateLink = { reference: string; shared_on: string[] };

/**
 * Why a pair was flagged, in the reader's words, or nothing when the API could
 * not say. "Same email and phone number" reads as one sentence; saying nothing
 * is better than inventing a reason.
 */
export function sharedLabel(sharedOn: string[]): string {
  const given = sharedOn.filter(Boolean);
  if (given.length === 0) return "";
  return `same ${given.join(" and ")}`;
}

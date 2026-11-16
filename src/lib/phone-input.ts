/**
 * What a phone field keeps as someone types (QA 2026-11-01 run 4, 13 Nov,
 * row 38).
 *
 * The pro bono forms stripped every non-digit and cut the result to eleven
 * characters, so "+2348031234567" lost its "+" and became "23480312345" — a
 * number nobody could enter and the server then rejected. The rule the server
 * actually applies is 0 plus ten digits, or +234 plus ten.
 */

/** 0 + 10 digits. */
const LOCAL_LENGTH = 11;
/** +234 + 10 digits. */
const INTERNATIONAL_LENGTH = 14;

export function phoneInput(value: string): string {
  const raw = String(value ?? "");
  // A "+" is only a "+" at the front; anywhere else it is a typo.
  const leadingPlus = raw.trimStart().startsWith("+");
  const digits = raw.replace(/\D/g, "");
  if (!leadingPlus) return digits.slice(0, LOCAL_LENGTH);
  return ("+" + digits).slice(0, INTERNATIONAL_LENGTH);
}

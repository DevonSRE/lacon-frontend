/**
 * The filters Statistics reports by (T3).
 *
 * They answer questions such as "rape cases, victims aged 0–6, in Q1 2026" and
 * "GBV cases, female, Osun State, Q2 2027". Each narrows further and they
 * combine, which is what makes them worth having: no single one of them answers
 * a question anybody actually asks.
 */

/**
 * The age brackets, as Statistics uses them. Open-ended at the top, because an
 * upper limit there would quietly drop the oldest clients.
 */
export const AGE_BRACKETS = [
  { value: "0-6", label: "0 to 6", min: 0, max: 6 },
  { value: "7-12", label: "7 to 12", min: 7, max: 12 },
  { value: "13-17", label: "13 to 17 (minor)", min: 13, max: 17 },
  { value: "18-25", label: "18 to 25", min: 18, max: 25 },
  { value: "26-35", label: "26 to 35", min: 26, max: 35 },
  { value: "36-50", label: "36 to 50", min: 36, max: 50 },
  { value: "51-", label: "51 and over", min: 51, max: undefined },
] as const;

export const SEXES = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
] as const;

/** The bracket's bounds, or nothing when no bracket is chosen. */
export function ageBounds(value: string): { age_min?: number; age_max?: number } {
  const bracket = AGE_BRACKETS.find(b => b.value === value);
  if (!bracket) return {};
  return bracket.max === undefined ? { age_min: bracket.min } : { age_min: bracket.min, age_max: bracket.max };
}

/**
 * Several offences at once, as the API reads them. A case carries one offence,
 * so choosing two means either — which is how "rape or defilement" is asked.
 */
export function offenceParam(chosen: string[]): string | undefined {
  const given = chosen.map(o => o.trim()).filter(Boolean);
  return given.length === 0 ? undefined : given.join(",");
}

/** What the chosen filters say, for the line above a filtered list. */
export function filterSummary(parts: {
  offences?: string[];
  ageBracket?: string;
  sex?: string;
  workedOnName?: string;
}): string {
  const said: string[] = [];
  if (parts.offences?.length) said.push(parts.offences.join(" or "));
  if (parts.ageBracket) {
    const bracket = AGE_BRACKETS.find(b => b.value === parts.ageBracket);
    if (bracket) said.push(`aged ${bracket.label.replace(" (minor)", "")}`);
  }
  if (parts.sex) said.push(SEXES.find(s => s.value === parts.sex)?.label.toLowerCase() ?? parts.sex.toLowerCase());
  if (parts.workedOnName) said.push(`worked on by ${parts.workedOnName}`);
  return said.join(", ");
}

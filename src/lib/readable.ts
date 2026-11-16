/**
 * Stored values as a person reads them (QA 2026-11-01 run 4, 13 Nov, row 53).
 *
 * Case pages printed the constants the database holds — below_18000,
 * arraignment, UNBAILED — which mean nothing to a LACON officer. This mirrors
 * `Readable` in `src/custom_types/readable.go`, which does the same for the
 * printed record and the export; the two are meant to agree.
 */

/** A declined applicant is INACTIVE; bail is the custody rule from T19. */
const BAIL_LABELS: Record<string, string> = {
  UNBAILED: "Not on bail",
  BAILED: "On bail",
};

/** The monthly income bands the filing forms offer. */
const INCOME_LABELS: Record<string, string> = {
  BELOW_18000: "Below ₦18,000",
  "18000_50000": "₦18,000 – ₦50,000",
  "50000_100000": "₦50,000 – ₦100,000",
  "100000_200000": "₦100,000 – ₦200,000",
  ABOVE_200000: "Above ₦200,000",
};

/**
 * A SCREAMING_SNAKE or lower_snake value as a sentence: CHARGE_FILED becomes
 * "Charge filed". A value with no underscore is returned exactly as it came, so
 * free text, names and offences are never rewritten.
 */
export function sentence(value: string): string {
  const raw = value.trim();
  if (raw === "" || !raw.includes("_")) return raw;
  const words = raw.replaceAll("_", " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) return raw;
  return words
    .map((word, i) => (i === 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase()))
    .join(" ");
}

/**
 * The words behind a stored value, or the value itself where none is known.
 *
 * Options given by the caller are matched case-insensitively: a case stored
 * "arraignment" against an option named ARRAIGNMENT_AND_PLEA fell through and
 * printed raw.
 */
export type Labelled = { value: string | number; label: string };

export function readableValue(value: string, options: ReadonlyArray<Labelled> = []): string {
  const raw = String(value ?? "").trim();
  if (raw === "") return "";
  const key = raw.toUpperCase();

  // The caller passes the lists it knows about — the court stages, say. They
  // are not imported here so this stays a plain module the test runner can
  // load, and so one list is never quietly matched against the wrong form.
  const option = options.find(o => String(o.value).toUpperCase() === key);
  if (option) return option.label;

  if (BAIL_LABELS[key]) return BAIL_LABELS[key];
  if (INCOME_LABELS[key]) return INCOME_LABELS[key];
  return sentence(raw);
}

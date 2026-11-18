/**
 * The offence pick-list (QA 2026-11-16, row 47).
 *
 * Offence was free text, so the same offence arrived spelled many ways and the
 * Offence filter on Cases and Reports listed typos and test text alongside real
 * offences. The filter is built from what was typed, so only the form could
 * clean it.
 *
 * The list itself is served by the API (`GET /casefile/offence-options`) and is
 * PROVISIONAL until LACON agrees its own; this module holds only the rules the
 * form needs, so they can be tested without a network.
 */
export const OFFENCE_OTHER = "OTHER";

export type OffenceOption = { code: string; label: string };

/** True when the filer picked Other and must say what the offence is. */
export function needsOffenceDetail(code?: string | null): boolean {
  return (code ?? "").trim().toUpperCase() === OFFENCE_OTHER;
}

/**
 * What is wrong with the offence on this form, or undefined when it is fine.
 * Picking nothing is an error, and so is picking Other without saying what.
 */
export function offenceProblem(code?: string | null, detail?: string | null): string | undefined {
  if (!(code ?? "").trim()) return "Choose the offence";
  if (needsOffenceDetail(code) && !(detail ?? "").trim()) return "Say what the offence is";
  return undefined;
}

/**
 * How the chosen offence reads back on screen before the case is filed: the
 * list's own wording, or the filer's words under Other.
 */
export function offenceLabel(
  code?: string | null,
  detail?: string | null,
  options: ReadonlyArray<OffenceOption> = []
): string {
  const chosen = (code ?? "").trim().toUpperCase();
  if (!chosen) return "";
  if (needsOffenceDetail(chosen)) return (detail ?? "").trim();
  return options.find(o => o.code.toUpperCase() === chosen)?.label ?? chosen;
}

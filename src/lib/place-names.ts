/**
 * One place for how a place is written on screen.
 *
 * The FCT was spelled out in the state pickers but not on the pro bono screens,
 * which read it straight off the record, so the Review dialog, the Letter of
 * Designation and Lawyer Management all said "FCT" (QA 2026-11-01, item 12).
 * Three separate copies of this rule had grown up; they now all come here.
 */
const FCT_NAMES = ["FCT", "F.C.T", "F.C.T.", "ABUJA"];

export const displayStateName = (title?: string | null) => {
  const value = (title ?? "").trim();
  if (!value) return value;
  return FCT_NAMES.includes(value.toUpperCase()) ? "Federal Capital Territory" : value;
};

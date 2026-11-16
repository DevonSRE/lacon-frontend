import { z } from "zod";

/**
 * The fields that say where a case came from and who brought it (T17).
 *
 * They live here, apart from the form schema, because the filing schema parses
 * the whole form and zod drops any key it does not know. The form collected all
 * four and the submit threw them away, so every case read "Not recorded"
 * (QA 2026-11-01 run 4, 13 Nov, row 50). Keeping them in one place means the
 * schema and the test that guards it cannot drift.
 *
 * All optional: a filing that records no source is still a filing, and cases
 * filed before this was asked have none.
 */
export const caseSourceFields = {
  case_source: z.string().optional(),
  brought_by: z.string().optional(),
  facility_name: z.string().optional(),
  visit_date: z.string().optional(),
};

/** The keys the form must carry through to the API. */
export const CASE_SOURCE_KEYS = Object.keys(caseSourceFields);

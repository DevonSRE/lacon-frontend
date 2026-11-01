/**
 * The bulk-upload CSV, column for column.
 *
 * The API reads the file by POSITION, not by header name
 * (`CreateBulkCasefile` in the Go handler indexes row[0]..row[33]), so this
 * order is the contract: changing it silently files the wrong data. The header
 * row is skipped, and a row with fewer than 34 columns is reported as
 * "Missing required columns".
 */
export type BulkColumn = { header: string; required?: boolean; example: string; note?: string };

export const BULK_COLUMNS: BulkColumn[] = [
  { header: "Case type", required: true, example: "CIVIL CASE", note: "CIVIL CASE, CRIMINAL CASE, PDSS STATION, PDSS ORGANIZATION, DECONGESTION UNIT, MERCY APPLICATION" },
  { header: "First name", required: true, example: "Ada" },
  { header: "Middle name", example: "" },
  { header: "State", required: true, example: "Abia", note: "The state's name, spelled as it appears in the state list" },
  { header: "Last name", required: true, example: "Eze" },
  { header: "Gender", required: true, example: "MALE", note: "MALE, FEMALE or OTHER" },
  { header: "Permanent address", example: "12 Market Road, Umuahia" },
  { header: "Correctional facility", example: "" },
  { header: "Age", example: "35", note: "A whole number" },
  { header: "Phone number", example: "08012345678", note: "11 digits starting with 0, or +234 and 10 digits" },
  { header: "Marital status", example: "Single" },
  { header: "Email", example: "ada.eze@example.com" },
  { header: "State of origin", example: "Abia" },
  { header: "Occupation", example: "Trader" },
  { header: "Disability status", example: "NO" },
  { header: "Disability proof", example: "", note: "Leave blank: documents are uploaded on the case itself" },
  { header: "Complaint", example: "Landlord evicted the client without notice" },
  { header: "Average monthly income", example: "25000" },
  { header: "Legal aid reason", example: "Cannot afford a lawyer" },
  { header: "Number of dependants", example: "2", note: "A whole number" },
  { header: "Registration number", example: "" },
  { header: "Case number", example: "" },
  { header: "Court of hearing", example: "" },
  { header: "Defendant name", example: "" },
  { header: "Defendant address", example: "" },
  { header: "Defendant phone number", example: "" },
  { header: "Offence", example: "", note: "Criminal and PDSS cases" },
  { header: "Client location", example: "", note: "PDSS cases" },
  { header: "Date of admission", example: "", note: "YYYY-MM-DD" },
  { header: "Case status", example: "" },
  { header: "Court case number", example: "" },
  { header: "Bail status", example: "", note: "BAILED or UNBAILED" },
  { header: "Court of trial", example: "" },
  { header: "Prosecuting agency", example: "" },
];

/** How many columns every row must have; the API refuses a short row. */
export const BULK_COLUMN_COUNT = BULK_COLUMNS.length;

const csvCell = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

/** The template people fill in: the header row, then one example row to replace. */
export function bulkTemplateCsv(): string {
  const header = BULK_COLUMNS.map(column => csvCell(column.header)).join(",");
  const example = BULK_COLUMNS.map(column => csvCell(column.example)).join(",");
  return `${header}\n${example}\n`;
}

/**
 * The start of the week a date falls in, as a plain yyyy-mm-dd day.
 *
 * The reports and the case list both filter on the filing date with `from`, and
 * the API reads it as a bare day, so the day has to be built from the local
 * date parts: `toISOString` would shift it into the previous day for anyone
 * east of UTC, which is everyone in Nigeria (WAT, UTC+1).
 */
export function startOfWeek(date: Date): string {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // getDay() is 0 on Sunday, so Sunday belongs to the week that began six days ago.
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const month = `${monday.getMonth() + 1}`.padStart(2, "0");
  const day = `${monday.getDate()}`.padStart(2, "0");
  return `${monday.getFullYear()}-${month}-${day}`;
}

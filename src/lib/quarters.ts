/**
 * The quarters a report can cover (T11).
 *
 * LACON reports to the Presidency by quarter, so that is the unit the Reports
 * page offers first; custom dates are the alternative. The list runs back a few
 * years and never forward: a quarter that has not happened has nothing in it.
 */
export type Quarter = { quarter: number; year: number; label: string };

export function quarterOf(date: Date): Quarter {
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  const year = date.getFullYear();
  return { quarter, year, label: `Q${quarter} ${year}` };
}

/** The quarters a reader can pick, newest first. */
export function recentQuarters(now: Date = new Date(), years = 3): Quarter[] {
  const current = quarterOf(now);
  const list: Quarter[] = [];
  let { quarter, year } = current;
  for (let i = 0; i < years * 4; i++) {
    list.push({ quarter, year, label: `Q${quarter} ${year}` });
    quarter -= 1;
    if (quarter === 0) {
      quarter = 4;
      year -= 1;
    }
  }
  return list;
}

/** How a change reads beside a figure, or nothing when there is nothing to compare. */
export function changeText(percent: number | null | undefined): string {
  if (percent === null || percent === undefined) return "no comparison";
  if (percent === 0) return "no change";
  return `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`;
}

/**
 * Whether a change is good news. More cases received is not better or worse,
 * and a longer wait is worse, so the page never colours a figure it cannot
 * judge.
 */
export function changeTone(key: string, percent: number | null | undefined): "good" | "bad" | "neutral" {
  if (percent === null || percent === undefined || percent === 0) return "neutral";
  const lowerIsBetter = key === "days_to_assign" || key === "days_to_close" || key === "still_open";
  const higherIsBetter = key === "completed" || key === "closed" || key === "accepted";
  if (lowerIsBetter) return percent < 0 ? "good" : "bad";
  if (higherIsBetter) return percent > 0 ? "good" : "bad";
  return "neutral";
}

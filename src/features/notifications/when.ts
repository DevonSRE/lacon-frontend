/**
 * How long ago something happened, in words.
 *
 * The notification panel is read at a glance, so "5 minutes ago" is more use
 * there than a timestamp (QA 2026-11-01 run 4, 13 Nov, row 51).
 */
export function timeAgo(raw?: string | null, now: Date = new Date()): string {
  if (!raw) return "";
  const then = new Date(raw);
  if (Number.isNaN(then.getTime())) return "";

  const seconds = Math.round((now.getTime() - then.getTime()) / 1000);
  // A clock a little behind the server's should not read "in 3 seconds".
  if (seconds < 60) return "just now";

  const steps: ReadonlyArray<[number, string]> = [
    [60, "minute"],
    [60, "hour"],
    [24, "day"],
    [7, "week"],
  ];
  let value = seconds;
  let unit = "second";
  for (const [size, name] of steps) {
    if (value < size) break;
    value = Math.floor(value / size);
    unit = name;
  }
  if (unit === "week" && value >= 5) {
    // Past about a month, the date itself says more than the count does.
    return then.toLocaleDateString("en-GB");
  }
  return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
}

import type { ScopeSummary } from "./server/scope-report";

/**
 * The headline numbers of a scoped report, counted once.
 *
 * The Director General's totals lump every case that still needs a lawyer
 * into `pending`, including the ones nobody has accepted yet. A coordinator
 * acts on those two separately — accept what came in, then assign — so the
 * screens split them. Both the coordinator's home and the Reports page read
 * this, because they were splitting it differently and disagreeing by one:
 * the home showed "Waiting for a lawyer 10" while Reports showed 11.
 */
export type SummaryCard = { label: string; value: number; note?: string };

export function pendingReview(report?: ScopeSummary): number {
  return report?.by_status.find(row => row.id === "SUBMITTED")?.count ?? 0;
}

export function summaryCards(report?: ScopeSummary): SummaryCard[] {
  const totals = report?.totals;
  const review = pendingReview(report);
  return [
    { label: "Total cases", value: totals?.total ?? 0 },
    { label: "Pending review", value: review, note: "Filed online, not yet accepted" },
    // Everything still needing a lawyer, less the ones not yet accepted.
    { label: "Waiting for a lawyer", value: Math.max(0, (totals?.pending ?? 0) - review), note: "Accepted, not yet assigned" },
    { label: "With a lawyer", value: totals?.assigned ?? 0, note: "Assigned, in progress or in revision" },
    { label: "Resolved", value: totals?.resolved ?? 0, note: "Completed or closed" },
  ];
}

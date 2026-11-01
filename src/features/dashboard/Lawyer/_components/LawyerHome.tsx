"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { caseReference, statusLabel, type CaseRecord } from "@/features/cases/domain";
import { listCases } from "@/features/cases/server/lifecycle";
import LawyerUpcomingEvents from "./LawyerUpcomingEvents";

// Home used to render the Cases page itself — the same table, the same filters —
// so a lawyer had two identical screens (QA 2026-11-01, item 21). This is a
// summary: what is on their desk, what needs them first, and what is coming up.
const NEEDS_ACTION = ["REVISION_REQUESTED", "ASSIGNED"];

const filedOn = (raw?: string) => {
  const date = raw ? new Date(raw) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "-";
};

export default function LawyerHome() {
  const { data: user } = useAppSelector(s => s.profile);
  // A lawyer's list is already scoped to the cases assigned to them, and their
  // case load is capped, so one page covers it.
  const cases = useQuery({
    queryKey: ["case-lifecycle", user?.id, "lawyer-home"],
    queryFn: () => listCases({ page: 1, size: 50, search: "all" }),
    enabled: !!user?.id,
  });
  const rows: CaseRecord[] = cases.data?.success ? cases.data.data.data : [];
  const count = (statuses: string[]) => rows.filter(row => statuses.includes(row.status)).length;
  const attention = rows
    .filter(row => NEEDS_ACTION.includes(row.status))
    .sort((a, b) => NEEDS_ACTION.indexOf(a.status) - NEEDS_ACTION.indexOf(b.status))
    .slice(0, 5);

  const cards = [
    { label: "Open cases", value: count(["ASSIGNED", "INPROGRESS", "REVISION_REQUESTED"]) },
    { label: "In progress", value: count(["INPROGRESS"]) },
    { label: "Revision requested", value: count(["REVISION_REQUESTED"]) },
    { label: "Completed", value: count(["COMPLETED", "RESOLVED", "CLOSED"]) },
  ];

  return (
    <div className="min-w-0 max-w-full space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">
          {user?.first_name ? `Welcome, ${user.first_name}` : "Welcome"}
        </h1>
        <Link href="/cases" className="text-sm text-red-700 underline">Go to your cases</Link>
      </div>

      {cases.isLoading ? <p role="status" className="text-sm text-gray-500">Loading your cases…</p>
        : cases.data && !cases.data.success ? <p role="alert" className="text-sm text-red-600">{cases.data.message}</p>
          : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map(card => (
                  <div key={card.label} className="rounded border bg-white p-4">
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="text-2xl font-semibold">{card.value}</p>
                  </div>
                ))}
              </div>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold">Needs you first</h2>
                {!attention.length
                  ? <p className="rounded border bg-white p-6 text-center text-sm text-gray-500">
                      Nothing is waiting on you. Cases you have started appear under your cases.
                    </p>
                  : (
                    <ul className="space-y-2">
                      {attention.map(row => (
                        <li key={row.id} className="rounded border bg-white p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Link href={`/cases/${row.id}`} className="font-medium underline">{caseReference(row)}</Link>
                            <span className="rounded bg-gray-100 px-2 py-1 text-xs">{statusLabel(row.status)}</span>
                          </div>
                          <p className="text-sm">{row.first_name} {row.last_name} · {row.case_type}</p>
                          <p className="text-xs text-gray-500">
                            {row.status === "REVISION_REQUESTED"
                              ? "The assigner asked for a correction."
                              : "Assigned to you and not started yet."}
                            {" "}Filed {filedOn(row.created_at ?? row.filed_date)}.
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
              </section>
            </>
          )}

      <LawyerUpcomingEvents />
    </div>
  );
}

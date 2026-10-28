"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import CaseActions, { type Action } from "@/features/cases/_components/CaseActions";
import { caseReference, type CaseFilters, type CaseRecord } from "@/features/cases/domain";
import { listCases } from "@/features/cases/server/lifecycle";
import { displayStateName } from "@/components/get-state";

const filedOn = (raw?: string) => {
  const date = raw ? new Date(raw) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-";
};

export function Queue({ title, empty, filters, actions }: { title: string; empty: string; filters: CaseFilters; actions: Action[] }) {
  const { data: user } = useAppSelector(s => s.profile);
  const queryClient = useQueryClient();
  const cases = useQuery({
    queryKey: ["case-lifecycle", user?.id, "dashboard-queue", filters],
    queryFn: () => listCases({ page: 1, size: 10, search: "all", ...filters }),
    enabled: !!user?.id,
  });
  const page = cases.data?.success ? cases.data.data : undefined;
  const rows: CaseRecord[] = page?.data ?? [];
  // A decision moves the case between the queues and changes the cards.
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["case-lifecycle"] });
    queryClient.invalidateQueries({ queryKey: ["getDashboardAnalysis"] });
  };

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title} ({page?.total_rows ?? 0})</h2>
      {cases.isLoading ? <p role="status" className="text-sm text-gray-500">Loading cases…</p>
        : cases.data && !cases.data.success ? <p role="alert" className="text-sm text-red-600">{cases.data.message}</p>
          : !rows.length ? <p className="rounded border bg-white p-6 text-center text-sm text-gray-500">{empty}</p>
            : (
              <div className="overflow-x-auto rounded border bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50"><tr>{["Reference", "Client", "Filing state", "Filed", "Action"].map(label => <th key={label} className="whitespace-nowrap p-3 font-medium">{label}</th>)}</tr></thead>
                  <tbody>
                    {rows.map(row => (
                      <tr key={row.id} className="border-t align-top">
                        <td className="p-3"><Link className="whitespace-nowrap font-medium underline" href={`/cases/${row.id}`}>{caseReference(row)}</Link></td>
                        <td className="p-3">{row.first_name} {row.last_name}</td>
                        <td className="p-3">{row.state_name ? displayStateName(row.state_name) : "Not recorded"}</td>
                        <td className="whitespace-nowrap p-3">{filedOn(row.created_at)}</td>
                        <td className="p-3"><CaseActions caseRecord={row} onChanged={refresh} only={actions} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      {(page?.total_pages ?? 1) > 1 && <Link href="/cases" className="text-sm text-red-700 underline">See all in Cases</Link>}
    </section>
  );
}

/** A head's home: online cases waiting for review, then accepted or staff-filed cases waiting for a lawyer. */
export default function UnitCaseQueues() {
  return (
    <div className="space-y-8">
      <Queue title="Waiting for review" empty="No online cases are waiting for your review."
        filters={{ queue: "mine", status: "SUBMITTED" }} actions={["accept", "reject"]} />
      <Queue title="Waiting for assignment" empty="No cases are waiting for a lawyer."
        filters={{ queue: "to_assign" }} actions={["route", "assign"]} />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import Intro from "@/components/Intro";
import { Button } from "@/components/ui/button";
import { useAction } from "@/context/ActionContext";
import { useAppSelector } from "@/hooks/redux";
import { displayStateName } from "@/lib/place-names";
import { startOfWeek } from "@/lib/week";
import { ROLES } from "@/types/auth";
import { getScopeSummary, type SummaryRow } from "@/features/report/server/scope-report";
import { summaryCards } from "@/features/report/summary-cards";
import { AddLawyerSheet } from "../Lawyer/_components/addLawyer";
import { Queue } from "../components/UnitCaseQueues";

/**
 * Home for a Zonal Director, State or Centre Coordinator.
 *
 * It used to render the Cases page itself, so the coordinator's first screen
 * was a raw table with no summary, nothing marked as needing them, and no way
 * to act on a case without opening it (QA 2026-11-01, item 25).
 *
 * The numbers come from the role-scoped report, which the API already narrows
 * to the caller's own zone, state or centre. The two queues below them are the
 * same ones a unit head gets, because the work is the same: accept or reject
 * what came in online, then put a lawyer on it.
 */

function Card({ label, value, note }: { label: string; value: number | string; note?: string }) {
  return (
    <div className="space-y-1 rounded border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-gray-400">{note ?? " "}</p>
    </div>
  );
}

function Breakdown({ title, rows, empty }: { title: string; rows: SummaryRow[]; empty: string }) {
  if (!rows.length) return <div className="space-y-2"><h3 className="font-medium">{title}</h3><p className="rounded border bg-white p-4 text-sm text-gray-500">{empty}</p></div>;
  return (
    <div className="space-y-2">
      <h3 className="font-medium">{title}</h3>
      <div className="overflow-hidden rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3 font-medium">Name</th><th className="p-3 font-medium">Cases</th><th className="p-3 font-medium">Completed</th></tr></thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id || row.title} className="border-t">
                <td className="p-3">{displayStateName(row.title) || "Not recorded"}</td>
                <td className="p-3">{row.count}</td>
                <td className="p-3">{row.completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CoordinatorHome({ role }: { role: string }) {
  const { data: user } = useAppSelector(s => s.profile);
  const { setIsOpen } = useAction();
  const week = startOfWeek(new Date());

  const summary = useQuery({
    queryKey: ["scope-summary", user?.id],
    queryFn: () => getScopeSummary(),
    enabled: !!user?.id,
    staleTime: 60000,
  });
  // The same report over this week only: the API counts by filing date, so one
  // extra call is cheaper and truer than counting a page of rows here.
  const thisWeek = useQuery({
    queryKey: ["scope-summary", user?.id, week],
    queryFn: () => getScopeSummary({ from: week }),
    enabled: !!user?.id,
    staleTime: 60000,
  });

  const report = summary.data?.success ? summary.data.data : undefined;
  const totals = report?.totals;
  const filedThisWeek = thisWeek.data?.success ? thisWeek.data.data.totals.total : undefined;
  // A Centre Coordinator's report breaks down by lawyer; above them it is the
  // level below: centres for a state, states for a zone.
  const lower = report?.by_centre?.length ? { title: "Centres in your state", rows: report.by_centre, empty: "No centre in your state has a case yet." }
    : report?.by_state?.length ? { title: "States in your zone", rows: report.by_state, empty: "No state in your zone has a case yet." }
      : report?.by_lawyer ? { title: "Lawyers", rows: report.by_lawyer, empty: "No case here has a lawyer yet." }
        : undefined;

  return (
    <div className="min-w-0 max-w-full space-y-8">
      <AddLawyerSheet />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Intro user={role} />
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setIsOpen(true)} className="h-11 bg-red-600 text-white hover:bg-red-700">
            <CirclePlus size={20} />
            {/* A coordinator cannot create an account: the API refuses it, so this
                raises a request for the Director General (item 3). */}
            Request a user
          </Button>
          <Link href="/cases" className="text-sm text-red-700 underline">Go to all cases</Link>
        </div>
      </div>

      {summary.isLoading ? <p role="status" className="text-sm text-gray-500">Loading your summary…</p>
        : summary.data && !summary.data.success
          ? <div role="alert" className="space-y-3 rounded bg-red-50 p-4 text-sm"><p>{summary.data.message}</p><Button variant="outline" onClick={() => summary.refetch()}>Retry</Button></div>
          : (
            <>
              <section className="space-y-3">
                <h2 className="text-lg font-semibold">
                  {report?.scope.name ? `${displayStateName(report.scope.name)} at a glance` : "At a glance"}
                </h2>
                {/* One definition of these five, shared with the Reports page:
                    the two were splitting "still needs a lawyer" differently
                    and disagreeing by one. "New this week" is the note on the
                    first card rather than a card of its own. */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {summaryCards(report).map((card, i) => (
                    <Card key={card.label} label={card.label} value={card.value}
                      note={i === 0 && filedThisWeek !== undefined ? `${filedThisWeek} filed this week` : card.note} />
                  ))}
                </div>
              </section>

              <Queue title="Waiting for your review" description="Cases filed online that came to you. Accept one to make it ready for a lawyer, or reject it with a reason. The cards above count every case in your area, including the ones someone else holds."
                empty="No online case is waiting for your review." filters={{ queue: "mine", status: "SUBMITTED" }} actions={["accept", "reject"]} />

              <Queue title="Waiting for a lawyer" description="Accepted and staff-filed cases you hold. Assign a lawyer, or send the case on to a centre."
                empty="No case of yours is waiting for a lawyer." filters={{ queue: "to_assign" }} actions={["route", "assign"]} />

              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Reports</h2>
                  <Link href="/reports" className="text-sm text-red-700 underline">Open the full report</Link>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <Breakdown title="By case type" rows={report?.by_case_type ?? []} empty="No case has been filed in your area yet." />
                  {lower && <Breakdown {...lower} />}
                </div>
              </section>
            </>
          )}
    </div>
  );
}

export const COORDINATOR_HOME_ROLES: string[] = [
  ROLES.ZONAL_DIRECTOR,
  ROLES.STATE_COORDINATOR,
  ROLES.CENTRE_COORDINATOR,
];

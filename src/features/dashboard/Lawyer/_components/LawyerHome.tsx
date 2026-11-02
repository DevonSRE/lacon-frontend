"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { caseReference, statusLabel } from "@/features/cases/domain";
import { getLawyerWorkSummary } from "@/features/cases/server/lifecycle";
import LawyerUpcomingEvents from "./LawyerUpcomingEvents";

// Home used to render the Cases page itself — the same table, the same filters —
// so a lawyer had two identical screens (QA 2026-11-01, item 21). This is a
// summary: what is on their desk, what needs them first, and what is coming up.

const filedOn = (raw?: string) => {
  const date = raw ? new Date(raw) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "-";
};

export default function LawyerHome() {
  const { data: user } = useAppSelector(s => s.profile);
  const cases=useQuery({queryKey:["case-lifecycle",user?.id,"lawyer-home"],queryFn:getLawyerWorkSummary,enabled:!!user?.id});
  const data=cases.data?.success ? cases.data.data : undefined;
  const count=(statuses:string[])=>statuses.reduce((n,status)=>n+(data?.counts[status] ?? 0),0);
  const attention=data?.needs_action ?? [];
  const cards=[
    {label:"Assigned",value:count(["ASSIGNED"])},
    {label:"In progress",value:count(["INPROGRESS"])},
    {label:"Revision requested",value:count(["REVISION_REQUESTED"])},
    {label:"Returned by you",value:count(["RETURNED"])},
    {label:"Completed",value:count(["COMPLETED","RESOLVED","CLOSED"])},
    {label:"Needs an update",value:count(["OVERDUE"])},
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

      <section className="space-y-3"><h2 className="font-semibold">Cases needing an update</h2><p className="text-sm">No progress update for at least {data?.stale_after_days ?? 14} days.</p>
      {data?.overdue.length ? <ul>{data.overdue.map(c=><li key={c.id}><Link className="underline" href={`/cases/${c.id}`}>{caseReference(c)} · {c.first_name} {c.last_name}</Link></li>)}</ul>:<p>No overdue updates.</p>}</section>
      <LawyerUpcomingEvents />
    </div>
  );
}

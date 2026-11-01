"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/hooks/redux";
import { statusLabel } from "@/features/cases/domain";
import { displayStateName } from "@/lib/place-names";
import { getScopeSummary, type SummaryRow } from "../server/scope-report";

/**
 * The role-scoped report, for a reader the admin report is not meant for.
 *
 * `/analytics/summary` has always answered a Zonal Director, a State or Centre
 * Coordinator and a unit head, narrowing the data to their own area from their
 * account — but nothing on the frontend called it, and /reports was closed to
 * them, so they had no reports at all (QA 2026-11-01, item 25).
 */
const SCOPE_NOTES: Record<string, string> = {
  zone: "Every case filed in your zone, broken down by the states in it.",
  state: "Every case filed in your state, broken down by the centres in it.",
  centre: "Every case filed at your centre, broken down by the lawyers working on them.",
  unit: "Every case in your unit, broken down by the lawyers working on them.",
  national: "Every case on the platform.",
};

function Rows({ title, rows, label, translate }: { title: string; rows: SummaryRow[]; label: string; translate?: (value: string) => string }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {!rows.length
        ? <p className="rounded border bg-white p-6 text-center text-sm text-gray-500">Nothing to report here yet.</p>
        : (
          <div className="overflow-x-auto rounded border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50"><tr>
                <th className="p-3 font-medium">{label}</th>
                <th className="p-3 font-medium">Cases</th>
                <th className="p-3 font-medium">Completed</th>
              </tr></thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id || row.title} className="border-t">
                    <td className="p-3">{(translate ? translate(row.title) : row.title) || "Not recorded"}</td>
                    <td className="p-3">{row.count}</td>
                    <td className="p-3">{row.completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </section>
  );
}

export default function ScopeReport() {
  const { data: user } = useAppSelector(s => s.profile);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [range, setRange] = useState<{ from?: string; to?: string }>({});

  const report = useQuery({
    queryKey: ["scope-summary", user?.id, "report", range],
    queryFn: () => getScopeSummary(range),
    enabled: !!user?.id,
    staleTime: 60000,
  });
  const data = report.data?.success ? report.data.data : undefined;
  const totals = data?.totals;
  const cards = [
    { label: "Total cases", value: totals?.total ?? 0 },
    { label: "Waiting for a lawyer", value: totals?.pending ?? 0 },
    { label: "With a lawyer", value: totals?.assigned ?? 0 },
    { label: "Resolved", value: totals?.resolved ?? 0 },
    { label: "Rejected", value: totals?.rejected ?? 0 },
  ];
  const lower = data?.by_centre?.length ? { title: "By centre", rows: data.by_centre, label: "Centre" }
    : data?.by_state?.length ? { title: "By state", rows: data.by_state, label: "State", translate: displayStateName }
      : data?.by_lawyer ? { title: "By lawyer", rows: data.by_lawyer, label: "Lawyer" }
        : undefined;

  return (
    <div className="min-w-0 max-w-full space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {data?.scope.name ? `${displayStateName(data.scope.name)} report` : "Report"}
        </h1>
        <p className="text-sm text-gray-500">
          {SCOPE_NOTES[data?.scope.level ?? ""] ?? "The part of the data your role covers."}
        </p>
      </div>

      <form
        className="flex flex-wrap items-end gap-3 rounded border bg-white p-4"
        onSubmit={event => { event.preventDefault(); setRange({ from: from || undefined, to: to || undefined }); }}
      >
        <div className="space-y-1">
          <Label htmlFor="report-from">Filed from</Label>
          <Input id="report-from" type="date" value={from} max={to || undefined} onChange={e => setFrom(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="report-to">Filed up to</Label>
          <Input id="report-to" type="date" value={to} min={from || undefined} onChange={e => setTo(e.target.value)} />
        </div>
        <Button type="submit">Apply</Button>
        {(range.from || range.to) && (
          <Button type="button" variant="outline" onClick={() => { setFrom(""); setTo(""); setRange({}); }}>
            Clear dates
          </Button>
        )}
      </form>

      {report.isLoading ? <p role="status" className="py-10 text-center text-sm text-gray-500">Loading the report…</p>
        : report.data && !report.data.success
          ? <div role="alert" className="space-y-3 rounded bg-red-50 p-4 text-sm"><p>{report.data.message}</p><Button variant="outline" onClick={() => report.refetch()}>Retry</Button></div>
          : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {cards.map(card => (
                  <div key={card.label} className="space-y-1 rounded border bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="text-2xl font-semibold">{card.value}</p>
                  </div>
                ))}
              </div>
              <Rows title="By status" rows={data?.by_status ?? []} label="Status" translate={statusLabel} />
              <Rows title="By case type" rows={data?.by_case_type ?? []} label="Case type" />
              {lower && <Rows {...lower} />}
            </>
          )}
    </div>
  );
}

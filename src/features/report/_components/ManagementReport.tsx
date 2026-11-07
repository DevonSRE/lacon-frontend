"use client";

import { useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { useAction } from "@/context/ActionContext";
import { changeText, changeTone, quarterOf, recentQuarters } from "@/lib/quarters";
import {
  downloadManagementReport,
  getManagementReport,
  type ManagementFilters,
  type ManagementSection,
} from "../server/management-report";

/**
 * The report LACON management reads (T11).
 *
 * The page draws what the API worked out: the figures, what each one was last
 * period, and the sections behind them. Nothing is recalculated here, and the
 * PDF is printed from the same report, so the screen and the paper cannot
 * disagree.
 */
const TONE: Record<string, string> = {
  good: "text-green-700",
  bad: "text-red-700",
  neutral: "text-gray-500",
};

export default function ManagementReport() {
  const { data: user } = useAppSelector(state => state.profile);
  // The area comes from the filters the whole Reports page shares, so every tab
  // is looking at the same place (T11, criterion 11). The period is this tab's
  // own: management reports by quarter, which the other tabs do not offer.
  const { selectedZoneId, selectedStateId, selectedCentreId } = useAction();
  const current = quarterOf(new Date());
  const quarters = recentQuarters();
  const [period, setPeriod] = useState(`${current.year}-${current.quarter}`);
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [downloading, setDownloading] = useState(false);
  const [pending, startTransition] = useTransition();

  const usingCustomDates = custom.from !== "" && custom.to !== "";
  const [year, quarter] = period.split("-").map(Number);
  const area = {
    zone: selectedZoneId || undefined,
    state: selectedStateId || undefined,
    center: selectedCentreId || undefined,
  };
  const filters: ManagementFilters = usingCustomDates
    ? { ...area, from: custom.from, to: custom.to }
    : { ...area, quarter, year };

  const report = useQuery({
    queryKey: ["management-report", user?.id, filters],
    queryFn: () => getManagementReport(filters),
    enabled: !!user?.id,
  });

  const take = () => {
    setDownloading(true);
    startTransition(async () => {
      const result = await downloadManagementReport(filters);
      setDownloading(false);
      if (!result.success) {
        toast.error("The report could not be printed.", { description: result.message });
        return;
      }
      const bytes = Uint8Array.from(atob(result.data), char => char.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: result.contentType }));
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename || "LACON-management-report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const data = report.data?.success ? report.data.data : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {data ? `${data.title} · ${data.period} · ${data.area}` : "Management report"}
          </h1>
          {data && (
            <p className="text-sm text-gray-500">
              Covering {new Date(data.from).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              {" to "}
              {new Date(data.to).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              {" · compared with "}{data.previous_period}
              {" · generated "}
              {new Date(data.generated_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
        <Button type="button" variant="outline" disabled={downloading || pending || !data} onClick={take}>
          {downloading ? "Preparing…" : "Download management report (PDF)"}
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded border p-3">
        <label className="flex flex-col text-sm">
          Period
          <select
            aria-label="Period"
            className="mt-1 rounded border p-2"
            value={period}
            disabled={usingCustomDates}
            onChange={event => setPeriod(event.target.value)}
          >
            {quarters.map(q => (
              <option key={`${q.year}-${q.quarter}`} value={`${q.year}-${q.quarter}`}>{q.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm">
          Or from
          <input type="date" aria-label="From" className="mt-1 rounded border p-2" value={custom.from}
            onChange={event => setCustom(prev => ({ ...prev, from: event.target.value }))} />
        </label>
        <label className="flex flex-col text-sm">
          to
          <input type="date" aria-label="To" className="mt-1 rounded border p-2" value={custom.to}
            onChange={event => setCustom(prev => ({ ...prev, to: event.target.value }))} />
        </label>
        {usingCustomDates && (
          <Button variant="ghost" onClick={() => setCustom({ from: "", to: "" })}>Back to quarters</Button>
        )}
      </div>

      {report.isLoading && <p role="status" className="py-10 text-center">Building the report…</p>}
      {report.data && !report.data.success && (
        <div role="alert" className="space-y-3 rounded bg-red-50 p-4">
          <p>{report.data.message}</p>
          <Button variant="outline" onClick={() => report.refetch()}>Retry</Button>
        </div>
      )}

      {data && (
        <>
          <p className="rounded border-l-4 border-red-600 bg-gray-50 p-4 text-base">{data.summary}</p>

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.figures.map(figure => (
              <div key={figure.key} className="rounded border p-4">
                <p className="text-sm text-gray-600">{figure.label}</p>
                <p className="text-2xl font-semibold">
                  {figure.value}{figure.unit ? ` ${figure.unit}` : ""}
                </p>
                <p className={`text-xs ${TONE[changeTone(figure.key, figure.change_percent)]}`}>
                  {figure.change_percent === null
                    ? `Nothing to compare: ${data.previous_period} had none`
                    : `${changeText(figure.change_percent)} on ${data.previous_period} (${figure.previous}${figure.unit ? ` ${figure.unit}` : ""})`}
                </p>
                {/* Every figure explains itself: a reader who has never used the
                    system should not have to ask what "Accepted" counts. */}
                <p className="mt-2 text-xs text-gray-500" title={figure.definition}>{figure.definition}</p>
              </div>
            ))}
          </section>

          {data.sections.map(section => <Section key={section.key} section={section} />)}
        </>
      )}
    </div>
  );
}

function Section({ section }: { section: ManagementSection }) {
  const rows = section.rows ?? [];
  const columns = section.columns.filter(column => column.trim() !== "");
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{section.title}</h2>
      {rows.length === 0 ? (
        <p className="rounded border p-4 text-sm text-gray-500">{section.empty}</p>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>{columns.map((column, i) => (
                <th key={column} className={`p-3 font-medium ${i === 0 ? "" : "text-right"}`}>{column}</th>
              ))}</tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.title}-${index}`} className="border-t">
                  <td className="p-3">
                    {row.title}
                    {row.note && <span className="block text-xs text-gray-500">{row.note}</span>}
                  </td>
                  {columns.length > 1 && <td className="p-3 text-right">{row.count}</td>}
                  {columns.length > 2 && <td className="p-3 text-right">{row.extra}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* A fact about the section as a whole, such as how much of the work was
          done pro bono. */}
      {section.note && <p className="text-sm">{section.note}</p>}
      {/* Said plainly rather than letting a thin section read as a complete one. */}
      {section.caveat && <p className="text-xs text-gray-500">{section.caveat}</p>}
    </section>
  );
}

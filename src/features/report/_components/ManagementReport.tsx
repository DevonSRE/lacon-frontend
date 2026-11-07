"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { useAction } from "@/context/ActionContext";
import { changeText, changeTone, quarterOf, recentQuarters } from "@/lib/quarters";
import { AGE_BRACKETS, SEXES, ageBounds, filterSummary, offenceParam } from "@/lib/statistics-filters";
import { getOffences, getPeopleOnCases } from "@/features/cases/server/lifecycle";
import {
  downloadManagementReport,
  getManagementReport,
  type ManagementFilters,
  type ManagementRow,
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
  // The Statistics filters (T3). Every figure and section on the page answers
  // them, and the PDF is printed from the same report, so a filtered page and
  // its printout cannot disagree.
  const [offences, setOffences] = useState<string[]>([]);
  const [ageBracket, setAgeBracket] = useState("");
  const [sex, setSex] = useState("");
  const [workedOn, setWorkedOn] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [pending, startTransition] = useTransition();

  const usingCustomDates = custom.from !== "" && custom.to !== "";
  const [year, quarter] = period.split("-").map(Number);
  const area = {
    zone: selectedZoneId || undefined,
    state: selectedStateId || undefined,
    center: selectedCentreId || undefined,
  };
  const narrowed = {
    ...area,
    offence: offenceParam(offences),
    sex: sex || undefined,
    worked_on: workedOn || undefined,
    ...ageBounds(ageBracket),
  };
  const filters: ManagementFilters = usingCustomDates
    ? { ...narrowed, from: custom.from, to: custom.to }
    : { ...narrowed, quarter, year };

  // The offences on the cases this reader can see (T3), read from the data
  // because the agreed list is not loaded yet.
  const offenceOptions = useQuery({
    queryKey: ["case-offences", user?.id],
    queryFn: () => getOffences(),
    enabled: !!user?.id,
    staleTime: 60000,
  });

  // Everyone who has had a hand in a case this reader can see (T3): the
  // question "how many cases has this officer worked on this year?".
  const people = useQuery({
    queryKey: ["case-people", user?.id],
    queryFn: () => getPeopleOnCases(),
    enabled: !!user?.id,
    staleTime: 60000,
  });

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
  const workedOnName = (people.data?.success ? people.data.data : []).find(p => p.id === workedOn)?.name;

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
        <label className="flex flex-col text-sm">
          Offence
          <select aria-label="Offence" className="mt-1 rounded border p-2" value={offences[0] ?? ""}
            onChange={event => setOffences(event.target.value ? [event.target.value] : [])}>
            <option value="">Any offence</option>
            {(offenceOptions.data?.success ? offenceOptions.data.data : []).map(o => (
              <option key={o.offence} value={o.offence}>{o.offence} ({o.count})</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm">
          Age
          <select aria-label="Age range" className="mt-1 rounded border p-2" value={ageBracket}
            onChange={event => setAgeBracket(event.target.value)}>
            <option value="">Any age</option>
            {AGE_BRACKETS.map(bracket => <option key={bracket.value} value={bracket.value}>{bracket.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col text-sm">
          Sex
          <select aria-label="Sex" className="mt-1 rounded border p-2" value={sex}
            onChange={event => setSex(event.target.value)}>
            <option value="">Any sex</option>
            {SEXES.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col text-sm">
          Worked on by
          <select aria-label="Worked on by" className="mt-1 rounded border p-2" value={workedOn}
            onChange={event => setWorkedOn(event.target.value)}>
            <option value="">Anyone</option>
            {(people.data?.success ? people.data.data : []).map(person => (
              <option key={person.id} value={person.id}>{person.name}</option>
            ))}
          </select>
        </label>
        {(offences.length > 0 || ageBracket || sex || workedOn) && (
          <Button variant="ghost" onClick={() => { setOffences([]); setAgeBracket(""); setSex(""); setWorkedOn(""); }}>
            Clear filters
          </Button>
        )}
      </div>

      {/* What the figures below are narrowed to, said in words: a filtered
          report that does not say so reads as the whole picture. */}
      {filterSummary({ offences, ageBracket, sex, workedOnName: workedOnName }) !== "" && (
        <p className="text-sm text-gray-600">
          Showing {filterSummary({ offences, ageBracket, sex, workedOnName: workedOnName })} only.
        </p>
      )}

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

          {data.sections.map(section => <Section key={section.key} section={section} filters={filters} />)}
        </>
      )}
    </div>
  );
}

/**
 * Where a row's cases are, on the case list (T3, criterion 4). A figure nobody
 * can open is a figure nobody can check: the link carries the same filters the
 * report was read with, so the list shows exactly what was counted.
 */
function drillDown(section: ManagementSection, row: ManagementRow, filters: ManagementFilters): string | undefined {
  const params = new URLSearchParams();
  const carry: Array<[string, string | number | undefined]> = [
    ["state", filters.state], ["offence", filters.offence], ["sex", filters.sex],
    ["age_min", filters.age_min], ["age_max", filters.age_max],
    ["from", filters.from], ["to", filters.to],
  ];
  for (const [key, value] of carry) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  switch (section.key) {
    case "offences":
      params.set("offence", row.title);
      break;
    case "backlog":
      // The office column is the filing state, which is how the list reads it.
      params.set("state", row.title);
      break;
    default:
      // Outcomes, lawyers and decongestion have no filter of their own on the
      // case list yet, so the row would open an unfiltered list and look like
      // a link that lost the reader's place. Better to offer none.
      return undefined;
  }
  return `/cases?${params.toString()}`;
}

function Section({ section, filters }: { section: ManagementSection; filters: ManagementFilters }) {
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
                    {drillDown(section, row, filters)
                      ? <Link className="underline" href={drillDown(section, row, filters)!}>{row.title}</Link>
                      : row.title}
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

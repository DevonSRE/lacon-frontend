"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks/redux";
import { states } from "@/lib/types";
import { displayStateName } from "@/components/get-state";
import { CASE_STATUS_LABELS, caseReference, statusLabel, HEAD_ROLES, COORDINATOR_ROLES } from "../domain";
import { listCases } from "../server/lifecycle";
import FileACaseComponent from "@/features/component/FileACase";

export default function CaseList({ title = "Cases", initialSearch = "" }: { title?: string; initialSearch?: string }) {
  const { data: user } = useAppSelector(s => s.profile);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 300);
  const [status, setStatus] = useState("all");
  const [caseType, setCaseType] = useState("all");
  const [state, setState] = useState("all");
  const [queue, setQueue] = useState("all");
  const [page, setPage] = useState(1);
  const canQueue = user?.role === "DIRECTOR GENERAL" || HEAD_ROLES.includes(user?.role ?? "") || COORDINATOR_ROLES.includes(user?.role ?? "");
  const canFile = user?.role === "INTERNAL PARALEGAL";
  const cases = useQuery({
    queryKey: ["case-lifecycle", user?.id, "list", page, debouncedSearch, status, caseType, state, queue],
    queryFn: () => listCases({ page, size: 10, search: debouncedSearch.trim() || "all", status, case_type: caseType, state, queue }),
    enabled: !!user?.id,
  });
  const result = cases.data?.success ? cases.data.data : undefined;
  const rows = result?.data ?? [];
  const filter = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLSelectElement>) => { setter(event.target.value); setPage(1); };
  return <div className="min-w-0 max-w-full space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-semibold">{title}</h1>{canFile && <div className="flex flex-wrap gap-2">{/* Bulk Upload stays hidden until the upload works (QA 2026-10-26, item 29). */}<FileACaseComponent userRole={user.role} buttonText="File a Case" showIcon onCaseSubmitted={() => cases.refetch()} buttonClassName="bg-red-600 text-white" /></div>}</div>
    {canQueue && <div className="flex flex-wrap gap-2">{[{ value: "all", label: "All cases in scope" }, { value: "mine", label: "My queue" }, { value: "unassigned", label: "Awaiting assignment" }].map(tab => <Button key={tab.value} variant={queue === tab.value ? "default" : "outline"} onClick={() => { setQueue(tab.value); setPage(1); }}>{tab.label}</Button>)}</div>}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Input aria-label="Search cases" placeholder="Client name or LACON reference" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      <select aria-label="Case status" className="rounded border p-2" value={status} onChange={filter(setStatus)}><option value="all">All statuses</option>{Object.entries(CASE_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}{value === "RESOLVED" ? " (legacy)" : ""}</option>)}</select>
      <select aria-label="Case type" className="rounded border p-2" value={caseType} onChange={filter(setCaseType)}><option value="all">All case types</option>{["CIVIL CASE", "CRIMINAL CASE", "PDSS ORGANIZATION", "PDSS STATION", "DECONGESTION", "MERCY APPLICATION"].map(value => <option key={value}>{value}</option>)}</select>
      <select aria-label="Filing state" className="rounded border p-2" value={state} onChange={filter(setState)}><option value="all">All filing states</option>{states.map(value => <option key={value} value={value}>{displayStateName(value)}</option>)}</select>
    </div>
    {!user || cases.isLoading ? <p role="status" className="py-10 text-center">Loading cases…</p> : cases.isError || (cases.data && !cases.data.success) ? <div role="alert" className="space-y-3 rounded bg-red-50 p-4"><p>{cases.data && !cases.data.success ? cases.data.message : "Cases could not be loaded."}</p><Button variant="outline" onClick={() => cases.refetch()}>Retry</Button></div> : <>
      <div className="overflow-x-auto rounded border"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr>{["Reference / Client", "Case type", "Status", "Filed from", "Current holder", "Assigned by", "Action"].map(label => <th className="whitespace-nowrap p-3 font-medium" key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-t"><td className="p-3"><Link className="inline-block whitespace-nowrap font-medium underline" href={`/cases/${row.id}`}>{caseReference(row)}</Link><p>{row.first_name} {row.last_name}</p>{!!row.possible_duplicate_of?.length && <span className="text-xs text-amber-700">Possible duplicate</span>}</td><td className="p-3">{row.case_type}</td><td className="p-3"><span className="inline-block whitespace-nowrap rounded bg-gray-100 px-2 py-1">{statusLabel(row.status)}</span></td><td className="p-3"><p>{row.origin_channel} · {row.filed_level}</p><p>{row.state_name ? displayStateName(row.state_name) : "Not recorded"}</p>{row.filing_actor?.name && <p className="text-xs text-gray-500">{row.filing_actor.name}</p>}</td><td className="p-3">{row.current_holder?.name || "No holder"}<p className="text-xs text-gray-500">{row.current_holder?.role}</p></td><td className="p-3">{row.assigned_by || row.assignment?.assignor || "—"}</td><td className="p-3"><Link className="inline-block whitespace-nowrap text-red-700 underline" href={`/cases/${row.id}`}>Open case</Link></td></tr>)}{!rows.length && <tr><td colSpan={7} className="p-10 text-center text-gray-500">No cases match these filters.</td></tr>}</tbody></table></div>
      {result && result.total_rows > 0 && <div className="flex flex-wrap items-center justify-end gap-3"><span className="text-sm text-gray-500">{result.total_rows} cases · Page {page} of {Math.max(1, result.total_pages)}</span><Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><Button variant="outline" disabled={page >= result.total_pages} onClick={() => setPage(page + 1)}>Next</Button></div>}
    </>}
  </div>;
}

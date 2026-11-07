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
import { roleLabel } from "@/lib/role-labels";
import { CASE_STATUS_LABELS, caseReference, statusLabel, filedFrom, HEAD_ROLES, COORDINATOR_ROLES } from "../domain";
import { getCaseFilers, listCases } from "../server/lifecycle";
import FileACaseComponent from "@/features/component/FileACase";
import BulkCaseUploadDialog from "@/features/dashboard/components/BulkUpload";
import CaseActions, { type Action } from "./CaseActions";
import ExportCases from "./ExportCases";
import { canReviewDuplicates, sharedLabel } from "@/lib/duplicates";
import { CASE_SOURCES, ONLINE_SOURCE } from "@/lib/case-source";

// What a row may offer without opening the case. The Action column held a single
// "Open case" link, so a coordinator had to open every case to find the one
// waiting on them and then act on it (QA 2026-11-01, item 25). CaseActions
// shows only what this case and this reader actually allow, so most rows show
// nothing extra.
const ROW_ACTIONS: Action[] = ["accept", "reject", "route", "assign"];

export default function CaseList({ title = "Cases", initialSearch = "" }: { title?: string; initialSearch?: string }) {
  const { data: user } = useAppSelector(s => s.profile);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 300);
  const [status, setStatus] = useState("all");
  const [caseType, setCaseType] = useState("all");
  const [state, setState] = useState("all");
  const [queue, setQueue] = useState("all");
  const [filedBy, setFiledBy] = useState("all");
  const [filerSearch, setFilerSearch] = useState("");
  const [debouncedFilerSearch] = useDebounce(filerSearch, 300);
  const [page, setPage] = useState(1);
  // The Duplicates view (T5): review only, and only for the platform admins
  // and Statistics, who keep the national picture.
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);
  const [from, setFrom] = useState("");
  // Where the case came from, which is not how it was entered (T17).
  const [caseSource, setCaseSource] = useState("all");
  const [to, setTo] = useState("");
  const mayReviewDuplicates = canReviewDuplicates(user?.role);
  const canQueue = user?.role === "DIRECTOR GENERAL" || HEAD_ROLES.includes(user?.role ?? "") || COORDINATOR_ROLES.includes(user?.role ?? "");
  const canFile = user?.role === "INTERNAL PARALEGAL";
  // One description of what is being looked at, read by the list and by its
  // export, so a spreadsheet can never disagree with the screen it came from.
  const filters = {
    page, size: 10, search: debouncedSearch.trim() || "all", status, case_type: caseType, state, queue, filed_by: filedBy, case_source: caseSource,
    ...(duplicatesOnly ? { duplicates: true, from: from || undefined, to: to || undefined } : {}),
  };
  const cases = useQuery({
    queryKey: ["case-lifecycle", user?.id, "list", page, debouncedSearch, status, caseType, state, queue, filedBy, caseSource, duplicatesOnly, from, to],
    queryFn: () => listCases(filters),
    enabled: !!user?.id,
  });
  // Who has filed a case the reader can see (T4). The API scopes this the same
  // way it scopes the list, so the names offered are never ones they cannot act on.
  const filers = useQuery({
    queryKey: ["case-filers", user?.id, debouncedFilerSearch],
    queryFn: () => getCaseFilers(debouncedFilerSearch.trim()),
    enabled: !!user?.id,
    staleTime: 60000,
  });
  const filerOptions = filers.data?.success ? filers.data.data : [];
  const result = cases.data?.success ? cases.data.data : undefined;
  const rows = result?.data ?? [];
  const filter = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLSelectElement>) => { setter(event.target.value); setPage(1); };
  return <div className="min-w-0 max-w-full space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-semibold">{title}</h1><div className="flex flex-wrap gap-2"><ExportCases filters={filters} />{canFile && <><BulkCaseUploadDialog onUploaded={() => cases.refetch()} /><FileACaseComponent userRole={user.role} buttonText="File a Case" showIcon onCaseSubmitted={() => cases.refetch()} buttonClassName="bg-red-600 text-white" /></>}</div></div>
    {mayReviewDuplicates && <div className="flex flex-wrap gap-2">{[{ value: false, label: "All cases" }, { value: true, label: "Duplicates" }].map(tab => <Button key={String(tab.value)} variant={duplicatesOnly === tab.value ? "default" : "outline"} onClick={() => { setDuplicatesOnly(tab.value); setPage(1); }}>{tab.label}</Button>)}</div>}
    {duplicatesOnly && <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm"><p>Every case flagged as a possible duplicate, with the case it matched. This view is for review only \u2014 nothing here changes a case.</p><div className="mt-2 flex flex-wrap items-center gap-3"><label className="flex items-center gap-2">Filed from <input type="date" aria-label="Filed from" className="rounded border p-1" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }} /></label><label className="flex items-center gap-2">to <input type="date" aria-label="Filed to" className="rounded border p-1" value={to} onChange={e => { setTo(e.target.value); setPage(1); }} /></label></div></div>}
    {canQueue && <div className="flex flex-wrap gap-2">{[{ value: "all", label: "All cases in scope" }, { value: "mine", label: "My queue" }, { value: "unassigned", label: "Awaiting assignment" }].map(tab => <Button key={tab.value} variant={queue === tab.value ? "default" : "outline"} onClick={() => { setQueue(tab.value); setPage(1); }}>{tab.label}</Button>)}</div>}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Input aria-label="Search cases" placeholder="Client name or LACON reference" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      <select aria-label="Case status" className="rounded border p-2" value={status} onChange={filter(setStatus)}><option value="all">All statuses</option>{Object.entries(CASE_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}{value === "RESOLVED" ? " (legacy)" : ""}</option>)}</select>
      <select aria-label="Case type" className="rounded border p-2" value={caseType} onChange={filter(setCaseType)}><option value="all">All case types</option>{["CIVIL CASE", "CRIMINAL CASE", "PDSS ORGANIZATION", "PDSS STATION", "DECONGESTION", "MERCY APPLICATION"].map(value => <option key={value}>{value}</option>)}</select>
      <select aria-label="Filing state" className="rounded border p-2" value={state} onChange={filter(setState)}><option value="all">All filing states</option>{states.map(value => <option key={value} value={value}>{displayStateName(value)}</option>)}</select>
      <select aria-label="Case source" className="rounded border p-2" value={caseSource} onChange={filter(setCaseSource)}><option value="all">Any case source</option>{[...CASE_SOURCES, ONLINE_SOURCE].map(source => <option key={source.value} value={source.value}>{source.label}</option>)}</select>
      <div className="space-y-1">
        <Input aria-label="Search who filed" placeholder="Search who filed" value={filerSearch} onChange={e => setFilerSearch(e.target.value)} />
        <select aria-label="Filed by" className="w-full rounded border p-2" value={filedBy} onChange={filter(setFiledBy)}>
          <option value="all">Filed by anyone</option>
          <option value="online">Online (public)</option>
          {filerOptions.map(f => <option key={f.id} value={f.id}>{[f.name, roleLabel(f.role), f.office].filter(Boolean).join(" · ")}</option>)}
        </select>
      </div>
    </div>
    {!user || cases.isLoading ? <p role="status" className="py-10 text-center">Loading cases…</p> : cases.isError || (cases.data && !cases.data.success) ? <div role="alert" className="space-y-3 rounded bg-red-50 p-4"><p>{cases.data && !cases.data.success ? cases.data.message : "Cases could not be loaded."}</p><Button variant="outline" onClick={() => cases.refetch()}>Retry</Button></div> : <>
      <div className="overflow-x-auto rounded border"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr>{(duplicatesOnly ? ["Reference / Client", "Case type", "Status", "Filed from", "Matches", "Filed on"] : ["Reference / Client", "Case type", "Status", "Filed from", "Current holder", "Assigned by", "Action"]).map(label => <th className="whitespace-nowrap p-3 font-medium" key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-t"><td className="p-3"><Link className="inline-block whitespace-nowrap font-medium underline" href={`/cases/${row.id}`}>{caseReference(row)}</Link><p>{row.first_name} {row.last_name}</p>{!!row.possible_duplicate_of?.length && <span className="text-xs text-amber-700">Possible duplicate</span>}</td><td className="p-3">{row.case_type}</td><td className="p-3"><span className="inline-block whitespace-nowrap rounded bg-gray-100 px-2 py-1">{statusLabel(row.status)}</span></td><td className="p-3"><p>{filedFrom(row)}</p><p className="text-xs text-gray-500">{row.state_name ? displayStateName(row.state_name) : "State not recorded"}</p>{row.filing_actor?.name && <p className="text-xs text-gray-500">{row.filing_actor.name}</p>}</td>{duplicatesOnly
      ? <><td className="p-3">{(row.duplicate_links?.length ? row.duplicate_links : (row.possible_duplicate_of ?? []).map(reference => ({ reference, shared_on: [] }))).map(link => <p key={link.reference}><Link className="whitespace-nowrap underline" href={`/cases?search=${encodeURIComponent(link.reference)}`}>{link.reference}</Link>{sharedLabel(link.shared_on) && <span className="text-xs text-gray-500"> · {sharedLabel(link.shared_on)}</span>}</p>)}{row.duplicate_reason && <p className="mt-1 text-xs text-gray-600">Filed anyway: {row.duplicate_reason}</p>}</td><td className="p-3 whitespace-nowrap">{row.created_at ? new Date(row.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "\u2014"}</td></>
      : <><td className="p-3">{row.current_holder?.name || "No holder"}<p className="text-xs text-gray-500">{roleLabel(row.current_holder?.role)}</p></td><td className="p-3">{row.assigned_by || row.assignment?.assignor || "\u2014"}</td><td className="p-3"><div className="space-y-2"><Link className="inline-block whitespace-nowrap text-red-700 underline" href={`/cases/${row.id}`}>Open case</Link>{canQueue && <CaseActions caseRecord={row} onChanged={() => cases.refetch()} only={ROW_ACTIONS} />}</div></td></>}</tr>)}{!rows.length && <tr><td colSpan={duplicatesOnly ? 6 : 7} className="p-10 text-center text-gray-500">{duplicatesOnly ? "No flagged cases match these filters." : "No cases match these filters."}</td></tr>}</tbody></table></div>
      {result && result.total_rows > 0 && <div className="flex flex-wrap items-center justify-end gap-3"><span className="text-sm text-gray-500">{result.total_rows} cases · Page {page} of {Math.max(1, result.total_pages)}</span><Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><Button variant="outline" disabled={page >= result.total_pages} onClick={() => setPage(page + 1)}>Next</Button></div>}
    </>}
  </div>;
}

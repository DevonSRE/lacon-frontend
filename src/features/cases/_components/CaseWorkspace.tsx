"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { caseReference, normalizeCase, statusLabel, type CaseRecord } from "../domain";
import { getCase, getCaseHistory, getCaseDocuments } from "../server/lifecycle";
import CaseActions from "./CaseActions";

function dateLabel(raw?: string) {
  if (!raw || raw.startsWith("0001-")) return "Not recorded";
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleString("en-GB");
}
function Details({ values }: { values: Record<string, unknown> }) {
  return <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">{Object.entries(values).filter(([key, value]) => !key.endsWith("_id") && value !== undefined && value !== null && value !== "").map(([key, value]) => <div key={key} className="min-w-0"><dt className="text-sm capitalize text-gray-500">{key.replaceAll("_", " ")}</dt><dd className="whitespace-pre-wrap break-words text-sm">{typeof value === "boolean" ? value ? "Yes" : "No" : String(value)}</dd></div>)}</dl>;
}
export default function CaseWorkspace({ id, initialCase }: { id: string; initialCase?: CaseRecord }) {
  const { data: user } = useAppSelector(s => s.profile);
  const [historyPage, setHistoryPage] = useState(1);
  const [documentPage, setDocumentPage] = useState(1);
  const detail = useQuery({ queryKey: ["case-lifecycle", user?.id, id, "detail"], queryFn: () => getCase(id), enabled: !!user?.id });
  const history = useQuery({ queryKey: ["case-lifecycle", user?.id, id, "history", historyPage], queryFn: () => getCaseHistory(id, historyPage), enabled: !!user?.id });
  const documents = useQuery({ queryKey: ["case-lifecycle", user?.id, id, "documents", documentPage], queryFn: () => getCaseDocuments(id, documentPage), enabled: !!user?.id });
  const firstHistory = useQuery({ queryKey: ["case-lifecycle", user?.id, id, "history", 1], queryFn: () => getCaseHistory(id, 1), enabled: !!user?.id });
  const lastHistoryPage = firstHistory.data?.success ? firstHistory.data.data.total_pages : 1;
  const revisionHistory = useQuery({ queryKey: ["case-lifecycle", user?.id, id, "history", lastHistoryPage], queryFn: () => getCaseHistory(id, lastHistoryPage), enabled: !!user?.id && detail.data?.success === true && detail.data.data.status === "REVISION_REQUESTED" });
  const record = detail.data?.success ? normalizeCase({ ...initialCase, ...detail.data.data }) : initialCase;
  if (detail.data && !detail.data.success) return <div role="alert" className="space-y-3 p-4"><p>{detail.data.message}</p><Button variant="outline" onClick={() => detail.refetch()}>Retry</Button></div>;
  if (!record || !detail.data) return <p role="status" className="p-4">Loading case…</p>;
  const movements = history.data?.success ? history.data.data : undefined;
  const docs = documents.data?.success ? documents.data.data : undefined;
  const filedAt = record.created_at ?? record.filed_date ?? (firstHistory.data?.success ? firstHistory.data.data.data.find(m => m.action === "FILE")?.created_at : undefined);
  const revision = revisionHistory.data?.success ? revisionHistory.data.data.data.filter(m => m.action === "REVISION").at(-1) : undefined;
  return <div className="space-y-7 py-4">
    <div className="space-y-2"><h1 className="break-words text-xl font-semibold">{caseReference(record)}</h1><p>{record.first_name} {record.middle_name} {record.last_name} · {record.case_type}</p><span className="inline-block rounded bg-gray-100 px-3 py-1 text-sm">{statusLabel(record.status)}</span><p className="text-sm text-gray-500">Filed: {dateLabel(filedAt)}</p></div>
    {!!record.possible_duplicate_of?.length && <div className="rounded border border-amber-300 bg-amber-50 p-4"><h2 className="font-semibold">Possible duplicate</h2><p className="text-sm">These cases share an email or phone number within the last 30 days. Check them before proceeding.</p><div className="mt-2 flex flex-wrap gap-3">{record.possible_duplicate_of.map(ref => <Link key={ref} className="text-sm underline" href={`/cases?search=${encodeURIComponent(ref)}`}>{ref}</Link>)}</div></div>}
    {record.status === "REVISION_REQUESTED" && <div className="rounded bg-amber-50 p-4"><h2 className="font-semibold">Revision requested</h2><p>{revision?.reason || "Review the case history for the assigner’s reason. Add a progress update after making the correction."}</p></div>}
    <CaseActions caseRecord={record} />
    <section className="space-y-3"><h2 className="font-semibold">Filing and assignment</h2><Details values={{ origin: record.origin_channel, filed_level: record.filed_level, filing_actor: record.filing_actor?.name ?? record.forwarded_by, filing_role: record.filing_actor?.role, filing_state: record.state_name, zone: record.zone_name, centre: record.center_name, department: record.department_name, current_holder: record.current_holder?.name || "No holder available", holder_role: record.current_holder?.role, assigned_by: record.assigned_by || record.assignment?.assignor, assigned_lawyer: record.assignment?.assignee, assigned_on: record.assignment?.assign_date }} /></section>
    <section className="space-y-3"><h2 className="font-semibold">Client information</h2><Details values={{ gender: record.gender, age: record.age, marital_status: record.marital_status, email: record.email, phone_number: record.phone_number, state_of_origin: record.state_of_origin, permanent_address: record.permanent_address, occupation: record.occupation }} /></section>
    {[record.civil_case, record.criminal_case, record.pdss, record.decongestion_unit, record.perogative_of_mercy].filter(Boolean).map((fields, index) => <section key={index} className="space-y-3"><h2 className="font-semibold">Case details</h2><Details values={fields!} /></section>)}
    <section className="space-y-3"><h2 className="font-semibold">Movement history</h2>
      {history.isLoading ? <p role="status">Loading history…</p> : history.data && !history.data.success ? <p role="alert">{history.data.message}</p> : <>
        {!movements?.data.length && <p className="text-sm text-gray-500">No movement history recorded.</p>}
        <ol className="space-y-4 border-l pl-4">{movements?.data.map(m => <li key={m.id} className="space-y-1"><p className="text-sm font-semibold">{m.action.replaceAll("_", " ")} · {m.actor?.name || "Public submission"}</p><p className="text-xs text-gray-500">{dateLabel(m.created_at)}</p><p className="text-sm">{m.from_holder?.name || "Submitted"} → {m.to_holder?.name || "No change of holder"}</p>{m.reason && <p className="whitespace-pre-wrap rounded bg-gray-50 p-2 text-sm">{m.reason}</p>}</li>)}</ol>
        {movements && movements.total_pages > 1 && <Paging page={historyPage} total={movements.total_pages} onChange={setHistoryPage} />}
      </>}
    </section>
    <section className="space-y-3"><h2 className="font-semibold">Documents</h2>
      {documents.isLoading ? <p role="status">Loading documents…</p> : documents.data && !documents.data.success ? <p role="alert">{documents.data.message}</p> : <>
        {!docs?.data.length && <p className="text-sm text-gray-500">No documents uploaded.</p>}
        <ul className="space-y-2">{docs?.data.map((d, index) => <li key={`${d.id}-${index}`} className="rounded border p-3"><p className="font-medium">{d.document_title}</p><p className="text-sm text-gray-500">{d.document_type}</p>{d.document_url || /^https?:\/\//.test(d.document_path ?? "") ? <a className="text-sm underline" href={d.document_url || d.document_path} target="_blank" rel="noreferrer">Open document</a> : <p className="text-sm text-gray-500">Document URL unavailable.</p>}</li>)}</ul>
        {docs && docs.total_pages > 1 && <Paging page={documentPage} total={docs.total_pages} onChange={setDocumentPage} />}
      </>}
    </section>
    {!!record.updated_by?.length && <section className="space-y-2"><h2 className="font-semibold">Recorded updates</h2>{record.updated_by.map((update, index) => <p key={index} className="text-sm">{update.action} · {dateLabel(update.time)}</p>)}</section>}
  </div>;
}
function Paging({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  return <div className="flex items-center gap-3"><Button variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button><span className="text-sm">{page} / {total}</span><Button variant="outline" disabled={page >= total} onClick={() => onChange(page + 1)}>Next</Button></div>;
}

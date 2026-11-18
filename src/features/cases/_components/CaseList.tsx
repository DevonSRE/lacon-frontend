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
import { getCaseFilers, getOffences, getPeopleOnCases, listCases } from "../server/lifecycle";
import FileACaseComponent from "@/features/component/FileACase";
import BulkCaseUploadDialog from "@/features/dashboard/components/BulkUpload";
import CaseActions, { type Action } from "./CaseActions";
import ExportCases from "./ExportCases";
import { canReviewDuplicates, sharedLabel } from "@/lib/duplicates";
import { CASE_SOURCES, ONLINE_SOURCE } from "@/lib/case-source";
import { AGE_BRACKETS, SEXES, ageBounds, offenceParam } from "@/lib/statistics-filters";
import SearchableSelect from "@/components/form/SearchableSelect";
import { byLabel, caseCount } from "@/lib/filter-options";
import { activeCaseFilters, hasAdvancedCaseFilters } from "@/lib/case-filters";

// What a row may offer without opening the case. The Action column held a single
// "Open case" link, so a coordinator had to open every case to find the one
// waiting on them and then act on it (QA 2026-11-01, item 25). CaseActions
// shows only what this case and this reader actually allow, so most rows show
// nothing extra.
const ROW_ACTIONS: Action[] = ["accept", "reject", "route", "assign"];

/** What the list opens on, when a link asked for something in particular (T3). */
export type Opening = {
  search?: string; state?: string; offence?: string; sex?: string;
  ageMin?: string; ageMax?: string; status?: string; caseType?: string;
};

/** The bracket whose bounds a link carries, so the picker shows what is applied. */
function bracketFor(min: string, max: string): string {
  if (min === "" && max === "") return "";
  return AGE_BRACKETS.find(b =>
    String(b.min) === min && (b.max === undefined ? max === "" : String(b.max) === max),
  )?.value ?? "";
}

export default function CaseList({ title = "Cases", opening = {} }: { title?: string; opening?: Opening }) {
  const { data: user } = useAppSelector(s => s.profile);
  const [search, setSearch] = useState(opening.search ?? "");
  const [debouncedSearch] = useDebounce(search, 300);
  const [status, setStatus] = useState(opening.status ?? "all");
  const [caseType, setCaseType] = useState(opening.caseType ?? "all");
  const [state, setState] = useState(opening.state ?? "all");
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
  // The Statistics filters (T3). They answer questions no single filter does:
  // "rape cases, victims aged 0-6, in Q1 2026".
  const [offences, setOffences] = useState<string[]>(opening.offence ? [opening.offence] : []);
  const [ageBracket, setAgeBracket] = useState(bracketFor(opening.ageMin ?? "", opening.ageMax ?? ""));
  const [sex, setSex] = useState(opening.sex ?? "");
  const [workedOn, setWorkedOn] = useState("");
  const [to, setTo] = useState("");
  // The filter row held ten controls of equal weight, and nothing said whether
  // any were applied (QA 2026-11-16, row 64). Search and the three filters
  // people reach for stay in the first row; the rest fold away, and open
  // themselves when one of them is already narrowing the list.
  const applied = { search, status, caseType, state, caseSource, offences, ageBracket, sex, workedOn, filedBy };
  const activeFilters = activeCaseFilters(applied);
  const [showMore, setShowMore] = useState(hasAdvancedCaseFilters(applied));
  const clearFilters = () => {
    setSearch(""); setStatus("all"); setCaseType("all"); setState("all");
    setCaseSource("all"); setOffences([]); setAgeBracket(""); setSex("");
    setWorkedOn(""); setFiledBy("all"); setFilerSearch("");
    setPage(1);
  };
  const mayReviewDuplicates = canReviewDuplicates(user?.role);
  const canQueue = user?.role === "DIRECTOR GENERAL" || HEAD_ROLES.includes(user?.role ?? "") || COORDINATOR_ROLES.includes(user?.role ?? "");
  const canFile = user?.role === "INTERNAL PARALEGAL";
  // One description of what is being looked at, read by the list and by its
  // export, so a spreadsheet can never disagree with the screen it came from.
  const filters = {
    page, size: 10, search: debouncedSearch.trim() || "all", status, case_type: caseType, state, queue, filed_by: filedBy, case_source: caseSource,
    offence: offenceParam(offences), sex: sex || undefined, worked_on: workedOn || undefined, ...ageBounds(ageBracket),
    ...(duplicatesOnly ? { duplicates: true, from: from || undefined, to: to || undefined } : {}),
  };
  const cases = useQuery({
    queryKey: ["case-lifecycle", user?.id, "list", page, debouncedSearch, status, caseType, state, queue, filedBy, caseSource, offences, ageBracket, sex, workedOn, duplicatesOnly, from, to],
    queryFn: () => listCases(filters),
    enabled: !!user?.id,
  });
  // The offences on the cases this reader can see (T3). Read from the data
  // because the agreed list is not loaded yet.
  const offenceOptions = useQuery({
    queryKey: ["case-offences", user?.id],
    queryFn: () => getOffences(),
    enabled: !!user?.id,
    staleTime: 60000,
  });
  // Everyone who has had a hand in a case the reader can see (T3), which is a
  // wider set than the filers below.
  const people = useQuery({
    queryKey: ["case-people", user?.id],
    queryFn: () => getPeopleOnCases(),
    enabled: !!user?.id,
    staleTime: 60000,
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
  // Every filter is the app's own dropdown, not the browser's: the native one
  // opened in the OS font at the OS size, and a long list had no search and no
  // order (QA 2026-11-16, row 65).
  const pick = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); };
  const byName = byLabel;
  return <div className="min-w-0 max-w-full space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-semibold">{title}</h1><div className="flex flex-wrap gap-2"><ExportCases filters={filters} />{canFile && <><BulkCaseUploadDialog onUploaded={() => cases.refetch()} /><FileACaseComponent userRole={user.role} buttonText="File a Case" showIcon onCaseSubmitted={() => cases.refetch()} buttonClassName="bg-red-600 text-white" /></>}</div></div>
    {mayReviewDuplicates && <div className="flex flex-wrap gap-2">{[{ value: false, label: "All cases" }, { value: true, label: "Duplicates" }].map(tab => <Button key={String(tab.value)} variant={duplicatesOnly === tab.value ? "default" : "outline"} onClick={() => { setDuplicatesOnly(tab.value); setPage(1); }}>{tab.label}</Button>)}</div>}
    {duplicatesOnly && <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm"><p>Every case flagged as a possible duplicate, with the case it matched. This view is for review only \u2014 nothing here changes a case.</p><div className="mt-2 flex flex-wrap items-center gap-3"><label className="flex items-center gap-2">Filed from <input type="date" aria-label="Filed from" className="rounded border p-1" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }} /></label><label className="flex items-center gap-2">to <input type="date" aria-label="Filed to" className="rounded border p-1" value={to} onChange={e => { setTo(e.target.value); setPage(1); }} /></label></div></div>}
    {canQueue && <div className="flex flex-wrap gap-2">{[{ value: "all", label: "All cases in scope" }, { value: "mine", label: "My queue" }, { value: "unassigned", label: "Awaiting assignment" }].map(tab => <Button key={tab.value} variant={queue === tab.value ? "default" : "outline"} onClick={() => { setQueue(tab.value); setPage(1); }}>{tab.label}</Button>)}</div>}
    {/* Row 64 asked for the layout: search and the three filters people reach
        for, the rest behind one button that says how much is applied. Row 65
        asked for the controls: the app's own dropdown everywhere, with a search
        on the long lists. Both are here - taking either alone would undo the
        other. */}
    <div className="space-y-3 rounded border p-3">
      <div className="flex flex-wrap items-end gap-3">
        <Input
          aria-label="Search cases"
          placeholder="Client name or LACON reference"
          className="min-w-[14rem] flex-1"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="w-44">
          <SearchableSelect hideLabel searchable={false} label="Case status" placeholder="All statuses" value={status} onChange={pick(setStatus)}
            options={[{ value: "all", label: "All statuses" }, ...Object.entries(CASE_STATUS_LABELS).map(([value, label]) => ({ value, label: `${label}${value === "RESOLVED" ? " (legacy)" : ""}` }))]} />
        </div>
        <div className="w-44">
          <SearchableSelect hideLabel searchable={false} label="Case type" placeholder="All case types" value={caseType} onChange={pick(setCaseType)}
            options={[{ value: "all", label: "All case types" }, ...["CIVIL CASE", "CRIMINAL CASE", "PDSS ORGANIZATION", "PDSS STATION", "DECONGESTION", "MERCY APPLICATION"].map(value => ({ value, label: value }))]} />
        </div>
        <div className="w-44">
          <SearchableSelect hideLabel label="Filing state" placeholder="All filing states" searchPlaceholder="Search states" value={state} onChange={pick(setState)}
            emptyMessage="No state matches that search."
            options={[{ value: "all", label: "All filing states" }, ...states.map(value => ({ value, label: displayStateName(value) })).sort(byName)]} />
        </div>
        <Button
          type="button"
          variant="outline"
          aria-expanded={showMore}
          onClick={() => setShowMore(open => !open)}
        >
          {showMore ? "Fewer filters" : "More filters"}
        </Button>
        {activeFilters.length > 0 && (
          <>
            <span className="rounded bg-gray-100 px-2 py-1 text-sm" title={activeFilters.join(", ")}>
              {activeFilters.length} filter{activeFilters.length === 1 ? "" : "s"} applied
            </span>
            <Button type="button" variant="outline" onClick={clearFilters}>Clear filters</Button>
          </>
        )}
      </div>

      {showMore && (
        <div className="grid gap-3 border-t pt-3 sm:grid-cols-2 lg:grid-cols-3">
          <SearchableSelect hideLabel searchable={false} label="Case source" placeholder="Any case source" value={caseSource} onChange={pick(setCaseSource)}
            options={[{ value: "all", label: "Any case source" }, ...[...CASE_SOURCES, ONLINE_SOURCE].map(source => ({ value: source.value, label: source.label }))]} />
          <SearchableSelect hideLabel label="Offence" placeholder="Any offence" searchPlaceholder="Search offences" value={offences[0] ?? ""}
            onChange={value => { setOffences(value ? [value] : []); setPage(1); }}
            emptyMessage="No offence matches that search."
            options={[{ value: "", label: "Any offence" }, ...(offenceOptions.data?.success ? offenceOptions.data.data : [])
              .map(o => ({ value: o.offence, label: o.offence, detail: caseCount(o.count) })).sort(byName)]} />
          <SearchableSelect hideLabel searchable={false} label="Age range" placeholder="Any age" value={ageBracket} onChange={pick(setAgeBracket)}
            options={[{ value: "", label: "Any age" }, ...AGE_BRACKETS.map(bracket => ({ value: bracket.value, label: bracket.label }))]} />
          <SearchableSelect hideLabel searchable={false} label="Sex" placeholder="Any sex" value={sex} onChange={pick(setSex)}
            options={[{ value: "", label: "Any sex" }, ...SEXES.map(option => ({ value: option.value, label: option.label }))]} />
          {/* The long lists: a search box, each person's role and office under
              their name, and in name order (row 65). */}
          <SearchableSelect hideLabel label="Worked on by" placeholder="Worked on by anyone" searchPlaceholder="Search people" value={workedOn} onChange={pick(setWorkedOn)}
            loading={people.isLoading} emptyMessage="Nobody matches that search."
            options={[{ value: "", label: "Worked on by anyone" }, ...(people.data?.success ? people.data.data : [])
              .map(person => ({ value: person.id, label: person.name, detail: roleLabel(person.role) })).sort(byName)]} />
          <SearchableSelect hideLabel label="Filed by" placeholder="Filed by anyone" searchPlaceholder="Search who filed" value={filedBy}
            onChange={pick(setFiledBy)} query={filerSearch} onQueryChange={value => { setFilerSearch(value); setPage(1); }}
            loading={filers.isLoading} emptyMessage="Nobody matches that search."
            options={[{ value: "all", label: "Filed by anyone" }, { value: "online", label: "Online (public)" },
              ...filerOptions.map(f => ({ value: f.id, label: f.name, detail: [roleLabel(f.role), f.office].filter(Boolean).join(" · ") })).sort(byName)]} />
        </div>
      )}
    </div>
    {!user || cases.isLoading ? <p role="status" className="py-10 text-center">Loading cases…</p> : cases.isError || (cases.data && !cases.data.success) ? <div role="alert" className="space-y-3 rounded bg-red-50 p-4"><p>{cases.data && !cases.data.success ? cases.data.message : "Cases could not be loaded."}</p><Button variant="outline" onClick={() => cases.refetch()}>Retry</Button></div> : <>
      <div className="overflow-x-auto rounded border"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr>{(duplicatesOnly ? ["Reference / Client", "Case type", "Status", "Filed from", "Matches", "Filed on"] : ["Reference / Client", "Case type", "Status", "Filed from", "Current holder", "Assigned by", "Action"]).map(label => <th className="whitespace-nowrap p-3 font-medium" key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-t"><td className="p-3"><Link className="inline-block whitespace-nowrap font-medium underline" href={`/cases/${row.id}`}>{caseReference(row)}</Link><p>{row.first_name} {row.last_name}</p>{!!row.possible_duplicate_of?.length && <span className="text-xs text-amber-700">Possible duplicate</span>}</td><td className="p-3">{row.case_type}</td><td className="p-3"><span className="inline-block whitespace-nowrap rounded bg-gray-100 px-2 py-1">{statusLabel(row.status)}</span></td><td className="p-3"><p>{filedFrom(row)}</p><p className="text-xs text-gray-500">{row.state_name ? displayStateName(row.state_name) : "State not recorded"}</p>{row.filing_actor?.name && <p className="text-xs text-gray-500">{row.filing_actor.name}</p>}</td>{duplicatesOnly
      ? <><td className="p-3">{(row.duplicate_links?.length ? row.duplicate_links : (row.possible_duplicate_of ?? []).map(reference => ({ reference, shared_on: [] }))).map(link => <p key={link.reference}><Link className="whitespace-nowrap underline" href={`/cases?search=${encodeURIComponent(link.reference)}`}>{link.reference}</Link>{sharedLabel(link.shared_on) && <span className="text-xs text-gray-500"> · {sharedLabel(link.shared_on)}</span>}</p>)}{row.duplicate_reason && <p className="mt-1 text-xs text-gray-600">Filed anyway: {row.duplicate_reason}</p>}</td><td className="p-3 whitespace-nowrap">{row.created_at ? new Date(row.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "\u2014"}</td></>
      : <><td className="p-3">{row.current_holder?.name || "No holder"}<p className="text-xs text-gray-500">{roleLabel(row.current_holder?.role)}</p></td><td className="p-3">{row.assigned_by || row.assignment?.assignor || "\u2014"}</td><td className="p-3"><div className="flex items-center justify-end gap-2 whitespace-nowrap"><Link className="text-red-700 underline" href={`/cases/${row.id}`}>Open case</Link>{canQueue && <CaseActions caseRecord={row} onChanged={() => cases.refetch()} only={ROW_ACTIONS} layout="menu" />}</div></td></>}</tr>)}{!rows.length && <tr><td colSpan={duplicatesOnly ? 6 : 7} className="p-10 text-center text-gray-500">{duplicatesOnly ? "No flagged cases match these filters." : "No cases match these filters."}</td></tr>}</tbody></table></div>
      {result && result.total_rows > 0 && <div className="flex flex-wrap items-center justify-end gap-3"><span className="text-sm text-gray-500">{result.total_rows} cases · Page {page} of {Math.max(1, result.total_pages)}</span><Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><Button variant="outline" disabled={page >= result.total_pages} onClick={() => setPage(page + 1)}>Next</Button></div>}
    </>}
  </div>;
}

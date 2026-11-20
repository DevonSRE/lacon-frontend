"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAppSelector } from "@/hooks/redux";
import { courtStageOptionsFor, CASE_UPDATE_TYPE_OPTIONS } from "@/lib/form-options";
import { GetStates } from "@/server/actions/GetDetails";
import { displayStateName } from "@/components/get-state";
import { officeLabel, roleLabel } from "@/lib/role-labels";
import { casePermissions, caseReference, routeRoles, HEAD_ROLES, COORDINATOR_ROLES, type CaseRecord, type DirectoryUser, type MovementCommand } from "../domain";
import { getAssignees, getRouteTargets, moveCase, postCaseDocument, postCaseProgress } from "../server/lifecycle";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SearchableSelect from "@/components/form/SearchableSelect";
import { pickerEmptyMessage } from "@/lib/recipient-picker";

export type Action = MovementCommand["action"] | "progress" | "document";
type Recipient = DirectoryUser;

// isFull: the lawyer is already carrying the case load they agreed to. A pro bono
// lawyer's limit comes from their registration; 0 means no limit was set.
function isFull(u: Recipient) {
  return !!u.max_load && u.max_load > 0 && (u.open_cases ?? 0) >= u.max_load;
}
// recipientLabel names who they are, where they work and what they are carrying,
// so a head can tell a staff lawyer from a pro bono one before assigning.
function recipientLabel(u: Recipient, action: Action) {
  const parts = [`${u.first_name} ${u.last_name}`, roleLabel(u.user_type)];
  // Where they work: a state for most roles, a zone for a Zonal Director, who
  // holds no single state and so read as having no location at all
  // (QA 2026-11-19, row 78).
  if (u.state) parts.push(u.state);
  else if (u.zone_name) parts.push(u.zone_name);
  if (action !== "assign") return parts.join(" · ");
  if (u.department_name) parts.push(u.department_name);
  parts.push(`${u.open_cases ?? 0} open / ${u.max_load && u.max_load > 0 ? `${u.max_load} max` : "no set limit"}`);
  if (isFull(u)) parts.push("full");
  return parts.join(" · ");
}
// recipientDetail is what recipientLabel says about someone, without their name:
// the name is the line of the option, this sits under it.
function recipientDetail(u: Recipient, action: Action) {
  const label = recipientLabel(u, action);
  const name = `${u.first_name} ${u.last_name}`;
  return label.startsWith(name + " · ") ? label.slice(name.length + 3) : label;
}
const titles: Record<Action, string> = { route: "Route case", assign: "Assign lawyer", escalate: "Send back up the chain", "lawyer-reject": "Return assignment", accept: "Accept case", reject: "Reject case", "request-revision": "Request revision", status: "Update status", progress: "Add progress update", document: "Upload document", refer: "Refer out of Legal Aid", transfer: "Transfer to another LACON office" };

/**
 * `only` narrows the actions on offer (the dashboard queues offer review or
 * assignment only).
 *
 * `layout` decides how they are offered. On the case page they are buttons,
 * where there is room for them. In a table they belong in a "More actions"
 * menu: a stack of full-width buttons made a row with four actions twice the
 * height of its neighbours, which is what the tables looked like
 * (QA 2026-11-16, rows 25 and 67).
 */
export default function CaseActions({ caseRecord, onChanged, only, layout = "buttons" }: { caseRecord: CaseRecord; onChanged?: () => void; only?: Action[]; layout?: "buttons" | "menu" }) {
  const { data: user } = useAppSelector(state => state.profile);
  const permissions = casePermissions(caseRecord, user);
  const [selected, setSelected] = useState<{ action: Action; status?: string } | null>(null);
  const actions: Array<{ action: Action; label: string; allowed: boolean; status?: string }> = [
    { action: "accept", label: "Accept case", allowed: permissions.acceptReject },
    { action: "reject", label: "Reject case", allowed: permissions.acceptReject },
    { action: "route", label: "Route case", allowed: permissions.route },
    { action: "assign", label: caseRecord.assignment ? "Reassign lawyer" : "Assign lawyer", allowed: permissions.assign },
    { action: "escalate", label: "Send back up the chain", allowed: permissions.escalate },
    { action: "request-revision", label: "Request revision", allowed: permissions.revision },
    { action: "status", label: "Start work", status: "INPROGRESS", allowed: permissions.start },
    { action: "progress", label: "Add progress update", allowed: permissions.update },
    { action: "document", label: "Upload document", allowed: permissions.upload },
    { action: "status", label: "Mark completed", status: "COMPLETED", allowed: permissions.complete },
    { action: "status", label: "Close case", status: "CLOSED", allowed: permissions.close },
    // The case leaves Legal Aid, or this office. Either may happen at any
    // stage, unlike closing, which waits for the lawyer to finish (T6).
    { action: "refer", label: "Refer out", allowed: permissions.endCase },
    { action: "transfer", label: "Transfer", allowed: permissions.endCase },
    { action: "lawyer-reject", label: "Return assignment", allowed: permissions.lawyerReject },
  ];
  const offered = actions.filter(a => a.allowed && (!only || only.includes(a.action)));
  const key = (a: { action: Action; status?: string }) => `${a.action}-${a.status ?? ""}`;
  return <>
    {layout === "menu"
      ? offered.length > 0 && <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More actions" title="More actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {offered.map(a => <DropdownMenuItem key={key(a)} onSelect={() => setSelected(a)}>{a.label}</DropdownMenuItem>)}
        </DropdownMenuContent>
      </DropdownMenu>
      : <div className="flex flex-wrap gap-2">
        {offered.map(a => <Button key={key(a)} variant="outline" onClick={() => setSelected(a)}>{a.label}</Button>)}
      </div>}
    <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>{selected && titles[selected.action]}</DialogTitle><DialogDescription>{caseReference(caseRecord)}</DialogDescription></DialogHeader>
        {selected && <ActionForm key={`${selected.action}-${selected.status}`} action={selected.action} status={selected.status} caseRecord={caseRecord} onSuccess={() => { setSelected(null); onChanged?.(); }} />}
      </DialogContent>
    </Dialog>
  </>;
}

function ActionForm({ action, status, caseRecord, onSuccess }: { action: Action; status?: string; caseRecord: CaseRecord; onSuccess: () => void }) {
  const { data: user } = useAppSelector(state => state.profile);
  const [role, setRole] = useState("");
  const [target, setTarget] = useState("");
  const [keyword, setKeyword] = useState("");
  const [search] = useDebounce(keyword, 300);
  const [stateFilter, setStateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ outcome?: string; resolution_report?: string }>({});
  const [pending, startTransition] = useTransition();
  const client = useQueryClient();
  const router = useRouter();
  const roles = action === "escalate" ? [...HEAD_ROLES, ...COORDINATOR_ROLES, "DIRECTOR GENERAL"].filter(r => routeRoles(r).includes(user?.role ?? "")) : routeRoles(user?.role ?? "");
  const picker = action === "assign" || action === "route" || action === "escalate";
  const targets = useQuery({
    queryKey: ["case-targets", user?.id, caseRecord.id, action, role, page, search, stateFilter],
    queryFn: () => action === "assign" ? getAssignees(caseRecord.id, page, search, stateFilter) : getRouteTargets(role, page, search),
    enabled: picker && (action === "assign" || !!role),
  });
  const stateList = useQuery({ queryKey: ["states"], queryFn: () => GetStates({ page: 1, size: 40 }), enabled: action === "assign", staleTime: 50000 });
  const states: Array<{ id: string; title: string }> = [...(stateList.data?.data?.data ?? [])]
    .map((s: { id: string; title: string }) => ({ id: s.id, title: displayStateName(s.title) }))
    .sort((a, b) => a.title.localeCompare(b.title));
  const candidates = targets.data?.success ? targets.data.data : undefined;
  // Taking a case off the person holding it needs a reason on the record: on
  // reassignment, and on a reroute of a case a lawyer is already working, which
  // the DG may do to any open case (QA 2026-11-19, row 80).
  const reasonRequired = ["escalate", "lawyer-reject", "reject", "request-revision", "refer", "transfer"].includes(action) || ((action === "assign" || action === "route") && !!caseRecord.assignment);
  // Completing a case carries the final report: the API refuses the move without both fields.
  const completing = action === "status" && status === "COMPLETED";
  const stageOptions = courtStageOptionsFor(caseRecord.case_type);
  const submit = (formData: FormData) => {
    setError(""); setFieldErrors({});
    startTransition(async () => {
      try {
        const file = formData.get("file");
        if (file instanceof File && file.size > 10 * 1024 * 1024) { setError("Choose a file smaller than 10 MB."); return; }
        const reason = String(formData.get("reason") ?? "").trim();
        if (reasonRequired && !reason) { setError("Please enter a reason."); return; }
        const outcome = String(formData.get("outcome") ?? "").trim();
        const resolutionReport = String(formData.get("resolution_report") ?? "").trim();
        if (completing) {
          const missing = {
            ...(outcome ? {} : { outcome: "Enter the outcome of the case." }),
            ...(resolutionReport ? {} : { resolution_report: "Enter a resolution report." }),
          };
          if (Object.keys(missing).length > 0) { setFieldErrors(missing); return; }
        }
        const destination = String(formData.get("destination") ?? "").trim();
        if ((action === "refer" || action === "transfer") && !destination) {
          setError(action === "refer" ? "Name the organisation the case goes to." : "Name the LACON office the case goes to.");
          return;
        }
        const result = action === "progress" ? await postCaseProgress(caseRecord.id, formData)
          : action === "document" ? await postCaseDocument(caseRecord.id, formData)
          : await moveCase(caseRecord.id, { action, status, reason: reason || undefined,
            ...(completing ? { outcome, resolution_report: resolutionReport } : {}),
            ...(action === "refer" || action === "transfer" ? { destination } : {}),
            ...(action === "assign" ? { assignee_id: target } : target ? { target_user_id: target } : {}) });
        if (!result.success) { setError(result.message); return; }
        await Promise.all([
          client.invalidateQueries({ queryKey: ["case-lifecycle"] }),
          client.invalidateQueries({ queryKey: ["scope-summary"] }),
          client.invalidateQueries({ queryKey: ["case-targets"] }),
          client.invalidateQueries({ queryKey: ["getCases"] }),
          client.invalidateQueries({ queryKey: ["getCasesInternal"] }),
          client.invalidateQueries({ queryKey: ["getAdminDashboardAnalysis"] }),
          client.invalidateQueries({ queryKey: ["getDashboardAnalysis"] }),
          client.invalidateQueries({ queryKey: ["getAdminReportOverview"] }),
        ]);
        toast.success("Case updated successfully."); onSuccess();
        if (["route", "escalate", "lawyer-reject"].includes(action)) router.push("/cases");
      } catch { setError("The request could not be completed. Please try again."); }
    });
  };
  return <form onSubmit={event => { event.preventDefault(); submit(new FormData(event.currentTarget)); }} className="space-y-4">
    {picker && <>
      {action !== "assign" && <div className="space-y-1"><Label htmlFor="target-role">Recipient role{action === "escalate" ? " (optional)" : ""}</Label>
        <select id="target-role" className="w-full rounded border p-2" value={role} required={action === "route"} disabled={pending} onChange={e => { setRole(e.target.value); setTarget(""); setKeyword(""); setPage(1); }}>
          <option value="">{action === "escalate" ? "Return to previous holder" : "Select role"}</option>{/* The office, not the role constant that names its head (row 49). The
              value is unchanged: the API matches on it. */}
            {roles.map(r => <option key={r} value={r}>{officeLabel(r)}</option>)}
        </select></div>}
      {(action === "assign" || role) && <>
        {action === "assign" && <div className="space-y-1">
          <Label htmlFor="lawyer-state">State (optional)</Label>
          <select id="lawyer-state" className="w-full rounded border p-2" value={stateFilter} disabled={pending} onChange={e => { setStateFilter(e.target.value); setPage(1); setTarget(""); }}>
            <option value="">Any state</option>
            {states.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <p className="text-sm text-gray-500">Narrow the list to lawyers in one state.</p>
        </div>}
        {/* One control, with its own search: the separate "Search recipient"
            box above a plain dropdown made choosing a lawyer two steps, and a
            search matching nothing left an empty dropdown saying nothing
            (QA 2026-11-16, row 68). */}
        {targets.data && !targets.data.success ? <p role="alert" className="text-red-700">{targets.data.message}</p> : <div className="space-y-2">
          <SearchableSelect
            label={action === "assign" ? "Lawyer" : "Recipient"}
            placeholder="Choose recipient"
            searchPlaceholder={action === "assign" ? "Search lawyers by name" : "Search by name"}
            value={target}
            onChange={setTarget}
            query={keyword}
            onQueryChange={value => { setKeyword(value); setPage(1); setTarget(""); }}
            loading={targets.isLoading}
            disabled={pending}
            emptyMessage={pickerEmptyMessage(action, role, keyword, user?.role ?? "")}
            options={(candidates?.data ?? []).filter(u => u.id !== user?.id).map(u => ({
              value: u.id,
              label: `${u.first_name} ${u.last_name}`,
              detail: recipientDetail(u, action),
              disabled: action === "assign" && isFull(u),
            }))}
          />
          {candidates && candidates.total_pages > 1 && <div className="flex items-center gap-3"><Button type="button" variant="outline" disabled={page === 1} onClick={() => { setPage(page - 1); setTarget(""); }}>Previous</Button><span>Page {page} of {candidates.total_pages}</span><Button type="button" variant="outline" disabled={page >= candidates.total_pages} onClick={() => { setPage(page + 1); setTarget(""); }}>Next</Button></div>}
        </div>}
      </>}
    </>}
    {action === "progress" && <>
      <Label htmlFor="update-type">Type of update</Label><select id="update-type" name="case_update_type" required className="w-full rounded border p-2">{CASE_UPDATE_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      {/* The stages belong to the case type, and the types with no court proceedings
          get a free-text status instead (QA 2026-11-01, item 17). */}
      <input type="hidden" name="case_type" value={caseRecord.case_type ?? ""} />
      {stageOptions.length > 0
        ? <><Label htmlFor="court-stage">Court stage</Label><select id="court-stage" name="court_stage" required defaultValue="" className="w-full rounded border p-2"><option value="" disabled>Select court stage</option>{stageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></>
        : <><Label htmlFor="current-status">Current status</Label><Input id="current-status" name="current_status" required placeholder="Where the matter stands now" /></>}
      <Label htmlFor="progress-summary">Progress summary</Label><textarea id="progress-summary" name="court_progress" required className="min-h-24 w-full rounded border p-2" />
      <Label htmlFor="next-step">Next step</Label><Input id="next-step" name="next_step" required />
      <Label htmlFor="next-court-date">Next court date (optional)</Label><Input id="next-court-date" name="next_court_date" type="date" />
    </>}
    {(action === "refer" || action === "transfer") && <div className="space-y-1">
      <Label htmlFor="end-destination">{action === "refer" ? "Referred to (organisation)" : "LACON office it goes to"}</Label>
      <Input id="end-destination" name="destination" required
        placeholder={action === "refer" ? "e.g. FIDA Nigeria" : "e.g. Kano State Office"} />
      <p className="text-sm text-gray-500">
        {action === "refer"
          ? "The case leaves Legal Aid. It can no longer be worked on here."
          : "The case moves to another LACON office. It leaves your open work."}
      </p>
    </div>}
    {action === "document" && <><Label htmlFor="document-title">Document title</Label><Input id="document-title" name="document_title" required /><Label htmlFor="document-type">Document type</Label><Input id="document-type" name="document_type" required placeholder="e.g. Court order" /></>}
    {["progress", "document"].includes(action) && <div className="space-y-2"><Label htmlFor="case-file">{action === "progress" ? "Supporting document (optional)" : "Document"}</Label><Input id="case-file" name="file" type="file" accept=".jpeg,.jpg,.png,.webp,.pdf,.doc,.docx,.xlsx" required={action === "document"} /><p className="text-sm text-gray-500">Images, PDF, Word or Excel. Maximum 10 MB.</p></div>}
    {action === "status" && status === "CLOSED" && <section className="space-y-2 rounded border bg-gray-50 p-3"><h3 className="font-semibold">Completion report</h3><p>{caseRecord.outcome}</p><p className="whitespace-pre-wrap">{caseRecord.resolution_report}</p>{caseRecord.completed_by && <p>Completed by {caseRecord.completed_by.name}</p>}<p className="text-sm">If this report needs correction, cancel and choose Request revision.</p></section>}
    {completing && <>
      <div className="space-y-1">
        <Label htmlFor="case-outcome">Outcome (required)</Label>
        <Input id="case-outcome" name="outcome" aria-invalid={!!fieldErrors.outcome} aria-describedby={fieldErrors.outcome ? "case-outcome-error" : undefined} placeholder="e.g. Case won, charges withdrawn, settled out of court" />
        {fieldErrors.outcome && <p id="case-outcome-error" role="alert" className="text-sm text-red-700">{fieldErrors.outcome}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="resolution-report">Resolution report (required)</Label>
        <textarea id="resolution-report" name="resolution_report" aria-invalid={!!fieldErrors.resolution_report} aria-describedby={fieldErrors.resolution_report ? "resolution-report-error" : undefined} className="min-h-24 w-full rounded border p-2" placeholder="How the case was resolved, and what the client was told." />
        {fieldErrors.resolution_report && <p id="resolution-report-error" role="alert" className="text-sm text-red-700">{fieldErrors.resolution_report}</p>}
      </div>
    </>}
    {!["progress", "document", "accept"].includes(action) && <><Label htmlFor="movement-reason">Reason {reasonRequired ? "(required)" : "(optional)"}</Label><textarea id="movement-reason" name="reason" required={reasonRequired} className="min-h-24 w-full rounded border p-2" /></>}
    {action === "accept" && <p>The case will be accepted and ready for assignment.</p>}
    {action === "status" && <p>{status === "CLOSED" ? "Confirm that this completed case can be closed." : status === "COMPLETED" ? "Mark your work as completed. The assigning coordinator will close the case." : "Confirm that you are starting work on this case."}</p>}
    {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <Button type="submit" disabled={pending || (picker && (action === "assign" || action === "route" || !!role) && !target)} className="w-full">{pending ? "Saving…" : "Confirm"}</Button>
  </form>;
}

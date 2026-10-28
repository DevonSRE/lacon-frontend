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
import { COURT_STAGE_OPTIONS, CASE_UPDATE_TYPE_OPTIONS } from "@/lib/form-options";
import { GetStates } from "@/server/actions/GetDetails";
import { displayStateName } from "@/components/get-state";
import { casePermissions, caseReference, routeRoles, HEAD_ROLES, COORDINATOR_ROLES, type CaseRecord, type DirectoryUser, type MovementCommand } from "../domain";
import { getAssignees, getRouteTargets, moveCase, postCaseDocument, postCaseProgress } from "../server/lifecycle";

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
  const parts = [`${u.first_name} ${u.last_name}`, u.user_type];
  if (u.state) parts.push(u.state);
  if (action !== "assign") return parts.join(" · ");
  if (u.department_name) parts.push(u.department_name);
  parts.push(`${u.open_cases ?? 0} open / ${u.max_load && u.max_load > 0 ? `${u.max_load} max` : "no set limit"}`);
  if (isFull(u)) parts.push("full");
  return parts.join(" · ");
}
// emptyPoolMessage says why the list is empty and what to do about it, instead of
// leaving the user at "No eligible recipients found".
function emptyPoolMessage(action: Action, role: string) {
  if (action === "assign") return "No lawyer is available for this case. Add one under Lawyers > Add New Lawyer, linking them to your department or unit, or widen the state filter.";
  if (role) return `No active ${role.toLowerCase()} is available for this case. Assign a lawyer instead, or ask the Director General to create one.`;
  return "No eligible recipients found.";
}
const titles: Record<Action, string> = { route: "Route case", assign: "Assign lawyer", escalate: "Send back up the chain", "lawyer-reject": "Return assignment", accept: "Accept case", reject: "Reject case", "request-revision": "Request revision", status: "Update status", progress: "Add progress update", document: "Upload document" };

// `only` narrows the buttons to some actions (the dashboard queues offer review or assignment only).
export default function CaseActions({ caseRecord, onChanged, only }: { caseRecord: CaseRecord; onChanged?: () => void; only?: Action[] }) {
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
    { action: "lawyer-reject", label: "Return assignment", allowed: permissions.lawyerReject },
  ];
  return <>
    <div className="flex flex-wrap gap-2">
      {actions.filter(a => a.allowed && (!only || only.includes(a.action))).map(a => <Button key={`${a.action}-${a.status ?? ""}`} variant="outline" onClick={() => setSelected(a)}>{a.label}</Button>)}
    </div>
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
  const reasonRequired = ["escalate", "lawyer-reject", "reject", "request-revision"].includes(action) || (action === "assign" && !!caseRecord.assignment);
  // Completing a case carries the final report: the API refuses the move without both fields.
  const completing = action === "status" && status === "COMPLETED";
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
        const result = action === "progress" ? await postCaseProgress(caseRecord.id, formData)
          : action === "document" ? await postCaseDocument(caseRecord.id, formData)
          : await moveCase(caseRecord.id, { action, status, reason: reason || undefined,
            ...(completing ? { outcome, resolution_report: resolutionReport } : {}),
            ...(action === "assign" ? { assignee_id: target } : target ? { target_user_id: target } : {}) });
        if (!result.success) { setError(result.message); return; }
        await Promise.all([
          client.invalidateQueries({ queryKey: ["case-lifecycle"] }),
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
          <option value="">{action === "escalate" ? "Return to previous holder" : "Select role"}</option>{roles.map(r => <option key={r}>{r}</option>)}
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
        <Label htmlFor="target-search">Search recipient</Label><Input id="target-search" value={keyword} placeholder="Search by name" onChange={e => { setKeyword(e.target.value); setPage(1); setTarget(""); }} />
        {targets.isLoading ? <p role="status">Loading recipients…</p> : targets.data && !targets.data.success ? <p role="alert" className="text-red-700">{targets.data.message}</p> : <div className="space-y-2">
          <Label htmlFor="case-target">{action === "assign" ? "Lawyer" : "Recipient"}</Label>
          <select id="case-target" required className="w-full rounded border p-2" value={target} disabled={pending} onChange={e => setTarget(e.target.value)}>
            <option value="">Choose recipient</option>
            {candidates?.data.filter(u => u.id !== user?.id).map(u => <option key={u.id} value={u.id} disabled={action === "assign" && isFull(u)}>{recipientLabel(u, action)}</option>)}
          </select>
          {candidates?.data.length === 0 && <p className="text-sm text-gray-500">{emptyPoolMessage(action, role)}</p>}
          {candidates && candidates.total_pages > 1 && <div className="flex items-center gap-3"><Button type="button" variant="outline" disabled={page === 1} onClick={() => { setPage(page - 1); setTarget(""); }}>Previous</Button><span>Page {page} of {candidates.total_pages}</span><Button type="button" variant="outline" disabled={page >= candidates.total_pages} onClick={() => { setPage(page + 1); setTarget(""); }}>Next</Button></div>}
        </div>}
      </>}
    </>}
    {action === "progress" && <>
      <Label htmlFor="update-type">Type of update</Label><select id="update-type" name="case_update_type" required className="w-full rounded border p-2">{CASE_UPDATE_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      <Label htmlFor="court-stage">Court stage</Label><select id="court-stage" name="current_status" required defaultValue="" className="w-full rounded border p-2"><option value="" disabled>Select court stage</option>{COURT_STAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      <Label htmlFor="progress-summary">Progress summary</Label><textarea id="progress-summary" name="court_progress" required className="min-h-24 w-full rounded border p-2" />
      <Label htmlFor="next-step">Next step / adjournment date</Label><Input id="next-step" name="next_step" required />
    </>}
    {action === "document" && <><Label htmlFor="document-title">Document title</Label><Input id="document-title" name="document_title" required /><Label htmlFor="document-type">Document type</Label><Input id="document-type" name="document_type" required placeholder="e.g. Court order" /></>}
    {["progress", "document"].includes(action) && <div className="space-y-2"><Label htmlFor="case-file">{action === "progress" ? "Supporting document (optional)" : "Document"}</Label><Input id="case-file" name="file" type="file" accept=".jpeg,.jpg,.png,.webp,.pdf,.doc,.docx,.xlsx" required={action === "document"} /><p className="text-sm text-gray-500">Images, PDF, Word or Excel. Maximum 10 MB.</p></div>}
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

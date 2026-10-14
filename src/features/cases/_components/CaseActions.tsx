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
import { casePermissions, caseReference, routeRoles, HEAD_ROLES, COORDINATOR_ROLES, type CaseRecord, type MovementCommand } from "../domain";
import { getAssignees, getRouteTargets, moveCase, postCaseDocument, postCaseProgress } from "../server/lifecycle";

type Action = MovementCommand["action"] | "progress" | "document";
const titles: Record<Action, string> = { route: "Route case", assign: "Assign lawyer", escalate: "Send back up the chain", "lawyer-reject": "Return assignment", accept: "Accept case", reject: "Reject case", "request-revision": "Request revision", status: "Update status", progress: "Add progress update", document: "Upload document" };

export default function CaseActions({ caseRecord, onChanged }: { caseRecord: CaseRecord; onChanged?: () => void }) {
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
      {actions.filter(a => a.allowed).map(a => <Button key={`${a.action}-${a.status ?? ""}`} variant="outline" onClick={() => setSelected(a)}>{a.label}</Button>)}
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
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const client = useQueryClient();
  const router = useRouter();
  const roles = action === "escalate" ? [...HEAD_ROLES, ...COORDINATOR_ROLES, "DIRECTOR GENERAL"].filter(r => routeRoles(r).includes(user?.role ?? "")) : routeRoles(user?.role ?? "");
  const picker = action === "assign" || action === "route" || action === "escalate";
  const targets = useQuery({
    queryKey: ["case-targets", user?.id, caseRecord.id, action, role, page, search],
    queryFn: () => action === "assign" ? getAssignees(caseRecord.id, page, search) : getRouteTargets(role, page, search),
    enabled: picker && (action === "assign" || !!role),
  });
  const candidates = targets.data?.success ? targets.data.data : undefined;
  const reasonRequired = ["escalate", "lawyer-reject", "reject", "request-revision"].includes(action) || (action === "assign" && !!caseRecord.assignment);
  const submit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        const file = formData.get("file");
        if (file instanceof File && file.size > 10 * 1024 * 1024) { setError("Choose a file smaller than 10 MB."); return; }
        const reason = String(formData.get("reason") ?? "").trim();
        if (reasonRequired && !reason) { setError("Please enter a reason."); return; }
        const result = action === "progress" ? await postCaseProgress(caseRecord.id, formData)
          : action === "document" ? await postCaseDocument(caseRecord.id, formData)
          : await moveCase(caseRecord.id, { action, status, reason: reason || undefined,
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
        <Label htmlFor="target-search">Search recipient</Label><Input id="target-search" value={keyword} placeholder="Search by name" onChange={e => { setKeyword(e.target.value); setPage(1); setTarget(""); }} />
        {targets.isLoading ? <p role="status">Loading recipients…</p> : targets.data && !targets.data.success ? <p role="alert" className="text-red-700">{targets.data.message}</p> : <div className="space-y-2">
          <Label htmlFor="case-target">{action === "assign" ? "Lawyer" : "Recipient"}</Label>
          <select id="case-target" required className="w-full rounded border p-2" value={target} disabled={pending} onChange={e => setTarget(e.target.value)}>
            <option value="">Choose recipient</option>
            {candidates?.data.filter(u => u.id !== user?.id).map(u => <option key={u.id} value={u.id}>{u.first_name} {u.last_name} · {u.user_type}{action === "assign" ? ` · ${u.open_cases ?? 0} open / ${u.max_load || "no set limit"}` : u.state ? ` · ${u.state}` : ""}</option>)}
          </select>
          {candidates?.data.length === 0 && <p className="text-sm text-gray-500">No eligible recipients found.</p>}
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
    {!["progress", "document", "accept"].includes(action) && <><Label htmlFor="movement-reason">Reason {reasonRequired ? "(required)" : "(optional)"}</Label><textarea id="movement-reason" name="reason" required={reasonRequired} className="min-h-24 w-full rounded border p-2" /></>}
    {action === "accept" && <p>The case will be accepted and ready for assignment.</p>}
    {action === "status" && <p>{status === "CLOSED" ? "Confirm that this completed case can be closed." : status === "COMPLETED" ? "Mark your work as completed. The assigning coordinator will close the case." : "Confirm that you are starting work on this case."}</p>}
    {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <Button type="submit" disabled={pending || (picker && (action === "assign" || action === "route" || !!role) && !target)} className="w-full">{pending ? "Saving…" : "Confirm"}</Button>
  </form>;
}

"use client";

import { useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createCentre, deactivateCentre, listCentres, listStateOptions, renameCentre } from "./server/centres";
import { coordinatorLabel, displayState, type Centre } from "./domain";

type Pending = { action: "add" } | { action: "rename"; centre: Centre } | { action: "deactivate"; centre: Centre } | null;

export default function Centres() {
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search, 300);
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<Pending>(null);

  const states = useQuery({ queryKey: ["organisation-states"], queryFn: listStateOptions, staleTime: 60000 });
  const centres = useQuery({
    queryKey: ["organisation-centres", page, debounced, state],
    queryFn: () => listCentres({ page, search: debounced, state }),
  });

  const stateOptions = states.data?.success ? [...states.data.data].sort((a, b) => a.title.localeCompare(b.title)) : [];
  const page_ = centres.data?.success ? centres.data.data : undefined;
  const rows = page_?.data ?? [];
  const refresh = () => {
    client.invalidateQueries({ queryKey: ["organisation-centres"] });
    // The pickers that offer centres read their own queries.
    client.invalidateQueries({ queryKey: ["InActivestates"] });
    client.invalidateQueries({ queryKey: ["centers"] });
  };

  return <div className="space-y-6">
    <header className="space-y-1">
      <h1 className="text-xl font-semibold">Centres</h1>
      <p className="text-sm text-gray-600">
        Add the centres each state runs, rename one, or deactivate a centre that has closed.
        A centre must exist before it can be given a Centre Coordinator, centre lawyers or paralegals.
      </p>
    </header>

    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label htmlFor="centre-search">Search</Label>
        <Input id="centre-search" value={search} placeholder="Centre or state name"
          onChange={e => { setSearch(e.target.value); setPage(1); }} className="sm:w-64" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="centre-state">State</Label>
        <select id="centre-state" className="h-10 w-full rounded border p-2 sm:w-56" value={state}
          onChange={e => { setState(e.target.value); setPage(1); }}>
          <option value="">All states</option>
          {stateOptions.map(s => <option key={s.id} value={s.id}>{displayState(s.title)}</option>)}
        </select>
      </div>
      <Button onClick={() => setPending({ action: "add" })} className="ml-auto">Add centre</Button>
    </div>

    {centres.isLoading ? <p role="status">Loading centres…</p>
      : centres.data && !centres.data.success ? <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{centres.data.message}</p>
      : rows.length === 0 ? <p className="rounded border p-6 text-center text-sm text-gray-600">
          {search || state ? "No centre matches that search." : "No centres yet. Add the first one with “Add centre”."}
        </p>
      : <div className="overflow-x-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr><th className="p-3">Centre</th><th className="p-3">State</th><th className="p-3">Coordinator</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {rows.map(centre => <tr key={centre.id} className="border-t">
                <td className="p-3 font-medium">{centre.title}</td>
                <td className="p-3">{displayState(centre.state_name || "—")}</td>
                <td className="p-3">{coordinatorLabel(centre)}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Button variant="outline" size="sm" onClick={() => setPending({ action: "rename", centre })}>Rename</Button>
                  <Button variant="outline" size="sm" className="ml-2" onClick={() => setPending({ action: "deactivate", centre })}>Deactivate</Button>
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>}

    {page_ && page_.total_pages > 1 && <div className="flex items-center gap-3">
      <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
      <span className="text-sm">Page {page_.page} of {page_.total_pages}</span>
      <Button variant="outline" disabled={page >= page_.total_pages} onClick={() => setPage(page + 1)}>Next</Button>
    </div>}

    <CentreDialog pending={pending} states={stateOptions} onClose={() => setPending(null)} onDone={refresh} />
  </div>;
}

function CentreDialog({ pending, states, onClose, onDone }: {
  pending: Pending;
  states: Array<{ id: string; title: string }>;
  onClose: () => void;
  onDone: () => void;
}) {
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();
  const title = pending?.action === "add" ? "Add centre"
    : pending?.action === "rename" ? "Rename centre"
    : pending?.action === "deactivate" ? "Deactivate centre" : "";

  const run = (formData: FormData) => {
    if (!pending) return;
    setError("");
    startTransition(async () => {
      const name = String(formData.get("title") ?? "").trim();
      const stateID = String(formData.get("state_id") ?? "");
      const result = pending.action === "add" ? await createCentre({ title: name, state_id: stateID })
        : pending.action === "rename" ? await renameCentre(pending.centre.id, name)
        : await deactivateCentre(pending.centre.id);
      if (!result.success) { setError(result.message); return; }
      toast.success(pending.action === "add" ? `${name} added.`
        : pending.action === "rename" ? `Renamed to ${name}.`
        : `${pending.centre.title} deactivated.`);
      onDone();
      onClose();
    });
  };

  return <Dialog open={!!pending} onOpenChange={open => { if (!open) { setError(""); onClose(); } }}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {pending?.action !== "add" && <DialogDescription>{pending?.action === "rename" || pending?.action === "deactivate" ? pending.centre.title : ""}</DialogDescription>}
      </DialogHeader>
      <form onSubmit={e => { e.preventDefault(); run(new FormData(e.currentTarget)); }} className="space-y-4">
        {pending?.action === "add" && <>
          <div className="space-y-1">
            <Label htmlFor="new-centre-name">Centre name</Label>
            <Input id="new-centre-name" name="title" required minLength={2} placeholder="e.g. Wuse Zone 2 Centre" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-centre-state">State</Label>
            <select id="new-centre-state" name="state_id" required defaultValue="" className="h-10 w-full rounded border p-2">
              <option value="" disabled>Select the state</option>
              {states.map(s => <option key={s.id} value={s.id}>{displayState(s.title)}</option>)}
            </select>
          </div>
        </>}
        {pending?.action === "rename" && <div className="space-y-1">
          <Label htmlFor="centre-name">Centre name</Label>
          <Input id="centre-name" name="title" required minLength={2} defaultValue={pending.centre.title} />
        </div>}
        {pending?.action === "deactivate" && <p className="text-sm text-gray-700">
          {pending.centre.title} will no longer be offered when creating coordinators, lawyers or paralegals,
          and no new case can be filed there. Cases already at this centre keep their history.
          {pending.centre.cordinatore_name?.trim() ? ` It still has a coordinator (${pending.centre.cordinatore_name}), who will need moving.` : ""}
        </p>}
        {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={busy} className="flex-1">
            {busy ? "Saving…" : pending?.action === "deactivate" ? "Deactivate" : "Save"}
          </Button>
          <Button type="button" variant="outline" disabled={busy} onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>;
}

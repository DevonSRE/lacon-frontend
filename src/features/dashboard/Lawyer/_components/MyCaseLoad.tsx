"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/hooks/redux";
import { caseLoadProblem, caseLoadLabel } from "@/lib/case-load";
import { setMyCaseLoad } from "../server/case-load";

/**
 * A lawyer's own maximum case load.
 *
 * It was fixed at whatever the account was created with — a pro bono lawyer's
 * answer on their application, often "1 case at a time" — so a lawyer who
 * could take more read as full to every head looking for someone to assign,
 * and had nowhere to say otherwise: not Home, not Cases, not My Letter
 * (QA 2026-11-16, row 72).
 *
 * It applies at once. The heads who assign read the account, so the Lawyers
 * list and the Assign lawyer list show it straight away.
 */
export default function MyCaseLoad() {
  const { data: user } = useAppSelector(state => state.profile);
  const client = useQueryClient();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [problem, setProblem] = useState("");
  const [shown, setShown] = useState<number | undefined>(undefined);

  // Only a lawyer carries one; a paralegal is never assigned a case.
  const isLawyer = user?.role === "LACON LAWYER" || user?.role === "PRO BONO LAWYER";
  if (!isLawyer) return null;

  // What the lawyer is shown. The profile in the store is loaded at sign-in,
  // so a change made here is kept locally rather than reading a stale limit.
  const current = shown ?? user?.max_load ?? 0;

  const save = () => {
    const said = caseLoadProblem(value);
    if (said) {
      setProblem(said);
      return;
    }
    setProblem("");
    startTransition(async () => {
      const answer = await setMyCaseLoad(value.trim());
      if (!answer.success) {
        setProblem(answer.message);
        return;
      }
      setShown(Number(value.trim()));
      toast.success(`Your case load is now ${caseLoadLabel(Number(value))}.`);
      setEditing(false);
      // The profile carries the limit, and so do the lists that read it.
      client.invalidateQueries({ queryKey: ["profile"] });
      client.invalidateQueries({ queryKey: ["getLaweyersManagement"] });
    });
  };

  return (
    <div className="rounded border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Cases you can carry at once</p>
          <p className="text-xl font-semibold">{caseLoadLabel(current)}</p>
        </div>
        {!editing && (
          <Button variant="outline" onClick={() => { setValue(String(current)); setEditing(true); setProblem(""); }}>
            Change
          </Button>
        )}
      </div>

      {editing && (
        <div className="mt-3 space-y-2">
          <Label htmlFor="my-case-load">Maximum cases at once</Label>
          <div className="flex flex-wrap items-start gap-2">
            <Input
              id="my-case-load"
              inputMode="numeric"
              className="w-28"
              value={value}
              disabled={pending}
              onChange={event => { setValue(event.target.value); setProblem(""); }}
            />
            <Button onClick={save} disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
            <Button variant="ghost" disabled={pending} onClick={() => { setEditing(false); setProblem(""); }}>
              Cancel
            </Button>
          </div>
          {problem
            ? <p role="alert" className="text-sm text-red-600">{problem}</p>
            : <p className="text-sm text-gray-500">
                It applies at once, and the offices that assign cases see it. Nought means no set limit.
              </p>}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { statusLabel } from "@/features/cases/domain";
import { roleLabel } from "@/lib/role-labels";
import { reasonProblem, topMatches, type DuplicateMatch } from "@/lib/duplicates";

/**
 * What the filer sees when this client already has a case (T10).
 *
 * It shows the match rather than describing it — reference, client, when, which
 * office, who filed it and its status — because the filer can only judge
 * whether it is the same matter from the particulars. Going ahead is allowed,
 * but it is recorded and it needs a reason in words.
 */
export default function DuplicateWarningDialog({
  open,
  matches,
  onCancel,
  onContinue,
}: {
  open: boolean;
  matches: DuplicateMatch[];
  onCancel: () => void;
  onContinue: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [problem, setProblem] = useState<string | undefined>(undefined);
  const shown = topMatches(matches);

  const close = () => {
    setReason("");
    setProblem(undefined);
    onCancel();
  };

  const proceed = () => {
    const found = reasonProblem(reason);
    setProblem(found);
    if (found) return;
    setReason("");
    onContinue(reason.trim());
  };

  return (
    <Dialog open={open} onOpenChange={next => { if (!next) close(); }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>This client already has a case</DialogTitle>
          <DialogDescription>
            {matches.length === 1
              ? "One earlier case was filed with the same email or phone number."
              : `${matches.length} earlier cases were filed with the same email or phone number.`}
            {matches.length > shown.length && ` Showing the ${shown.length} most recent.`}
            {" "}Check whether this is the same matter before you file again.
          </DialogDescription>
        </DialogHeader>

        <ul className="max-h-72 space-y-3 overflow-y-auto">
          {shown.map(match => (
            <li key={match.reference} className="rounded-md border border-gray-200 p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{match.reference}</span>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{statusLabel(match.status)}</span>
              </div>
              <p className="mt-1 text-gray-900">{match.client_name}</p>
              <p className="mt-1 text-xs text-gray-600">
                Filed {new Date(match.filed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                {match.filing_office && ` · ${match.filing_office}`}
              </p>
              {match.filed_by_name && (
                <p className="text-xs text-gray-600">
                  By {match.filed_by_name}
                  {match.filed_by_role && ` (${roleLabel(match.filed_by_role)})`}
                </p>
              )}
            </li>
          ))}
        </ul>

        <div>
          <label htmlFor="duplicate_reason" className="text-sm font-medium">
            If this is a different matter, say why
          </label>
          <Textarea
            id="duplicate_reason"
            value={reason}
            onChange={event => { setReason(event.target.value); setProblem(undefined); }}
            placeholder="e.g. same client, new landlord dispute unrelated to the 2025 case"
            className={problem ? "mt-1 border-red-500 bg-red-50" : "mt-1"}
          />
          {problem && <p className="mt-1 text-xs text-red-500">{problem}</p>}
          <p className="mt-1 text-xs text-gray-500">
            This is saved on the new case so a reviewer can see why it was filed.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={close}>
            Cancel, do not file
          </Button>
          <Button type="button" onClick={proceed}>
            File anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

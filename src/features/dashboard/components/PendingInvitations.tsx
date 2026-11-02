"use client";

import { useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { displayStateName } from "@/lib/place-names";
import { getPendingInvitations, resendInvitation, type PendingInvitation } from "@/features/usersRole/invitation-actions";

/**
 * Who the cases above are waiting for.
 *
 * Routing only ever picks an ACTIVE holder, so an office whose holder was
 * invited and never signed in is an office with nobody in it. Its cases are
 * filed unrouted and sit in "Cases waiting for someone to take them" — which
 * showed the cases and never the person, so there was no way to see that one
 * unaccepted invitation was the reason, nor who to chase
 * (QA 2026-11-01, item 20).
 */

// After this long, an unaccepted invitation is worth chasing rather than waiting on.
const CHASE_AFTER_DAYS = 7;

const waitedFor = (days: number) =>
  days <= 0 ? "Invited today" : days === 1 ? "Waiting 1 day" : `Waiting ${days} days`;

function Row({ row, onResent }: { row: PendingInvitation; onResent: () => void }) {
  const [pending, startTransition] = useTransition();
  const chase = row.invite_expired || row.days_waiting >= CHASE_AFTER_DAYS;
  const send = () => startTransition(async () => {
    const result = await resendInvitation(row.id);
    if (!result.success) {
      toast.error("The invitation was not sent.", { description: result.message });
      return;
    }
    toast.success(result.data, { description: `${row.name} will get a fresh link. The old one stops working.` });
    onResent();
  });

  return (
    <tr className="border-t align-top">
      <td className="p-3">
        <p className="font-medium">{row.name}</p>
        <p className="text-xs text-gray-500">{row.email}</p>
      </td>
      <td className="p-3">
        <p>{row.user_type}</p>
        {row.place && <p className="text-xs text-gray-500">{displayStateName(row.place)}</p>}
      </td>
      <td className="whitespace-nowrap p-3">
        <p className={chase ? "font-medium text-amber-700" : undefined}>{waitedFor(row.days_waiting)}</p>
        {row.invite_expired && <p className="text-xs text-red-700">Their link has expired</p>}
      </td>
      <td className="p-3">
        {row.cases_waiting > 0
          ? <span className="font-medium text-amber-700">
              {row.cases_waiting} {row.cases_waiting === 1 ? "case" : "cases"}
            </span>
          : <span className="text-gray-500">None yet</span>}
      </td>
      <td className="p-3">
        <Button type="button" variant="outline" disabled={pending} onClick={send}>
          {pending ? "Sending…" : "Send a new invitation"}
        </Button>
      </td>
    </tr>
  );
}

export default function PendingInvitations() {
  const { data: user } = useAppSelector(s => s.profile);
  const client = useQueryClient();
  const [dismissed, setDismissed] = useState(false);
  const invitations = useQuery({
    queryKey: ["pending-invitations", user?.id],
    queryFn: getPendingInvitations,
    enabled: !!user?.id,
    staleTime: 60000,
  });

  if (dismissed) return null;
  const rows: PendingInvitation[] = invitations.data?.success ? invitations.data.data : [];
  // Nothing to say when everyone invited has signed in.
  if (!invitations.isLoading && invitations.data?.success && rows.length === 0) return null;

  const holdingUpCases = rows.filter(r => r.cases_waiting > 0).length;
  const refresh = () => client.invalidateQueries({ queryKey: ["pending-invitations"] });

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Invited, not yet signed in ({rows.length})</h2>
        {invitations.data && !invitations.data.success && (
          <Button variant="outline" onClick={() => setDismissed(true)}>Hide</Button>
        )}
      </div>
      <p className="text-sm text-gray-500">
        {holdingUpCases > 0
          ? `Cases filed to an office are left with no holder until the person takes up their account. ${holdingUpCases === 1 ? "One office here is" : `${holdingUpCases} offices here are`} holding up the cases above.`
          : "No case is waiting on these accounts yet, but one filed into their office would be."}
      </p>

      {invitations.isLoading ? <p role="status" className="text-sm text-gray-500">Loading invitations…</p>
        : invitations.data && !invitations.data.success
          ? <p role="alert" className="text-sm text-red-600">{invitations.data.message}</p>
          : (
            <div className="overflow-x-auto rounded border bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50"><tr>
                  {["Who", "Office", "Since invited", "Cases waiting", "Action"].map(label => (
                    <th key={label} className="whitespace-nowrap p-3 font-medium">{label}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {rows.map(row => <Row key={row.id} row={row} onResent={refresh} />)}
                </tbody>
              </table>
            </div>
          )}
    </section>
  );
}

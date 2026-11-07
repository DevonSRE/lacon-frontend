"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadAcknowledgement, downloadCase } from "../server/lifecycle";

/**
 * A copy of the case record, for anyone who can open the case (T7).
 *
 * The API decides who may take one and records who did, because the record
 * carries the client's details. The bytes come back base64-encoded, which is
 * how they survive the server-action boundary intact.
 */
/** What is being taken: the full record, or the client's receipt. */
type Copy = "case" | "acknowledgement";

const LABELS: Record<Copy, string> = {
  case: "Download case",
  acknowledgement: "Print acknowledgement",
};

export default function DownloadCase({
  caseId,
  reference,
  copy = "case",
}: { caseId: string; reference: string; copy?: Copy }) {
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const take = () => {
    setBusy(true);
    startTransition(async () => {
      const result = copy === "acknowledgement"
        ? await downloadAcknowledgement(caseId)
        : await downloadCase(caseId);
      setBusy(false);
      if (!result.success) {
        toast.error(copy === "acknowledgement" ? "The acknowledgement could not be printed." : "The case could not be downloaded.", { description: result.message });
        return;
      }
      const bytes = Uint8Array.from(atob(result.data), char => char.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: result.contentType }));
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename || `${reference}${copy === "acknowledgement" ? "-acknowledgement" : ""}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Button type="button" variant="outline" disabled={pending || busy} onClick={take}>
      {busy ? "Preparing…" : LABELS[copy]}
    </Button>
  );
}

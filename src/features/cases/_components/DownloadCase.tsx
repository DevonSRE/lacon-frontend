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
      const filename = result.filename || `${reference}${copy === "acknowledgement" ? "-acknowledgement" : ""}.pdf`;

      const save = () => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      // "Print acknowledgement" prints. It used to download in the background,
      // so the paralegal saw nothing happen and had no page to hand over
      // (QA 2026-11-16, row 43). The print dialog is opened from an iframe on
      // this page, which no pop-up blocker stops, and the copy stays one click
      // away in case printing is blocked or cancelled.
      if (copy === "acknowledgement") {
        const frame = document.createElement("iframe");
        frame.setAttribute("aria-hidden", "true");
        frame.style.position = "fixed";
        frame.style.width = "0";
        frame.style.height = "0";
        frame.style.border = "0";
        frame.src = url;
        frame.onload = () => {
          try {
            frame.contentWindow?.focus();
            frame.contentWindow?.print();
          } catch {
            save();
          }
        };
        document.body.appendChild(frame);
        toast.success("The acknowledgement is ready to print.", {
          description: "Use your printer's dialog, or save it as a PDF.",
          action: { label: "Save a copy", onClick: save },
        });
        // Long enough for the dialog to take the document, then tidy up.
        window.setTimeout(() => {
          frame.remove();
          URL.revokeObjectURL(url);
        }, 60_000);
        return;
      }

      save();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Button type="button" variant="outline" disabled={pending || busy} onClick={take}>
      {busy ? "Preparing…" : LABELS[copy]}
    </Button>
  );
}

"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { exportCases } from "../server/lifecycle";
import type { CaseFilters } from "../domain";

/**
 * The case list as a spreadsheet (T17).
 *
 * It takes the filters the list is showing, so what downloads is what is on
 * screen — not every case the reader could reach. The API scopes it the same
 * way it scopes the list.
 */
export default function ExportCases({ filters }: { filters: CaseFilters }) {
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const take = () => {
    setBusy(true);
    startTransition(async () => {
      const result = await exportCases({ ...filters, page: undefined, size: undefined });
      setBusy(false);
      if (!result.success) {
        toast.error("The cases could not be exported.", { description: result.message });
        return;
      }
      const bytes = Uint8Array.from(atob(result.data), char => char.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: result.contentType }));
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename || "LACON-cases.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Button type="button" variant="outline" disabled={pending || busy} onClick={take}>
      {busy ? "Preparing…" : "Export to Excel"}
    </Button>
  );
}

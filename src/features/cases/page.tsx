"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CaseList from "./_components/CaseList";

/**
 * The case list, opened at whatever the link asked for.
 *
 * A figure on the report links here carrying the filters it was counted with
 * (T3, criterion 4), so the list shows exactly what the figure counted. The key
 * restarts the list when the link changes, which is how the filters below start
 * from the URL rather than from the last thing the reader picked.
 */
function CaseSearch() {
  const params = useSearchParams();
  const opening = {
    search: params.get("search") ?? "",
    state: params.get("state") ?? "all",
    offence: params.get("offence") ?? "",
    sex: params.get("sex") ?? "",
    ageMin: params.get("age_min") ?? "",
    ageMax: params.get("age_max") ?? "",
    status: params.get("status") ?? "all",
    caseType: params.get("case_type") ?? "all",
  };
  return <CaseList key={params.toString()} opening={opening} />;
}
export default function CasesPage() {
  return <Suspense fallback={<p>Loading cases…</p>}><CaseSearch /></Suspense>;
}

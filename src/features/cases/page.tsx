"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CaseList from "./_components/CaseList";

function CaseSearch() {
  const params = useSearchParams();
  const search = params.get("search") ?? "";
  return <CaseList key={search} initialSearch={search} />;
}
export default function CasesPage() {
  return <Suspense fallback={<p>Loading cases…</p>}><CaseSearch /></Suspense>;
}

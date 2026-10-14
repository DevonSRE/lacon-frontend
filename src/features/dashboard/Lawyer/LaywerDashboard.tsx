"use client";

import CaseList from "@/features/cases/_components/CaseList";
import MediationCase from "./_components/menu/MediationCase";
import LawyerUpcomingEvents from "./_components/LawyerUpcomingEvents";

export default function LawyerDashboard({ role }: { role: string }) {
  return role === "EXTERNAL PARALEGAL" ? <MediationCase /> : <><CaseList title="Assigned cases" /><LawyerUpcomingEvents /></>;
}

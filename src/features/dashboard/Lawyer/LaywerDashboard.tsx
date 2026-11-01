"use client";

import MediationCase from "./_components/menu/MediationCase";
import LawyerHome from "./_components/LawyerHome";

export default function LawyerDashboard({ role }: { role: string }) {
  return role === "EXTERNAL PARALEGAL" ? <MediationCase /> : <LawyerHome />;
}

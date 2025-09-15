 'use client';

import CasesPage from "@/features/cases/page";
import { useAppSelector } from "@/hooks/redux";
import { ROLES } from "@/types/auth";
import InternalCasesPage from "../cases/internal_cases_page";

export default function CasesPageMain() {
  const { data: user } = useAppSelector((state) => state.profile);
  const role = user?.role;

//   if (role === ROLES.INTERNAL_PARALEGAL) {
//     return <InternalCasesPage />;
//   }

return (
  <h1 > AWEOSLE </h1>
);

//   return <CasesPage />;
}

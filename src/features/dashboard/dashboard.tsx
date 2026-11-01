'use client';
import React from "react";
import AdminDashboardSkeleton from "@/components/skeleton/dashboard";
import LawyerDashboard from "./Lawyer/LaywerDashboard";
import { ROLES } from "@/types/auth";
import { useAppSelector } from "@/hooks/redux";

import UnitHeadDashboard from "./UnitHeadDashboard";
import AdminDashboard from "./AdminDashboard";
import CaseList from "@/features/cases/_components/CaseList";
import CoordinatorHome, { COORDINATOR_HOME_ROLES } from "./Coordinator/CoordinatorHome";



export default function Dashboard() {
    const { data: user } = useAppSelector((state) => state.profile);
    const role = user?.role;

    // A coordinator's home was the Cases page itself (QA 2026-11-01, item 25).
    if (role && COORDINATOR_HOME_ROLES.includes(role)) {
        return <CoordinatorHome role={role} />;
    }

    // An internal paralegal files cases and follows the ones they filed; there is
    // nothing for them to summarise, so their home stays the list.
    if (role === ROLES.INTERNAL_PARALEGAL) {
        return <CaseList title="Filed cases" />;
    }

    // Platform Admin / Director roles
    if (role === ROLES.ADMIN || role === ROLES.PLATFORM_ADMIN || role === ROLES.DIRECTOR_GENERAL) {
        return <AdminDashboard role={role} />;
    }

    if (role === ROLES.DECONGESTION_UNIT_HEAD || role === ROLES.PDSS ||
        role === ROLES.CIVIL_JUSTICE_DEPT || role === ROLES.CRIMINAL_JUSTICE_DEPT ||
        role === ROLES.OSCAR_UNIT_HEAD || role === ROLES.PREROGATIVE_OF_MERCY_UNIT_HEAD || role === ROLES.DIO) {
        return (<UnitHeadDashboard role={role} />);
    }

    // Lawyers
    if (role === ROLES.PRO_BONO_LAWYER || role === ROLES.LACON_LAWYER || role === ROLES.EXTERNAL_PARALEGAL) {
        return <LawyerDashboard role={role} />;
    }

    // Default fallback
    return <AdminDashboardSkeleton />;
}

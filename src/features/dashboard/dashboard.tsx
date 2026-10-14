'use client';
import React from "react";
import AdminDashboardSkeleton from "@/components/skeleton/dashboard";
import LawyerDashboard from "./Lawyer/LaywerDashboard";
import { ROLES } from "@/types/auth";
import { useAppSelector } from "@/hooks/redux";

import UnitHeadDashboard from "./UnitHeadDashboard";
import AdminDashboard from "./AdminDashboard";
import CaseList from "@/features/cases/_components/CaseList";



export default function Dashboard() {
    const { data: user } = useAppSelector((state) => state.profile);
    const role = user?.role;

    if (role === ROLES.ZONAL_DIRECTOR || role === ROLES.STATE_COORDINATOR || role === ROLES.CENTRE_COORDINATOR || role === ROLES.INTERNAL_PARALEGAL) {
        return <CaseList title={role === ROLES.INTERNAL_PARALEGAL ? "Filed cases" : "Case queue"} />;
    }

    // Platform Admin / Director roles
    if (role === ROLES.ADMIN || role === ROLES.PLATFORM_ADMIN || role === ROLES.DIRECTOR_GENERAL) {
        return <AdminDashboard role={role} />;
    }

    // if (role === ROLES.STATE_COORDINATOR) {
    //     return <StateCordinatorDashboard role={role} />;
    // }

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

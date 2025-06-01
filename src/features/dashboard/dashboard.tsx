'use client';
import React, { useState } from "react";
import AdminDashboardSkeleton from "@/components/skeleton/dashboard";
import { Plus } from "lucide-react";
import DashboardStats from "./components/DashboardStats";
import CaseDistributionChart from "./components/CaseDistributionChart";
import CaseAssignmentPage from "./components/CaseAssignmentTable";
import PdssDashboard from "./components/pdss";
import CreateUserRole from "./components/createUserRole";
import LawyerDashboard from "./Lawyer/LaywerDashboard";
import Intro from "@/components/Intro";
import { ROLES } from "@/types/auth"; // assuming this enum is available
import { useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import { AddUserSheet } from "../component/AddUserSheet";
import { useAction } from "@/context/ActionContext";



export default function Dashboard() {
    const { setIsOpen } = useAction();

    const { data: user } = useAppSelector((state) => state.profile);
    const role = user?.role;

    // PDSS / Paralegal
    if (role === ROLES.PARALEGAL || role === ROLES.CENTRE_COORDINATOR) {
        return <PdssDashboard />;
    }

    // Lawyers
    if (role === ROLES.PRO_BONO_LAWYER || role === ROLES.LAWYER) {
        return <LawyerDashboard />;
    }

    // Platform Admin / Director roles
    if (
        role === ROLES.ADMIN ||
        role === ROLES.PLATFORM_ADMIN ||
        role === ROLES.DIRECTOR_GENERAL ||
        role === ROLES.ZONAL_DIRECTOR ||
        role === ROLES.STATE_COORDINATOR
    ) {
        return (
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <Intro user="Admin" />
                        <Button onClick={() => setIsOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <Plus size={20} />
                            New
                        </Button>
                    </div>
                    <DashboardStats />
                    <CaseAssignmentPage />
                    <CaseDistributionChart />
                </div>
                <CreateUserRole />
                <AddUserSheet />

            </div>
        );
    }

    // Default fallback
    return <AdminDashboardSkeleton />;
}

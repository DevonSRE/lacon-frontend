'use client';
import React, { useState } from "react";
import AdminDashboardSkeleton from "@/components/skeleton/dashboard";
import { CircleFadingArrowUp, CirclePlus, CloudUpload, Plus } from "lucide-react";
import DashboardStats from "./components/DashboardStats";
import CaseDistributionChart from "./components/CaseDistributionChart";
import CaseAssignmentPage from "./components/CaseAssignmentTable";
import PdssDashboard from "./components/pdss";
import LawyerDashboard from "./Lawyer/LaywerDashboard";
import Intro from "@/components/Intro";
import { ROLES } from "@/types/auth"; // assuming this enum is available
import { useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import { AddUserSheet } from "../component/AddUserSheet";
import { useAction } from "@/context/ActionContext";
import CivilCriminalDashboard from "./CivilCriminalDashboard";



export default function Dashboard() {
    const { setIsOpen } = useAction();

    const { data: user } = useAppSelector((state) => state.profile);
    const role = user?.role;



    // Lawyers
    if (role === ROLES.PRO_BONO_LAWYER || role === ROLES.LACON_LAWYER) {
        return <>
            <LawyerDashboard user={user?.first_name ?? "LAWYER"} />
        </>
    }

    // Platform Admin / Director roles
    if (role === ROLES.ADMIN || role === ROLES.PLATFORM_ADMIN || role === ROLES.DIRECTOR_GENERAL
        || role === ROLES.ZONAL_DIRECTOR || role === ROLES.STATE_COORDINATOR || role === ROLES.CENTRE_COORDINATOR) {
        return (
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6">
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
                {/* <CreateUserRole /> */}
                <AddUserSheet />
            </div>
        );
    }

    if (role === ROLES.DECONGESTION_UNIT_HEAD || role === ROLES.PARALEGAL || role === ROLES.PDSS || role === ROLES.CIVIL_JUSTICE_DEPT || role === ROLES.CRIMINAL_JUSTICE_DEPT || role === ROLES.OSCAR_UNIT_HEAD) {
        return (<CivilCriminalDashboard />);
    }

    // Default fallback
    return <AdminDashboardSkeleton />;
}
